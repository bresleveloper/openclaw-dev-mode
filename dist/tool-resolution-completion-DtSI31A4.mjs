import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as evaluateGatewayToolCallerReceiptAdmission } from "./gateway-caller-context-Be176_GV.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { N as createMemorySessionCapabilityStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as projectSessionEntryCapabilityFacts } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-BmPXAdVs.mjs";
import path from "node:path";
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
		preparedSessionCapabilityStore: params.preparedSessionCapabilityStore ?? createMemorySessionCapabilityStore()
	});
}
var CompletionLineageReadRequired = class extends Error {
	constructor(query) {
		super("Completion lineage requires current worker facts");
		this.query = query;
	}
};
/** Register lineage predicates separately from the MCP grant's lifecycle assertion. */
function createCompletionGrantLineageAdmission(params) {
	if (!params.context.trustedInternalHandoff) return {
		isCurrent: () => true,
		admission: void 0
	};
	const memoryStore = createMemorySessionCapabilityStore();
	if (memoryStore) {
		const isCurrent = () => {
			try {
				return isCompletionGrantLineageCurrent({
					...params,
					preparedSessionCapabilityStore: memoryStore
				});
			} catch {
				return false;
			}
		};
		return {
			admission: { async prepare() {
				return {
					isCurrent,
					current: {
						sources: [],
						assertCurrent() {
							if (!isCurrent()) throw new Error("CLI completion tool grant no longer matches its requester policy");
						}
					}
				};
			} },
			isCurrent
		};
	}
	const binding = getSessionActorStorageBinding({});
	const env = binding ? { OPENCLAW_STATE_DIR: path.resolve(binding.path, "../../../..") } : void 0;
	const owners = /* @__PURE__ */ new Map();
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	const admission = { async prepare() {
		const { withSessionStoreReaderInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
		const reads = [];
		const entries = /* @__PURE__ */ new Map();
		const publishedReads = /* @__PURE__ */ new Map();
		const readKey = (query) => JSON.stringify([query.kind, query.key]);
		const get = (query) => {
			const key = readKey(query);
			const published = publishedReads.get(key);
			if (published) return published();
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
			if (reads.length + publishedReads.size >= maximumReads) throw new Error("Completion lineage changed during worker preparation");
			const agentId = parseAgentSessionKey(query.key)?.agentId;
			if (!agentId) throw new Error("Completion lineage requires an agent-qualified source");
			if (isIncognitoSessionKey(query.key)) {
				if (!owners.has(agentId)) owners.set(agentId, captureSessionActorStorageOwner({
					agentId,
					sessionKey: query.key,
					sessionActor: binding
				}, authority));
				const selected = owners.get(agentId);
				publishedReads.set(readKey(query), () => {
					selected?.binding?.actor.assertReadable();
					const owner = selected?.owner;
					if (!owner || !selected) return;
					const row = query.kind === "id" ? owner.readSessionById(query.key, selected.authority) : void 0;
					const entry = owner.readStorage(row?.sessionKey ?? query.key, {
						type: "session.entry.read",
						input: { projection: "list" }
					}, selected.authority);
					return entry && (query.kind === "key" || entry.sessionId === query.key) ? projectSessionEntryCapabilityFacts(entry) : void 0;
				});
				continue;
			}
			await withSessionStoreReaderInWorker({
				agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
					agentId,
					env
				}),
				env
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
		isCurrent: () => {
			try {
				return evaluateGatewayToolCallerReceiptAdmission(admission, () => isCompletionGrantLineageCurrent(params));
			} catch {
				return false;
			}
		}
	};
}
/** Rejects a tool list, built or cached, whose completion grant outlived its lineage. */
function assertCompletionGrantLineage(params) {
	if (!isCompletionGrantLineageCurrent(params)) throw new Error("CLI completion tool grant no longer matches its requester policy");
}
//#endregion
export { createCompletionGrantLineageAdmission as n, assertCompletionGrantLineage as t };
