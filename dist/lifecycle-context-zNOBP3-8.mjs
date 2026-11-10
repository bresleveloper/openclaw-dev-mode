import { r as parseTcpPortFromArgs } from "./tcp-port-B-4SirsX.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { a as readBestEffortConfig } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import "./config-B3oiWDlr.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-un685p3z.mjs";
import { r as createManagedUpdateRequesterAuthority } from "./update-requester-authority-BP771TSP.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-D3oE2IOJ.mjs";
//#region src/cli/daemon-cli/lifecycle-context.ts
async function resolveGatewayLifecycleContext(service = resolveGatewayService(), requireEffective = false) {
	const command = requireEffective ? await service.readCommand(process.env, { requireEffective: true }) : await service.readCommand(process.env).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		return null;
	});
	if (requireEffective && !command) throw new Error("Updated gateway service could not be inspected; run `openclaw gateway status --deep`.");
	const env = mergeGatewayServiceEnv(process.env, command);
	const config = await createConfigIO({
		env,
		observe: false,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => void 0);
	return {
		port: parseTcpPortFromArgs(command?.programArguments) ?? resolveGatewayPort(config, env),
		env,
		config,
		command
	};
}
async function resolveGatewayConfigPorts() {
	const config = await readBestEffortConfig({ observe: false }).catch(() => void 0);
	return {
		explicit: config?.gateway?.port,
		fallback: resolveGatewayPort(config, process.env)
	};
}
async function waitForGatewayUpdateRecovery(expectedVersion, expectedBuildId, timeoutMs) {
	if (!expectedVersion?.trim()) throw new Error("Recovery Gateway version is unavailable.");
	const service = resolveGatewayService();
	const { port, env } = await resolveGatewayLifecycleContext(service, true);
	return await waitForGatewayHealthyRestart({
		service,
		port,
		env,
		expectedVersion,
		expectedBuildId,
		timeoutMs,
		requireRunningService: true,
		settle: { probes: 12 }
	});
}
async function isManagedUpdateRequesterOwner(requester) {
	return (await createManagedUpdateRequesterAuthority(requester)).isCurrent();
}
//#endregion
export { waitForGatewayUpdateRecovery as i, resolveGatewayConfigPorts as n, resolveGatewayLifecycleContext as r, isManagedUpdateRequesterOwner as t };
