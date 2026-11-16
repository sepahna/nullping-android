# Null Ping Android — Security Policy

## Repository hygiene

- Never commit tokens, passwords, private keys, subscription URLs, signing keystores, QR exports or raw proxy configurations.
- Use sanitized fixtures only; do not use real user profiles in tests.
- This repository is public; treat all commits as permanently public.

## Imported profile security

- Treat clipboard content, QR payloads, local files and subscription responses as untrusted input.
- Enforce input and response size limits, parser timeouts where applicable, schema validation and safe error messages.
- Subscription URLs may embed credentials or bearer tokens. Do not log, analytics-track, or expose them in crash reports.
- Do not overwrite the last known-good subscription profile set when refresh fails or returns invalid data.
- Store sensitive profile material using Android-backed secure storage or an explicitly reviewed encrypted-storage design.
- Do not put secrets in plaintext SQLite, AsyncStorage, logs or analytics.

## VPN and network security

- Use HTTPS for subscription retrieval and any optional remote service.
- Validate imported/downloaded configuration before execution.
- Apply least privilege and explain Android VPN consent.
- Protect control-plane sockets from VPN routing loops where required.
- Handle `VpnService.onRevoke()`, process death and cleanup safely.
- Define DNS, IPv4/IPv6 and route behavior; verify leak prevention before release.
- Redact Xray configuration, credentials and endpoint secrets from logs.
- Audit direct and transitive dependencies and third-party licensing.

## Release blockers

Secrets in source history; sensitive config in logs; false CONNECTED state; DNS/traffic leaks; resource leaks after stop/revoke; unreviewed third-party license obligations.
