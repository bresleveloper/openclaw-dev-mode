import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { r as readSessionUpstreamLinkInDatabase } from "./session-upstream-links.kernel-BXNiVVh8.mjs";
//#region src/sessions/session-upstream-links-runtime.ts
/** Missing-path admissions may later promote; this read keeps its original physical source. */
function captureSessionUpstreamLinkReadSource(context = captureOpenClawStateWorkerContext()) {
	return {
		context,
		present: { ...context.admission.identity }.key.startsWith("file:"),
		assertCurrent() {
			context.admission.assertCurrent();
		}
	};
}
async function prepareSessionUpstreamLink(source, sessionKey, agentId) {
	source.assertCurrent();
	if (!source.present) return;
	const { context } = source;
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "sessionUpstream.read",
		input: {
			sessionKey,
			agentId
		}
	}, {
		context,
		current: true
	});
	source.assertCurrent();
	if (!result?.ok || result.type !== "sessionUpstream.read") throw new Error("Session upstream source is unavailable");
	return result.link;
}
/** Final native guards remain current even when a foreign or released SDK writer bypasses publication. */
function readCurrentSessionUpstreamLink(source, sessionKey, agentId) {
	source.assertCurrent();
	if (!source.present) return;
	const { context } = source;
	const result = withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => ({ link: readSessionUpstreamLinkInDatabase(db, sessionKey, agentId) }), {
		path: context.admission.databasePath,
		env: context.environment,
		allowNativeRead: true
	});
	source.assertCurrent();
	if (!result) throw new Error("Session upstream source is unavailable");
	return result.link;
}
function settleSessionUpstreamLink(expected, settlement, options) {
	const context = captureOpenClawStateWorkerContext(options);
	const { assertCurrent, sessionEntryCurrent } = options;
	const input = structuredClone({
		expected,
		settlement,
		sessionEntryCurrentSource: sessionEntryCurrent?.source
	});
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "sessionUpstream.settle",
		input
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Upstream settlement requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent();
				assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
				grant();
			})
		})
	});
}
//#endregion
export { settleSessionUpstreamLink as i, prepareSessionUpstreamLink as n, readCurrentSessionUpstreamLink as r, captureSessionUpstreamLinkReadSource as t };
