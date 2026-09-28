import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
//#region src/cli/promos-cli.ts
function registerPromosCli(program) {
	const promos = program.command("promos").description("Discover and claim promotional model offers from ClawHub").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/promos", "docs.openclaw.ai/cli/promos")}\n`);
	promos.command("list").description("List active promotions").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosListCommand } = await import("./list-Bs5BYKdI.mjs");
			await promosListCommand(opts, defaultRuntime);
		});
	});
	promos.command("claim").description("Claim a promotion: set up provider auth and register its models").argument("<slug>", "Promotion slug from `openclaw promos list`").option("--api-key <key>", "Provider API key for non-interactive setup").option("--set-default", "Set the promotion's suggested model as default without asking", false).action(async (slug, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { promosClaimCommand } = await import("./claim-CrgUAkkL.mjs");
			await promosClaimCommand(slug, opts, defaultRuntime);
		});
	});
}
//#endregion
export { registerPromosCli };
