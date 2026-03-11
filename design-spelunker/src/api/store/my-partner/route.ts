import { MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework"
import { SATELLITE_MODULE } from "../../../modules/satellite"
import SatelliteModuleService from "../../../modules/satellite/service"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const customerId = req.auth_context?.actor_id as string

    console.log("Customer Id:", customerId)

    const satelliteModuleService: SatelliteModuleService = req.scope.resolve(SATELLITE_MODULE)

    const [customerPartnerLinks] = await satelliteModuleService.listAndCountCustomerPartnerLinks(
        { customer_id: customerId },
        { relations: ["partner_id"] }
    )

    console.log("Customer Partner Links:", customerPartnerLinks)

    res.json({ customer_partner_link: customerPartnerLinks })
}