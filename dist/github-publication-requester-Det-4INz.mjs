import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { c as onUserProfilesChanged, t as UserProfileMutationUnsettledError } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { l as prepareUserProfileIdentity } from "./user-profile-list-BdNJnrJe.mjs";
import { p as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as githubPublicationReceipts } from "./github-publication-receipts-WUg6AvYk.mjs";
import { i as authorizePreparedSessionMutation, n as authorizeIncognitoSessionTarget, x as prepareSessionCreatorProfile } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { n as observeUserGitHubConnectionAuthority } from "./user-github-connection-events-CptgDKbj.mjs";
import { i as GitHubPublicationRequesterUnavailableError } from "./github-publication-failure-ByPq2Muc.mjs";
import { t as GitHubPublicationRecoveryPendingError } from "./github-publication-git-index-4ApBmbV1.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { c as resumeGatewayOperatorAccessGrant, n as GatewayOperatorAccessDeniedError } from "./operator-access-policy-D9L4Y9uO.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { t as decodeGitHubPublicationRequester } from "./github-publication-requester-DXNenk0m.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/sqlite-source-fence-admission.ts
const SOURCE_FENCE_WAITING = 0;
const SOURCE_FENCE_REVOKED = 3;
/**
* Each dispatch gets one revocable acceptance decision. Once accepted, the broker
* retains native settlement; cancellation cannot release SQLite reservations.
*/
function createSqliteSourceFenceAdmission(options) {
	if (options.sources.length === 0) throw new Error("SQLite source fence requires an explicit source");
	const owners = [options.destination, ...options.sources];
	const identities = owners.map(({ identity }) => {
		if (!identity.physical.key.startsWith("file:") || !identity.incarnation) throw new Error("SQLite source fence requires retained durable owners");
		return structuredClone(identity);
	});
	const destination = structuredClone(options.destination.identity);
	return (operation) => {
		const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
		const signals = /* @__PURE__ */ new Set([options.signal, ...owners.map((owner) => owner.signal)]);
		const revoke = () => {
			for (;;) {
				const current = Atomics.load(decision, 0);
				if (current === 2 || current === SOURCE_FENCE_REVOKED) return;
				if (Atomics.compareExchange(decision, 0, current, SOURCE_FENCE_REVOKED) === current) return;
			}
		};
		const assertCurrent = () => {
			if ([...signals].some((signal) => signal.aborted)) revoke();
			if (Atomics.load(decision, 0) === SOURCE_FENCE_REVOKED || process.hrtime.bigint() >= options.deadlineNs) throw new SqliteWorkerError("SQLite source fence authority expired", "closed");
			for (const owner of owners) owner.assertCurrent();
		};
		assertCurrent();
		for (const owner of owners) owner.retain(operation);
		for (const signal of signals) signal.addEventListener("abort", revoke, { once: true });
		const detach = () => {
			revoke();
			for (const signal of signals) signal.removeEventListener("abort", revoke);
		};
		const attachment = {
			kind: "sqlite-source-fence",
			version: 1,
			decision: decision.buffer,
			destination,
			sources: identities.slice(1),
			deadlineNs: options.deadlineNs
		};
		try {
			const admission = createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "prepare" || request.facts !== "sqlite-source-fence" || Atomics.load(decision, 0) !== SOURCE_FENCE_WAITING) throw new SqliteWorkerError("SQLite source fence admission requested out of order", "closed");
				assertCurrent();
				if (!grant(() => {
					if (Atomics.compareExchange(decision, 0, SOURCE_FENCE_WAITING, 1) !== SOURCE_FENCE_WAITING) throw new SqliteWorkerError("SQLite source fence authority expired", "closed");
				})) revoke();
			}, attachment);
			operation.settled.then(detach, detach);
			return {
				admission,
				nativeLocations: identities.map((identity) => identity.physical.canonicalPath)
			};
		} catch (error) {
			detach();
			throw error;
		}
	};
}
//#endregion
//#region src/gateway/github-publication-source.ts
const { bindings, destinationIncarnations } = resolveGlobalSingleton(Symbol.for("openclaw.githubPublicationSourceCapabilities"), () => ({
	bindings: /* @__PURE__ */ new WeakMap(),
	destinationIncarnations: /* @__PURE__ */ new WeakMap()
}));
/** Compose the publication runtime's lifetime before native admission captures its signals. */
function bindGitHubPublicationSourceLifetime(capability, lifetime) {
	const binding = bindings.get(capability);
	if (!binding || binding.admitted) throw new Error("GitHub publication source lifetime was already admitted.");
	const signal = AbortSignal.any([binding.signal, lifetime]);
	signal.throwIfAborted();
	binding.signal = signal;
	if (binding.kind === "durable") {
		binding.source = {
			...binding.source,
			signal
		};
		binding.destination = {
			...binding.destination,
			signal
		};
	}
	return capability;
}
function bindGitHubPublicationSource(capability) {
	const binding = bindings.get(capability);
	if (!binding) throw new Error("GitHub publication source capability is unavailable.");
	binding.signal.throwIfAborted();
	return {
		context: binding.context,
		predicate: binding.predicate,
		createAdmission: ((operation) => {
			binding.admitted = true;
			if (binding.kind === "memory") {
				binding.retain(operation);
				return {
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						if (request.stage !== "prepare") throw new Error("Memory publication authority requires a preparation grant.");
						binding.signal.throwIfAborted();
						binding.assertCurrent();
						grant();
					}),
					nativeLocations: [binding.context.admission.databasePath]
				};
			}
			return createSqliteSourceFenceAdmission({
				destination: binding.destination,
				sources: [binding.source],
				signal: binding.signal,
				deadlineNs: process.hrtime.bigint() + 120000000000n
			})(operation);
		})
	};
}
function readMemorySourceFacts(captured, sessionKey) {
	const snapshot = captured.owner ? captured.owner.readSession(sessionKey, captured.authority) : captured.binding?.actor.storage?.readCurrent({
		type: "session.members.read",
		input: {}
	}, captured.authority);
	const entry = snapshot?.entry;
	return {
		entry: entry && {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision,
			archivedAt: entry.archivedAt,
			visibility: entry.visibility,
			incognito: entry.incognito,
			createdActor: entry.createdActor,
			owner: entry.owner,
			worktree: entry.worktree,
			repositoryWorkspaceId: entry.repositoryWorkspaceId
		},
		members: snapshot?.members ?? []
	};
}
async function prepareMemoryPublicationSource(params, context, captured) {
	const memory = readMemorySourceFacts(captured, params.selector.sessionKey);
	const source = {
		memory,
		selector: structuredClone(params.selector)
	};
	const expected = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubPublication.sourceFacts",
		input: { source }
	}), {
		signal: params.signal,
		assertCurrent: () => params.assertCurrent()
	});
	const pending = /* @__PURE__ */ new Set();
	let released = false;
	const capability = Object.freeze({
		version: 1,
		async release() {
			released = true;
			await Promise.allSettled(pending);
		}
	});
	bindings.set(capability, {
		kind: "memory",
		context,
		predicate: {
			...source,
			expected
		},
		signal: params.signal,
		admitted: false,
		assertCurrent() {
			context.admission.assertCurrent();
			params.assertCurrent();
			if (released || !isDeepStrictEqual(readMemorySourceFacts(captured, params.selector.sessionKey), memory)) throw new Error("GitHub publication source authority changed.");
		},
		retain(operation) {
			pending.add(operation.settled);
			operation.settled.then(() => pending.delete(operation.settled), () => pending.delete(operation.settled));
		}
	});
	return capability;
}
/** Host policy executes before reservation; the worker rechecks every durable source fact. */
async function prepareGitHubPublicationSource(params) {
	params.signal.throwIfAborted();
	params.assertCurrent();
	const context = captureOpenClawStateWorkerContext();
	const memory = captureSessionActorStorageOwner({
		...params.selector,
		storePath: params.sourcePath
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return prepareMemoryPublicationSource(params, context, memory);
	const physical = readDatabasePathIdentitySync(params.sourcePath);
	if (!physical.key.startsWith("file:") || physical.birthtime === void 0) throw new Error("GitHub publication requires an admitted durable source.");
	const closed = new AbortController();
	const signal = AbortSignal.any([params.signal, closed.signal]);
	const pending = /* @__PURE__ */ new Set();
	const releases = [];
	let releasing;
	let binding;
	const revoke = () => closed.abort(/* @__PURE__ */ new Error("GitHub publication source authority changed."));
	const drain = async () => {
		revoke();
		await Promise.allSettled(pending);
	};
	const release = () => releasing ??= (async () => {
		await drain();
		for (const stop of releases.splice(0).toReversed()) stop();
	})();
	const assertCurrent = () => {
		signal.throwIfAborted();
		context.admission.assertCurrent();
		assertExistingDatabaseIdentity(params.sourcePath, physical.key, physical.birthtime);
	};
	const retain = (operation) => {
		assertCurrent();
		pending.add(operation.settled);
		operation.settled.then(() => pending.delete(operation.settled), () => pending.delete(operation.settled));
	};
	const sourceIdentity = {
		physical,
		incarnation: randomUUID()
	};
	releases.push(registerOpenClawAgentDatabaseAsyncResource({
		agentId: params.selector.agentId,
		path: params.sourcePath,
		revoke,
		close: drain
	}), registerOpenClawStateDatabaseAsyncResource({ close: drain }), registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened" && event.path === context.admission.databasePath) revoke();
	}), onUserProfilesChanged(revoke), observeUserGitHubConnectionAuthority(({ databasePath, changedOwners }) => {
		if (databasePath === context.admission.databasePath && params.selector.personalOwnerProfileId !== void 0 && changedOwners.includes(params.selector.personalOwnerProfileId)) revoke();
	}), githubPublicationReceipts.subscribeFacts((change, deletionPending) => {
		if (change.kind === "pending" && deletionPending && change.identity === context.admission.identity.key && !binding?.admitted || change.kind === "unknown" && change.identity === context.admission.identity.key || change.kind === "committed" && change.receipt.source.identity === context.admission.identity.key && [...change.receipt.facts.values()].some((fact) => fact.kind !== "postimage")) revoke();
	}), sessionChanges.subscribeFacts((change) => {
		if ("all" in change || change.sessionKey === params.selector.sessionKey) revoke();
	}));
	try {
		let incarnation = destinationIncarnations.get(context.admission);
		if (!incarnation) {
			incarnation = randomUUID();
			destinationIncarnations.set(context.admission, incarnation);
		}
		const sourceRead = {
			source: sourceIdentity,
			destination: {
				physical: context.admission.identity,
				incarnation
			},
			selector: structuredClone(params.selector)
		};
		const expected = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "githubPublication.sourceFacts",
			input: { source: sourceRead }
		}), {
			signal,
			assertCurrent
		});
		sourceRead.destination.physical = context.admission.identity;
		params.assertCurrent();
		assertCurrent();
		const capability = Object.freeze({
			version: 1,
			release
		});
		binding = {
			kind: "durable",
			context,
			predicate: {
				...sourceRead,
				expected
			},
			source: {
				identity: sourceIdentity,
				signal,
				assertCurrent: () => {
					params.assertCurrent();
					assertCurrent();
				},
				retain
			},
			destination: {
				identity: sourceRead.destination,
				signal,
				assertCurrent,
				retain
			},
			signal,
			admitted: false
		};
		bindings.set(capability, binding);
		return capability;
	} catch (error) {
		await release();
		throw error;
	}
}
//#endregion
//#region src/gateway/github-publication-requester.ts
function assertPublicationIncognitoAccess(profileId, scopes, sessionKey) {
	const client = createSyntheticPluginRuntimeClient({
		operatorRoleActor: {
			kind: "operator",
			profileId
		},
		scopes: [...scopes]
	});
	if (authorizeIncognitoSessionTarget({
		client,
		sessionKey,
		target: null
	})) throw new GitHubPublicationRequesterUnavailableError();
}
async function preparePublicationSession(session, config) {
	try {
		return await prepareSessionMutationFacts({
			cfg: config,
			...session
		});
	} catch (error) {
		throw new GitHubPublicationRecoveryPendingError("GitHub publication session authorization is unavailable; retry after session storage is ready.", { cause: error });
	}
}
const workerRequesters = resolveGlobalSingleton(Symbol.for("openclaw.githubPublicationWorkerRequesters"), () => /* @__PURE__ */ new WeakSet());
/** Classify before invoking any released assertion; a failed worker command never selects legacy. */
function isGitHubPublicationRequesterV2(requester) {
	return workerRequesters.has(requester);
}
function prepareRequesterPolicy(snapshot, session, getCommittedRuntimeConfig, identity, sessionFacts, onPolicy) {
	const client = createSyntheticPluginRuntimeClient({
		operatorRoleActor: snapshot.actor,
		scopes: [...snapshot.scopes]
	});
	const assertIdentity = () => {
		if (snapshot.actor.kind !== "operator") return;
		try {
			if (!identity) throw new GitHubPublicationRequesterUnavailableError();
			return identity.readCurrentFacts(snapshot.grant?.aliasBindingIds);
		} catch (error) {
			if (error instanceof UserProfileMutationUnsettledError) throw new GitHubPublicationRecoveryPendingError("GitHub publication identity authorization is unavailable; retry after the profile mutation settles.", { cause: error });
			throw new GitHubPublicationRequesterUnavailableError();
		}
	};
	const assertRole = (profile, config) => {
		const role = profile ? resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, config, profile.githubLogin ?? null) : void 0;
		if (!roleScopesAllow({
			role: "operator",
			requestedScopes: ["operator.sessions.write"],
			allowedScopes: snapshot.scopes
		}) || role && (!roleScopesAllow({
			role: "operator",
			requestedScopes: snapshot.scopes,
			allowedScopes: role.scopes
		}) || role.accessPolicyPlugin && role.accessPolicyPlugin !== snapshot.grant?.pluginId)) throw new GitHubPublicationRequesterUnavailableError();
		return role;
	};
	const assertPrepared = (config) => {
		const current = assertIdentity();
		const role = assertRole(current?.profile, config);
		if (current) {
			let facts;
			try {
				if (!sessionFacts) throw new Error("Prepared publication session is missing");
				facts = sessionFacts.readCurrent(config);
			} catch (error) {
				throw new GitHubPublicationRecoveryPendingError("GitHub publication session authorization is unavailable; retry after session storage is ready.", { cause: error });
			}
			if (snapshot.actor.kind === "operator" && !roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.write"],
				allowedScopes: snapshot.scopes
			}) && !prepareSessionCreatorProfile(snapshot.actor.profileId, current.aliases)(facts.target.entry.createdActor)) throw new GitHubPublicationRequesterUnavailableError();
			if (authorizePreparedSessionMutation({
				cfg: config,
				client,
				...session
			}, facts, {
				policy: role,
				aliases: current.aliases,
				authorizesAgentRun: false
			})) throw new GitHubPublicationRequesterUnavailableError();
		}
		return current?.profile;
	};
	return () => {
		const config = getCommittedRuntimeConfig();
		const profile = assertPrepared(config);
		if (profile) {
			try {
				const authority = resumeGatewayOperatorAccessGrant(profile, config, snapshot.grant);
				onPolicy?.(authority);
			} catch (error) {
				if (error instanceof GatewayOperatorAccessDeniedError) throw new GitHubPublicationRequesterUnavailableError();
				throw error;
			}
			assertPrepared(getCommittedRuntimeConfig());
		}
	};
}
/** Capture from the admitted caller, never request arguments, publisher, or session attribution. */
async function prepareGitHubPublicationRequesterV2(options, session) {
	options.signal?.throwIfAborted();
	options.sessionMutationAuthorization?.assertCurrent();
	const source = await captureGatewayOperatorRunAuthority(options);
	let identity;
	let sessionFacts;
	const lifetime = new AbortController();
	const release = () => {
		lifetime.abort(new GitHubPublicationRequesterUnavailableError());
		sessionFacts?.release();
		identity?.release();
		source?.release();
	};
	try {
		const system = (source ? {
			kind: "operator",
			profileId: source.authority.profileId
		} : resolveGatewayOperatorRoleActor(options.client))?.kind === "system" || options.client?.authenticatedUserProfile?.profileId === "gateway-owner";
		if (!source && !system || options.client?.connect.role !== "operator" || source && source.authority.gatewayAccessGrant === void 0) throw new GitHubPublicationRequesterUnavailableError();
		let grant = null;
		if (source) {
			assertPublicationIncognitoAccess(source.authority.profileId, source.authority.scopes, session.sessionKey);
			identity = await prepareUserProfileIdentity(source.authority.profileId);
			sessionFacts = await preparePublicationSession(session, (options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)());
			if (source.authority.gatewayAccessGrant) grant = Object.freeze({
				...source.authority.gatewayAccessGrant,
				aliasBindingIds: identity.emailBindingIds
			});
		}
		const snapshot = Object.freeze({
			version: 1,
			actor: Object.freeze(source ? {
				kind: "operator",
				profileId: source.authority.profileId
			} : { kind: "system" }),
			scopes: Object.freeze([...source?.authority.scopes ?? options.client.connect.scopes ?? []]),
			grant
		});
		let policyAuthority;
		const assertPolicy = prepareRequesterPolicy(snapshot, session, options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig, identity, sessionFacts, (authority) => {
			policyAuthority = authority;
		});
		const signal = AbortSignal.any([
			lifetime.signal,
			...options.signal ? [options.signal] : [],
			...source?.authority.signal ? [source.authority.signal] : []
		]);
		const assertInvocationCurrent = () => {
			try {
				signal.throwIfAborted();
				if (options.hasCurrentClientAuthority?.() === false) throw new GitHubPublicationRequesterUnavailableError();
				options.sessionMutationAuthorization?.assertCurrent();
				source?.authority.assertCurrent();
			} catch {
				throw new GitHubPublicationRequesterUnavailableError();
			}
		};
		const requester = Object.freeze({
			version: 2,
			signal,
			snapshot,
			assertInvocationCurrent,
			assertCurrent: () => {
				assertInvocationCurrent();
				assertPolicy();
				assertInvocationCurrent();
			},
			async prepareSource(selector) {
				requester.assertCurrent();
				if (selector.agentId !== session.agentId || selector.sessionKey !== session.sessionKey) throw new GitHubPublicationRequesterUnavailableError();
				sessionFacts ??= await preparePublicationSession(session, (options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)());
				requester.assertCurrent();
				const { sourcePath } = sessionFacts.readCurrent((options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)());
				if (!sourcePath) throw new GitHubPublicationRecoveryPendingError("GitHub publication source is unavailable; retry after session storage is ready.");
				return await prepareGitHubPublicationSource({
					sourcePath,
					selector: {
						...selector,
						...snapshot.actor.kind === "operator" ? {
							profileId: snapshot.actor.profileId,
							aliasBindingIds: snapshot.grant?.aliasBindingIds
						} : {}
					},
					signal: AbortSignal.any([signal, ...policyAuthority ? [policyAuthority.signal] : []]),
					assertCurrent: requester.assertCurrent
				});
			}
		});
		workerRequesters.add(requester);
		requester.assertCurrent();
		return {
			requester,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Restoration rechecks the original immutable basis; a new role or invitation cannot replace it. */
async function restoreGitHubPublicationRequester(json, session, getCommittedRuntimeConfig) {
	const snapshot = decodeGitHubPublicationRequester(json);
	if (!snapshot) throw new GitHubPublicationRequesterUnavailableError();
	let identity;
	let sessionFacts;
	const lifetime = new AbortController();
	if (snapshot.actor.kind === "operator") {
		assertPublicationIncognitoAccess(snapshot.actor.profileId, snapshot.scopes, session.sessionKey);
		try {
			identity = await prepareUserProfileIdentity(snapshot.actor.profileId);
			sessionFacts = await preparePublicationSession(session, getCommittedRuntimeConfig());
		} catch (error) {
			identity?.release();
			if (error instanceof GitHubPublicationRecoveryPendingError) throw error;
			throw new GitHubPublicationRecoveryPendingError("GitHub publication requester identity is unavailable; retry recovery after profile storage is ready.", { cause: error });
		}
	}
	const release = () => {
		lifetime.abort(new GitHubPublicationRequesterUnavailableError());
		sessionFacts?.release();
		identity?.release();
	};
	try {
		let policyAuthority;
		const assertPolicy = prepareRequesterPolicy(snapshot, session, getCommittedRuntimeConfig, identity, sessionFacts, (authority) => {
			policyAuthority = authority;
		});
		const requester = Object.freeze({
			version: 2,
			signal: lifetime.signal,
			snapshot,
			assertCurrent() {
				lifetime.signal.throwIfAborted();
				assertPolicy();
			},
			async prepareSource(selector) {
				requester.assertCurrent();
				if (selector.agentId !== session.agentId || selector.sessionKey !== session.sessionKey) throw new GitHubPublicationRequesterUnavailableError();
				sessionFacts ??= await preparePublicationSession(session, getCommittedRuntimeConfig());
				requester.assertCurrent();
				const { sourcePath } = sessionFacts.readCurrent(getCommittedRuntimeConfig());
				if (!sourcePath) throw new GitHubPublicationRecoveryPendingError("GitHub publication source is unavailable; retry after session storage is ready.");
				return await prepareGitHubPublicationSource({
					sourcePath,
					selector: {
						...selector,
						...snapshot.actor.kind === "operator" ? {
							profileId: snapshot.actor.profileId,
							aliasBindingIds: snapshot.grant?.aliasBindingIds
						} : {}
					},
					signal: AbortSignal.any([lifetime.signal, ...policyAuthority ? [policyAuthority.signal] : []]),
					assertCurrent: requester.assertCurrent
				});
			},
			release
		});
		workerRequesters.add(requester);
		requester.assertCurrent();
		return requester;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { bindGitHubPublicationSourceLifetime as a, bindGitHubPublicationSource as i, prepareGitHubPublicationRequesterV2 as n, restoreGitHubPublicationRequester as r, isGitHubPublicationRequesterV2 as t };
