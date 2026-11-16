# Null Ping Android — Architecture

```text
React Native UI (TypeScript)
  Screens / Navigation / RTL Design System
  Zustand state / typed API client / SQLite cache
  Typed asynchronous native VPN interface
                 |
                 v
Android Kotlin layer
  VpnService + permission consent + foreground notification
  TUN lifecycle + routing/DNS policy + network callbacks
  Xray process/controller + native traffic counters
                 |
                 v
Xray-core data plane -> configured remote endpoint

Backend API -> auth / subscriptions / server inventory / configs / usage
```

## Ownership

- TypeScript: presentation and user intent orchestration.
- Kotlin: Android permissions, services, TUN descriptors, lifecycle, callbacks and cleanup.
- Xray-core: proxy/data plane.
- Backend: authoritative account, subscription and server inventory.
- Native/core counters: source for traffic measurements.

## Connection state contract

`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `RECONNECTING`, `DISCONNECTING`, `ERROR`.

The native layer is authoritative. Emit `CONNECTED` only after service preparation, TUN establishment and engine readiness. All operations require explicit timeout and error mapping; native work must not block the JS thread.

## Data contract principles

Server records require stable ID, ISO country code, city, endpoint, protocol, verified coordinates when available, health-check timestamp and measured latency metadata. Unknown values remain unknown. Traffic samples distinguish instantaneous bytes/sec from cumulative session bytes and include timestamps/source.

## Security boundaries

Never log subscription credentials, full proxy URIs, private keys or raw Xray configs. Store secrets only through platform-backed secure storage. Validate downloaded configurations before engine startup. Redact errors before forwarding them to UI.
