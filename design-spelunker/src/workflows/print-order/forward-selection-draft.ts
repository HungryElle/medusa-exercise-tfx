import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import {
    validateDraftStep, reserveDesignFilesStep,
    sendPartnerEmailStep, updateDraftStatusStep
} from "./steps/forward-selection-draft-step"

export interface ForwardSelectionDraftWorkflowInput {
    id: string
}

export const forwardSelectionDraftWorkflow = createWorkflow(
    "forward-selection-draft-workflow",
    (input: ForwardSelectionDraftWorkflowInput) => {
        const validate = validateDraftStep(input.id)
        const reserved = reserveDesignFilesStep(validate.id)
        const send_email = sendPartnerEmailStep(reserved.id)
        const update_status = updateDraftStatusStep(send_email.id)

        return new WorkflowResponse(update_status)
    }
)
