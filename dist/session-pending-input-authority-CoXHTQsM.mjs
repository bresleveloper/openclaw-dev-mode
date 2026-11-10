import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-pending-input-authority.ts
async function withCurrentPendingInputAuthority(authorities, assertLifetimeCurrent, run) {
	const authority = authorities[0];
	if (!authority) return await run();
	assertLifetimeCurrent();
	for (const source of authorities.slice(1)) {
		await source.withCurrent(() => void 0);
		assertLifetimeCurrent();
	}
	const runInCallerContext = AsyncLocalStorage.snapshot();
	let initiated;
	try {
		return await (await authority.withCurrent((facts, assertSourceCurrent) => {
			const enter = (index) => {
				const source = authorities[index];
				if (source) return source.withPreparedCurrent(facts, () => enter(index + 1), assertSourceCurrent);
				initiated = Promise.resolve(runInCallerContext(run));
				initiated.catch(() => {});
				return { value: initiated };
			};
			return enter(0);
		})).value;
	} catch (error) {
		await initiated;
		throw error;
	}
}
function withSessionPendingInputAuthorityGuard(authority, assertCurrent, rejectPreparation) {
	return {
		assertLifetimeCurrent() {
			try {
				authority.assertLifetimeCurrent();
				assertCurrent();
			} catch (cause) {
				rejectPreparation?.(cause);
				throw cause;
			}
		},
		async withCurrent(consume) {
			let consuming = false;
			try {
				assertCurrent();
				return await authority.withCurrent((facts, assertSourceCurrent) => {
					assertCurrent();
					consuming = true;
					return consume(facts, assertSourceCurrent);
				});
			} catch (cause) {
				if (!consuming) rejectPreparation?.(cause);
				throw cause;
			}
		},
		withPreparedCurrent(facts, consume, assertSourceCurrent) {
			let consuming = false;
			try {
				return authority.withPreparedCurrent(facts, () => {
					assertCurrent();
					consuming = true;
					return consume();
				}, assertSourceCurrent);
			} catch (cause) {
				if (!consuming) rejectPreparation?.(cause);
				throw cause;
			}
		}
	};
}
//#endregion
export { withSessionPendingInputAuthorityGuard as n, withCurrentPendingInputAuthority as t };
