import { r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { o as readBestEffortConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import "./config-9720xhC5.mjs";
import { n as createManagedUpdateRequesterAuthority } from "./update-requester-authority-sTeqCewg.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-DD8z78x0.mjs";
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
