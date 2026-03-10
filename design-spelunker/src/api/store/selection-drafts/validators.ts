import { z } from "@medusajs/framework/zod"

export const CreateDraftSchema = z.object({
    customer_id: z.string(),
    partner_id: z.string(),
    notes: z.string().optional(),
})

export type CreateDraftSchema = z.infer<typeof CreateDraftSchema>

export const UpdateDraftSchema = z.object({
    notes: z.string().optional(),
})

export type UpdateDraftSchema = z.infer<typeof UpdateDraftSchema>

export const GetDraftSchema = z.object({
    customer_id: z.string().optional(),
    partner_id: z.string().optional(),
    status: z.enum(["draft", "forwarded", "completed"]).optional(),
    notes: z.string().optional(),
})

export type GetDraftSchema = z.infer<typeof GetDraftSchema>

export const AddItemToDraftSchema = z.object({
    draft_id: z.string().optional(),
    design_id: z.string(),
    colorway_id: z.string(),
    quantity: z.number().optional(),
    notes: z.string().optional(),
})

export type AddItemToDraftSchema = z.infer<typeof AddItemToDraftSchema>

export const GetSelectionItemSchema = z.object({
    design_id: z.string().optional(),
    colorway_id: z.string().optional(),
    quantity: z.number().optional(),
})

export type GetSelectionItemSchema = z.infer<typeof GetSelectionItemSchema>

export const DeleteSelectionItemSchema = z.object({})

export type DeleteSelectionItemSchema = z.infer<typeof DeleteSelectionItemSchema>