import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { Et as _enum, Jn as string, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { S as parseRetiredManagedHandoffLeasePayload, x as parseManagedHandoffLeasePayload, y as isRetiredManagedHandoffLeasePayload } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { o as leaseQueries } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { d as readWindowsProcessArgsSync } from "./gateway-owner-lease-KxvFWleW.mjs";
import { i as inspectSelfAndAncestorPidsSync } from "./restart-stale-pids-CHtdUHKp.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { readProcessAncestry } from "@openclaw/proc-safe/identity";
//#region src/infra/update-managed-service-handoff-legacy-parent.ts
function readBorrowedLegacyHandoffParent(root, row, executor) {
	const payload = row && parseRetiredManagedHandoffLeasePayload(row.payload_json);
	if (!row || !payload || row.owner.length === 0 || row.owner.length > 4096 || !Number.isSafeInteger(row.updated_at) || row.updated_at < 0) return null;
	const identity = {
		pid: payload.pid,
		startIdentity: payload.startIdentity
	};
	return {
		version: 1,
		key: root,
		owner: row.owner,
		payload: row.payload_json,
		updatedAt: row.updated_at,
		helper: identity,
		executor: executor ?? identity,
		action: { kind: "update" }
	};
}
/** The shipped runner may supervise a respawned updater instead of execing it. */
function isBorrowedLegacyHandoffParentCurrent(parent, readRow, processes) {
	const validate = (ancestorPids, isProcessIdentityCurrent) => {
		const ancestors = [...ancestorPids];
		const executorIndex = ancestors.indexOf(parent.executor.pid);
		return executorIndex > 0 && ancestors.indexOf(parent.helper.pid) >= executorIndex && isProcessIdentityCurrent(parent.helper) && isProcessIdentityCurrent(parent.executor) && isDeepStrictEqual(readBorrowedLegacyHandoffParent(parent.key, readRow(), parent.executor), parent);
	};
	if (process.platform === "darwin") return processes.validateDarwinAncestorProcesses(parent.helper.pid, validate);
	const ancestry = inspectSelfAndAncestorPidsSync(void 0, {
		requireVerifiedParent: true,
		throughPid: parent.helper.pid
	});
	return ancestry.complete && validate(ancestry.pids, processes.isProcessIdentityCurrent);
}
//#endregion
//#region src/infra/update-managed-service-handoff-source-inspection.ts
/** Match every schema object, including wrong shapes, using SQLite's identifier casing. */
function hasManagedHandoffSchemaObject(db) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("sqlite_schema").select("name").where((eb) => eb(eb.fn("lower", ["name"]), "=", "managed_update_handoffs"))));
}
/** A first writer may have created the private inode before SQLite commits its schema. */
function isManagedHandoffSchemaEmpty(db) {
	return !executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("sqlite_schema").select("name").limit(1));
}
//#endregion
//#region src/infra/update-managed-service-handoff-rows.ts
const managedHandoffLeaseText = string().min(1).max(4096);
const triageFailureSchema = strictObject({
	kind: _enum(["update", "gateway-startup"]),
	phase: string().max(120),
	error: string().max(800),
	installationRoot: managedHandoffLeaseText.optional(),
	expectedVersion: string().max(100).optional(),
	gateway: _enum(["verify-running", "preserve"])
});
function managedHandoffLeaseRow(lease) {
	return {
		owner: lease.owner,
		payload_json: lease.payload,
		updated_at: lease.updatedAt
	};
}
function createManagedHandoffLeaseRows(options, withDatabase, processes) {
	const { databasePath } = options;
	const rowReader = createSqliteQueryCache((db) => prepareSqliteQueryTakeFirstSync(db, (parameter) => leaseQueries(db).selectFrom("managed_update_handoffs").select([
		"owner",
		"payload_json",
		"updated_at"
	]).where("install_root", "=", parameter((key) => key))));
	function row(db, root) {
		return rowReader(db)(root);
	}
	function handle(root, value) {
		const payload = parseManagedHandoffLeasePayload(value.payload_json);
		if (!payload || !managedHandoffLeaseText.safeParse(value.owner).success || payload.version === 2 && payload.mutationOriginal && (payload.mutationOriginal.key === root || root.includes("/.openclaw-update-child-")) || payload.version === 4 && (payload.cancellation.key !== root || payload.cancellation.owner !== value.owner || payload.cancellation.updatedAt >= value.updated_at)) throw new Error("existing managed handoff lease is incompatible; retain diagnostics and run openclaw triage manually");
		return {
			key: root,
			owner: value.owner,
			payload: value.payload_json,
			updatedAt: value.updated_at,
			...payload
		};
	}
	function descendants(db, parent) {
		const prefix = `${parent.key}/.openclaw-update-child-`;
		return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
			"install_root",
			"owner",
			"payload_json",
			"updated_at"
		]).where("install_root", ">=", prefix).where("install_root", "<", prefix + "￿")).rows;
	}
	function deleteRow(db, root, value) {
		return executeSqliteQuerySync(db, leaseQueries(db).deleteFrom("managed_update_handoffs").where("install_root", "=", root).where("owner", "=", value.owner).where("payload_json", "=", value.payload_json).where("updated_at", "=", value.updated_at)).numAffectedRows === 1n;
	}
	function updateRow(db, lease, values) {
		return executeSqliteQuerySync(db, leaseQueries(db).updateTable("managed_update_handoffs").set(values).where("install_root", "=", lease.key).where("owner", "=", lease.owner).where("payload_json", "=", lease.payload).where("updated_at", "=", lease.updatedAt)).numAffectedRows === 1n;
	}
	function read(root) {
		try {
			if (!options.existingIdentity && !fs.existsSync(databasePath)) return { kind: "absent" };
			return withDatabase(false, (db) => {
				if (!options.existingIdentity && isManagedHandoffSchemaEmpty(db)) return { kind: "absent" };
				const value = row(db, root);
				return value ? {
					kind: "current",
					lease: handle(root, value)
				} : { kind: "absent" };
			});
		} catch (error) {
			return {
				kind: "unreadable",
				error
			};
		}
	}
	function readRetainedSources() {
		try {
			fs.lstatSync(databasePath);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		}
		return withDatabase(false, (db) => {
			if (!options.existingIdentity && !hasManagedHandoffSchemaObject(db)) return [];
			return executeSqliteQuerySync(db, leaseQueries(db).selectFrom("managed_update_handoffs").select([
				"install_root",
				"owner",
				"payload_json",
				"updated_at"
			])).rows.flatMap((entry) => isRetiredManagedHandoffLeasePayload(entry.payload_json) ? [] : [handle(entry.install_root, entry)]);
		});
	}
	function readLegacyParent(root, executor) {
		return withDatabase(false, (db) => readBorrowedLegacyHandoffParent(root, row(db, root), executor));
	}
	function currentLegacyParent(parent, db) {
		return isBorrowedLegacyHandoffParentCurrent(parent, () => row(db, parent.key), processes);
	}
	const sameRow = (a, b) => a?.owner === b?.owner && a?.payload_json === b?.payload_json && a?.updated_at === b?.updated_at;
	return {
		row,
		handle,
		descendants,
		deleteRow,
		updateRow,
		read,
		readLegacyParent,
		readRetainedSources,
		currentLegacyParent,
		sameRow
	};
}
//#endregion
//#region src/infra/update-managed-service-handoff-process.ts
const WINDOWS_ARGV_IDENTITY_PREFIX = "win32-argv-sha256:";
const WINDOWS_ARGV_IDENTITY_PATTERN = /^win32-argv-sha256:[a-f0-9]{64}$/;
function windowsArgvIdentity(argv) {
	if (!argv[0]) return null;
	const normalized = [path.win32.normalize(argv[0]).toLowerCase(), ...argv.slice(1)];
	return WINDOWS_ARGV_IDENTITY_PREFIX + sha256Hex(JSON.stringify(normalized));
}
/** Process facts shared by lease admission, live ownership, and cleanup. */
function createManagedHandoffProcessIdentityReader(options) {
	const warnedIdentityPids = /* @__PURE__ */ new Set();
	let selfIdentity;
	let parentStartIdentity;
	let selfLauncherIdentity;
	function warn(pid, continuation) {
		if (warnedIdentityPids.has(pid)) return;
		warnedIdentityPids.add(pid);
		try {
			options.onWarning?.(pid, `Native Windows creation-time queries returned no identity for PID ${pid}; ${continuation}.`);
		} catch {}
	}
	const isPidAlive = (pid) => !isPidDefinitelyDead(pid);
	function readProcessStartIdentity(pid) {
		const start = getFileLockProcessStartTime(pid, {
			...options.env,
			LC_ALL: "C",
			TZ: "UTC"
		});
		return start === null ? pid === process.pid ? parentStartIdentity ?? null : null : String(start);
	}
	function validateDarwinAncestorProcesses(requiredHelperPid, validate) {
		const immediateParent = process.ppid;
		let ancestry;
		try {
			ancestry = readProcessAncestry(process.pid, {
				maxDepth: 34,
				throughPid: requiredHelperPid
			});
		} catch {
			return false;
		}
		if (!ancestry?.complete || ancestry.stoppedBy !== "through-pid" && !ancestry.chain.some(({ pid }) => pid === requiredHelperPid) || process.ppid !== immediateParent) return false;
		const observed = new Map(ancestry.chain.map((identity) => [identity.pid, identity]));
		return validate(new Set(observed.keys()), (value) => {
			const facts = observed.get(value.pid);
			return isPidAlive(value.pid) && facts != null && !facts.exited && String(Math.floor(facts.startTimeMicros / 1e6)) === value.startIdentity;
		});
	}
	function readWindowsArgvIdentity(pid) {
		if (pid !== process.pid) {
			const argv = readWindowsProcessArgsSync(pid, void 0, options.env);
			return argv ? windowsArgvIdentity(argv) : null;
		}
		if (selfLauncherIdentity === void 0) {
			const report = process.report.getReport();
			const argv = isRecord(report) && isRecord(report.header) ? report.header.commandLine : null;
			selfLauncherIdentity = Array.isArray(argv) && argv.every((arg) => typeof arg === "string") ? windowsArgvIdentity(argv) : null;
		}
		return selfLauncherIdentity;
	}
	function inspectProcessIdentity(value, ownedCustody = false) {
		if (!isPidAlive(value.pid)) return "dead";
		const argvIdentity = process.platform === "win32" && WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity);
		const start = argvIdentity ? readWindowsArgvIdentity(value.pid) : readProcessStartIdentity(value.pid);
		if (start === null) return argvIdentity && ownedCustody ? "live" : "unknown";
		return start === value.startIdentity ? "live" : "mismatch";
	}
	function processState(value) {
		const state = inspectProcessIdentity(value);
		if (state === "mismatch") return process.platform === "win32" && WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity) ? "unknown" : "dead";
		return state;
	}
	function isProcessIdentityCurrent(value, ownedCustody = false) {
		return inspectProcessIdentity(value, ownedCustody) === "live";
	}
	function acceptSelfIdentity(value, parentBound = false) {
		if (value.pid !== process.pid) return false;
		const state = inspectProcessIdentity(value);
		if (state === "live") {
			selfIdentity ??= { ...value };
			return true;
		}
		if (state !== "unknown" || !parentBound || process.platform !== "win32" || WINDOWS_ARGV_IDENTITY_PATTERN.test(value.startIdentity)) return false;
		parentStartIdentity = value.startIdentity;
		selfIdentity ??= { ...value };
		warn(value.pid, "continuing with the creation identity established by the live parent");
		return true;
	}
	function processIdentity(pid = process.pid, argv) {
		if (pid === process.pid && selfIdentity) return { ...selfIdentity };
		const startIdentity = readProcessStartIdentity(pid);
		if (startIdentity !== null) {
			if (pid === process.pid) selfIdentity = {
				pid,
				startIdentity
			};
			return {
				pid,
				startIdentity
			};
		}
		const attribution = process.platform === "win32" ? argv ? windowsArgvIdentity(argv) : readWindowsArgvIdentity(pid) : null;
		if (attribution) {
			warn(pid, "continuing with PID and launcher attribution");
			if (pid === process.pid) selfIdentity = {
				pid,
				startIdentity: attribution,
				startIdentitySource: "argv-sha256"
			};
			return {
				pid,
				startIdentity: attribution,
				startIdentitySource: "argv-sha256"
			};
		}
		throw new Error("managed handoff process start identity is unavailable");
	}
	return {
		isPidAlive,
		readProcessStartIdentity,
		processIdentity,
		processState,
		inspectProcessIdentity,
		isProcessIdentityCurrent,
		validateDarwinAncestorProcesses,
		acceptSelfIdentity
	};
}
//#endregion
export { triageFailureSchema as a, managedHandoffLeaseText as i, createManagedHandoffLeaseRows as n, readBorrowedLegacyHandoffParent as o, managedHandoffLeaseRow as r, createManagedHandoffProcessIdentityReader as t };
