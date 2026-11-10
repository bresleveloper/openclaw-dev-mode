import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as isSameSessionSharingTarget } from "./session-sharing-target-read-DwJlM38W.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { n as prepareSessionSharingAccess } from "./sessions-sharing-authority-D3-YNQkH.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/session-discovery-access.ts
/** Keep discovery bound to current sharing facts and the session's selected skill revisions. */
async function withSessionDiscoveryAccess(params, discover) {
	if (!params.sessionKey) {
		params.respond(true, await discover(), void 0);
		return;
	}
	const { respond } = params;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const access = _usingCtx$1.u(await prepareSessionSharingAccess({
				...params,
				sessionKey: params.sessionKey
			}, () => {
				throw new Error("Session discovery authority changed.");
			}));
			if (!access) return;
			const { query, projection } = access;
			const sourcePath = access.readCurrent().sourcePath;
			const readCurrent = (selected) => {
				const { target, sharing } = access.readCurrent();
				if (selected && !isSameSessionSharingTarget(target, selected)) throw new SessionMutationAuthorizationChangedError(params.changedError);
				if (!target) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, "Session not found."));
				const denied = sharing.authorizeTarget(target);
				if (denied) throw new SessionMutationAuthorizationChangedError(denied);
				return target;
			};
			const selected = readCurrent();
			const readEntry = (consume) => withReadySessionRows(projection, () => [query], (read) => {
				readCurrent(selected);
				const row = read.describe(query);
				const entry = row?.storedEntry;
				if (!entry || (read.readSource(row)?.path ?? row.storeTarget.storePath) !== (sourcePath ?? selected.storePath) || entry.sessionId !== selected.entry.sessionId || entry.lifecycleRevision !== selected.entry.lifecycleRevision) throw new SessionMutationAuthorizationChangedError(params.changedError);
				return consume(entry);
			});
			const entry = await readEntry((current) => structuredClone(current));
			readCurrent(selected);
			const result = await discover(entry);
			readCurrent(selected);
			await readEntry((current) => {
				if (!isDeepStrictEqual(current.skillLibrarySelections, entry.skillLibrarySelections)) throw new SessionMutationAuthorizationChangedError(params.changedError);
				respond(true, result, void 0);
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		respond(false, void 0, error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
	}
}
//#endregion
export { withSessionDiscoveryAccess as t };
