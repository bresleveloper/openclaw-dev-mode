import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import "./error-runtime-BmospGvZ.mjs";
import { n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem, y as summarizeMigrationItems } from "./migration-BeM6IrM8.mjs";
import { a as resolvePlannedMigrationTargets } from "./migration-runtime-BOM5W2_O.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-hermes/memory.ts
const MIGRATION_REASON_TARGET_NOT_REGULAR = "target is not a regular file";
async function lstatIfExists(filePath) {
	try {
		return await fs.lstat(filePath);
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw error;
	}
}
function isMemoryOnlyMigration(ctx) {
	return Boolean(ctx.itemKinds && ctx.itemKinds.length > 0 && ctx.itemKinds.every((kind) => kind === "memory"));
}
async function buildMemoryItem(params) {
	if (!params.source) return;
	const targetStat = await lstatIfExists(params.target);
	const targetExists = targetStat !== void 0;
	const targetNotRegular = targetExists && !targetStat.isFile();
	const targetConflict = targetNotRegular || targetExists && !params.overwrite;
	return createMigrationItem({
		id: params.id,
		kind: "memory",
		action: "copy",
		source: params.source,
		target: params.target,
		status: targetConflict ? "conflict" : "planned",
		reason: targetNotRegular ? MIGRATION_REASON_TARGET_NOT_REGULAR : targetConflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
		message: "Copy Hermes memory into the OpenClaw memory index.",
		details: {
			sourceType: "hermes-memory",
			sourceLabel: params.sourceLabel,
			collectionId: "hermes",
			collectionLabel: "Hermes",
			relativePath: params.relativePath
		}
	});
}
async function buildHermesMemoryPlan(ctx, source) {
	const targets = resolvePlannedMigrationTargets(ctx);
	const importRoot = path.join(targets.workspaceDir, "memory", "imports", "hermes");
	const items = (await Promise.all([["MEMORY.md", source.memoryPath], ["USER.md", source.userPath]].map(([filename, sourcePath]) => buildMemoryItem({
		id: `memory:${filename}`,
		source: sourcePath,
		sourceLabel: `Hermes ${filename}`,
		target: path.join(importRoot, filename),
		relativePath: filename,
		overwrite: ctx.overwrite
	})))).filter((item) => item !== void 0);
	return {
		providerId: "hermes",
		source: source.root,
		target: targets.workspaceDir,
		summary: summarizeMigrationItems(items),
		items,
		warnings: items.some((item) => item.status === "conflict") ? ["Conflicts were found. Re-run with --overwrite to replace conflicting targets after item-level backups."] : [],
		nextSteps: [],
		metadata: { agentDir: targets.agentDir }
	};
}
//#endregion
export { isMemoryOnlyMigration as n, buildHermesMemoryPlan as t };
