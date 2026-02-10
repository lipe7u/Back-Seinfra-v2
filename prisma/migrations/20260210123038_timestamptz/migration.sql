-- AlterTable
ALTER TABLE "record_orders" ALTER COLUMN "creation_date" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "concluded_date" SET DATA TYPE TIMESTAMPTZ(6);
