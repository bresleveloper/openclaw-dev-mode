import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { n as resolveMatrixConfigPath } from "./config-paths-CnREYb1Y.mjs";
import { n as updateMatrixAccountConfig } from "./config-update-CZndPxNd.mjs";
import { r as syncMatrixOwnProfile } from "./profile-DS0xdJAi.mjs";
import { n as withResolvedActionClient } from "./client-DY3HExqI.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/matrix/actions/profile.ts
async function updateMatrixOwnProfile(opts = {}) {
	const displayName = opts.displayName?.trim();
	const avatarUrl = opts.avatarUrl?.trim();
	const avatarPath = opts.avatarPath?.trim();
	const runtime = getMatrixRuntime();
	return await withResolvedActionClient(opts, async (client) => {
		const userId = await client.getUserId();
		return await syncMatrixOwnProfile({
			client,
			userId,
			displayName: displayName || void 0,
			avatarUrl: avatarUrl || void 0,
			avatarPath: avatarPath || void 0,
			loadAvatarFromUrl: async (url, maxBytes) => await runtime.media.loadWebMedia(url, maxBytes),
			loadAvatarFromPath: async (path, maxBytes) => await runtime.media.loadWebMedia(path, {
				maxBytes,
				localRoots: opts.mediaLocalRoots
			})
		});
	}, "persist");
}
//#endregion
//#region extensions/matrix/src/profile-update.ts
async function applyMatrixProfileUpdate(params) {
	const runtime = getMatrixRuntime();
	const persistedCfg = runtime.config.current();
	const accountId = normalizeAccountId(params.account);
	const displayName = params.displayName?.trim() || null;
	const avatarUrl = params.avatarUrl?.trim() || null;
	const avatarPath = params.avatarPath?.trim() || null;
	if (!displayName && !avatarUrl && !avatarPath) throw new Error("Provide name/displayName and/or avatarUrl/avatarPath.");
	const synced = await updateMatrixOwnProfile({
		cfg: params.cfg ?? persistedCfg,
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
	const { skipped: _skipped, ...profile } = synced;
	return {
		accountId,
		displayName,
		avatarUrl: persistedAvatarUrl ?? null,
		profile,
		configPath: resolveMatrixConfigPath(updated, accountId)
	};
}
//#endregion
export { updateMatrixOwnProfile as n, applyMatrixProfileUpdate as t };
