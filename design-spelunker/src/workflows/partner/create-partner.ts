import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createPartnerStep } from "./steps/create-partner"

type CreatePartnerWorkflowInput = {
    name: string
    email: string
}

export const createPartnerWorkflow = createWorkflow(
    "create-partner",
    (input: CreatePartnerWorkflowInput) => {
        const partner = createPartnerStep(input)

        return new WorkflowResponse(partner)
    }
)