import { model } from "@medusajs/framework/utils"

export const SelectionDraft = model.define("selection_draft", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    partner_id: model.text().nullable(),
    status: model.enum(["draft", "forwarded", "completed"]),
    notes: model.text().nullable(),
})

export const SelectionItem = model.define("selection_item", {
    id: model.id().primaryKey(),
    draft_id: model.belongsTo(() => SelectionDraft),
    design_id: model.text(),
    colorway_id: model.text(),
    quantity: model.number().nullable(),
    notes: model.text().nullable(),
    sent_at: model.dateTime().nullable(),
})
