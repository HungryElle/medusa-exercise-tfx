import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { SATELLITE_MODULE } from "../../../modules/satellite"
import SatelliteModuleService from "../../../modules/satellite/service"

export type CreatePartnerStepInput = {
    name: string
    email: string
}

export const createPartnerStep = createStep(
    "create-partner-step",
    async (input: CreatePartnerStepInput, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        const partner = await satelliteModuleService.createPartners(input)

        return new StepResponse(partner, partner.id)
    },
    async (id: string, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        await satelliteModuleService.deletePartners(id)
    }

)