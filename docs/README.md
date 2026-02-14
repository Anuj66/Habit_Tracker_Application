# Habit Tracker Documentation Index

Version: v0.1.0 • Last Updated: 2026-02-14

## Table of Contents
- [Project Plan](PROJECT_DOCUMENTATION.md)
- [Implementation Plan](IMPLEMENTATION_PLAN.md)
- [Quick Start](#quick-start)
- [Troubleshooting](#troubleshooting)
- [Contribution Guidelines](#contribution-guidelines)

## Descriptions
- Project Plan: Cost analysis, CI/CD, UI/UX, timelines, risks, sprint policy
- Implementation Plan: Architecture, data model, security, notifications, analytics, MVP

## Quick Start
- Clone: git clone git@github.com:Anuj66/Habit_Tracker_Application.git
- Open docs: Browse files in docs/, or view published site via GitHub Pages
- Run Docker web preview: docker build -t habit-tracker:web . && docker run -p 8080:80 habit-tracker:web

## Troubleshooting
- Pages not updating: Ensure main branch push succeeded; check Actions logs
- Broken links: Fix paths in docs; CI will report via the link checker
- Local Docker build fails: Install Docker Desktop and retry; verify network

## Contribution Guidelines
- Use simple, clear language; avoid secrets in documentation
- Keep sections short; add links rather than duplicating content
- Update this index when adding new docs; bump Version and Last Updated

