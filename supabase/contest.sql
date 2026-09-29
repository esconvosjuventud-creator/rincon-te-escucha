-- Additive installation; does not alter existing youth proposals or profiles.
begin;
create sequence public.rural_women_codes maxvalue 9999;
revoke all on sequence public.rural_women_codes from public,anon,authenticated;
grant usage,select on sequence public.rural_women_codes to service_role;
create function public.rural_women_next_code() returns text language sql security invoker set search_path='' as $$ select 'MR-2026-' || lpad(nextval('public.rural_women_codes')::text,4,'0') $$;
revoke all on function public.rural_women_next_code() from public,anon,authenticated;
grant execute on function public.rural_women_next_code() to service_role;
create table public.rural_women_logo_submissions (
 id uuid primary key default gen_random_uuid(), request_token uuid not null unique,
 submission_code text not null unique check(submission_code ~ '^MR-2026-[0-9]{4}$'),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 full_name text not null, birth_date date not null, age integer not null check(age between 0 and 130),
 city text not null,department text not null,phone text not null,email text not null,
 proposal_name text not null default '',proposal_description text not null,palette text not null,
 submission_method text not null check(submission_method in ('file','link')),
 main_file_url text,complementary_file_url text,external_main_url text,external_complementary_url text,
 tools_used text[] not null,ai_used boolean not null,ai_details text not null default '',is_minor boolean not null,
 guardian_name text,guardian_document text,guardian_phone text,guardian_email text,guardian_accepted boolean not null,
 authorship_accepted boolean not null check(authorship_accepted), rights_accepted boolean not null check(rights_accepted),
 terms_accepted boolean not null check(terms_accepted),institutional_use_accepted boolean not null check(institutional_use_accepted),terms_version text not null,
 status text not null default 'received' check(status in ('received','under_review','valid','needs_review','excluded','evaluated','winner','special_mention')),
 internal_notes text check(length(internal_notes)<=5000),
 check(not is_minor or (guardian_accepted and length(guardian_name)>0 and length(guardian_document)>0 and length(guardian_phone)>0 and length(guardian_email)>0)),
 check(not ai_used or length(ai_details)>0),
 check((submission_method='file' and main_file_url is not null) or (submission_method='link' and external_main_url ~ '^https?://'))
);
create index rural_women_created_idx on public.rural_women_logo_submissions(created_at desc);
create trigger rural_women_updated before update on public.rural_women_logo_submissions for each row execute function public.rte_set_updated_at();
alter table public.rural_women_logo_submissions enable row level security;
revoke all on public.rural_women_logo_submissions from anon,authenticated;
grant select on public.rural_women_logo_submissions to authenticated;
grant update(status,internal_notes) on public.rural_women_logo_submissions to authenticated;
grant all on public.rural_women_logo_submissions to service_role;
create policy "contest staff reads" on public.rural_women_logo_submissions for select to authenticated using(public.rte_is_staff());
create policy "contest staff updates" on public.rural_women_logo_submissions for update to authenticated using(public.rte_is_staff()) with check(public.rte_is_staff());
create table public.rural_women_results (
 id integer primary key default 1 check(id=1),published boolean not null default false,
 proposal_name text not null default '',author text not null default '',image_url text not null default '',rationale text not null default '',mentions text not null default '',
 evaluations_released boolean not null default false,
 check(not published or (length(proposal_name)>0 and length(author)>0 and image_url ~ '^https://' and length(rationale)>0))
);
insert into public.rural_women_results(id) values(1);
alter table public.rural_women_results enable row level security;
revoke all on public.rural_women_results from anon,authenticated;
grant select on public.rural_women_results to anon,authenticated;
grant update on public.rural_women_results to authenticated;
create policy "contest published result" on public.rural_women_results for select to anon,authenticated using(published);
create policy "contest staff result read" on public.rural_women_results for select to authenticated using(public.rte_is_staff());
create policy "contest staff result update" on public.rural_women_results for update to authenticated using(public.rte_is_staff()) with check(public.rte_is_staff());
create table public.rural_women_evaluations (
 submission_id uuid not null references public.rural_women_logo_submissions(id) on delete cascade,
 juror_id uuid not null references auth.users(id),scores integer[] not null,
 notes text not null default '' check(length(notes)<=5000),updated_at timestamptz not null default now(),
 primary key(submission_id,juror_id),
 constraint rural_women_scores_shape check(array_ndims(scores)=1 and array_lower(scores,1)=1),
 check(array_length(scores,1)=10 and array_position(scores,null) is null and 0<=all(scores) and scores[1]<=20 and scores[2]<=15 and scores[3]<=15 and scores[4]<=10 and scores[5]<=10 and scores[6]<=10 and scores[7]<=5 and scores[8]<=5 and scores[9]<=5 and scores[10]<=5)
);
alter table public.rural_women_evaluations enable row level security;
revoke all on public.rural_women_evaluations from anon,authenticated;
grant select,insert,update on public.rural_women_evaluations to authenticated;
create policy "contest juror reads own until release" on public.rural_women_evaluations for select to authenticated using(public.rte_is_staff() and (juror_id=(select auth.uid()) or exists(select 1 from public.rural_women_results where evaluations_released)));
create policy "contest juror inserts own" on public.rural_women_evaluations for insert to authenticated with check(public.rte_is_staff() and juror_id=(select auth.uid()));
create policy "contest juror updates own" on public.rural_women_evaluations for update to authenticated using(public.rte_is_staff() and juror_id=(select auth.uid())) with check(public.rte_is_staff() and juror_id=(select auth.uid()));
create trigger rural_women_eval_updated before update on public.rural_women_evaluations for each row execute function public.rte_set_updated_at();
create table public.rural_women_events(id bigint generated always as identity primary key,created_at timestamptz not null default now(),event text not null check(event in ('visit','start_click','terms','download','share','form_started','form_completed')));
alter table public.rural_women_events enable row level security;
revoke all on public.rural_women_events from anon,authenticated;
grant insert(event) on public.rural_women_events to anon,authenticated;
grant usage on sequence public.rural_women_events_id_seq to anon,authenticated;
grant select on public.rural_women_events to authenticated;
create policy "contest anonymous counters" on public.rural_women_events for insert to anon,authenticated with check(true);
create policy "contest staff counters" on public.rural_women_events for select to authenticated using(public.rte_is_staff());
-- Idempotency and request throttling are server-only, never exposed to clients.
create table public.rural_women_request_limits(key text primary key,window_start timestamptz not null default now(),attempts integer not null default 1);
alter table public.rural_women_request_limits enable row level security;
revoke all on public.rural_women_request_limits from anon,authenticated;
grant all on public.rural_women_request_limits to service_role;
create function public.rural_women_allow_request(p_key text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into public.rural_women_request_limits(key) values(p_key)
 on conflict(key) do update set attempts=case when public.rural_women_request_limits.window_start<now()-interval '1 hour' then 1 else public.rural_women_request_limits.attempts+1 end, window_start=case when public.rural_women_request_limits.window_start<now()-interval '1 hour' then now() else public.rural_women_request_limits.window_start end returning attempts into n;
 delete from public.rural_women_request_limits where window_start<now()-interval '1 day';
 return n<=20;
end $$;
revoke all on function public.rural_women_allow_request(text) from public,anon,authenticated;
grant execute on function public.rural_women_allow_request(text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('rural-women-contest-2026','rural-women-contest-2026',false,10485760,array['image/png','image/jpeg','application/pdf']);
create policy "contest staff private files" on storage.objects for select to authenticated using(bucket_id='rural-women-contest-2026' and public.rte_is_staff());
commit;
