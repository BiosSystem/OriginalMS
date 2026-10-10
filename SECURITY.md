# Security Policy & Hardening

Security and runtime integrity are essential for the OriginalMS emulation platform. This document outlines supported versions, disclosure guidelines, and network hardening requirements for operating the server runtime safely.

---

## Supported Versions

Only the active `main` branch and tagged releases under the BiosSystem organization receive security updates.

| Version | Supported |
| ------- | --------- |
| >= 1.0  | Yes       |
| < 1.0   | No        |

---

## Reporting a Vulnerability

If you discover a security vulnerability or exploit in the runtime, packet parser, or database bridge, please report it privately. Do not open public issues or disclose exploit payloads publicly.

* **Reporting Channel**: Submit an advisory securely via [GitHub Security Advisories](https://github.com/BiosSystem/OriginalMS/security/advisories/new).
* **Response SLA**:
  * **Acknowledgement**: Within 24 hours.
  * **Triage & Remediation**: Within 3 business days.
  * **Disclosure**: Coordinated after the fix has been verified and committed.

---

## Deployment Hardening & Best Practices

1. **Database Credentials**:
   * Never deploy with default passwords or commit production credentials to source control.
   * Store production database connection strings in environment variables or isolated local configuration files (`configs/db.properties`) marked with restricted filesystem permissions (`chmod 600`).

2. **Network & Port Exposure**:
   * Bind the administrative and database interfaces strictly to loopback (`127.0.0.1`) or a secure private network namespace.
   * Only expose client-facing login (`8484`) and channel ports (`7575+`) through an edge proxy or DDoS-mitigated firewall.

3. **Packet Validation & Replay Prevention**:
   * Ensure standard MapleAES packet encryption handshake is strictly enforced for incoming connections.
   * Validate opcode sequences on login and world servers to reject malformed or replay buffers.
