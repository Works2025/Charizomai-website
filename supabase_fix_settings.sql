-- COPY AND RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create the missing admin_settings table
create table if not exists admin_settings (
  key text primary key,
  value text,
  category text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (Optional but recommended)
alter table admin_settings enable row level security;

-- 3. Allow access (Modify as needed for security)
create policy "Allow full access to authenticated users" 
on admin_settings for all 
using (true) 
with check (true);

-- 4. Insert default settings
insert into admin_settings (key, value, category) values
('payment_gateway', 'paystack', 'payment'),
('payment_currency', 'GHS', 'payment'),
('sms_provider', 'twilio', 'sms'),
('email_provider', 'resend', 'email')
on conflict (key) do nothing;
