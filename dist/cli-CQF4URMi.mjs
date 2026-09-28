import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-CZWcIUDk.mjs";
import { t as mutateConfigFile } from "./mutate-CdmDoEFy.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import "./setup-runtime-o3LAKJcI.mjs";
import "./config-mutation-CCgack0N.mjs";
import "./policy-C9idLd3f.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/file-transfer/src/approvals-migration.ts
function listLegacyApprovalItems(pluginConfig) {
	const config = asNullableRecord(pluginConfig);
	if (!config || config.policyVersion === 2) return [];
	const nodes = asNullableRecord(config.nodes);
	if (!nodes) return [];
	const items = [];
	const seen = /* @__PURE__ */ new Set();
	for (const [selector, rawNode] of Object.entries(nodes)) {
		const node = asNullableRecord(rawNode);
		if (!node) continue;
		for (const [kind, field] of [["read", "allowReadPaths"], ["write", "allowWritePaths"]]) {
			const paths = Array.isArray(node[field]) ? node[field] : [];
			for (const value of paths) if (typeof value === "string" && value.length > 0) {
				const key = `${selector}\0${kind}\0${value}`;
				if (seen.has(key)) continue;
				seen.add(key);
				items.push({
					selector,
					kind,
					path: value
				});
			}
		}
	}
	return items;
}
function applyApprovalMigration(pluginConfig, decisions) {
	const original = asNullableRecord(pluginConfig) ?? {};
	const next = structuredClone(original);
	const nodes = asNullableRecord(next.nodes) ?? {};
	next.nodes = nodes;
	const pendingReapprovals = [];
	for (const decision of decisions) {
		if (decision.action === "keep-glob") continue;
		const node = asNullableRecord(nodes[decision.item.selector]);
		if (!node) continue;
		const field = decision.item.kind === "read" ? "allowReadPaths" : "allowWritePaths";
		node[field] = (Array.isArray(node[field]) ? node[field] : []).filter((value) => value !== decision.item.path);
		if (decision.action === "exact") pendingReapprovals.push(decision.item);
	}
	next.pendingReapprovals = pendingReapprovals;
	next.policyVersion = 2;
	return next;
}
//#endregion
//#region extensions/file-transfer/src/cli.ts
function readPluginConfig(config) {
	const root = asNullableRecord(config);
	const plugins = asNullableRecord(root?.plugins);
	const entries = asNullableRecord(plugins?.entries);
	const entry = asNullableRecord(entries?.["file-transfer"]);
	return asNullableRecord(entry?.config);
}
function resolveMigrationBackupPath(prepared) {
	const ownership = prepared.snapshot.includeProvenance?.findLast((entry) => entry.path.length <= 1 && entry.path[0] === "plugins");
	const configPath = ownership?.path.length === 1 && ownership.kind === "single" && !ownership.hasSiblingOverrides && ownership.targetPath ? ownership.targetPath : prepared.snapshot.path;
	return `${path.normalize(configPath)}.bak`;
}
async function runApprovalMigration(options) {
	const prepared = await readConfigFileSnapshotForWrite();
	if (!prepared.snapshot.valid) throw new Error("OpenClaw config is invalid; fix it before migrating file-transfer approvals");
	const sourceRoot = asNullableRecord(prepared.snapshot.sourceConfig);
	if (asNullableRecord(sourceRoot?.gateway)?.mode === "remote") throw new Error("This migration must run on the Gateway host because it updates that host's file-transfer policy.");
	const pluginConfig = readPluginConfig(prepared.snapshot.sourceConfig);
	const items = listLegacyApprovalItems(pluginConfig);
	if (items.length === 0) {
		const result = {
			status: "ok",
			changed: false,
			message: "No legacy permissions need review."
		};
		process.stdout.write(options.json ? `${JSON.stringify(result)}\n` : `${result.message}\n`);
		return;
	}
	if (options.json || !process.stdin.isTTY) {
		const result = {
			status: "needs-input",
			changed: false,
			items,
			command: "openclaw file-transfer approvals migrate"
		};
		if (options.json) {
			process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
			process.exitCode = 2;
			return;
		}
		throw new Error("File-transfer permissions need interactive review. Run `openclaw file-transfer approvals migrate` in a terminal.");
	}
	const prompt = createClackPrompter();
	await prompt.intro("Review file-transfer permissions");
	await prompt.note("Older positive permissions remain inactive until this review finishes. Deny rules and transfer limits remain active.");
	const decisions = [];
	for (const item of items) {
		const action = await prompt.select({
			message: `${item.selector} · ${item.kind} · ${item.path}`,
			options: [
				{
					value: "exact",
					label: "Require exact reapproval",
					hint: "Next use prompts once, then binds the actual node and command"
				},
				{
					value: "keep-glob",
					label: "Keep as an intentional wildcard",
					hint: "Retains the current glob behavior"
				},
				{
					value: "remove",
					label: "Remove this permission"
				}
			]
		});
		decisions.push({
			item,
			action
		});
	}
	const keepCount = decisions.filter((decision) => decision.action === "keep-glob").length;
	const exactCount = decisions.filter((decision) => decision.action === "exact").length;
	const removeCount = decisions.filter((decision) => decision.action === "remove").length;
	await prompt.note(`Exact paths requiring one reapproval: ${exactCount}\nIntentional wildcards: ${keepCount}\nRemoved: ${removeCount}`, "Migration plan");
	await prompt.note("Older OpenClaw versions cannot read the migrated format. To downgrade, restore the adjacent config backup shown after migration before starting the older version.", "Downgrade");
	if (options.dryRun) {
		await prompt.outro("Dry run complete. No config was changed.");
		return;
	}
	if (!await prompt.confirm({
		message: "Apply this migration?",
		initialValue: true
	})) {
		await prompt.outro("Cancelled. No config was changed.");
		return;
	}
	const migrated = applyApprovalMigration(pluginConfig, decisions);
	const backupPath = resolveMigrationBackupPath(prepared);
	const backupBefore = await fs.stat(backupPath).catch(() => null);
	await mutateConfigFile({
		base: "source",
		baseHash: prepared.snapshot.hash,
		writeOptions: prepared.writeOptions,
		afterWrite: {
			mode: "none",
			reason: "file-transfer approval policy migration"
		},
		mutate: (draft) => {
			const plugins = draft.plugins ??= {};
			const entries = plugins.entries ??= {};
			const entry = entries["file-transfer"] ??= {};
			entry.config = migrated;
		}
	});
	const backupAfter = await fs.stat(backupPath).catch(() => null);
	const backupVerified = Boolean(backupAfter && (!backupBefore || backupAfter.ino !== backupBefore.ino || backupAfter.mtimeMs !== backupBefore.mtimeMs || backupAfter.size !== backupBefore.size));
	await prompt.outro(backupVerified ? `File-transfer permissions updated. Exact paths will prompt once on next use. Config backup: ${backupPath}` : "File-transfer permissions updated. Exact paths will prompt once on next use. The standard config backup could not be verified.");
}
function registerFileTransferCli(program) {
	program.command("file-transfer").description("Review file-transfer standing approvals").command("approvals").description("Manage standing approvals").command("migrate").description("Review and migrate older file-transfer permissions").option("--dry-run", "Review choices without changing config", false).option("--json", "Report unresolved legacy permissions as JSON", false).action(async (options) => {
		await runApprovalMigration(options);
	});
}
//#endregion
export { registerFileTransferCli };
