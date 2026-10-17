import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
//#region src/cli/promos-cli.ts
function registerPromosCli(program) {
	const promos = program.command("promos").description("Discover and claim promotional model offers from ClawHub").addHelpText("after", () => formatDocsHelp("/cli/promos"));
	promos.command("list").description("List active promotions").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosListCommand } = await import("./list-DFtj7tow.mjs");
			await promosListCommand(opts, defaultRuntime);
		});
	});
	promos.command("claim").description("Claim a promotion: set up provider auth and register its models").argument("<slug>", "Promotion slug from `openclaw promos list`").option("--api-key <key>", "Provider API key for non-interactive setup").option("--set-default", "Set the promotion's suggested model as default without asking", false).action(async (slug, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosClaimCommand } = await import("./claim-DrcAiYyK.mjs");
			await promosClaimCommand(slug, opts, defaultRuntime);
		});
	});
}
//#endregion
export { registerPromosCli };
