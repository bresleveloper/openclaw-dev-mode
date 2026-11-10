import { i as openXAllowlist } from "./allowlist-Bk-oAvxJ.mjs";
//#region extensions/x/src/verified-github.ts
function emptyXGitHubSnapshot(account) {
	return {
		repo: account.config.verifiedFromGitHub.repo,
		minPermission: account.config.verifiedFromGitHub?.minPermission ?? "push",
		entries: [],
		unresolvedHandles: [],
		lookupResults: {},
		stale: true
	};
}
async function getXGitHubStatus(runtime, account) {
	if (!account.config.verifiedFromGitHub?.repo) return;
	const { minPermission: _permission, lookupResults: _lookups, ...status } = await openXAllowlist(runtime).readGitHub(account.accountId, account.config.verifiedFromGitHub) ?? emptyXGitHubSnapshot(account);
	return status;
}
async function syncXGitHub(params) {
	const { account, assertCurrent, signal } = params;
	const allowlist = openXAllowlist(params.runtime);
	const previous = await allowlist.readGitHub(account.accountId, account.config.verifiedFromGitHub);
	const snapshot = emptyXGitHubSnapshot(account);
	const collaborators = await params.github.readCollaborators(snapshot.repo, snapshot.minPermission, signal);
	assertCurrent();
	const handles = new Set(collaborators.flatMap((entry) => entry.xHandles));
	const resolved = new Map(Object.entries(previous?.lookupResults ?? {}).filter(([handle]) => handles.has(handle)));
	const pending = [...handles].filter((handle) => !resolved.has(handle));
	if (pending.length) {
		const api = await params.getApi();
		for (let offset = 0; offset < pending.length; offset += 100) {
			assertCurrent();
			const batch = pending.slice(offset, offset + 100);
			const users = await api.getUsersByUsernames(batch, signal, assertCurrent);
			assertCurrent();
			for (const handle of batch) resolved.set(handle, null);
			for (const user of users) {
				const handle = user.username.toLowerCase();
				if (batch.includes(handle)) resolved.set(handle, user.id);
			}
			await allowlist.replaceGitHub(account.accountId, {
				...previous ?? snapshot,
				lookupResults: Object.fromEntries(resolved)
			}, assertCurrent);
		}
	}
	const syncedAt = Date.now();
	const entries = collaborators.flatMap((collaborator) => collaborator.xHandles.flatMap((xHandle) => {
		const xUserId = resolved.get(xHandle);
		return xUserId ? [{
			xUserId,
			xHandle,
			githubLogin: collaborator.githubLogin,
			permission: collaborator.permission,
			syncedAt
		}] : [];
	}));
	const next = {
		...snapshot,
		entries,
		unresolvedHandles: [...handles].filter((handle) => !resolved.get(handle)).toSorted(),
		lookupResults: Object.fromEntries(resolved),
		lastSyncAt: syncedAt,
		stale: false
	};
	assertCurrent();
	await allowlist.replaceGitHub(account.accountId, next, assertCurrent);
	return next;
}
//#endregion
export { getXGitHubStatus as n, syncXGitHub as r, emptyXGitHubSnapshot as t };
