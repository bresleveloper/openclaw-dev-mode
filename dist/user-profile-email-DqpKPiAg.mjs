import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as normalizeProfileEmail } from "./user-profile-email.kernel-DfJegdRL.mjs";
//#region src/state/user-profile-email.ts
/** Legacy email authentication keeps creation with the existing profile owner. */
async function ensureProfileIdForEmail(email, options = {}, assertCurrent) {
	assertCurrent?.();
	const normalized = normalizeProfileEmail(email);
	const context = captureOpenClawStateWorkerContext(options);
	const selected = {
		...options,
		path: context.admission.databasePath
	};
	const observed = await executeExistingOpenClawStateRead(selected, {
		type: "userProfiles.email.resolve",
		email: normalized
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	if (observed?.profileId) return observed.profileId;
	const { ensureCanonicalUserProfileForEmail } = await import("./user-profile-writes-BZ_BS-Lq.mjs");
	return (await ensureCanonicalUserProfileForEmail(normalized, {
		...selected,
		assertCurrent: () => {
			context.admission.assertCurrent();
			assertCurrent?.();
		}
	})).id;
}
//#endregion
export { ensureProfileIdForEmail as t };
