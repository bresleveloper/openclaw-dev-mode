import { s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { l as markMigrationItemConflict, n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem, s as createMigrationManualItem, y as summarizeMigrationItems } from "./migration-BeM6IrM8.mjs";
import { a as resolvePlannedMigrationTargets } from "./migration-runtime-BOM5W2_O.mjs";
import { i as parseHermesConfig, o as readText, r as parseEnv } from "./helpers-B2SzrrLy.mjs";
import { c as HERMES_REASON_MODEL_PROVIDER_CONFLICT, f as findHermesModelProviderDependency, u as createHermesModelItem } from "./items-Ow1uFW0E.mjs";
import { n as buildAuthItems } from "./auth-BipNh_8-.mjs";
import { a as resolveCurrentModelRef, c as usesRetiredHermesQwenProvider, s as resolveHermesModelRef } from "./model-B-1-eaxp.mjs";
import { t as buildConfigItems } from "./config-By5iBqg4.mjs";
import { n as isMemoryOnlyMigration, t as buildHermesMemoryPlan } from "./memory-ovWzN4WC.mjs";
import { n as buildSecretItems } from "./secrets-DhvozIaq.mjs";
import { t as buildSkillItems } from "./skills-CkVdjUXy.mjs";
import { n as hasHermesSource, t as discoverHermesSource } from "./source-Y9b0IJyK.mjs";
import path from "node:path";
//#region extensions/migrate-hermes/plan.ts
async function addFileItem(params) {
	if (!params.source) return;
	const targetExists = await pathExists(params.target);
	params.items.push(createMigrationItem({
		id: params.id,
		kind: "workspace",
		action: "copy",
		source: params.source,
		target: params.target,
		status: targetExists && !params.overwrite ? "conflict" : "planned",
		reason: targetExists && !params.overwrite ? MIGRATION_REASON_TARGET_EXISTS : void 0
	}));
}
async function buildHermesPlan(ctx) {
	const source = await discoverHermesSource(ctx.source);
	if (isMemoryOnlyMigration(ctx)) return await buildHermesMemoryPlan(ctx, source);
	if (!hasHermesSource(source)) throw new Error(`Hermes state was not found at ${source.root}. Pass --from <path> if it lives elsewhere.`);
	const targets = resolvePlannedMigrationTargets(ctx);
	let config;
	try {
		config = parseHermesConfig(await readText(source.configPath));
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to parse Hermes config at ${source.configPath}: ${reason}`, { cause: err });
	}
	const env = parseEnv(await readText(source.envPath));
	const modelRef = resolveHermesModelRef(config, env);
	const runtimeEnv = filterStringRecord(process.env) ?? {};
	const items = [];
	let modelItemIndex;
	if (modelRef) {
		const currentModel = resolveCurrentModelRef(ctx);
		modelItemIndex = items.length;
		items.push(createHermesModelItem({
			model: modelRef,
			currentModel,
			targetAgentId: ctx.targetAgentId,
			overwrite: ctx.overwrite
		}));
	}
	const configItems = buildConfigItems({
		ctx,
		config,
		env,
		runtimeEnv,
		modelRef,
		hasMemoryFiles: Boolean(source.memoryPath || source.userPath)
	});
	if (modelRef && modelItemIndex !== void 0) {
		const modelItem = items[modelItemIndex];
		const dependency = findHermesModelProviderDependency(configItems, modelRef);
		if (modelItem?.status === "planned" && dependency?.status === "conflict") items[modelItemIndex] = markMigrationItemConflict(modelItem, HERMES_REASON_MODEL_PROVIDER_CONFLICT);
	}
	items.push(...configItems);
	for (const [filename, sourcePath] of [["SOUL.md", source.soulPath], ["AGENTS.md", source.agentsPath]]) await addFileItem({
		items,
		id: `workspace:${filename}`,
		source: sourcePath,
		target: path.join(targets.workspaceDir, filename),
		overwrite: ctx.overwrite
	});
	for (const [filename, sourcePath] of [["MEMORY.md", source.memoryPath], ["USER.md", source.userPath]]) if (sourcePath) items.push(createMigrationItem({
		id: `memory:${filename}`,
		kind: "memory",
		action: "append",
		source: sourcePath,
		target: path.join(targets.workspaceDir, filename)
	}));
	items.push(...await buildSkillItems({
		source,
		targets,
		overwrite: ctx.overwrite
	}));
	const authItems = await buildAuthItems({
		ctx,
		source,
		targets
	});
	if (usesRetiredHermesQwenProvider(config) && !authItems.some((item) => item.id === "manual:auth-reauthenticate:qwen")) authItems.unshift(createMigrationManualItem({
		id: "manual:auth-reauthenticate:qwen",
		source: source.configPath ?? source.root,
		message: "Hermes Qwen Portal OAuth and Qwen CLI credentials cannot be reused by OpenClaw.",
		recommendation: "Authenticate qwen with an API key after migration: openclaw onboard --auth-choice qwen-api-key."
	}));
	items.push(...authItems);
	items.push(...await buildSecretItems({
		config,
		ctx,
		source,
		targets
	}));
	for (const archivePath of source.archivePaths) items.push(createMigrationItem({
		id: archivePath.id,
		kind: "archive",
		action: "archive",
		source: archivePath.path,
		message: "Archived in the migration report for manual review; not imported into live config.",
		details: { archiveRelativePath: archivePath.relativePath }
	}));
	const warnings = [
		...!ctx.includeSecrets && items.some((item) => item.kind === "secret" || item.kind === "auth") ? ["Auth credentials were detected but skipped. Re-run interactively or pass --include-secrets to import supported credentials."] : [],
		...items.some((item) => item.kind === "auth" && item.details?.sourceKind === "hermes-auth-json") ? ["Hermes and OpenClaw must not keep using the same imported OpenAI OAuth refresh grant after migration; reauthenticate one side before running both."] : [],
		...items.some((item) => item.status === "conflict") ? ["Conflicts were found. Re-run with --overwrite to replace conflicting targets after item-level backups."] : [],
		...source.archivePaths.length > 0 ? ["Some Hermes files are archive-only. They will be copied into the migration report for manual review, not loaded into OpenClaw."] : [],
		...items.some((item) => item.kind === "manual") ? ["Some Hermes settings require manual review before they can be activated safely."] : []
	];
	return {
		providerId: "hermes",
		source: source.root,
		target: targets.workspaceDir,
		summary: summarizeMigrationItems(items),
		items,
		warnings,
		nextSteps: ["Run openclaw doctor after applying the migration."],
		metadata: { agentDir: targets.agentDir }
	};
}
//#endregion
export { buildHermesPlan as t };
