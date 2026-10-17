import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-B6mKYs2x.mjs";
import { fileURLToPath } from "node:url";
//#region src/docker-healthcheck.ts
async function resolveDockerHealthcheckPort(deps = {}) {
	const env = deps.env ?? process.env;
	const readActivePort = deps.readActiveGatewayLockPort ?? readActiveGatewayLockPort;
	try {
		const activePort = await readActivePort({ env });
		if (activePort !== void 0) return activePort;
	} catch {}
	const config = (deps.getRuntimeConfig ?? (() => getRuntimeConfig({
		pin: false,
		skipPluginValidation: true,
		skipShellEnvFallback: true
	})))();
	return (deps.resolveGatewayPort ?? resolveGatewayPort)(config, env);
}
async function probeDockerGatewayHealth(deps = {}) {
	try {
		const port = await resolveDockerHealthcheckPort(deps);
		return (await (deps.fetch ?? globalThis.fetch)(`http://127.0.0.1:${port}/healthz`)).ok;
	} catch {
		return false;
	}
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) probeDockerGatewayHealth().then((healthy) => {
	process.exitCode = healthy ? 0 : 1;
});
//#endregion
export { probeDockerGatewayHealth };
