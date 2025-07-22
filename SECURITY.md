# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@artemis-ai.com. 

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide updates on the resolution timeline.

## Security Best Practices

This application implements:
- Environment variable protection
- API key security
- Database row-level security (RLS)
- Input validation and sanitization
- HTTPS enforcement in production
- CSP headers via Vercel
