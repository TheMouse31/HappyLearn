-- Main levée pendant une session live (élève → professeur)
alter table session_participants
  add column if not exists hand_raised boolean not null default false;

alter table session_participants
  add column if not exists hand_raised_at timestamptz;
