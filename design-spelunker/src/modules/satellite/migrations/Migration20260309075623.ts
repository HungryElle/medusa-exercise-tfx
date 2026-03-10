import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260309075623 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "partner" drop constraint if exists "partner_link_code_unique";`);
    this.addSql(`create table if not exists "partner" ("id" text not null, "name" text not null, "email" text null, "link_code" text null, "link_code_expires_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "partner_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_partner_link_code_unique" ON "partner" ("link_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_partner_deleted_at" ON "partner" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customer_partner_link" ("id" text not null, "partner_id_id" text not null, "customer_id" text not null, "link_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_partner_link_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_partner_link_partner_id_id" ON "customer_partner_link" ("partner_id_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_partner_link_deleted_at" ON "customer_partner_link" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "customer_partner_link" add constraint "customer_partner_link_partner_id_id_foreign" foreign key ("partner_id_id") references "partner" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customer_partner_link" drop constraint if exists "customer_partner_link_partner_id_id_foreign";`);

    this.addSql(`drop table if exists "partner" cascade;`);

    this.addSql(`drop table if exists "customer_partner_link" cascade;`);
  }

}
