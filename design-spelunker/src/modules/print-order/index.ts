import { Module } from "@medusajs/framework/utils"
import PrintOrderModuleService from "./service"

export const PRINT_ORDER_MODULE = "print_order"

export default Module(PRINT_ORDER_MODULE, {
    service: PrintOrderModuleService,
})