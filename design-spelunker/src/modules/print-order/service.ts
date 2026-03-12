import { MedusaError, MedusaService } from "@medusajs/framework/utils"
import { SelectionDraft, SelectionItem } from "./models/print-order"
import { IEventBusModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import nodemailer from "nodemailer";

type InjectedDependencies = {
    [Modules.EVENT_BUS]: IEventBusModuleService
}

class PrintOrderModuleService extends (MedusaService({
    SelectionDraft,
    SelectionItem,
}) as any) {
    protected readonly eventBusModuleService_: IEventBusModuleService

    constructor({ event_bus }: InjectedDependencies) {
        super(...arguments)
        this.eventBusModuleService_ = event_bus
    }

    async forwardDraft(id: string) {
        const draft = await this.retrieveSelectionDraft(id)

        if (draft.status !== "draft") {
            throw new MedusaError(MedusaError.Types.INVALID_DATA, `Can't forward an already-forwarded draft (current status: ${draft.status})`)
        }

        console.log("Forwarding draft:", draft)
        // email function

        const draftItems = await this.listSelectionItems({
            draft_id: id,
        })

        // 1. Create the engine using your Ethereal credentials
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const itemsHtml = draftItems.map(item => `
          <tr>
            <td>${item.design_id}</td>
            <td>${item.colorway_id}</td>
            <td>${item.quantity}</td>
          </tr>
        `).join('')

        // 2. The function to send the email (used inside your subscriber's handle method)
        const info = await transporter.sendMail({
            from: '"MyTFX Training" <noreply@mytfx.com>',
            to: "send-draft-test@mailsac.com",
            subject: `New Selection Draft Forwarded: ${draft.id}`,
            html: `
      <h1>Selection Draft Summary</h1>
      <p>Draft ID: ${draft.id}</p>
      <table border="1">
        <tr>
          <th>Design ID</th>
          <th>Colorway</th>
          <th>Quantity</th>
        </tr>
        ${itemsHtml}
      </table>
    `,
        });

        // 3. Ethereal provides a URL to see the email in your browser
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return draft

    }
}

export default PrintOrderModuleService