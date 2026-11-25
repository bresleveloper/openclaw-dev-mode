import { t as getMatrixRuntime } from "./runtime-Ck8TjD7L.mjs";
import { d as syncMatrixOwnProfile, p as updateMatrixAccountConfig } from "./setup-core-BRD4PRVa.mjs";
import { n as resolveMatrixConfigPath } from "./config-paths-DBpHxDyc.mjs";
import { l as resolveMatrixAuthContext } from "./client-BVgnwwz0.mjs";
import { n as withResolvedActionClient } from "./client-BgOKS4W7.mjs";
import { buildOutboundMediaLoadOptions } from "openclaw/plugin-sdk/media-runtime";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
// extensions/matrix/src/matrix/actions/profile.ts
async function updateMatrixOwnProfile(opts = {}) {
	const runtime = getMatrixRuntime();
	return await withResolvedActionClient(opts, async (client) => {
		const userId = await client.getUserId();
		return await syncMatrixOwnProfile({
			client,
			userId,
			displayName: opts.displayName,
			avatarUrl: opts.avatarUrl,
			avatarPath: opts.avatarPath,
			loadAvatarFromUrl: async (url, maxBytes) => await runtime.media.loadWebMedia(url, buildOutboundMediaLoadOptions({
				maxBytes,
				mediaAccess: resolveOutboundMediaAccessForConfig(opts.cfg)
			})),
			loadAvatarFromPath: async (path, maxBytes) => await runtime.media.loadWebMedia(path, {
				maxBytes,
				localRoots: opts.mediaLocalRoots
			})
		});
	});
}
// extensions/matrix/src/profile-update.ts
async function applyMatrixProfileUpdate(params) {
	const runtime = getMatrixRuntime();
	const persistedCfg = runtime.config.current();
	const cfg = params.cfg ?? persistedCfg;
	const displayName = params.displayName?.trim() || null;
	const avatarUrl = params.avatarUrl?.trim() || null;
	const avatarPath = params.avatarPath?.trim() || null;
	if (!displayName && !avatarUrl && !avatarPath) throw new Error("Provide name/displayName and/or avatarUrl/avatarPath.");
	const accountId = resolveMatrixAuthContext({
		cfg,
		accountId: params.account
	}).accountId;
	const synced = await updateMatrixOwnProfile({
		cfg,
		accountId,
		displayName: displayName ?? void 0,
		avatarUrl: avatarUrl ?? void 0,
		avatarPath: avatarPath ?? void 0,
		mediaLocalRoots: params.mediaLocalRoots
	});
	const persistedAvatarUrl = synced.uploadedAvatarSource && synced.resolvedAvatarUrl ? synced.resolvedAvatarUrl : avatarUrl;
	const updated = updateMatrixAccountConfig(persistedCfg, accountId, {
		name: displayName ?? void 0,
		avatarUrl: persistedAvatarUrl ?? void 0
	});
	await runtime.config.replaceConfigFile({
		nextConfig: updated,
		afterWrite: { mode: "auto" }
	});
	return {
		accountId,
		displayName,
		avatarUrl: persistedAvatarUrl ?? null,
		profile: synced,
		configPath: resolveMatrixConfigPath(updated, accountId)
	};
}
export { updateMatrixOwnProfile as n, applyMatrixProfileUpdate as t };
