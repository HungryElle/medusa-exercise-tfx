import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { payloadSyncStep } from "./steps/payload-sync"

export type PayloadSyncWorkflowInput = {
    design_id: string
    payload_id: string
    name: string
    description?: string
    slug: string
    tags: string[]
    designer_credit?: string
    operation: "create" | "update" | "delete"
}

export const payloadSyncWorkflow = createWorkflow(
    "payload-sync",
    (input: PayloadSyncWorkflowInput) => {
        const design = payloadSyncStep(input)

        return new WorkflowResponse(design)
    }
)