import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { a as decodeWindowsProcessOutput, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { u as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, c as readStateLeaseProcessOwnerStatus, i as reclaimDeadOpenClawStateLeaseInTransaction, n as readOpenClawStateLease, s as parseStateLeaseProcessOwner, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-CCKioOUP.mjs";
import { n as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-C2dAjwWy.mjs";
import { t as startOpenClawStateLeaseHeartbeat } from "./openclaw-state-lease-heartbeat-Bx8MXIzo.mjs";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.mjs";
import { r as parseWindowsNetstatListeners } from "./ports-netstat-D4bISZ36.mjs";
import { spawnSync } from "node:child_process";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-owner-lease.ts
const gatewayOwnerKey = {
	scope: "gateway-owner",
	key: "global"
};
const log = createSubsystemLogger("gateway");
function parseSupervisor(value) {
	if (value === null) return null;
	if (!isRecord(value) || value.kind !== "launchd" && value.kind !== "systemd" && value.kind !== "schtasks" && value.kind !== "external" || value.name !== null && (typeof value.name !== "string" || !value.name.trim())) throw new Error("Gateway owner lease supervisor could not be verified");
	return {
		kind: value.kind,
		name: value.name
	};
}
/** Read through the caller's admitted connection when ownership guards a write. */
function readGatewayOwnerLeaseFromDatabase(db, port) {
	if (!tableExists(db, "state_leases")) return;
	const row = readOpenClawStateLease(db, gatewayOwnerKey);
	if (!row) return;
	const processOwner = parseStateLeaseProcessOwner(row.payloadJson);
	let payload;
	try {
		payload = row.payloadJson ? JSON.parse(row.payloadJson) : null;
	} catch {
		payload = null;
	}
	if (!processOwner || !isRecord(payload) || typeof payload.port !== "number" || !Number.isInteger(payload.port) || payload.port <= 0 || payload.port > 65535 || payload.mode !== "foreground" && payload.mode !== "supervised") throw new Error("Gateway owner lease identity could not be verified");
	if (port !== void 0 && payload.port !== port) return;
	const supervisor = parseSupervisor(payload.supervisor);
	if (payload.mode === "foreground" !== (supervisor === null)) throw new Error("Gateway owner lease supervisor does not match its listener mode");
	return {
		...processOwner,
		owner: row.owner,
		port: payload.port,
		mode: payload.mode,
		supervisor,
		state: readStateLeaseProcessOwnerStatus(processOwner),
		expired: row.expiresAt === null || row.expiresAt <= Date.now()
	};
}
function readGatewayOwnerLease(params = {}) {
	const operation = ({ db }) => readGatewayOwnerLeaseFromDatabase(db, params.port);
	return params.current || params.openStateSchemaReadAdmission ? withExistingOpenClawStateDatabaseCurrentReadOnly(operation, { env: params.env }, params.openStateSchemaReadAdmission) : withExistingOpenClawStateDatabaseReadOnly(operation, { env: params.env });
}
/** Publish only while the caller holds the Gateway lifecycle coordinator. */
function acquireGatewayOwnerLease(params) {
	const env = params.env ?? process.env;
	const databasePath = resolveOpenClawStateSqlitePath(env);
	const identity = {
		...gatewayOwnerKey,
		owner: params.owner ?? randomUUID()
	};
	const processOwner = {
		pid: process.pid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(process.pid, env) ?? getFileLockProcessStartTime(process.pid, env)
	};
	const payloadJson = JSON.stringify({
		owner: processOwner,
		port: params.port,
		mode: params.mode,
		supervisor: params.supervisor
	});
	const expiresAt = withOpenClawStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		reclaimDeadOpenClawStateLeaseInTransaction(db, identity);
		const acquired = acquireOpenClawStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, payloadJson);
		if (acquired.kind === "held") throw new Error("Another Gateway owner lease is still active for this state directory");
		return acquired.expiresAt;
	}), {
		env,
		path: databasePath
	});
	const releaseRow = () => withOpenClawStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		releaseOpenClawStateLeaseInTransaction(db, identity);
	}), {
		env,
		path: databasePath
	});
	let heartbeat;
	let constructionFailure;
	let warned = false;
	const ready = (async () => {
		try {
			heartbeat = startOpenClawStateLeaseHeartbeat({
				path: databasePath,
				existingOnly: true,
				identity,
				leaseMs: STARTUP_MIGRATION_LEASE_TTL_MS,
				acquiredAt: expiresAt - STARTUP_MIGRATION_LEASE_TTL_MS,
				expiresAt,
				heartbeatMs: 3e4,
				...processOwner.startedAt === null ? { processOwner: {
					identity: processOwner,
					env: resolveDiagnosticProcessEnv(env)
				} } : {},
				onLost: () => {
					if (!warned) {
						warned = true;
						log.warn("Gateway owner lease heartbeat stopped; process identity remains recorded");
					}
				}
			});
		} catch (error) {
			constructionFailure = { error };
			throw error;
		}
		await heartbeat.ready;
	})();
	let released = false;
	return {
		owner: identity.owner,
		ready,
		async release() {
			if (released) return;
			if (constructionFailure) throw new Error("Gateway owner heartbeat cleanup could not be confirmed", { cause: constructionFailure.error });
			await heartbeat?.stop();
			releaseRow();
			released = true;
		}
	};
}
//#endregion
//#region src/infra/windows-port-pids.ts
const DEFAULT_TIMEOUT_MS = 5e3;
function readListeningPidsViaPowerShell(port, timeoutMs) {
	const ps = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		`(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess)`
	], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (ps.error || ps.status !== 0) return null;
	return ps.stdout.split(/\r?\n/).flatMap((line) => parseStrictPositiveInteger(line.trim()) ?? []);
}
function parseListeningPidsFromNetstat(stdout, port) {
	return [...new Set(parseWindowsNetstatListeners(stdout, port).map((listener) => listener.pid))];
}
function readWindowsListeningPidsOnPortSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const result = readWindowsListeningPidsResultSync(port, timeoutMs);
	return result.ok ? result.pids : [];
}
function readWindowsListeningPidsResultSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const powershellPids = readListeningPidsViaPowerShell(port, timeoutMs);
	if (powershellPids != null) return {
		ok: true,
		pids: powershellPids
	};
	const netstat = spawnSync(getWindowsSystem32ExePath("netstat.exe"), ["-ano"], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (netstat.error) {
		const code = netstat.error.code;
		return {
			ok: false,
			permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
		};
	}
	if (netstat.status !== 0) return {
		ok: false,
		permanent: false
	};
	return {
		ok: true,
		pids: parseListeningPidsFromNetstat(netstat.stdout, port)
	};
}
function extractWindowsCommandLine(raw) {
	const lines = normalizeStringEntries(decodeWindowsProcessOutput(raw).split(/\r?\n/));
	for (const line of lines) {
		if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
		return line.slice(12).trim() || null;
	}
	return lines.find((line) => normalizeLowercaseStringOrEmpty(line) !== "commandline") ?? null;
}
function readWindowsProcessArgsSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env) {
	const result = readWindowsProcessArgsResultSync(pid, timeoutMs, env);
	return result.ok ? result.args : null;
}
function readWindowsProcessArgsResultSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env) {
	const powershell = spawnSync(getWindowsPowerShellExePath(env), [
		"-NoProfile",
		"-Command",
		`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`
	], {
		env: resolveDiagnosticProcessEnv(env),
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const command = powershell.stdout.trim();
		return {
			ok: true,
			args: command ? splitArgsPreservingQuotes(command, { escapeMode: "backslash-quote-only" }) : null
		};
	}
	const wmic = spawnSync(getWindowsWmicExePath(env), [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	], {
		env: resolveDiagnosticProcessEnv(env),
		timeout: timeoutMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	if (!wmic.error && wmic.status === 0) {
		const command = extractWindowsCommandLine(wmic.stdout);
		return {
			ok: true,
			args: command ? splitArgsPreservingQuotes(command, { escapeMode: "backslash-quote-only" }) : null
		};
	}
	const code = (wmic.error ?? powershell.error)?.code;
	return {
		ok: false,
		permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
	};
}
//#endregion
export { acquireGatewayOwnerLease as a, readWindowsProcessArgsSync as i, readWindowsListeningPidsResultSync as n, readGatewayOwnerLease as o, readWindowsProcessArgsResultSync as r, readGatewayOwnerLeaseFromDatabase as s, readWindowsListeningPidsOnPortSync as t };
