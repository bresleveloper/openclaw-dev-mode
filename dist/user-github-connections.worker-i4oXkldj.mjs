import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as parseUserGitHubConnection, l as writeUserGitHubConnectionInDatabase, n as disconnectUserGitHubConnectionInDatabase, o as readCanonicalUserGitHubConnectionInDatabase, r as disconnectedUserGitHubConnection, s as readUserGitHubConnectionInDatabase, t as cancelUserGitHubAuthorizationInDatabase } from "./user-github-connections.kernel-BAl3kDQK.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/user-github-connections.worker.ts
function listUserGitHubConnections(db) {
	if (!tableExists(db, "secret_store_entries") || !tableExists(db, "user_profiles")) return [];
	const query = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, query.selectFrom("secret_store_entries").innerJoin("user_profiles", "user_profiles.id", "secret_store_entries.scope_id").select(["scope_id", "value"]).where("scope_kind", "=", "identity").where("name", "=", "github-connection").where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null).where("merged_into", "is", null).orderBy("scope_id")).rows.flatMap((row) => {
		try {
			return [{
				owner: row.scope_id,
				connection: parseUserGitHubConnection(row.value)
			}];
		} catch {
			return [];
		}
	});
}
function requirePending(current, generation, requestId) {
	if (!current?.pending || current.generation !== generation || current.pending.requestId !== requestId || current.pending.expiresAtMs <= Date.now()) throw new Error("My GitHub authorization changed or expired; start again.");
	return {
		...current,
		pending: current.pending
	};
}
function applyMutation(current, mutation) {
	switch (mutation.kind) {
		case "start": return {
			...current ?? disconnectedUserGitHubConnection(),
			pending: {
				kind: "starting",
				requestId: mutation.requestId,
				createdAtMs: mutation.createdAtMs,
				expiresAtMs: mutation.expiresAtMs
			}
		};
		case "device": return {
			...requirePending(current, mutation.generation, mutation.requestId),
			pending: mutation.device
		};
		case "poll": {
			const owned = requirePending(current, mutation.generation, mutation.requestId);
			if (owned.pending.kind !== "device" || owned.pending.deviceCode !== mutation.deviceCode) throw new Error("My GitHub authorization changed.");
			const result = mutation.result;
			return {
				...owned,
				pending: result.kind === "terminal" ? void 0 : {
					...owned.pending,
					...result.kind === "candidate" ? { candidate: result.candidate } : {
						pollIntervalMs: result.pollIntervalMs,
						nextPollAtMs: result.nextPollAtMs
					}
				}
			};
		}
		case "connect": {
			const owned = requirePending(current, mutation.generation, mutation.requestId);
			const candidate = owned.pending.kind === "device" ? owned.pending.candidate : void 0;
			if (!candidate || candidate.profileId !== mutation.profileId) throw new Error("My GitHub authorization changed.");
			return {
				...owned,
				generation: randomUUID(),
				pending: void 0,
				selection: {
					kind: "connected",
					profileId: candidate.profileId,
					accountId: mutation.accountId,
					login: mutation.login,
					refreshToken: candidate.tokens.refreshToken,
					scopes: candidate.tokens.scopes,
					accessExpiresAtMs: candidate.receivedAtMs + candidate.tokens.expiresInSeconds * 1e3,
					refreshExpiresAtMs: candidate.receivedAtMs + candidate.tokens.refreshTokenExpiresInSeconds * 1e3
				}
			};
		}
		case "expire": return current?.pending && current.pending.expiresAtMs <= mutation.nowMs ? {
			...current,
			pending: void 0
		} : void 0;
		case "beginRefresh":
			if (current?.generation !== mutation.generation || current.selection.kind !== "connected" || current.selection.profileId !== mutation.profileId) throw new Error("My GitHub selection changed.");
			return {
				...current,
				selection: {
					...current.selection,
					refresh: { operationId: mutation.operationId }
				}
			};
	}
	throw new Error("Unknown personal GitHub connection mutation.");
}
function mutate(context, operation) {
	return context.write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const receipt = {
			kind: "user-github-connection",
			changedOwners: [],
			retiredProfileIds: []
		};
		const result = operation(db, (publication) => {
			receipt.changedOwners.push(...publication.changedOwners);
			receipt.retiredProfileIds.push(...publication.retiredProfileIds);
		});
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		deferSqliteWorkerCommitReceipt(db, receipt);
		return result;
	}, { operationLabel: "users.github.mutate" });
}
const userGitHubConnectionOperations = {
	"userGitHubConnections.read": ({ owner }, { open }) => readUserGitHubConnectionInDatabase(open().db, owner),
	"userGitHubConnections.readCanonical": ({ profile }, { open }) => readCanonicalUserGitHubConnectionInDatabase(open().db, profile),
	"userGitHubConnections.list": (_input, { open }) => listUserGitHubConnections(open().db),
	"userGitHubConnections.mutate": (input, context) => {
		return mutate(context, (db, capture) => {
			const { owner, mutation } = input;
			if (mutation.kind === "disconnect") return disconnectUserGitHubConnectionInDatabase(db, owner, capture);
			if (mutation.kind === "cancel") return cancelUserGitHubAuthorizationInDatabase(db, owner, mutation.requestId, capture);
			const current = readUserGitHubConnectionInDatabase(db, owner);
			const next = applyMutation(current, mutation);
			return next ? writeUserGitHubConnectionInDatabase(db, owner, next, current, capture) : void 0;
		});
	},
	"userGitHubConnections.refresh": (input, context) => mutate(context, (db, capture) => {
		const resolved = readCanonicalUserGitHubConnectionInDatabase(db, input.owner);
		if (!resolved) return false;
		const { owner, connection: current } = resolved;
		const selection = current?.selection;
		if (!current || selection?.kind !== "connected" || selection.profileId !== input.profileId || selection.refresh?.operationId !== input.operationId) return false;
		const result = input.result;
		const next = result.kind === "rotated" ? {
			...selection,
			refreshToken: result.tokens.refreshToken,
			scopes: result.tokens.scopes,
			accessExpiresAtMs: result.receivedAtMs + result.tokens.expiresInSeconds * 1e3,
			refreshExpiresAtMs: result.receivedAtMs + result.tokens.refreshTokenExpiresInSeconds * 1e3,
			refreshFailure: void 0,
			refresh: {
				operationId: input.operationId,
				tokens: result.tokens,
				receivedAtMs: result.receivedAtMs
			}
		} : {
			...selection,
			refresh: void 0,
			...result.kind === "materialized" ? {
				login: result.login,
				refreshFailure: void 0
			} : { refreshFailure: result.failure }
		};
		writeUserGitHubConnectionInDatabase(db, owner, {
			...current,
			selection: next
		}, current, capture);
		return true;
	})
};
//#endregion
export { userGitHubConnectionOperations };
