import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { i as runExec } from "./exec-CIJxrT1J.js";
//#region src/infra/binaries.ts
async function ensureBinary(name, exec = runExec, runtime = defaultRuntime) {
	await exec("which", [name]).catch(() => {
		runtime.error(`Missing required binary: ${name}. Please install it.`);
		runtime.exit(1);
	});
}
//#endregion
export { ensureBinary };
