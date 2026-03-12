import { model } from "@medusajs/framework/utils"

export const Design = model.define("design", {
    id: model.id().primaryKey(),
    name: model.text(),
    description: model.text().nullable(),
    tags: model.array(),
    slug: model.text(),
    designer_credit: model.text().nullable(),
    reserved: model.boolean().default(false),
})