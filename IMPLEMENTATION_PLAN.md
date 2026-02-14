# Habit Tracker Application — Implementation Plan

## Overview
A cross-platform mobile app (Android/iOS) for creating habits, tracking daily/weekly completion, maintaining streaks, receiving reminders, and reviewing progress. The app is offline-first with secure cloud sync and push notifications.

## Objectives
- Fast, polished mobile experience with consistent UI across iOS/Android
- Offline-first tracking with seamless background sync
- Secure authentication and row-level data isolation
- Reliable local reminders and remote push notifications
- Clear analytics for product iteration and growth

## Technology Stack
- Mobile UI: Flutter (stable channel) + Dart (>= 3.x)
  - State management: Riverpod (recommended) or Bloc
  - Navigation: go_router (typed routes, deep links)
  - Persistence: Drift (SQLite) for offline cache
  - Theming: Material/Cupertino with light/dark, semantic colors
- Backend: Supabase (managed Postgres, Auth, Storage, Edge Functions)
  - Database: Postgres with normalized tables and indexes
  - Auth: Email/password, magic link, OAuth providers
  - Security: Row Level Security (RLS) with policies per user_id
  - Functions: Edge Functions (TypeScript/Deno) for server-side logic
  - Realtime: subscriptions for habit/log updates (optional)
- Notifications:
  - Local: flutter_local_notifications for scheduled reminders
  - Push: OneSignal (cross-platform) or native FCM/APNs
- Analytics: PostHog SDK (events, funnels, retention)
- CI/CD: Codemagic (builds, signing, TestFlight/Play Console deploys)
- Quality:
  - Static analysis: dart analyze; formatting: dart format
  - Testing: unit, widget, integration using Flutter test framework

## Architecture
- Layers:
  - Presentation: Flutter screens/widgets
  - State: Riverpod providers/notifiers for business logic
  - Data: Repository pattern wrapping local Drift + remote Supabase
  - Services: Auth, Notifications, Analytics, Sync
- Offline-first workflow:
  - Write-through to local DB; enqueue sync jobs
  - Background sync merges local changes with server; conflict resolution by timestamp and user prompts for collisions
- Error handling:
  - Centralized error types; user-friendly retries and diagnostics
- Configuration:
  - Environment-aware setup (dev/staging/prod) via .env/remote config

## Data Model
- users
  - id (uuid, pk)
- habits
  - id (uuid, pk)
  - user_id (uuid, fk -> users.id)
  - name (text)
  - cadence (enum: daily, weekly)
  - reminder_time (time with time zone, nullable)
  - color (text, hex or semantic)
  - icon (text, catalog key)
  - archived (boolean, default false)
  - created_at (timestamp)
- habit_logs
  - id (uuid, pk)
  - habit_id (uuid, fk -> habits.id)
  - date (date, user’s timezone normalised to UTC midnight)
  - status (enum: done, skipped)
  - note (text, nullable)
  - created_at (timestamp)
- settings
  - id (uuid, pk)
  - user_id (uuid, fk)
  - timezone (text)
  - notify_enabled (boolean)
  - theme (enum: system, light, dark)

Indexes:
- habits (user_id, archived)
- habit_logs (habit_id, date unique per habit)
- settings (user_id unique)

Derived metrics (computed client-side or via views):
- current_streak, longest_streak per habit
- weekly completion rates, monthly heatmaps

## Security & Policies (Supabase)
- Enable RLS on habits, habit_logs, settings
- Policies:
  - SELECT/INSERT/UPDATE/DELETE only when record.user_id = auth.uid()
- Auth flows:
  - Email/password and magic link
  - OAuth providers (optional): Google, Apple
- Secrets management:
  - Store API keys in secure CI/CD variables and app keystores

## Sync Strategy
- Startup: pull latest changes for user’s habits/logs/settings
- Mutation: write to local cache, enqueue remote write
- Background: periodic sync; exponential backoff on failures
- Conflict resolution: last-write-wins with user-visible conflict banners for manual reconciliation when needed

## Notifications
- Local reminders:
  - Schedule per-habit notification at reminder_time respecting timezone and cadence
  - Snooze options and quick actions (mark done)
- Push notifications:
  - Nudges for missed habits, streak milestones, weekly summaries
  - OneSignal setup connected to FCM/APNs credentials

## Analytics & KPIs
- Events:
  - habit_create, habit_update, habit_archive
  - log_mark_done, log_mark_skipped
  - streak_milestone, reminder_snooze, reminder_open
- KPIs:
  - DAU/WAU
  - Habit creation rate
  - Completion rate per cadence
  - Streak distribution
  - Reminder engagement rate

## UX & Design Guidelines
- List view: card-based habits with accent color/icon, large tap targets
- Check-in: single-tap done/undo, haptic feedback
- Calendar strip: swipe for days; heatmap for monthly review
- Accessibility: scalable fonts, high contrast mode, screen reader labels
- Theming: light/dark; per-habit accent colors

## Project Setup Steps
1. Create Supabase project; configure Auth providers; set Storage buckets
2. Define schemas for users, habits, habit_logs, settings; enable RLS and policies
3. Initialize Flutter app; add dependencies:
   - flutter_riverpod, go_router, drift, drift_sqflite
   - supabase_flutter, flutter_local_notifications
   - onesignal_flutter or firebase_messaging
   - posthog_flutter
4. Implement core providers and repositories (auth, habits, logs, settings)
5. Build MVP screens: Habit List, Create/Edit Habit, Daily Check-in, Weekly Summary
6. Wire local notifications and push registration
7. Implement sync layer between Drift and Supabase
8. Add analytics events; privacy opt-out
9. Write tests: unit (repositories), widget (screens), integration (auth + flows)
10. Set up Codemagic pipelines for dev/testflight/play console

## Environments
- Development: local builds with dev Supabase project
- Staging: pre-release testing; push/analytics to staging configs
- Production: store builds with production Supabase and notification keys

## CI/CD Pipeline (Codemagic)
- Build jobs: Android (AAB), iOS (IPA)
- Automated tests and static analysis gates
- Code signing: secure keystores and certificates
- Deployment: TestFlight and Play Console tracks

## MVP Scope (Release 1)
- Create/edit/archive habits with color/icon and reminder time
- Daily/weekly views with check-ins and streaks
- Local notifications; timezone-aware scheduling
- Auth + cloud sync; offline support with conflict handling
- Basic analytics dashboards

## Future Enhancements (Prioritized)
Priority P1 (High):
- Home screen widgets (iOS/Android) with quick check-ins
- Smart reminders (adaptive based on completion history)
- Calendar heatmap and weekly goals with progress rings
- Siri Shortcuts / Android App Shortcuts for “Mark habit done”
- Wear OS / Apple Watch companion for glanceable check-ins

Priority P2 (Medium):
- Social features: shared habits, challenges, leaderboards
- Habit templates and guided habit creation
- Multi-language (i18n) and RTL support
- Data export/import (CSV/JSON), backups
- In-app streak celebrations and gamification badges

Priority P3 (Lower):
- AI suggestions: habit recommendations and best-time predictions
- Mood tracking and correlation with habit completion
- Attachments: photos/notes per check-in
- Location-based reminders (geofencing)

Add-on Components:
- Subscriptions (Stripe/RevenueCat): premium themes, advanced analytics, widgets
- Health integrations: Apple Health / Google Fit for activity-based habits
- Calendar sync: integrate with device calendars for visibility
- Admin dashboard (internal): moderate templates, review analytics

## Risks & Mitigations
- Notification reliability: combine local scheduling with push redundancy
- Timezone/streak correctness: normalize dates and test edge cases
- Offline conflicts: clear UX for resolution; audit trails
- Store review policies: privacy, data usage disclosures, opt-out

## Monitoring & Support
- Error/reporting: Sentry-style crash reporting (optional)
- Metrics dashboards in PostHog; cohort and retention tracking
- In-app feedback form and FAQs

## Acceptance Criteria (MVP)
- Users can create habits, receive reminders, and mark completion daily/weekly
- Streaks update correctly across timezone changes and offline periods
- Data is isolated per user via RLS and secure auth
- App passes accessibility checks and static analysis/tests
- CI/CD produces signed builds; beta distributions run without critical issues

