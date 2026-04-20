import { YtjClient } from "../client.js";
import { formatCompaniesTable, formatCompaniesCompact } from "../formatter.js";

interface SearchOptions {
  name?: string;
  location?: string;
  companyForm?: string;
  businessLine?: string;
  postCode?: string;
  page?: string;
  format: string;
  includeInactive?: boolean;
}

export async function searchCommand(options: SearchOptions): Promise<void> {
  const client = new YtjClient();
  const result = await client.searchCompanies({
    name: options.name,
    location: options.location,
    companyForm: options.companyForm,
    mainBusinessLine: options.businessLine,
    postCode: options.postCode,
    page: options.page ? parseInt(options.page, 10) : undefined,
    includeInactive: options.includeInactive,
  });

  if (options.format === "compact") {
    console.log(formatCompaniesCompact(result.companies, result.totalResults));
  } else if (options.format === "json") {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatCompaniesTable(result.companies, result.totalResults));
  }
}
