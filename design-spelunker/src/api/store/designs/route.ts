import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

import { z } from "@medusajs/framework/zod"
import { GetDesignsSchema, CreateDesignSchema } from "./validators"

import { createDesignWorkflow } from "../../../workflows/designs/create-design"

type DesignType = z.infer<typeof GetDesignsSchema>

export const GET = async (
    req: MedusaRequest<DesignType>,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const filterableFields = req.filterableFields as DesignType
    const filters: Record<string, unknown> = {
        ...filterableFields,
        tags: filterableFields.tags
            ? filterableFields.tags.operator === "or"
                ? { $overlap: filterableFields.tags.values }
                : { $contains: filterableFields.tags.values }
            : undefined,
    }

    if (
        filterableFields.tags?.values != null &&
        filterableFields.tags.values.length > 0 &&
        filterableFields.tags.values[0] !== ""
    ) {
        const {
            data: design,
            metadata: { count, take, skip } = {
                count: 0,
                take: 20,
                skip: 0,
            },
        } = await query.graph({
            entity: "design",
            ...req.queryConfig,
            filters,
        })
        // Count how many designs match each individual tag
        // Count how many designs match each individual tag locally from the `design` array results
        const tagCountEntries = filterableFields.tags.values.map((tag) => {
            const count = design.filter((d: any) =>
                d.tags?.includes(tag)
            ).length
            return [tag, count] as [string, number]
        })

        return res.json({
            design,
            count,
            limit: take,
            offset: skip,
            tag_counts: Object.fromEntries(tagCountEntries),
        })
    }

    const {
        data: design,
        metadata: { count, take, skip } = {
            count: 0,
            take: 20,
            skip: 0,
        },
    } = await query.graph({
        entity: "design",
        ...req.queryConfig,
    })
    res.json({
        design,
        count,
        limit: take,
        offset: skip,
    })
}

export const POST = async (
    req: MedusaRequest<z.infer<typeof CreateDesignSchema>>,
    res: MedusaResponse
) => {
    const { result } = await createDesignWorkflow(req.scope)
        .run({
            input: req.validatedBody,
        })

    res.json({ design: result })
}