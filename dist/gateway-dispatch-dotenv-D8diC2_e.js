import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-DFAajn3s.js";
import fs from "node:fs";
import path from "node:path";
//#region src/cli/gateway-dispatch-dotenv.ts
/** Load only the env files needed before dispatching a command through the gateway. */
async function loadGatewayDispatchCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwdEnvPath = path.join(process.cwd(), ".env");
	if (fs.existsSync(cwdEnvPath)) {
		const { loadCliDotEnv } = await import("./dotenv-DFg6C7gV.js");
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
