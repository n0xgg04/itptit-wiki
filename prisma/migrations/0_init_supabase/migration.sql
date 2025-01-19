-- CreateEnum
CREATE TYPE "messages_role" AS ENUM ('system', 'user', 'model');

-- CreateTable
CREATE TABLE "bands" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_by_uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" VARCHAR NOT NULL,
    "dob" DATE NOT NULL,
    "gender" SMALLINT NOT NULL DEFAULT 0,
    "team" BIGINT NOT NULL,
    "batch" BIGINT NOT NULL,
    "student_code" VARCHAR NOT NULL,
    "class_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "facebook_link" VARCHAR,
    "main_pic" VARCHAR NOT NULL,
    "phone_number" VARCHAR,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members_in_band" (
    "id" BIGSERIAL NOT NULL,
    "member_id" UUID NOT NULL,
    "band_id" BIGINT,

    CONSTRAINT "members_in_band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members_in_project_team" (
    "id" BIGSERIAL NOT NULL,
    "member_id" UUID NOT NULL,
    "project_team_id" BIGINT,

    CONSTRAINT "members_in_project_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "conversation_id" UUID NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_uuid" UUID NOT NULL,
    "role" "messages_role" DEFAULT 'user',

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "description" TEXT,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions_held" (
    "id" BIGSERIAL NOT NULL,
    "member_id" UUID NOT NULL,
    "from" DATE NOT NULL,
    "to" DATE,
    "is_ended" BOOLEAN DEFAULT false,
    "position_id" BIGINT,

    CONSTRAINT "positions_held_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_teams" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_inject" (
    "id" BIGSERIAL NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "prompt_inject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_auth" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_auth_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_uuid_fkey" FOREIGN KEY ("created_by_uuid") REFERENCES "users_auth"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_team_fkey" FOREIGN KEY ("team") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_in_band" ADD CONSTRAINT "members_in_band_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_in_band" ADD CONSTRAINT "members_in_band_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_in_project_team" ADD CONSTRAINT "members_in_project_team_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members_in_project_team" ADD CONSTRAINT "members_in_project_team_project_team_id_fkey" FOREIGN KEY ("project_team_id") REFERENCES "project_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_created_by_uuid_fkey" FOREIGN KEY ("created_by_uuid") REFERENCES "users_auth"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions_held" ADD CONSTRAINT "positions_held_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions_held" ADD CONSTRAINT "positions_held_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

