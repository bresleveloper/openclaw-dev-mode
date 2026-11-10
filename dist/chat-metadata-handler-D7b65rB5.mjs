import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, X as validateChatMetadataParams } from "./src-pLJQA6J5.mjs";
import { m as readUserProfileAliasRevision } from "./user-profile-events-CXjmX5Qy.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { o as SESSION_READ_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as readOperatorRolePolicyRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { l as hasSessionReadAccessChanged, u as hiddenSessionNotFound } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as createPreparedReadHandler } from "./prepared-read-C_6yTKv-.mjs";
import { a as projectModelFastModeCatalog, n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { n as chatMetadataSessionFields } from "./session-model-revision-CBPmDUHh.mjs";
import { u as withGatewaySessionEntry } from "./session-utils-store-lW7Wu3P0.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { a as readWorkerPlacementIdentity } from "./placement-projector-DKN6sMLO.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-CmjctvSj.mjs";
import { t as prepareAuthenticatedProfile } from "./users-profile-access-CfM3i27H.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/chat-metadata-session-read.ts
function sameMetadataEntry(previous, current) {
	return previous && current ? !hasSessionReadAccessChanged(previous, current) && chatMetadataSessionFields.every((field) => isDeepStrictEqual(previous[field], current[field])) : previous === current;
}
async function prepareChatMetadataSessionRead(params) {
	const changed = () => new PreparedModelRuntimePublicationSupersededError("Session changed while preparing its metadata. Retry the request.");
	let active = true;
	let retained;
	const releases = [];
	const preparations = /* @__PURE__ */ new Set();
	const release = () => {
		active = false;
		for (const stop of releases.splice(0).toReversed()) stop();
	};
	const assertRefreshable = () => {
		params.assertRequestCurrent();
		if (!active || retained?.canRefresh() === false) throw changed();
	};
	const isCurrent = () => active && retained?.isCurrent() !== false;
	const assertCurrent = () => {
		assertRefreshable();
		if (!isCurrent()) throw changed();
	};
	const options = {
		agentId: params.agentId,
		projection: []
	};
	try {
		if (isIncognitoSessionKey(resolveSessionStoreIdentity(params).canonicalKey)) {
			const selected = await retainGatewaySessionEntryReadOnly(params.sessionKey, params.agentId, sameMetadataEntry, params.cfg);
			releases.push(selected.release);
			const assertNativeCurrent = () => {
				assertRefreshable();
				if (!selected.isCurrentAtResponse()) throw changed();
			};
			assertNativeCurrent();
			return {
				selected,
				isCurrent: selected.isCurrent,
				assertCurrent: assertNativeCurrent,
				beforeRequest: assertNativeCurrent,
				release,
				async withCurrent(consume) {
					assertNativeCurrent();
					return await consume();
				}
			};
		}
		const selected = await withGatewaySessionEntry(params.sessionKey, options, (session) => {
			assertCurrent();
			const sources = new Map([
				{
					agentId: session.readSource?.agentId ?? session.agentId,
					path: session.storePath
				},
				...session.readSource ? [session.readSource] : [],
				...session.capturedReadSources ?? []
			].map((source) => [source.path, source]));
			for (const source of sources.values()) releases.push(registerOpenClawAgentDatabaseAsyncResource({
				...source,
				revoke: release,
				close: async () => {
					release();
					await Promise.allSettled(preparations);
				}
			}));
			if (session.capturedReadSource) {
				if (typeof session.capturedReadSource.databaseIdentity !== "string") throw changed();
				retained = retainPreparedSessionEntryPredicate({
					databaseIdentity: `file:${session.capturedReadSource.databaseIdentity}`,
					sessionKey: session.legacyKey ?? session.canonicalKey,
					entry: session.entry,
					matches: sameMetadataEntry
				});
				releases.push(retained.release);
			}
			return session;
		}, params.cfg, assertCurrent);
		assertCurrent();
		const matchesSelected = (current) => current.agentId === selected.agentId && current.canonicalKey === selected.canonicalKey && current.legacyKey === selected.legacyKey && current.storePath === selected.storePath && isDeepStrictEqual(current.readSource, selected.readSource) && isDeepStrictEqual(current.capturedReadSource, selected.capturedReadSource) && isDeepStrictEqual(current.capturedReadSources, selected.capturedReadSources) && sameMetadataEntry(selected.entry, current.entry);
		return {
			selected,
			isCurrent,
			assertCurrent,
			beforeRequest: assertCurrent,
			release,
			async withCurrent(consume) {
				assertRefreshable();
				const revision = retained?.captureRevision();
				let preparation;
				let failure;
				const reading = withGatewaySessionEntry(params.sessionKey, options, (current) => {
					assertRefreshable();
					if (!matchesSelected(current) || retained && !retained.acknowledge(current.entry, revision)) throw changed();
					assertCurrent();
					preparation = (async () => await consume())();
					const pending = preparation;
					preparations.add(pending);
					const settled = () => preparations.delete(pending);
					pending.then(settled, (error) => {
						failure ??= { error };
						settled();
					});
					return { value: pending };
				}, params.cfg, assertRefreshable);
				try {
					return await (await reading).value;
				} catch (error) {
					failure ??= { error };
					release();
					await Promise.allSettled(preparation ? [preparation] : []);
					throw failure.error;
				}
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/chat-metadata-handler.ts
/** Resolve saved-session grants or capture a new draft's current human authority. */
async function resolveChatMetadataReadParams(options, params, draftAccountSelection) {
	const { respond, context, client, signal } = options;
	const cfg = context.getRuntimeConfig();
	draftAccountSelection?.assertCurrent();
	const requester = await prepareAuthenticatedProfile(options);
	requester.assertCurrent();
	const roleRevision = readOperatorRolePolicyRevision();
	const aliasRevision = readUserProfileAliasRevision();
	const profileInput = client?.authenticatedUserProfile?.profileId;
	const userInput = client?.authenticatedUserId;
	const isRequestCurrent = () => !signal?.aborted && readOperatorRolePolicyRevision() === roleRevision && readUserProfileAliasRevision() === aliasRevision && client?.authenticatedUserProfile?.profileId === profileInput && client?.authenticatedUserId === userInput;
	const assertRequestCurrent = () => {
		if (!isRequestCurrent() || context.getRuntimeConfig() !== cfg) throw new PreparedModelRuntimePublicationSupersededError("Chat metadata access changed while preparing its metadata. Retry the request.");
		requester.assertCurrent();
		draftAccountSelection?.assertCurrent();
	};
	if (params.sessionKey) {
		const sessionKey = params.sessionKey;
		const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, normalizeOptionalString(params.agentId));
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const requesterProfileId = requester.profileId;
		const read = await prepareChatMetadataSessionRead({
			cfg,
			sessionKey,
			agentId: requested.agentId,
			assertRequestCurrent
		});
		const session = read.selected;
		const isCurrent = () => isRequestCurrent() && read.isCurrent();
		const assertVisible = () => {
			const visible = createSessionListEntryFilter({
				client,
				cfg: (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)()
			});
			if (session.entry && visible?.(session.legacyKey ?? session.canonicalKey, session.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
		};
		try {
			assertVisible();
			const sessionId = session.entry?.sessionId;
			const placement = params.includeModels === false ? void 0 : await readSessionWorkerPlacementAsync({
				context,
				sessionId
			});
			const workerInference = placement ? readWorkerPlacementIdentity(placement, context.workerEnvironmentService)?.inference : void 0;
			assertVisible();
			assertRequestCurrent();
			read.assertCurrent();
			return {
				agentId: resolveSessionAgentId({
					sessionKey: params.sessionKey,
					config: session.cfg,
					agentId: requested.agentId
				}),
				sessionKey: session.canonicalKey,
				storePath: session.readSource?.path ?? session.storePath,
				sessionEntry: session.entry,
				...workerInference ? { workerInference } : {},
				isCurrent,
				assertCurrent: () => {
					assertVisible();
					assertRequestCurrent();
					read.assertCurrent();
				},
				withCurrent: (consume) => read.withCurrent(consume),
				beforeRequest: () => {
					assertVisible();
					assertRequestCurrent();
					read.beforeRequest();
				},
				release: read.release,
				requesterProfileId
			};
		} catch (error) {
			read.release();
			throw error;
		}
	}
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0,
		respond,
		cfg
	});
	if (!resolved) return;
	assertRequestCurrent();
	return {
		agentId: resolved.agentId,
		requesterProfileId: draftAccountSelection?.owner ?? requester.profileId,
		isCurrent: isRequestCurrent,
		assertCurrent: assertRequestCurrent,
		...draftAccountSelection ? { draftAccountSelection } : {}
	};
}
const handleChatMetadataRequest = createPreparedReadHandler(async (options) => {
	const { params, respond: respondToCaller, context, client } = options;
	if (!assertValidParams(params, validateChatMetadataParams, "chat.metadata", respondToCaller)) return;
	let scope;
	try {
		scope = await resolveChatMetadataReadParams(options, params, !params.sessionKey && params.authProfileId ? await preparePersonalModelAccountSelection(options, params.authProfileId, SESSION_READ_SCOPE) : void 0);
		if (!scope) return;
		if (params.includeModels === false) {
			scope.includeModels = false;
			scope.ifRevision = params.ifRevision;
		}
		const readScope = scope;
		const assertCurrent = () => {
			readScope.draftAccountSelection?.assertCurrent();
			readScope.assertCurrent?.();
		};
		assertCurrent();
		return {
			assertCurrent,
			release: readScope.release,
			run: async (respond) => {
				const metadata = await context.readChatMetadata(readScope);
				const publish = () => {
					assertCurrent();
					const cfg = context.getRuntimeConfig();
					const policy = metadata.models && prepareOperatorModelPresentation({
						cfg,
						policyConfig: context.getCommittedRuntimeConfig?.() ?? cfg,
						client
					})?.forAgent(readScope.agentId, metadata.models);
					respond(true, projectModelFastModeCatalog(policy ? policy.metadata(metadata) : metadata, client));
				};
				if (readScope.withCurrent) await readScope.withCurrent(publish);
				else publish();
			}
		};
	} catch (error) {
		scope?.release?.();
		throw error;
	}
}, (error, { respond }) => {
	if (error instanceof SessionMutationAuthorizationChangedError) {
		respond(false, void 0, error.error);
		return;
	}
	if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
	respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
});
//#endregion
export { resolveChatMetadataReadParams as n, handleChatMetadataRequest as t };
