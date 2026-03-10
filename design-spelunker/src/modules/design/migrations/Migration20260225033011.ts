import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260225033011 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "createdAt", drop column if exists "updatedAt";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" add column if not exists "createdAt" timestamptz not null, add column if not exists "updatedAt" timestamptz not null;`);
  }

}
