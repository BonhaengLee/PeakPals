-- CreateTable
CREATE TABLE "TermsAgreement" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "service" BOOLEAN NOT NULL,
    "privacy" BOOLEAN NOT NULL,
    "marketing" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermsAgreement_pkey" PRIMARY KEY ("id")
);
