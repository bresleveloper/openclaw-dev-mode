import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { n as openExistingOpenClawStateDatabaseReadOnly, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as resolveDefaultCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DtT0ID4w.mjs";
import "./lifecycle-state-Bi0uY0cx.mjs";
import { c as readClawStatus } from "./package-remove-plan-DxPTWx8f.mjs";
import { createHash } from "node:crypto";
//#region src/claws/doctor.ts
const CLAW_STATE_CHECK_ID = "core/doctor/claws-state";
function finding(params) {
	return {
		checkId: CLAW_STATE_CHECK_ID,
		source: "doctor",
		severity: params.severity ?? "warning",
		...params
	};
}
function cronExecutionDigest(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
function expectedCronExecutionDigest(record, cron) {
	const job = cron.job;
	const staggerMs = resolveDefaultCronStaggerMs(job.schedule.cron);
	return cronExecutionDigest({
		declarationKey: cron.declarationKey,
		ownerAgentId: record.install.agentId,
		enabled: true,
		schedule: {
			kind: "cron",
			expr: job.schedule.cron,
			...job.schedule.timezone ? { tz: job.schedule.timezone } : {},
			...staggerMs !== void 0 ? { staggerMs } : {}
		},
		sessionTarget: job.session === "main" ? `session:agent:${record.install.agentId}:main` : job.session,
		wakeMode: "now",
		payload: {
			kind: "agentTurn",
			message: job.message
		},
		delivery: job.delivery ? {
			mode: job.delivery.mode,
			...job.delivery.channel ? { channel: job.delivery.channel } : {}
		} : { mode: "none" }
	});
}
function liveCronExecutionDigest(job) {
	return cronExecutionDigest({
		declarationKey: job.declarationKey,
		ownerAgentId: job.owner?.agentId ?? job.agentId,
		enabled: job.enabled,
		schedule: job.schedule,
		sessionTarget: job.sessionTarget,
		wakeMode: job.wakeMode,
		payload: job.payload,
		delivery: job.delivery ?? { mode: "none" }
	});
}
function collectInstallFindings(record, cronInventory) {
	const agentId = record.install.agentId;
	const findings = [];
	if (record.install.status !== "complete") findings.push(finding({
		message: `Claw agent ${JSON.stringify(agentId)} has an incomplete install record (${record.install.status}).`,
		path: `claws.${agentId}`,
		target: agentId,
		requirement: "Claw installs should complete or retain explicit partial ownership state",
		fixHint: "Inspect `openclaw claws status` before retrying or removing this Claw."
	}));
	if (record.agentState !== "present") findings.push(finding({
		message: record.agentState === "missing" ? `Claw-owned agent ${JSON.stringify(agentId)} is missing from config.` : `Claw-owned agent ${JSON.stringify(agentId)} changed after installation.`,
		path: `agents.list.${agentId}`,
		target: agentId,
		requirement: "Claw-owned agent config should match its recorded install digest",
		fixHint: "Inspect the agent change before removing or replacing Claw-owned state."
	}));
	for (const file of record.workspaceFiles) {
		if (file.state === "unchanged") continue;
		findings.push(finding({
			message: file.state === "missing" ? `Claw-managed workspace file is missing: ${file.path}` : file.state === "modified" ? `Claw-managed workspace file changed after installation: ${file.path}` : `Claw-managed workspace file is unsafe to inspect: ${file.path}${file.message ? ` (${file.message})` : ""}`,
			path: `claws.${agentId}.workspace.${file.path}`,
			target: `${file.workspace}:${file.path}`,
			requirement: "Claw-managed workspace files should remain inspectable with recorded content",
			fixHint: "Keep intentional local edits, or inspect the file before removing the Claw."
		}));
	}
	for (const pkg of record.packages) {
		if (pkg.extensionCompatibility && pkg.extensionCompatibility.state !== "compatible") findings.push(finding({
			message: `Claw extension ${JSON.stringify(pkg.extension?.id ?? pkg.ref)} has ${pkg.extensionCompatibility.state} host compatibility state${pkg.extensionCompatibility.message ? `: ${pkg.extensionCompatibility.message}` : "."}`,
			path: `claws.${agentId}.extensions.${pkg.extension?.id ?? pkg.ref}`,
			target: `${pkg.source}:${pkg.ref}@${pkg.version}`,
			requirement: "Claw extensions should retain their consented canonical capability mapping",
			fixHint: "Preview a Claw update before accepting the host's current extension mapping."
		}));
		if (pkg.state === "present") continue;
		findings.push(finding({
			message: `Claw ${pkg.kind} ${JSON.stringify(`${pkg.ref}@${pkg.version}`)} has ${pkg.state} lifecycle state.`,
			path: `claws.${agentId}.packages.${pkg.kind}.${pkg.ref}`,
			target: `${pkg.source}:${pkg.ref}@${pkg.version}`,
			requirement: "Claw package references should match canonical installed package state",
			fixHint: "Inspect package state with `openclaw claws status` before updating or removing the Claw."
		}));
	}
	for (const server of record.mcpServers) {
		if (server.state === "present") continue;
		findings.push(finding({
			message: `Claw MCP server ${JSON.stringify(server.name)} has ${server.state} ownership state${server.error ? `: ${server.error}` : "."}`,
			path: `mcp.servers.${server.name}`,
			target: server.name,
			requirement: "Claw MCP ownership should be complete and match live canonical config",
			fixHint: server.state === "failed" ? "Remove the partial Claw to release its non-owning reference." : "Inspect MCP config drift before removing or replacing Claw-owned state."
		}));
	}
	for (const cron of record.cronJobs) {
		if (cron.status !== "complete" || !cron.schedulerJobId) {
			findings.push(finding({
				message: `Claw cron declaration ${JSON.stringify(cron.manifestId)} has ${cron.status} ownership state${cron.error ? `: ${cron.error}` : "."}`,
				path: `claws.${agentId}.cronJobs.${cron.manifestId}`,
				target: cron.schedulerJobId ?? cron.declarationKey,
				requirement: "Claw cron ownership should resolve to a persisted scheduler job id",
				fixHint: "Reconcile the declaration with the gateway before removing the Claw."
			}));
			continue;
		}
		if (!cronInventory) {
			findings.push(finding({
				message: `Claw cron declaration ${JSON.stringify(cron.manifestId)} live Gateway state is unknown; no cron inventory was available.`,
				path: `claws.${agentId}.cronJobs.${cron.manifestId}`,
				target: cron.schedulerJobId,
				requirement: "Claw cron health requires live Gateway corroboration by job id, declaration key, owner, enabled state, and execution digest",
				fixHint: "Run diagnostics with Gateway cron inventory available before treating this cron as healthy."
			}));
			continue;
		}
		if (!cronInventory.ok) {
			findings.push(finding({
				message: `Claw cron declaration ${JSON.stringify(cron.manifestId)} live Gateway state is unknown: ${cronInventory.error}`,
				path: `claws.${agentId}.cronJobs.${cron.manifestId}`,
				target: cron.schedulerJobId,
				requirement: "Claw cron health requires live Gateway corroboration by job id, declaration key, owner, enabled state, and execution digest",
				fixHint: "Restore Gateway cron inventory before treating this cron as healthy."
			}));
			continue;
		}
		const live = cronInventory.jobs.find((job) => job.id === cron.schedulerJobId);
		if (!live) {
			findings.push(finding({
				message: `Claw cron declaration ${JSON.stringify(cron.manifestId)} is missing from live Gateway inventory.`,
				path: `claws.${agentId}.cronJobs.${cron.manifestId}`,
				target: cron.schedulerJobId,
				requirement: "Claw cron health requires live Gateway corroboration by scheduler job id",
				fixHint: "Recreate or reconcile the Gateway automation before treating this Claw as healthy."
			}));
			continue;
		}
		const ownerAgentId = live.owner?.agentId ?? live.agentId;
		const expectedDigest = expectedCronExecutionDigest(record, cron);
		const liveDigest = liveCronExecutionDigest(live);
		if (live.declarationKey !== cron.declarationKey || ownerAgentId !== agentId || !live.enabled || liveDigest !== expectedDigest) findings.push(finding({
			message: `Claw cron declaration ${JSON.stringify(cron.manifestId)} differs from live Gateway job ${JSON.stringify(live.id)}.`,
			path: `claws.${agentId}.cronJobs.${cron.manifestId}`,
			target: cron.schedulerJobId,
			requirement: "Claw cron health requires live Gateway job id, declaration key, owner, enabled state, and execution digest to match",
			fixHint: "Inspect Gateway cron drift before updating or removing this Claw."
		}));
	}
	return findings;
}
function tableExists(db, name) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name));
}
function orphanedAgentIds(options) {
	const { db } = openOpenClawStateDatabase(options);
	const installed = /* @__PURE__ */ new Set();
	if (tableExists(db, "claw_installs")) for (const row of db.prepare("SELECT agent_id FROM claw_installs").all()) installed.add(row.agent_id);
	const referenced = /* @__PURE__ */ new Set();
	for (const table of [
		"claw_workspace_files",
		"claw_package_refs",
		"claw_mcp_server_refs",
		"claw_cron_refs"
	]) {
		if (!tableExists(db, table)) continue;
		for (const row of db.prepare(`SELECT DISTINCT agent_id FROM ${table}`).all()) referenced.add(row.agent_id);
	}
	return [...referenced].filter((agentId) => !installed.has(agentId)).toSorted();
}
function hasClawMcpServerRefs(db) {
	return tableExists(db, "claw_mcp_server_refs") && Boolean(db.prepare("SELECT 1 FROM claw_mcp_server_refs LIMIT 1").get());
}
function orphanedReferenceFinding(agentId) {
	return finding({
		message: `Claw ownership references for agent ${JSON.stringify(agentId)} have no root install record.`,
		path: `claws.${agentId}`,
		target: agentId,
		requirement: "Claw-owned resources should have a matching claw_installs row",
		fixHint: "Inspect the state database and live resources before deleting orphaned references."
	});
}
async function collectClawStateHealthFindings(options = {}) {
	if (!isExperimentalClawsEnabled(options.env ?? process.env)) return [];
	let database;
	try {
		database = await openExistingOpenClawStateDatabaseReadOnly(options);
		if (!database) return [];
		const orphanedRefs = orphanedAgentIds({
			...options,
			database,
			readOnly: true
		});
		if (!tableExists(database.db, "claw_installs")) return orphanedRefs.map(orphanedReferenceFinding);
		let sourceMcpServers = options.sourceMcpServers ?? {};
		if (hasClawMcpServerRefs(database.db) && !options.sourceMcpServers) {
			const listed = await (options.listMcpServers ?? listConfiguredMcpServers)();
			if (!listed.ok) throw new Error(listed.error);
			sourceMcpServers = listed.mcpServers;
		}
		const status = await readClawStatus(void 0, {
			...options,
			database,
			readOnly: true,
			...options.cfg ? { config: options.cfg } : {},
			sourceMcpServers
		});
		const hasCronRefs = status.records.some((record) => record.cronJobs.length > 0);
		let cronInventory;
		if (hasCronRefs && options.cronGateway) try {
			cronInventory = {
				ok: true,
				jobs: await options.cronGateway.list({ includeDisabled: true })
			};
		} catch (error) {
			cronInventory = {
				ok: false,
				error: coerceErrorMessage(error)
			};
		}
		const findings = status.records.flatMap((record) => collectInstallFindings(record, cronInventory));
		for (const agentId of orphanedRefs) findings.push(orphanedReferenceFinding(agentId));
		return findings;
	} catch (error) {
		return [finding({
			severity: "error",
			message: `Could not inspect Claw lifecycle state: ${coerceErrorMessage(error)}`,
			requirement: "Claw doctor diagnostics require readable lifecycle state"
		})];
	} finally {
		database?.walMaintenance.close();
	}
}
//#endregion
export { collectClawStateHealthFindings };
