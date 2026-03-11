import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { updateSelectionDraftWorkflow } from "../../../../workflows/print-order/update-selection-draft"
import { z } from "@medusajs/framework/zod"
import { UpdateDraftSchema } from "../validators"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "selection_item",
        ...req.queryConfig,
        filters: {
            draft_id: {
                id: req.params.id,
            },
        }
    })

    res.json({ items: data })
}

export const PATCH = async (
    req: MedusaRequest<z.infer<typeof UpdateDraftSchema>>,
    res: MedusaResponse
) => {
    const { result } = await updateSelectionDraftWorkflow(req.scope)
        .run({
            input: {
                id: req.params.id,
                notes: req.validatedBody.notes,
            }
        })

    res.json({ draft: result })
}
