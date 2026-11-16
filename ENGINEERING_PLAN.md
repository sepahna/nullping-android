# Null Ping Android — Engineering Plan

**Status:** Phase 1 scaffold committed; local verification pending.  
**Date:** 2026-11-16  
**Android package:** `ir.nullping.android`

## Repository

- Public repository: `sepahna/nullping-android`
- Main branch preserved.
- Development branch: `develop/phase-1-foundation`
- Every commit is public. Never commit credentials, subscription URLs, signing keys or raw proxy configurations.

## Stack decision

- React Native + TypeScript for UI and orchestration.
- Expo SDK 58 / React Native 0.88 / React 19.3.
- Expo prebuild and a local Expo Module for Kotlin integration.
- Kotlin will own Android VPN permissions, foreground service, TUN lifecycle, routing and cleanup.
- Xray-core will be integrated as a later data-plane component; it is not included in Phase 1.
- pnpm 10 and Node.js 22.13+.
- TypeScript strict mode, ESLint flat config, Node test runner and GitHub Actions.

## Phase 1 scaffold

- Expo app manifest and entry point.
- Dark dashboard shell with Persian copy and RTL metadata.
- Local Kotlin Expo module placeholder; reports only `DISCONNECTED` when later exposed to JS.
- TypeScript, ESLint, pnpm scripts, unit-test baseline and CI workflow.
- Git ignore and npm configuration.

## Not yet verified

Files were committed through GitHub. No dependency installation, lockfile generation, Android Gradle build, emulator run or physical-device test has been performed in this environment. CI temporarily installs without a frozen lockfile until a generated pnpm lockfile is committed.

## Next actions

1. Clone this branch and run `corepack enable`, `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test`.
2. Fix dependency or TypeScript issues and commit `pnpm-lock.yaml`.
3. Install `expo-dev-client` using `npx expo install expo-dev-client`.
4. Run `pnpm prebuild:android` and `pnpm android` with Android SDK/JDK 17.
5. Verify local Expo module autolinking and Kotlin compilation.
6. Only then begin the full design system and native VPN lifecycle work.

## Acceptance gate

Phase 1 is complete only after clean install, lockfile, typecheck, lint, tests, Android Gradle build and verified app launch. The current commit is a scaffold, not proof of a successful APK.
