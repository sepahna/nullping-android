# Null Ping Android — Engineering Plan

**Product model:** User-configured VPN client (not a server/sales platform).  
**Status:** Phase 0 audit completed; Phase 1 not started.  
**Date:** 2026-11-16  
**Package proposal:** `ir.nullping.android`

## Repository audit

- Public repository: `sepahna/nullping-android`
- Default branch metadata: `main`
- Connected GitHub permissions: admin, maintain, push
- Initial repository was empty: no commits, refs, source files, dependencies or workflows
- Initial engineering docs were committed; no application code or dependencies have been added

## Product scope

The user imports their own configuration and the app connects to the selected endpoint. Import sources planned: share links/clipboard, QR, local file and subscription URL. The app parses and validates profiles, stores them locally, allows selection and connection, and displays measured connection/traffic information.

This is not a VPN server manager or billing/sales platform. The core client does not require a custom account system, server provisioning API, sales backend or subscription billing API. A user-provided subscription URL is a source of configuration profiles; it is not an app-owned backend.

## Architecture decision

Use React Native + TypeScript for UI and orchestration; Expo Development Build/prebuild for tooling; Kotlin for Android VPN/service lifecycle; Xray-core as the real data plane. Expo is not a replacement for `VpnService` or native lifecycle management.

- State: Zustand
- Durable profile metadata/cache: SQLite; secrets/config material must use a secure-storage design
- Import pipeline: URI/QR/file/subscription input → format detection → strict parse/validation → profile repository → selected profile
- Xray configuration: build/convert a validated internal profile into the exact schema supported by the pinned Xray-core version
- Subscription refresh: explicit user refresh plus optional scheduled refresh; protect subscription URLs and response contents
- Charts: React Native Skia after exact Expo/RN version compatibility is pinned
- Globe: Three.js with a React Native-compatible GL renderer after an Android proof-of-concept; only show verified endpoint coordinates
- Package manager: pnpm with committed lockfile
- Tests: Jest, React Native Testing Library, Kotlin tests, Gradle build and real-device VPN tests

## Critical risks

1. Xray Android packaging and Go mobile/AAR integration must be researched and pinned before implementation.
2. VPN permission, TUN lifecycle, foreground service, notification, revoke handling and Android background limits must remain Kotlin-owned.
3. Imported profiles are untrusted input: parser hardening, size limits, schema validation and safe error handling are required.
4. Subscription URLs may contain bearer credentials; never expose them in logs, analytics, crash reports or screenshots.
5. DNS, IPv4/IPv6 routing and leak prevention need end-to-end tests.
6. Expo/RN/native dependency versions must be resolved as a compatible matrix before installation.
7. Globe rendering must be benchmarked on mid-range devices with a low-cost fallback.
8. Public repo means every commit is public; real profiles, subscription URLs and production configs must never be committed.

## Roadmap

- Phase 0 — Repository audit: COMPLETED
- Phase 1 — Foundation: minimal Expo/RN TypeScript scaffold, conventions, scripts, Android baseline and CI
- Phase 2 — Design system/navigation: premium theme, Persian RTL, localization
- Phase 3 — Dashboard and profile list: honest empty/disconnected states
- Phase 4 — Import pipeline: clipboard/share, QR, file and subscription URL; parser and validation tests
- Phase 5 — Local profile repository and subscription refresh
- Phase 6 — Kotlin bridge: typed async commands/events and lifecycle contract
- Phase 7–8 — Xray + Android VPN service: real tunnel proof and failure/revoke/recovery tests
- Phase 9 — Server/profile latency and health measurement
- Phase 10 — Real-time traffic monitoring
- Phase 11 — 3D globe and endpoint visualization
- Phase 12–14 — Security, automated testing and optimization
- Phase 15 — Signed APK/AAB and release checklist

## Phase 1 acceptance

Reproducible pnpm install; strict TypeScript check; ESLint; Jest baseline; Android Gradle debug build; CI for install/lint/typecheck/tests; Persian RTL foundation; no VPN feature marked operational before native device verification.
