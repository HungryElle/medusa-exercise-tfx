import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260311084519 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "design" add column if not exists "reserved" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "reserved";`);
  }

}
