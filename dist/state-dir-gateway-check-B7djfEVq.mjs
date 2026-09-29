import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { o as isLoopbackGatewayUrl } from "./net-DU4aWKLv.mjs";
import { a as resolveGatewayService } from "./service-BCULlL85.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as buildGatewayConnectionDetails, o as callGateway, p as isGatewayCredentialsRequiredError } from "./call-C_MP4_Gs.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-Dr91v3w1.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { r as probeGateway } from "./probe-DaF600Lm.mjs";
import path from "node:path";
//#region src/cli/state-dir-gateway-check.ts
const STATE_DIR_CHECK_TIMEOUT_MS = 3e3;
const GATEWAY_SERVICE_PATHS_UNVERIFIED = "Installed Gateway service state and config paths could not be verified. Inspect the service environment with `openclaw gateway status --deep` before repairing plugin state.";
async function inspectInstalledGatewayStatePaths(timeoutMs = STATE_DIR_CHECK_TIMEOUT_MS) {
	try {
		const serviceEnv = { ...process.env };
		delete serviceEnv.OPENCLAW_STATE_DIR;
		delete serviceEnv.OPENCLAW_CONFIG_PATH;
		delete serviceEnv.OPENCLAW_HOME;
		const command = await resolveGatewayService().readCommand(serviceEnv, {
			timeoutMs,
			requireEffective: true
		});
		if (!command) return { kind: "absent" };
		const environment = command.environment;
		if (!environment || ![
			"OPENCLAW_STATE_DIR",
			"OPENCLAW_HOME",
			"HOME",
			"USERPROFILE"
		].some((key) => environment[key]?.trim())) return { kind: "unknown" };
		return {
			kind: "known",
			stateDir: resolveStateDir(environment),
			configPath: resolveConfigPath(environment)
		};
	} catch {
		return { kind: "unknown" };
	}
}
function compareCliGatewayStateDirs(params) {
	const cliStateDir = resolveIdentityPathViaExistingAncestorSync(params.cliStateDir);
	const cliConfigPath = resolveIdentityPathViaExistingAncestorSync(params.cliConfigPath);
	const gatewayStateDir = resolveIdentityPathViaExistingAncestorSync(params.gatewayStateDir);
	const gatewayConfigPath = resolveIdentityPathViaExistingAncestorSync(params.gatewayConfigPath ?? path.join(gatewayStateDir, "openclaw.json"));
	const differences = [cliStateDir !== gatewayStateDir && `state directories (CLI: ${params.cliStateDir}; Gateway: ${gatewayStateDir})`, cliConfigPath !== gatewayConfigPath && `config paths (CLI: ${params.cliConfigPath}; Gateway: ${gatewayConfigPath})`].filter((difference) => Boolean(difference));
	if (differences.length === 0) return { kind: "allow" };
	const detail = differences.join(" and ");
	if (params.mode === "warn") return {
		kind: "warn",
		message: `CLI and ${params.source} use different ${detail}. Local commands may read or write state the Gateway does not use.`
	};
	return {
		kind: "refuse",
		message: [
			`No credentials or configuration were written. CLI and ${params.source} use different ${detail}.`,
			`Fix: run OPENCLAW_STATE_DIR=${quoteCliArg(gatewayStateDir)} OPENCLAW_CONFIG_PATH=${quoteCliArg(gatewayConfigPath)} ${params.command ?? "openclaw configure"}.`,
			params.source === "live Gateway" ? "To write another local store intentionally, stop the running Gateway first." : "To write another local store intentionally, uninstall or reconfigure the divergent Gateway service first."
		].join(" ")
	};
}
async function checkCliGatewayStateDir(params) {
	const cliStateDir = resolveStateDir(process.env);
	const cliConfigPath = resolveConfigPath(process.env);
	const details = buildGatewayConnectionDetails({ config: params.config });
	if (!isLoopbackGatewayUrl(details.url)) return {
		kind: "warn",
		message: `Gateway target ${projectGatewayUrlForDiagnostics(details.url)} is remote. Local credentials and configuration do not reach that Gateway.`
	};
	let hello;
	let connectionError;
	try {
		await callGateway({
			config: params.config,
			method: "status",
			params: { includeChannelSummary: false },
			scopes: [ADMIN_SCOPE],
			sharedStateMode: "read-only",
			timeoutMs: STATE_DIR_CHECK_TIMEOUT_MS,
			onHelloOk: (value) => {
				hello = value;
			}
		});
	} catch (error) {
		connectionError = error;
	}
	if (hello?.snapshot.stateDir) return compareCliGatewayStateDirs({
		cliStateDir,
		cliConfigPath,
		gatewayStateDir: hello.snapshot.stateDir,
		gatewayConfigPath: hello.snapshot.configPath,
		source: "live Gateway",
		mode: "refuse",
		command: params.command
	});
	const servicePaths = await inspectInstalledGatewayStatePaths();
	if (servicePaths.kind === "unknown") return {
		kind: "warn",
		message: GATEWAY_SERVICE_PATHS_UNVERIFIED
	};
	if (servicePaths.kind === "known") return compareCliGatewayStateDirs({
		cliStateDir,
		cliConfigPath,
		gatewayStateDir: servicePaths.stateDir,
		gatewayConfigPath: servicePaths.configPath,
		source: "installed Gateway service",
		mode: "refuse",
		command: params.command
	});
	if (isGatewayCredentialsRequiredError(connectionError)) {
		if ((await probeGateway({
			url: details.url,
			config: params.config,
			timeoutMs: STATE_DIR_CHECK_TIMEOUT_MS,
			includeDetails: false,
			suppressStoredDeviceAuth: true
		})).gatewayReached) return {
			kind: "warn",
			message: "Gateway is reachable but requires credentials, so its state and config paths could not be verified. Local writes may not reach it."
		};
	}
	return { kind: "allow" };
}
//#endregion
export { inspectInstalledGatewayStatePaths as i, checkCliGatewayStateDir as n, compareCliGatewayStateDirs as r, GATEWAY_SERVICE_PATHS_UNVERIFIED as t };
