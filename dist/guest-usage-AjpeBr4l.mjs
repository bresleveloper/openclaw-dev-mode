//#region extensions/x/src/guest-usage.ts
const DAY_MS = 864e5;
const MAX_AUTHOR_DAYS = 1e4;
const MAX_X_GUEST_MENTIONS_PER_AUTHOR_PER_DAY = 1e3;
var XGuestUsageUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "XGuestUsageUnavailableError";
	}
};
function accountDayPrefix(accountId, time = Date.now()) {
	return `${encodeURIComponent(accountId)}:${new Date(time).toISOString().slice(0, 10)}:`;
}
function openXGuestUsage(runtime) {
	const store = runtime.state.openKeyedStore({
		namespace: "x.guest-usage",
		maxEntries: MAX_AUTHOR_DAYS,
		overflowPolicy: "reject-new",
		defaultTtlMs: 2 * DAY_MS
	});
	return {
		async admit(params) {
			if (!Number.isInteger(params.limit) || params.limit < 0 || params.limit > 1e3) throw new XGuestUsageUnavailableError("X guest mode requires a daily mention limit from 0 to 1000.");
			if (!store.withCurrent) throw new XGuestUsageUnavailableError("X guest mode requires host-enforced atomic usage accounting.");
			const now = Date.now();
			const prefix = accountDayPrefix(params.accountId, now);
			const assertCurrent = () => {
				params.assertCurrent();
				if (accountDayPrefix(params.accountId) !== prefix) throw new Error("X guest usage day changed during admission; retrying mention");
			};
			const writer = store.withCurrent({ assertCurrent });
			const key = `${prefix}${params.authorId}`;
			let observed = await writer.observe(key);
			if (params.limit > 0) {
				if ((await Promise.all([1, 2].map((days) => writer.lookup(`${accountDayPrefix(params.accountId, now - days * DAY_MS)}${params.authorId}`)))).some((row) => row?.admittedPostIds.includes(params.postId))) {
					assertCurrent();
					return true;
				}
			}
			for (;;) {
				assertCurrent();
				const current = observed.value ?? {
					admittedPostIds: [],
					rateLimited: 0,
					recentRejectedPostIds: []
				};
				if (params.limit > 0 && current.admittedPostIds.includes(params.postId)) return true;
				const admitted = current.admittedPostIds.length < params.limit;
				if (!admitted && current.recentRejectedPostIds.includes(params.postId)) return false;
				const next = admitted ? {
					...current,
					admittedPostIds: [...current.admittedPostIds, params.postId]
				} : {
					...current,
					rateLimited: current.rateLimited + 1,
					recentRejectedPostIds: [...current.recentRejectedPostIds, params.postId].slice(-128)
				};
				try {
					const result = await writer.compareAndApply(key, observed.comparison, {
						operation: "update",
						action: "set",
						value: next
					});
					if (result.status !== "conflict") return admitted;
					observed = result.current;
				} catch (error) {
					if (error instanceof Error && "code" in error && error.code === "PLUGIN_STATE_LIMIT_EXCEEDED") throw new XGuestUsageUnavailableError("X guest mode is paused because usage accounting reached capacity; retry after retained usage expires.", { cause: error });
					throw error;
				}
			}
		},
		async counts(accountId) {
			if (!store.entriesInKeyRange) throw new XGuestUsageUnavailableError("X guest mode requires bounded host usage reads.");
			const prefix = accountDayPrefix(accountId);
			return (await store.entriesInKeyRange({
				keyStartInclusive: prefix,
				keyEndExclusive: `${prefix}\uffff`,
				limit: MAX_AUTHOR_DAYS
			})).reduce((counts, row) => ({
				admittedToday: counts.admittedToday + row.value.admittedPostIds.length,
				rateLimitedToday: counts.rateLimitedToday + row.value.rateLimited
			}), {
				admittedToday: 0,
				rateLimitedToday: 0
			});
		}
	};
}
//#endregion
export { XGuestUsageUnavailableError as n, openXGuestUsage as r, MAX_X_GUEST_MENTIONS_PER_AUTHOR_PER_DAY as t };
