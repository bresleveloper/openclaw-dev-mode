import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as getPairingAdapter } from "./pairing-DrYz8nti.mjs";
import { a as safeChannelKey, n as resolveAllowFromAccountId } from "./pairing-store-keys-BTumx1Bd.mjs";
import { n as readChannelAllowEntries } from "./pairing-store-sqlite-CdNwdKeg.mjs";
import "./pairing-store-model-BZ_ZsMmG.mjs";
import "./pairing-store.read-30DeRp-H.mjs";
import { MessagePort } from "node:worker_threads";
//#region src/pairing/pairing-store.ts
function resolvePairingAdapter(channel, pairingAdapter) {
	return pairingAdapter ?? getPairingAdapter(channel) ?? void 0;
}
function normalizeAllowFromInput(entry, pairingAdapter) {
	const trimmed = normalizeStringifiedOptionalString(entry) ?? "";
	if (!trimmed || trimmed === "*") return "";
	const adapter = pairingAdapter;
	const normalized = adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(trimmed) : trimmed;
	const normalizedEntry = normalizeOptionalString(normalized) ?? "";
	return normalizedEntry === "*" ? "" : normalizedEntry;
}
function mutatePairing(params, mutation) {
	const channel = safeChannelKey(params.channel);
	const assertCurrent = params.assertCurrent;
	const adapter = mutation.action === "resolve" && mutation.approval !== "dismiss" ? resolvePairingAdapter(params.channel, params.pairingAdapter) : void 0;
	if (mutation.action === "resolve" && (adapter?.normalizeAllowEntry || adapter?.resolveApprovalStoreEntry)) mutation.approval = "host";
	const context = captureOpenClawStateWorkerContext({ env: params.env ?? process.env });
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "channelPairing.mutate",
		input: {
			channel,
			mutation
		}
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				context.admission.assertCurrent();
				assertCurrent?.();
				const facts = request.facts;
				if (!isRecord(facts) || facts.channel !== channel) throw new Error("Channel pairing requires its captured mutation authority");
				if (request.stage === "prepare" && facts.kind === "channel-pairing-approval" && mutation.action === "resolve" && mutation.approval === "host" && isRecord(facts.entry) && typeof facts.entry.id === "string" && facts.replyPort instanceof MessagePort) {
					const meta = {};
					if (facts.entry.meta !== void 0) {
						if (!isRecord(facts.entry.meta)) throw new Error("Invalid channel pairing approval metadata");
						for (const [key, value] of Object.entries(facts.entry.meta)) {
							if (typeof value !== "string") throw new Error("Invalid channel pairing approval metadata");
							meta[key] = value;
						}
					}
					const entry = {
						id: facts.entry.id,
						...facts.entry.meta ? { meta } : {}
					};
					const approval = adapter?.resolveApprovalStoreEntry ? adapter.resolveApprovalStoreEntry({
						id: entry.id,
						...entry.meta ? { meta: entry.meta } : {}
					}) : entry.id;
					const normalized = approval == null ? "" : normalizeAllowFromInput(approval, adapter);
					context.admission.assertCurrent();
					assertCurrent?.();
					facts.replyPort.postMessage(normalized, []);
					recordWorkerMessage("admission", "to_worker", normalized.length * 2);
				} else if (facts.kind !== "channel-pairing" || request.stage !== "transaction" && request.stage !== "commit") throw new Error("Unexpected channel pairing admission request");
				grant();
			})
		})
	});
}
/** @deprecated Await readChannelAllowFromStore; final compatibility day: 2026-12-31. */
function readChannelAllowFromStoreSync(channel, env = process.env, accountId) {
	warnPluginSdkDeprecation({
		family: "channel-pairing-sync-allowlist",
		method: "readChannelAllowFromStoreSync",
		replacement: "readChannelAllowFromStore"
	});
	const resolvedAccountId = resolveAllowFromAccountId(accountId);
	return (readChannelAllowEntries(openOpenClawStateDatabase({ env }).db, channel)[resolvedAccountId] ?? []).slice();
}
async function updateAllowFromStoreEntry(params, remove) {
	const result = await mutatePairing(params, {
		action: "allow",
		accountId: resolveAllowFromAccountId(params.accountId),
		entry: normalizeAllowFromInput(params.entry, resolvePairingAdapter(params.channel, params.pairingAdapter)),
		remove
	});
	if (result.action !== "allow") throw new Error("Unexpected channel pairing allowlist result");
	return {
		changed: result.changed,
		allowFrom: result.allowFrom
	};
}
async function addChannelAllowFromStoreEntry(params) {
	return updateAllowFromStoreEntry(params, false);
}
async function removeChannelAllowFromStoreEntry(params) {
	return updateAllowFromStoreEntry(params, true);
}
async function listChannelPairingRequests(channel, env = process.env, accountId, assertCurrent) {
	const result = await mutatePairing({
		channel,
		env,
		assertCurrent
	}, {
		action: "list",
		accountId: normalizeLowercaseStringOrEmpty(accountId)
	});
	if (result.action !== "list") throw new Error("Unexpected channel pairing list result");
	return result.requests;
}
async function upsertChannelPairingRequest(params) {
	const accountId = normalizeLowercaseStringOrEmpty(params.accountId) || "default";
	const meta = {
		...Object.fromEntries(Object.entries(params.meta ?? {}).map(([key, value]) => [key, normalizeOptionalString(value) ?? ""]).filter(([, value]) => Boolean(value))),
		accountId
	};
	const result = await mutatePairing(params, {
		action: "upsert",
		id: normalizeStringifiedOptionalString(params.id) ?? "",
		accountId,
		meta
	});
	if (result.action !== "upsert") throw new Error("Unexpected channel pairing request result");
	return {
		code: result.code,
		created: result.created
	};
}
async function resolveChannelPairingRequest(params, selector, approve) {
	const result = await mutatePairing(params, {
		action: "resolve",
		accountId: normalizeLowercaseStringOrEmpty(params.accountId),
		selector,
		approval: approve ? "sender" : "dismiss"
	});
	if (result.action !== "resolve") throw new Error("Unexpected channel pairing resolution result");
	return result.result;
}
async function approveChannelPairingCode(params) {
	const code = (normalizeNullableString(params.code) ?? "").toUpperCase();
	return code ? resolveChannelPairingRequest(params, { code }, true) : null;
}
/** Approves a pending request by opaque id without exposing its pairing code. */
async function approveChannelPairingRequest(params) {
	const requestId = normalizeOptionalString(params.requestId);
	return requestId ? resolveChannelPairingRequest(params, {
		requestId,
		channel: params.channel
	}, true) : null;
}
/** Dismisses a pending request without blocking the sender from requesting again. */
async function dismissChannelPairingRequest(params) {
	const requestId = normalizeOptionalString(params.requestId);
	return requestId ? resolveChannelPairingRequest(params, {
		requestId,
		channel: params.channel
	}, false) : null;
}
//#endregion
export { listChannelPairingRequests as a, upsertChannelPairingRequest as c, dismissChannelPairingRequest as i, approveChannelPairingCode as n, readChannelAllowFromStoreSync as o, approveChannelPairingRequest as r, removeChannelAllowFromStoreEntry as s, addChannelAllowFromStoreEntry as t };
