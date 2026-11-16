# Null Ping Android — Architecture

## Product flow

```text
User input
  ├── share link / clipboard
  ├── QR code
  ├── local file
  └── subscription URL
          |
          v
Import + format detection
          |
          v
Strict parser / validation
          |
          v
Local profile repository (secure handling)
          |
          v
Selected profile -> Xray config adapter
          |
          v
React Native UI -> typed asynchronous native bridge
                              |
                              v
                    Android Kotlin layer
                    VpnService + consent
                    foreground notification
                    TUN + routing/DNS policy
                    Xray process/controller
                              |
                              v
                       Xray-core data plane
                              |
                              v
                     User's configured endpoint
```

## Product boundary

Null Ping is a client. It does not provision VPN servers, sell subscriptions, manage a fleet of servers or require an app-owned authentication/billing backend for the core connect flow. Subscription URLs are imported by the user and provide profile data.

## Ownership

- TypeScript: presentation, import UX, profile organization and user-intent orchestration.
- Kotlin: Android permissions, VpnService, foreground service, TUN descriptors, lifecycle, callbacks and cleanup.
- Xray-core: proxy/data plane.
- Local profile repository: user-imported profiles and subscription metadata, with secrets protected at rest.
- Native/core counters: source for traffic measurements.

## Import and profile model

Normalize supported input formats into a versioned internal profile model. Preserve source metadata where safe, but never assume arbitrary input fields are trusted. Parser must enforce input size limits, validate required fields and reject unsupported protocols/config variants. The exact protocol/import support matrix is tied to the pinned Xray-core version and automated fixtures.

Subscription refresh must be explicit/configurable, bounded by timeouts and response-size limits, and must handle expired/invalid URLs without destroying the last known-good profile set.

## Connection state contract

`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `RECONNECTING`, `DISCONNECTING`, `ERROR`.

The native layer is authoritative. Emit `CONNECTED` only after service preparation, TUN establishment and engine readiness. All operations require explicit timeout and error mapping; native work must not block the JS thread.

## Telemetry and endpoint metadata

Latency is measured against the selected endpoint using a documented method; distinguish a TCP/HTTP reachability probe from Xray proxy delay. Traffic samples distinguish instantaneous bytes/sec from cumulative session bytes and include timestamps/source. Globe coordinates are optional and must come from verified metadata or a clearly identified geolocation lookup; do not infer exact packet routes.

## Security boundaries

Never log subscription URLs, credentials, full proxy URIs, private keys or raw Xray configs. Store secrets only through platform-backed secure storage. Validate imported/downloaded configuration before engine startup. Redact errors before forwarding them to UI.
