import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { forwardSelectionDraftWorkflow } from "../workflows/print-order/forward-selection-draft"

export default async function forwardSelectionDraftHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const logger = container.resolve("logger")

    logger.info(`Forwarding selection draft: ${data.id}`)

    try {
        const result = await forwardSelectionDraftWorkflow(container)
            .run({
                input: {
                    id: data.id,
                },
            })
        logger.info(`Successfully forwarded selection draft: ${data.id}`)
        return result
    } catch (error) {
        logger.error(`Failed to forward selection draft: ${data.id}. Error: ${error.message}`)
        return `Failed to forward selection draft: ${data.id}. Error: ${error.message}`
    }
}

export const config: SubscriberConfig = {
    event: `selection-draft.forwarded`,
}
