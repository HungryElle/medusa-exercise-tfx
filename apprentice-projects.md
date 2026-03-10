# MyTFX 2.0 — Apprentice Learning Projects

_February 2026_

## Overview

These projects are a self-contained training track. You are working in your **own blank Medusa.js project** — not the real MyTFX codebase. The goal is to build a simplified version of the MyTFX platform piece by piece, so that by the time you join the main project you've already encountered every major pattern it uses.

Each project builds on the last. By the end you'll have a working mini-platform with a design catalogue, a quote-ordering flow, partner management, email notifications, a workflow engine, a webhook receiver, and a permission system.

**Stack you're using:**
- **Medusa.js 2.x** — start from `npx create-medusa-app@latest`
- **PostgreSQL** — Medusa handles the connection; you write entities and migrations
- **Node.js / TypeScript**

**Useful references to keep open:**
- [Medusa docs home](https://docs.medusajs.com)
- [Medusa Module Architecture](https://docs.medusajs.com/learn/fundamentals/modules)
- [Medusa API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes)

---

## Progression Guide

| # | Project | Level | Hours | Key Medusa Concept |
|---|---|---|---|---|
| 1 | Design Spelunker | Beginner | 4–6 | Module structure, entities, migrations |
| 2 | Tag Filter Endpoint | Beginner→Mid | 6–8 | API routes, query validation |
| 3 | SelectionDraft Builder | Intermediate | 10–14 | Building a new module end-to-end |
| 4 | Partner Email Forwarder | Intermediate | 8–10 | Event bus, subscribers |
| 5 | Partner Link Code | Intermediate | 8–12 | Multi-tenancy, join tables, module links |
| 6 | Print Job State Machine | Advanced | 12–16 | Workflow engine, compensation steps |
| 7 | Payload Webhook Ingestion | Advanced | 10–14 | Cross-system sync, idempotency, webhooks |
| 8 | RBAC Capability Table | Advanced | 12–16 | Middleware, database-driven permissions |

Do Projects 1–2 in order before picking up 3–5. Projects 6–8 can be done in any order once 3–5 are complete.

---

## Project 1 — "Design Spelunker" _(Beginner)_

**Goal:** Learn how a Medusa custom module is structured by building one from scratch. You'll create a `Design` entity, write a migration, build a basic service, expose two API routes, and add a field — touching every layer of a Medusa module before moving on to anything more complex.

**Suggested time:** 4–6 hours

---

### Background

In MyTFX, the design catalogue is at the heart of the product — over 28,000 fabric designs that customers browse and select from. A `Design` record holds the editorial content for one pattern: its name, description, tags, and who created it.

You're going to build a simplified version of this module in your training project.

---

### What you'll build

A `design` custom module at `src/modules/design/` with the following structure:

```
src/modules/design/
├── index.ts                  ← registers the module with Medusa
├── service.ts                ← DesignModuleService with listDesigns() and getDesign()
├── models/
│   └── design.ts             ← the Design entity (MikroORM model)
└── migrations/
    └── 20250301000000_create_design.ts
```

And two API routes:

```
src/api/store/designs/
├── route.ts                  ← GET /store/designs
└── [id]/
    └── route.ts              ← GET /store/designs/:id
```

---

### The Design entity

Your `Design` model should have these fields:

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key, auto-generated |
| `name` | string | Required |
| `description` | string | Nullable |
| `tags` | string[] | Array of tag strings, e.g. `["floral", "repeat"]` |
| `slug` | string | URL-safe identifier, unique |
| `designer_credit` | string | Nullable — **this is the field you add last (see Step 5)** |
| `created_at` | timestamp | Auto-set |
| `updated_at` | timestamp | Auto-set |

---

### Steps

**1. Scaffold the module**

Read the Medusa [Custom Module](https://docs.medusajs.com/learn/fundamentals/modules/create) docs. Create the directory structure above. Start with `index.ts` — it exports a `Module()` call that registers your module and its service class.

**2. Define the entity**

Create `src/modules/design/models/design.ts`. Use MikroORM decorators (`@Entity()`, `@Property()`, etc.) to define the `Design` class with all fields **except** `designer_credit` for now. Look at the Medusa docs or a generated Medusa module for the correct decorator patterns.

**3. Write the first migration**

Create a migration file in `src/modules/design/migrations/`. The migration should create the `design` table with all the columns you defined. Run `npx medusa db:migrate` and confirm the table exists in your database.

**4. Build the service and routes**

In `service.ts`, extend Medusa's module service base and implement `listDesigns()` and `getDesign(id)`. Create the two store route files. Test `GET /store/designs` and `GET /store/designs/:id` with cURL.

Seed a few designs manually (directly in the DB or via a seed script) so you have data to work with.

**5. Add `designer_credit` via a new migration**

Now add the `designer_credit` field — but don't modify your existing migration. Create a **second** migration file that adds a single nullable `VARCHAR` column to the existing `design` table. This is how you'd add a field to a live production database without dropping and recreating the table.

Add the property to the entity class, run the new migration, and confirm the field appears in your API responses.

**6. Make `designer_credit` writable**

Add an admin route `PATCH /admin/designs/:id` that accepts a request body and updates the design via a `updateDesign()` service method. Test that you can set `designer_credit` via:

```bash
curl -X PATCH http://localhost:9000/admin/designs/<id> \
  -H "Content-Type: application/json" \
  -d '{"designer_credit": "Yayoi Kusama"}'
```

---

### Acceptance Criteria

- [ ] Module registered in `medusa-config.ts` with migrations running cleanly on a fresh database
- [ ] `GET /store/designs` returns an array of designs
- [ ] `GET /store/designs/:id` returns a single design
- [ ] `designer_credit` field is returned in both responses
- [ ] `PATCH /admin/designs/:id` updates `designer_credit`
- [ ] `designer_credit` was added in a **second** migration, not by modifying the first
- [ ] No TypeScript compilation errors

### Stretch Goals

1. Add a `GET /store/designs?designer=:name` filter — extend `listDesigns()` to accept an optional `designer_credit` filter string and pass it from the route handler
2. Seed at least five designs with varied tags and two with `designer_credit` set, and write a simple check that the responses contain the expected data

---

## Project 2 — "Tag Filter Endpoint" _(Beginner → Intermediate)_

**Goal:** Learn how to extend an existing API route with query parameter filtering, input validation, and correct pagination behaviour.

**Suggested time:** 6–8 hours

---

### Background

By the end of Project 1 you have a working design module and two API routes. The `GET /store/designs` endpoint currently returns all designs. You're going to extend it to support filtering by tag — a feature the real MyTFX storefront needs so customers can browse designs by category.

---

### The Task

Extend `GET /store/designs` to accept a `tags` query parameter. When provided, only designs matching **all** supplied tags are returned. Pagination must still work correctly on the filtered result set.

Examples:
- `GET /store/designs?tags=floral` → designs tagged `floral`
- `GET /store/designs?tags=floral,geometric` → designs tagged with **both** `floral` AND `geometric`
- `GET /store/designs?tags=floral&tags=geometric` → same result (both formats should work)

---

### Steps

**1. Understand the current code path**

Trace the full request flow: `route.ts` reads query params → calls `service.listDesigns()` → queries the database → returns results. You need to extend each part of this chain.

**2. Parse the `tags` parameter in the route handler**

In `src/api/store/designs/route.ts`, read `req.query.tags`. Handle both comma-separated (`tags=a,b`) and repeated (`tags=a&tags=b`) forms — split on commas, flatten the array, and trim whitespace from each value.

**3. Validate the input**

Before calling the service:
- If `tags` is absent, proceed normally — no filter applied
- If any single tag value is longer than 100 characters, return a 400 with a message like `"Tag values must be 100 characters or fewer"`
- Strip leading/trailing whitespace from each tag

Medusa uses `zod` for route validation — check how the existing Medusa generated routes do it, and use the same pattern.

**4. Extend `listDesigns()` in the service**

Update `src/modules/design/service.ts` to accept an optional `tags` array. When tags are provided, filter to only designs whose `tags` field contains **all** of the requested values.

How you write the query depends on how tags are stored:
- If stored as a JSON array column: you'll need a raw query or JSON contains syntax
- If stored as a PostgreSQL array column: use the `@>` (contains) operator

**5. Verify pagination still works**

Test `GET /store/designs?tags=floral&limit=5&offset=10`. The `offset` must apply to the filtered set, not all designs.

**6. Test edge cases**

| Request | Expected result |
|---|---|
| `?tags=doesnotexist` | `{ designs: [], count: 0 }` |
| No `tags` param | All designs returned |
| `?tags=` (empty string) | Treat as no filter |
| `?tags=a-string-over-100-characters...` | 400 with validation error |

---

### Acceptance Criteria

- [ ] `?tags=floral` returns only designs tagged `floral`
- [ ] `?tags=floral,geometric` returns only designs with **both** tags
- [ ] Unknown tags return `{ designs: [], count: 0 }` (not a 404 or 500)
- [ ] Requests without `tags` are unaffected
- [ ] Tags longer than 100 characters return a 400 with a clear error message
- [ ] `limit` and `offset` work correctly on filtered results

### Stretch Goals

1. Add an `operator` query param (`AND` / `OR`, default `AND`) — `OR` returns designs with **at least one** of the supplied tags
2. Return a `tag_counts` map alongside results (e.g. `{ "floral": 12, "geometric": 4 }`) showing how many results match each tag — useful for a future faceted search UI

---

## Project 3 — "SelectionDraft Builder" _(Intermediate)_

**Goal:** Build a second complete Medusa module from scratch with two related entities, a service, migrations, and four API routes. This is the most important pattern in the MyTFX platform.

**Suggested time:** 10–14 hours

---

### Background

MyTFX uses a "quote-first" ordering model. Customers don't put items in a cart and pay — instead, they select designs and send them to a satellite partner who then provides a price quote. The `SelectionDraft` is the object that holds that selection before it's forwarded. This is the central data model around which Projects 4, 5, and 6 all operate.

You're building the module that manages it. Use your existing `src/modules/design/` as a structural reference.

---

### What you'll build

A new module at `src/modules/print-order/` with two entities: `SelectionDraft` and `SelectionItem`.

**Entity: SelectionDraft**

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `customer_id` | string | The customer who owns this draft |
| `partner_id` | string | The partner this draft will be forwarded to |
| `status` | enum | `draft` \| `forwarded` \| `completed` — always starts as `draft` |
| `notes` | string | Nullable, free-text for the whole draft |
| `created_at` | timestamp | Auto-set |
| `updated_at` | timestamp | Auto-set |

**Entity: SelectionItem**

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `draft_id` | string | Foreign key → SelectionDraft |
| `design_id` | string | The design being selected |
| `colorway_id` | string | Which colorway of that design |
| `quantity` | integer | Nullable |
| `notes` | string | Nullable, item-level notes |
| `created_at` | timestamp | Auto-set |

**API routes:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/store/selection-drafts` | Create a new draft |
| `GET` | `/store/selection-drafts/:id` | Get a draft with its items nested |
| `POST` | `/store/selection-drafts/:id/items` | Add a SelectionItem to a draft |
| `DELETE` | `/store/selection-drafts/:id/items/:itemId` | Remove a SelectionItem |

---

### Steps

**1. Plan the structure before writing code**

Sketch out the module directory layout (mirror `src/modules/design/`). Understand how a `ManyToOne` relation between `SelectionItem` and `SelectionDraft` will look in MikroORM.

**2. Define the entities**

Create both entity files. The `SelectionItem` entity needs a `@ManyToOne(() => SelectionDraft)` decorator linking back to the draft. The `SelectionDraft` entity should have a `@OneToMany(() => SelectionItem, item => item.draft)` so you can load items eagerly.

**3. Write the migration**

One migration file that creates both tables plus the foreign key constraint. Run `npx medusa db:migrate`.

**4. Write the service**

Create `PrintOrderModuleService` in `service.ts`. Implement:

- `createSelectionDraft(data)` — creates a draft; the `status` field must always be set to `draft` regardless of what's in `data` (don't trust the caller to set the initial status)
- `getSelectionDraft(id)` — returns the draft with its items loaded (use eager loading or explicit populate)
- `addItem(draftId, itemData)` — before creating the item, verify the `design_id` exists by calling your design module's service. If it doesn't exist, throw an error that results in a 404 response
- `removeItem(draftId, itemId)` — delete the item; verify it belongs to this draft before deleting

**5. Register the module**

Add the new module to `medusa-config.ts`.

**6. Build the API routes**

Create the four route files. The `POST /store/selection-drafts` handler must strip any `status` field from the request body before passing data to the service — callers cannot set status directly.

**7. Test end-to-end**

Use cURL or Postman to verify all four routes. Test that:
- A draft starts with status `draft`
- The detail route returns items nested under the draft
- Adding a non-existent design ID gives a 404

---

### Acceptance Criteria

- [ ] Module registered in `medusa-config.ts` with clean migrations
- [ ] All four API routes work via cURL / Postman
- [ ] `GET /store/selection-drafts/:id` returns items nested under the draft object
- [ ] Adding a non-existent `design_id` returns a 404 with a readable message
- [ ] `status` cannot be set via the `POST` body — it always starts as `draft`
- [ ] No TypeScript compilation errors

### Stretch Goals

1. Add `PATCH /store/selection-drafts/:id` that allows updating the draft's `notes` field only
2. Reject duplicate items — if a draft already contains the same `design_id` + `colorway_id` combination, return a 409

---

## Project 4 — "Partner Email Forwarder" _(Intermediate)_

**Goal:** Learn Medusa's event bus. Understand how modules emit events and how subscribers react to them asynchronously — the standard pattern for notifications and side effects throughout the MyTFX platform.

**Suggested time:** 8–10 hours

---

### Background

When a customer's SelectionDraft is ready, they "forward" it to a partner for pricing. This triggers an email to the partner with a summary of the selected designs. In MyTFX, this is implemented as an event subscriber: the service emits an event, and a subscriber in a separate file reacts to it — keeping concerns separated and the service fast.

Before starting, read the Medusa [Events and Subscribers](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers) docs in full.

---

### What you'll build

1. A `forwardDraft(id)` method on `PrintOrderModuleService` that updates the draft status and emits an event
2. An event subscriber at `src/subscribers/selection-draft-forwarded.ts` that sends a formatted email
3. A new API route `POST /store/selection-drafts/:id/forward` that triggers the forward

---

### Steps

**1. Add `forwardDraft()` to the service**

In `src/modules/print-order/service.ts`, add a method that:
1. Loads the draft by ID
2. Checks it is currently in `draft` status — if not, throw an error (can't forward an already-forwarded draft)
3. Updates `status` to `forwarded`
4. Saves the record
5. Emits the event: `this.eventBusModuleService_.emit('selection-draft.forwarded', { id: draft.id })`

To access the event bus in your service, inject `IEventBusModuleService` via the module container — look at how Medusa's own core services do this.

**2. Add `POST /store/selection-drafts/:id/forward`**

Create the route handler. It should call `service.forwardDraft(id)` and return a 200 with the updated draft. If `forwardDraft` throws (e.g. draft already forwarded), map that to a 400 response.

**3. Set up a test email provider**

For local development, use [Nodemailer](https://nodemailer.com) with a test SMTP service like [Ethereal](https://ethereal.email) — it captures emails without actually sending them. Alternatively, if Resend is already configured in the project, use that. Add connection details to your `.env`.

**4. Create the subscriber**

Create `src/subscribers/selection-draft-forwarded.ts`. A Medusa subscriber exports a class with:
- A static `Events` array listing the events it handles (e.g. `['selection-draft.forwarded']`)
- A `handle(data, context)` method that receives the event payload

Inside `handle()`:
1. Extract the draft ID from `data`
2. Load the full draft (with items) from the print-order service
3. In a real system you'd load the partner's email from a satellite module; for this project, hard-code a test email address or read it from `.env`
4. If no email is available, log a warning and return — do not throw
5. Compose a plain HTML email with the draft details and a table of items
6. Send the email via your configured provider
7. On success, update each `SelectionItem` to set `sent_at = new Date()`
8. On failure, log the error — do **not** set `sent_at` so a retry can pick up unsent items later

**5. Test the full flow**

Create a draft, add items, then call `POST /store/selection-drafts/:id/forward`. Verify:
- The draft status changes to `forwarded`
- The subscriber fires (check your logs)
- The email appears in Ethereal (or your test inbox)
- `sent_at` is set on each item

---

### What the email must contain

- Draft ID
- A table of SelectionItems: Design ID, Colorway ID, Quantity, Notes

(In the real system, design names would be looked up — for this training project, showing the IDs is fine.)

---

### Acceptance Criteria

- [ ] `POST /store/selection-drafts/:id/forward` changes draft status to `forwarded`
- [ ] Calling forward on an already-`forwarded` draft returns a 400
- [ ] Subscriber fires when `selection-draft.forwarded` is emitted
- [ ] Email is sent to the configured address and contains the item table
- [ ] If no email address is available, the subscriber logs a warning and does not crash
- [ ] `sent_at` is set on each `SelectionItem` after a successful send
- [ ] If the email send fails, `sent_at` is **not** set

### Stretch Goals

1. Add `POST /admin/selection-drafts/:id/resend` that re-sends the email for items where `sent_at` is null
2. Add a `cc_customer` boolean on `SelectionDraft` — if `true`, also send a copy to a customer email address

---

## Project 5 — "Partner Link Code" _(Intermediate)_

**Goal:** Learn how to model a many-to-many relationship and add time-sensitive business logic. Build the mechanism that lets customers connect to partner accounts using a short invite code.

**Suggested time:** 8–12 hours

---

### Background

In MyTFX, satellite partners manage a group of customers who order through them. Partners generate an invite code; customers enter it on the storefront to link their account. A customer can be linked to multiple partners. This project builds that flow.

Before starting, read the Medusa [Module Links](https://docs.medusajs.com/learn/fundamentals/modules/module-links) docs to understand the recommended pattern for linking records across modules.

---

### What you'll build

First, create a minimal `Partner` module at `src/modules/satellite/` (or extend it if it already exists from previous work). Then add the link code generation and customer-linking flow on top.

---

### The Partner entity

If you don't already have it, create a `Partner` entity with these fields:

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `name` | string | Partner business name |
| `email` | string | Nullable |
| `link_code` | string | Nullable, unique, 6 alphanumeric chars |
| `link_code_expires_at` | timestamp | Nullable |
| `created_at` | timestamp | Auto-set |

### New entity: `CustomerPartnerLink`

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `customer_id` | string | Medusa customer ID |
| `partner_id` | string | FK → Partner |
| `linked_at` | timestamp | Set at creation |

Write a migration that creates the `partner` table (or adds `link_code` columns to it if already exists) and creates the `customer_partner_link` table.

---

### Routes to build

| Method | Path | Description |
|---|---|---|
| `POST` | `/admin/partners` | Create a partner (you'll need this to test the rest) |
| `POST` | `/admin/partners/:id/link-code` | Generate or regenerate a link code |
| `POST` | `/store/link-partner` | Customer links themselves using a code |
| `GET` | `/store/my-partners` | Returns all partners the current customer is linked to |

---

### Steps

**1. Scaffold the satellite module**

If it doesn't already exist, create `src/modules/satellite/` with a `Partner` entity and service. Add a `POST /admin/partners` route so you can create test partner records.

**2. Build link code generation**

In the partner service, add a `generateLinkCode(partnerId)` method:
1. Generate a random 6-character alphanumeric string (uppercase letters + digits)
2. Check for uniqueness — query the DB for any partner with that code. If a collision occurs, regenerate
3. Set `link_code = code` and `link_code_expires_at = now + 30 days`
4. Save and return the code + expiry

Wire this to `POST /admin/partners/:id/link-code`.

**3. Build the customer linking route**

`POST /store/link-partner` receives `{ code: "TFX42B" }` in the body.

The handler must:
1. Look up the partner by `link_code`
2. If not found, **or** if `link_code_expires_at` is in the past, return a **404** — use the same error message for both cases. This prevents callers from probing whether a code exists vs has expired
3. Get the customer ID from the authenticated session (how Medusa authenticates store customers is documented in the auth sections of the Medusa docs)
4. Check if a `CustomerPartnerLink` already exists for this customer + partner pair. If it does, return the existing link (idempotent — do not error)
5. Otherwise, create a new `CustomerPartnerLink` with `linked_at = now()`

**4. Build `GET /store/my-partners`**

Get the calling customer's ID from the session. Find all `CustomerPartnerLink` rows for that customer. Return the associated `Partner` records. Return an empty array if none exist.

---

### Acceptance Criteria

- [ ] Link codes are unique across all partners
- [ ] Codes expire after 30 days; expired codes return a 404
- [ ] Linking twice to the same partner results in one `CustomerPartnerLink` row, not two
- [ ] An invalid or expired code returns a 404 (not a 400)
- [ ] `GET /store/my-partners` returns an empty array when the customer has no links

### Stretch Goals

1. Add `DELETE /admin/partners/:partnerId/customers/:customerId` to revoke a customer link
2. Return `linked_at` in the `GET /store/my-partners` response

---

## Project 6 — "Print Job State Machine" _(Advanced)_

**Goal:** Master Medusa's workflow engine. Learn how to model multi-step processes where each step can be automatically rolled back (compensated) if a later step fails.

**Suggested time:** 12–16 hours

---

### Background

In Projects 3 and 4, `forwardDraft()` is a single service method that does everything synchronously. That's fragile: if the email send fails, the status has already been updated. Real production code needs each step to be reversible. Medusa's workflow engine solves this with built-in compensation.

Read the [Medusa Workflows docs](https://docs.medusajs.com/learn/fundamentals/workflows) in full before starting. Also open any workflow in `node_modules/@medusajs/core-flows/src/` to see a production example.

---

### What you'll build

A `forwardSelectionDraftWorkflow` in a new directory `src/modules/print-order/workflows/`. The route `POST /store/selection-drafts/:id/forward` (from Project 4) will be updated to invoke this workflow instead of calling the service directly.

---

### The four workflow steps

| Step | What it does | Compensation (runs if a later step fails) |
|---|---|---|
| `validateDraftStep` | Checks the draft exists, has ≥1 item, and is in `draft` status. Throws a user-facing error otherwise | None — no state has changed yet |
| `reserveDesignFilesStep` | Sets a `reserved = true` flag on each design referenced by the draft's items (add this field to the Design entity) | Sets `reserved = false` on the same designs |
| `sendPartnerEmailStep` | Sends the forwarding email to the partner | Log only — email cannot be unsent |
| `updateDraftStatusStep` | Sets draft status to `forwarded`, records `forwarded_at = now()` | Sets status back to `draft`, clears `forwarded_at` |

---

### Steps

**1. Add the `reserved` flag to Design**

Add a `reserved` boolean field to the `Design` entity (default `false`) via a new migration.

**2. Create the workflow file**

Create `src/modules/print-order/workflows/forward-selection-draft.ts`. Import `createWorkflow` and `createStep` from `@medusajs/framework/workflows-sdk`.

**3. Define each step**

Each step is defined with `createStep(name, invokeFn, compensateFn)`. The `invokeFn` does the work and returns data for subsequent steps. The `compensateFn` receives that same data and reverses the effect. Steps with no side effects (like `validateDraftStep`) can omit the compensation function.

**4. Compose the workflow**

Use `createWorkflow` to define the execution order. Chain outputs from one step as inputs to the next where needed (e.g. pass the list of design IDs from `validateDraftStep` into `reserveDesignFilesStep`).

**5. Update the API route**

Change `POST /store/selection-drafts/:id/forward` to invoke the workflow using:

```ts
await forwardSelectionDraftWorkflow(container).run({
  input: { draftId: id, customerId: req.auth.customerId }
})
```

If `validateDraftStep` throws, the workflow engine surfaces a user-facing error — return this as the response body with an appropriate status code (400), not a 500.

**6. Test compensation**

Temporarily add `throw new Error("test")` inside `updateDraftStatusStep`. Call the forward endpoint and verify:
- `reserveDesignFilesStep`'s compensation fires (designs should be unreserved)
- The draft status is NOT changed to `forwarded`

Remove the test error when done.

---

### Acceptance Criteria

- [ ] Workflow executes all four steps in order on a successful run
- [ ] If `updateDraftStatusStep` fails, `reserveDesignFilesStep`'s compensation runs and designs are unreserved
- [ ] If `validateDraftStep` fails, the API returns a readable error message (not a 500)
- [ ] Calling forward on an already-`forwarded` draft returns a clear error without re-running the workflow
- [ ] `POST /store/selection-drafts/:id/forward` works end-to-end

### Stretch Goals

1. Configure `sendPartnerEmailStep` with `retryable: true` so Medusa retries it up to 3 times before triggering compensation
2. Build a second workflow `acknowledgeSelectionDraftWorkflow` that transitions `forwarded → partner_reviewing` when called via a partner webhook

---

## Project 7 — "Payload Webhook Ingestion" _(Advanced)_

**Goal:** Build a secure, idempotent webhook receiver. Learn signature verification, the "respond fast, process async" pattern, and how to write upsert logic that is safe to re-run.

**Suggested time:** 10–14 hours

---

### Background

In the real MyTFX stack, Payload CMS is the editorial backend where design metadata (names, descriptions, tags) is managed. When a content editor publishes a design in Payload, a webhook fires to Medusa's API to keep the design catalogue in sync. You're going to build the receiving end of that webhook.

You do **not** need a running Payload instance. Instead, you'll simulate the webhook by firing `curl` requests manually with a crafted JSON payload.

---

### The simulated Payload webhook body

When Payload fires a webhook for a published design, the body looks like this:

```json
{
  "doc": {
    "id": "payload-doc-uuid-123",
    "status": "published",
    "name": "Sakura Repeat",
    "description": "A delicate cherry blossom repeat pattern.",
    "slug": "sakura-repeat",
    "tags": ["floral", "japanese", "repeat"],
    "designer_credit": "Aiko Tanaka"
  },
  "operation": "update"
}
```

Payload also sends an `X-Payload-Signature` header — an HMAC-SHA256 hex digest of the raw request body, keyed with a shared secret.

---

### What you'll build

A webhook endpoint at `POST /admin/payload-sync/design`, plus an `upsertDesign()` method on the design module service.

---

### Steps

**1. Add `payload_id` to the Design entity**

Add a `payload_id` string field (nullable, unique) to the `Design` entity via a new migration. This is the idempotency key — it's how you tell whether a Payload document has already been synced.

**2. Implement `upsertDesign()` in the design service**

The method receives `{ payloadId, name, description, slug, tags, designerCredit }`. It should:
1. Query for an existing Design with `payload_id = payloadId`
2. If found: update the design's fields
3. If not found: create a new Design record, setting `payload_id`

This must be safe to call multiple times with the same `payloadId` — the second call should update, not duplicate.

**3. Create the route file**

Create `src/api/admin/payload-sync/route.ts`. Add a `POST` handler.

**4. Implement signature verification**

Read the raw request body as a Buffer (before JSON parsing). Compute an HMAC-SHA256 hex digest of the raw body using `process.env.PAYLOAD_WEBHOOK_SECRET` as the key. Compare your digest to the `X-Payload-Signature` header using `crypto.timingSafeEqual()`. If they don't match or the header is absent, return **401** and log the event.

> Tip: Express parses the body by default. To get the raw Buffer, add `express.raw({ type: 'application/json' })` as middleware for this route specifically.

**5. Parse, validate, and call upsert**

After signature verification, parse the JSON. If `doc.status !== 'published'`, return `200 { ignored: true }` — do not write to the database. Otherwise, call `upsertDesign()` with the parsed fields and return `200 { success: true }`.

**6. Keep the route fast**

The route must return within 200ms. If you want to trigger heavier work (like search index updates), emit a Medusa event and let a subscriber handle it asynchronously.

**7. Test with cURL**

Generate a valid HMAC signature in a small Node.js script and use it to fire test requests:

```bash
# compute signature first, then:
curl -X POST http://localhost:9000/admin/payload-sync/design \
  -H "Content-Type: application/json" \
  -H "X-Payload-Signature: <computed-hmac>" \
  -d '{ "doc": { ... }, "operation": "update" }'
```

Send the same request twice and confirm no duplicate Design records are created.

---

### Acceptance Criteria

- [ ] Requests with invalid or missing signature return 401
- [ ] A new Payload document ID creates a new Design record
- [ ] Re-sending the same event updates the Design, not creates a duplicate
- [ ] Documents with `status: draft` return 200 but no DB write occurs
- [ ] Endpoint responds within 200ms (measure with cURL's `--trace-time` or similar)

### Stretch Goals

1. After a successful upsert, emit a `design.content-updated` event so other subscribers can react (e.g. trigger a search index refresh)
2. Build `POST /admin/payload-sync/backfill` that accepts a list of Payload document IDs in the body and upserts each one — simulating a bulk re-sync

---

## Project 8 — "RBAC Capability Table" _(Advanced)_

**Goal:** Replace hardcoded role checks with a database-driven permission system. Learn how Medusa middleware works and how to design a permissions model that can be extended without redeploying code.

**Suggested time:** 12–16 hours

---

### Background

At this point your training project has multiple protected routes. Right now they probably either have no auth check at all, or a simple `if (user.role !== 'admin') return res.status(403)`. That approach doesn't scale — every new permission requires a code change and a deploy. The solution is to move permissions into the database.

Read the Medusa [Middlewares](https://docs.medusajs.com/learn/fundamentals/api-routes/middlewares) docs before starting.

---

### The three roles in play

- `admin`
- `satellite_partner`
- `customer`

Assume the authenticated user's role is available on `req.auth.role` after JWT verification (Medusa sets this up through its auth module).

---

### What you'll build

A `Capability` entity, a seed script, and a `requireCapability()` middleware factory. Then apply the middleware to protect several of your existing routes.

---

### The Capability entity

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `role` | string | `admin` \| `satellite_partner` \| `customer` |
| `capability` | string | e.g. `design:read`, `order:forward` |
| `created_at` | timestamp | Auto-set |

Create this in a new `src/modules/auth/` directory (or extend one if you already have it). Write a migration and a seed script.

---

### Initial seed data (minimum 8 rows)

| Role | Capability |
|---|---|
| `admin` | `design:read` |
| `admin` | `design:download` |
| `admin` | `order:forward` |
| `admin` | `partner:manage` |
| `satellite_partner` | `design:read` |
| `satellite_partner` | `order:forward` |
| `customer` | `design:read` |
| `customer` | `design:download` |

The seed must be idempotent — safe to run multiple times without duplicating rows.

---

### Steps

**1. Create the entity and migration**

Define the `Capability` entity and run a migration to create the table.

**2. Write the seed script**

Write a seed function that inserts the rows above. Use upsert or a check-before-insert pattern so re-running it is safe.

**3. Build `requireCapability(capability)`**

Create `src/api/middlewares/require-capability.ts`. This function takes a capability string and returns a standard middleware function:

```ts
export function requireCapability(capability: string) {
  return async (req: MedusaRequest, res: MedusaResponse, next: NextFunction) => {
    // 1. Check for a valid JWT — return 401 if missing or expired
    // 2. Get the role from the JWT payload
    // 3. Query the Capability table for { role, capability }
    //    Cache the result on req to avoid repeated DB hits in the same request
    // 4. If found: call next()
    // 5. If not found: return 403
  }
}
```

The distinction between 401 and 403 matters: 401 means "you are not logged in", 403 means "you are logged in but not allowed".

**4. Register middleware on specific routes**

In `src/api/middlewares.ts` (Medusa's central middleware config file), apply your middleware to at least two routes. For example:

- `POST /store/selection-drafts/:id/forward` → `requireCapability('order:forward')`
- `POST /admin/partners/:id/link-code` → `requireCapability('partner:manage')`

**5. Test all auth scenarios**

| Scenario | Expected response |
|---|---|
| No JWT | 401 |
| Expired JWT | 401 |
| Valid JWT, role has capability | Request proceeds to route handler |
| Valid JWT, role lacks capability | 403 |
| After inserting a new capability row for a role (no restart) | Request now proceeds |

The last test is the most important — verify that adding a DB row is enough to grant access.

---

### Acceptance Criteria

- [ ] `Capability` table exists with migration, seeded with ≥8 rows across 3 roles
- [ ] `requireCapability('order:forward')` blocks a `customer` role with a 403
- [ ] Inserting a new capability row grants access without restarting the server
- [ ] Missing or expired JWT returns 401 (not 403)
- [ ] The DB is queried at most once per capability check per request (caching on `req`)

### Stretch Goals

1. Support per-customer overrides: a `CustomerCapabilityOverride` table lets a partner grant additional capabilities to specific customers, checked by the middleware after the role-level check
2. Build `GET /admin/roles/:role/capabilities` returning the capability list for that role — so an admin UI could display and edit permissions without a DB client
