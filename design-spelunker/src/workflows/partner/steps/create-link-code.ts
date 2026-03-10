import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { SATELLITE_MODULE } from "../../../modules/satellite"
import SatelliteModuleService from "../../../modules/satellite/service"

export type CreatePartnerLinkCodeStepInput = {
    partner_id: string
}

export const createPartnerLinkCodeStep = createStep(
    "create-partner-link-code-step",
    async (input: CreatePartnerLinkCodeStepInput, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        const partner = await satelliteModuleService.generateLinkCode(input.partner_id)

        return new StepResponse(partner, partner.id)
    },
    async (id: string, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        await satelliteModuleService.updatePartners({
            id: id,
            link_code: null,
            link_code_expires_at: null,
        })
    }

)