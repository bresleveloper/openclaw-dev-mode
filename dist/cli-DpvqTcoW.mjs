import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
//#region extensions/mcp-relay/src/cli.ts
function createRelayCommandFailure(error, redactUrl) {
	const detail = redactUrl(error instanceof Error ? error.message : String(error));
	return /* @__PURE__ */ new Error(`${detail}\nCheck that the Gateway is running and mcp-relay is enabled with openclaw plugins enable mcp-relay, then retry.`);
}
async function runCommand(op, opts, params) {
	const { callGatewayFromCli, redactSensitiveUrlLikeString } = await import("./plugin-sdk/gateway-runtime.js");
	try {
		const result = await callGatewayFromCli(`mcp-relay.${op}`, opts, params, {
			progress: !opts.json,
			scopes: [op === "status" ? "operator.read" : "operator.admin"]
		});
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		if (op === "pair" && typeof result.code === "string" && typeof result.mcpUrl === "string") {
			defaultRuntime.log(`Pairing code: ${result.code}`);
			if (typeof result.expiresAt === "number") defaultRuntime.log(`Expires: ${new Date(result.expiresAt).toISOString()}`);
			defaultRuntime.log(`MCP URL: ${result.mcpUrl}`);
			defaultRuntime.log("In ChatGPT, open Plugins and add this MCP URL; in Claude, add a custom connector. Enter this code on the OpenClaw consent page.");
			return;
		}
		if (op === "status" && isRecord(result.ui)) defaultRuntime.log(result.ui.available === true ? `Control UI: available (${typeof result.ui.basePath === "string" ? result.ui.basePath : "/"})` : `Control UI: unavailable${typeof result.ui.reason === "string" ? ` — ${result.ui.reason}` : ""}`);
		defaultRuntime.writeJson(result);
	} catch (error) {
		const failure = createRelayCommandFailure(error, redactSensitiveUrlLikeString);
		if (opts.json) throw failure;
		defaultRuntime.error(failure.message);
		defaultRuntime.exit(1);
	}
}
async function registerMcpRelayCli({ program }) {
	const { addGatewayClientOptions } = await import("./plugin-sdk/gateway-runtime.js");
	const relay = program.command("mcp-relay").description("Inspect the MCP relay connection and manage client grants");
	const command = (name, description) => addGatewayClientOptions(relay.command(name).description(description)).option("--json", "Emit JSON", false);
	command("status", "Show the running Gateway's relay connection and grant count").action((opts) => runCommand("status", opts, {}));
	command("pair", "Issue a single-use pairing code for a remote MCP client").action((opts) => runCommand("pair", opts, {}));
	command("grants", "List the running Gateway's MCP client grants").action((opts) => runCommand("grants", opts, {}));
	command("revoke <grantId>", "Revoke a client grant locally and notify the relay").action((grantId, opts) => runCommand("revoke", opts, { grantId }));
}
//#endregion
export { registerMcpRelayCli };
