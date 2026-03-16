import { MedusaService } from "@medusajs/framework/utils"
import { Design } from "./models/design"

import crypto from "crypto"

class DesignModuleService extends MedusaService({
    Design,
}) {
    async verifySignature({ signature, payload }: { signature: string; payload: any }) {
        const receivedSignature = Buffer.from(signature, "base64")
        console.log("Received signature", receivedSignature)
        const expectedSignature = crypto
            .createHmac("sha256", process.env.PAYLOAD_SIGNATURE_KEY!)
            .update(JSON.stringify(payload), "utf8")
            .digest()

        console.log("Expected signature", expectedSignature)
        return crypto.timingSafeEqual(receivedSignature, expectedSignature)
    }
}

export default DesignModuleService