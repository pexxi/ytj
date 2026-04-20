import { program } from "commander";
import { searchCommand } from "./commands/search.js";
import { getCommand } from "./commands/get.js";
import { codesCommand } from "./commands/codes.js";
import { postcodesCommand } from "./commands/postcodes.js";

program
  .name("ytj")
  .description(
    "Finnish YTJ Business Information System CLI\nData: PRH (Finnish Patent and Registration Office), CC BY 4.0",
  )
  .version("0.1.0");

program
  .command("search")
  .description("Search companies")
  .option("-n, --name <name>", "Company name")
  .option("-l, --location <location>", "Town or city")
  .option("--company-form <form>", "Company form code (e.g. OY, OYJ, KY)")
  .option("--business-line <line>", "Main business line (TOL 2008 code or text)")
  .option("--post-code <code>", "Postal code")
  .option("--reg-start <date>", "Registration date start (yyyy-mm-dd)")
  .option("--reg-end <date>", "Registration date end (yyyy-mm-dd)")
  .option("-p, --page <number>", "Page number")
  .option("-a, --all", "Include inactive (ceased) companies (relaxed validation)", false)
  .option("-f, --format <format>", "Output format (table, compact, json)", "table")
  .action((options) => {
    return searchCommand({
      ...options,
      registrationDateStart: options.regStart,
      registrationDateEnd: options.regEnd,
      includeInactive: options.all,
    });
  });

program
  .command("get <businessId>")
  .description("Get company by business ID (e.g. 2722789-6)")
  .option("-f, --format <format>", "Output format (table, compact, json)", "table")
  .action(getCommand);

program
  .command("codes <code>")
  .description(
    "Get code list descriptions (YRMU, REK_KDI, TLAJI, SELTILA, REK, VIRANOM, TLAHDE, KIELI, TOIMI, KONK, SANE, STATUS3)",
  )
  .option("-l, --lang <lang>", "Language (fi, sv, en)", "fi")
  .option("-f, --format <format>", "Output format (json)", "json")
  .action(codesCommand);

program
  .command("postcodes")
  .description("Get postal codes")
  .option("-l, --lang <lang>", "Language (fi, sv, en)", "fi")
  .option("-f, --format <format>", "Output format (table, compact, json)", "table")
  .action(postcodesCommand);

program.parseAsync().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
