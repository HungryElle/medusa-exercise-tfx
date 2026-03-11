import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { PRINT_ORDER_MODULE } from "../../../../../modules/print-order"

export const POST = async (
    req: AuthenticatedMedusaRequest,
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
