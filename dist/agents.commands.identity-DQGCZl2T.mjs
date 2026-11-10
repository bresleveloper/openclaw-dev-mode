import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as applyImplicitAgentRosterDefaults } from "./implicit-agent-roster-D39ONJLa.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { a as loadAgentIdentityFromWorkspaceAsync, r as loadAgentIdentityFromFile } from "./identity-file-BFsBDRA6.mjs";
import { t as applyAgentConfig } from "./agents.config-B7znCYIL.mjs";
import "./workspace-3xrXOvoY.mjs";
import { u as throwExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CHn1iJgM.mjs";
import path from "node:path";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
	const list = listAgentEntries(cfg);
	const ids = list.length > 0 ? list.map((entry) => normalizeAgentId(entry.id)) : [resolveDefaultAgentId(cfg)];
	const normalizedTarget = normalizeWorkspacePath(workspaceDir);
	return ids.filter((id) => normalizeWorkspacePath(resolveAgentWorkspaceDir(cfg, id)) === normalizedTarget);
}
async function agentsSetIdentityCommand(opts, runtime = defaultRuntime) {
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = applyImplicitAgentRosterDefaults(writeSnapshot.snapshot.sourceConfig);
	const nameRaw = normalizeOptionalString(opts.name);
	const emojiRaw = normalizeOptionalString(opts.emoji);
	const themeRaw = normalizeOptionalString(opts.theme);
	const avatarRaw = normalizeOptionalString(opts.avatar);
	const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
	const identityFileRaw = normalizeOptionalString(opts.identityFile);
	const workspaceRaw = normalizeOptionalString(opts.workspace);
	if (opts.identityFile !== void 0 && !identityFileRaw) throwExpectedCliError("--identity-file must not be blank");
	if (opts.workspace !== void 0 && !workspaceRaw) throwExpectedCliError("--workspace must not be blank");
	const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
	const normalizedAgent = opts.agent === void 0 ? null : normalizeAgentIdStrict(opts.agent);
	if (normalizedAgent && !normalizedAgent.ok) throwExpectedCliError(`Agent "${opts.agent}" not found. Create it with \`openclaw agents add\`.`);
	let agentId = normalizedAgent?.value;
	let identityFilePath;
	let workspaceDir;
	let workspaceLocatorDir;
	if (identityFileRaw) {
		identityFilePath = normalizeWorkspacePath(identityFileRaw);
		workspaceDir = path.dirname(identityFilePath);
	} else if (workspaceRaw) {
		workspaceLocatorDir = normalizeWorkspacePath(workspaceRaw);
		workspaceDir = workspaceLocatorDir;
	} else if (agentId && wantsIdentityFile) workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	else if (wantsIdentityFile || !agentId) workspaceDir = path.resolve(process.cwd());
	if (!agentId) {
		const resolvedWorkspace = expectDefined(workspaceDir, "agent workspace");
		const matches = resolveAgentIdByWorkspace(cfg, resolvedWorkspace);
		if (matches.length === 0) throwExpectedCliError(`No agent workspace matches ${shortenHomePath(resolvedWorkspace)}. Pass --agent to target a specific agent.`);
		if (matches.length > 1) throwExpectedCliError(`Multiple agents match ${shortenHomePath(resolvedWorkspace)}: ${matches.join(", ")}. Pass --agent to choose one.`);
		agentId = matches[0];
	}
	const resolvedAgentId = expectDefined(agentId, "agent id");
	if (!listAgentIds(cfg).map((id) => normalizeAgentId(id)).includes(resolvedAgentId)) throwExpectedCliError(`Agent "${resolvedAgentId}" not found. Create it with \`openclaw agents add\`.`);
	let identityFromFile = null;
	if (wantsIdentityFile) {
		if (identityFilePath) try {
			identityFromFile = await loadAgentIdentityFromFile(identityFilePath);
		} catch (error) {
			throwExpectedCliError(formatErrorMessage(error));
		}
		else if (workspaceDir) identityFromFile = await loadAgentIdentityFromWorkspaceAsync(workspaceDir);
		if (!identityFromFile) {
			const targetPath = identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md");
			throwExpectedCliError(`No identity data found in ${shortenHomePath(targetPath)}.`);
		}
	}
	const fileTheme = identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
	const incomingIdentity = {
		...nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {},
		...emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {},
		...themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {},
		...avatarRaw || identityFromFile?.avatar ? { avatar: avatarRaw ?? identityFromFile?.avatar } : {}
	};
	const nextConfig = applyAgentConfig(cfg, {
		agentId: resolvedAgentId,
		identity: incomingIdentity
	});
	const committed = await replaceConfigFile({
		...writeSnapshot,
		sourceConfig: nextConfig,
		writeOptions: {
			...writeSnapshot.writeOptions,
			allowConfigSizeDrop: true
		}
	});
	const committedEntry = expectDefined(listAgentEntries(committed.nextConfig).find((entry) => normalizeAgentId(entry.id) === resolvedAgentId), "committed agent config");
	const committedIdentity = expectDefined(committedEntry.identity, "committed agent identity");
	const storedWorkspaceDir = resolveAgentWorkspaceDir(committed.nextConfig, resolvedAgentId);
	const identitySourceDir = identityFromFile ? workspaceDir : void 0;
	const locatorDiffers = workspaceLocatorDir !== void 0 && normalizeWorkspacePath(workspaceLocatorDir) !== normalizeWorkspacePath(storedWorkspaceDir);
	const identitySourceDiffers = identitySourceDir !== void 0 && normalizeWorkspacePath(identitySourceDir) !== normalizeWorkspacePath(storedWorkspaceDir);
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId: resolvedAgentId,
			identity: committedIdentity,
			workspace: workspaceDir ?? null,
			storedWorkspace: storedWorkspaceDir,
			identityFile: identityFilePath ?? null
		});
		return;
	}
	logConfigUpdated(runtime);
	runtime.log(`Agent: ${sanitizeTerminalText(resolvedAgentId)}`);
	for (const [field, label] of [
		["name", "Name"],
		["theme", "Theme"],
		["emoji", "Emoji"],
		["avatar", "Avatar"]
	]) {
		const value = committedIdentity[field];
		if (value) runtime.log(`${label}: ${sanitizeTerminalText(value)}`);
	}
	runtime.log(`Workspace: ${sanitizeTerminalText(shortenHomePath(storedWorkspaceDir))}`);
	if (locatorDiffers && workspaceLocatorDir) {
		runtime.log(`Workspace locator: ${sanitizeTerminalText(shortenHomePath(workspaceLocatorDir))}`);
		runtime.log(`Stored workspace unchanged. Relocate with ${formatCliCommand(`openclaw config set agents.entries.${resolvedAgentId}.workspace ${quoteCliArg(workspaceLocatorDir)}`)}.`);
	} else if (identitySourceDiffers && identitySourceDir) runtime.log(`Identity source: ${sanitizeTerminalText(shortenHomePath(identitySourceDir))}`);
}
//#endregion
export { agentsSetIdentityCommand };
