import { SyncDesignSchema } from "./validator"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import DesignModuleService from "../../../../modules/design/service"
import { DESIGN_MODULE } from "../../../../modules/design"
import { payloadSyncWorkflow } from "../../../../workflows/designs/payload-sync"
import { z } from "zod"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {

    const signature = req.headers["x-payload-signature"] as string
    const rawBody = req.rawBody
    if (!signature || !rawBody) {
        return res.status(401).json({ message: "Missing signature or body" })
    }

    const designService: DesignModuleService = req.scope.resolve(DESIGN_MODULE)
    try {
        const isValid = await designService.verifySignature({ signature, payload: req.body });
        if (!isValid) {
            return res.status(401).json({ message: "Invalid signature" })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Invalid signature" })
    }

    const validated = req.body as z.infer<typeof SyncDesignSchema>
    const designs = await designService.listDesigns({ payload_id: validated.doc.id })
    console.log("Designs", designs)
    console.log("Validated", validated)

    const { result, errors } = await payloadSyncWorkflow(req.scope).run({
        input: {
            design_id: designs[0]?.id,
            payload_id: validated.doc.id,
            name: validated.doc.name,
            description: validated.doc.description,
            slug: validated.doc.slug,
            tags: validated.doc.tags,
            designer_credit: validated.doc.designer_credit,
            operation: validated.operation,
        }
    })
    if (errors.length) {
        return res.status(401).json({ message: "Invalid signature" })
    }
    res.status(200).json({ received: true })
}