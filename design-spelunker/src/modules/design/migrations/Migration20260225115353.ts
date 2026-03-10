import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260225115353 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "design" add column if not exists "designer_credit" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop column if exists "designer_credit";`);
  }

}
