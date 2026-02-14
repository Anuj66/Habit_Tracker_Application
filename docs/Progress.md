# Progress

## Current Progress
- Repository initialized, SSH configured, commits and pushes via CI
- Documentation reorganized under docs/ with index and MkDocs config
- CI/CD:
  - Main pipeline: analyze, test, Trivy security scan, Docker image build/push
  - Docs Pages: build MkDocs, link and accessibility checks, deploy to GitHub Pages
- Docker:
  - Multi-stage build producing NGINX static image for web preview
- PWA:
  - iPhone-installable Habit Tracker PWA with local storage, offline SW
  - Daily check-ins, categories, difficulty, notes, chart and streaks
  - Export JSON backup and ICS calendar for reminders

## Todo Items
- P1: Enable Pages in repo settings; set Source to GitHub Actions (ETA: 1 day)
- P1: Supabase schemas and RLS policies (ETA: 2 days)
- P1: Flutter app routing and Riverpod bootstrap (ETA: 2 days)
- P2: Sync layer (Drift ↔ Supabase) with conflicts (ETA: 3 days)
- P2: OneSignal push integration; opt-in (ETA: 2 days)
- P2: Weekly summary and heatmap views (ETA: 2 days)
- P3: i18n and RTL support (ETA: 3 days)
- P3: Widgets and watch integrations (ETA: 5 days)

## Next Enhancement Points (Next.js)
- Static docs site alternative using Next.js with MDX
  - Strategy: Next.js 14 App Router, contentlayer for MDX, shadcn/ui
  - Requirements: Node 18+, Vercel or GitHub Pages via static export
  - SEO: next-seo, sitemap & robots, Open Graph tags
- PWA version with Next.js
  - Strategy: next-pwa for service worker, workbox caching
  - Requirements: Static export for GitHub Pages, basePath set to /Habit_Tracker_Application
  - Accessibility: eslint-plugin-jsx-a11y, Lighthouse CI
- Versioned docs
  - Strategy: next-mdx-remote + routing per version; or vendored build outputs per tag
  - Requirements: script to generate version directories and deploy via Pages

## Future Enhancements
- Encryption-at-rest for PWA data; passcode lock
- Habit templates and guided setup
- Social sharing and challenges (privacy-aware)
- Advanced analytics and cohort retention dashboards
- Offline-first conflict resolution UI

## Deployment Checklist
- Confirm GitHub Pages enabled and uses GitHub Actions source
- Ensure site URL configured: https://anuj66.github.io/Habit_Tracker_Application/
- Optional custom domain configured with DNS CNAME
- CI green: analyze, tests, security scan
- Docs build artifact uploaded and deployed
- Manual verification: open docs index, navigate pages, validate PWA at /pwa/
- Accessibility and link checks pass or issues triaged

## Docs Build Reliability Fixes
- Replaced invalid package mkdocs-sitemap-plugin with mkdocs-sitemap
- Pinned MkDocs and Material to stable minor versions
- Added pip upgrade for pip/setuptools/wheel and enabled pip cache
- Implemented 3-attempt retry loop for pip installs to mitigate network hiccups
- Added verification commands to print mkdocs version and installed packages
- Post-deploy verification curls published URL and PWA assets
