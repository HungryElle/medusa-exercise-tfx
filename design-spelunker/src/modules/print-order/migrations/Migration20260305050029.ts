import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260305050029 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "selection_draft" ("id" text not null, "customer_id" text not null, "partner_id" text null, "status" text check ("status" in ('draft', 'forwarded', 'completed')) not null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "selection_draft_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_selection_draft_deleted_at" ON "selection_draft" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "selection_item" ("id" text not null, "draft_id_id" text not null, "design_id" text not null, "colorway_id" text not null, "quantity" integer null, "notes" text null, "sent_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "selection_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_selection_item_draft_id_id" ON "selection_item" ("draft_id_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_selection_item_deleted_at" ON "selection_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "selection_item" add constraint "selection_item_draft_id_id_foreign" foreign key ("draft_id_id") references "selection_draft" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "selection_item" drop constraint if exists "selection_item_draft_id_id_foreign";`);

    this.addSql(`drop table if exists "selection_draft" cascade;`);

    this.addSql(`drop table if exists "selection_item" cascade;`);
  }

}
