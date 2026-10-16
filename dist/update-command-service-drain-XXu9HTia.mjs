import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as GatewayServiceStopUnsafeError } from "./service-inspection-error-Bsltcpi4.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import { n as inspectPortUsage } from "./ports-inspect-54fwKbFD.mjs";
import { p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-_baZk9PF.mjs";
import { i as callGatewayCli, y as resolveReadOnlyLocalGatewayAuth } from "./call-DnqhP17M.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-CR5N1X89.mjs";
import { r as classifyGatewayStaleConnectionError } from "./stale-install-CLeiGj_K.mjs";
import { a as resolveGatewayRestartProbeContext, s as allListenersOwnedByRuntimePid } from "./restart-health-probe-AixgfgCP.mjs";
import { n as readSystemdGatewayStopTimeout } from "./systemd-maintenance-52u1ano2.mjs";
import { n as readLegacyGatewayLockIdentity } from "./gateway-lock-legacy-j9m2CmSY.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/update-cli/update-command-service-drain.ts
/** Keep short-budget residents behind their own admission fence until stop or release. */
async function withGatewayMaintenanceDrain(params, stop) {
	const deadline = performance.now() + (params.timeoutMs ?? 18e5);
	const explicitDrain = params.drainPolicy === "interrupt-after-drain";
	const requestId = randomUUID();
	let suspensionId;
	let stopped = false;
	let legacyStalePid;
	const finish = async () => {
		if (explicitDrain) assertDrainLease();
		if (legacyStalePid !== void 0) {
			if (!await ownsLegacyListener(legacyStalePid)) throw new Error("Legacy Gateway listener changed during maintenance drain");
			const legacy = await readLegacyGatewayLockIdentity(params.state.env);
			assertResidentCurrent();
			if (legacy?.state !== "alive" || legacy.pid !== legacyStalePid || legacy.pid !== params.state.runtime?.pid) throw new Error("Legacy Gateway identity changed during maintenance drain");
		}
		assertResidentCurrent();
		const result = await stop({ prepareEffect: async (beforeCommit) => {
			assertResidentCurrent();
			beforeCommit();
			if (!explicitDrain) return;
			const original = assertDrainLease();
			const handoff = await call("gateway.suspend.handoff", {
				suspensionId,
				target: processTarget,
				commit: true
			}, beforeCommit);
			assertResidentCurrent();
			if (handoff.status !== "committed" || handoff.suspensionId !== suspensionId || handoff.expiresAtMs !== original.expiresAtMs) throw new GatewayServiceStopUnsafeError("Gateway maintenance stop requires committed shutdown support in the serving Gateway. Update it through its existing installation owner before enabling native immutable activation.");
		} });
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
	let observationFailure;
	let processTarget;
	const assertDrainLease = () => {
		assertResidentCurrent();
		if (observationFailure || !lastObservation || lastObservation.status === "busy" || lastObservation.suspensionId !== suspensionId || lastObservation.expiresAtMs <= Date.now() || lastObservation.writeCustody === void 0) throw new GatewayServiceStopUnsafeError("Gateway maintenance stop refused: a current suspension lease with verified write custody is required. The Gateway was not stopped; retry the update after lifecycle inspection is available.");
		const held = lastObservation.writeCustody.filter(({ count }) => count > 0);
		if (held.length) throw new GatewayServiceStopUnsafeError(`Gateway maintenance stop refused: data at risk in owner phase ${held.map(({ phase, count }) => `${phase} (${count})`).join(", ")}. The Gateway was not stopped.`);
		return lastObservation;
	};
	const remaining = () => Math.max(1, deadline - performance.now());
	const connection = await (async () => {
		const { config, auth } = await resolveGatewayRestartProbeContext(params.state.env);
		const port = await resolveUpdatedGatewayRestartPort({
			config,
			serviceEnv: params.state.env,
			serviceCommand: params.state.command
		});
		const target = await createConfiguredGatewayLocalProbe(config).resolveWebSocketTarget(port);
		return {
			config,
			controlAuth: await resolveReadOnlyLocalGatewayAuth({
				auth,
				authNone: config.gateway?.auth?.mode === "none",
				env: params.state.env
			}),
			port,
			target
		};
	})().catch((error) => {
		observationFailure = { error };
	});
	assertResidentCurrent();
	const ownsLegacyListener = async (pid) => {
		if (!connection?.target) return false;
		const usage = await inspectPortUsage(connection.port, { probeHosts: ["127.0.0.1"] });
		assertResidentCurrent();
		return usage.status === "busy" && allListenersOwnedByRuntimePid(usage.listeners, pid);
	};
	const call = async (method, args, beforeDispatch) => {
		assertResidentCurrent();
		if (!connection?.target) throw observationFailure ? observationFailure.error : /* @__PURE__ */ new Error("Gateway TLS certificate unavailable");
		const { config, controlAuth, port, target } = connection;
		let observedBootId;
		const result = await callGatewayCli({
			method,
			params: args,
			config,
			...controlAuth,
			serviceTargetUrl: target.url,
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			tlsFingerprint: target.tlsFingerprint,
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
				beforeDispatch?.();
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
		observationFailure = { error };
	}
	assertResidentCurrent();
	if (!explicitDrain && !params.state.running && params.state.runtime?.status === "stopped" && observationFailure && connection?.target) {
		const usage = await inspectPortUsage(connection.port, { probeHosts: ["127.0.0.1"] });
		assertResidentCurrent();
		if (usage.status === "free") return await finish();
	}
	const staleResident = async () => {
		const reason = classifyGatewayStaleConnectionError(observationFailure?.error);
		if (reason === "installation-replaced") return true;
		if (reason !== "legacy-handler-unavailable" || !params.state.running) return false;
		const legacy = await readLegacyGatewayLockIdentity(params.state.env);
		assertResidentCurrent();
		if (legacy?.state !== "alive" || legacy.pid !== params.state.runtime?.pid) return false;
		if (!await ownsLegacyListener(legacy.pid)) return false;
		legacyStalePid = legacy.pid;
		return true;
	};
	if (!explicitDrain && await staleResident()) {
		params.warn("WARNING: The running Gateway's installation was replaced before this stop; it refuses connections, so lifecycle drain is skipped and it is stopped directly.");
		return await finish();
	}
	if ((managerTimeout ?? 0) < 33e4) params.warn(`Gateway service stop timeout is ${managerTimeout === void 0 ? "unverified" : `${managerTimeout}ms`} after policy refresh; preserving operator overrides and using lifecycle drain before stopping.`);
	if (!explicitDrain && (managerTimeout ?? 0) >= 33e4 && (residentBudget?.timeoutMs ?? 0) >= 325e3) return await finish();
	try {
		if (explicitDrain) {
			const identity = await call("system.info", {});
			if (identity.pid !== params.state.runtime?.pid || typeof identity.processInstanceId !== "string" || !identity.processInstanceId.trim()) throw new GatewayServiceStopUnsafeError("Gateway maintenance stop refused: the resident process identity could not be verified.");
			processTarget = {
				pid: identity.pid,
				processInstanceId: identity.processInstanceId
			};
			verifiedResident = true;
		}
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
				observationFailure = void 0;
			} catch (error) {
				assertResidentCurrent();
				observationFailure = { error };
			}
			assertResidentCurrent();
			if (!observationFailure && lastObservation?.status === "ready") return await finish();
			if (!explicitDrain && await staleResident()) {
				params.warn("WARNING: The running Gateway's installation was replaced during this stop; it refuses connections, so lifecycle drain is skipped and it is stopped directly.");
				return await finish();
			}
			if (performance.now() >= deadline) {
				if (explicitDrain) assertDrainLease();
				const custody = observationFailure ? void 0 : lastObservation?.writeCustody;
				const held = custody?.filter(({ count }) => count > 0);
				if (held?.length) throw new GatewayServiceStopUnsafeError(`Gateway maintenance stop refused: data at risk in owner phase ${held.map(({ phase, count }) => `${phase} (${count})`).join(", ")}. The update drain deadline expired; the Gateway was not stopped.`);
				const budget = residentBudget ? `${residentBudget.timeoutMs}ms` : "unknown";
				const work = lastObservation?.blockers.map(({ kind, count, message }) => `${kind}=${count} (${message})`).join(", ") || "admitted work";
				const roots = lastObservation ? lastObservation.blockers.find(({ kind }) => kind === "root-request")?.count ?? 0 : residentBudget?.activeWork?.rootRequests ?? "unknown";
				const cron = lastObservation ? lastObservation.blockers.find(({ kind }) => kind === "cron-run")?.count ?? 0 : residentBudget?.activeWork?.cronRuns ?? "unknown";
				const custodyNotice = custody === void 0 ? `The resident build cannot distinguish migrations/backups from ordinary work in this observation.${observationFailure ? ` Current lifecycle observation unavailable (${coerceErrorMessage(observationFailure.error)}).` : ""}` : "No lifecycle write custody was reported.";
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
export { withGatewayMaintenanceDrain as t };
