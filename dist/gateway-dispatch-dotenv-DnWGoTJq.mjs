import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-BVjJcF97.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/cli/gateway-dispatch-dotenv.ts
/** Load only the env files needed before dispatching a command through the gateway. */
async function loadGatewayDispatchCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd && fs.existsSync(path.join(cwd, ".env"))) {
		const { loadCliDotEnv } = await import("./dotenv-DprAYqRb.mjs");
		loadCliDotEnv({ quiet });
		return;
	}
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
//#endregion
export { loadGatewayDispatchCliDotEnv };
