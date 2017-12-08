DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id serial PRIMARY KEY,
  google_id text,
  first_name text,
  last_name text,
  email text,
  phone integer,
  teacher_type text,
  school_id integer,
  finance_person_name text,
  finance_person_email text,
  finance_person_phone integer,
  complete_profile boolean,
  user_level integer
);

DROP TABLE IF EXISTS registrations;
CREATE TABLE registrations(
  id serial PRIMARY KEY,
  teacher_id integer,
  conference_id integer,
  conference_year integer,
  invoice_id integer,
  status text
);

DROP TABLE IF EXISTS students;
CREATE TABLE students(
  id serial PRIMARY KEY,
  teacher_id integer,
  school_id integer,
  first_name text,
  last_name text,
  graduation_year integer,
  thespian_status boolean
);

DROP TABLE IF EXISTS registered_students;
CREATE TABLE registered_students(
  id serial PRIMARY KEY,
  teacher_id integer,
  student_id integer,
  registration_id integer
);

DROP TABLE IF EXISTS solo_duo_ies;
CREATE TABLE solo_duo_ies(
  id serial PRIMARY KEY,
  event_id integer,
  event_type_id text,
  registration_id integer,
  primary_student_id integer,
  secondary_student_id integer,
  piece_title text,
  piece_author text,
  piece_publisher text
);

DROP TABLE IF EXISTS group_ies;
CREATE TABLE group_ies(
  id serial PRIMARY KEY,
  event_id integer,
  event_type_id text,
  registration_id integer,
  piece_name text,
  piece_author text,
  piece_publisher text
);

DROP TABLE IF EXISTS group_ies_students;
CREATE TABLE group_ies_students(
  id serial PRIMARY KEY,
  event_id integer,
  registration_id integer,
  group_ies_id integer,
  student_id integer,
  piece_name text
);

DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice(
  id serial PRIMARY KEY,
  teacher_id integer,
  school_id integer,
  conference_id integer,
  registration_id integer,
  total_thespians integer,
  total_non_thespians integer,
  total_cost money
);

-- Admins only:
DROP TABLE IF EXISTS conferences;
CREATE TABLE conferences(
  id serial PRIMARY KEY,
  title text,
  year integer,
  registration_status text,
  registration_deadline text,
  location_name text,
  location_address text,
  location_city text,
  location_state text,
  location_zip integer
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions(
  id serial PRIMARY KEY,
  conference_id integer,
  session_name text,
  start_time text,
  end_time text
);

DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms(
  id serial PRIMARY KEY,
  conference_id integer,
  session_id integer,
  event_type_id integer,
  room_name text,
  max_allowed integer
);

DROP TABLE IF EXISTS schools;
CREATE TABLE schools(
  id serial PRIMARY KEY,
  school_name text,
  school_address text,
  school_city text,
  school_state text,
  school_zip integer
);

DROP TABLE IF EXISTS events;
CREATE TABLE events(
  id serial PRIMARY KEY,
  event_name text,
  event_type text
);