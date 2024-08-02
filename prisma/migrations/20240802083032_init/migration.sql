/*
  Warnings:

  - The primary key for the `TermsAgreement` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TermsAgreement" DROP CONSTRAINT "TermsAgreement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TermsAgreement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TermsAgreement_id_seq";
