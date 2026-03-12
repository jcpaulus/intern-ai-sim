# Security Policy

This document describes how to report security vulnerabilities for INTERNLY
and what to expect during triage and remediation.

## Supported Versions

Internly is actively maintained on the main branch. Security fixes are
provided for the latest production deployment and the current main branch.

| Version/Branch | Supported | Notes |
| --- | --- | --- |
| main | Yes | Primary supported development branch |
| Latest production deployment | Yes | Receives urgent security patches |
| Older commits/releases | No | Upgrade to latest main/deployment |

## Security Contact

Primary contact email: security@internly.app

If email delivery fails or you do not receive an acknowledgment in 72 hours,
use GitHub Private Vulnerability Reporting as the fallback channel.

## Encrypted Reporting (PGP)

For sensitive reports, encrypt your message to the Internly security key.

If the key is unavailable or cannot be validated, use GitHub Private
Vulnerability Reporting instead.

## Reporting a Vulnerability

Please do **not** report security vulnerabilities in public GitHub issues,
discussions, or pull requests.

Use one of the following channels:

1. Preferred: Email security@internly.app
2. Secondary: GitHub Private Vulnerability Reporting (Security Advisory)
	- Go to: https://github.com/jcpaulus/intern-ai-sim/security/advisories
	- Click **Report a vulnerability**
3. If private reporting is unavailable, contact the maintainer directly via
	GitHub: https://github.com/jcpaulus

## What To Include In A Report

Please include as much of the following as possible:

- A clear description of the issue and affected component(s)
- Steps to reproduce (proof of concept, request/response, screenshots, logs)
- Impact assessment (confidentiality, integrity, availability)
- Any known mitigations or suggested fixes
- Whether the issue is exploitable in default configuration

## Response and Disclosure Process

Maintainer targets:

- Initial acknowledgment: within 72 hours
- Triage decision: within 7 calendar days
- Status updates: at least every 7 calendar days while open

If a report is accepted:

- A fix will be developed and validated as quickly as practical
- A coordinated disclosure timeline will be agreed with the reporter
- A security advisory will be published after a fix is available, when possible

### Remediation Targets By Severity

The timelines below are target windows from triage confirmation to initial
mitigation or fix release:

| Severity | Target remediation window |
| --- | --- |
| Critical | Within 72 hours |
| High | Within 7 calendar days |
| Medium | Within 30 calendar days |
| Low | Next planned release cycle (target 90 days) |

If a complete fix cannot be shipped in the target window, Internly will
prioritize a temporary mitigation and continue weekly status updates until
resolved.

If a report is declined:

- A clear reason will be provided (for example: not reproducible,
  out-of-scope, or acceptable risk)

## Scope

In scope:

- Application code in this repository
- Supabase edge functions and database migrations included in this repository
- Authentication, authorization, and data exposure vulnerabilities

Out of scope:

- Social engineering or phishing attacks
- Physical attacks and local device compromise
- Vulnerabilities in third-party services outside this repository unless caused
  by this project's insecure usage/configuration

## Safe Harbor

If you make a good-faith effort to avoid privacy violations, data destruction,
service disruption, and interruption of user experience, Internly will treat
your research as authorized and will not pursue legal action for your report.
