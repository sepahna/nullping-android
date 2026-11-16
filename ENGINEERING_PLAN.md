# Null Ping Android — Engineering Plan

**Product model:** Native Android VPN client derived from v2rayNG; preserve engine and app logic, redesign UI only.  
**Status:** Reference audit completed; upstream source import not yet performed.  
**Reference:** https://github.com/2dust/v2rayNG  
**License:** GPL-3.0.  
**Target package proposal:** `ir.nullping.android`

## Product definition

Null Ping is a rebranded and visually redesigned Android client based on v2rayNG. Users import individual configurations or subscription URLs, manage profiles and connect through the existing native engine.

## Non-negotiable implementation decision

**Do not rewrite or replace the VPN engine. Do not port this app to React Native.** Keep upstream Android/Kotlin/Jetpack Compose, Xray AAR integration, HEV native components, VPN services, parsers, subscriptions, routing, settings and profile persistence.

The task is UI redesign inside the existing Compose architecture. Existing actions, ViewModels, state contracts, imports, profile IDs, connection lifecycle and native services remain authoritative.

## Reference audit

- Upstream: `2dust/v2rayNG`, default branch `master`
- Android project: `V2rayNG/`
- UI: Kotlin + Jetpack Compose + Material 3
- Existing main UI contract: `MainScreen`, `MainViewModel`, `MainAction`, `MainUiState`
- `MainActivity` owns platform flows: VPN permission, start/stop service, QR scan, clipboard/file import, profile editor and navigation
- Core/service code has separate ownership boundaries and must not change for a visual-only task
- Native components are provided through upstream submodules and generated artifacts; preserve exact upstream revisions
- Upstream repository is GPL-3.0 licensed

## Design and UI decisions

1. Redesign Compose screens/components in existing UI packages.
2. Keep state/business logic in existing ViewModels and repositories; composables dispatch existing actions.
3. Preserve QR, clipboard, file, manual profile editing, subscription refresh and navigation.
4. Keep current core start/stop/test actions wired to existing MainActivity/MainViewModel handlers.
5. Preserve profile GUID and subscription group IDs as stable identity.
6. Add Persian-first RTL visual design and retain supported locales/resources.
7. No fake connection states, pings, server metadata, traffic graphs or globe coordinates.
8. First milestone is UI-only; do not change Gradle dependencies, native packaging or service lifecycle.

## Visual direction

- Premium dark-first Null Ping identity with optional light theme
- Persian-first RTL layout
- Clear connection dashboard and large connect/disconnect control
- Selected profile card with country/protocol labels from existing profile data
- Quick import actions: clipboard/link, QR, file, manual
- Existing profile/group list re-presented as polished selectable cards
- Real ping and traffic data only where upstream state exposes them
- Secondary screens remain accessible through navigation/drawer
- Globe/route visualization is a later optional layer using verified metadata only

## Roadmap

- Phase 0 — Audit upstream repository, agent guides, UI contracts, build workflow and license: COMPLETED
- Phase 1 — Import exact upstream source and submodule gitlinks: NOT STARTED
- Phase 2 — Baseline build of unmodified upstream-derived project: NOT STARTED
- Phase 3 — Null Ping Compose design system/theme and app identity: NOT STARTED
- Phase 4 — Main dashboard visual redesign preserving actions/state: NOT STARTED
- Phase 5 — Profile list/cards, groups, import UI and dialogs: NOT STARTED
- Phase 6 — Secondary screens and Persian RTL/resource consistency: NOT STARTED
- Phase 7 — UI regression/accessibility/focus/state-restoration tests: NOT STARTED
- Phase 8 — Build, APK inspection and device validation: NOT STARTED

## Acceptance criteria for first UI milestone

- App builds from imported upstream project using its documented Gradle workflow.
- Existing import methods still create profiles through upstream code.
- Profile selection still uses GUID.
- Connect/disconnect still goes through existing MainActivity/LauncherManager paths.
- QR and subscription update flows remain operational.
- VPN/proxy-only/root mode branches remain unchanged.
- Visible strings and accessibility labels use Android resources and supported locales.
- Screenshot checks are supplemented by interaction/state/persistence tests.

## License and distribution

The upstream project reports GPL-3.0. A derivative distribution must follow GPL-3.0 obligations, including preserving notices and providing corresponding source as required. Verify exact license text and all dependency/submodule obligations before release.
