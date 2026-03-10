import { defineMiddlewares, validateAndTransformQuery, validateAndTransformBody } from "@medusajs/framework/http"
import { GetDesignsSchema, CreateDesignSchema, UpdateDesignCreditSchema } from "./store/designs/validators"
import {
    AddItemToDraftSchema, CreateDraftSchema,
    GetDraftSchema, GetSelectionItemSchema,
    DeleteSelectionItemSchema, UpdateDraftSchema
} from "./store/selection-drafts/validators"
import { CreatePartnerSchema, CreatePartnerLinkCodeSchema } from "./admin/partner/validator"
import { LinkPartnerSchema } from "./store/link-partner/validator"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/store/designs",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(GetDesignsSchema, {
                    isList: true,
                    defaults: [
                        "id",
                        "name",
                        "description",
                        "tags",
                        "slug",
                        "designer_credit",
                        "createdAt",
                        "updatedAt"
                    ],
                }),
            ],
        },
        {
            matcher: "/store/designs/:id",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(GetDesignsSchema, {
                    isList: false,
                    defaults: [
                        "id",
                        "name",
                        "description",
                        "tags",
                        "slug",
                        "designer_credit",
                        "createdAt",
                        "updatedAt"
                    ],
                }),
            ],
        },
        {
            matcher: "/store/designs",
            method: "POST",
            middlewares: [
                validateAndTransformBody(CreateDesignSchema),
            ],
        },
        {
            matcher: "/store/designs/:id",
            method: "PATCH",
            middlewares: [validateAndTransformBody(UpdateDesignCreditSchema)],
        },
        {
            matcher: "/store/selection-drafts",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(GetDraftSchema, {
                    isList: true,
                    defaults: [
                        "id",
                        "customer_id",
                        "partner_id",
                        "status",
                        "notes",
                        "createdAt",
                        "updatedAt"
                    ],
                }),
            ],
        },
        {
            matcher: "/store/selection-drafts",
            method: "POST",
            middlewares: [
                validateAndTransformBody(CreateDraftSchema),
            ],
        },
        {
            matcher: "/store/selection-drafts/:id",
            method: "PATCH",
            middlewares: [validateAndTransformBody(UpdateDraftSchema)],
        },
        {
            matcher: "/store/selection-drafts/:id",
            method: "POST",
            middlewares: [],
        },
        {
            matcher: "/store/selection-drafts/:id",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(GetSelectionItemSchema, {
                    isList: true,
                    defaults: [
                        "id",
                        "design_id",
                        "colorway_id",
                        "quantity",
                        "notes",
                        "sent_at",
                        "createdAt",
                        "updatedAt"
                    ],
                }),
            ],
        },
        {
            matcher: "/store/selection-drafts/:id/items",
            method: "POST",
            middlewares: [
                validateAndTransformBody(AddItemToDraftSchema),
            ],
        },
        {
            method: ["DELETE"],
            matcher: "/store/selection-drafts/:id/items/:itemId",
            middlewares: [
                validateAndTransformQuery(GetSelectionItemSchema, {
                    isList: true,
                    defaults: [
                        "id",
                        "design_id",
                        "colorway_id",
                        "quantity",
                        "notes",
                        "createdAt",
                        "updatedAt"
                    ],
                }),
            ],
        },
        {
            matcher: "/admin/partner",
            method: "POST",
            middlewares: [
                validateAndTransformBody(CreatePartnerSchema),
            ],
        },
        {
            matcher: "/admin/partners/:id/link-code",
            method: "POST",
            middlewares: [
                validateAndTransformBody(CreatePartnerLinkCodeSchema),
            ],
        },
        {
            matcher: "/store/link-partner",
            method: "POST",
            middlewares: [
                validateAndTransformBody(LinkPartnerSchema),
            ],
        },

    ]
})