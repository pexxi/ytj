import Table from "cli-table3";
import type { Company, PostCodeEntry } from "./schemas.js";

function getCurrentName(company: Company): string {
  const current = company.names.find((n) => !n.endDate);
  return current?.name ?? company.names[0]?.name ?? "";
}

function getCity(company: Company): string {
  const addr = company.addresses.find((a) => a.type === 1) ?? company.addresses[0];
  if (!addr?.postOffices?.length) return "";
  return addr.postOffices[0].city;
}

function getCompanyForm(company: Company): string {
  const current = company.companyForms.find((f) => !f.endDate);
  return current?.type ?? company.companyForms[0]?.type ?? "";
}

function getCompanyFormLabel(company: Company): string {
  const current = company.companyForms.find((f) => !f.endDate) ?? company.companyForms[0];
  if (!current) return "";
  // languageCode "3" = English, "1" = Finnish
  const desc = current.descriptions.find((d) => d.languageCode === "3")
    ?? current.descriptions.find((d) => d.languageCode === "1")
    ?? current.descriptions[0];
  return desc?.description ?? current.type;
}

const TRADE_REGISTER_STATUS: Record<string, string> = {
  "0": "Not registered",
  "1": "Registered",
  "2": "Registration pending",
  "3": "Deregistered",
  "4": "Dissolved",
};

function getTradeRegisterStatus(company: Company): string {
  return TRADE_REGISTER_STATUS[company.tradeRegisterStatus] ?? company.tradeRegisterStatus;
}

export function formatCompaniesTable(
  companies: Company[],
  totalResults: number,
): string {
  const table = new Table({
    head: ["Business ID", "Name", "Form", "Status", "City"],
  });

  for (const c of companies) {
    table.push([
      c.businessId.value,
      getCurrentName(c),
      getCompanyForm(c),
      c.tradeRegisterStatus,
      getCity(c),
    ]);
  }

  return `${table.toString()}\n\nTotal results: ${totalResults}`;
}

export function formatCompanyDetail(company: Company): string {
  const table = new Table();

  table.push(
    { "Business ID": company.businessId.value },
    { Name: getCurrentName(company) },
    { Form: getCompanyForm(company) },
    { Status: company.tradeRegisterStatus },
    { City: getCity(company) },
    { "Last Modified": company.lastModified },
  );

  if (company.website?.url) {
    table.push({ Website: company.website.url });
  }

  if (company.mainBusinessLine) {
    const desc = company.mainBusinessLine.descriptions
      .map((d) => `${d.description} (${d.languageCode})`)
      .join(", ");
    table.push({ "Business Line": `${company.mainBusinessLine.type} - ${desc}` });
  }

  for (const addr of company.addresses) {
    const label = addr.type === 1 ? "Street Address" : "Postal Address";
    const parts = [addr.street, addr.postCode, getCity(company)].filter(Boolean);
    table.push({ [label]: parts.join(", ") || "-" });
  }

  return table.toString();
}

export function formatPostCodesTable(postCodes: PostCodeEntry[]): string {
  const table = new Table({
    head: ["Post Code", "City", "Active", "Municipality"],
  });

  for (const pc of postCodes) {
    table.push([
      pc.postCode,
      pc.city,
      pc.active ? "Yes" : "No",
      pc.municipalityCode ?? "",
    ]);
  }

  return table.toString();
}

// Compact formatters — minimal, borderless output optimized for AI agent consumption

export function formatCompaniesCompact(
  companies: Company[],
  totalResults: number,
): string {
  const lines = companies.map(
    (c) =>
      `${c.businessId.value}  ${getCurrentName(c)}  ${getCompanyFormLabel(c)}  ${getTradeRegisterStatus(c)}  ${getCity(c)}`,
  );
  return `Results: ${companies.length} of ${totalResults}\n\n${lines.join("\n")}`;
}

export function formatCompanyCompact(company: Company): string {
  const lines: string[] = [
    `Business ID: ${company.businessId.value}`,
    `Name: ${getCurrentName(company)}`,
    `Form: ${getCompanyFormLabel(company)}`,
    `Status: ${getTradeRegisterStatus(company)}`,
    `City: ${getCity(company)}`,
  ];

  if (company.website?.url) {
    lines.push(`Website: ${company.website.url}`);
  }

  if (company.mainBusinessLine) {
    const desc = company.mainBusinessLine.descriptions
      .map((d) => d.description)
      .filter(Boolean)
      .join(", ");
    lines.push(`Business Line: ${company.mainBusinessLine.type} - ${desc}`);
  }

  for (const addr of company.addresses) {
    const label = addr.type === 1 ? "Street Address" : "Postal Address";
    const parts = [addr.street, addr.postCode, getCity(company)].filter(Boolean);
    lines.push(`${label}: ${parts.join(", ") || "-"}`);
  }

  lines.push(`Last Modified: ${company.lastModified}`);

  return lines.join("\n");
}

export function formatPostCodesCompact(postCodes: PostCodeEntry[]): string {
  return postCodes
    .map(
      (pc) =>
        `${pc.postCode}  ${pc.city}  ${pc.active ? "Active" : "Inactive"}  ${pc.municipalityCode ?? ""}`,
    )
    .join("\n");
}
