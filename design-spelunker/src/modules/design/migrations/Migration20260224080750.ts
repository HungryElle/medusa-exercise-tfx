import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260224080750 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "design" ("id" text not null, "name" text not null, "description" text null, "tags" text[] not null, "slug" text not null, "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "design_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_deleted_at" ON "design" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "design" cascade;`);
  }

}
