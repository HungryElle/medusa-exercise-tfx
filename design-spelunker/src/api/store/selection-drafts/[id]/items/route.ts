import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

import { AddItemToDraftSchema } from "../../validators"
import { addItemToDraftWorkflow } from "../../../../../workflows/print-order/add-item-to-draft"
import { DESIGN_MODULE } from "../../../../../modules/design"
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (
    req: MedusaRequest<AddItemToDraftSchema>,
    res: MedusaResponse
) => {
    const design_id_exists = await req.scope.resolve(DESIGN_MODULE).listDesigns({ id: [req.validatedBody.design_id] })

    if (design_id_exists.length === 0) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Design not found")
    }

    const query = req.scope.resolve("query")

    const { data: existing } = await query.graph({
        entity: "selection_item",
        fields: ["draft_id", "design_id", "colorway_id"],
        filters: {
            draft_id: { id: req.params.id },
            design_id: req.validatedBody.design_id,
            colorway_id: req.validatedBody.colorway_id
        },
    })

    if (existing.length) {
        throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "Item already exists in draft"
        )
    }

    const { result } = await addItemToDraftWorkflow(req.scope)
        .run({
            input: {
                draft_id: req.params.id,
                design_id: req.validatedBody.design_id,
                colorway_id: req.validatedBody.colorway_id,
                quantity: req.validatedBody.quantity,
                notes: req.validatedBody.notes,
            },
        })

    res.json({ draft: result })
}
