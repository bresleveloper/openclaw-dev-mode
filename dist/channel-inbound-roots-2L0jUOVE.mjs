import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as getCurrentPluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { t as MissingPublicSurfaceError } from "./facade-loader-B-X-HqBc.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync, r as loadPluginPublicArtifactModuleSync } from "./public-surface-loader-BzW1QYAL.mjs";
//#region src/media/channel-inbound-roots.ts
const CHANNEL_MEDIA_CONTRACT_ARTIFACT = "media-contract-api.js";
function resolveInstalledChannelMediaContractOwners(params) {
	try {
		const snapshot = getCurrentPluginMetadataSnapshotRuntime({
			config: params.cfg,
			allowScopedSnapshot: true,
			allowWorkspaceScopedSnapshot: true
		});
		const normalizedConfig = normalizePluginsConfig(params.cfg.plugins);
		return (snapshot?.manifestRegistry.plugins ?? []).filter((plugin) => plugin.origin === "global" && plugin.trustedOfficialInstall === true && plugin.channels.some((channel) => normalizeOptionalLowercaseString(channel) === params.channelId) && resolveManifestOwnerBasePolicyBlock({
			plugin,
			normalizedConfig
		}) === null).toSorted((left, right) => left.id.localeCompare(right.id));
	} catch {
		return [];
	}
}
function findChannelMediaContractApi(params) {
	const channelId = normalizeOptionalLowercaseString(params.channelId);
	if (!channelId) return;
	try {
		const loaded = loadBundledPluginPublicArtifactModuleSync({
			dirName: channelId,
			artifactBasename: CHANNEL_MEDIA_CONTRACT_ARTIFACT
		});
		if (typeof loaded[params.resolver] === "function") return loaded;
	} catch (error) {
		if (!(error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface "))) throw error;
	}
	for (const owner of resolveInstalledChannelMediaContractOwners({
		channelId,
		cfg: params.cfg
	})) try {
		const loaded = loadPluginPublicArtifactModuleSync({
			pluginRoot: owner.rootDir,
			artifactBasename: CHANNEL_MEDIA_CONTRACT_ARTIFACT,
			origin: "global"
		});
		if (typeof loaded[params.resolver] === "function") return loaded;
	} catch (error) {
		if (!(error instanceof MissingPublicSurfaceError)) throw error;
	}
}
/** Resolves local inbound attachment roots from the channel named in a message context. */
function resolveChannelInboundAttachmentRoots(params) {
	return resolveChannelInboundAttachmentRootsForChannel({
		cfg: params.cfg,
		channelId: params.ctx.Surface ?? params.ctx.Provider,
		accountId: params.ctx.AccountId
	});
}
/** Resolves local inbound attachment roots for callers that already know the channel id. */
function resolveChannelInboundAttachmentRootsForChannel(params) {
	return findChannelMediaContractApi({
		channelId: params.channelId,
		cfg: params.cfg,
		resolver: "resolveInboundAttachmentRoots"
	})?.resolveInboundAttachmentRoots?.({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0
	});
}
/** Resolves remote staging roots for inbound channel attachments without loading full channel code. */
function resolveChannelRemoteInboundAttachmentRoots(params) {
	return findChannelMediaContractApi({
		channelId: params.ctx.Surface ?? params.ctx.Provider,
		cfg: params.cfg,
		resolver: "resolveRemoteInboundAttachmentRoots"
	})?.resolveRemoteInboundAttachmentRoots?.({
		cfg: params.cfg,
		accountId: params.ctx.AccountId
	});
}
//#endregion
export { resolveChannelInboundAttachmentRootsForChannel as n, resolveChannelRemoteInboundAttachmentRoots as r, resolveChannelInboundAttachmentRoots as t };
