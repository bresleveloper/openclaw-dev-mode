import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem, v as summarizeMigrationItems } from "./migration-Cf1WpRKe.mjs";
import { a as resolvePlannedMigrationTargets } from "./migration-runtime-Dymng054.mjs";
import fs from "node:fs/promises";
import path from "node:path";
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
async function buildHermesMemoryPlan(ctx, source) {
	const targets = resolvePlannedMigrationTargets(ctx);
	const importRoot = path.join(targets.workspaceDir, "memory", "imports", "hermes");
	const items = [];
	for (const [filename, sourcePath] of [["MEMORY.md", source.memoryPath], ["USER.md", source.userPath]]) {
		if (!sourcePath) continue;
		const target = path.join(importRoot, filename);
		const targetStat = await lstatIfExists(target);
		const targetNotRegular = targetStat !== void 0 && !targetStat.isFile();
		const targetConflict = targetNotRegular || targetStat !== void 0 && !ctx.overwrite;
		items.push(createMigrationItem({
			id: `memory:${filename}`,
			kind: "memory",
			action: "copy",
			source: sourcePath,
			target,
			status: targetConflict ? "conflict" : "planned",
			reason: targetNotRegular ? MIGRATION_REASON_TARGET_NOT_REGULAR : targetConflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
			message: "Copy Hermes memory into the OpenClaw memory index.",
			details: {
				sourceType: "hermes-memory",
				sourceLabel: `Hermes ${filename}`,
				collectionId: "hermes",
				collectionLabel: "Hermes",
				relativePath: filename
			}
		}));
	}
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
