# Null Ping Android

An Android VPN client foundation built with React Native, TypeScript, Expo SDK 58 and Kotlin.

> **Current state:** Phase 1 scaffold is on `develop/phase-1-foundation`. This is not a working VPN client yet. No VPN tunnel, Xray engine, backend, server inventory or live telemetry is implemented.

## Stack

- Expo SDK 58 / React Native 0.88 / React 19.3
- TypeScript strict mode
- Kotlin local Expo module placeholder
- pnpm 10 / Node.js 22.13+
- ESLint, Node test runner and GitHub Actions

## Quick start

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm prebuild:android
pnpm android
```

Use a machine with Android SDK and JDK 17 for native Android builds. The first install should generate `pnpm-lock.yaml`; commit it and switch CI to frozen-lockfile installs before treating builds as reproducible.

## Project notes

- [Engineering Plan](ENGINEERING_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- [Roadmap](ROADMAP.md)
- [Security Policy](SECURITY.md)
- [Testing Strategy](TESTING.md)
- [Changelog](CHANGELOG.md)

Never commit production credentials, subscription URLs, private keys, signing keystores or raw proxy configurations. This repository is public.

## Continuous integration

GitHub Actions runs TypeScript, ESLint and unit tests on pushes to development branches and pull requests targeting main. The pnpm cache is intentionally disabled until the first verified lockfile is committed.
