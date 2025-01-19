-- Database Structure Dump

-- Table: bands
-- Description: Small team in club with special functions
CREATE TABLE bands
(
    id bigint,
    name character varying,
    description text,
    logo_url text,
    created_at timestamp with time zone
);

-- Index: bands_pkey
CREATE UNIQUE INDEX bands_pkey ON public.bands USING btree (id);

-- Table: conversations
-- Description: Chat conversation
CREATE TABLE conversations
(
    id uuid,
    created_by_uuid uuid,
    created_at timestamp with time zone
);


-- Table: members
CREATE TABLE members
(
    id uuid,
    fullname character varying,
    dob date,
    gender smallint,
    team bigint,
    batch bigint,
    student_code character varying,
    class_name character varying,
    email character varying,
    facebook_link character varying,
    main_pic character varying,
    phone_number character varying
);

-- Foreign Key: members_team_fkey, Column: team, References: team(id)
ALTER TABLE members ADD CONSTRAINT members_team_fkey FOREIGN KEY (team) REFERENCES team (id);
-- Index: members_pkey
CREATE UNIQUE INDEX members_pkey ON public.members USING btree (id);

-- Table: members_in_band
CREATE TABLE members_in_band
(
    id bigint,
    member_id uuid,
    band_id bigint
);

-- Foreign Key: members_in_band_band_id_fkey, Column: band_id, References: bands(id)
ALTER TABLE members_in_band ADD CONSTRAINT members_in_band_band_id_fkey FOREIGN KEY (band_id) REFERENCES bands (id);
-- Foreign Key: members_in_band_member_id_fkey, Column: member_id, References: members(id)
ALTER TABLE members_in_band ADD CONSTRAINT members_in_band_member_id_fkey FOREIGN KEY (member_id) REFERENCES members (id);
-- Index: members_in_band_pkey
CREATE UNIQUE INDEX members_in_band_pkey ON public.members_in_band USING btree (id);

-- Table: members_in_project_team
CREATE TABLE members_in_project_team
(
    id bigint,
    member_id uuid,
    project_team_id bigint
);

-- Foreign Key: members_in_project_team_member_id_fkey, Column: member_id, References: members(id)
ALTER TABLE members_in_project_team ADD CONSTRAINT members_in_project_team_member_id_fkey FOREIGN KEY (member_id) REFERENCES members (id);
-- Foreign Key: members_in_project_team_project_team_id_fkey, Column: project_team_id, References: project_teams(id)
ALTER TABLE members_in_project_team ADD CONSTRAINT members_in_project_team_project_team_id_fkey FOREIGN KEY (project_team_id) REFERENCES project_teams (id);
-- Index: members_in_project_team_pkey
CREATE UNIQUE INDEX members_in_project_team_pkey ON public.members_in_project_team USING btree (id);

-- Table: messages
-- Description: Chat messages
CREATE TABLE messages
(
    id bigint,
    conversation_id uuid,
    content text,
    created_at timestamp with time zone,
    created_by_uuid uuid,
    role messages_role
);

-- Foreign Key: messages_conversation_id_fkey, Column: conversation_id, References: conversations(id)
ALTER TABLE messages ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES conversations (id);
-- Foreign Key: messages_create_by_uuid_fkey, Column: created_by_uuid, References: auth.users(id)
ALTER TABLE messages ADD CONSTRAINT messages_create_by_uuid_fkey FOREIGN KEY (created_by_uuid) REFERENCES auth.users (id);
-- Index: messages_pkey
CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

-- Table: positions
-- Description: Positions
CREATE TABLE positions
(
    id bigint,
    name character varying,
    description text
);

-- Index: positions_pkey
CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (id);

-- Table: positions_held
CREATE TABLE positions_held
(
    id bigint,
    member_id uuid,
    from date,
    to date,
    is_ended boolean,
    position_id bigint
);

-- Foreign Key: positions_held_member_id_fkey, Column: member_id, References: members(id)
ALTER TABLE positions_held ADD CONSTRAINT positions_held_member_id_fkey FOREIGN KEY (member_id) REFERENCES members (id);
-- Foreign Key: positions_held_position_id_fkey, Column: position_id, References: positions(id)
ALTER TABLE positions_held ADD CONSTRAINT positions_held_position_id_fkey FOREIGN KEY (position_id) REFERENCES positions (id);
-- Index: positions_held_pkey
CREATE UNIQUE INDEX positions_held_pkey ON public.positions_held USING btree (id);

-- Table: project_teams
CREATE TABLE project_teams
(
    id bigint,
    name character varying,
    description text,
    logo_url text,
    created_at timestamp with time zone
);

-- Index: project_teams_pkey
CREATE UNIQUE INDEX project_teams_pkey ON public.project_teams USING btree (id);

-- Table: team
-- Description: List of teams in this club
CREATE TABLE team
(
    id bigint,
    name character varying,
    created_at timestamp with time zone
);

-- Index: team_pkey
CREATE UNIQUE INDEX team_pkey ON public.team USING btree (id);
