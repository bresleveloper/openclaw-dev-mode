import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as upsertSessionUpstreamLinkInDatabase, t as deleteSessionUpstreamLinkInDatabase } from "./session-upstream-links.kernel-BXNiVVh8.mjs";
//#region src/sessions/session-upstream-links.ts
/** Best-effort shared-state registry for adopted upstream sessions. */
const log = createSubsystemLogger("sessions/upstream-links");
/** @deprecated Await upsertSessionUpstreamLinkAsync. Final compatibility day: 2026-12-31. */
function upsertSessionUpstreamLink(input, options = {}) {
	warnPluginSdkDeprecation({
		family: "session-upstream-links",
		method: "session-catalog.upsertSessionUpstreamLink",
		replacement: "await upsertSessionUpstreamLinkAsync",
		code: "DEP_SESSION_PERSISTENCE"
	});
	const now = options.now ?? Date.now();
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			return upsertSessionUpstreamLinkInDatabase(db, input, now, options.ifAbsent);
		}, options);
	} catch (error) {
		if (options.ifAbsent) throw error;
		log.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
/** @deprecated Await deleteSessionUpstreamLinkAsync. Final compatibility day: 2026-12-31. */
function deleteSessionUpstreamLink(sessionKey, agentId, options = {}) {
	warnPluginSdkDeprecation({
		family: "session-upstream-links",
		method: "session-catalog.deleteSessionUpstreamLink",
		replacement: "await deleteSessionUpstreamLinkAsync",
		code: "DEP_SESSION_PERSISTENCE"
	});
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			return deleteSessionUpstreamLinkInDatabase(db, sessionKey, agentId, options.expected);
		}, options);
	} catch (error) {
		if (options.expected) throw error;
		log.warn(`failed to delete session upstream link: ${String(error)}`);
		return;
	}
}
async function upsertSessionUpstreamLinkAsync(input, options = {}) {
	return upsertSessionUpstreamLinkWithCurrentSource(input, options);
}
/** Internal initializer adapter; source authority is never part of the public SDK arguments. */
async function upsertSessionUpstreamLinkWithCurrentSource(input, options, source) {
	try {
		const context = source?.context ?? captureOpenClawStateWorkerContext(options);
		const command = {
			type: "sessionUpstream.upsert",
			input: structuredClone({
				link: input,
				now: options.now ?? Date.now(),
				ifAbsent: options.ifAbsent,
				source: source?.expected
			})
		};
		const assertCurrent = () => {
			context.admission.assertCurrent();
			if (source) source.withCurrent(() => options.assertCommitAllowed?.());
			else options.assertCommitAllowed?.();
		};
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), {
			assertCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
		});
	} catch (error) {
		if (options.ifAbsent) throw error;
		log.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
async function deleteSessionUpstreamLinkAsync(sessionKey, agentId, options = {}) {
	try {
		const context = captureOpenClawStateWorkerContext(options);
		const input = structuredClone({
			sessionKey,
			agentId,
			expected: options.expected
		});
		const assertCurrent = () => {
			context.admission.assertCurrent();
			options.assertCommitAllowed?.();
		};
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "sessionUpstream.delete",
			input
		}), {
			assertCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
		});
	} catch (error) {
		if (options.expected) throw error;
		log.warn(`failed to delete session upstream link: ${String(error)}`);
		return;
	}
}
async function listWatchedSessionUpstreamLinks(options = {}) {
	const grouped = /* @__PURE__ */ new Map();
	try {
		const links = await executeOpenClawStateWorker(captureOpenClawStateWorkerContext(options), {
			type: "sessionUpstream.listWatched",
			input: void 0
		});
		const keyCounts = /* @__PURE__ */ new Map();
		for (const link of links) keyCounts.set(link.sessionKey, (keyCounts.get(link.sessionKey) ?? 0) + 1);
		for (const link of links) {
			if ((keyCounts.get(link.sessionKey) ?? 0) > 1) {
				log.warn(`skipping ambiguous upstream links for ${link.sessionKey}: multiple agents adopt the same key`);
				continue;
			}
			const catalogLinks = grouped.get(link.catalogId) ?? [];
			catalogLinks.push(link);
			grouped.set(link.catalogId, catalogLinks);
		}
	} catch (error) {
		log.warn(`failed to list watched session upstream links: ${String(error)}`);
	}
	return grouped;
}
//#endregion
export { upsertSessionUpstreamLinkAsync as a, upsertSessionUpstreamLink as i, deleteSessionUpstreamLinkAsync as n, upsertSessionUpstreamLinkWithCurrentSource as o, listWatchedSessionUpstreamLinks as r, deleteSessionUpstreamLink as t };
