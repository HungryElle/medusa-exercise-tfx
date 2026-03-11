import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRINT_ORDER_MODULE } from "../../../modules/print-order"
import { DESIGN_MODULE } from "../../../modules/design"
import PrintOrderModuleService from "../../../modules/print-order/service"
import DesignModuleService from "../../../modules/design/service"

export const sendPartnerEmailStep = createStep(
    "send-partner-email-step",
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Send email step")

        const updated = await printOrderModuleService.forwardDraft(id)

        return new StepResponse(updated, id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Send email step failed")
        // Compensation: revert status back to draft if needed
        await printOrderModuleService.updateSelectionDrafts({
            id: id,
            status: "draft"
        })

        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: null,
        }))
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )
        await designModuleService.updateDesigns({
            id: id,
            reserved: false
        })
    }
)

export const updateDraftStatusStep = createStep(
    "update-draft-status-step",
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Update draft status step")
        const draft = await printOrderModuleService.retrieveSelectionDraft(id)
        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: new Date(),
        }))

        const updated = await printOrderModuleService.updateSelectionDrafts({
            id: draft.id,
            status: "forwarded"
        })

        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )

        draftItems.map(item => designModuleService.retrieveDesign(item.design_id).then(design => {
            designModuleService.updateDesigns({ id: design.id, reserved: false })
        }))

        return new StepResponse(updated, id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Update draft status step failed")
        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: null,
        }))

        await printOrderModuleService.updateSelectionDrafts({
            id: id,
            status: "draft"
        })
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )
        await designModuleService.updateDesigns({
            id: id,
            reserved: false
        })
    }
)

export const validateDraftStep = createStep(
    "validate-draft-step",
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Validate draft step")

        const draft = await printOrderModuleService.retrieveSelectionDraft(id)
        const items = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        if (draft.status !== "draft") {
            throw new Error("Draft is not in draft status")
        }

        if (items.length === 0) {
            throw new Error("Draft has no items")
        }

        return new StepResponse(draft, id)
    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Validate draft step failed")
        await printOrderModuleService.updateSelectionDrafts({
            id: id,
            status: "draft"
        })

        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: null,
        }))
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )
        await designModuleService.updateDesigns({
            id: id,
            reserved: false
        })
    }
)

export const reserveDesignFilesStep = createStep(
    "reserve-design-file-step",
    async (id: string, { container }) => {
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )

        console.log("Reserve design file step")
        const draft = await printOrderModuleService.retrieveSelectionDraft(id)
        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => designModuleService.retrieveDesign(item.design_id).then(design => {
            if (design.reserved) {
                throw new Error("Design is already reserved")
            }
            console.log("DesignId:", item.design_id)
            designModuleService.updateDesigns({ id: item.design_id, reserved: true })
        }))

        return new StepResponse(draft, id)

    },
    async (id: string, { container }) => {
        const printOrderModuleService: PrintOrderModuleService = container.resolve(
            PRINT_ORDER_MODULE
        )
        console.log("Reserve design file step failed")

        // Compensation: revert status back to draft if needed
        const draft = await printOrderModuleService.updateSelectionDrafts({
            id: id,
            status: "draft"
        })

        const draftItems = await printOrderModuleService.listSelectionItems({
            draft_id: id,
        })

        draftItems.map(item => printOrderModuleService.updateSelectionItems({
            id: item.id,
            sent_at: null,
        }))
        const designModuleService: DesignModuleService = container.resolve(
            DESIGN_MODULE
        )

        draftItems.map(item => designModuleService.retrieveDesign(item.design_id).then(design => {
            designModuleService.updateDesigns({ id: design.id, reserved: false })
        }))
    }
)