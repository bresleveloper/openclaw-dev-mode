import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./config-B3oiWDlr.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { i as resolveCronJobsStorePathFromConfigAsync } from "./paths-C7jZRDkL.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-D4CgBm6V.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-BJIyIMth.mjs";
import { a as listWorkshopSkills, d as listWorkshopChanges, n as archiveWorkshopSkill, t as WorkshopWriteError } from "./library-lvOOduU2.mjs";
import { r as loadCronJobsStore } from "./store-HF7PvtRl.mjs";
import { n as readSkillUsage, t as isSkillUsageTracked } from "./skill-usage-B2kFEY1T.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/skills/workshop/unused-archive.ts
const log = createSubsystemLogger("skills/workshop");
const UNUSED_ARCHIVE_MS = 2592e6;
const UNUSED_ARCHIVE_REASON = "unused for 30 days";
const CHANGE_FEED_LIMIT = 500;
/** Every scheduled job's payload text, including paused jobs; a job may run less than monthly. */
async function readCronPayloadText(config) {
	return (await loadCronJobsStore(await resolveCronJobsStorePathFromConfigAsync(config))).jobs.map((job) => JSON.stringify(job.payload ?? {})).join("\n");
}
function mentionsSkill(text, name) {
	return new RegExp(`(?<![a-z0-9-])${name}(?![a-z0-9-])`).test(text);
}
/**
* Archives an agent's learned skills with no activity for 30 days. Activity is the latest of:
* recorded use (a file read or a foreground skill_workshop view, via skill_usage), the skill's
* last change row, and its files' mtime/ctime. ctime never predates the file, so a skill copied
* in with old mtimes still counts as young. A skill named in any cron job is kept: scheduled
* work can run less often than the cutoff. Archive is the normal versioned, undoable archive.
*/
async function archiveUnusedWorkshopSkills(config, agentId, nowMs = Date.now()) {
	if (!isSkillUsageTracked() || resolveSandboxConfigForAgent(config, agentId).mode !== "off") return [];
	const model = resolveDefaultModelForAgent({
		cfg: config,
		agentId
	});
	if (resolveEffectiveAgentRuntime({
		cfg: config,
		provider: model.provider,
		modelId: model.model,
		agentId
	}) !== "openclaw") return [];
	const skills = await listWorkshopSkills(config, agentId);
	if (skills.length === 0) return [];
	const root = resolveWorkshopSkillsDir(config, agentId);
	const entries = skills.map((skill) => ({
		skill,
		skillFile: canonicalizePath(path.join(root, skill.name, "SKILL.md"))
	}));
	const [usage, changes, cronText] = await Promise.all([
		readSkillUsage({}, entries.map((entry) => entry.skillFile)),
		listWorkshopChanges(agentId, { limit: CHANGE_FEED_LIMIT }),
		readCronPayloadText(config)
	]);
	const lastChangeMs = /* @__PURE__ */ new Map();
	for (const change of changes) if (!lastChangeMs.has(change.skillName)) lastChangeMs.set(change.skillName, change.createdAtMs);
	const cutoffMs = nowMs - UNUSED_ARCHIVE_MS;
	const archived = [];
	const learningOn = () => resolveSkillWorkshopConfig(readRuntimeConfig()).autonomous.mode === "auto";
	const assertLive = () => {
		if (!learningOn()) throw new WorkshopWriteError("Learning is off.");
	};
	for (const { skill, skillFile } of entries) {
		const stat = await fs.stat(skillFile).catch(() => void 0);
		if (Math.max(skill.updatedAtMs, stat ? Math.max(stat.mtimeMs, stat.ctimeMs) : nowMs, lastChangeMs.get(skill.name) ?? 0, usage.get(skillFile)?.lastUsedAtMs ?? 0) > cutoffMs || mentionsSkill(cronText, skill.name)) continue;
		if (!learningOn()) break;
		try {
			archived.push(await archiveWorkshopSkill({
				config,
				agentId,
				actor: "curator",
				assertLive
			}, {
				name: skill.name,
				reason: UNUSED_ARCHIVE_REASON
			}));
		} catch (error) {
			log.warn(`unused skill archive failed: skill=${skill.name} ${formatErrorMessage(error)}`);
		}
	}
	return archived;
}
//#endregion
export { archiveUnusedWorkshopSkills };
