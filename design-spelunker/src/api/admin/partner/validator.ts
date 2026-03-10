import { z } from "@medusajs/framework/zod"

export const CreatePartnerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
})

export type CreatePartnerSchema = z.infer<typeof CreatePartnerSchema>

export const CreatePartnerLinkCodeSchema = z.object({
    partner_id: z.string(),
    link_code: z.string().optional(),
    link_code_expires_at: z.date().optional(),
})

export type CreatePartnerLinkCodeSchema = z.infer<typeof CreatePartnerLinkCodeSchema>
