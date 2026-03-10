import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import PrintOrderModuleService from "../../../modules/print-order/service"
import { PRINT_ORDER_MODULE } from "../../../modules/print-order/"

export interface UpdateSelectionDraftInput {
    id: string
    notes?: string
}

export const updateSelectionDraftStep = createStep(
    "update-selection-draft",
    async ({ id, notes }: UpdateSelectionDraftInput, { container }) => {
        const printOrderModuleService: PrintOrderModuleService =
            container.resolve(PRINT_ORDER_MODULE)

        const existingSelectionDraft = await printOrderModuleService.retrieveSelectionDraft(id)
        const updatedSelectionDraft = await printOrderModuleService.updateSelectionDrafts({
            id: id,
            notes: notes,
        })

        return new StepResponse(updatedSelectionDraft, existingSelectionDraft)
    },
    async (existingSelectionDraft, { container }) => {
        if (!existingSelectionDraft) {
            return
        }

        const printOrderModuleService: PrintOrderModuleService =
            container.resolve(PRINT_ORDER_MODULE)

        await printOrderModuleService.updateSelectionDrafts({
            id: existingSelectionDraft.id,
            notes: existingSelectionDraft.notes,
        })
    }

)
