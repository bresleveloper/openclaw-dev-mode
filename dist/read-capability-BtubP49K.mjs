import { _ as resolveConfigDir } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { n as captureAgentWorkspaceOutboundMedia } from "./workspace-access-CeRsYrid.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-Ni4Rljqy.mjs";
import { l as resolveManagedMediaRoot } from "./sandbox-paths-Br7HP2l8.mjs";
import { r as resolvePathFromInput } from "./path-policy-CDc3034l.mjs";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-Ck68dqxT.mjs";
import { t as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as resolveWorkspaceRoot } from "./workspace-dir-CevXWOdg.mjs";
import { n as readOutboundMediaFile, t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { n as getAgentScopedMediaLocalRoots, r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-D6JiS64U.mjs";
import { a as readLocalMediaFile, i as openLocalMediaFile } from "./local-media-access-BBHmTniP.mjs";
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
	return isToolAllowedByPolicies("read", [groupPolicy, senderPolicy]);
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
		const readFile = workspaceOwnsMediaPath(params.workspaceMediaAccess, filePath) ? workspaceReadFile : params.hostReadFile;
		const maxBytes = options?.maxBytes ?? Number.MAX_SAFE_INTEGER;
		if (readFile) return await readOutboundMediaFile(readFile, filePath, { maxBytes });
		return await readLocalMediaFile(filePath, params.localRoots, {
			maxBytes,
			excludedRoots: params.excludedLocalRoots
		});
	});
}
function workspaceOwnsMediaPath(access, filePath) {
	return access?.readFile && access.localRoots?.some((root) => isPathInside(path.resolve(root), path.resolve(filePath)));
}
/** Resolves roots and optional host read capability for outbound media in an agent context. */
function resolveAgentScopedOutboundMediaAccess(params) {
	return resolveAgentScopedMediaAccess(params, false);
}
/** Adds a bounded native opener for host-owned media staging. */
function resolveAgentScopedHostOutboundMediaAccess(params) {
	return resolveAgentScopedMediaAccess(params, true);
}
function resolveAgentScopedMediaAccess(params, includeHostOpener) {
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
	let hostReadFile = params.mediaAccess?.readFile ?? params.mediaReadFile;
	if (!hostReadFile && mediaReadAllowed && resolveEffectiveToolFsRootExpansionAllowed(params)) {
		const workspaceRoot = resolveWorkspaceRoot(resolvedWorkspaceDir);
		hostReadFile = createBoundedOutboundMediaReadFile(async (filePath, options) => {
			const resolvedPath = resolvePathFromInput(filePath, workspaceRoot);
			return await readLocalMediaFile(resolvedPath, localRoots ?? [], {
				maxBytes: options?.maxBytes ?? Number.MAX_SAFE_INTEGER,
				excludedRoots: registeredRoots
			});
		});
	}
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
	const mediaAccess = {
		...localRoots?.length ? { localRoots } : {},
		...readFile ? { readFile } : {},
		...resolvedWorkspaceDir ? { workspaceDir: resolvedWorkspaceDir } : {}
	};
	if (!includeHostOpener) return mediaAccess;
	const openFile = async (filePath, options) => {
		if (mediaReadAllowed && (workspaceOwnsMediaPath(params.workspaceMediaAccess, filePath) || params.mediaAccess?.readFile || params.mediaReadFile) || registeredMedia && registeredRoots.some((root) => isPathInside(root, path.resolve(filePath)))) return;
		return await openLocalMediaFile(filePath, localRoots ?? [], {
			...options,
			excludedRoots: registeredRoots
		});
	};
	return {
		...mediaAccess,
		openFile
	};
}
//#endregion
export { resolveAgentScopedOutboundMediaAccess as n, resolveAgentScopedHostOutboundMediaAccess as t };
