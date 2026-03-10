import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { updateSelectionDraftWorkflow } from "../../../../workflows/print-order/update-selection-draft"
import { z } from "@medusajs/framework/zod"
import { UpdateDraftSchema } from "../validators"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { PRINT_ORDER_MODULE } from "../../../../modules/print-order"

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

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const printOrderModuleService = req.scope.resolve(PRINT_ORDER_MODULE)
    const eventModuleService = req.scope.resolve(Modules.EVENT_BUS)

    const draft = await printOrderModuleService.retrieveSelectionDraft(req.params.id)

    if (draft.status === "forwarded") {
        throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Draft ${req.params.id} has already been forwarded.`
        )
    }

    await eventModuleService.emit({
        name: "selection-draft.forwarded",
        data: {
            id: req.params.id,
        },
    }).then(() => {
        res.json({ message: "Forward selection draft triggered" })
    }).catch((error) => {
        console.error("Failed to forward selection draft:", error)
        throw new MedusaError(MedusaError.Types.DB_ERROR, "Failed to forward selection draft")
    })
}
