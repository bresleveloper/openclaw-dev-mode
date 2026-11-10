import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath, n as existingPathOrUndefined } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { o as decodeWindowsProcessOutput, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { _ as readGatewayLockProcessNamespace, d as GatewayLockNamespaceError, h as describeGatewayLockHolder, m as classifyGatewayOwnerProcessNamespace, u as GATEWAY_OWNER_HEARTBEAT_STALE_MS } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { a as captureGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { t as captureOpenClawStateReadSource } from "./openclaw-state-read-worker-Bp1MZPYo.mjs";
import { f as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, n as readOpenClawStateLease, s as updateOpenClawStateLeasePayloadInTransaction, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-C1yV0igx.mjs";
import { n as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-C0_lkd8F.mjs";
import { t as readDarwinProcessCommand } from "./darwin-process-command-DP1kTZWX.mjs";
import { r as parseProcCmdline } from "./gateway-process-argv-BLh8C227.mjs";
import { t as parseWindowsNativeCommandLine } from "./windows-command-line-BrVAurm9.mjs";
import { r as parseWindowsNetstatListeners } from "./ports-netstat-DLtHL75K.mjs";
import { n as assertAppContainerSpawnSupported } from "./windows-appcontainer-spawn-CK6NM058.mjs";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-BWNEWHjx.mjs";
import { t as startOpenClawStateLeaseHeartbeat } from "./openclaw-state-lease-heartbeat-CZJYjt_V.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { hostname } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
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
	assertAppContainerSpawnSupported();
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
	assertAppContainerSpawnSupported();
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
	assertAppContainerSpawnSupported();
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
	return decodeGatewayOwnerLease(readOpenClawStateLease(db, gatewayOwnerKey), port);
}
function decodeGatewayOwnerLease(row, port) {
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
		...typeof payload.listeningAt === "number" ? { listeningAt: payload.listeningAt } : {},
		state: readStateLeaseProcessOwnerStatus(processOwner, row.heartbeatAt ?? row.createdAt),
		expired: row.expiresAt === null || row.expiresAt <= Date.now()
	};
}
//#endregion
//#region src/infra/gateway-owner-lease.ts
const log = createSubsystemLogger("gateway");
function resolveStoppedGatewayOwnerLease(previous) {
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
/** Physical custody alone must not bypass a fresh, unverifiable lease. */
async function assertGatewayOwnerLeaseStopped(env, owner, schemaMaintenance = false) {
	const pathname = resolveOpenClawStateSqlitePath(env);
	owner.assertDatabaseAccess(pathname);
	if (existingPathOrUndefined(pathname) === void 0) return;
	const context = captureOpenClawStateReadWorkerContext({
		env,
		path: pathname
	});
	const source = captureOpenClawStateReadSource();
	const transport = source.createTransport({
		type: "gatewayOwnerLease.read",
		schemaMaintenance
	});
	const controller = new AbortController();
	const callerSignal = getAsyncWorkSignal();
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	const authority = {
		signal,
		assertCurrent() {
			signal.throwIfAborted();
			context.maintenanceScope?.assertReadAdmission();
			context.admission.assertCurrent();
			owner.assertDatabaseAccess(pathname);
		}
	};
	let prepared;
	let releaseSnapshot;
	let read;
	let retirement;
	let closing;
	const close = () => closing ??= (async () => {
		await read?.result.catch(() => void 0);
		retirement = transport.startClose();
		await retirement.result;
		retirement = void 0;
		releaseSnapshot?.();
		releaseSnapshot = void 0;
		if (prepared) {
			await prepared.cleanupAsync();
			prepared = void 0;
		}
		releaseSource();
	})().finally(() => {
		closing = void 0;
	});
	const releaseSource = source.own(() => {
		read?.service();
		retirement?.service();
	}, () => {
		controller.abort();
		return close();
	});
	const errors = [];
	let outcome;
	try {
		authority.assertCurrent();
		if (schemaMaintenance) {
			prepared = prepareSqliteReadOnlyLocationSync(pathname);
			releaseSnapshot = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		}
		read = transport.startRead({
			context,
			location: prepared?.location ?? pathname,
			snapshotRoot: prepared?.cleanupRoot,
			checkFreshAdmission: false
		}, authority);
		outcome = await read.result;
		if ("error" in outcome) errors.push(outcome.error);
		authority.assertCurrent();
	} catch (error) {
		errors.push(error);
	}
	const cleanupErrors = [];
	try {
		await close();
	} catch (error) {
		cleanupErrors.push(error);
	}
	try {
		authority.assertCurrent();
		if (outcome && "value" in outcome) {
			const reply = outcome.value;
			if (reply.type !== "gatewayOwnerLease.read") throw new Error("Unexpected Gateway owner lease inspection result");
			resolveStoppedGatewayOwnerLease(reply.lease ? {
				...reply.lease,
				state: readStateLeaseProcessOwnerStatus(reply.lease, reply.lease.heartbeatAt)
			} : void 0);
		}
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors([...errors, ...cleanupErrors], "Gateway owner lease inspection and cleanup failed");
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
	const payload = {
		owner: processOwner,
		port: params.port,
		mode: params.mode,
		supervisor: params.supervisor
	};
	const payloadJson = JSON.stringify(payload);
	const mutateLease = (operation, mutate) => withOpenClawStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		return mutate(db);
	}, {
		databaseLabel: databasePath,
		operationLabel: `gateway.owner-lease.${operation}`
	}), {
		env,
		path: databasePath,
		sealOnClose: operation === "release"
	});
	const expiresAt = mutateLease("acquire", (db) => {
		const previous = resolveStoppedGatewayOwnerLease(readGatewayOwnerLeaseFromDatabase(db));
		if (previous) releaseOpenClawStateLeaseInTransaction(db, {
			...identity,
			owner: previous.owner
		});
		const acquired = acquireOpenClawStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, payloadJson);
		if (acquired.kind === "held") throw new Error("Another Gateway owner lease is still active for this state directory");
		return acquired.expiresAt;
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
				heartbeatMs: Math.floor(Math.min(STARTUP_MIGRATION_LEASE_TTL_MS, GATEWAY_OWNER_HEARTBEAT_STALE_MS) / 3),
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
		markListening() {
			custody?.assertCurrent();
			mutateLease("listening", (db) => {
				custody?.assertCurrent();
				const current = readGatewayOwnerLeaseFromDatabase(db);
				if (!current || current.owner !== identity.owner) throw new Error("Gateway owner changed before listening publication");
				updateOpenClawStateLeasePayloadInTransaction(db, identity, JSON.stringify({
					...payload,
					owner: {
						...processOwner,
						startedAt: current.startedAt
					},
					listeningAt: Date.now()
				}));
			});
		},
		async release() {
			if (released) return;
			if (constructionFailure) throw new Error("Gateway owner heartbeat cleanup could not be confirmed", { cause: constructionFailure.error });
			await heartbeat?.stop();
			try {
				if (!custody?.signal.aborted) mutateLease("release", (db) => {
					releaseOpenClawStateLeaseInTransaction(db, identity);
				});
			} catch (error) {
				if (!custody?.signal.aborted) throw error;
			}
			released = true;
		}
	};
}
//#endregion
export { readGatewayLockProcessCmdline as a, readWindowsListeningPidsResultSync as c, readWindowsProcessArgsSync as d, readGatewayOwnerLeaseFromDatabase as i, readWindowsPortUsageSync as l, assertGatewayOwnerLeaseStopped as n, readGatewayLockProcessStartTime as o, readGatewayOwnerLease as r, readWindowsListeningPidsOnPortSync as s, acquireGatewayOwnerLease as t, readWindowsProcessArgsResultSync as u };
