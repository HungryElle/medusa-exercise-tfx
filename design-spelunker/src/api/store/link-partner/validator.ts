import { z } from "@medusajs/framework/zod"

export const LinkPartnerSchema = z.object({
    code: z.string(),
})

export type LinkPartnerSchema = z.infer<typeof LinkPartnerSchema>