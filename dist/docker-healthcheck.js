import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { b as resolveGatewayPort, d as parseGatewayPortEnvValue } from "./paths-orClZ-2Z.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import "./config-B3oiWDlr.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-OT1e72lx.mjs";
import { fileURLToPath } from "node:url";
//#region src/docker-healthcheck.ts
async function resolveDockerHealthcheckPort() {
	try {
		const activePort = await readActiveGatewayLockPort({ env: process.env });
		if (activePort !== void 0) return activePort;
	} catch {}
	const envPort = parseGatewayPortEnvValue(process.env.OPENCLAW_GATEWAY_PORT);
	if (envPort !== null) return envPort;
	const config = await createConfigIO({
		pluginValidation: "skip",
		shellEnvFallback: "defer"
	}).loadConfigAsync();
	return resolveGatewayPort(config, process.env);
}
async function probeDockerGatewayHealth() {
	try {
		const port = await resolveDockerHealthcheckPort();
		return (await globalThis.fetch(`http://127.0.0.1:${port}/healthz`)).ok;
	} catch {
		return false;
	}
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) probeDockerGatewayHealth().then((healthy) => {
	process.exitCode = healthy ? 0 : 1;
});
//#endregion
export { probeDockerGatewayHealth };
