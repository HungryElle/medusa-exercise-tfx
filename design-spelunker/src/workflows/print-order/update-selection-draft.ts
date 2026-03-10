import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateSelectionDraftStep } from "./steps/update-selection-draft"

type UpdateSelectionDraftWorkflowInput = {
    id: string
    notes?: string
}

export const updateSelectionDraftWorkflow = createWorkflow(
    "update-selection-draft",
    ({ id, notes }: UpdateSelectionDraftWorkflowInput) => {
        const updatedSelectionDraft = updateSelectionDraftStep({
            id,
            notes,
        })

        return new WorkflowResponse(updatedSelectionDraft)
    }
)