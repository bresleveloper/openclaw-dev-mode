import { a as periodSchema } from "./limits-iMrGeJ-3.mjs";
import { z } from "zod";
import { addGatewayClientOptions, callGatewayFromCli } from "openclaw/plugin-sdk/gateway-runtime";
//#region extensions/team-reports/src/cli.ts
async function request(method, options, params) {
	return await callGatewayFromCli(`team-reports.${method}`, options, params, {
		mode: "cli",
		scopes: method === "generate" ? ["operator.admin"] : ["operator.read"]
	});
}
function writeResult(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function registerTeamReportsCli({ program }) {
	const reports = program.command("team-reports").description("Browse and generate team activity reports");
	addGatewayClientOptions(reports.command("status").description("Show collection status and scheduled runs").option("--json", "Print JSON", false)).action(async (options) => {
		writeResult(await request("status", options, {}));
	});
	addGatewayClientOptions(reports.command("list").description("List stored reports").option("--period <period>", "Filter day, week, or month reports").option("--json", "Print JSON", false)).action(async (options) => {
		writeResult(await request("list", options, options.period ? { period: periodSchema.parse(options.period) } : {}));
	});
	addGatewayClientOptions(reports.command("show").description("Show a stored report").argument("<period>", "day, week, or month").argument("<key>", "Period key").option("--markdown", "Print the report as Markdown", false).option("--json", "Print JSON", false)).action(async (period, key, options) => {
		const format = options.json && !options.markdown ? "json" : "markdown";
		const result = await request("get", options, {
			period: periodSchema.parse(period),
			key,
			format
		});
		if (format === "markdown" && !options.json) {
			const { markdown } = z.object({ markdown: z.string() }).parse(result);
			process.stdout.write(markdown.endsWith("\n") ? markdown : `${markdown}\n`);
		} else writeResult(result);
	});
	addGatewayClientOptions(reports.command("generate").description("Start a manual day report run").option("--date <date>", "UTC day in YYYY-MM-DD form").option("--intraday", "Refresh the open UTC day", false).option("--json", "Print JSON", false)).action(async (options) => {
		writeResult(await request("generate", options, {
			period: "day",
			...options.date ? { date: z.iso.date().parse(options.date) } : {},
			...options.intraday ? { intraday: true } : {}
		}));
	});
}
//#endregion
export { registerTeamReportsCli };
