import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { forwardSelectionDraftStep } from "./steps/forward-selection-draft-step"

export interface ForwardSelectionDraftWorkflowInput {
    id: string
}

export const forwardSelectionDraftWorkflow = createWorkflow(
    "forward-selection-draft-workflow",
    (input: ForwardSelectionDraftWorkflowInput) => {
        const result = forwardSelectionDraftStep(input.id)

        return new WorkflowResponse(result)
    }
)
