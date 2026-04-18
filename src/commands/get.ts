import { YtjClient } from "../client.js";
import { formatCompanyDetail, formatCompanyCompact } from "../formatter.js";

export async function getCommand(
  businessId: string,
  options: { format: string },
): Promise<void> {
  const client = new YtjClient();
  const company = await client.getCompany(businessId);

  if (options.format === "compact") {
    console.log(formatCompanyCompact(company));
  } else if (options.format === "json") {
    console.log(JSON.stringify(company, null, 2));
  } else {
    console.log(formatCompanyDetail(company));
  }
}
