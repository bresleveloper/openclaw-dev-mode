import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-BFniU76K.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-BTjjxElt.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/cli/local-state-owner.ts
var LocalStateOwnerError = class extends Error {
	constructor(code, message, cause) {
		super(message, { cause });
		this.code = code;
		this.name = "LocalStateOwnerError";
	}
};
/** Select one owner before domain admission and retain offline custody through resource settlement. */
async function runWithLocalStateOwner(params) {
	const selectedEnv = { ...process.env };
	const selectedStateDir = resolveStateDir(selectedEnv);
	const stateDir = resolveIdentityPathViaExistingAncestorSync(selectedStateDir);
	const rootIdentity = statSync(stateDir, {
		bigint: true,
		throwIfNoEntry: false
	});
	const env = {
		...selectedEnv,
		OPENCLAW_STATE_DIR: stateDir,
		OPENCLAW_CONFIG_PATH: resolveConfigPath(selectedEnv, selectedStateDir)
	};
	const input = structuredClone(params.params);
	const [{ acquireGatewayLock, isGatewayLifecycleContentionError, isSameGatewayLockIdentity, readActiveGatewayLockIdentity, readLockPayloadSync, resolveGatewayLockPaths }, { captureGatewayStateOwner }, { createOpenClawDatabaseMaintenanceScope }] = await Promise.all([
		import("./gateway-lock-C0JnIOLH.mjs"),
		import("./gateway-state-owner-58tyvYs2.mjs"),
		import("./openclaw-state-db-async-lifecycle-B0GRf5rO.mjs")
	]);
	const paths = resolveGatewayLockPaths(env);
	const databasePath = path.join(paths.stateDir, "state", "openclaw.sqlite");
	const controller = new AbortController();
	const finished = createDeferredCore();
	const releaseExitGate = registerSignalExitGate(finished.promise, () => controller.abort());
	const assertTargetCurrent = () => {
		controller.signal.throwIfAborted();
		const ambientPaths = resolveGatewayLockPaths(process.env);
		const currentRoot = rootIdentity ? statSync(stateDir, {
			bigint: true,
			throwIfNoEntry: false
		}) : void 0;
		if (paths.stateDir !== stateDir || ambientPaths.ownerLockPath !== paths.ownerLockPath || ambientPaths.configPath !== paths.configPath || resolveIdentityPathViaExistingAncestorSync(selectedStateDir) !== stateDir || rootIdentity && (currentRoot?.dev !== rootIdentity.dev || currentRoot?.ino !== rootIdentity.ino) || resolveGatewayLockPaths(selectedEnv).ownerLockPath !== paths.ownerLockPath) throw new LocalStateOwnerError("OWNER_UNAVAILABLE", "Selected state root changed; rerun the command.");
		params.assertTargetCurrent?.();
	};
	const guidance = `Update the Gateway or fix authentication and retry. To run offline, stop the Gateway through its service owner, wait for ownership to release, then rerun this exact command.`;
	const refuse = (cause) => {
		throw new LocalStateOwnerError("OWNER_UNAVAILABLE", `Cannot admit ${params.method} for ${params.target} in state root ${paths.stateDir}: ${redactSensitiveUrlLikeString(formatErrorMessage(cause))}. No local mutation was attempted. Inspect openclaw gateway status. ${guidance}`, cause);
	};
	const discover = async () => {
		try {
			assertTargetCurrent();
			return await readActiveGatewayLockIdentity({
				env,
				requireInspection: true,
				signal: controller.signal
			});
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
		const { getRuntimeConfig } = await import("./config/config.js");
		assertCurrent();
		const config = getRuntimeConfig();
		assertCurrent();
		return await params.runLocal({
			env,
			config,
			signal: controller.signal,
			assertCurrent
		});
	};
	const route = async (owner) => {
		if (params.onForeignOwner === "refuse") return refuse(/* @__PURE__ */ new Error("This operation requires exclusive offline state ownership"));
		if (!owner.ownerId) return refuse(/* @__PURE__ */ new Error("Gateway lacks the expected-owner contract; update the Gateway."));
		const { callGateway, isGatewayClientRequestError } = await import("./call-CWvmXO5x.mjs");
		let dispatched = false;
		try {
			assertTargetCurrent();
			return await callGateway({
				method: params.method,
				configPath: paths.configPath,
				params: {
					...input,
					expectedOwnerId: owner.ownerId
				},
				localPortOverride: owner.port,
				ignoreEnvUrlOverride: true,
				requiredMethods: [params.method],
				requiredCapabilities: [GATEWAY_SERVER_CAPS.LOCAL_STATE_OWNER_ROUTING, ...params.requiredCapabilities ?? []],
				timeoutMs: 6e5,
				signal: controller.signal,
				scopes: ["operator.admin"],
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI,
				prepareDispatchCurrent: async () => {
					const current = await discover();
					if (!current || !isSameGatewayLockIdentity(owner, current)) refuse(/* @__PURE__ */ new Error("Gateway owner changed before dispatch"));
				},
				assertDispatchCurrent: () => {
					assertTargetCurrent();
					const current = readLockPayloadSync(paths.ownerLockPath, true);
					if (!current || current.ownerId !== owner.ownerId || current.pid !== owner.pid) refuse(/* @__PURE__ */ new Error("Gateway owner changed before dispatch"));
					dispatched = true;
				}
			});
		} catch (error) {
			const refused = isGatewayClientRequestError(error) && typeof error.details === "object" && error.details !== null && "mutationAccepted" in error.details && error.details.mutationAccepted === false;
			throw new LocalStateOwnerError(dispatched && !refused ? "OUTCOME_UNKNOWN" : "OWNER_REFUSED", `Gateway owning ${paths.stateDir} on local port ${owner.port} could not complete ${params.method} for ${params.target}: ${redactSensitiveUrlLikeString(formatErrorMessage(error))}. ` + (dispatched && !refused ? `The outcome may be partial; inspect ${params.recoveryCommand ?? "the operation's status"} and the target before retrying. No local fallback was attempted.` : `No local mutation was attempted. ${guidance}`), error);
		}
	};
	try {
		assertTargetCurrent();
		const hosted = captureGatewayStateOwner(databasePath);
		if (hosted) return await runLocal(hosted.assertCurrent);
		const owner = await discover();
		if (owner) return await route(owner);
		let lock;
		try {
			lock = await acquireGatewayLock({
				env,
				role: "agent-embedded",
				allowInTests: true
			});
		} catch (error) {
			if (isGatewayLifecycleContentionError(error)) {
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
		try {
			return await resources.run(() => runLocal(lock.assertCurrent));
		} finally {
			await resources.close();
			await lock.release();
		}
	} finally {
		finished.resolve();
		releaseExitGate();
	}
}
//#endregion
export { runWithLocalStateOwner as t };
