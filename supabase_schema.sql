-- ============================================================
-- MathMaster — Full Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 0. Extensions ────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- for gen_random_uuid()

-- ── 1. USERS ─────────────────────────────────────────────────
-- Custom users table (mirrors auth.users for app-specific data)
create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);

-- ── 2. TOPICS ────────────────────────────────────────────────
create table public.topics (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  color      text not null default '#4A7CF7',
  "order"    int not null default 0,
  user_id    uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.topics enable row level security;

create policy "Anyone can read topics"
  on public.topics for select
  using (true);

create policy "Authenticated users can insert topics"
  on public.topics for insert
  with check (auth.uid() is not null);

-- ── 3. SUBTOPICS ─────────────────────────────────────────────
create table public.subtopics (
  id         uuid primary key default gen_random_uuid(),
  topic_id   uuid not null references public.topics(id) on delete cascade,
  name       text not null,
  slug       text not null,
  depth      text not null default 'core'
             check (depth in ('core', 'intermediate', 'advanced')),
  "order"    int not null default 0,
  user_id    uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_subtopics_topic on public.subtopics(topic_id);
create index idx_subtopics_slug  on public.subtopics(slug);

alter table public.subtopics enable row level security;

create policy "Anyone can read subtopics"
  on public.subtopics for select
  using (true);

create policy "Authenticated users can insert subtopics"
  on public.subtopics for insert
  with check (auth.uid() is not null);

-- ── 4. STUDY GUIDES ─────────────────────────────────────────
create table public.study_guides (
  id           uuid primary key default gen_random_uuid(),
  subtopic_id  uuid not null references public.subtopics(id) on delete cascade,
  content      text not null,
  model        text,
  generated_at timestamptz default now()
);

create index idx_study_guides_subtopic on public.study_guides(subtopic_id);

alter table public.study_guides enable row level security;

create policy "Anyone can read study guides"
  on public.study_guides for select
  using (true);

create policy "Authenticated users can insert study guides"
  on public.study_guides for insert
  with check (auth.uid() is not null);

-- ── 5. VIDEO LINKS ───────────────────────────────────────────
create table public.video_links (
  id            uuid primary key default gen_random_uuid(),
  subtopic_id   uuid not null references public.subtopics(id) on delete cascade,
  video_id      text not null,
  title         text not null,
  channel_title text,
  thumbnail_url text,
  "order"       int not null default 0,
  created_at    timestamptz default now()
);

create index idx_video_links_subtopic on public.video_links(subtopic_id);

alter table public.video_links enable row level security;

create policy "Anyone can read video links"
  on public.video_links for select
  using (true);

create policy "Authenticated users can insert video links"
  on public.video_links for insert
  with check (auth.uid() is not null);

-- ── 6. USER PROGRESS ────────────────────────────────────────
create table public.user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  subtopic_id  uuid not null references public.subtopics(id) on delete cascade,
  status       text not null default 'not_started'
               check (status in ('not_started', 'in_progress', 'mastered')),
  updated_at   timestamptz default now(),
  unique(user_id, subtopic_id)
);

create index idx_user_progress_user on public.user_progress(user_id);

alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- ── 7. QUIZ ATTEMPTS ────────────────────────────────────────
create table public.quiz_attempts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  subtopic_slug    text not null,
  difficulty       text not null default 'core',
  score            int not null,
  total            int not null,
  passed           boolean not null default false,
  pass_percentage  int not null default 80,
  seed             bigint,
  duration_seconds int,
  answers_json     jsonb,
  created_at       timestamptz default now()
);

create index idx_quiz_attempts_user      on public.quiz_attempts(user_id);
create index idx_quiz_attempts_created   on public.quiz_attempts(created_at desc);

alter table public.quiz_attempts enable row level security;

create policy "Users can read own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- ── 8. USER STREAKS ─────────────────────────────────────────
create table public.user_streaks (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  current_streak   int not null default 0,
  longest_streak   int not null default 0,
  last_active_date date,
  xp_total         int not null default 0,
  level            int not null default 0
);

alter table public.user_streaks enable row level security;

create policy "Users can read own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- ── 9. USER BADGES ──────────────────────────────────────────
create table public.user_badges (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  badge_slug text not null,
  earned_at  timestamptz default now(),
  unique(user_id, badge_slug)
);

create index idx_user_badges_user on public.user_badges(user_id);

alter table public.user_badges enable row level security;

create policy "Users can read own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- ── 10. LEADERBOARD OPT-IN ─────────────────────────────────
create table public.leaderboard_opt_in (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  opted_in     boolean not null default false,
  display_name text,
  created_at   timestamptz default now()
);

alter table public.leaderboard_opt_in enable row level security;

create policy "Users can read own opt-in"
  on public.leaderboard_opt_in for select
  using (auth.uid() = user_id);

create policy "Users can upsert own opt-in"
  on public.leaderboard_opt_in for insert
  with check (auth.uid() = user_id);

create policy "Users can update own opt-in"
  on public.leaderboard_opt_in for update
  using (auth.uid() = user_id);

-- ── 11. TRIGGER: Auto-update streaks/XP/badges on quiz ──────
create or replace function public.handle_quiz_attempt()
returns trigger as $$
declare
  today date := current_date;
  xp_gain int;
begin
  -- Calculate XP: 10 per correct answer + 25 bonus if passed
  xp_gain := NEW.score * 10;
  if NEW.passed then
    xp_gain := xp_gain + 25;
  end if;

  -- Upsert streak row
  insert into public.user_streaks (user_id, current_streak, longest_streak, last_active_date, xp_total, level)
  values (NEW.user_id, 1, 1, today, xp_gain, 0)
  on conflict (user_id) do update set
    xp_total = user_streaks.xp_total + xp_gain,
    current_streak = case
      when user_streaks.last_active_date = today then user_streaks.current_streak
      when user_streaks.last_active_date = today - 1 then user_streaks.current_streak + 1
      else 1
    end,
    longest_streak = greatest(
      user_streaks.longest_streak,
      case
        when user_streaks.last_active_date = today then user_streaks.current_streak
        when user_streaks.last_active_date = today - 1 then user_streaks.current_streak + 1
        else 1
      end
    ),
    last_active_date = today,
    level = floor(sqrt((user_streaks.xp_total + xp_gain) / 50.0))::int;

  -- Update user_progress status
  insert into public.user_progress (user_id, subtopic_id, status, updated_at)
  select NEW.user_id, s.id,
    case when NEW.passed then 'mastered' else 'in_progress' end,
    now()
  from public.subtopics s
  where s.slug = NEW.subtopic_slug
  on conflict (user_id, subtopic_id) do update set
    status = case
      when excluded.status = 'mastered' then 'mastered'
      else user_progress.status
    end,
    updated_at = now();

  -- Badge: perfect_score
  if NEW.score = NEW.total then
    insert into public.user_badges (user_id, badge_slug)
    values (NEW.user_id, 'perfect_score')
    on conflict do nothing;
  end if;

  -- Badge: first_mastery
  if NEW.passed then
    insert into public.user_badges (user_id, badge_slug)
    values (NEW.user_id, 'first_mastery')
    on conflict do nothing;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_quiz_attempt_insert
  after insert on public.quiz_attempts
  for each row execute function public.handle_quiz_attempt();

-- ── 12. TRIGGER: Auto-create user row on auth signup ────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username)
  values (
    NEW.id,
    coalesce(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  -- Also create initial streak row
  insert into public.user_streaks (user_id)
  values (NEW.id)
  on conflict (user_id) do nothing;

  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- DONE! Your schema is ready.
-- ============================================================
