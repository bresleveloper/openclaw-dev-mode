import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { c as decodeWindowsProcessOutput, n as getFileLockProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawStateSqlitePath, n as existingPathOrUndefined } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { S as describeGatewayLockHolder, g as GATEWAY_OWNER_HEARTBEAT_MS, o as captureGatewayStateOwner, v as GatewayLockNamespaceError, w as readGatewayLockProcessNamespace, x as classifyGatewayOwnerProcessNamespace } from "./gateway-state-owner-DmHycK5o.mjs";
import { n as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly, f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { r as openOpenClawStateReadConnection } from "./openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { d as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, c as readStateLeaseProcessOwnerStatus, n as readOpenClawStateLease, s as parseStateLeaseProcessOwner, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { n as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-Bkqf-Qf8.mjs";
import { t as readDarwinProcessCommand } from "./darwin-process-command-PlE2gtQ3.mjs";
import { r as parseProcCmdline } from "./gateway-process-argv-DMAY-YPv.mjs";
import { t as parseWindowsNativeCommandLine } from "./windows-command-line-BrVAurm9.mjs";
import { r as parseWindowsNetstatListeners } from "./ports-netstat-816BXbAP.mjs";
import { t as startOpenClawStateLeaseHeartbeat } from "./openclaw-state-lease-heartbeat-C_t8XxLa.mjs";
import fs from "node:fs";
import { hostname } from "node:os";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
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
/** Read-only bounded listener observation, without PID enrichment or a second budget. */
function readWindowsPortUsageSync(port, timeoutMs) {
	if (process.platform !== "win32" || !Number.isInteger(port) || port < 1 || port > 65535 || !Number.isFinite(timeoutMs) || timeoutMs < 1) return "unknown";
	const result = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		`\$ErrorActionPreference = 'Stop'; @(Get-NetTCPConnection -ErrorAction Stop | Where-Object { $_.LocalPort -eq ${port} -and $_.State -eq 'Listen' }).Count`
	], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: Math.min(Math.floor(timeoutMs), DEFAULT_TIMEOUT_MS),
		windowsHide: true
	});
	if (result.error || result.status !== 0) return "unknown";
	const count = result.stdout.trim();
	return /^\d+$/.test(count) ? Number(count) === 0 ? "free" : "busy" : "unknown";
}
function extractWindowsCommandLine(raw) {
	const output = decodeWindowsProcessOutput(raw).trim();
	const command = (/^CommandLine=(.*)$/is.exec(output)?.[1] ?? output.replace(/^CommandLine\r?\n/i, "")).trim();
	return command && command.toLowerCase() !== "commandline" ? command : null;
}
function readWindowsProcessArgsSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env, deadlineMs) {
	const result = readWindowsProcessArgsResultSync(pid, timeoutMs, env, deadlineMs);
	return result.ok ? result.args : null;
}
function readWindowsProcessArgsResultSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env, deadlineMs) {
	const remainingTimeoutMs = () => deadlineMs === void 0 ? timeoutMs : Math.min(timeoutMs, Math.max(0, Math.ceil(deadlineMs - performance.now())));
	if (remainingTimeoutMs() <= 0) return {
		ok: false,
		permanent: false
	};
	const powershellPath = getWindowsPowerShellExePath(env, deadlineMs);
	const powershellTimeoutMs = remainingTimeoutMs();
	if (powershellTimeoutMs <= 0) return {
		ok: false,
		permanent: false
	};
	const powershell = spawnSync(powershellPath, [
		"-NoProfile",
		"-Command",
		[
			`$command = (Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`,
			"$bytes = [Text.Encoding]::UTF8.GetBytes([string]$command)",
			"[Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length)"
		].join("; ")
	], {
		env: resolveDiagnosticProcessEnv(env),
		encoding: "utf8",
		timeout: powershellTimeoutMs,
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const command = powershell.stdout;
		const args = command ? parseWindowsNativeCommandLine(command) : null;
		return command && args === null ? {
			ok: false,
			permanent: false
		} : {
			ok: true,
			args
		};
	}
	if (remainingTimeoutMs() <= 0) return {
		ok: false,
		permanent: false
	};
	const wmicPath = getWindowsWmicExePath(env, deadlineMs);
	const wmicTimeoutMs = remainingTimeoutMs();
	if (wmicTimeoutMs <= 0) return {
		ok: false,
		permanent: false
	};
	const wmic = spawnSync(wmicPath, [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	], {
		env: resolveDiagnosticProcessEnv(env),
		timeout: wmicTimeoutMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	if (!wmic.error && wmic.status === 0) {
		const command = extractWindowsCommandLine(wmic.stdout);
		const args = command ? parseWindowsNativeCommandLine(command) : null;
		return command && args === null ? {
			ok: false,
			permanent: false
		} : {
			ok: true,
			args
		};
	}
	const code = (wmic.error ?? powershell.error)?.code;
	return {
		ok: false,
		permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
	};
}
//#endregion
//#region src/infra/gateway-lock-process.ts
function readGatewayLockProcessStartTime(pid, platform, timeoutMs) {
	return platform === process.platform ? getFileLockProcessStartTime(pid, process.env, timeoutMs) : null;
}
function readGatewayLockProcessCmdline(pid, platform, timeoutMs, deadlineMs, env = process.env) {
	try {
		if (platform === "linux") return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
		if (platform === "win32") return readWindowsProcessArgsSync(pid, timeoutMs, env, deadlineMs);
		if (platform === "darwin") {
			const command = readDarwinProcessCommand(pid);
			return command && "argv" in command ? command.argv : null;
		}
	} catch {}
	return null;
}
//#endregion
//#region src/infra/gateway-owner-lease.read.ts
const gatewayOwnerKey = {
	scope: "gateway-owner",
	key: "global"
};
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
	const payload = safeParseJsonRecord(row.payloadJson ?? "");
	if (!processOwner || !payload || typeof payload.port !== "number" || !Number.isInteger(payload.port) || payload.port <= 0 || payload.port > 65535 || payload.mode !== "foreground" && payload.mode !== "supervised") throw new Error("Gateway owner lease identity could not be verified");
	if (port !== void 0 && payload.port !== port) return;
	const supervisor = parseSupervisor(payload.supervisor);
	if (payload.mode === "foreground" !== (supervisor === null)) throw new Error("Gateway owner lease supervisor does not match its listener mode");
	return {
		...processOwner,
		owner: row.owner,
		heartbeatAt: row.heartbeatAt ?? row.createdAt,
		port: payload.port,
		mode: payload.mode,
		supervisor,
		state: readStateLeaseProcessOwnerStatus(processOwner, row.heartbeatAt ?? row.createdAt),
		expired: row.expiresAt === null || row.expiresAt <= Date.now()
	};
}
//#endregion
//#region src/infra/gateway-owner-lease.ts
const log = createSubsystemLogger("gateway");
function readStoppedGatewayOwnerLease(db) {
	const previous = readGatewayOwnerLeaseFromDatabase(db);
	if (!previous) return;
	if (previous.state === "dead") return previous;
	const namespace = classifyGatewayOwnerProcessNamespace(previous.processNamespace, {
		ownerHost: previous.host,
		readHeartbeatAt: () => previous.heartbeatAt
	});
	if (namespace === "dead") return previous;
	if (namespace === "unknown") throw new GatewayLockNamespaceError(previous);
	if (previous.expired && previous.state !== "live") return previous;
	throw new Error(`Another Gateway owner lease is still active for this state directory: ${describeGatewayLockHolder(previous, void 0, previous.state === "live" ? "live" : "unknown")}`);
}
/** Physical custody alone must not bypass a fresh, unverifiable lease during maintenance. */
function assertGatewayOwnerLeaseStopped(env, maintenanceOwner) {
	if (maintenanceOwner) {
		const pathname = resolveOpenClawStateSqlitePath(env);
		maintenanceOwner.assertDatabaseAccess(pathname);
		if (existingPathOrUndefined(pathname) === void 0) return;
		const snapshot = prepareSqliteReadOnlyLocationSync(pathname);
		const connection = openOpenClawStateReadConnection(pathname, snapshot.location);
		runWithSqliteCleanup({ release: () => {
			connection.close();
			snapshot.cleanup();
		} }, "Gateway owner lease inspection", () => {
			maintenanceOwner.assertDatabaseAccess(pathname);
			const db = connection.database.db;
			const closeAdmission = openDoctorStateSchemaReadAdmission(db);
			runWithSqliteCleanup({ release: () => closeAdmission?.() }, "Gateway owner lease schema read admission", () => readStoppedGatewayOwnerLease(db));
		});
		return;
	}
	withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => {
		readStoppedGatewayOwnerLease(db);
	}, { env });
}
function readGatewayOwnerLease(params = {}) {
	const operation = ({ db }) => readGatewayOwnerLeaseFromDatabase(db, params.port);
	return params.current || params.openStateSchemaReadAdmission ? withExistingOpenClawStateDatabaseCurrentReadOnly(operation, { env: params.env }, params.openStateSchemaReadAdmission) : withExistingOpenClawStateDatabaseReadOnly(operation, { env: params.env });
}
/** Publish only while the caller holds the Gateway lifecycle coordinator. */
function acquireGatewayOwnerLease(params) {
	const env = params.env ?? process.env;
	const databasePath = resolveOpenClawStateSqlitePath(env);
	const custody = captureGatewayStateOwner(databasePath);
	const identity = {
		...gatewayOwnerKey,
		owner: params.owner ?? randomUUID()
	};
	const processOwner = {
		pid: process.pid,
		host: hostname(),
		processNamespace: readGatewayLockProcessNamespace(),
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
		const previous = readStoppedGatewayOwnerLease(db);
		if (previous) releaseOpenClawStateLeaseInTransaction(db, {
			...identity,
			owner: previous.owner
		});
		const acquired = acquireOpenClawStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, payloadJson);
		if (acquired.kind === "held") throw new Error("Another Gateway owner lease is still active for this state directory");
		return acquired.expiresAt;
	}, {
		databaseLabel: databasePath,
		operationLabel: "gateway.owner-lease.acquire"
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
	}, {
		databaseLabel: databasePath,
		operationLabel: "gateway.owner-lease.release"
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
				identity,
				leaseMs: STARTUP_MIGRATION_LEASE_TTL_MS,
				acquiredAt: expiresAt - STARTUP_MIGRATION_LEASE_TTL_MS,
				expiresAt,
				heartbeatMs: GATEWAY_OWNER_HEARTBEAT_MS,
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
			try {
				if (!custody?.signal.aborted) releaseRow();
			} catch (error) {
				if (!custody?.signal.aborted) throw error;
			}
			released = true;
		}
	};
}
//#endregion
export { readGatewayLockProcessCmdline as a, readWindowsListeningPidsResultSync as c, readWindowsProcessArgsSync as d, readGatewayOwnerLeaseFromDatabase as i, readWindowsPortUsageSync as l, assertGatewayOwnerLeaseStopped as n, readGatewayLockProcessStartTime as o, readGatewayOwnerLease as r, readWindowsListeningPidsOnPortSync as s, acquireGatewayOwnerLease as t, readWindowsProcessArgsResultSync as u };
