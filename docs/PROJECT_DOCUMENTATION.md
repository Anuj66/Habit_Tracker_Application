# Habit Tracker Application — Project Plan

## Summary
- Scope: Cross-platform mobile app (Android/iOS) for habit creation, tracking, reminders, and analytics, with offline-first data sync and secure cloud integration.
- Current repo: https://github.com/Anuj66/Habit_Tracker_Application
- Tech: Flutter/Dart, Supabase, Riverpod, go_router, Drift, OneSignal, PostHog, Codemagic/GitHub Actions.

## 1) App Store Cost Analysis
- Apple Developer Program
  - Fee: $99/year (auto-renewing)
  - Commission: 30% standard; 15% under Small Business Program (<$1M annual revenue) and for long-term subscriptions after year 1
  - Additional: App review free; updates free; enterprise distribution via Apple Developer Enterprise Program ($299/year) for internal apps
- Google Play Console
  - Fee: $25 one-time registration (lifetime)
  - Commission: 15–30% (15% for first $1M annual revenue on in-app purchases; 30% standard rate; 15% for subscriptions from day one)
  - Additional: App review free; updates free; Play App Signing required for modern release workflows
- Other Costs
  - CI/CD services, analytics, push notifications, backend hosting (e.g., Supabase paid tiers)
  - Legal: Privacy policy, terms, potential DPO/compliance costs
- Success Criteria
  - Budget documented with annual and monthly projections
  - Clear commission impact scenarios (free app, IAP, subscription)
  - Compliance checklist completed for both stores

## 2) Dockerization & CI/CD
- Container Strategy
  - Build Flutter web artifact for preview and documentation, served via NGINX
  - Use CI containers to run tests, analysis, and build Android artifacts; iOS builds on macOS runner
  - Registry: GHCR for images
- Environment & Secrets
  - Secrets managed in GitHub repository settings
  - .env used locally; never committed
  - Required secrets: SUPABASE_URL, SUPABASE_ANON_KEY, ONESIGNAL_APP_ID, POSTHOG_KEY, REGISTRY_TOKEN (if not using GITHUB_TOKEN)
  - CI/CD Pipeline
  - Lint and test: flutter analyze, flutter test
  - Security scan: Trivy (fs context)
  - Build web and Docker image; push to GHCR
  - Android build: Gradle on Ubuntu runner with Android SDK; iOS build: Xcode on macOS runner (added later)
  - Deployment: container to production infra (e.g., cloud VM or Kubernetes); rollback by redeploying previous image tag
- Success Criteria
  - Green CI on main with tests and analysis
  - Docker image built and pushed with semantic tag
  - Security scan passes or issues triaged
  - Documented rollback steps validated

## 3) Documentation Structure (PROJECT_DOCUMENTATION.md)
- Features
  - v0.1.0: Initial scaffold, theming, CI pipeline and Docker image build (2026‑02‑14)
  - Upcoming: Auth, Habit CRUD, Check-ins, Notifications, Analytics, Offline sync
- TODO (Prioritized)
  - P1: Supabase schemas and RLS; Auth integration; Habit list and CRUD
  - P1: Check-in flow and streak logic; local notifications
  - P1: Sync layer Drift ⇄ Supabase with conflict handling
  - P2: Push notifications via OneSignal; analytics events
  - P2: Weekly summary view and heatmap; settings page
  - P3: Widgets, watch apps, social sharing, i18n
  - Responsibility: Engineering lead; Timeline: see section “Timeline”
- Architecture
  - Layers: Presentation (Flutter), State (Riverpod), Data (Repository), Services (Auth, Notifications, Analytics, Sync)
  - Data model: users, habits, habit_logs, settings with indexes and RLS
  - Deployment: Mobile apps via stores; web preview via container
- API
  - Supabase Postgres tables and RPC/Edge Functions; standard REST via Supabase client
  - Auth via Supabase Auth (email, magic link, OAuth)
- Deployment Procedures
  - CI builds image and pushes to registry
  - Infra pulls latest tag; health checks and canary rollout
  - Rollback via previous image tag; database migrations tracked
- Troubleshooting
  - Build failures: check Flutter versions and SDK cache
  - Push failures: verify SSH keys and GH permissions
  - Notifications: device perms, channel setup, OneSignal dashboard
- Success Criteria
  - Documentation updated each sprint
  - All procedures reproducible by a new engineer

## 4) UI/UX Design Requirements
- Visual Direction
  - Dark-to-navy gradient background with glassmorphism cards
  - Circular progress ring showing daily completion with pastel accents
  - Accent colors: indigo/blue/pink; high-contrast text on blurred surfaces
- Color Tokens
  - Primary: #4F5BD5
  - Secondary: #FF6FAE
  - Info: #7EC8E3
  - Background: #0D1B2A → #1B263B gradient
  - Surface: translucent white with 20–30% opacity
- Typography
  - iOS: SF Pro Display/Text
  - Android: Roboto
  - Hierarchy: H1 32–36, H2 24–28, Body 16, Caption 12–14
- Spacing
  - 8px grid; container padding 16–24; card radius 16–20
- Components
  - Habit Card with icon, title, status, reminder time
  - Progress Ring (animated), Calendar strip, FAB for add habit
  - Bottom nav: Dashboard, Habits, Analytics, Settings
- Breakpoints
  - Phone: 360–480dp baseline; Tablet: 600dp+ adaptive grid; Web preview: responsive layout with max width 720–960
- Platform Guidelines
  - Android: Material Design, ripple/haptic, system bars, back nav
  - iOS: HIG, subtle shadows, navigation bars, swipe back
- Accessibility (WCAG 2.1 AA)
  - Contrast ≥ 4.5:1; scalable fonts; focus indicators; labels for controls; reduced motion option
- Wireframes/Mockups
  - Dashboard: ring, today’s habits list, summary
  - Habit Detail: schedule, reminders, streaks
  - Check-in: mark done/skipped; notes
  - Analytics: weekly completion, heatmap
- User Testing Protocols
  - 5–8 users; tasks: create habit, set reminder, mark completion, review streaks
  - Metrics: task success, time to first habit, daily retention, NPS
- Performance Metrics
  - Cold start < 2s on mid-range devices
  - 60fps on screen transitions; frame jank < 1%
  - Web preview LCP < 2.5s, CLS < 0.1
- Success Criteria
  - Approved design system and tokens implemented
  - Accessibility checks passed
  - Usability test goals met

## Timeline (High-Level)
- Week 1: Supabase setup, schemas, RLS, auth bootstrap
- Week 2: Habit CRUD, list UI, theming, local notifications
- Week 3: Check-in and streak logic, offline sync MVP
- Week 4: Analytics events, weekly summary, polishing
- Continuous: CI/CD hardening, tests, documentation updates

## Resource Allocation
- Engineering: 1–2 mobile engineers, 0.5 backend/infra engineer
- Design: 0.5 product designer
- QA: 0.5 QA for test plans and manual passes

## Risks & Mitigation
- iOS build requirements: use macOS runners and Xcode; plan for provisioning profiles early
- Notification reliability: combine local reminders with push; monitor delivery stats
- Timezone/streak correctness: normalize dates; add unit tests for edge cases
- Store rejections: adhere to guidelines; privacy and data use disclosures
- Data sync conflicts: clear UX and audit trails; last-write-wins with prompts

## Sprint Update Policy
- Update this document after each sprint with:
  - New features and version bump
  - Risks encountered and resolutions
  - Metrics snapshot and next sprint goals

