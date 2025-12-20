-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Causes Table
create table if not exists causes (
  id bigint primary key generated always as identity,
  title text not null,
  badge text,
  description text,
  raised numeric default 0,
  goal numeric not null,
  image_url text,
  color text,
  organizer text,
  location text,
  story jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Donations Table
create table if not exists donations (
  id uuid primary key default uuid_generate_v4(),
  donor_name text not null,
  email text not null,
  amount numeric not null,
  cause_id bigint references causes(id),
  is_anonymous boolean default false,
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contact Messages Table
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events Table
create table if not exists events (
  id bigint primary key generated always as identity,
  title text not null,
  date timestamp with time zone not null,
  location text,
  capacity int,
  status text default 'upcoming',
  image_url text,
  category text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Event Registrations Table
create table if not exists event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id bigint references events(id),
  attendee_name text not null,
  email text not null,
  phone text,
  ticket_code text unique,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Donors Table (for tracking unique donors and their stats)
create table if not exists donors (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  phone text,
  total_donated numeric default 0,
  donation_count int default 0,
  last_donation_at timestamp with time zone,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaigns Table (for Newsletters)
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  subject text not null,
  content text,
  audience text default 'all',
  status text default 'draft', -- draft, sent
  sent_at timestamp with time zone,
  opens int default 0,
  clicks int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin Settings Table (Key-Value store for config)
create table if not exists admin_settings (
  key text primary key, -- e.g. 'payment_gateway', 'sms_provider'
  value text,
  category text, -- 'payment', 'sms', 'email', 'general'
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Causes
insert into causes (title, badge, description, raised, goal, image_url, color, organizer, location, story)
values
('Education for All', 'Education', 'Constructing 12 new classrooms in Tamale and Yendi districts. Providing desks, textbooks, and teaching materials for 2,000+ students.', 7500000, 10000000, '/charity-children-books.jpg', 'var(--primary-color)', 'Charizomai Education Team', 'Northern Region, Ghana', '["In Tamale and Yendi, over 2,000 children attend classes under trees or in buildings with collapsed roofs. During the rainy season, school stops completely.", "We''re building 12 permanent classrooms across 6 schools. Each classroom will have proper desks, a chalkboard, and a small library. We''re also training 15 teachers in modern teaching methods.", "So far, we''ve completed 9 classrooms. The remaining GH₵2.5M will finish the last 3 classrooms and stock all 12 with textbooks and supplies. Classes are already running in the completed buildings."]'),
('Rural Healthcare', 'Healthcare', 'Operating 3 mobile clinics in Volta Region. Monthly visits to 25 villages. Free consultations, medications, and maternal health services.', 2200000, 5000000, '/volunteer-female-supplies.jpg', '#E74C3C', 'Dr. Mensah & Team', 'Volta Region, Ghana', '["25 villages in Volta Region are more than 30km from the nearest clinic. Pregnant women often give birth at home without medical help. Basic illnesses go untreated.", "Our 3 mobile clinics visit each village monthly. Dr. Mensah''s team provides check-ups, vaccinations, malaria treatment, and prenatal care. We''ve delivered over 50 babies safely in the past year.", "We need GH₵2.8M more to keep the clinics running for another 18 months and to purchase a fourth vehicle to reach 10 additional villages."]'),
('Clean Water Project', 'Clean Water', 'Drilling 8 boreholes in Upper East Region. Installing hand pumps and training local maintenance teams. Serving 4,500 people.', 4500000, 5000000, '/community-outreach-field.jpg', 'var(--brand-teal)', 'Water for Life NGO', 'Upper East Region, Ghana', '["In Bolgatanga district, women and children walk 5km daily to fetch water from contaminated ponds. Waterborne diseases are common, especially during dry season.", "We''ve drilled 7 boreholes so far, each serving 500-600 people. We install Afridev hand pumps and train 3 local technicians per village to maintain them. All 7 are working perfectly.", "The final GH₵500K will drill the 8th borehole in Zuarungu village and provide spare parts for all 8 pumps for the next 3 years."]'),
('Women Empowerment Program', 'Empowerment', '6-month vocational training in Kumasi. Teaching sewing, hairdressing, and soap making. Providing startup kits and GH₵500-2,000 microloans.', 1800000, 3000000, '/volunteer-organizing-food.jpg', '#9B59B6', 'Women''s Development Initiative', 'Ashanti Region, Ghana', '["320 women in Kumasi''s Asawase and Aboabo neighborhoods have no income. Most dropped out of school early and lack job skills.", "We run 6-month courses in sewing (40 women), hairdressing (30 women), and soap making (25 women). Each graduate gets a startup kit - sewing machine, salon equipment, or soap-making supplies - plus a GH₵500-2,000 loan at 5% interest.", "We''ve trained 95 women so far. 78 are now running their own businesses. The remaining GH₵1.2M will train 100 more women and provide their startup kits."]'),
('Youth Skills Training', 'Youth Development', '3-month tech bootcamp in Accra. Teaching web development, graphic design, and digital marketing. Job placement with 15 partner companies.', 900000, 2000000, '/team-prayer-circle.jpg', '#3498DB', 'Youth Futures Ghana', 'Greater Accra, Ghana', '["In Nima and Jamestown, hundreds of youth aged 18-25 are unemployed. Most have finished SHS but can''t afford university. They need marketable skills.", "Our bootcamp runs 3 months, Monday to Friday. Students learn coding (HTML, CSS, JavaScript), graphic design (Photoshop, Illustrator), or digital marketing. We provide laptops during training.", "42 youth have completed the program. 31 got jobs with our partner companies earning GH₵800-1,500/month. 8 started freelancing. We need GH₵1.1M to train 60 more youth."]'),
('Food Security Initiative', 'Nutrition', 'Supporting 80 farmers in Cape Coast with seeds and tools. Running school feeding program for 1,200 children. Daily hot meals during term time.', 3200000, 6000000, '/volunteer-male-supplies.jpg', '#27AE60', 'Food for All Ghana', 'Central Region, Ghana', '["In Cape Coast''s Abakam and Pedu communities, children come to school hungry. 80 local farmers struggle with poor yields due to lack of quality seeds and tools.", "We give farmers improved maize and vegetable seeds, fertilizer, and basic tools. They sell us their harvest at fair prices. We use this to cook hot meals for 1,200 children in 4 schools - rice with beans, gari and fish, or banku with soup.", "We''ve served over 180,000 meals this year. Teachers report better attendance and concentration. We need GH₵2.8M to continue for another year and expand to 3 more schools."]');

-- Seed Events
insert into events (title, date, location, capacity, status, image_url, category, description)
values
('Annual Charity Gala Night', '2025-12-15 18:00:00+00', 'Kempinski Hotel, Accra', 100, 'upcoming', '/hero-4.jpg', 'Fundraiser', 'An evening of elegance and giving. All proceeds go towards our education initiatives.'),
('Community Health Outreach', '2026-01-20 08:00:00+00', 'Kejetia Market, Kumasi', 50, 'upcoming', '/hero-3.jpg', 'Healthcare', 'Free health screenings and medical consultations for underserved communities.'),
('Walk for Water Awareness', '2026-02-14 06:30:00+00', 'Independence Square', 200, 'upcoming', '/hero-1.jpg', 'Awareness', 'Raising awareness and funds for clean water projects in rural Ghana.'),
('Youth Mentorship Summit', '2026-03-10 09:00:00+00', 'Accra Digital Center', 80, 'upcoming', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80', 'Education', 'Empowering the next generation of leaders with tech skills and career guidance.'),
('Rural Education Drive', '2026-04-05 10:00:00+00', 'Tamale, Northern Region', 100, 'upcoming', '/hero-2.jpg', 'Education', 'Distributing learning materials and inaugurating new classroom blocks.');

-- Seed Default Settings
insert into admin_settings (key, value, category) values
('payment_gateway', 'paystack', 'payment'),
('payment_currency', 'GHS', 'payment'),
('sms_provider', 'twilio', 'sms'),
('email_provider', 'resend', 'email')
on conflict (key) do nothing;

-- Volunteers Table
create table if not exists volunteers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  skills text,
  availability text,
  motivation text,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
