import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import DesignModuleService from "../../../modules/design/service"
import { DESIGN_MODULE } from "../../../modules/design/"

export interface UpdateDesignCreditInput {
    id: string
    designer_credit: string
}

export const updateDesignCreditStep = createStep(
    "update-design-credit",
    async ({ id, designer_credit }: UpdateDesignCreditInput, { container }) => {
        const designModuleService: DesignModuleService =
            container.resolve(DESIGN_MODULE)

        const existingDesign = await designModuleService.retrieveDesign(id)
        const updatedDesign = await designModuleService.updateDesigns({
            id: id,
            designer_credit: designer_credit,
        })

        return new StepResponse(updatedDesign, existingDesign)
    },
    async (existingDesign, { container }) => {
        if (!existingDesign) {
            return
        }

        const designModuleService: DesignModuleService =
            container.resolve(DESIGN_MODULE)

        await designModuleService.updateDesigns({
            id: existingDesign.id,
            designer_credit: existingDesign.designer_credit,
        })
    }

)
