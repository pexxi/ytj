import { YtjClient } from "../client.js";
import { formatCompanyDetail } from "../formatter.js";

export async function getCommand(
  businessId: string,
  options: { format: string },
): Promise<void> {
  const client = new YtjClient();
  const company = await client.getCompany(businessId);

  if (options.format === "table") {
    console.log(formatCompanyDetail(company));
  } else {
    console.log(JSON.stringify(company, null, 2));
  }
}
