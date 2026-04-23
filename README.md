# @pexxi/prh-ytj

CLI and Agent skill for the Finnish YTJ (Business Information System) open data API.

## Usage with npx

Run any command without installing:

```bash
npx @pexxi/prh-ytj search --name "Gofore"
npx @pexxi/prh-ytj get 1710128-9
npx @pexxi/prh-ytj codes YRMU --lang fi
npx @pexxi/prh-ytj postcodes --lang fi
```

## Global Install

```bash
npm install -g @pexxi/prh-ytj
```

After installing globally, the `prh-ytj` command is available directly:

```bash
prh-ytj search --name "Gofore"
prh-ytj get 1710128-9
```

## CLI Commands

### search -- Search companies

```bash
prh-ytj search --name "Gofore"
prh-ytj search --location "Helsinki" --company-form OY
prh-ytj search --business-line "62100" --page 2
prh-ytj search --post-code "00100"
prh-ytj search --reg-start 2024-01-01 --reg-end 2024-12-31
prh-ytj search --name "Kokko" --all
```

By default, `search` returns only active companies (those without an `endDate`). Use `--all` to include ceased companies as well; in that mode the schema is relaxed to a best-effort parse so old records with missing fields still come through.

`--location` and `--post-code` are also enforced client-side against the returned addresses, narrowing fuzzy API matches to exact address hits.

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Company name (current, previous, parallel, or auxiliary) |
| `-l, --location <location>` | Town or city (also filtered client-side against address post-office city) |
| `--company-form <form>` | Company form code (e.g. OY, OYJ, KY, OK) |
| `--business-line <line>` | Main business line (TOL 2008 code or text) |
| `--post-code <code>` | Postal code (also filtered client-side against address postal code) |
| `--reg-start <date>` | Registration date start (yyyy-mm-dd) |
| `--reg-end <date>` | Registration date end (yyyy-mm-dd) |
| `-p, --page <number>` | Page number for pagination |
| `-a, --all` | Include inactive (ceased) companies, using relaxed best-effort validation |
| `-f, --format <format>` | Output format: `table` (default), `compact`, or `json` |

### get -- Get company by business ID

```bash
prh-ytj get 1710128-9
prh-ytj get 1710128-9 --format compact
```

Business ID format: `NNNNNNN-N` (7 digits, dash, check digit).

| Option | Description |
|--------|-------------|
| `-f, --format <format>` | Output format: `table` (default), `compact`, or `json` |

### codes -- Get code list descriptions

```bash
prh-ytj codes YRMU --lang fi
prh-ytj codes YRMU --lang en
```

Valid codes: `YRMU`, `REK_KDI`, `TLAJI`, `SELTILA`, `REK`, `VIRANOM`, `TLAHDE`, `KIELI`, `TOIMI`, `TOIMI2`, `TOIMI3`, `TOIMI4`, `KONK`, `SANE`, `STATUS3`.

| Option | Description |
|--------|-------------|
| `-l, --lang <lang>` | Language: `fi` (default), `sv`, `en` |

### postcodes -- Get postal codes

```bash
prh-ytj postcodes --lang fi
```

| Option | Description |
|--------|-------------|
| `-l, --lang <lang>` | Language: `fi` (default), `sv`, `en` |
| `-f, --format <format>` | Output format: `table` (default), `compact`, or `json` |

## Library Usage

```bash
npm install @pexxi/prh-ytj
```

```typescript
import { YtjClient } from "@pexxi/prh-ytj";

const client = new YtjClient();

// Search companies (active only by default)
const result = await client.searchCompanies({ name: "Gofore" });
console.log(result.totalResults);
console.log(result.companies[0].businessId?.value);

// Include inactive (ceased) companies with relaxed validation
const all = await client.searchCompanies({ name: "Kokko", includeInactive: true });

// Get single company by business ID (relaxed validation — works for ceased companies too)
const company = await client.getCompany("1710128-9");
console.log(company.names?.[0]?.name);

// Get code descriptions
const codes = await client.getDescriptions("YRMU", "fi");

// Get postal codes
const postCodes = await client.getPostCodes("fi");
```

All responses are validated with Zod and fully typed. Active-only searches use a strict schema; when `includeInactive: true` (or via `getCompany`) a relaxed schema is used where every field is optional, so old records with missing data still parse.

## Agent Skill

Install the YTJ lookup skill for Claude Code or other AI coding agents:

```bash
npx skills add pexxi/prh-ytj
```

## Data License

The data accessed through this tool is provided by [PRH (Finnish Patent and Registration Office)](https://www.prh.fi/) and is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

When using data obtained through this tool, you must give appropriate credit to PRH as the data source.

## License

MIT (tool code). CC BY 4.0 (data from PRH).
