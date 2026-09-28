import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as GatewayServiceStopUnsafeError } from "./service-inspection-error-axo4k_qi.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-E5oPIr_h.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-Cv2D06JO.mjs";
import { s as callGatewayCli } from "./call-C_MP4_Gs.mjs";
import { i as resolveGatewayRestartProbeContext } from "./restart-health-probe-CZvLpSGR.mjs";
import { p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-LoWdIMX_.mjs";
import "./stale-install-BTpQ40eq.mjs";
import { n as readSystemdGatewayStopTimeout } from "./systemd-maintenance-DYRXQAJU.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/update-cli/update-command-service-drain.ts
/** Keep short-budget residents behind their own admission fence until stop or release. */
async function withGatewayMaintenanceDrain(params, stop) {
	const deadline = performance.now() + (params.timeoutMs ?? 18e5);
	const requestId = randomUUID();
	let suspensionId;
	let stopped = false;
	const finish = async () => {
		const result = await stop();
		stopped = true;
		return result;
	};
	let bootId;
	let residentChanged = false;
	const assertResidentCurrent = () => {
		params.assertCurrent();
		if (residentChanged) throw new Error("Gateway process changed during maintenance drain");
	};
	let residentBudget;
	let lastObservation;
	let observationError;
	const remaining = () => Math.max(1, deadline - performance.now());
	const connection = await (async () => {
		const { config, auth } = await resolveGatewayRestartProbeContext(params.state.env);
		const port = await resolveUpdatedGatewayRestartPort({
			config,
			serviceEnv: params.state.env,
			serviceCommand: params.state.command
		});
		return {
			config,
			auth,
			port,
			target: await createConfiguredGatewayLocalProbe(config).resolveWebSocketTarget(port)
		};
	})().catch((error) => {
		observationError = String(error);
	});
	assertResidentCurrent();
	const call = async (method, args) => {
		assertResidentCurrent();
		if (!connection?.target) throw new Error(observationError ?? "Gateway TLS certificate unavailable");
		const { config, auth, port, target } = connection;
		let observedBootId;
		const result = await callGatewayCli({
			method,
			params: args,
			config,
			token: auth?.token,
			password: auth?.password,
			skipImplicitAuth: true,
			serviceTargetUrl: target.url,
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			tlsFingerprint: target.tlsFingerprint,
			clientName: config.gateway?.auth?.mode === "none" ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
			mode: config.gateway?.auth?.mode === "none" ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
			requireLocalBackendSharedAuth: config.gateway?.auth?.mode === "none",
			deviceIdentity: null,
			sharedStateMode: "read-only",
			timeoutMs: 1e4,
			onHelloOk: (hello) => {
				observedBootId = hello.server.bootId;
			},
			assertDispatchCurrent: () => {
				assertResidentCurrent();
				if (bootId !== void 0 && bootId !== observedBootId) {
					residentChanged = true;
					assertResidentCurrent();
				}
				bootId = observedBootId;
			}
		});
		assertResidentCurrent();
		return result;
	};
	let managerTimeout;
	let verifiedResident = false;
	try {
		managerTimeout = await readSystemdGatewayStopTimeout(params.state);
		const resident = await call("status", { includeChannelSummary: false });
		if (typeof resident.pid === "number" && resident.pid === params.state.runtime?.pid) {
			residentBudget = resident.shutdownBudget;
			verifiedResident = true;
		}
	} catch (error) {
		observationError = String(error);
	}
	assertResidentCurrent();
	const staleResident = () => observationError !== void 0 && observationError.includes("gateway install changed; run: openclaw gateway restart");
	if (staleResident()) {
		params.warn("WARNING: The running Gateway's installation was replaced before this stop; it refuses connections, so lifecycle drain is skipped and it is stopped directly.");
		return await finish();
	}
	if ((managerTimeout ?? 0) < 33e4) params.warn(`Gateway service stop timeout is ${managerTimeout === void 0 ? "unverified" : `${managerTimeout}ms`} after policy refresh; preserving operator overrides and using lifecycle drain before stopping.`);
	if ((managerTimeout ?? 0) >= 33e4 && (residentBudget?.timeoutMs ?? 0) >= 325e3) return await finish();
	try {
		while (true) {
			try {
				if (!verifiedResident) {
					if ((await call("system.info", {})).pid !== params.state.runtime?.pid) {
						residentChanged = true;
						assertResidentCurrent();
					}
					verifiedResident = true;
				}
				lastObservation = await call("gateway.suspend.prepare", {
					requestId,
					drain: true,
					terminalPolicy: "terminate"
				});
				if (lastObservation.status !== "busy") suspensionId = lastObservation.suspensionId;
				observationError = void 0;
			} catch (error) {
				assertResidentCurrent();
				observationError = String(error);
			}
			assertResidentCurrent();
			if (!observationError && lastObservation?.status === "ready") return await finish();
			if (staleResident()) {
				params.warn("WARNING: The running Gateway's installation was replaced during this stop; it refuses connections, so lifecycle drain is skipped and it is stopped directly.");
				return await finish();
			}
			if (performance.now() >= deadline) {
				const custody = observationError ? void 0 : lastObservation?.writeCustody;
				const held = custody?.filter(({ count }) => count > 0);
				if (held?.length) throw new GatewayServiceStopUnsafeError(`Gateway maintenance stop refused: data at risk in owner phase ${held.map(({ phase, count }) => `${phase} (${count})`).join(", ")}. The update drain deadline expired; the Gateway was not stopped.`);
				const budget = residentBudget ? `${residentBudget.timeoutMs}ms` : "unknown";
				const work = lastObservation?.blockers.map(({ kind, count, message }) => `${kind}=${count} (${message})`).join(", ") || "admitted work";
				const roots = lastObservation ? lastObservation.blockers.find(({ kind }) => kind === "root-request")?.count ?? 0 : residentBudget?.activeWork?.rootRequests ?? "unknown";
				const cron = lastObservation ? lastObservation.blockers.find(({ kind }) => kind === "cron-run")?.count ?? 0 : residentBudget?.activeWork?.cronRuns ?? "unknown";
				const custodyNotice = custody === void 0 ? `The resident build cannot distinguish migrations/backups from ordinary work in this observation.${observationError ? ` Current lifecycle observation unavailable (${observationError}).` : ""}` : "No lifecycle write custody was reported.";
				const next = (managerTimeout ?? 0) >= 33e4 ? `the next Gateway starts with a ${GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3}s service stop budget` : `the next Gateway requires ${GATEWAY_SERVICE_STOP_TIMEOUT_MS / 1e3}s, but the effective service timeout remains ${managerTimeout === void 0 ? "unknown" : `${managerTimeout}ms`}`;
				params.warn(`WARNING: Gateway maintenance drain deadline reached: resident shutdown budget ${budget}; latest root-request=${roots}, cron-run=${cron}; stopping with ${work}. In-flight work may be interrupted. ${custodyNotice} ${next}.`);
				return await finish();
			}
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(lastObservation && lastObservation.status !== "ready" ? lastObservation.retryAfterMs : 1e3, remaining()));
			});
		}
	} finally {
		if (suspensionId && !stopped) await call("gateway.suspend.resume", { suspensionId }).catch(() => void 0);
	}
}
//#endregion
export { withGatewayMaintenanceDrain };
