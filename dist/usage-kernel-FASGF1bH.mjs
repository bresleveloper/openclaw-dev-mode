import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { A as resetAuthProfileFailureState, t as authProfileCredentialPublication, v as coerceAuthProfileState } from "./user-model-account-authority-DFFjC5J5.mjs";
import { c as readAuthProfileAuthorizationLifetimes, o as prepareAuthProfileAuthorizationWrite, u as restoreAuthProfileAuthorizationWriteIntents } from "./authorization-lifetime-CLdd1God.mjs";
import { a as isSameOAuthRefreshGeneration } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { a as mergeAuthProfileStores, o as mergePersistedAuthProfileState, r as loadPersistedAuthProfileStoreAtDatabasePath } from "./persisted-DbIYEoQ3.mjs";
import { C as deleteAuthProfileJsonCell, w as writeAuthProfileJsonCell } from "./sqlite-BlFpr2YD.mjs";
import { c as readAuthProfileJsonCellText } from "./sqlite-json-Dyr7VLoH.mjs";
import { G as pruneAuthProfileStoreReferences, R as createEmptyAuthProfileStore, V as markRuntimePersistedProfiles } from "./runtime-snapshots-HRosak4u.mjs";
import { n as prepareAuthProfileStateMutation, r as prepareAuthProfileStoreMutation, t as buildLocalAuthProfileStoreForSave } from "./store-save-BIpfhaDX.mjs";
import { n as sendAuthProfileUpdateValue, t as receiveAuthProfileUpdateValue } from "./store-update-transfer-2J4RGKmB.mjs";
import { t as createAuthProfileUsageReceipt } from "./store.worker-contract-B0bVcqdW.mjs";
import { i as reduceAuthProfileFailure } from "./usage-reduction-CowLLP6a.mjs";
import { MessageChannel } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/store-update.worker.ts
/** A definite mismatch needs no write lock; possible matches reread inside the transaction. */
function authProfilePeerGenerationMayMatch(database, input) {
	const peer = input.peerGeneration;
	if (!peer) return true;
	const text = readAuthProfileJsonCellText(database, "store", "agent");
	if (text === void 0) return false;
	let raw;
	try {
		raw = JSON.parse(text);
	} catch {
		throw new AuthProfileStoreUnreadableError(input.owner.databasePath);
	}
	const store = mergePersistedAuthProfileState(raw, () => null);
	if (!store) throw new AuthProfileStoreUnreadableError(input.owner.databasePath);
	const credential = store.profiles[peer.profileId];
	return credential?.type === "oauth" && isSameOAuthRefreshGeneration({
		profileId: peer.profileId,
		left: credential,
		right: peer.generation
	});
}
/** Run under the owning transaction: callbacks see its current rows exactly once. */
function updateAuthProfileStoreInDatabase(database, kind, input) {
	const read = (target) => {
		const text = readAuthProfileJsonCellText(database, target, kind);
		try {
			return text === void 0 ? void 0 : JSON.parse(text);
		} catch {
			if (target === "state") return null;
			throw new AuthProfileStoreUnreadableError(input.owner.databasePath);
		}
	};
	const isMainStore = input.owner.databasePath === input.owner.sharedDatabasePath;
	const prepareStores = () => {
		const existingRaw = read("store");
		const existingState = read("state") ?? null;
		const loaded = mergePersistedAuthProfileState(existingRaw, () => existingState);
		if (existingRaw !== void 0 && !loaded) throw new AuthProfileStoreUnreadableError(input.owner.databasePath);
		const localStore = loaded ?? {
			version: 1,
			profiles: {},
			...coerceAuthProfileState(existingState)
		};
		return {
			existingRaw,
			existingState,
			loaded,
			localStore,
			mainStore: isMainStore ? localStore : loadPersistedAuthProfileStoreAtDatabasePath(input.owner.sharedDatabasePath, input.owner.location === "state-db" ? "shared-state" : "agent")
		};
	};
	const prepared = input.envOnly ? void 0 : prepareStores();
	const { port1, port2 } = new MessageChannel();
	try {
		sendAuthProfileUpdateValue(port1, {
			store: prepared ? markRuntimePersistedProfiles(prepared.localStore) : createEmptyAuthProfileStore(),
			mainStore: prepared && !isMainStore ? prepared.mainStore : null,
			storePresent: prepared?.existingRaw !== void 0
		});
		requestSqliteWorkerOperationAdmission({
			stage: kind === "shared-state" ? "transaction" : "prepare",
			facts: {
				kind: "auth-store-update",
				port: port2
			}
		}, [port2]);
		const response = receiveAuthProfileUpdateValue(port1);
		if (!response || typeof response.save !== "boolean") throw new Error("Auth profile updater produced no response");
		if (!response.save) return;
		if ("store" in response) restoreAuthProfileAuthorizationWriteIntents(response.store.profiles, response.authorizationIntents);
		const { existingRaw, existingState, localStore, mainStore } = prepared ?? prepareStores();
		const restoring = "restore" in response ? response.restore : void 0;
		const restoredRaw = restoring ? isDeepStrictEqual(existingRaw ?? null, restoring.after.store) ? restoring.before.store : existingRaw ?? null : void 0;
		const restoredState = restoring ? isDeepStrictEqual(existingState, restoring.after.state) ? restoring.before.state : existingState : void 0;
		const next = "restore" in response ? mergePersistedAuthProfileState(restoredRaw, () => restoredState) ?? {
			...createEmptyAuthProfileStore(),
			...coerceAuthProfileState(restoredState)
		} : buildLocalAuthProfileStoreForSave({
			owner: input.owner,
			store: response.store,
			agentDir: input.agentDir,
			options: response.options,
			persistedStores: {
				isMainStore,
				localStore,
				mainStore
			},
			getScopedSharedAuthStore: () => response.scopedSharedStore,
			listRuntimeExternalAuthProfiles: () => response.externalProfiles,
			runtimeStore: response.runtimeStore
		});
		const mutation = prepareAuthProfileStoreMutation({
			existingRaw: existingRaw ?? null,
			existingState,
			store: next,
			selectionProfiles: {
				...mainStore?.profiles,
				..."store" in response ? response.store.profiles : void 0,
				...next.profiles
			}
		});
		const payload = restoring ? restoredRaw === null && Object.keys(readAuthProfileAuthorizationLifetimes(existingRaw)).length === 0 ? null : prepareAuthProfileAuthorizationWrite(existingRaw, restoredRaw ?? {
			version: 1,
			profiles: {}
		}) : "deleteEmptyStore" in response && response.deleteEmptyStore && Object.keys(mutation.payload.profiles).length === 0 && Object.keys(readAuthProfileAuthorizationLifetimes(mutation.payload)).length === 0 ? null : mutation.payload;
		const statePayload = restoring ? restoredState : mutation.statePayload;
		const publication = {
			...mutation.publication,
			credentialsChanged: !isDeepStrictEqual(existingRaw ?? null, payload),
			stateChanged: !isDeepStrictEqual(existingState, statePayload),
			...restoring ? {
				selectionChanged: !isDeepStrictEqual(existingState, statePayload),
				availabilityOnly: false
			} : {}
		};
		let credentialOwner;
		if (publication.credentialsChanged) {
			const { receipt } = authProfileCredentialPublication.capture(sqlPublicationAnchor(database), () => {
				if (payload === null) deleteAuthProfileJsonCell(database, "store", kind);
				else writeAuthProfileJsonCell(database, "store", kind, payload);
			});
			const credentialFacts = authProfileCredentialPublication.bound(receipt);
			const identity = "source" in credentialFacts ? credentialFacts.source.identity : credentialFacts.identity;
			if (typeof identity !== "string") throw new Error("Auth profile credential publication has no admitted owner");
			credentialOwner = {
				identity,
				canonicalPath: credentialFacts.canonicalPath
			};
			deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(database), { authCredentials: credentialFacts });
		}
		if (publication.stateChanged) {
			if (statePayload) writeAuthProfileJsonCell(database, "state", kind, statePayload);
			else deleteAuthProfileJsonCell(database, "state", kind);
		}
		sendAuthProfileUpdateValue(port1, {
			store: markRuntimePersistedProfiles(next),
			authorizationLifetimes: readAuthProfileAuthorizationLifetimes(payload),
			publication,
			credentialOwner,
			..."captureCompensation" in response && response.captureCompensation ? { compensation: {
				before: {
					store: existingRaw ?? null,
					state: existingState
				},
				after: {
					store: payload,
					state: statePayload
				}
			} } : {}
		});
	} finally {
		port1.close();
		port2.close();
	}
}
//#endregion
//#region src/agents/auth-profiles/usage-kernel.ts
/** Reduce the authoritative health row without rewriting credential bytes. */
function recordAuthProfileUsageInDatabase(database, databasePath, databaseKind, input) {
	const parseCell = (text) => {
		try {
			return text === void 0 ? null : JSON.parse(text);
		} catch {
			throw new AuthProfileStoreUnreadableError(databasePath);
		}
	};
	const credentialText = readAuthProfileJsonCellText(database, "store", databaseKind);
	const credentials = parseCell(credentialText);
	const existingState = parseCell(readAuthProfileJsonCellText(database, "state", databaseKind));
	const loaded = mergePersistedAuthProfileState(credentials, () => existingState);
	if (!loaded && credentialText !== void 0) throw new AuthProfileStoreUnreadableError(databasePath);
	const local = loaded ?? {
		version: 1,
		profiles: {}
	};
	const store = input.scopedSharedStore ? mergeAuthProfileStores(input.scopedSharedStore, local) : local;
	const receipt = createAuthProfileUsageReceipt(store);
	const profile = store.profiles[input.profileId];
	if (!profile) return receipt;
	if (!isDeepStrictEqual(local.profiles[input.profileId], input.expectedCredential)) throw new Error("Auth credentials changed during usage preparation");
	const previous = store.usageStats?.[input.profileId];
	const now = Date.now();
	const canonicalProvider = (provider) => {
		const normalized = normalizeProviderId(provider);
		return input.providerAliases?.[normalized] ?? normalized;
	};
	const { reduction } = input;
	const next = reduction.kind === "success" ? !profile.setup?.replacement && canonicalProvider(profile.provider) === input.providerKey ? resetAuthProfileFailureState(previous ?? {}, {
		lastProbeAt: now,
		...input.inherited ? {} : { lastUsed: reduction.lastUsed }
	}, reduction.modelId) : void 0 : reduceAuthProfileFailure(profile, previous, reduction, now);
	if (!next) return receipt;
	if (reduction.kind === "success" && !input.inherited && input.providerKey !== void 0) store.lastGood = {
		...Object.fromEntries(Object.entries(store.lastGood ?? {}).filter(([provider]) => canonicalProvider(provider) !== input.providerKey)),
		[input.providerKey]: input.profileId
	};
	store.usageStats = {
		...store.usageStats,
		[input.profileId]: next
	};
	const persisted = {
		...store,
		profiles: local.profiles
	};
	if (input.scopedSharedStore) {
		const localIds = new Set(Object.keys(local.profiles));
		const orderIds = /* @__PURE__ */ new Set([...localIds, ...Object.values(local.order ?? {}).flat()]);
		pruneAuthProfileStoreReferences(persisted, localIds, orderIds);
	}
	const { statePayload, stateChanged, selectionChanged } = prepareAuthProfileStateMutation({
		existingState,
		store: persisted,
		selectionProfiles: local.profiles
	});
	if (stateChanged) writeAuthProfileJsonCell(database, "state", databaseKind, statePayload);
	receipt.result = {
		previous,
		next,
		now
	};
	receipt.publication.stateChanged = stateChanged;
	receipt.publication.selectionChanged = selectionChanged;
	return receipt;
}
//#endregion
export { authProfilePeerGenerationMayMatch as n, updateAuthProfileStoreInDatabase as r, recordAuthProfileUsageInDatabase as t };
