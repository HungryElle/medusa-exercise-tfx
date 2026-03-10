import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRINT_ORDER_MODULE } from "../../../modules/print-order"
import PrintOrderModuleService from "../../../modules/print-order/service"

export const forwardSelectionDraftStep = createStep(
    "forward-selection-draft-step",
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        const updated = await printOrderModuleService.forwardDraft(id)

        return new StepResponse(updated, id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        // Compensation: revert status back to draft if needed
        await printOrderModuleService.updateSelectionDrafts({
            id: id,
            status: "draft"
        })

        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: new Date(),
        }))
    }
)
