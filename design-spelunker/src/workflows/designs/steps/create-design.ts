import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { DESIGN_MODULE } from "../../../modules/design"
import DesignModuleService from "../../../modules/design/service"

export type CreateDesignStepInput = {
    name: string
    description?: string
    tags: string[]
    slug: string
}

export const createDesignStep = createStep(
    "create-design-step",
    async (input: CreateDesignStepInput, { container }) => {
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )

        const design = await designModuleService.createDesigns(input)
        const createdDesign = Array.isArray(design) ? design[0] : design

        return new StepResponse(createdDesign, createdDesign.id)
    },
    async (id: string, { container }) => {
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )

        await designModuleService.deleteDesigns(id)
    }

)