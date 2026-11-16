# Null Ping Android — Engineering Plan

**Status:** Profile import and initial native Xray/VPN implementation committed; Android build and device verification pending.  
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
- Xray-core is built from pinned `2dust/AndroidLibXrayLite` source (LGPL-3.0) into a gomobile AAR during CI; Kotlin owns the Android `VpnService`, TUN descriptor and lifecycle.
- pnpm 10 and Node.js 22.13+.
- TypeScript strict mode, ESLint flat config, Node test runner and GitHub Actions.

## Implemented milestones

- Persian RTL dashboard and profile management screen.
- Manual import and subscription URL import for VLESS, VMess, Trojan, Shadowsocks, SOCKS and HTTP links; Base64 subscription payloads are supported. Clash YAML is not supported yet.
- Profile raw links and subscription URLs are stored with Expo SecureStore; non-secret index metadata is stored separately.
- Manual subscription refresh reconciles added and removed profiles.
- Kotlin Xray JSON builder and Android VPN permission activity / foreground `VpnService`.
- Native bridge exposes start, stop, status and capability methods.
- CI builds the pinned AndroidLibXrayLite Go library as an AAR before the Android APK.

## Verification status

- TypeScript and lint checks have passed on earlier commits; the latest full quality run is in progress.
- The Xray AAR and APK have not yet completed successfully in CI.
- No emulator or physical-device tunnel test has been performed. A successful Gradle build alone will not prove a working remote connection.

## Not yet verified

- Xray AAR build and Android Gradle build must complete in GitHub Actions.
- VPN permission prompt, service lifecycle, IPv4/IPv6 routing, DNS and real server reachability must be tested on a physical Android device.
- Subscription formats outside plain/Base64 proxy URI lists (including Clash YAML) are not implemented.

## Next actions

1. Complete the CI Go/gomobile Xray AAR build and release APK build.
2. Fix any Kotlin, NDK, Gradle or packaging failures reported by CI.
3. Install on a physical Android device and verify VPN permission, connect, disconnect, revoke and error recovery.
4. Test representative VLESS Reality/TLS, VMess, Trojan and Shadowsocks profiles against real endpoints.
5. Verify IPv4, IPv6, DNS behavior and traffic routing; do not claim successful connectivity until these checks pass.
6. Add subscription auto-refresh, QR/file import and Clash YAML only after the current import and tunnel path is stable.

## Acceptance gate

Phase 1 is complete only after clean install, lockfile, typecheck, lint, tests, Android Gradle build and verified app launch. The current commit is a scaffold, not proof of a successful APK.


## Native bridge contract (initial)

The local module package exports:
- `getVpnStatus()`: validated connection-state string from Kotlin.
- `getVpnCapabilities()`: platform and implementation flags.
- `startVpn(rawProxyUri)`: builds the Xray JSON and opens Android's VPN permission flow.
- `stopVpn()`: stops the foreground VPN service.

The Kotlin service currently creates a TUN interface and starts the gomobile Xray controller. These methods are implementation code, not verified device behavior yet; the CI build and real-device test remain release gates.
