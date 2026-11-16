# Null Ping Android — Architecture

## Source of truth

The upstream v2rayNG Android project is the application and core foundation. Null Ping changes the presentation layer only.

```text
Existing v2rayNG Android application (Kotlin)
  ├── MainActivity (platform permissions / import / service dispatch)
  ├── MainViewModel + MainAction + MainUiState (authoritative UI state/actions)
  ├── Existing profile repository + MMKV persistence
  ├── Existing config parsers / subscription import and refresh
  ├── Existing QR / clipboard / file import flows
  ├── Existing Xray core AAR and HEV native components
  └── Existing VPN / proxy-only / root service lifecycle
                     |
                     v
       Null Ping visual redesign (Jetpack Compose)
       Theme / typography / RTL / dashboard / profile cards
       Dispatches existing actions; does not own core logic
```

## Product boundary

Null Ping is a v2rayNG-derived client. It does not provision VPN servers, sell subscriptions or require a custom backend for the core connect flow. Users provide their own profiles/subscriptions.

## Preserve existing behavior

- Existing `MainActivity` remains responsible for Android platform activity results and permission flows.
- Existing `MainViewModel`, `MainAction`, and `MainUiState` remain the source of truth for main-screen state.
- Import, editing, sharing, QR, subscription, profile identity and service start/stop remain in upstream owners.
- Preserve service modes: VPN, proxy-only and root.
- Preserve upstream submodule gitlinks and generated native inputs. Do not replace native artifacts with guessed binaries.

## UI boundary

Compose UI displays immutable state and dispatches actions. It does not directly manipulate MMKV, repositories, native core or service lifecycles. Follow upstream UI `AGENTS.md` requirements, including resources, accessibility semantics, RTL, focus, keyboard/D-pad behavior and state restoration.

## Package identity

The final application ID may be changed to `ir.nullping.android` only after checking all hard-coded package references, manifest authorities, notification intents, share providers, permissions, deep links, backup rules and flavor/build settings. Package migration is separate from initial UI restyling.
