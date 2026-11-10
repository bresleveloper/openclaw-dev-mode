import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as compactSkillPath } from "./local-loader-DuDhVnOL.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
//#region src/skills/loading/skill-precedence.ts
const skillsLogger = createSubsystemLogger("skills");
const reportedSkillCollisions = /* @__PURE__ */ new Map();
const reportedGroupsBySource = /* @__PURE__ */ new Map();
function reportSkillPrecedenceCollisions(collisions, sourceKey) {
	const groups = /* @__PURE__ */ new Map();
	for (const { winner, loser } of collisions) {
		if (winner.contentHash && winner.contentHash === loser.contentHash && winner.name === loser.name && winner.description === loser.description && winner.disableModelInvocation === loser.disableModelInvocation) continue;
		const winnerRoot = winner.discoveryRoot?.path ?? winner.baseDir;
		const loserRoot = loser.discoveryRoot?.path ?? loser.baseDir;
		const key = JSON.stringify([
			winnerRoot,
			loserRoot,
			winner.source,
			loser.source
		]);
		const group = groups.get(key) ?? {
			winner,
			loser,
			winnerRoot,
			loserRoot,
			names: /* @__PURE__ */ new Set(),
			contents: /* @__PURE__ */ new Set()
		};
		group.names.add(winner.name);
		group.contents.add(JSON.stringify([winner, loser].map((skill) => [
			skill.name,
			skill.contentHash ?? skill.filePath,
			skill.description,
			skill.disableModelInvocation,
			skill.discoveryRoot?.worktree
		])));
		groups.set(key, group);
	}
	for (const key of reportedGroupsBySource.get(sourceKey) ?? []) if (!groups.has(key)) reportedSkillCollisions.delete(key);
	if (groups.size > 0) reportedGroupsBySource.set(sourceKey, new Set(groups.keys()));
	else reportedGroupsBySource.delete(sourceKey);
	for (const [key, group] of groups) {
		const digest = sha256Hex(JSON.stringify([...group.contents].toSorted()));
		if (reportedSkillCollisions.get(key) === digest) continue;
		reportedSkillCollisions.set(key, digest);
		const names = [...group.names].toSorted();
		const sample = names.slice(0, 3).map((name) => name.slice(0, 128));
		if (names.length > sample.length) sample.push(`+${names.length - sample.length} more`);
		const { winner, loser, winnerRoot, loserRoot } = group;
		const isWorkspaceSource = (source) => source === "openclaw-workspace" || source === "agents-skills-project";
		const lowerTrust = isWorkspaceSource(winner.source) && (loser.source === "openclaw-bundled" || loser.source === "openclaw-custodian") || winner.discoveryRoot?.worktree && !loser.discoveryRoot?.worktree && isWorkspaceSource(loser.source);
		skillsLogger[lowerTrust ? "warn" : "info"]("Skill precedence collisions resolved.", {
			winnerSource: winner.source,
			loserSource: loser.source,
			winnerRoot,
			loserRoot,
			skillCount: names.length,
			skills: sample,
			consoleMessage: `${compactSkillPath(winnerRoot)} shadows ${names.length} skills from ${compactSkillPath(loserRoot)} (${sample.join(", ")})`
		});
	}
}
function mergeSkillRecords(records, sourceKey, collisions) {
	const discoveredCollisions = collisions ?? [];
	const merged = /* @__PURE__ */ new Map();
	for (const record of records) {
		const replaced = merged.get(record.skill.name);
		if (replaced && canonicalizePath(record.skill.filePath) !== canonicalizePath(replaced.skill.filePath)) discoveredCollisions.push({
			winner: record.skill,
			loser: replaced.skill
		});
		merged.set(record.skill.name, record);
	}
	if (!collisions) reportSkillPrecedenceCollisions(discoveredCollisions, sourceKey);
	return [...merged.values()].toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en"));
}
/** Append lower-precedence names without changing the order of either tier. */
function appendLowerPrecedenceSkillRecords(entries, lower, onCollision) {
	if (lower.length === 0) return;
	const winners = new Map(entries.map((entry) => [entry.skill.name, entry]));
	for (const entry of lower) {
		const winner = winners.get(entry.skill.name);
		if (winner) onCollision(winner, entry);
		else {
			winners.set(entry.skill.name, entry);
			entries.push(entry);
		}
	}
}
//#endregion
export { mergeSkillRecords as n, reportSkillPrecedenceCollisions as r, appendLowerPrecedenceSkillRecords as t };
