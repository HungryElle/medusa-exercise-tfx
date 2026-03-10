import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

import { z } from "@medusajs/framework/zod"
import { CreateDraftSchema, UpdateDraftSchema } from "./validators"
import { createSelectionDraftWorkflow } from "../../../workflows/print-order/create-selection-draft"

export const POST = async (
    req: MedusaRequest<z.infer<typeof CreateDraftSchema>>,
    res: MedusaResponse
) => {
    const { result } = await createSelectionDraftWorkflow(req.scope)
        .run({
            input: {
                ...req.validatedBody,
                status: "draft",
            },
        })

    res.json({ draft: result })
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "selection_draft",
        ...req.queryConfig,
    })

    res.json({ draft: data })
}
