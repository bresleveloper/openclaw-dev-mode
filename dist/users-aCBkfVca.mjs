import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { As as validateUsersListChannelIdentitiesParams, Bs as validateUsersPrefsGetParams, Cs as validateUsersGitHubStatusParams, Ds as validateUsersLinkEmailParams, Gs as validateUsersSetAvatarParams, Hs as validateUsersSelectModelAccountParams, Is as validateUsersMergeParams, Ms as validateUsersListModelAccountsParams, Ns as validateUsersListParams, Qs as validateUsersUnlinkChannelIdentityParams, Rs as validateUsersPersonalFileGetParams, Ss as validateUsersGitHubDisconnectParams, Ts as validateUsersLinkChannelIdentityParams, Us as validateUsersSelfParams, Vs as validateUsersPrefsSetParams, Ys as validateUsersSetRoleParams, Zs as validateUsersUnlinkAuthProfileParams, _s as validateUsersAuthConnectStartParams, bs as validateUsersGitHubAuthorizePollParams, gs as validateUsersAuthConnectCatalogParams, hs as validateUsersAuthConnectCancelParams, ks as validateUsersListAuthLinksParams, ms as validateUsersAuthConnectAnswerParams, qs as validateUsersSetDisplayNameParams, vs as validateUsersAuthConnectStatusParams, ws as validateUsersLinkAuthProfileParams, xs as validateUsersGitHubAuthorizeStartParams, ys as validateUsersGitHubAuthorizeCancelParams, zs as validateUsersPersonalFileSetParams } from "./src-l2dWvEsN.mjs";
import { C as UserProfileMergeError, T as UserProfileOwnerError, c as projectUserProfileDisplay, w as UserProfileNotFoundError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { _ as profileCatalogPath, c as readResidentUserProfileId, d as readUserProfileIdentity, i as hasMultipleSessionSharingIdentities, l as readResidentUserProfileRevision } from "./user-profile-list-CtETKur7.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as listProfiles, i as getUserProfileListItem, p as readUserProfileSnapshot } from "./user-profiles-DYQbtiqy.mjs";
import { f as resolveOperatorRolePolicyForAssignment, i as invalidateOperatorRolePolicy, m as resolveOperatorRoleSelection } from "./operator-role-policy-BqPaarjx.mjs";
import { n as UserChannelIdentityConflictError } from "./user-channel-identities-B5nWYNy7.mjs";
import { n as changeCanonicalUserChannelIdentity, r as listCanonicalUserChannelIdentities } from "./user-channel-identity-operations-COzOBly4.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
import { i as isValidBase64 } from "./base64-CU53EX1R.mjs";
import { a as getGatewayToolCallerIdentity, s as resolveGatewayPersonalToolParticipant, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DWr-fdGt.mjs";
import { v as resolveSystemGitHubIdentityStatus } from "./github-tool-identity-2S4ost1l.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-BgtfQbi3.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as isIneligiblePersonalGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DnDs09-7.mjs";
import { r as enqueueWorkspaceFileUpdate } from "./workspace-fs-CdJgcGwn.mjs";
import { a as mergeCanonicalUserProfiles, c as setCanonicalUserProfileRole, i as linkCanonicalUserProfileEmail, o as setCanonicalUserProfileAvatar, s as setCanonicalUserProfileDisplayName } from "./user-profile-writes-BHwuU9Y3.mjs";
import { n as defineValidatedGatewayHandler, r as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { r as setCanonicalUserPreferences, t as getCanonicalUserPreferences } from "./user-preferences-ChnHlrwX.mjs";
import { n as ModelAccountConnectInputError, t as ModelAccountConnectAuthorityError } from "./model-account-connect-CZ6O5eqZ.mjs";
import { i as prepareUserModelAccountAction } from "./users-model-account-access-FDkaQbfU.mjs";
import { n as prepareProfileMutationAccess, r as prepareUserProfileAdministration, t as prepareAuthenticatedProfile } from "./users-profile-access-DD95ZM-3.mjs";
import { n as preparePersonalGitHubAction } from "./github-personal-authorization-BW9W2okB.mjs";
import { t as publishUserPreferencesChanged } from "./user-preference-events-B6-wR4DP.mjs";
import { t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-CmUdS71i.mjs";
//#region src/gateway/server-methods/users-auth-connect.ts
function connectHandler(method, validate, run, requiredScope = "operator.write") {
	return defineValidatedGatewayHandler(method, validate, async (options) => {
		const action = await prepareUserModelAccountAction(options, options.params.profileId, requiredScope);
		const service = options.context.modelAccountConnectService;
		if (!service) throw new Error("Model-account service is not running.");
		options.respond(true, await run(service, action, options.params));
	}, (error) => error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof ModelAccountConnectInputError || error instanceof UserProfileNotFoundError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message) : errorShape(ErrorCodes.UNAVAILABLE, "Model account connect is unavailable right now; try again shortly."));
}
const usersAuthConnectHandlers = {
	"users.listAuthLinks": connectHandler("users.listAuthLinks", validateUsersListAuthLinksParams, (service, action) => service.listLinks(action), "operator.read"),
	"users.linkAuthProfile": connectHandler("users.linkAuthProfile", validateUsersLinkAuthProfileParams, (service, action, params) => service.link(action, params.authProfileId), "operator.admin"),
	"users.unlinkAuthProfile": connectHandler("users.unlinkAuthProfile", validateUsersUnlinkAuthProfileParams, (service, action, params) => service.unlink(action, params.provider)),
	"users.listModelAccounts": connectHandler("users.listModelAccounts", validateUsersListModelAccountsParams, (service, action, params) => service.list(action, params.cursor), "operator.read"),
	"users.selectModelAccount": connectHandler("users.selectModelAccount", validateUsersSelectModelAccountParams, (service, action, params) => service.select(action, params.authProfileId)),
	"users.authConnect.start": connectHandler("users.authConnect.start", validateUsersAuthConnectStartParams, (service, action, params) => service.start(action, params.provider, params.method)),
	"users.authConnect.answer": connectHandler("users.authConnect.answer", validateUsersAuthConnectAnswerParams, (service, action, params) => service.answer(action, params.connectId, params.stepId, params.value)),
	"users.authConnect.status": connectHandler("users.authConnect.status", validateUsersAuthConnectStatusParams, (service, action, params) => service.status(action, params.connectId)),
	"users.authConnect.cancel": connectHandler("users.authConnect.cancel", validateUsersAuthConnectCancelParams, (service, action, params) => service.cancel(action, params.connectId)),
	"users.authConnect.catalog": connectHandler("users.authConnect.catalog", validateUsersAuthConnectCatalogParams, (service, action) => service.catalog(action))
};
//#endregion
//#region src/gateway/server-methods/users-channel-identities.ts
function identityError(error) {
	return errorShape(error instanceof UserChannelIdentityConflictError || error instanceof UserProfileNotFoundError || error instanceof UserProfileOwnerError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
function identityMutationHandler(method, validate, action) {
	return defineValidatedGatewayMethod(method, validate, async (options) => {
		const { params, respond } = options;
		const assertCurrent = await prepareUserProfileAdministration(options);
		const result = await changeCanonicalUserChannelIdentity(action, params.profileId, params.identity, { assertCurrent });
		if (result.kind !== (action === "link" ? "linked" : "unlinked")) throw new Error("Channel identity mutation returned an unexpected result");
		respond(true, result.kind === "linked" ? result.link : { removed: result.removed });
	}, identityError);
}
const usersChannelIdentityHandlers = {
	"users.linkChannelIdentity": identityMutationHandler("users.linkChannelIdentity", validateUsersLinkChannelIdentityParams, "link"),
	"users.unlinkChannelIdentity": identityMutationHandler("users.unlinkChannelIdentity", validateUsersUnlinkChannelIdentityParams, "unlink"),
	"users.listChannelIdentities": defineValidatedGatewayMethod("users.listChannelIdentities", validateUsersListChannelIdentitiesParams, async (options) => {
		const { params, respond } = options;
		const assertCurrent = await prepareUserProfileAdministration(options);
		const links = await listCanonicalUserChannelIdentities(params.profileId);
		assertCurrent();
		respond(true, { links });
	}, identityError)
};
//#endregion
//#region src/gateway/server-methods/users-github.ts
function runPersonalGitHub(options, fallbackError, run) {
	const fail = (error) => options.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error instanceof Error ? error.message : fallbackError));
	try {
		const action = preparePersonalGitHubAction(options);
		const service = options.context.githubOAuthService?.personal;
		if (!service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const result = run(action, service);
		if (result instanceof Promise) return result.then((value) => {
			action.assertCurrent();
			options.respond(true, value);
		}).catch(fail);
		options.respond(true, result);
	} catch (error) {
		fail(error);
	}
}
const usersGitHubHandlers = {
	"users.github.status": defineValidatedGatewayMethod("users.github.status", validateUsersGitHubStatusParams, (options) => runPersonalGitHub(options, "My GitHub is unavailable.", async (action, service) => {
		const config = options.context.getRuntimeConfig();
		const system = await resolveSystemGitHubIdentityStatus({
			config,
			sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? config
		});
		return {
			personal: await service.status(action),
			system
		};
	})),
	"users.github.authorize.start": defineValidatedGatewayMethod("users.github.authorize.start", validateUsersGitHubAuthorizeStartParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => service.startAuthorization(action))),
	"users.github.authorize.poll": defineValidatedGatewayMethod("users.github.authorize.poll", validateUsersGitHubAuthorizePollParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => service.pollAuthorization(action, options.params.requestId))),
	"users.github.authorize.cancel": defineValidatedGatewayMethod("users.github.authorize.cancel", validateUsersGitHubAuthorizeCancelParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", (action, service) => ({ cancelled: service.cancelAuthorization(action, options.params.requestId) }))),
	"users.github.disconnect": defineValidatedGatewayMethod("users.github.disconnect", validateUsersGitHubDisconnectParams, (options) => runPersonalGitHub(options, "My GitHub disconnect failed.", (action, service) => {
		service.disconnect(action);
		return { disconnected: true };
	}))
};
//#endregion
//#region src/gateway/server-methods/users-personal-file.ts
var PersonalFileAccessError = class extends Error {};
function preparePersonalFile(options, requestedAgentId) {
	const { client, context } = options;
	if (!listAgentIds(context.getRuntimeConfig()).includes(requestedAgentId)) throw new PersonalFileAccessError("Select an existing agent to edit your personal instructions.");
	const agentId = requestedAgentId;
	const workspaceDir = resolveAgentWorkspaceDir(context.getRuntimeConfig(), agentId);
	const operatorAuthority = client?.internal?.operatorRunAuthority;
	const toolCaller = getGatewayToolCallerIdentity();
	const assertToolCurrent = captureGatewayToolCallerAssertion();
	const currentProfile = () => {
		try {
			resolveGatewayPersonalToolParticipant(client?.internal?.agentRuntimeIdentity, { requireSingleParticipant: true })?.assertCurrent();
		} catch (error) {
			throw new PersonalFileAccessError("Personal instructions are unavailable in this turn. Ask in your own Control UI turn with a new message.", { cause: error });
		}
		options.sessionMutationCommitGuard?.();
		if (!hasMultipleSessionSharingIdentities()) throw new PersonalFileAccessError("Personal instructions are only available on multi-user Gateways. Use the agent workspace USER.md on a single-user Gateway.");
		if (!client || client.invalidated || client.connectionSignal?.aborted || client.connect.role !== "operator" || options.signal?.aborted) throw new PersonalFileAccessError("Personal instructions require a current signed-in connection.");
		let id;
		if (operatorAuthority) {
			assertAdmittedRunOperatorAuthority(operatorAuthority);
			const requesterAuthority = toolCaller?.operatorAuthority;
			if (client.internal?.syntheticClient !== true || !requesterAuthority?.source || requesterAuthority.source !== operatorAuthority.source || requesterAuthority.profileId !== operatorAuthority.profileId || !assertToolCurrent) throw new PersonalFileAccessError("Personal instructions require an admitted user turn.");
			assertAdmittedRunOperatorAuthority(requesterAuthority);
			assertToolCurrent();
			operatorAuthority.assertCurrent();
			id = operatorAuthority.profileId;
		} else {
			if (isIneligiblePersonalGatewayCaller(client) || isGatewayClientProfilePending(client) || !client.connId || !context.getClientConnIds?.((current) => current === client).has(client.connId)) throw new PersonalFileAccessError("Personal instructions require a current signed-in connection.");
			id = client.authenticatedUserProfile?.profileId;
		}
		const canonicalId = id ? readResidentUserProfileId(id) : void 0;
		if (!canonicalId || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(canonicalId)) throw new PersonalFileAccessError("Sign in with a durable profile to edit personal instructions.");
		const cfg = context.getRuntimeConfig();
		const profile = readUserProfileIdentity(canonicalId);
		const policy = resolveOperatorRolePolicyForAssignment(canonicalId, profile?.role ?? null, cfg, profile?.githubLogin ?? null);
		if (![
			client.connect.scopes ?? [],
			...operatorAuthority ? [operatorAuthority.scopes] : [],
			...policy ? [policy.scopes] : []
		].every((allowedScopes) => roleScopesAllow({
			role: "operator",
			requestedScopes: ["operator.read"],
			allowedScopes
		}))) throw new PersonalFileAccessError("Personal instructions require current operator.read permission.");
		if (policy && policy.agents !== "*" && !policy.agents.includes(agentId)) throw new PersonalFileAccessError("Your operator role cannot edit personal instructions for this agent.");
		return canonicalId;
	};
	const profileId = currentProfile();
	const assertCurrent = () => {
		const cfg = context.getRuntimeConfig();
		if (currentProfile() !== profileId || !listAgentIds(cfg).includes(agentId) || resolveAgentWorkspaceDir(cfg, agentId) !== workspaceDir) throw new PersonalFileAccessError("Profile or agent workspace changed; reload before saving.");
		if (getAgentWorkspaceAccess(workspaceDir)) throw new PersonalFileAccessError("Personal instructions editing requires a local agent workspace.");
	};
	assertCurrent();
	return {
		agentId,
		profileId,
		workspaceDir,
		name: `users/${profileId}/USER.md`,
		assertCurrent
	};
}
async function runPersonalFile(options, params, write) {
	try {
		const target = preparePersonalFile(options, params.agentId);
		const fsRoot = await root(target.workspaceDir, {
			symlinks: "reject",
			mutationSymlinks: "reject",
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
			assertBeforeMutation: target.assertCurrent
		});
		const read = async () => {
			target.assertCurrent();
			try {
				const loaded = await fsRoot.read(target.name);
				target.assertCurrent();
				return {
					agentId: target.agentId,
					profileId: target.profileId,
					missing: false,
					content: new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(loaded.buffer),
					hash: sha256Hex(loaded.buffer)
				};
			} catch (error) {
				target.assertCurrent();
				if (!isMissingPathError(error)) throw error;
				return {
					agentId: target.agentId,
					profileId: target.profileId,
					missing: true,
					content: "",
					hash: null
				};
			}
		};
		if (!write) {
			const result = await read();
			target.assertCurrent();
			options.respond(true, result);
			return;
		}
		if (write.content.length > 4e3) {
			options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Keep personal instructions within 4,000 characters."));
			return;
		}
		await enqueueWorkspaceFileUpdate(async () => {
			const previous = await read();
			target.assertCurrent();
			if (previous.hash !== write.expectedHash) {
				options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Personal USER.md changed since it was read. Reload before saving.", { details: { type: "personal_file_conflict" } }));
				return;
			}
			await fsRoot.write(target.name, write.content, {
				mkdir: true,
				overwrite: !previous.missing
			});
			target.assertCurrent();
			options.respond(true, {
				agentId: target.agentId,
				profileId: target.profileId,
				missing: false,
				content: write.content,
				hash: sha256Hex(write.content)
			});
		});
	} catch (error) {
		options.respond(false, void 0, errorShape(error instanceof PersonalFileAccessError ? ErrorCodes.FORBIDDEN : ErrorCodes.INVALID_REQUEST, error instanceof FsSafeError ? "Personal USER.md could not be accessed safely. Check the agent workspace and remove file aliases." : error instanceof Error ? error.message : "Personal instructions are unavailable; reload and try again."));
	}
}
const usersPersonalFileHandlers = {
	"users.personalFile.get": defineValidatedGatewayMethod("users.personalFile.get", validateUsersPersonalFileGetParams, (options) => runPersonalFile(options, options.params)),
	"users.personalFile.set": defineValidatedGatewayMethod("users.personalFile.set", validateUsersPersonalFileSetParams, (options) => runPersonalFile(options, options.params, options.params))
};
//#endregion
//#region src/gateway/server-methods/users.ts
function refreshConnectedProfile(context, profileId) {
	const current = readResidentUserProfileRevision(profileId, profileCatalogPath({}));
	if (current) context.refreshConnectedUserProfile?.({
		...projectUserProfileDisplay(current),
		updatedAt: current.updated_at
	});
}
function profileError(error) {
	if (error instanceof UserProfileNotFoundError || error instanceof UserProfileOwnerError || error instanceof UserProfileMergeError) return errorShape(ErrorCodes.INVALID_REQUEST, error.message);
	return errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
function preparePersonalPreferences(client) {
	const unavailable = "Personal settings are unavailable in this turn. Ask in your own Control UI turn with a new message.";
	try {
		const participant = resolveGatewayPersonalToolParticipant(client?.internal?.agentRuntimeIdentity, { requireSingleParticipant: true });
		return () => {
			try {
				participant?.assertCurrent();
			} catch {
				throw new Error(unavailable);
			}
		};
	} catch {
		throw new Error(unavailable);
	}
}
const usersHandlers = {
	...usersAuthConnectHandlers,
	...usersChannelIdentityHandlers,
	...usersGitHubHandlers,
	...usersPersonalFileHandlers,
	"users.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateUsersListParams, "users.list", respond)) return;
		const { githubAccountIds } = params;
		const result = githubAccountIds === void 0 ? { profiles: await listProfiles() } : await readUserProfileSnapshot(githubAccountIds);
		const cfg = context.getRuntimeConfig();
		const profilesById = new Map(result.profiles.map((profile) => [profile.id, profile]));
		respond(true, {
			...result,
			profiles: result.profiles.map((profile) => {
				const canonical = profilesById.get(profile.mergedInto ?? profile.id) ?? profile;
				return Object.assign(profile, resolveOperatorRoleSelection(canonical.id, canonical.role ?? null, cfg, canonical.githubIdentity?.login ?? null));
			})
		});
	},
	"users.self": async (options) => {
		const { client, params, respond } = options;
		if (!assertValidParams(params, validateUsersSelfParams, "users.self", respond)) return;
		if (!client?.authenticatedUserId && !client?.authenticatedUserProfile) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "users.self requires an authenticated user"));
			return;
		}
		try {
			if (client.authenticatedGitHubIdentitySync) try {
				await client.authenticatedGitHubIdentitySync();
			} catch {}
			const profile = await prepareAuthenticatedProfile(options);
			profile.assertCurrent();
			const profileId = profile.profileId;
			if (!profileId) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { profile: getUserProfileListItem(profileId) });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.get": async ({ client, params, respond, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateUsersPrefsGetParams, "users.prefs.get", respond)) return;
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const assertCurrent = preparePersonalPreferences(client);
			const preferences = await getCanonicalUserPreferences(profileId, params.keys);
			assertCurrent();
			sessionMutationAuthorization?.assertCurrent();
			if (!preferences) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, {
				status: "ok",
				entries: preferences.entries
			}, void 0);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respond(false, void 0, profileError(error));
		}
	},
	"users.prefs.set": async ({ client, context, params, respond }) => {
		if (!assertValidParams(params, validateUsersPrefsSetParams, "users.prefs.set", respond)) return;
		const profileId = client?.authenticatedUserProfile?.profileId ?? "";
		if (!profileId) {
			if (isGatewayClientProfilePending(client)) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			respond(true, { status: "no_durable_identity" }, void 0);
			return;
		}
		try {
			const assertCurrent = preparePersonalPreferences(client);
			const result = await setCanonicalUserPreferences(profileId, params.entries, {
				expectedEntries: params.expectedEntries,
				assertCurrent
			});
			if (!result) {
				respond(false, void 0, authenticatedProfileUnavailableError());
				return;
			}
			if (!result.ok) {
				if (result.error.code === "conflict") {
					respond(true, { status: "conflict" }, void 0);
					return;
				}
				if (result.error.code === "profile-key-limit") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `users.prefs.set exceeds the ${result.error.limit}-key profile limit (current count: ${result.error.currentCount})`, { details: {
						code: GatewayErrorDetailCodes.USER_PREFS_LIMIT_EXCEEDED,
						limit: result.error.limit,
						currentCount: result.error.currentCount
					} }));
					return;
				}
				const key = "key" in result.error ? ` for ${result.error.key}` : "";
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid users.prefs.set entry${key}: ${result.error.code}`));
				return;
			}
			respond(true, { status: "ok" }, void 0);
			publishUserPreferencesChanged(context, result.value.profileId, Object.keys(params.entries));
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.linkEmail": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersLinkEmailParams, "users.linkEmail", respond)) return;
		const email = params.email.trim();
		if (!email) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "email must not be empty"));
			return;
		}
		const targetProfileId = params.targetProfileId;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			const { profile } = await linkCanonicalUserProfileEmail(email, targetProfileId, { assertCurrent });
			assertCurrent();
			refreshConnectedProfile(context, profile.id);
			broadcastChatMetadataChanged(context);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.merge": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersMergeParams, "users.merge", respond)) return;
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			holdGatewayPolicyResponse(respond);
			const { profile, movedAliasKinds } = await mergeCanonicalUserProfiles(params.sourceProfileId, params.targetProfileId, {
				assertCurrent,
				onCommitted: (profileIds) => {
					for (const profileId of profileIds) {
						invalidateOperatorRolePolicy(profileId);
						context.disconnectClientsForUserProfile?.(profileId);
					}
				}
			});
			let canPublish = true;
			try {
				assertCurrent();
			} catch {
				canPublish = false;
			}
			if (canPublish) {
				refreshConnectedProfile(context, profile.id);
				broadcastChatMetadataChanged(context);
			}
			respond(true, {
				profile,
				movedAliasKinds
			});
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setDisplayName": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersSetDisplayNameParams, "users.setDisplayName", respond)) return;
		try {
			const assertCurrent = await prepareProfileMutationAccess(options, params.profileId);
			if (!assertCurrent) return;
			const { profile } = await setCanonicalUserProfileDisplayName(params.profileId, params.displayName, { assertCurrent });
			assertCurrent();
			refreshConnectedProfile(context, profile.id);
			respond(true, { profile });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setRole": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersSetRoleParams, "users.setRole", respond)) return;
		const { profileId, role } = params;
		const isConfiguredRole = () => {
			const definitions = context.getRuntimeConfig().gateway?.roles?.definitions;
			return role === null || definitions !== void 0 && Object.hasOwn(definitions, role);
		};
		const unknownRoleMessage = `unknown operator role "${role}"; define it under gateway.roles.definitions before assigning it`;
		if (!isConfiguredRole()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, unknownRoleMessage));
			return;
		}
		try {
			const assertCurrent = await prepareUserProfileAdministration(options);
			holdGatewayPolicyResponse(respond);
			respond(true, { profile: await setCanonicalUserProfileRole(profileId, role, {
				assertCurrent: () => {
					assertCurrent();
					if (!isConfiguredRole()) throw new Error(unknownRoleMessage);
				},
				onCommitted: (canonicalProfileId) => {
					invalidateOperatorRolePolicy(canonicalProfileId);
					context.disconnectClientsForUserProfile?.(canonicalProfileId);
				}
			}) });
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	},
	"users.setAvatar": async (options) => {
		const { context, params, respond } = options;
		if (!assertValidParams(params, validateUsersSetAvatarParams, "users.setAvatar", respond)) return;
		const avatarBase64 = params.avatarBase64.trim();
		if (!isValidBase64(avatarBase64)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "avatarBase64 must be base64"));
			return;
		}
		const bytes = Buffer.from(avatarBase64, "base64");
		try {
			const assertCurrent = await prepareProfileMutationAccess(options, params.profileId);
			if (!assertCurrent) return;
			const result = await setCanonicalUserProfileAvatar(params.profileId, bytes, params.mime, { assertCurrent });
			assertCurrent();
			if (!result.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.error.code));
				return;
			}
			const { profile, display } = result.value;
			refreshConnectedProfile(context, profile.id);
			respond(true, {
				profile,
				avatarRevision: display.avatarRevision
			});
		} catch (error) {
			respond(false, void 0, profileError(error));
		}
	}
};
//#endregion
export { usersHandlers };
