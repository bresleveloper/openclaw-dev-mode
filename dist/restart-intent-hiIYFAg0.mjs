import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as isPidDefinitelyDead, r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { b as tryAcquireGatewayLifecycleCleanupCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { o as readGatewayOwnerLease, s as readGatewayOwnerLeaseFromDatabase } from "./windows-port-pids-Bid_Huck.mjs";
import { a as spawnPsSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { l as readLockPayloadSync, u as resolveGatewayLockPaths } from "./gateway-lock-CYjRlApN.mjs";
import { s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { s as readGatewayServiceUpdateOriginalRoot } from "./service-update-authority-DujRnzx9.mjs";
import { t as gatewayServiceCommandMatchesRoot } from "./service-layout-DuzmQnH1.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { existsSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/restart-intent-error.ts
const refusalCode = "GATEWAY_RESTART_PREPARATION_REFUSED";
const failures = {
	"service-command": "Cannot verify the effective service command and state directory",
	"serving-owner": "Cannot verify a live serving Gateway owner for the selected service",
	"intent-recording": "Cannot record restart intent for the serving Gateway"
};
var GatewayRestartPreparationError = class extends Error {
	constructor(reason) {
		super(`${refusalCode}: ${failures[reason]}. Gateway was not signaled. Verify the service definition and Gateway status, then retry.`);
		this.reason = reason;
		this.code = refusalCode;
		this.name = "GatewayRestartPreparationError";
	}
};
//#endregion
//#region src/infra/restart-intent.ts
const GATEWAY_RESTART_INTENT_KEY = "gateway-restart";
const GATEWAY_RESTART_INTENT_TTL_MS = 6e4;
const schema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "gateway_restart_intent", { errorMessage: "Gateway restart intent schema markers are missing" });
const restartLog = createSubsystemLogger("restart");
function normalizeRestartIntentReason(reason) {
	const normalized = reason?.trim();
	return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function writeGatewayRestartIntentSync(opts) {
	const targetPid = asPositiveSafeInteger(opts.targetPid) ?? null;
	if (targetPid === null) return false;
	return writeGatewayRestartIntentForTargetSync(opts, () => targetPid);
}
/** Prepare installation/native-process evidence; lock identity is resolved again at write admission. */
async function prepareGatewayRestartIntentLegacyProcess(opts) {
	opts.assertCurrent();
	try {
		if (readGatewayOwnerLease({
			env: opts.env,
			current: true
		}) !== void 0 || !existsSync(resolveGatewayLockPaths(opts.env).stateLockPath)) return;
		const pid = asPositiveSafeInteger(opts.runtimePid);
		if (pid === void 0 || !isPidAlive(pid)) return;
		const startTime = getFileLockProcessStartTime(pid, opts.env);
		if (startTime === null) return;
		const roots = [await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url }), readGatewayServiceUpdateOriginalRoot()].filter((root) => Boolean(root));
		const ownership = await Promise.all(roots.map((root) => gatewayServiceCommandMatchesRoot(root, opts.command)));
		opts.assertCurrent();
		if (!ownership.includes(true)) return;
		const runtime = await opts.readRuntime();
		if (runtime.status !== "running" || runtime.pid !== pid || !isPidAlive(pid) || getFileLockProcessStartTime(pid, opts.env) !== startTime) return;
		return {
			pid,
			startTime
		};
	} catch {
		return;
	} finally {
		opts.assertCurrent();
	}
}
function isLegacyProcessInService(pid, mainPid) {
	if (pid === mainPid) return true;
	const snapshot = spawnPsSync([
		"-e",
		"-o",
		"pid=",
		"-o",
		"ppid="
	], 1e3);
	if (snapshot.error || snapshot.status !== 0) return false;
	const parents = /* @__PURE__ */ new Map();
	for (const line of snapshot.stdout.split("\n")) {
		const match = /^\s*(\d+)\s+(\d+)\s*$/.exec(line);
		if (match) parents.set(Number(match[1]), Number(match[2]));
	}
	const seen = /* @__PURE__ */ new Set();
	let current = pid;
	while (current !== void 0 && current > 0 && !seen.has(current)) {
		if (current === mainPid) return true;
		seen.add(current);
		current = parents.get(current);
	}
	return false;
}
function readLegacyGatewayRestartLockSync(env) {
	const paths = resolveGatewayLockPaths(env);
	const payload = readLockPayloadSync(paths.stateLockPath, true);
	if (!payload) return;
	const pid = asPositiveSafeInteger(payload.pid);
	if (pid === void 0 || !payload.ownerId || !payload.port || payload.role !== void 0 && payload.role !== "gateway" || typeof payload.startTime !== "number" || !Number.isSafeInteger(payload.startTime) || payload.startTime < 0 || !payload.stateDir || resolveIdentityPathViaExistingAncestorSync(payload.stateDir) !== paths.stateDir || resolveIdentityPathViaExistingAncestorSync(payload.configPath) !== resolveIdentityPathViaExistingAncestorSync(paths.configPath)) throw new GatewayRestartPreparationError("serving-owner");
	return {
		payload,
		pid,
		startTime: payload.startTime,
		lockPath: paths.stateLockPath
	};
}
/** Called only for stopped native service state while physical cleanup exclusion is held. */
function assertLegacyGatewayStoppedSync(env) {
	const legacy = readLegacyGatewayRestartLockSync(env);
	if (!legacy) return;
	const knownDead = () => {
		if (isPidDefinitelyDead(legacy.pid)) return true;
		const startedAt = getFileLockProcessStartTime(legacy.pid, env);
		return startedAt !== null && startedAt !== legacy.startTime;
	};
	if (!knownDead() || !isDeepStrictEqual(legacy.payload, readLockPayloadSync(legacy.lockPath, true)) || !knownDead()) throw new GatewayRestartPreparationError("serving-owner");
}
function readLegacyGatewayRestartTargetSync(opts) {
	const env = opts.env ?? process.env;
	const legacy = readLegacyGatewayRestartLockSync(env);
	if (!legacy) return;
	const native = opts.legacyProcess;
	if (!native) throw new GatewayRestartPreparationError("serving-owner");
	const { payload, pid, startTime, lockPath } = legacy;
	const stillCurrent = () => isPidAlive(pid) && getFileLockProcessStartTime(pid, env) === startTime && isPidAlive(native.pid) && getFileLockProcessStartTime(native.pid, env) === native.startTime;
	if (!stillCurrent() || !isLegacyProcessInService(pid, native.pid) || !isDeepStrictEqual(payload, readLockPayloadSync(lockPath, true)) || !stillCurrent()) throw new GatewayRestartPreparationError("serving-owner");
	return pid;
}
/** Native service control keeps its selected service; resolve its serving process at admission. */
function writeGatewayServiceRestartIntentSync(opts) {
	if (opts.nativeStopped) try {
		const exclusion = tryAcquireGatewayLifecycleCleanupCoordinator({ databasePath: resolveOpenClawStateSqlitePath(opts.env) });
		if (exclusion) try {
			const owner = readGatewayOwnerLease({
				env: opts.env,
				current: true
			});
			opts.assertCurrent();
			if (!owner || owner.state === "dead") {
				assertLegacyGatewayStoppedSync(opts.env ?? process.env);
				opts.assertCurrent();
				return false;
			}
		} finally {
			exclusion.release();
		}
	} catch {
		opts.assertCurrent();
		throw new GatewayRestartPreparationError("serving-owner");
	}
	const written = writeGatewayRestartIntentForTargetSync(opts, (db) => {
		try {
			const owner = readGatewayOwnerLeaseFromDatabase(db);
			if (owner === void 0) {
				const legacyPid = readLegacyGatewayRestartTargetSync(opts);
				if (legacyPid !== void 0) return legacyPid;
			}
			const supervisor = owner?.supervisor;
			if (owner?.state === "live" && owner.mode === "supervised" && supervisor?.kind === opts.service.kind && supervisor.name !== null && (supervisor.kind === "systemd" ? resolveSystemdServiceName({ OPENCLAW_SYSTEMD_UNIT: supervisor.name }) === resolveSystemdServiceName({ OPENCLAW_SYSTEMD_UNIT: opts.service.name }) : supervisor.name === opts.service.name)) return owner.pid;
		} catch {
			throw new GatewayRestartPreparationError("serving-owner");
		}
		throw new GatewayRestartPreparationError("serving-owner");
	}, opts.assertCurrent);
	if (!written) throw new GatewayRestartPreparationError("intent-recording");
	return written;
}
function writeGatewayRestartIntentForTargetSync(opts, resolveTargetPid, assertCurrent) {
	const env = opts.env ?? process.env;
	try {
		if (!existsSync(resolveOpenClawStateSqlitePath(env))) {
			restartLog.info("skipped gateway restart intent: no existing state database");
			return false;
		}
		const reason = normalizeRestartIntentReason(opts.reason ?? opts.intent?.reason);
		const waitMs = typeof opts.intent?.waitMs === "number" && Number.isFinite(opts.intent.waitMs) && opts.intent.waitMs >= 0 ? Math.floor(opts.intent.waitMs) : null;
		return runExistingOpenClawStateWriteTransaction(({ db }) => {
			assertCurrent?.();
			const targetPid = asPositiveSafeInteger(resolveTargetPid(db)) ?? null;
			assertCurrent?.();
			if (targetPid === null) return false;
			const createdAt = Date.now();
			const stateDb = getNodeSqliteKysely(db);
			const row = {
				kind: "gateway-restart",
				pid: targetPid,
				created_at: createdAt,
				reason: reason ?? null,
				force: opts.intent?.force ? 1 : null,
				wait_ms: waitMs,
				updated_at_ms: createdAt
			};
			executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_intent").values({
				intent_key: GATEWAY_RESTART_INTENT_KEY,
				...row
			}).onConflict((conflict) => conflict.column("intent_key").doUpdateSet(row)));
			return true;
		}, { env }, {
			schemaSql: schema,
			operationLabel: "gateway.restart-intent.write"
		});
	} catch (err) {
		assertCurrent?.();
		if (err instanceof GatewayRestartPreparationError) throw err;
		restartLog.warn(`failed to write gateway restart intent: ${String(err)}`);
		return false;
	}
}
function clearGatewayRestartIntentSync(env = process.env) {
	try {
		runExistingOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, stateDb.deleteFrom("gateway_restart_intent").where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY));
		}, { env }, {
			schemaSql: schema,
			operationLabel: "gateway.restart-intent.clear"
		});
	} catch {}
}
function readGatewayRestartIntentPayloadSync(env) {
	try {
		const { db } = openOpenClawStateDatabase({ env });
		const stateDb = getNodeSqliteKysely(db);
		const parsed = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("gateway_restart_intent").select([
			"kind",
			"pid",
			"created_at",
			"reason",
			"force",
			"wait_ms"
		]).where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY));
		if (parsed?.kind === "gateway-restart" && typeof parsed.pid === "number" && Number.isFinite(parsed.pid) && typeof parsed.created_at === "number" && Number.isFinite(parsed.created_at) && (parsed.reason === null || typeof parsed.reason === "string") && (parsed.force === null || typeof parsed.force === "number" && Number.isFinite(parsed.force)) && (parsed.wait_ms === null || typeof parsed.wait_ms === "number" && Number.isFinite(parsed.wait_ms) && parsed.wait_ms >= 0)) {
			const reason = normalizeRestartIntentReason(parsed.reason ?? void 0);
			return {
				kind: "gateway-restart",
				pid: parsed.pid,
				createdAt: parsed.created_at,
				...reason ? { reason } : {},
				...parsed.force ? { force: true } : {},
				...typeof parsed.wait_ms === "number" ? { waitMs: Math.floor(parsed.wait_ms) } : {}
			};
		}
	} catch {
		return null;
	}
	return null;
}
function consumeGatewayRestartIntentPayloadSync(env = process.env, now = Date.now()) {
	const payload = readGatewayRestartIntentPayloadSync(env);
	clearGatewayRestartIntentSync(env);
	if (!payload) return null;
	if (payload.pid !== process.pid) return null;
	const ageMs = now - payload.createdAt;
	if (ageMs < 0 || ageMs > GATEWAY_RESTART_INTENT_TTL_MS) return null;
	return {
		...payload.reason ? { reason: payload.reason } : {},
		...payload.force ? { force: true } : {},
		...typeof payload.waitMs === "number" ? { waitMs: payload.waitMs } : {}
	};
}
function consumeGatewayRestartIntentSync(env = process.env, now = Date.now()) {
	return consumeGatewayRestartIntentPayloadSync(env, now) !== null;
}
//#endregion
export { prepareGatewayRestartIntentLegacyProcess as a, GatewayRestartPreparationError as c, normalizeRestartIntentReason as i, consumeGatewayRestartIntentPayloadSync as n, writeGatewayRestartIntentSync as o, consumeGatewayRestartIntentSync as r, writeGatewayServiceRestartIntentSync as s, clearGatewayRestartIntentSync as t };
