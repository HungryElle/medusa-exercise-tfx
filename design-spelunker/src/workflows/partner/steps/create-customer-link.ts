import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { SATELLITE_MODULE } from "../../../modules/satellite"
import SatelliteModuleService from "../../../modules/satellite/service"

export type CreateCustomerLinkStepInput = {
    partner_id: string
    customer_id: string
}

export const createCustomerLinkStep = createStep(
    "create-customer-link-step",
    async (input: CreateCustomerLinkStepInput, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        const partner = await satelliteModuleService.createCustomerPartnerLinks(input)

        return new StepResponse(partner, partner.id)
    },
    async (id: string, { container }) => {
        const satelliteModuleService: SatelliteModuleService = container.resolve(
            SATELLITE_MODULE
        )

        await satelliteModuleService.deleteCustomerPartnerLinks(id)
    }

)