# Null Ping Android — Roadmap

| Phase | Scope | Exit condition | Status |
|---|---|---|---|
| 0 | Repository audit | State and risks documented | COMPLETED |
| 1 | Project foundation | Install, lockfile, lint, typecheck, tests, Android build and launch | SCAFFOLDED — ANDROID BUILD PENDING |
| 2 | Design system/navigation | RTL-ready tested theme/navigation | PARTIAL — FOUR-SCREEN NAVIGATION SHELL |
| 3 | Dashboard | Real disconnected/empty states | UI IMPLEMENTED — NATIVE DATA PENDING |
| 4 | API/local storage | Backend contract validated; secure auth/cache | NOT STARTED |
| 5 | Kotlin bridge | Typed async bridge and lifecycle tests | PARTIAL — STATUS + CAPABILITY API |
| 6 | Xray integration | Pinned engine packaged and launched | NOT STARTED |
| 7 | VPN service | Real tunnel start/stop/revoke/recovery verified | NOT STARTED |
| 8 | Server management | Verified server inventory and measured health | PLACEHOLDER UI ONLY |
| 9 | Traffic monitoring | Verified throughput and cumulative counters | EMPTY STATES ONLY |
| 10 | Interactive globe | Verified locations and performance fallback | MAP PLACEHOLDER ONLY |
| 11 | Subscription | Actual backend integration | NOT STARTED |
| 12 | Security audit | Findings triaged; blockers closed | NOT STARTED |
| 13 | Automated testing | Required suites completed | BASELINE CREATED; CI PASSING |
| 14 | Optimization | Memory, battery and rendering budgets met | NOT STARTED |
| 15 | Release | Signed artifact and release checklist | NOT STARTED |

## Current UI milestone

The app now contains a Persian RTL-oriented four-tab shell: Home, Servers, Activity and Settings. Server selection is interactive, but the displayed locations are sample UI data only. Ping, load, traffic and connection state are deliberately not fabricated. The globe area is a placeholder, not a geographic map.

UI presence alone does not complete a phase. VPN, telemetry, availability and location claims require measured or verified sources.


## Native bridge milestone

The local Expo module now exposes a typed JavaScript API for the native connection status and an explicit capability report. The current Android implementation truthfully reports that VPN permission handling, the foreground VPN service and Xray integration are not implemented. This is a bridge contract only; it does not start a tunnel.
