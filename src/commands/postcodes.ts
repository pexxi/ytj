import { YtjClient } from "../client.js";
import { formatPostCodesTable } from "../formatter.js";

export async function postcodesCommand(options: {
  lang: string;
  format: string;
}): Promise<void> {
  const client = new YtjClient();
  const result = await client.getPostCodes(options.lang);

  if (options.format === "table") {
    console.log(formatPostCodesTable(result));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}
