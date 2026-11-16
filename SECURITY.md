# Null Ping Android — Security Policy

## Repository hygiene

- Never commit tokens, passwords, private keys, subscription URLs, signing keystores or raw proxy configurations.
- Use GitHub Actions secrets only for required CI credentials.
- Keep sanitized fixtures separate from production material.
- This repository is public; treat all commits as permanently public.

## Application security

- Use HTTPS and validate backend responses.
- Store credentials/configuration using Android-backed secure storage, not plaintext SQLite or logs.
- Redact Xray configs, credentials, auth headers and endpoint secrets from logs/analytics.
- Validate imported/downloaded configuration before execution.
- Apply least privilege and explain VPN consent.
- Protect control-plane sockets from VPN routing loops where required.
- Handle `VpnService.onRevoke()`, process death and cleanup safely.
- Define DNS, IPv4/IPv6 and route behavior; verify leak prevention before release.
- Audit direct and transitive dependencies and third-party licensing.

## Release blockers

Secrets in source history; sensitive config in logs; false CONNECTED state; DNS/traffic leaks; resource leaks after stop/revoke; unresolved third-party license obligations.
