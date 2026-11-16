# Null Ping Android — Architecture

## Current foundation

```text
React Native UI (TypeScript)
  App shell / Persian RTL presentation
  typed UI components and state (future)
              |
              v
Expo local module (Kotlin)
  Phase 1: module discovery stub only
              |
              v
Future Android VPN layer
  VpnService / user consent / foreground notification / TUN
              |
              v
Future Xray-core data plane

Future backend API -> auth / subscriptions / server inventory / configs / usage
```

## Ownership

- TypeScript: presentation and user intent orchestration.
- Kotlin: Android permissions, services, TUN descriptors, lifecycle, callbacks and cleanup.
- Xray-core: proxy/data plane; not yet integrated.
- Backend: authoritative account, subscription and server inventory; API contract not yet supplied.

## Connection state contract

`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `RECONNECTING`, `DISCONNECTING`, `ERROR`.

The native layer is authoritative. Emit `CONNECTED` only after service preparation, TUN establishment and engine readiness. The Phase 1 Kotlin stub is not yet exposed to the UI and does not create a tunnel.

## Data contract principles

Server records require stable ID, ISO country code, city, endpoint, protocol, verified coordinates when available, health-check timestamp and measured latency metadata. Unknown values remain unknown. Traffic samples distinguish instantaneous bytes/sec from cumulative session bytes and include timestamps/source.

## Security boundaries

Never log subscription credentials, full proxy URIs, private keys or raw Xray configs. Store secrets only through platform-backed secure storage. Validate downloaded configurations before engine startup. Redact errors before forwarding them to UI.
