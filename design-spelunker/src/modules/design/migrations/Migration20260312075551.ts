import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260312075551 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "design" add column if not exists "payload_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "payload_id";`);
  }

}
