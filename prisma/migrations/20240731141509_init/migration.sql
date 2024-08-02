/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `TermsAgreement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TermsAgreement_user_id_key" ON "TermsAgreement"("user_id");

-- AddForeignKey
ALTER TABLE "TermsAgreement" ADD CONSTRAINT "TermsAgreement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
