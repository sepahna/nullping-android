# Null Ping Android — Testing Strategy

## Every change

- TypeScript strict typecheck
- ESLint
- Jest unit tests
- React Native Testing Library for interactive components
- Kotlin unit tests for native state/validation helpers
- Android Gradle debug build after native/dependency changes

## Import/parser tests

- Valid and invalid samples for every explicitly supported share-link scheme
- QR payload parsing and malformed/oversized QR rejection
- File import: invalid JSON, unsupported schema, oversized file and encoding errors
- Subscription response parsing, timeout, HTTP errors, oversized response and partial/invalid profile lists
- Ensure refresh failure does not delete the last known-good profiles
- Ensure secrets and subscription URLs are redacted from logs/errors
- Sanitized fixtures only; never commit real subscription credentials

## VPN integration matrix

Permission granted/denied/revoked; connect/disconnect/reconnect; invalid config/unreachable endpoint/auth failure; Wi-Fi/cellular transitions; airplane mode; process death/service recreation; system-settings disconnect; notification actions; DNS and IPv4/IPv6 behavior; route exclusions; leak tests; repeated lifecycle operations without descriptor/socket/service leaks.

## Telemetry

Test instantaneous vs cumulative counters, sampling interval and elapsed time, resets/reconnects, zero traffic and monitoring failure. Latency tests must identify their probe method and must not be mislabeled as actual end-to-end proxy latency. Never generate random values for production metrics.

## Device and performance

Test minimum supported and current Android versions, physical device VPN behavior, mid-range globe FPS/memory/battery, background/foreground transitions, long-running soak, accessibility, Persian RTL and large fonts.

Report only tests actually executed, including device/API level, build variant, command, result and limitations. Emulator success does not replace physical-device VPN validation.
