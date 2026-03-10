import {
    MedusaRequest,
    MedusaResponse,
    AuthenticatedMedusaRequest
} from "@medusajs/framework/http"

import { z } from "@medusajs/framework/zod"
import { CreatePartnerSchema } from "./validator"
import { createPartnerWorkflow } from "../../../workflows/partner/create-partner"

export const POST = async (
    req: AuthenticatedMedusaRequest<z.infer<typeof CreatePartnerSchema>>,
    res: MedusaResponse
) => {
    const { result } = await createPartnerWorkflow(req.scope)
        .run({
            input: {
                ...req.validatedBody,
            },
        })

    res.json({ partner: result })
}

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "partner",
        ...req.queryConfig,
    })

    res.json({ partner: data })
}