import {
    MedusaRequest,
    MedusaResponse,
    AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { createPartnerLinkCodeWorkflow } from "../../../../../workflows/partner/create-link-code"
import { SATELLITE_MODULE } from "../../../../../modules/satellite"
import { MedusaError } from "@medusajs/framework/utils"
import { CreatePartnerLinkCodeSchema } from "../../../partner/validator"
import { z } from "@medusajs/framework/zod"

export const POST = async (
    req: AuthenticatedMedusaRequest<z.infer<typeof CreatePartnerLinkCodeSchema>>,
    res: MedusaResponse
) => {
    const satelliteService: any = req.scope.resolve(SATELLITE_MODULE)
    const partner = await satelliteService.retrievePartner(req.params.id)

    if (partner.link_code && partner.link_code_expires_at && new Date(partner.link_code_expires_at) > new Date()) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Partner already has a valid link code")
    }

    const { result } = await createPartnerLinkCodeWorkflow(req.scope)
        .run({
            input: {
                partner_id: req.params.id,
            },
        })

    res.json({ partner: result })
}
