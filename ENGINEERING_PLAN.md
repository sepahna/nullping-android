# Null Ping Android — Engineering Plan

**Status:** Phase 0 audit completed; Phase 1 not started.  
**Date:** 2026-11-16  
**Package proposal:** `ir.nullping.android`

## Repository audit

- Public repository: `sepahna/nullping-android`
- Default branch metadata: `main`
- Connected GitHub permissions: admin, maintain, push
- Git repository is empty: no commits, refs, source files, README, dependencies or workflows
- No source code has been modified and no dependencies have been installed

## Architecture decision

Use React Native + TypeScript for UI and orchestration; Expo Development Build/prebuild for tooling; Kotlin for Android VPN/service lifecycle; Xray-core as the real data plane. Expo is not a replacement for `VpnService` or native lifecycle management.

- State: Zustand
- Durable non-secret cache: SQLite
- API: typed REST client with runtime response validation, only after the real backend contract is supplied
- Charts: React Native Skia after exact Expo/RN version compatibility is pinned
- Globe: Three.js with a React Native-compatible GL renderer after an Android proof-of-concept; MapLibre RN may be used for detailed maps, not assumed to provide identical globe support across native versions
- Package manager: pnpm with committed lockfile
- Tests: Jest, React Native Testing Library, Kotlin tests, Gradle build and real-device VPN tests

## Critical risks

1. Xray Android packaging and Go mobile/AAR integration must be researched and pinned before implementation.
2. VPN permission, TUN lifecycle, foreground service, notification, revoke handling and Android background limits must remain Kotlin-owned.
3. DNS, IPv4/IPv6 routing and leak prevention need end-to-end tests.
4. Expo/RN/native dependency versions must be resolved as a compatible matrix before installation.
5. Globe rendering must be benchmarked on mid-range devices with a low-cost fallback.
6. Backend endpoints must not be invented; obtain its OpenAPI/spec and sanitized examples first.
7. Public repo means every commit is public; secrets, subscription URLs and production configs must never be committed.

## Roadmap

- Phase 0 — Repository audit: COMPLETED
- Phase 1 — Foundation: minimal Expo/RN TypeScript scaffold, conventions, scripts, Android baseline and CI
- Phase 2 — Design system/navigation: premium theme, Persian RTL, localization
- Phase 3 — Dashboard: truthful disconnected/empty states, no fake telemetry
- Phase 4 — API/local storage: actual backend contract, auth, secure credential storage
- Phase 5 — Kotlin bridge: typed async commands/events and lifecycle contract
- Phase 6–7 — Xray + VPN service: real tunnel proof and failure/revoke/recovery tests
- Phase 8 — Server management: verified metadata and measured health/latency
- Phase 9 — Traffic monitoring: measured throughput and cumulative counters
- Phase 10 — 3D globe: verified geodata and performance fallback
- Phase 11 — Subscription integration
- Phase 12–14 — Security, automated testing and optimization
- Phase 15 — Signed APK/AAB and release checklist

## Phase 1 acceptance

Reproducible pnpm install; strict TypeScript check; ESLint; Jest baseline; Android Gradle debug build; CI for install/lint/typecheck/tests; Persian RTL foundation; no VPN feature marked operational before native device verification.
