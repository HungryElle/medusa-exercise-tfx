import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { addItemToDraftStep } from "./steps/add-item-to-draft"

type AddItemToDraftWorkflowInput = {
    draft_id: string
    design_id: string
    colorway_id: string
    quantity?: number
    notes?: string
}

export const addItemToDraftWorkflow = createWorkflow(
    "add-item-to-draft",
    (input: AddItemToDraftWorkflowInput) => {
        const draft = addItemToDraftStep(input)

        return new WorkflowResponse(draft)
    }
)