# Security Policy

VAAS-X Ltd takes the security of its hosted service and its Python SDK seriously. This page says which versions get security fixes, what is in scope, and how to report a problem.

## Supported Versions

| What | Supported |
| ---- | --------- |
| `vaas-x` Python SDK, the latest release on [PyPI](https://pypi.org/project/vaas-x/) | :white_check_mark: |
| Earlier `vaas-x` releases | :x: please upgrade to the latest |
| The hosted service (`api.`, `app.` and `mcp.vaasx.com`) | :white_check_mark: it is always the current version |

Security fixes for the SDK ship as a new release. We do not backport them to older releases.

## Reporting a Vulnerability

Please report privately. Do not open a public issue or pull request for a security problem.

Email **support@vaasx.com** with the subject "Security". Please include:

- what you found and why it matters
- the host, endpoint or SDK version affected
- steps to reproduce, or a short proof of concept
- your name or handle, if you would like credit

**Never send an API key, a sign-in code or another person's data.** If you come across any while testing, stop, tell us what kind of thing it was, and delete your copy.

A machine-readable version of this contact is at <https://vaasx.com/.well-known/security.txt>.

## What to Expect

- **Acknowledgement:** within 5 working days.
- **Updates:** we will tell you when the status of your report changes, and at least once a month while it is open.
- **If we accept it:** we fix it, release or deploy the fix, tell you, and credit you if you want credit. We would like to agree a disclosure date with you; please do not publish details before we have had a reasonable chance to fix the problem.
- **If we decline it:** we will tell you why, for example that we could not reproduce it, that it is intended behaviour, or that it is out of scope.

VAAS-X Ltd is a small company. We will be straightforward about timing.

## Scope

In scope:

- The hosted service: `vaasx.com`, `app.vaasx.com`, `api.vaasx.com` and `mcp.vaasx.com`
- The `vaas-x` Python SDK on PyPI
- The code and documentation in this repository, including the connector documentation

Out of scope:

- Any other hostname or service not listed above
- Third-party services we use (for example payment, email, hosting and package services). Please report those to the provider.
- Denial-of-service, volume or rate-limit testing
- Social engineering, phishing or physical attacks against us or our customers
- Reports from automated scanners that show no real impact, and missing security headers with no demonstrated exploit
- Problems that need an already-compromised device or an already-leaked API key
- Out-of-date third-party libraries with no working exploit against us

## Testing Guidelines

Please do not:

- Access, change or delete other customers' data, or test against real customer accounts
- Run denial-of-service, spam or social-engineering tests against us or our customers
- Go further than you need to show the problem. Stop and report as soon as you can demonstrate it.

Please do:

- Use your own free account. You can create one at <https://app.vaasx.com> or through the connector.
- Give us a reasonable time to fix the problem before you publish anything.

## How We Protect Your Data

- Traffic to the hosted service uses TLS 1.3.
- The production disk is encrypted at rest (AES-256, with keys managed through AWS KMS).
- Every account has its own API key. If you think a key has been exposed, sign in at <https://app.vaasx.com>, open "Privacy and security" and choose "Email me a new key". The old key stops working at once.

## Authentication

The connector at `https://mcp.vaasx.com/mcp` requires sign-in. An unauthenticated request receives `401` with OAuth discovery metadata (RFC 9728). Sign in with your email to create a free account, or use an existing API key.
