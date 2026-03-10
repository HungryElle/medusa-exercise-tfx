import { MedusaService } from "@medusajs/framework/utils"
import { Partner, CustomerPartnerLink } from "./models/satellite"
import { randomBytes } from "crypto"
import { Logger } from "@medusajs/framework/types"

type InjectedDependencies = {
    logger: Logger;
};


class SatelliteModuleService extends MedusaService({
    Partner,
    CustomerPartnerLink,
}) {

    protected logger_: Logger;
    private maxRetries = 10; // Maximum retry attempts

    constructor({ logger }: InjectedDependencies) {
        super(...arguments);
        this.logger_ = logger;
    }

    async codeExists(code: string): Promise<boolean> {
        try {
            const partners = await this.listPartners(
                { link_code: code },
                { select: ["id"] }
            ).catch(() => []);

            return partners.length > 0;
        } catch (error) {
            this.logger_.error(
                `[SatelliteModuleService]: Error checking code existence: ${(error as Error).message}`,
                error as Error
            );
            throw new Error("Unable to verify code uniqueness.");
        }
    }

    async generateLinkCode(partnerId: string) {
        const partner = await this.retrievePartner(partnerId)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let bytes = randomBytes(6);
        let linkCode = '';

        for (let i = 0; i < 6; i++) {
            linkCode += chars[bytes[i] % chars.length];
        }

        let exists = await this.codeExists(linkCode)
        let attempts = 0
        while (exists && attempts < this.maxRetries) {
            attempts++
            bytes = randomBytes(6);
            linkCode = ''
            for (let i = 0; i < 6; i++) {
                linkCode += chars[bytes[i] % chars.length];
            }
            exists = await this.codeExists(linkCode)
        }

        if (attempts === this.maxRetries) {
            throw new Error("Unable to generate unique link code after multiple attempts.");
        }

        const linkCodeExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const updated = await this.updatePartners({
            id: partner.id,
            link_code: linkCode,
            link_code_expires_at: linkCodeExpiresAt,
        })
        return updated
    }


}

export default SatelliteModuleService