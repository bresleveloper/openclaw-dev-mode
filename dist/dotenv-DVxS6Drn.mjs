import { j as resolveGatewayCatalogCommandPath } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as resolveCliContainerTarget } from "./container-target-Bj4zLvq3.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-BVjJcF97.mjs";
import { r as loadWorkspaceDotEnvFile } from "./dotenv-DIBV8cOw.mjs";
import path from "node:path";
//#region src/cli/dotenv.ts
/** Load `.env` files for normal CLI commands without overriding existing process env. */
function loadCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd) loadWorkspaceDotEnvFile(path.join(cwd, ".env"), { quiet });
	if (opts?.loadGlobalEnv === false) return;
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
/** Load only the dotenv scope an early CLI failure may consult for diagnostic formatting. */
async function loadCliDotEnvForEarlyDiagnostic(argv, env = process.env) {
	if (resolveCliContainerTarget(argv, env)) return;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.commandPath[0] === "agent" && invocation.commandPath[1] === "exec") return;
	if (invocation.primary === "agent" && !argv.includes("--local")) {
		const { loadGatewayDispatchCliDotEnv } = await import("./gateway-dispatch-dotenv-DnWGoTJq.mjs");
		await loadGatewayDispatchCliDotEnv({ quiet: true });
		return;
	}
	const gatewayPath = resolveGatewayCatalogCommandPath(argv);
	loadCliDotEnv({
		loadGlobalEnv: !(!invocation.hasHelpOrVersion && (gatewayPath?.length === 1 || gatewayPath?.length === 2 && gatewayPath[1] === "run")),
		quiet: true
	});
}
//#endregion
export { loadCliDotEnvForEarlyDiagnostic as n, loadCliDotEnv as t };
