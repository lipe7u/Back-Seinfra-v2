-- AlterTable
ALTER TABLE "record_orders" ALTER COLUMN "concluded_date" DROP DEFAULT,
ALTER COLUMN "concluded_date" SET DATA TYPE TIMESTAMP(3);
