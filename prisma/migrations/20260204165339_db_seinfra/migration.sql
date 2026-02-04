/*
  Warnings:

  - You are about to drop the `atribuicoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cadastro_colaborador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imagens_ordens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registro_ordens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `setores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "atribuicoes" DROP CONSTRAINT "atribuicoes_id_resp_fkey";

-- DropForeignKey
ALTER TABLE "atribuicoes" DROP CONSTRAINT "atribuicoes_ordem_fkey";

-- DropForeignKey
ALTER TABLE "cadastro_colaborador" DROP CONSTRAINT "cadastro_colaborador_setor_id_fkey";

-- DropForeignKey
ALTER TABLE "imagens_ordens" DROP CONSTRAINT "imagens_ordens_id_os_fkey";

-- DropForeignKey
ALTER TABLE "registro_ordens" DROP CONSTRAINT "registro_ordens_id_solicitante_fkey";

-- DropForeignKey
ALTER TABLE "registro_ordens" DROP CONSTRAINT "registro_ordens_setor_resp_fkey";

-- DropTable
DROP TABLE "atribuicoes";

-- DropTable
DROP TABLE "cadastro_colaborador";

-- DropTable
DROP TABLE "imagens_ordens";

-- DropTable
DROP TABLE "registro_ordens";

-- DropTable
DROP TABLE "setores";

-- DropTable
DROP TABLE "usuarios";

-- CreateTable
CREATE TABLE "record_orders" (
    "id_order" SERIAL NOT NULL,
    "id_applicant" INTEGER,
    "sector_resp" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creation_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "concluded_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "justification" TEXT,

    CONSTRAINT "record_orders_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id_sector" SERIAL NOT NULL,
    "name_setor" TEXT NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id_sector")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "name" VARCHAR(200),
    "phone" VARCHAR(20) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "password_hash" VARCHAR(60),
    "Admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "record_orders" ADD CONSTRAINT "record_orders_id_applicant_fkey" FOREIGN KEY ("id_applicant") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "record_orders" ADD CONSTRAINT "record_orders_sector_resp_fkey" FOREIGN KEY ("sector_resp") REFERENCES "sectors"("id_sector") ON DELETE NO ACTION ON UPDATE NO ACTION;
