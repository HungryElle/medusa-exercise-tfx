import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { PRINT_ORDER_MODULE } from "../../../modules/print-order"
import PrintOrderModuleService from "../../../modules/print-order/service"

export type CreateSelectionDraftStepInput = {
    customer_id: string
    partner_id?: string
    status: "draft" | "forwarded" | "completed"
    notes?: string
}

export const createDraftStep = createStep(
    "create-draft-step",
    async (input: CreateSelectionDraftStepInput, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        const draft = await printOrderModuleService.createSelectionDrafts(input)
        const createdDraft = Array.isArray(draft) ? draft[0] : draft

        return new StepResponse(createdDraft, createdDraft.id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        await printOrderModuleService.deleteSelectionDrafts(id)
    }

)