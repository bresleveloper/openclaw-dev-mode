import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { _ as onTrustedInternalDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import { r as normalizeSkillIndexName } from "./skill-index-C40nKKG1.mjs";
import path from "node:path";
//#region src/skills/workshop/skill-usage.ts
const log = createSubsystemLogger("skills/usage");
/** Usage counters keyed by the canonical absolute SKILL.md path. */
async function readSkillUsage(options, skillFiles) {
	const canonicalFiles = [...new Set(skillFiles.map((file) => canonicalizePath(file)))];
	const usage = /* @__PURE__ */ new Map();
	if (canonicalFiles.length === 0) return usage;
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const rows = await executeOpenClawStateWorker(context, {
		type: "skills.usage.read",
		input: { skillFiles: canonicalFiles }
	});
	for (const row of rows) usage.set(row.skillFile, {
		useCount: row.useCount,
		lastUsedAtMs: row.lastUsedAtMs
	});
	return usage;
}
async function recordSkillUsage(event, context) {
	const rawSkillFile = event.skillFile?.trim();
	if (!rawSkillFile || !path.isAbsolute(rawSkillFile)) {
		log.debug(`skipping skill usage without file identity: ${event.skillName}`);
		return;
	}
	const skillFile = canonicalizePath(path.resolve(rawSkillFile));
	const skillKey = normalizeSkillIndexName(event.skillName);
	if (!skillKey) throw new Error(`Invalid skill name: ${event.skillName}`);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	await executeOpenClawStateWorker(context, {
		type: "skills.usage.record",
		input: {
			...event,
			skillFile,
			skillKey
		}
	});
}
let activeTrackers = 0;
/** True while this process persists skill.used events (the Gateway registers the listener). */
function isSkillUsageTracked() {
	return activeTrackers > 0;
}
/** Listener failures must never propagate into the tool execution that emitted usage. */
function registerSkillUsageTracking(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const work = new AsyncWorkScope();
	activeTrackers += 1;
	let closing;
	const unregister = onTrustedInternalDiagnosticEvent((event, metadata, privateData) => {
		if (closing || !metadata.trusted || event.type !== "skill.used") return;
		work.track(async () => {
			try {
				await recordSkillUsage({
					...event,
					skillFile: privateData.skillUsage?.skillFile
				}, context);
			} catch (error) {
				log.warn(`failed to record skill usage: ${String(error)}`);
			}
		});
	}, { include: ["skill.used"] });
	return () => {
		if (!closing) activeTrackers -= 1;
		unregister();
		return closing ??= AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain());
	};
}
//#endregion
export { readSkillUsage as n, registerSkillUsageTracking as r, isSkillUsageTracked as t };
