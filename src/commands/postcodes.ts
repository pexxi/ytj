import { YtjClient } from "../client.js";
import { formatPostCodesTable, formatPostCodesCompact } from "../formatter.js";

export async function postcodesCommand(options: {
  lang: string;
  format: string;
}): Promise<void> {
  const client = new YtjClient();
  const result = await client.getPostCodes(options.lang);

  if (options.format === "compact") {
    console.log(formatPostCodesCompact(result));
  } else if (options.format === "json") {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatPostCodesTable(result));
  }
}
