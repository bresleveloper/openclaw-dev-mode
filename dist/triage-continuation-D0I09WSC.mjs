import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as buildCliRespawnPlan } from "./entry.respawn-DrPviqKU.mjs";
import { Jn as string, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as shouldDetachChildForProcessTree, t as forceKillChildProcessTree } from "./child-process-tree-Cmpyfjdc.mjs";
import { r as triageFailureSchema, t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV, r as UPDATE_RUN_ID_ENV, s as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-D6ewFI99.mjs";
import { i as resolveInstallationTarget, r as installationTargetEnv } from "./installation-target-context-CrBRhZSM.mjs";
import { n as createManagedUpdateRequesterAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-DOtkGjU8.mjs";
import { o as resolveUpdatedInstallCommandEnv, s as stripGatewayServiceMarkerEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import "./shared-Ca2ebFXK.mjs";
import { realpathSync } from "node:fs";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
//#region src/infra/triage-continuation.ts
const TRIAGE_HANDOFF_GRACE_MS = 3e4;
const readySchema = strictObject({
	type: literal("triage-ready"),
	version: literal(2)
});
const continuationSchema = strictObject({
	type: literal("triage"),
	version: literal(2),
	failure: triageFailureSchema,
	installRoot: string().min(1).max(4096),
	owner: string().min(1).max(4096),
	requester: strictObject({
		channel: string().max(4096).optional(),
		accountId: string().max(4096).optional(),
		senderId: string().max(4096).optional(),
		authorizationSource: string().max(4096).optional()
	}).optional()
});
function ownsChildLease(root, action) {
	const store = createManagedHandoffLeaseStore();
	const result = store.read(root);
	return result.kind === "current" && result.lease.action.kind === action && result.lease.helper.pid === process.ppid && process.connected && store.owns(result.lease, "executor") ? result.lease : null;
}
async function exchangeWithParent(message, signal) {
	return await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error, value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			process.removeListener("message", received);
			process.removeListener("disconnect", disconnected);
			signal?.removeEventListener("abort", aborted);
			if (error) reject(error);
			else resolve(value);
		};
		const received = (value) => finish(null, value);
		const disconnected = () => finish(/* @__PURE__ */ new Error("automatic triage owner disconnected"));
		const aborted = () => finish(/* @__PURE__ */ new Error("automatic triage admission cancelled"));
		const timer = setTimeout(() => finish(/* @__PURE__ */ new Error("automatic triage admission timed out")), TRIAGE_HANDOFF_GRACE_MS);
		process.once("message", received).once("disconnect", disconnected);
		signal?.addEventListener("abort", aborted, { once: true });
		if (signal?.aborted) {
			aborted();
			return;
		}
		if (!process.connected || !process.send) {
			disconnected();
			return;
		}
		process.send(message, (error) => {
			if (error) finish(error);
		});
	});
}
async function resolveTriageEntrypoint(root) {
	const entry = await resolveGatewayInstallEntrypoint(root);
	if (!entry) throw new Error("installed CLI entry is unavailable; repair the installation and run openclaw triage manually");
	return [
		resolveNodeRunner(),
		entry,
		"triage"
	];
}
async function queueManagedUpdateTriage(failure, commandArgv, signal) {
	if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1") return false;
	const root = (await readControlPlaneUpdateSentinelMeta())?.root;
	signal?.throwIfAborted();
	const claim = root ? ownsChildLease(root, "update") : null;
	if (!root || !claim || !process.connected) throw new Error("managed update triage lost its live owner; run openclaw triage manually");
	const request = {
		type: "triage-request",
		version: 2,
		failure: triageFailureSchema.parse(failure),
		commandArgv
	};
	try {
		const response = await exchangeWithParent(request, signal);
		const current = ownsChildLease(root, "update");
		if (!strictObject({
			type: literal("triage-queued"),
			version: literal(2)
		}).safeParse(response).success || !process.connected || JSON.stringify(current) !== JSON.stringify(claim)) throw new Error("managed update triage continuation was refused or revoked");
		signal?.throwIfAborted();
	} catch (error) {
		try {
			process.send?.({
				type: "triage-request-cancel",
				version: 2
			}, () => {});
		} catch {}
		throw error;
	}
	try {
		strictObject({
			type: literal("triage-committed"),
			version: literal(2)
		}).parse(await exchangeWithParent({
			type: "triage-commit",
			version: 2
		}));
	} catch (error) {
		throw new Error("automatic triage handoff confirmation lost; inspect the handoff log", { cause: error });
	}
	return true;
}
async function continueTriageInFreshProcess(params) {
	params.signal.throwIfAborted();
	const root = realpathSync(params.root);
	const failure = triageFailureSchema.parse(params.failure);
	if (failure.installationRoot !== root) throw new Error("automatic triage installation root mismatch");
	const store = createManagedHandoffLeaseStore();
	const acquired = store.acquire(root, randomUUID(), {
		kind: "triage",
		phase: "reserved",
		lifetime: {
			kind: "foreground",
			boot: store.bootIdentity()
		}
	});
	if (acquired.kind === "busy") {
		params.output("Automatic triage already owned for this installation; wait for its cleanup or inspect the saved diagnostics and run openclaw triage manually.\n");
		return;
	}
	let lease = acquired.lease;
	let child;
	let admitted = false;
	let cancelled = false;
	let closed = false;
	let exited = false;
	let output = "";
	let timeout;
	let shutdown;
	let forced = false;
	const completion = createDeferredCore();
	const armShutdown = () => {
		shutdown ??= setTimeout(() => {
			if (closed || !child) return;
			forced = true;
			try {
				lease = store.settle(lease, "uncertain") ?? lease;
			} catch {}
			try {
				if (!exited && JSON.stringify(store.processIdentity(child.pid)) === JSON.stringify(lease.executor)) forceKillChildProcessTree(child);
			} catch {}
			child.unref();
			completion.resolve({
				code: null,
				signal: "SIGKILL"
			});
		}, TRIAGE_HANDOFF_GRACE_MS);
	};
	const cancel = () => {
		cancelled = true;
		if (closed || !child) return;
		armShutdown();
		if (exited) return;
		if (admitted) {
			try {
				lease = store.settle(lease, "closing") ?? lease;
			} catch {
				params.output("Automatic triage revocation could not be recorded; retain the claim and inspect saved diagnostics.\n");
			}
			try {
				if (child.connected) child.send({
					type: "triage-cancel",
					version: 2
				}, () => {});
			} catch {}
		} else forceKillChildProcessTree(child);
	};
	params.signal.addEventListener("abort", cancel, { once: true });
	try {
		params.output("Automatic triage is preparing the installed CLI; diagnostics will follow.\n");
		const env = {
			...stripGatewayServiceMarkerEnv(resolveUpdatedInstallCommandEnv()),
			...installationTargetEnv(resolveInstallationTarget()),
			OPENCLAW_UPDATE_RUN_HANDOFF: "1"
		};
		const startup = buildCliRespawnPlan({
			argv: params.commandArgv,
			env,
			execArgv: [],
			execPath: params.commandArgv[0]
		});
		params.signal.throwIfAborted();
		child = spawn(startup?.command ?? params.commandArgv[0], startup?.argv ?? params.commandArgv.slice(1), {
			env: startup?.env ?? env,
			detached: shouldDetachChildForProcessTree(),
			stdio: [
				"ignore",
				"pipe",
				"pipe",
				"ipc"
			]
		});
		child.once("error", () => {
			if (child?.pid) {
				cancel();
				return;
			}
			closed = true;
			completion.resolve({
				code: 1,
				signal: null
			});
		});
		child.once("exit", () => {
			exited = true;
			armShutdown();
		});
		child.once("close", (code, signal) => {
			closed = true;
			completion.resolve({
				code,
				signal
			});
		});
		for (const stream of [child.stdout, child.stderr]) stream?.on("data", (chunk) => {
			output = (output + chunk.toString()).slice(-32768);
		});
		await once(child, "spawn");
		try {
			const bound = child.pid ? store.bind(lease, child.pid) : null;
			if (!bound) throw new Error("automatic triage child identity could not be bound");
			lease = bound;
		} catch (error) {
			cancel();
			await completion.promise;
			throw error;
		}
		child.on("message", (message) => {
			if (closed || exited || cancelled || admitted || params.signal.aborted || !child?.connected || !readySchema.safeParse(message).success || !store.owns(lease)) {
				cancel();
				return;
			}
			try {
				const running = store.activate(lease);
				if (!running) {
					cancel();
					return;
				}
				lease = running;
				admitted = true;
				clearTimeout(timeout);
				child.send({
					type: "triage",
					version: 2,
					installRoot: root,
					owner: lease.owner,
					failure
				}, (error) => {
					if (error) cancel();
				});
			} catch {
				cancel();
			}
		});
		child.once("disconnect", () => {
			if (!closed) cancel();
		});
		timeout = setTimeout(cancel, TRIAGE_HANDOFF_GRACE_MS);
		if (params.signal.aborted) cancel();
		const exit = await completion.promise;
		if (output) params.output(output);
		const completed = store.readGeneration(lease);
		if (admitted && completed?.action.phase === "closed") lease = completed;
		if (forced || !store.release(lease) && admitted) {
			store.settle(lease, "uncertain");
			throw new Error("automatic triage cleanup is uncertain; automatic admission remains blocked for this OS boot. Inspect saved diagnostics and run openclaw triage manually; do not delete the claim while work may remain. A verified different OS boot allows a fresh automatic attempt");
		}
		params.signal.throwIfAborted();
		if (!admitted || exit.code !== 0 || exit.signal) throw new Error(`automatic triage candidate ${admitted ? `failed (exit ${exit.code ?? "signal"})` : "is incompatible"}; run openclaw triage manually`);
	} finally {
		clearTimeout(timeout);
		clearTimeout(shutdown);
		params.signal.removeEventListener("abort", cancel);
		if (!admitted) store.release(lease);
		child?.stdout?.destroy();
		child?.stderr?.destroy();
		if (child?.connected) child.disconnect();
	}
}
async function acceptTriageContinuation() {
	if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1") return;
	if (!process.send || !process.connected) throw new Error("automatic triage requires its original connected owner; run openclaw triage manually");
	const store = createManagedHandoffLeaseStore();
	const controller = new AbortController();
	const parent = store.processIdentity(process.ppid);
	let lease;
	let requesterAuthority;
	let watch;
	let disposed = false;
	let shutdown;
	const armShutdown = () => {
		if (!lease || shutdown) return;
		shutdown = setTimeout(() => {
			try {
				store.settle(lease, "uncertain");
			} finally {
				process.kill(process.pid, "SIGKILL");
			}
		}, TRIAGE_HANDOFF_GRACE_MS);
		shutdown.unref();
	};
	const cancel = (reason) => {
		if (disposed || controller.signal.aborted) return;
		armShutdown();
		try {
			if (lease) store.settle(lease, "closing");
		} catch {}
		controller.abort(reason instanceof Error ? reason : /* @__PURE__ */ new Error("automatic triage cancelled: live owner or claim lost"));
		if (lease?.action.kind === "triage" && lease.action.lifetime.kind === "native") try {
			store.stopNative(lease, true);
		} catch {}
	};
	const onMessage = (message) => {
		if (strictObject({
			type: literal("triage-cancel"),
			version: literal(2)
		}).safeParse(message).success) cancel();
	};
	const checkCurrent = () => {
		try {
			if (requesterAuthority && !requesterAuthority.isCurrent()) throw new UpdateRequesterRevokedError();
			if (disposed || !lease || !process.connected || process.ppid !== parent.pid || !store.owns(lease, "executor") || lease.action.kind === "triage" && lease.action.lifetime.kind === "native" && (lease.action.lifetime.placement.kind !== "attached" || !store.isInNativeScope(lease.action.lifetime))) cancel();
		} catch (error) {
			cancel(error);
		}
	};
	const assertCurrent = () => {
		checkCurrent();
		if (disposed) throw new Error("automatic triage continuation is closed");
		controller.signal.throwIfAborted();
	};
	const finish = async (cleanup) => {
		if (disposed) return;
		armShutdown();
		try {
			if (lease) {
				if (cleanup === "closed") store.settle(lease, "closed");
				else store.settle(lease, "uncertain");
			}
		} finally {
			disposed = true;
			clearInterval(watch);
			process.removeListener("disconnect", cancel).removeListener("message", onMessage);
			controller.abort(/* @__PURE__ */ new Error("automatic triage continuation closed"));
			if (process.connected) process.disconnect?.();
		}
	};
	process.once("disconnect", cancel);
	try {
		const { failure, installRoot, owner, requester } = continuationSchema.parse(await exchangeWithParent({
			type: "triage-ready",
			version: 2
		}));
		const admitted = ownsChildLease(installRoot, "triage");
		if (!admitted || admitted.owner !== owner || admitted.action.kind !== "triage" || admitted.action.phase !== "running" || realpathSync(installRoot) !== installRoot || failure.installationRoot !== installRoot || JSON.stringify(admitted.helper) !== JSON.stringify(parent)) throw new Error("automatic triage lost its live root/generation claim");
		lease = admitted;
		if (admitted.action.lifetime.kind === "native") {
			const life = admitted.action.lifetime;
			if (life.placement.kind !== "attached" || !store.isInNativeScope(life)) throw new Error("automatic triage executor is outside its native scope");
		}
		requesterAuthority = requester ? await createManagedUpdateRequesterAuthority(requester) : void 0;
		process.on("message", onMessage);
		watch = setInterval(checkCurrent, 250);
		assertCurrent();
		delete process.env.OPENCLAW_UPDATE_RUN_HANDOFF;
		delete process.env[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV];
		delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
		delete process.env[UPDATE_RUN_ID_ENV];
		return {
			failure,
			signal: controller.signal,
			assertCurrent,
			finish
		};
	} catch (error) {
		cancel();
		await finish("uncertain");
		throw error;
	}
}
//#endregion
export { resolveTriageEntrypoint as i, continueTriageInFreshProcess as n, queueManagedUpdateTriage as r, acceptTriageContinuation as t };
