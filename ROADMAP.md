# Null Ping Android — Roadmap

Product scope: a client that imports user-owned VPN profiles/subscriptions and connects through Xray-core.

| Phase | Scope | Exit condition | Status |
|---|---|---|---|
| 0 | Repository audit | State and risks documented | COMPLETED |
| 1 | Project foundation | Reproducible Expo/RN baseline and CI | NOT STARTED |
| 2 | Design system/navigation | RTL-ready tested theme/navigation | NOT STARTED |
| 3 | Dashboard + profile list | Honest empty/disconnected states | NOT STARTED |
| 4 | Import pipeline | Clipboard/share, QR, file and subscription parsing validated | NOT STARTED |
| 5 | Local profile storage | Secure local profiles and safe subscription refresh | NOT STARTED |
| 6 | Kotlin bridge | Typed async bridge and lifecycle tests | NOT STARTED |
| 7 | Xray integration | Pinned engine packaged and launched | NOT STARTED |
| 8 | Android VPN service | Real tunnel start/stop/revoke/recovery verified | NOT STARTED |
| 9 | Endpoint testing | Measured latency with method/source disclosed | NOT STARTED |
| 10 | Traffic monitoring | Verified throughput and cumulative counters | NOT STARTED |
| 11 | Interactive globe | Verified endpoint coordinates and performance fallback | NOT STARTED |
| 12 | Security audit | Findings triaged; blockers closed | NOT STARTED |
| 13 | Automated testing | Required suites completed | NOT STARTED |
| 14 | Optimization | Memory, battery and rendering budgets met | NOT STARTED |
| 15 | Release | Signed artifact and release checklist | NOT STARTED |

The core client does not depend on a custom sales backend, server provisioning API or app-owned subscription billing system. UI presence alone does not complete a phase; connection and telemetry claims require measured or verified sources.
