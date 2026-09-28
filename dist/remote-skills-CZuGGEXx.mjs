import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as createSyntheticSourceInfo } from "./source-info-CcFiWAof.mjs";
import { n as resolveSkillInvocationPolicy, t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { r as resolveNodeIdFromNodeList } from "./node-resolve-Cy3jnd18.mjs";
import { t as areOrderedArraysEqual } from "./ordered-array-equality-CBhMoHgO.mjs";
//#region src/skills/runtime/remote-skills.ts
const remoteSkillNodes = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("gateway/skills-remote");
let reconcileRemoteSkillConnections = null;
let prepareRemoteSkillConnectionsOwner;
function remoteConnectionKey(nodeId, connId) {
	return `${nodeId}\0${connId}`;
}
/** Installs the gateway-owned persistent-generation reconciliation boundary. */
function setRemoteSkillConnectionReconciler(reconcile, prepare) {
	reconcileRemoteSkillConnections = reconcile;
	prepareRemoteSkillConnectionsOwner = prepare;
}
/** Acquire persistent pairing facts before synchronous remote skill projections. */
async function prepareRemoteSkillConnections() {
	await prepareRemoteSkillConnectionsOwner?.();
}
function prepareNodeSkills(nodeId, skills) {
	const prepared = [];
	for (const skill of skills) try {
		const frontmatter = parseSkillFrontmatter(skill.content);
		if (frontmatter.name?.trim() !== skill.name || frontmatter.description?.trim() !== skill.description) {
			log.warn(`dropped node skill with mismatched frontmatter: ${nodeId}/${skill.name}`);
			continue;
		}
		prepared.push({
			...skill,
			frontmatter,
			contentHash: sha256Hex(skill.content)
		});
	} catch (error) {
		const filePath = `node://${encodeURIComponent(nodeId)}/skills/${skill.name}/SKILL.md`;
		log.warn(`dropped node skill with invalid frontmatter (${filePath}): ${String(error)}`);
	}
	return prepared;
}
function recordRemoteSkillNodeInfo(node) {
	const existing = remoteSkillNodes.get(node.nodeId);
	const connectionChanged = Boolean(node.connId && existing?.connId !== node.connId);
	const displayChanged = existing?.displayName !== node.displayName;
	const canExec = node.commands?.includes("system.run") ?? existing?.canExec ?? false;
	const executionChanged = existing?.canExec !== canExec;
	remoteSkillNodes.set(node.nodeId, {
		nodeId: node.nodeId,
		connId: node.connId ?? existing?.connId,
		displayName: node.displayName,
		connected: true,
		canExec,
		skills: connectionChanged ? [] : existing?.skills ?? []
	});
	if ((connectionChanged || displayChanged || executionChanged) && (existing?.skills.length ?? 0) > 0) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function replaceRemoteNodeSkills(params) {
	const nextSkills = prepareNodeSkills(params.nodeId, params.skills);
	const existing = remoteSkillNodes.get(params.nodeId);
	const changed = !existing?.connected || existing.displayName !== params.displayName || !areOrderedArraysEqual(existing.skills, nextSkills, (previous, next) => previous.name === next.name && previous.description === next.description && previous.content === next.content);
	remoteSkillNodes.set(params.nodeId, {
		nodeId: params.nodeId,
		connId: existing?.connId,
		displayName: params.displayName ?? existing?.displayName,
		connected: true,
		canExec: existing?.canExec ?? false,
		skills: nextSkills
	});
	if (changed) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function removeRemoteNodeSkills(nodeId) {
	const existing = remoteSkillNodes.get(nodeId);
	remoteSkillNodes.delete(nodeId);
	if (existing?.skills.length) bumpSkillsSnapshotVersion({ reason: "remote-node" });
}
function sanitizeSkillNameFragment(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24).replace(/-+$/g, "") || "node";
}
function prefixedSkillName(params) {
	const prefix = `${sanitizeSkillNameFragment(params.nodeId)}-`;
	for (let index = 0; index < 100; index += 1) {
		const suffix = index === 0 ? "" : `-${index + 1}`;
		const availableBaseLength = Math.max(1, 64 - prefix.length - suffix.length);
		const candidate = `${prefix}${params.baseName.slice(0, availableBaseLength).replace(/-+$/g, "") || "skill"}${suffix}`;
		if (!params.usedNames.has(candidate)) return candidate;
	}
	return null;
}
function remoteSkillLocation(nodeId, name) {
	return `node://${encodeURIComponent(nodeId)}/skills/${name}/SKILL.md`;
}
function locatorNote(node, skillName) {
	const label = node.displayName?.trim() || node.nodeId;
	const cwd = remoteSkillLocation(node.nodeId, skillName).slice(0, -9);
	return `Node-hosted on ${label} (${node.nodeId}). Read this SKILL.md with the normal read tool at its exact node:// location; do not use file_fetch, which only accepts approved absolute node paths. If read is unavailable, use exec host=node node=${node.nodeId} with workdir=${cwd} to run cat SKILL.md. Run referenced files and bins with the same exec target and workdir; the node host resolves that locator to the node-local skill directory.`;
}
function mergeRemoteNodeSkillEntries(localEntries, options) {
	if (options?.canExec !== true) return [...localEntries];
	const currentConnections = reconcileRemoteSkillConnections?.();
	const connectedNodes = [...remoteSkillNodes.values()].filter((node) => node.connected && node.canExec && (!currentConnections || node.connId !== void 0 && currentConnections.has(remoteConnectionKey(node.nodeId, node.connId))));
	let boundNodeId;
	if (options.node) try {
		boundNodeId = resolveNodeIdFromNodeList(connectedNodes, options.node);
	} catch {
		return [...localEntries];
	}
	const remote = connectedNodes.filter((node) => !boundNodeId || node.nodeId === boundNodeId).flatMap((node) => node.skills.map((skill) => ({
		node,
		skill
	}))).toSorted((left, right) => left.skill.name.localeCompare(right.skill.name, "en") || left.node.nodeId.localeCompare(right.node.nodeId, "en"));
	if (remote.length === 0) return [...localEntries];
	const remoteNameCounts = /* @__PURE__ */ new Map();
	for (const { skill } of remote) remoteNameCounts.set(skill.name, (remoteNameCounts.get(skill.name) ?? 0) + 1);
	const localNames = new Set(localEntries.map((entry) => entry.skill.name));
	const usedNames = new Set(localNames);
	const remoteEntries = [];
	for (const { node, skill } of remote) {
		const exposedName = usedNames.has(skill.name) || (remoteNameCounts.get(skill.name) ?? 0) > 1 ? prefixedSkillName({
			nodeId: node.nodeId,
			baseName: skill.name,
			usedNames
		}) : skill.name;
		if (!exposedName || usedNames.has(exposedName)) {
			log.warn(`dropped node skill with unresolved name collision: ${node.nodeId}/${skill.name}`);
			continue;
		}
		usedNames.add(exposedName);
		const filePath = remoteSkillLocation(node.nodeId, skill.name);
		const invocation = resolveSkillInvocationPolicy(skill.frontmatter);
		remoteEntries.push({
			skill: {
				name: exposedName,
				description: skill.description,
				locationNote: locatorNote(node, skill.name),
				readContent: skill.content,
				contentHash: skill.contentHash,
				filePath,
				baseDir: filePath.slice(0, -9),
				source: "openclaw-node",
				sourceInfo: createSyntheticSourceInfo(filePath, {
					source: "openclaw-node",
					scope: "temporary",
					origin: "top-level",
					baseDir: filePath.slice(0, -9)
				}),
				disableModelInvocation: invocation.disableModelInvocation
			},
			frontmatter: skill.frontmatter,
			invocation,
			disableCommandDispatch: true,
			exposure: {
				includeInRuntimeRegistry: true,
				includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
				userInvocable: invocation.userInvocable
			}
		});
	}
	return [...localEntries, ...remoteEntries].toSorted((left, right) => left.skill.name.localeCompare(right.skill.name, "en"));
}
function resetRemoteNodeSkillsForTests() {
	remoteSkillNodes.clear();
	reconcileRemoteSkillConnections = null;
	prepareRemoteSkillConnectionsOwner = void 0;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.remoteNodeSkillsTestApi")] = { resetRemoteNodeSkillsForTests };
//#endregion
export { replaceRemoteNodeSkills as a, removeRemoteNodeSkills as i, prepareRemoteSkillConnections as n, setRemoteSkillConnectionReconciler as o, recordRemoteSkillNodeInfo as r, mergeRemoteNodeSkillEntries as t };
