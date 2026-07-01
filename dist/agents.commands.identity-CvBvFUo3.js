import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as shortenHomePath, m as resolveUserPath } from "./utils-BApvfmPs.js";
import { n as defaultRuntime, r as writeRuntimeJson } from "./runtime-B4lgFmsS.js";
import "./agent-scope-CDZXADgT.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, t as listAgentEntries } from "./agent-scope-config-C3ijpoNo.js";
import { r as replaceConfigFile } from "./config-A41fTHlt.js";
import "./workspace-DP5mE--D.js";
import { r as logConfigUpdated } from "./logging-CFK-HBYM.js";
import { i as parseIdentityMarkdown, t as identityHasValues } from "./identity-file-fW0d06Xi.js";
import { r as requireValidConfigFileSnapshot } from "./agents.command-shared-QRcGLACK.js";
import { i as loadAgentIdentity, r as findAgentEntryIndex } from "./agents.config-tI856xRH.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
async function loadIdentityFromFile(filePath) {
	try {
		const parsed = parseIdentityMarkdown(await fs.readFile(filePath, "utf-8"));
		if (!identityHasValues(parsed)) return null;
		return parsed;
	} catch {
		return null;
	}
}
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
	const list = listAgentEntries(cfg);
	const ids = list.length > 0 ? list.map((entry) => normalizeAgentId(entry.id)) : [resolveDefaultAgentId(cfg)];
	const normalizedTarget = normalizeWorkspacePath(workspaceDir);
	return ids.filter((id) => normalizeWorkspacePath(resolveAgentWorkspaceDir(cfg, id)) === normalizedTarget);
}
/** Update an agent identity from flags or workspace identity markdown. */
async function agentsSetIdentityCommand(opts, runtime = defaultRuntime) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
	const baseHash = configSnapshot.hash;
	const agentRaw = normalizeOptionalString(opts.agent);
	const nameRaw = normalizeOptionalString(opts.name);
	const emojiRaw = normalizeOptionalString(opts.emoji);
	const themeRaw = normalizeOptionalString(opts.theme);
	const avatarRaw = normalizeOptionalString(opts.avatar);
	const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
	const identityFileRaw = normalizeOptionalString(opts.identityFile);
	const workspaceRaw = normalizeOptionalString(opts.workspace);
	const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
	let identityFilePath;
	let workspaceDir;
	if (identityFileRaw) {
		identityFilePath = normalizeWorkspacePath(identityFileRaw);
		workspaceDir = path.dirname(identityFilePath);
	} else if (workspaceRaw) workspaceDir = normalizeWorkspacePath(workspaceRaw);
	else if (wantsIdentityFile || !agentRaw) workspaceDir = path.resolve(process.cwd());
	let agentId = agentRaw ? normalizeAgentId(agentRaw) : void 0;
	if (!agentId) {
		if (!workspaceDir) {
			runtime.error("Select an agent with --agent or provide a workspace via --workspace.");
			runtime.exit(1);
			return;
		}
		const matches = resolveAgentIdByWorkspace(cfg, workspaceDir);
		if (matches.length === 0) {
			runtime.error(`No agent workspace matches ${shortenHomePath(workspaceDir)}. Pass --agent to target a specific agent.`);
			runtime.exit(1);
			return;
		}
		if (matches.length > 1) {
			runtime.error(`Multiple agents match ${shortenHomePath(workspaceDir)}: ${matches.join(", ")}. Pass --agent to choose one.`);
			runtime.exit(1);
			return;
		}
		agentId = matches[0];
	}
	let identityFromFile = null;
	if (wantsIdentityFile) {
		if (identityFilePath) identityFromFile = await loadIdentityFromFile(identityFilePath);
		else if (workspaceDir) identityFromFile = loadAgentIdentity(workspaceDir);
		if (!identityFromFile) {
			const targetPath = identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md");
			runtime.error(`No identity data found in ${shortenHomePath(targetPath)}.`);
			runtime.exit(1);
			return;
		}
	}
	const fileTheme = identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
	const incomingIdentity = {
		...nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {},
		...emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {},
		...themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {},
		...avatarRaw || identityFromFile?.avatar ? { avatar: avatarRaw ?? identityFromFile?.avatar } : {}
	};
	if (!incomingIdentity.name && !incomingIdentity.emoji && !incomingIdentity.theme && !incomingIdentity.avatar) {
		runtime.error("No identity fields provided. Use --name/--emoji/--theme/--avatar or --from-identity.");
		runtime.exit(1);
		return;
	}
	const list = listAgentEntries(cfg);
	const index = findAgentEntryIndex(list, agentId);
	const base = index >= 0 ? list[index] : { id: agentId };
	const nextIdentity = {
		...base.identity,
		...incomingIdentity
	};
	const nextEntry = {
		...base,
		identity: nextIdentity
	};
	const nextList = [...list];
	if (index >= 0) nextList[index] = nextEntry;
	else {
		const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
		if (nextList.length === 0 && agentId !== defaultId) nextList.push({ id: defaultId });
		nextList.push(nextEntry);
	}
	await replaceConfigFile({
		nextConfig: {
			...cfg,
			agents: {
				...cfg.agents,
				list: nextList
			}
		},
		...baseHash !== void 0 ? { baseHash } : {}
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			identity: nextIdentity,
			workspace: workspaceDir ?? null,
			identityFile: identityFilePath ?? null
		});
		return;
	}
	logConfigUpdated(runtime);
	runtime.log(`Agent: ${agentId}`);
	if (nextIdentity.name) runtime.log(`Name: ${nextIdentity.name}`);
	if (nextIdentity.theme) runtime.log(`Theme: ${nextIdentity.theme}`);
	if (nextIdentity.emoji) runtime.log(`Emoji: ${nextIdentity.emoji}`);
	if (nextIdentity.avatar) runtime.log(`Avatar: ${nextIdentity.avatar}`);
	if (workspaceDir) runtime.log(`Workspace: ${shortenHomePath(workspaceDir)}`);
}
//#endregion
export { agentsSetIdentityCommand };
