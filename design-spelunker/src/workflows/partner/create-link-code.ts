import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createPartnerLinkCodeStep } from "./steps/create-link-code"

type CreatePartnerLinkCodeWorkflowInput = {
    partner_id: string
}

export const createPartnerLinkCodeWorkflow = createWorkflow(
    "create-link-code-partner",
    (input: CreatePartnerLinkCodeWorkflowInput) => {
        const partner = createPartnerLinkCodeStep(input)

        return new WorkflowResponse(partner)
    }
)