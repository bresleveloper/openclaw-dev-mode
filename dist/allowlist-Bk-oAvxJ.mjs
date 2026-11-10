import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
//#region extensions/x/src/allowlist.ts
function matchesGitHubConfig(snapshot, config) {
	return Boolean(config?.repo && snapshot?.repo.toLowerCase() === config.repo.toLowerCase() && snapshot.minPermission === (config.minPermission ?? "push"));
}
function normalizeXUserId(value) {
	const id = value.trim().replace(/^x:/i, "");
	return /^[0-9]+$/.test(id) ? id : void 0;
}
var XAllowlistChangedError = class extends Error {
	constructor() {
		super("X allowlist changed during authorization; retrying with current policy");
		this.name = "XAllowlistChangedError";
	}
};
const mutations = resolveGlobalMap(Symbol.for("openclaw.x.allowlist-mutations"), "close-and-restart");
function readPublishedXAllowlist(runtime, accountId, githubConfig) {
	const state = mutations.get(JSON.stringify([runtime.state.resolveStateDir(), accountId]));
	return state && !state.pending ? [...state.allowFrom ?? [], ...matchesGitHubConfig(state.github, githubConfig) ? state.github?.entries.map((entry) => entry.xUserId) ?? [] : []] : [];
}
function openXAllowlist(runtime) {
	const stateDir = runtime.state.resolveStateDir();
	const store = runtime.state.openKeyedStore({
		namespace: "x.allowlist",
		maxEntries: 1e4,
		overflowPolicy: "reject-new"
	});
	const githubStore = runtime.state.openKeyedStore({
		namespace: "x.verified-github",
		maxEntries: 1e3,
		overflowPolicy: "reject-new"
	});
	const accountPrefix = (accountId) => `${encodeURIComponent(accountId)}:`;
	const mutationState = (accountId) => {
		const key = JSON.stringify([stateDir, accountId]);
		let state = mutations.get(key);
		if (!state) {
			state = {
				generation: {},
				pending: 0
			};
			mutations.set(key, state);
		}
		return {
			key,
			state
		};
	};
	const mutate = async (accountId, assertCurrent, write) => {
		assertCurrent?.();
		const { state } = mutationState(accountId);
		state.generation = {};
		state.allowFrom = void 0;
		state.github = void 0;
		state.pending++;
		try {
			return await write();
		} finally {
			state.pending--;
			state.generation = {};
		}
	};
	const list = async (accountId) => {
		const prefix = accountPrefix(accountId);
		return (await store.entries()).filter((entry) => entry.key.startsWith(prefix)).map((entry) => entry.value).toSorted((a, b) => a.userId.localeCompare(b.userId));
	};
	return {
		list,
		async readGitHub(accountId, config) {
			if (!config?.repo) return;
			const snapshot = await githubStore.lookup(accountId);
			return matchesGitHubConfig(snapshot, config) ? snapshot : void 0;
		},
		async replaceGitHub(accountId, snapshot, assertCurrent) {
			const previous = await githubStore.lookup(accountId);
			assertCurrent();
			const ids = (entries) => JSON.stringify([...new Set(entries.map((entry) => entry.xUserId))].toSorted());
			if ((!previous || previous.repo === snapshot.repo && previous.minPermission === snapshot.minPermission) && ids(previous?.entries ?? []) === ids(snapshot.entries)) {
				await githubStore.register(accountId, snapshot, { assertCurrent });
				return;
			}
			await mutate(accountId, assertCurrent, () => githubStore.register(accountId, snapshot, { assertCurrent }));
		},
		invalidate(accountId) {
			const { state } = mutationState(accountId);
			state.generation = {};
			state.allowFrom = void 0;
			state.github = void 0;
		},
		async readSnapshot(accountId, githubConfig) {
			const { key, state } = mutationState(accountId);
			const generation = state.generation;
			const assertCurrent = () => {
				if (mutations.get(key) !== state || state.pending || state.generation !== generation) throw new XAllowlistChangedError();
			};
			assertCurrent();
			const [entries, github] = await Promise.all([list(accountId), githubConfig?.repo ? githubStore.lookup(accountId) : void 0]);
			const allowFrom = entries.map((entry) => entry.userId);
			assertCurrent();
			state.allowFrom = allowFrom;
			state.github = matchesGitHubConfig(github, githubConfig) ? github : void 0;
			return {
				allowFrom: [...allowFrom, ...state.github?.entries.map((entry) => entry.xUserId) ?? []],
				github: state.github,
				assertCurrent
			};
		},
		async put(accountId, entry, assertCurrent) {
			await mutate(accountId, assertCurrent, () => store.register(`${accountPrefix(accountId)}${entry.userId}`, entry, { assertCurrent }));
		},
		async remove(accountId, userId, assertCurrent) {
			return await mutate(accountId, assertCurrent, () => store.delete(`${accountPrefix(accountId)}${userId}`, { assertCurrent }));
		}
	};
}
function mergeXAllowlist(configAllowFrom, stored) {
	const entries = /* @__PURE__ */ new Map();
	for (const entry of stored) entries.set(entry.userId, {
		...entry,
		configured: false,
		editable: true
	});
	for (const value of configAllowFrom) {
		const userId = normalizeXUserId(value);
		if (userId) entries.set(userId, {
			...entries.get(userId),
			userId,
			configured: true,
			editable: entries.has(userId)
		});
	}
	return [...entries.values()].toSorted((a, b) => a.userId.localeCompare(b.userId));
}
//#endregion
export { readPublishedXAllowlist as a, openXAllowlist as i, mergeXAllowlist as n, normalizeXUserId as r, XAllowlistChangedError as t };
