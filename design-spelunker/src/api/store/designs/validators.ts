import { z } from "@medusajs/framework/zod"

const TagFilter = z.object({
    operator: z.enum(["and", "or"]),
    values: z.array(z.string().max(100, "Each tag must be 100 characters or fewer")),
})

export type TagFilter = z.infer<typeof TagFilter>

export const GetDesignsSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    tags: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                if (val.includes("/"))
                    return { operator: "or", values: val.split("/").map((s) => s.trim()) }
                return { operator: "and", values: val.split(",").map((s) => s.trim()) }
            }
            if (Array.isArray(val))
                return { operator: "and", values: val }
            return val
        },
        TagFilter
    ).optional(),
    slug: z.string().optional(),
    designer_credit: z.string().optional(),
})

export const CreateDesignSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    slug: z.string(),
    designer_credit: z.string().optional(),
})

export const UpdateDesignCreditSchema = z.object({
    designer_credit: z.string(),
})