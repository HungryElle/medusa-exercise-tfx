import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createDraftStep } from "./steps/create-selection-draft"

type CreateSelectionDraftWorkflowInput = {
    customer_id: string
    partner_id?: string
    status: "draft" | "forwarded" | "completed"
    notes?: string
}

export const createSelectionDraftWorkflow = createWorkflow(
    "create-selection-draft",
    (input: CreateSelectionDraftWorkflowInput) => {
        const draft = createDraftStep(input)

        return new WorkflowResponse(draft)
    }
)