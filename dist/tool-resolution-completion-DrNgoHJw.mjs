import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { N as readCommittedIncognitoSessionSharing } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { i as evaluateGatewayToolCallerReceiptAdmission } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-DIo-5B5v.mjs";
//#region src/gateway/tool-resolution-completion.ts
/**
* Whether a completion grant's requester lineage still verifies. Grants without a
* handoff carry no lineage and are always current. The child entry can be removed or
* re-parented while a tool call awaits preparation, hooks or approvals, so the tool
* list, the dispatch authorization and the tool's source-effect guard all ask this.
*/
function isCompletionGrantLineageCurrent(params) {
	const { context } = params;
	return !context.trustedInternalHandoff || hasVerifiedRequesterCompletionHandoff({
		config: params.cfg,
		sessionKey: context.runtimePolicySessionKey?.trim() || context.sessionKey,
		sessionId: context.sessionId,
		modelProvider: context.modelProvider,
		modelId: context.modelId,
		inputProvenance: context.inputProvenance,
		trustedInternalHandoff: context.trustedInternalHandoff,
		preparedSessionCapabilityStore: params.preparedSessionCapabilityStore
	});
}
var CompletionLineageReadRequired = class extends Error {
	constructor(query) {
		super("Completion lineage requires current worker facts");
		this.query = query;
	}
};
/** Register the SQL predicate separately from the MCP grant's existing lifecycle assertion. */
function createCompletionGrantLineageAdmission(params) {
	if (!params.context.trustedInternalHandoff) return {
		isCurrent: () => true,
		admission: void 0
	};
	const admission = { async prepare() {
		const { withSessionStoreReaderInWorker } = await import("./session-entry-read-runtime-BLjA5kor.mjs");
		const reads = [];
		const entries = /* @__PURE__ */ new Map();
		const nativeReads = /* @__PURE__ */ new Map();
		const readKey = (query) => JSON.stringify([query.kind, query.key]);
		const get = (query) => {
			const key = readKey(query);
			const native = nativeReads.get(key);
			if (native) return native();
			if (!entries.has(key)) throw new CompletionLineageReadRequired(query);
			return entries.get(key);
		};
		const store = {
			authoritative: true,
			get: (key) => get({
				kind: "key",
				key
			}),
			getById: (key) => get({
				kind: "id",
				key
			})
		};
		const current = () => isCompletionGrantLineageCurrent({
			...params,
			preparedSessionCapabilityStore: store
		});
		const maximumReads = 64;
		for (;;) {
			let query;
			try {
				if (!current()) throw new Error("CLI completion tool grant no longer matches its requester policy");
				break;
			} catch (error) {
				if (!(error instanceof CompletionLineageReadRequired)) throw error;
				query = error.query;
			}
			if (reads.length + nativeReads.size >= maximumReads) throw new Error("Completion lineage changed during worker preparation");
			const agentId = parseAgentSessionKey(query.key)?.agentId;
			if (!agentId) throw new Error("Completion lineage requires an agent-qualified source");
			if (query.kind === "key" && isIncognitoSessionKey(query.key)) {
				const pathname = resolveIncognitoOpenClawAgentSqlitePath({ agentId });
				const database = getOpenIncognitoAgentDatabase(agentId, pathname);
				nativeReads.set(readKey(query), () => {
					if (getOpenIncognitoAgentDatabase(agentId, pathname) !== database) throw new Error("Completion lineage incognito owner changed");
					if (!database) return;
					const facts = readCommittedIncognitoSessionSharing(database.db, query.key);
					if (facts?.entry && !facts.capability) throw new Error("Completion lineage incognito facts are unavailable");
					return facts?.capability;
				});
				continue;
			}
			await withSessionStoreReaderInWorker({
				agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
			}, async (owner) => {
				const result = await owner.reader.readExactEntries({
					...query.kind === "key" ? { sessionKeys: [query.key] } : { selection: {
						kind: "session-id",
						sessionId: query.key
					} },
					projection: "sharing",
					env: owner.database.env,
					continuation: owner.continuation
				});
				owner.assertCurrent();
				const identity = readDatabasePathIdentitySync(owner.database.path);
				if (!identity.key.startsWith("file:")) throw new Error("Completion lineage source is unavailable");
				const selected = { ...owner.selectedStore };
				const source = Object.freeze({
					agentId: owner.database.agentId,
					path: owner.database.path,
					databaseIdentity: identity.key.slice(5),
					databaseBirthtime: identity.birthtime,
					sessionKey: query.key,
					projection: "capability",
					...query.kind === "id" ? { sessionIdLookup: query.key } : {}
				});
				const assertSourceCurrent = () => {
					assertExistingDatabaseIdentity(source.path, identity.key, identity.birthtime);
					if (captureSessionStoreReadCandidate(selected.path).physicalPath !== selected.physicalPath) throw new Error("Completion lineage source changed");
				};
				assertSourceCurrent();
				entries.set(readKey(query), result.entries[0]?.entry);
				reads.push({
					query,
					source,
					assertSourceCurrent
				});
			}, {
				backing: true,
				dataOnly: true
			});
		}
		const isCurrent = () => {
			try {
				for (const read of reads) read.assertSourceCurrent();
				return current();
			} catch {
				return false;
			}
		};
		return {
			current: {
				sources: reads.map((read) => read.source),
				assertCurrent(values) {
					if (values.length !== reads.length) throw new Error("Completion lineage admission has an incomplete source cohort");
					reads.forEach((read, index) => entries.set(readKey(read.query), values[index]));
					if (!isCurrent()) throw new Error("CLI completion tool grant no longer matches its requester policy");
				}
			},
			isCurrent
		};
	} };
	return {
		admission,
		isCurrent: () => evaluateGatewayToolCallerReceiptAdmission(admission, () => isCompletionGrantLineageCurrent(params))
	};
}
/** Rejects a tool list, built or cached, whose completion grant outlived its lineage. */
function assertCompletionGrantLineage(params) {
	if (!isCompletionGrantLineageCurrent(params)) throw new Error("CLI completion tool grant no longer matches its requester policy");
}
//#endregion
export { createCompletionGrantLineageAdmission as n, assertCompletionGrantLineage as t };
