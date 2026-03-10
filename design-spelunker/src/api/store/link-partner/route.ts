import {
    MedusaResponse,
    AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { createCustomerLinkWorkflow } from "../../../workflows/partner/create-customer-link"
import { SATELLITE_MODULE } from "../../../modules/satellite"
import { MedusaError } from "@medusajs/framework/utils"
import { LinkPartnerSchema } from "./validator"
import { z } from "@medusajs/framework/zod"

export const POST = async (
    req: AuthenticatedMedusaRequest<z.infer<typeof LinkPartnerSchema>>,
    res: MedusaResponse
) => {
    const customerId = req.auth_context?.actor_id as string

    if (!customerId) {
        throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Customer not authenticated")
    }

    console.log(customerId)
    const satelliteService: any = req.scope.resolve(SATELLITE_MODULE)

    // 1. Find the partner by their unique link_code
    const partners = await satelliteService.listPartners({
        link_code: req.body.code,
    })

    if (partners.length === 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid link code")
    }

    const partner = partners[0]

    // 2. Check if the code has expired
    if (!partner.link_code_expires_at || new Date(partner.link_code_expires_at) < new Date()) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Link code has expired")
    }

    // 3. Check if the customer is already linked to this specific partner
    const existingLinks = await satelliteService.listCustomerPartnerLinks({
        customer_id: customerId,
        partner_id: partner.id,
    })

    if (existingLinks.length > 0) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Customer is already linked to this partner")
    }

    // 4. Create the new link
    const { result } = await createCustomerLinkWorkflow(req.scope)
        .run({
            input: {
                partner_id: partner.id,
                customer_id: customerId,
            },
        })

    res.json({ link: result })
}
