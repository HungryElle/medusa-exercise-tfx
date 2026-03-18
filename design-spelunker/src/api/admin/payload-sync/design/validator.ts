import { z } from "@medusajs/framework/zod"

export const SyncDesignSchema = z.object({
    doc: z.object({
        id: z.string(),
        status: z.string(),
        name: z.string(),
        description: z.string().optional(),
        slug: z.string(),
        tags: z.array(z.string()).default([]),
        designer_credit: z.string().optional(),
    }),
    operation: z.enum(["create", "update", "delete"]),
})

export type SyncDesignSchema = z.infer<typeof SyncDesignSchema>