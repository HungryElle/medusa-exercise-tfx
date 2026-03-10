import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createCustomerLinkStep } from "./steps/create-customer-link"

type CreateCustomerLinkWorkflowInput = {
    partner_id: string
    customer_id: string
}

export const createCustomerLinkWorkflow = createWorkflow(
    "create-customer-link",
    (input: CreateCustomerLinkWorkflowInput) => {
        const customerLink = createCustomerLinkStep(input)

        return new WorkflowResponse(customerLink)
    }
)