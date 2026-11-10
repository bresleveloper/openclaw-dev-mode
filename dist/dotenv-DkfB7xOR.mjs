import { j as isGatewayRunInvocationArgv } from "./argv-C7hqFLn5.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as resolveCliContainerTarget } from "./container-target-DzrX5jVY.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-CD6y9BVu.mjs";
import { r as loadWorkspaceDotEnvFile } from "./dotenv-DYpbXCOa.mjs";
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
		const { loadGatewayDispatchCliDotEnv } = await import("./gateway-dispatch-dotenv-CRX68qav.mjs");
		await loadGatewayDispatchCliDotEnv({ quiet: true });
		return;
	}
	loadCliDotEnv({
		loadGlobalEnv: invocation.hasHelpOrVersion || !isGatewayRunInvocationArgv(argv),
		quiet: true
	});
}
//#endregion
export { loadCliDotEnvForEarlyDiagnostic as n, loadCliDotEnv as t };
