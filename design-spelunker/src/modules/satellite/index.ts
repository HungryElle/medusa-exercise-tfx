import { Module } from "@medusajs/framework/utils"
import SatelliteModuleService from "./service"

export const SATELLITE_MODULE = "satellite"

export default Module(SATELLITE_MODULE, {
    service: SatelliteModuleService,
})