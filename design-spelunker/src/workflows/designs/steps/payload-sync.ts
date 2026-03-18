import DesignModuleService from "../../../modules/design/service"
import { DESIGN_MODULE } from "../../../modules/design"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type PayloadSyncStepInput = {
    design_id?: string
    payload_id: string
    name: string
    description?: string
    slug: string
    tags: string[]
    designer_credit?: string
    operation: "create" | "update" | "delete"
}

export const payloadSyncStep = createStep(
    "payload-sync-step",
    async (input: PayloadSyncStepInput, { container }) => {
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )

        if (input.operation === "update") {
            if (input.design_id) {
                console.log("Updating design", input.design_id)
                const updated = await designModuleService.updateDesigns({
                    id: input.design_id,
                    payload_id: input.payload_id,
                    name: input.name,
                    description: input.description,
                    slug: input.slug,
                    tags: input.tags,
                    designer_credit: input.designer_credit,
                })
                return new StepResponse(updated, input)
            }

            console.log("Creating design", input.name)
            const created = await designModuleService.createDesigns({
                payload_id: input.payload_id,
                name: input.name,
                description: input.description,
                slug: input.slug,
                tags: input.tags,
                designer_credit: input.designer_credit,
            })
            return new StepResponse(created, input)
        }

        return new StepResponse(null, input)
    }
)