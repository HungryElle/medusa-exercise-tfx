import { z } from "@medusajs/framework/zod"
import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { UpdateDesignCreditSchema } from "../validators"
import { updateDesignCreditWorkflow } from "../../../../workflows/designs/update-design-credit"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")
    const {
        data: design,
    } = await query.graph({
        entity: "design",
        ...req.queryConfig,
        filters: {
            id: req.params.id,
        }
    })

    res.json({
        design: design[0] || null,
    })
}

export async function PATCH(
    req: MedusaRequest<z.infer<typeof UpdateDesignCreditSchema>>,
    res: MedusaResponse
): Promise<void> {
    const { id } = req.params
    const { designer_credit } = req.validatedBody

    const { result } = await updateDesignCreditWorkflow(req.scope).run({
        input: {
            id,
            designer_credit,
        },
    })

    res.json({
        design: result
    })
}