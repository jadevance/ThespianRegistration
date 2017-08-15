DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id serial PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  phone integer,
  teacher_type text -- high school or middle school
);

DROP TABLE IF EXISTS school:
CREATE TABLE school(
  id serial PRIMARY KEY,
  teacher_id integer,
  school_name text,
  school_address text,
  school_city text,
  school_state text,
  school_zip integer,
  finance_person_name text,
  finance_person_email text,
  finance_person_phone integer
);

DROP TABLE IF EXISTS student;
CREATE TABLE student(
  id serial PRIMARY KEY,
  teacher_id integer,
  school_id integer,
  first_name text,
  last_name text,
  graduation_year integer,
  thespian_status boolean
);

DROP TABLE IF EXISTS individual_event;
CREATE TABLE individual_event(
  id serial PRIMARY KEY,
  event_id integer,
  primary_student_id integer,
  partner_id integer,
  piece_name text,
  piece_author text,
  piece_publisher text,
);

DROP TABLE IF EXISTS conference;
CREATE TABLE conference(
  id serial PRIMARY KEY,
  title text,
  year integer,
  registration_status text
);

DROP TABLE IF EXISTS session;
CREATE TABLE session(
  id serial PRIMARY KEY,
  conference_id integer,
  session_time time(0)
);

DROP TABLE IF EXISTS room;
CREATE TABLE room(
  id serial PRIMARY KEY,
  session_id integer,
  event_id integer,
  room_name text,
  max_allowed integer
);

DROP TABLE IF EXISTS event;
CREATE TABLE event(
  id serial PRIMARY KEY,
  event_type text, --performance, technical, audition, workshop
  number_participating integer -- 1 (solo musical, monologue, stage managing, etc), 2 (duet musical, duo scene),
                               -- 3 (group musical) 3 will indicate number participating is >= 3
);

DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice(
  id serial PRIMARY KEY,
  teacher_id integer,
  school_id integer,
  conference_id integer,
  total_thespians integer,
  total_non_thespians integer,
  total_cost money
);
