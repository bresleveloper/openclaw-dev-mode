import { d as asPositiveSafeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as isPidDefinitelyDead, i as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { d as tryAcquireGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, nt as extractSqliteTableSchema } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as prepareOpenClawStateReadSource } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as readGatewayOwnerLeaseFromDatabase, r as readGatewayOwnerLease } from "./gateway-owner-lease-KxvFWleW.mjs";
import { o as spawnPsSync } from "./restart-stale-pids-CHtdUHKp.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-BxFUj82Q.mjs";
import { t as gatewayServiceCommandMatchesRoot } from "./service-layout-DcU2-cAg.mjs";
import { s as readGatewayServiceUpdateOriginalRoot } from "./service-update-authority-Ddw1lcTH.mjs";
import { c as resolveSystemdServiceName } from "./systemd-service-files-C3V-PDoO.mjs";
import { l as readLockPayloadSync, u as resolveGatewayLockPaths } from "./gateway-lock-OT1e72lx.mjs";
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
//#region src/infra/restart-intent-payload.ts
const GATEWAY_RESTART_INTENT_TTL_MS = 6e4;
function normalizeRestartIntentReason(reason) {
	const normalized = reason?.trim();
	return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function decodeGatewayRestartIntent(row, pid, now) {
	if (!isRecord(row) || row.kind !== "gateway-restart" || row.pid !== pid || typeof row.created_at !== "number" || !Number.isFinite(row.created_at) || now < row.created_at || now - row.created_at > GATEWAY_RESTART_INTENT_TTL_MS || row.reason !== null && typeof row.reason !== "string" || row.force !== null && (typeof row.force !== "number" || !Number.isFinite(row.force)) || row.wait_ms !== null && (typeof row.wait_ms !== "number" || !Number.isFinite(row.wait_ms) || row.wait_ms < 0)) return null;
	const reason = normalizeRestartIntentReason(row.reason ?? void 0);
	return {
		...reason ? { reason } : {},
		...row.force ? { force: true } : {},
		...typeof row.wait_ms === "number" ? { waitMs: Math.floor(row.wait_ms) } : {}
	};
}
//#endregion
//#region src/infra/restart-intent.ts
const GATEWAY_RESTART_INTENT_KEY = "gateway-restart";
const schema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "gateway_restart_intent", { errorMessage: "Gateway restart intent schema markers are missing" });
const restartLog = createSubsystemLogger("restart");
function writeGatewayRestartIntentSync(opts) {
	const targetPid = asPositiveSafeInteger(opts.targetPid) ?? null;
	if (targetPid === null) return false;
	return writeGatewayRestartIntentForTargetSync(opts, () => targetPid);
}
/** Prepare installation/native-process evidence; lock identity is resolved again at write admission. */
async function prepareGatewayRestartIntentLegacyProcess(opts) {
	opts.assertCurrent();
	try {
		const owner = readGatewayOwnerLease({
			env: opts.env,
			current: true
		});
		if (owner && owner.state !== "dead") return;
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
		const deadline = Date.now() + resolveGatewayStartupTiming().deadlineMs;
		while (true) {
			const published = readGatewayOwnerLease({
				env: opts.env,
				current: true
			});
			if (published && published.state !== "dead") break;
			const legacy = readLegacyGatewayRestartLockSync(opts.env);
			if (legacy && !isPidDefinitelyDead(legacy.pid) && (!published || !isLegacyProcessInService(legacy.pid, pid))) break;
			opts.assertCurrent();
			if (Date.now() >= deadline || !isPidAlive(pid) || getFileLockProcessStartTime(pid, opts.env) !== startTime) return;
			await new Promise((resolve) => {
				setTimeout(resolve, 200);
			});
		}
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
		const exclusion = tryAcquireGatewayStateOwner(resolveOpenClawStateSqlitePath(opts.env));
		if (exclusion) try {
			if (exclusion.run(() => {
				const owner = readGatewayOwnerLease({
					env: opts.env,
					current: true
				});
				opts.assertCurrent();
				if (owner && owner.state !== "dead") return false;
				assertLegacyGatewayStoppedSync(opts.env ?? process.env);
				opts.assertCurrent();
				return true;
			})) return false;
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
			if (owner?.state === "live" && (opts.nativePid === void 0 || isLegacyProcessInService(owner.pid, opts.nativePid)) && owner.mode === "supervised" && supervisor?.kind === opts.service.kind && supervisor.name !== null && (supervisor.kind === "systemd" ? resolveSystemdServiceName({ OPENCLAW_SYSTEMD_UNIT: supervisor.name }) === resolveSystemdServiceName({ OPENCLAW_SYSTEMD_UNIT: opts.service.name }) : supervisor.name === opts.service.name)) return owner.pid;
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
		let owned;
		const written = runExistingOpenClawStateWriteTransaction(({ db }) => {
			assertCurrent?.();
			const targetPid = asPositiveSafeInteger(resolveTargetPid(db)) ?? null;
			assertCurrent?.();
			if (targetPid === null) return false;
			const createdAt = Date.now();
			const stateDb = getNodeSqliteKysely(db);
			const previous = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("gateway_restart_intent").select("updated_at_ms").where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY));
			const generation = Math.max(createdAt, (previous?.updated_at_ms ?? 0) + 1);
			const row = {
				kind: "gateway-restart",
				pid: targetPid,
				created_at: createdAt,
				reason: reason ?? null,
				force: opts.intent?.force ? 1 : null,
				wait_ms: waitMs,
				updated_at_ms: generation
			};
			executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_intent").values({
				intent_key: GATEWAY_RESTART_INTENT_KEY,
				...row
			}).onConflict((conflict) => conflict.column("intent_key").doUpdateSet(row)));
			owned = row;
			return true;
		}, { env }, {
			schemaSql: schema,
			operationLabel: "gateway.restart-intent.write"
		});
		if (written && owned) {
			const receipt = owned;
			opts.onRecorded?.(() => clearGatewayRestartIntentSync(env, receipt));
		}
		return written;
	} catch (err) {
		assertCurrent?.();
		if (err instanceof GatewayRestartPreparationError) throw err;
		restartLog.warn(`failed to write gateway restart intent: ${String(err)}`);
		return false;
	}
}
function clearGatewayRestartIntentSync(env = process.env, owned) {
	try {
		runExistingOpenClawStateWriteTransaction(({ db }) => {
			let removal = getNodeSqliteKysely(db).deleteFrom("gateway_restart_intent").where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY);
			if (owned) removal = removal.where("kind", "=", owned.kind).where("pid", "=", owned.pid).where("created_at", "=", owned.created_at).where("reason", owned.reason === null ? "is" : "=", owned.reason).where("force", owned.force === null ? "is" : "=", owned.force).where("wait_ms", owned.wait_ms === null ? "is" : "=", owned.wait_ms).where("updated_at_ms", "=", owned.updated_at_ms);
			executeSqliteQuerySync(db, removal);
		}, { env }, {
			schemaSql: schema,
			operationLabel: "gateway.restart-intent.clear"
		});
	} catch {}
}
/** Consume the exact row once, after the shared writer's earlier accepted work. */
function prepareGatewayRestartIntentConsumption(env = process.env, now, assertCurrent) {
	const source = prepareOpenClawStateReadSource({
		path: resolveOpenClawStateSqlitePath(env),
		env
	});
	return async () => {
		const context = source.workerContext();
		const check = () => {
			context.admission.assertCurrent();
			assertCurrent?.();
		};
		let admission;
		let row;
		try {
			row = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "restartLifecycle.consumeIntent",
				input: void 0
			}), {
				existingOnly: true,
				assertCurrent: check,
				createAdmission: () => {
					admission = createSqliteWorkerOperationAdmission((_request, grant) => {
						check();
						grant();
					});
					return {
						admission,
						nativeLocations: [context.admission.databasePath]
					};
				}
			});
		} catch (error) {
			const receipt = admission?.committed?.facts;
			if (!isRecord(receipt) || receipt.kind !== "restart-intent-consumed") throw error;
			row = receipt.row;
		}
		check();
		return decodeGatewayRestartIntent(row, process.pid, now ?? Date.now());
	};
}
//#endregion
export { writeGatewayServiceRestartIntentSync as a, writeGatewayRestartIntentSync as i, prepareGatewayRestartIntentConsumption as n, normalizeRestartIntentReason as o, prepareGatewayRestartIntentLegacyProcess as r, GatewayRestartPreparationError as s, clearGatewayRestartIntentSync as t };
