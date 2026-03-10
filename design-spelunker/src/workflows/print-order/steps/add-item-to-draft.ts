import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { PRINT_ORDER_MODULE } from "../../../modules/print-order"
import PrintOrderModuleService from "../../../modules/print-order/service"

export type AddItemToDraftStepInput = {
    draft_id: string
    design_id: string
    colorway_id: string
    quantity?: number
    notes?: string
}

export const addItemToDraftStep = createStep(
    "add-item-to-draft-step",
    async (input: AddItemToDraftStepInput, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        const draft = await printOrderModuleService.createSelectionItems(input)
        const createdDraft = Array.isArray(draft) ? draft[0] : draft

        return new StepResponse(createdDraft, createdDraft.id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        await printOrderModuleService.deleteSelectionItems(id)
    }

)