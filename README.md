# @pexxi/ytj

CLI and library for the Finnish YTJ (Business Information System) open data API.

## Usage with npx

Run any command without installing:

```bash
npx @pexxi/ytj search --name "Gofore" --format table
npx @pexxi/ytj get 1710128-9 --format table
npx @pexxi/ytj codes YRMU --lang fi
npx @pexxi/ytj postcodes --lang fi --format table
```

## Global Install

```bash
npm install -g @pexxi/ytj
```

After installing globally, the `ytj` command is available directly:

```bash
ytj search --name "Gofore"
ytj get 1710128-9
```

## CLI Commands

### search -- Search companies

```bash
ytj search --name "Gofore" --format table
ytj search --location "Helsinki" --company-form OY
ytj search --business-line "62100" --page 2
ytj search --post-code "00100"
ytj search --reg-start 2024-01-01 --reg-end 2024-12-31
```

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Company name (current, previous, parallel, or auxiliary) |
| `-l, --location <location>` | Town or city |
| `--company-form <form>` | Company form code (e.g. OY, OYJ, KY, OK) |
| `--business-line <line>` | Main business line (TOL 2008 code or text) |
| `--post-code <code>` | Postal code |
| `--reg-start <date>` | Registration date start (yyyy-mm-dd) |
| `--reg-end <date>` | Registration date end (yyyy-mm-dd) |
| `-p, --page <number>` | Page number for pagination |
| `-f, --format <format>` | Output format: `json` (default) or `table` |

### get -- Get company by business ID

```bash
ytj get 1710128-9
ytj get 1710128-9 --format table
```

Business ID format: `NNNNNNN-N` (7 digits, dash, check digit).

| Option | Description |
|--------|-------------|
| `-f, --format <format>` | Output format: `json` (default) or `table` |

### codes -- Get code list descriptions

```bash
ytj codes YRMU --lang fi
ytj codes YRMU --lang en
```

Valid codes: `YRMU`, `REK_KDI`, `TLAJI`, `SELTILA`, `REK`, `VIRANOM`, `TLAHDE`, `KIELI`, `TOIMI`, `TOIMI2`, `TOIMI3`, `TOIMI4`, `KONK`, `SANE`, `STATUS3`.

| Option | Description |
|--------|-------------|
| `-l, --lang <lang>` | Language: `fi` (default), `sv`, `en` |

### postcodes -- Get postal codes

```bash
ytj postcodes --lang fi --format table
```

| Option | Description |
|--------|-------------|
| `-l, --lang <lang>` | Language: `fi` (default), `sv`, `en` |
| `-f, --format <format>` | Output format: `json` (default) or `table` |

## Library Usage

```bash
npm install @pexxi/ytj
```

```typescript
import { YtjClient } from "@pexxi/ytj";

const client = new YtjClient();

// Search companies
const result = await client.searchCompanies({ name: "Gofore" });
console.log(result.totalResults);
console.log(result.companies[0].businessId.value);

// Get single company by business ID
const company = await client.getCompany("1710128-9");
console.log(company.names[0].name);

// Get code descriptions
const codes = await client.getDescriptions("YRMU", "fi");

// Get postal codes
const postCodes = await client.getPostCodes("fi");
```

All responses are validated with Zod and fully typed.

## Agent Skill

Install the YTJ lookup skill for Claude Code or other AI coding agents:

```bash
npx skills add pexxi/ytj-cli
```

## Data License

The data accessed through this tool is provided by [PRH (Finnish Patent and Registration Office)](https://www.prh.fi/) and is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

When using data obtained through this tool, you must give appropriate credit to PRH as the data source.

## License

MIT (tool code). CC BY 4.0 (data from PRH).
