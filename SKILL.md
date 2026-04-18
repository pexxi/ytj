---
name: ytj-lookup
description: Look up Finnish company information from YTJ (Business Information System) using the ytj CLI. Use when the user asks about Finnish companies, business IDs (Y-tunnus), company registration data, or anything related to the Finnish Trade Register (kaupparekisteri).
---

# YTJ Company Lookup

Use the `ytj` CLI to look up Finnish company information from the YTJ (Business Information System) open data API.

## Prerequisites

The `ytj` CLI must be installed: `npm install -g @pexxi/ytj`

## Commands

### Search companies by name

```bash
ytj search --name "Company Name" --format compact
```

Options: `--name`, `--location`, `--company-form`, `--business-line`, `--post-code`, `--reg-start`, `--reg-end`, `--page`, `--format (compact|table|json)`

### Get company by business ID (Y-tunnus)

```bash
ytj get 1710128-9 --format compact
```

Business ID format: `NNNNNNN-N` (7 digits, dash, check digit).

### Get code descriptions

```bash
ytj codes YRMU --lang fi
```

Valid codes: YRMU (company forms), REK_KDI, TLAJI, SELTILA, REK, VIRANOM, TLAHDE, KIELI, TOIMI, KONK, SANE, STATUS3.

Languages: fi, sv, en.

### Get postal codes

```bash
ytj postcodes --lang fi --format compact
```

## When to use

- User asks about a Finnish company (e.g. "what is Gofore's business ID?")
- User provides a Y-tunnus / business ID and wants details
- User wants to find companies by location, form, or industry
- User asks about Finnish Trade Register data

## Output format guidelines

Always use `--format compact` unless the user explicitly needs structured data for programmatic processing -- then use `--format json`.

- **compact**: Minimal, borderless text. Best for answering questions -- low token cost, easy to parse.
- **json**: Full structured data with all fields. Use only when the user needs raw data for scripting or further processing.
- **table**: Human-readable ASCII table. Not recommended for agent use (border characters waste tokens).

## Data attribution

Data provided by PRH (Finnish Patent and Registration Office) under Creative Commons Attribution 4.0 (CC BY 4.0).
