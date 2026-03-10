import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { updateDesignCreditStep } from "./steps/update-design-credit"

type UpdateDesignCreditWorkflowInput = {
    id: string
    designer_credit: string
}

export const updateDesignCreditWorkflow = createWorkflow(
    "update-design-credit",
    ({ id, designer_credit }: UpdateDesignCreditWorkflowInput) => {
        const updatedDesign = updateDesignCreditStep({
            id,
            designer_credit,
        })

        return new WorkflowResponse(updatedDesign)
    }
)