import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createDesignStep } from "./steps/create-design"

type CreateDesignWorkflowInput = {
    name: string
    description?: string
    tags: string[]
    slug: string
}

export const createDesignWorkflow = createWorkflow(
    "create-design",
    (input: CreateDesignWorkflowInput) => {
        const design = createDesignStep(input)

        return new WorkflowResponse(design)
    }
)