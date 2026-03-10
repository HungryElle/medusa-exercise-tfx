import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRINT_ORDER_MODULE } from "../../../../../../modules/print-order"
import PrintOrderModuleService from "../../../../../../modules/print-order/service"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const printOrderModuleService: PrintOrderModuleService = req.scope.resolve(
        PRINT_ORDER_MODULE
    )

    await printOrderModuleService.deleteSelectionItems(req.params.itemId)

    res.json({
        success: true,
    })
}