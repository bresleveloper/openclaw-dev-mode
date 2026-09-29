import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as captureAgentWorkspaceOutboundMedia } from "./workspace-access-BNUXOhfF.mjs";
import { l as resolveManagedMediaRoot } from "./sandbox-paths-BZ4BvxS2.mjs";
import { r as resolvePathFromInput } from "./path-policy-BUkUD6xH.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-CIWGcFBI.mjs";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-69NyFacf.mjs";
import { t as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DkN5in9o.mjs";
import { n as resolveWorkspaceRoot } from "./workspace-dir-D87-cXVl.mjs";
import { n as readOutboundMediaFile, t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { n as getAgentScopedMediaLocalRoots, r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-CfRBR4Iu.mjs";
import { a as readLocalMediaFile } from "./local-media-access-Cxmjo_Ju.mjs";
import path from "node:path";
//#region src/media/read-capability.ts
function isAgentScopedMediaReadAllowedByToolPolicy(params) {
	const groupPolicy = resolveGroupToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.accountId,
		senderId: params.requesterSenderId,
		senderName: params.requesterSenderName,
		senderUsername: params.requesterSenderUsername,
		senderE164: params.requesterSenderE164
	});
	const senderPolicy = resolveSenderToolPolicy({
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		senderId: params.requesterSenderId,
		senderName: params.requesterSenderName,
		senderUsername: params.requesterSenderUsername,
		senderE164: params.requesterSenderE164
	});
	if (!isToolAllowedByPolicies("read", [groupPolicy, senderPolicy])) return false;
	return true;
}
/** Creates a host reader bound to the agent workspace and configured local-file safety checks. */
function createAgentScopedHostMediaReadFile(params) {
	if (!resolveEffectiveToolFsRootExpansionAllowed(params) || !isAgentScopedMediaReadAllowedByToolPolicy(params)) return;
	const inferredWorkspaceDir = params.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0);
	const workspaceRoot = resolveWorkspaceRoot(inferredWorkspaceDir);
	return createBoundedOutboundMediaReadFile(async (filePath, options) => {
		const resolvedPath = resolvePathFromInput(filePath, workspaceRoot);
		return await readLocalMediaFile(resolvedPath, params.localRoots, {
			maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER,
			excludedRoots: params.excludedLocalRoots
		});
	});
}
function getManagedMediaLocalRoots(mediaSources) {
	const roots = /* @__PURE__ */ new Set([path.join(resolveConfigDir(), "media", "outbound")]);
	for (const source of mediaSources ?? []) {
		const managedRoot = resolveManagedMediaRoot(source);
		if (managedRoot) roots.add(managedRoot);
	}
	return Array.from(roots);
}
function appendWorkspaceDirToLocalRoots(roots, workspaceDir) {
	if (!workspaceDir) return roots;
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	if (!roots?.length) return [resolvedWorkspaceDir];
	if (roots.some((root) => path.resolve(root) === resolvedWorkspaceDir)) return roots;
	return [...roots, resolvedWorkspaceDir];
}
function createWorkspaceAwareMediaReadFile(params) {
	const workspaceReadFile = params.workspaceMediaAccess?.readFile;
	const workspaceLocalRoots = params.workspaceMediaAccess?.localRoots ?? [];
	if (!workspaceReadFile || workspaceLocalRoots.length === 0) return params.hostReadFile;
	return createBoundedOutboundMediaReadFile(async (filePath, options) => {
		const resolvedPath = path.resolve(filePath);
		if (workspaceLocalRoots.some((root) => isPathInside(path.resolve(root), resolvedPath))) return await readOutboundMediaFile(workspaceReadFile, filePath, { maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER });
		if (params.hostReadFile) return await readOutboundMediaFile(params.hostReadFile, filePath, { maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER });
		return await readLocalMediaFile(filePath, params.localRoots, {
			maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER,
			excludedRoots: params.excludedLocalRoots
		});
	});
}
/** Resolves roots and optional host read capability for outbound media in an agent context. */
function resolveAgentScopedOutboundMediaAccess(params) {
	if (params.allowHostWorkspace === false) return { localRoots: getManagedMediaLocalRoots(params.mediaSources) };
	const resolvedWorkspaceDir = params.workspaceDir ?? params.mediaAccess?.workspaceDir ?? params.workspaceMediaAccess?.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0);
	const mediaReadAllowed = isAgentScopedMediaReadAllowedByToolPolicy(params);
	const registeredMedia = resolvedWorkspaceDir ? captureAgentWorkspaceOutboundMedia(resolvedWorkspaceDir) : void 0;
	const managedLocalRoots = getManagedMediaLocalRoots(params.mediaSources);
	const configuredHostLocalRoots = params.mediaAccess?.localRoots ?? (registeredMedia ? getAgentScopedMediaLocalRoots(params.cfg, params.agentId, params.sessionWorkspaceDir) : getAgentScopedMediaLocalRootsForSources({
		cfg: params.cfg,
		agentId: params.agentId,
		mediaSources: params.mediaSources,
		sessionWorkspaceDir: params.sessionWorkspaceDir,
		workspaceOnly: params.workspaceOnly
	}));
	const registeredRoots = registeredMedia && resolvedWorkspaceDir ? [path.resolve(resolvedWorkspaceDir), ...registeredMedia.localRoots] : [];
	const hostLocalRoots = registeredMedia ? configuredHostLocalRoots.filter((root) => !registeredRoots.some((remoteRoot) => isPathInside(remoteRoot, root))) : configuredHostLocalRoots;
	const workspaceLocalRoots = [...params.workspaceMediaAccess?.localRoots ?? [], ...registeredMedia?.localRoots ?? []];
	const baseLocalRoots = mediaReadAllowed ? workspaceLocalRoots.length > 0 ? Array.from(new Set([...hostLocalRoots, ...workspaceLocalRoots].map((root) => path.resolve(root)))) : hostLocalRoots : managedLocalRoots;
	const localRoots = mediaReadAllowed && !registeredMedia ? appendWorkspaceDirToLocalRoots(baseLocalRoots, resolvedWorkspaceDir) : baseLocalRoots;
	const hostReadFile = params.mediaAccess?.readFile ?? params.mediaReadFile ?? createAgentScopedHostMediaReadFile({
		cfg: params.cfg,
		agentId: params.agentId,
		localRoots: localRoots ?? [],
		workspaceDir: resolvedWorkspaceDir,
		excludedLocalRoots: registeredRoots,
		workspaceOnly: params.workspaceOnly,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.accountId,
		requesterSenderId: params.requesterSenderId,
		requesterSenderName: params.requesterSenderName,
		requesterSenderUsername: params.requesterSenderUsername,
		requesterSenderE164: params.requesterSenderE164
	});
	const registeredReadFile = mediaReadAllowed && registeredMedia ? createWorkspaceAwareMediaReadFile({
		workspaceMediaAccess: {
			localRoots: registeredRoots,
			readFile: createBoundedOutboundMediaReadFile((filePath, options) => registeredMedia.readFile(filePath, options?.maxBytes ?? Number.MAX_SAFE_INTEGER))
		},
		hostReadFile,
		localRoots: localRoots ?? [],
		excludedLocalRoots: registeredRoots
	}) : hostReadFile;
	const readFile = mediaReadAllowed ? createWorkspaceAwareMediaReadFile({
		workspaceMediaAccess: params.workspaceMediaAccess,
		hostReadFile: registeredReadFile,
		localRoots: localRoots ?? [],
		excludedLocalRoots: registeredRoots
	}) : void 0;
	return {
		...localRoots?.length ? { localRoots } : {},
		...readFile ? { readFile } : {},
		...resolvedWorkspaceDir ? { workspaceDir: resolvedWorkspaceDir } : {}
	};
}
//#endregion
export { resolveAgentScopedOutboundMediaAccess as t };
