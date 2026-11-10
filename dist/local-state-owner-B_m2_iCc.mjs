import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cli/local-state-owner.ts
const localOwnerAssertion = new AsyncLocalStorage();
var LocalStateOwnerError = class extends Error {
	constructor(code, message, cause) {
		super(message, { cause });
		this.code = code;
		this.name = "LocalStateOwnerError";
	}
};
/** Select one owner before domain admission and retain offline custody through resource settlement. */
async function runWithLocalStateOwner(params) {
	localOwnerAssertion.getStore()?.();
	const databasePortRecovery = params.databasePortRecovery ? Object.freeze({ ...params.databasePortRecovery }) : void 0;
	const selectedEnv = { ...process.env };
	const selectedStateDir = resolveStateDir(selectedEnv);
	const stateDir = resolveIdentityPathViaExistingAncestorSync(selectedStateDir);
	const env = {
		...selectedEnv,
		OPENCLAW_STATE_DIR: stateDir,
		OPENCLAW_CONFIG_PATH: resolveConfigPath(selectedEnv, selectedStateDir)
	};
	const input = typeof params.params === "function" ? params.params : structuredClone(params.params);
	const scopes = [...params.scopes ?? ["operator.admin"]];
	const [{ acquireGatewayLock, isGatewayLifecycleContentionError, readActiveGatewayLockIdentity, readLockPayloadSync, resolveGatewayLockPaths }, { captureGatewayStateOwner, tryBorrowGatewayStateOwner }, { createOpenClawDatabaseMaintenanceScope }] = await Promise.all([
		import("./gateway-lock-BLFQD0F1.mjs"),
		import("./gateway-state-owner-D23zOJLh.mjs"),
		import("./openclaw-state-db-async-lifecycle-BqnN_0u7.mjs")
	]);
	const paths = resolveGatewayLockPaths(env);
	const databasePath = path.join(paths.stateDir, "state", "openclaw.sqlite");
	const controller = new AbortController();
	const finished = createDeferredCore();
	const releaseExitGate = registerSignalExitGate(finished.promise, () => controller.abort());
	const assertTargetCurrent = () => {
		controller.signal.throwIfAborted();
		params.assertTargetCurrent?.();
	};
	const guidance = "Update the Gateway or fix authentication and retry. " + (params.requireLocalBackendSharedAuth ? "Provide the Gateway's shared secret through OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD in this CLI process; device pairing is not a substitute. " : "") + "To run offline, stop the Gateway through its service owner, wait for ownership to release, then rerun this exact command.";
	const refuse = (cause) => {
		throw new LocalStateOwnerError("OWNER_UNAVAILABLE", `Cannot admit ${params.method} for ${params.target} in state root ${paths.stateDir}: ${redactSensitiveUrlLikeString(formatErrorMessage(cause))}. No local mutation was attempted. Inspect openclaw gateway status. ${guidance}`, cause);
	};
	const discover = async () => {
		try {
			assertTargetCurrent();
			const options = {
				env,
				requireInspection: true,
				signal: controller.signal
			};
			return params.onForeignOwner ? await readActiveGatewayLockIdentity({
				...options,
				includeEmbedded: true
			}) : await readActiveGatewayLockIdentity(options);
		} catch (error) {
			return refuse(error);
		}
	};
	const runLocal = async (assertOwnerCurrent) => {
		const assertCurrent = () => {
			assertTargetCurrent();
			assertOwnerCurrent();
		};
		assertCurrent();
		const { loadConfig } = await import("./config/config.js");
		assertCurrent();
		let config;
		return await localOwnerAssertion.run(assertCurrent, () => params.runLocal({
			env,
			get config() {
				assertCurrent();
				config ??= loadConfig();
				assertCurrent();
				return config;
			},
			signal: controller.signal,
			assertCurrent
		}));
	};
	const route = async (owner) => {
		const listenerPort = () => {
			if (!owner.ownerId) return refuse(/* @__PURE__ */ new Error("Gateway lacks the expected-owner contract; update the Gateway."));
			if (owner.port === void 0) return refuse(/* @__PURE__ */ new Error("The state owner has no Gateway listener"));
			return owner.port;
		};
		const requestGateway = async (gatewayMethod, gatewayInput, primary) => {
			const port = listenerPort();
			const { callGateway, isGatewayClientRequestError } = await import("./call-BvbeEASg.mjs");
			let dispatched = false;
			try {
				assertTargetCurrent();
				return await callGateway({
					method: gatewayMethod,
					configPath: paths.configPath,
					params: primary ? {
						...gatewayInput,
						expectedOwnerId: owner.ownerId
					} : gatewayInput,
					localPortOverride: port,
					ignoreEnvUrlOverride: true,
					requireLocalBackendSharedAuth: params.requireLocalBackendSharedAuth,
					allowLocalBackendAuthNone: params.requireLocalBackendSharedAuth,
					requiredMethods: [gatewayMethod],
					requiredCapabilities: [GATEWAY_SERVER_CAPS.LOCAL_STATE_OWNER_ROUTING, ...params.requiredCapabilities ?? []],
					timeoutMs: params.timeoutMs ?? 6e5,
					expectFinal: primary ? params.expectFinal : void 0,
					signal: controller.signal,
					scopes,
					onSignalAbort: primary ? params.onGatewaySignalAbort : void 0,
					onResponse: primary && params.onGatewayResponse ? async (request, connectionSignal) => {
						const guardedRequest = (method, requestParams, options) => {
							assertTargetCurrent();
							const current = readLockPayloadSync(paths.ownerLockPath, true);
							if (!current || current.ownerId !== owner.ownerId || current.pid !== owner.pid) refuse(/* @__PURE__ */ new Error("Gateway owner changed during the operation"));
							return request(method, requestParams, options);
						};
						await params.onGatewayResponse(guardedRequest, AbortSignal.any([controller.signal, connectionSignal]));
					} : void 0,
					clientName: GATEWAY_CLIENT_NAMES.CLI,
					mode: GATEWAY_CLIENT_MODES.CLI,
					assertDispatchCurrent: () => {
						assertTargetCurrent();
						const current = readLockPayloadSync(paths.ownerLockPath, true);
						if (!current || current.ownerId !== owner.ownerId || current.pid !== owner.pid) refuse(/* @__PURE__ */ new Error("Gateway owner changed before dispatch"));
						dispatched = true;
					}
				});
			} catch (error) {
				const refused = isGatewayClientRequestError(error) && typeof error.details === "object" && error.details !== null && "mutationAccepted" in error.details && error.details.mutationAccepted === false;
				throw new LocalStateOwnerError(dispatched && !refused ? "OUTCOME_UNKNOWN" : "OWNER_REFUSED", `Gateway owning ${paths.stateDir} on local port ${port} could not complete ${gatewayMethod} for ${params.target}: ${redactSensitiveUrlLikeString(formatErrorMessage(error))}. ` + (dispatched && !refused ? `The outcome may be partial; inspect ${params.recoveryCommand ?? "the operation's status"} and the target before retrying. No local fallback was attempted.` : `No local mutation was attempted. ${guidance}`), error);
			}
		};
		if (typeof params.onForeignOwner === "function") {
			assertTargetCurrent();
			const result = await params.onForeignOwner({
				env,
				signal: controller.signal,
				assertCurrent: assertTargetCurrent,
				requestOwner: (ownerMethod, ownerInput) => requestGateway(ownerMethod, ownerInput, false)
			});
			assertTargetCurrent();
			return result;
		}
		if (params.onForeignOwner === "refuse") return refuse(/* @__PURE__ */ new Error("This operation requires exclusive offline state ownership"));
		listenerPort();
		const gatewayInput = typeof input === "function" ? structuredClone(await input(controller.signal)) : input;
		return await requestGateway(params.method, gatewayInput, true);
	};
	try {
		assertTargetCurrent();
		const hosted = captureGatewayStateOwner(databasePath);
		if (hosted) {
			if (databasePortRecovery) return refuse(/* @__PURE__ */ new Error("Database port recovery requires exclusive offline ownership"));
			return await runLocal(hosted.assertCurrent);
		}
		const owner = databasePortRecovery ? void 0 : await discover();
		if (owner) return await route(owner);
		let lock;
		try {
			lock = await acquireGatewayLock({
				env,
				role: "agent-embedded",
				allowInTests: true,
				databasePortRecovery
			});
		} catch (error) {
			if (!databasePortRecovery && isGatewayLifecycleContentionError(error)) {
				const winner = await discover();
				if (winner) return await route(winner);
			}
			return refuse(error);
		}
		if (!lock) return refuse(/* @__PURE__ */ new Error("Offline state ownership was not acquired"));
		const resources = createOpenClawDatabaseMaintenanceScope({
			assertOwnerCurrent: () => lock.assertCurrent(),
			assertDatabaseAccess: lock.assertDatabaseAccess
		});
		let uncertainCleanup = false;
		try {
			return await resources.run(() => runLocal(lock.assertCurrent));
		} catch (error) {
			uncertainCleanup = hasCommandProcessCleanupError(error);
			throw error;
		} finally {
			await resources.close();
			const retained = uncertainCleanup ? tryBorrowGatewayStateOwner(databasePath) : void 0;
			await lock.release();
			retained?.assertCurrent();
		}
	} finally {
		finished.resolve();
		releaseExitGate();
	}
}
//#endregion
export { runWithLocalStateOwner as t };
