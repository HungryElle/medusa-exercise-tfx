import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { SATELLITE_MODULE } from "../../../../../../modules/satellite";
import SatelliteModuleService from "../../../../../../modules/satellite/service";

export const DELETE = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const customerId = req.params.customerId;
    const partnerId = req.params.partnerId;
    const satelliteModuleService: SatelliteModuleService = req.scope.resolve(SATELLITE_MODULE);
    console.log(customerId, partnerId);

    try {
        await satelliteModuleService.deleteCustomerPartnerLinks({
            customer_id: customerId,
            partner_id: partnerId
        })

        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}