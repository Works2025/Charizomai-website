-- Activity Logs Table (Audit Trail)
create table if not exists activity_logs (
    id uuid primary key default uuid_generate_v4(),
    user_email text,
    action text not null,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
