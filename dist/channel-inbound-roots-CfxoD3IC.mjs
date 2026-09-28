import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { n as getCurrentPluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { t as MissingPublicSurfaceError } from "./facade-loader-BWw5NpKt.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync, r as loadPluginPublicArtifactModuleSync } from "./public-surface-loader-CNXp9Fm5.mjs";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-D9DuiaNx.mjs";
//#region src/media/channel-inbound-roots.ts
const CHANNEL_MEDIA_CONTRACT_ARTIFACT = "media-contract-api.js";
function acceptsResolver(loaded, resolver) {
	return typeof loaded[resolver] === "function";
}
function loadBundledChannelMediaContractApi(channelId, resolver) {
	try {
		const loaded = loadBundledPluginPublicArtifactModuleSync({
			dirName: channelId,
			artifactBasename: CHANNEL_MEDIA_CONTRACT_ARTIFACT
		});
		return acceptsResolver(loaded, resolver) ? loaded : void 0;
	} catch (error) {
		if (!(error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface "))) throw error;
	}
}
function declaresChannel(plugin, channelId) {
	return plugin.channels.some((ownedChannelId) => normalizeOptionalLowercaseString(ownedChannelId) === channelId);
}
/**
* Lists installed official channel plugins that may own a channel's media contract.
*
* Bundled owners are resolved from the bundled plugin surface; workspace and
* community installs never gain attachment-root authority, so only
* host-verified official npm installs qualify. Current operator policy still
* wins over install provenance: denylisted, explicitly disabled, and
* out-of-allowlist plugins lose attachment-root authority before their artifact
* executes or supplies file-access roots.
*/
function listTrustedInstalledChannelMediaContractOwners(params) {
	const channelId = normalizeOptionalLowercaseString(params.channelId);
	if (!channelId) return [];
	const normalizedConfig = normalizePluginsConfig(params.cfg.plugins);
	return params.plugins.filter((plugin) => plugin.origin === "global" && plugin.trustedOfficialInstall === true && declaresChannel(plugin, channelId) && resolveManifestOwnerBasePolicyBlock({
		plugin,
		normalizedConfig
	}) === null).map((plugin) => ({
		id: plugin.id,
		rootDir: plugin.rootDir
	})).toSorted((left, right) => left.id.localeCompare(right.id));
}
function resolveInstalledChannelMediaContractOwners(params) {
	try {
		const snapshot = getCurrentPluginMetadataSnapshotRuntime({
			config: params.cfg,
			allowScopedSnapshot: true,
			allowWorkspaceScopedSnapshot: true
		});
		if (!snapshot) return [];
		return listTrustedInstalledChannelMediaContractOwners({
			channelId: params.channelId,
			cfg: params.cfg,
			plugins: snapshot.manifestRegistry.plugins
		});
	} catch {
		return [];
	}
}
function loadInstalledChannelMediaContractApi(params) {
	for (const owner of resolveInstalledChannelMediaContractOwners({
		channelId: params.channelId,
		cfg: params.cfg
	})) try {
		const loaded = loadPluginPublicArtifactModuleSync({
			pluginRoot: owner.rootDir,
			artifactBasename: CHANNEL_MEDIA_CONTRACT_ARTIFACT,
			origin: "global"
		});
		if (acceptsResolver(loaded, params.resolver)) return loaded;
	} catch (error) {
		if (error instanceof MissingPublicSurfaceError) continue;
		throw error;
	}
}
function loadChannelMediaContractApi(params) {
	return loadBundledChannelMediaContractApi(params.channelId, params.resolver) ?? loadInstalledChannelMediaContractApi(params);
}
function findChannelMediaContractApi(params) {
	const normalized = normalizeOptionalLowercaseString(params.channelId);
	if (!normalized) return;
	return loadChannelMediaContractApi({
		channelId: normalized,
		cfg: params.cfg,
		resolver: params.resolver
	});
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
	const contractApi = findChannelMediaContractApi({
		channelId: params.channelId,
		cfg: params.cfg,
		resolver: "resolveInboundAttachmentRoots"
	});
	if (contractApi?.resolveInboundAttachmentRoots) return contractApi.resolveInboundAttachmentRoots({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0
	});
}
/** Resolves remote staging roots for inbound channel attachments without loading full channel code. */
function resolveChannelRemoteInboundAttachmentRoots(params) {
	const contractApi = findChannelMediaContractApi({
		channelId: params.ctx.Surface ?? params.ctx.Provider,
		cfg: params.cfg,
		resolver: "resolveRemoteInboundAttachmentRoots"
	});
	if (contractApi?.resolveRemoteInboundAttachmentRoots) return contractApi.resolveRemoteInboundAttachmentRoots({
		cfg: params.cfg,
		accountId: params.ctx.AccountId
	});
}
//#endregion
export { resolveChannelInboundAttachmentRootsForChannel as n, resolveChannelRemoteInboundAttachmentRoots as r, resolveChannelInboundAttachmentRoots as t };
