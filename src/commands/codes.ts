import { YtjClient } from "../client.js";

const VALID_CODES = [
  "YRMU",
  "REK_KDI",
  "TLAJI",
  "SELTILA",
  "REK",
  "VIRANOM",
  "TLAHDE",
  "KIELI",
  "TOIMI",
  "TOIMI2",
  "TOIMI3",
  "TOIMI4",
  "KONK",
  "SANE",
  "STATUS3",
];

export async function codesCommand(
  code: string,
  options: { lang: string; format: string },
): Promise<void> {
  if (!VALID_CODES.includes(code.toUpperCase())) {
    console.error(
      `Invalid code: "${code}". Valid codes: ${VALID_CODES.join(", ")}`,
    );
    process.exit(1);
  }

  const client = new YtjClient();
  const result = await client.getDescriptions(code.toUpperCase(), options.lang);
  console.log(result);
}
