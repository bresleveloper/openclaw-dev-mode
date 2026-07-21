import { l as tryProcessCwd } from "./home-dir-CJKEsOtx.js";
import { v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-mWLbBl_z.js";
import { n as loadWorkspaceDotEnvFile } from "./dotenv-DQ8HKu66.js";
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
//#endregion
export { loadCliDotEnv };
