# Null Ping Android — Roadmap

| Phase | Scope | Exit condition | Status |
|---|---|---|---|
| 0 | Repository audit | State and risks documented | COMPLETED |
| 1 | Project foundation | Install, lockfile, lint, typecheck, tests, Android build and launch | IMPLEMENTED — BUILD VERIFICATION PENDING |
| 2 | Design system/navigation | RTL-ready tested theme/navigation | PARTIAL — RTL SHELL + PROFILE MANAGER |
| 3 | Dashboard | Real disconnected/empty states | UI IMPLEMENTED — NATIVE DATA PENDING |
| 4 | API/local storage | Backend contract validated; secure auth/cache | NOT STARTED |
| 5 | Kotlin bridge | Typed async bridge and lifecycle tests | IMPLEMENTED — START/STOP/STATUS API; DEVICE TEST PENDING |
| 6 | Xray integration | Pinned engine packaged and launched | IMPLEMENTED IN CODE — GOMOBILE AAR BUILD PENDING |
| 7 | VPN service | Real tunnel start/stop/revoke/recovery verified | SERVICE CODE ADDED — DEVICE VERIFICATION PENDING |
| 8 | Server management | Verified server inventory and measured health | PROFILE IMPORT/LIST/SELECT IMPLEMENTED; HEALTH TEST PENDING |
| 9 | Traffic monitoring | Verified throughput and cumulative counters | EMPTY STATES ONLY |
| 10 | Interactive globe | Verified locations and performance fallback | MAP PLACEHOLDER ONLY |
| 11 | Subscription | Actual backend integration | URL IMPORT + MANUAL REFRESH IMPLEMENTED; AUTO-REFRESH PENDING |
| 12 | Security audit | Findings triaged; blockers closed | NOT STARTED |
| 13 | Automated testing | Required suites completed | BASELINE CREATED; CI PASSING |
| 14 | Optimization | Memory, battery and rendering budgets met | NOT STARTED |
| 15 | Release | Signed artifact and release checklist | NOT STARTED |

## Current UI milestone

The app now contains a Persian RTL-oriented dashboard and a real local profile manager. It accepts VLESS, VMess, Trojan, Shadowsocks, SOCKS and HTTP links, including Base64-encoded subscription responses. Raw profile links and subscription URLs are stored in Android-backed SecureStore. Manual refresh reconciles a subscription's profile list. Clash YAML, QR scanning, subscription auto-refresh and live ping/traffic telemetry are not implemented yet.

The native Kotlin path now creates an Android VPN permission flow, foreground `VpnService`, TUN interface and starts the pinned Xray controller through a gomobile AAR built in CI. The service code and generated config still need a successful CI build and physical-device verification. A running service alone is not proof that the remote proxy is reachable.


## Native bridge milestone

The local Expo module exposes typed status/capability methods plus `startVpn(rawProxyUri)` and `stopVpn()`. Kotlin builds an Xray JSON configuration, requests Android VPN permission, creates a foreground `VpnService`, and starts the Xray core from the pinned AndroidLibXrayLite source. The AAR/APK build and physical-device tunnel tests are still pending.
