import { model } from "@medusajs/framework/utils"

export const Partner = model.define("partner", {
    id: model.id().primaryKey(),
    name: model.text(),
    email: model.text().nullable(),
    link_code: model.text().unique().nullable(),
    link_code_expires_at: model.dateTime().nullable(),
})

export const CustomerPartnerLink = model.define("customer_partner_link", {
    id: model.id().primaryKey(),
    partner_id: model.belongsTo(() => Partner, { link_code: "link_code" }),
    customer_id: model.text(),
    link_at: model.dateTime().nullable(),
})
