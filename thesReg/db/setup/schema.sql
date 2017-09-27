DROP TABLE IF EXISTS users;
CREATE TABLE users(
  id serial PRIMARY KEY,
  google_id text,
  first_name text,
  last_name text,
  email text,
  phone integer,
  teacher_type text,
  complete_profile boolean,
  user_level integer
);

DROP TABLE IF EXISTS school;
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
  piece_publisher text
);

-- Admins only:
DROP TABLE IF EXISTS conferences;
CREATE TABLE conferences(
  id serial PRIMARY KEY,
  title text,
  year integer,
  registration_status text,
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

DROP TABLE IF EXISTS event;
CREATE TABLE event(
  id serial PRIMARY KEY,
  event_type text,
  number_participating integer
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