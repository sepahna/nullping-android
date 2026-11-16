# Null Ping Android

A client-side Android VPN application. Users import their own VPN profiles or subscription links and connect through the integrated Xray-core engine.

> Current status: engineering documentation/bootstrap only. No operational VPN functionality is implemented.

## Client capabilities (planned)

- Import supported share links, QR codes, local configuration files and subscription URLs
- Parse, validate, organize, rename and remove local profiles
- Refresh subscription profiles on user request and a configurable schedule
- Measure endpoint latency and show the measurement time/source
- Connect/disconnect using Android VpnService + Xray-core
- Display real traffic counters, session duration and connection state
- Optional interactive globe using verified endpoint metadata

Supported protocols and configuration formats will be determined by the pinned Xray-core version and verified parser tests. The app must reject unsupported or malformed profiles clearly.

## Product boundary

This is a VPN **client**, not a server control panel or VPN sales backend. No mandatory Null Ping account, custom authentication service, server provisioning API or subscription billing API is required for the core connection flow. A subscription URL is user-imported configuration data, not an app-owned backend.

## Engineering documents

- [Engineering Plan](ENGINEERING_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- [Roadmap](ROADMAP.md)
- [Security Policy](SECURITY.md)
- [Testing Strategy](TESTING.md)
- [Changelog](CHANGELOG.md)

Never commit real subscription URLs, credentials, private keys or raw production configurations.
