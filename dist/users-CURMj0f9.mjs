import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { f as ModelAccountConnectAuthorityError, p as ModelAccountConnectInputError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { $s as validateUsersListParams, Bs as validateUsersGitHubAuthorizePollParams, Fs as validateUsersAuthConnectStatusParams, Gs as validateUsersLinkChannelIdentityParams, Hs as validateUsersGitHubDisconnectParams, Is as validateUsersBackgroundGetParams, Ls as validateUsersBackgroundRemoveParams, Ms as validateUsersAuthConnectCancelParams, Ng as errorShape, Ns as validateUsersAuthConnectCatalogParams, Ps as validateUsersAuthConnectStartParams, Qs as validateUsersListModelAccountsParams, Rs as validateUsersBackgroundUploadParams, Us as validateUsersGitHubStatusParams, Vs as validateUsersGitHubAuthorizeStartParams, Ws as validateUsersLinkAuthProfileParams, Xs as validateUsersListChannelIdentitiesParams, Ys as validateUsersListAuthLinksParams, _c as validateUsersUnlinkAuthProfileParams, ac as validateUsersPersonalFileSetParams, cc as validateUsersSelectModelAccountParams, dc as validateUsersSetAvatarParams, hc as validateUsersSetRoleParams, ic as validateUsersPersonalFileGetParams, js as validateUsersAuthConnectAnswerParams, lc as validateUsersSelfParams, nc as validateUsersMergeParams, oc as validateUsersPrefsGetParams, pc as validateUsersSetDisplayNameParams, qs as validateUsersLinkEmailParams, sc as validateUsersPrefsSetParams, vc as validateUsersUnlinkChannelIdentityParams, zs as validateUsersGitHubAuthorizeCancelParams } from "./src-pLJQA6J5.mjs";
import { r as USER_BACKGROUND_PREFERENCE_KEY } from "./background-preferences-C24XmTL3.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { C as UserProfileMergeError, T as UserProfileOwnerError, c as projectUserProfileDisplay, w as UserProfileNotFoundError } from "./user-profiles-internal-CBUpoSHj.mjs";
import { t as profileCatalogPath } from "./user-profile-identity.read-DXpuvx74.mjs";
import { h as readResidentUserProfileRevision, i as hasMultipleResidentSessionSharingIdentities, m as readResidentUserProfileIdentity, p as readResidentUserProfileId } from "./user-profile-list-BdNJnrJe.mjs";
import { h as resolveOperatorRoleSelection, i as invalidateOperatorRolePolicy, p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { c as resolveGatewayPersonalToolParticipant, o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { i as isValidBase64 } from "./base64-CU53EX1R.mjs";
import { n as isIneligiblePersonalGatewayCaller } from "./gateway-personal-caller-BLfLqLHg.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as UserChannelIdentityConflictError } from "./user-channel-identities-B1CU1eh6.mjs";
import { n as changeCanonicalUserChannelIdentity, o as prepareUserProfileRoleAuthority, r as listCanonicalUserChannelIdentities } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-2inJAtve.mjs";
import { t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-MfuAG3Bn.mjs";
import { _ as resolveSystemGitHubIdentityStatus } from "./github-tool-identity-BEdbceu6.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { r as setCanonicalUserPreferences, t as getCanonicalUserPreferences } from "./user-preferences-BKyFpu43.mjs";
import { i as readUserProfileSnapshot, t as listProfiles } from "./user-profile-reads-DnSqXcRI.mjs";
import { n as defineValidatedGatewayHandler, r as defineValidatedGatewayMethod, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { a as mergeCanonicalUserProfiles, c as setCanonicalUserProfileRole, i as linkCanonicalUserProfileEmail, o as setCanonicalUserProfileAvatar, s as setCanonicalUserProfileDisplayName } from "./user-profile-writes-DOkiscfg.mjs";
import { r as enqueueWorkspaceFileUpdate } from "./workspace-fs-B8fFK4si.mjs";
import { i as prepareUserModelAccountAction } from "./users-model-account-access-CmjctvSj.mjs";
import { n as prepareProfileMutationAccess, r as prepareUserProfileAdministration, t as prepareAuthenticatedProfile } from "./users-profile-access-CfM3i27H.mjs";
import { n as preparePersonalGitHubActionV2 } from "./github-personal-authorization-D6PeAZTm.mjs";
import { t as publishUserPreferencesChanged } from "./user-preference-events-DW6Wp7tp.mjs";
import "./user-profiles-B1L6H823.mjs";
import { a as UserBackgroundInputError, i as uploadUserBackground, r as removeUserBackground, t as getUserBackground } from "./user-background-CyqAn0ug.mjs";
//#region src/gateway/server-methods/users-auth-connect.ts
function connectHandler(method, validate, run, requiredScope = "operator.write") {
	return defineValidatedGatewayHandler(method, validate, async (options) => {
		const action = await prepareUserModelAccountAction(options, options.params.profileId, requiredScope);
		const service = options.context.modelAccountConnectService;
		if (!service) throw new Error("Model-account service is not running.");
		const result = await run(service, action, options.params);
		action.assertCurrent();
		options.respond(true, result);
	}, (error) => error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof ModelAccountConnectInputError || error instanceof UserProfileNotFoundError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message) : errorShape(ErrorCodes.UNAVAILABLE, "Model account connect is unavailable right now; try again shortly."));
}
const usersAuthConnectHandlers = {
	"users.listAuthLinks": connectHandler("users.listAuthLinks", validateUsersListAuthLinksParams, (service, action) => service.listLinksAsync(action), "operator.read"),
	"users.linkAuthProfile": connectHandler("users.linkAuthProfile", validateUsersLinkAuthProfileParams, (service, action, params) => service.linkAsync(action, params.authProfileId), "operator.admin"),
	"users.unlinkAuthProfile": connectHandler("users.unlinkAuthProfile", validateUsersUnlinkAuthProfileParams, (service, action, params) => service.unlinkAsync(action, params.provider)),
	"users.listModelAccounts": connectHandler("users.listModelAccounts", validateUsersListModelAccountsParams, (service, action, params) => service.listAsync(action, params.cursor), "operator.read"),
	"users.selectModelAccount": connectHandler("users.selectModelAccount", validateUsersSelectModelAccountParams, (service, action, params) => service.selectAsync(action, params.authProfileId)),
	"users.authConnect.start": connectHandler("users.authConnect.start", validateUsersAuthConnectStartParams, (service, action, params) => service.start(action, params.provider, params.method)),
	"users.authConnect.answer": connectHandler("users.authConnect.answer", validateUsersAuthConnectAnswerParams, (service, action, params) => service.answer(action, params.connectId, params.stepId, params.value)),
	"users.authConnect.status": connectHandler("users.authConnect.status", validateUsersAuthConnectStatusParams, (service, action, params) => service.statusAsync(action, params.connectId)),
	"users.authConnect.cancel": connectHandler("users.authConnect.cancel", validateUsersAuthConnectCancelParams, (service, action, params) => service.cancelAsync(action, params.connectId)),
	"users.authConnect.catalog": connectHandler("users.authConnect.catalog", validateUsersAuthConnectCatalogParams, (service, action) => service.catalog(action))
};
//#endregion
//#region src/gateway/server-methods/users-background.ts
/** Bind private profile work to this live human connection before asynchronous image decoding. */
async function prepareUserBackgroundAction(options, scope) {
	const { client, context } = options;
	const lifetime = readGatewayRequestMutationAuthority(options);
	const reference = client?.authenticatedUserProfile?.profileId;
	if (!reference) throw new Error("Backgrounds require an authenticated profile");
	lifetime.assertLifetimeCurrent();
	const profile = await prepareUserProfileRoleAuthority(reference);
	const owner = profile?.profileId;
	if (!owner || !profile) throw new Error("Backgrounds require an authenticated profile");
	const assertCurrent = () => {
		lifetime.assertLifetimeCurrent();
		lifetime.expectedProfileBinding?.assertCurrent();
		if (!owner || !client?.connId || client.invalidated || client.connectionSignal?.aborted || options.signal?.aborted || client.connect.role !== "operator" || isIneligiblePersonalGatewayCaller(client) || isGatewayClientProfilePending(client) || !context.getClientConnIds?.((current) => current === client).has(client.connId) || !profile.isCurrent() || client.authenticatedUserProfile?.profileId !== reference) throw new Error("Background request no longer belongs to a connected profile");
		const policy = resolveOperatorRolePolicyForAssignment(owner, profile.role, context.getRuntimeConfig(), profile.githubLogin ?? null);
		if (![client.connect.scopes ?? [], ...policy ? [policy.scopes] : []].every((allowedScopes) => roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes
		}))) throw new Error("Background request no longer has the required profile scope");
	};
	assertCurrent();
	return {
		owner,
		assertCurrent
	};
}
function backgroundHandler(operation, validate, run, mapError) {
	return defineValidatedGatewayHandler(`users.background.${operation}`, validate, async (options) => {
		const { client, respond, context } = options;
		if (!client?.authenticatedUserProfile) {
			respond(true, { status: "no_durable_identity" });
			return;
		}
		const action = await prepareUserBackgroundAction(options, operation === "get" ? "operator.read" : "operator.write");
		const result = await run(action, options);
		action.assertCurrent();
		respond(true, result);
		if (operation !== "get" && result.status === "ok") publishUserPreferencesChanged(context, action.owner, [USER_BACKGROUND_PREFERENCE_KEY]);
	}, mapError);
}
const usersBackgroundHandlers = {
	"users.background.get": backgroundHandler("get", validateUsersBackgroundGetParams, (action) => getUserBackground(action.owner, action), () => errorShape(ErrorCodes.FORBIDDEN, "Backgrounds require a current authenticated profile")),
	"users.background.upload": backgroundHandler("upload", validateUsersBackgroundUploadParams, (action, { params, signal }) => uploadUserBackground(action.owner, params, {
		...action,
		signal
	}), (error) => errorShape(error instanceof UserBackgroundInputError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "Background upload failed")),
	"users.background.remove": backgroundHandler("remove", validateUsersBackgroundRemoveParams, (action, { params }) => removeUserBackground(action.owner, params, action), () => errorShape(ErrorCodes.UNAVAILABLE, "Background removal failed; reload your preference and retry"))
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
async function runPersonalGitHub(options, fallbackError, run) {
	const fail = (error) => options.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error instanceof Error ? error.message : fallbackError));
	try {
		const action = await preparePersonalGitHubActionV2(options);
		const service = options.context.githubOAuthService?.personal;
		if (!service) throw new Error("GitHub connections are unavailable; retry after Gateway startup.");
		const result = await run(action, service);
		action.assertCurrent();
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
	"users.github.authorize.cancel": defineValidatedGatewayMethod("users.github.authorize.cancel", validateUsersGitHubAuthorizeCancelParams, (options) => runPersonalGitHub(options, "My GitHub authorization failed.", async (action, service) => ({ cancelled: await service.cancelAuthorizationAsync(action, options.params.requestId) }))),
	"users.github.disconnect": defineValidatedGatewayMethod("users.github.disconnect", validateUsersGitHubDisconnectParams, (options) => runPersonalGitHub(options, "My GitHub disconnect failed.", async (action, service) => {
		await service.disconnectAsync(action);
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
		if (!hasMultipleResidentSessionSharingIdentities()) throw new PersonalFileAccessError("Personal instructions are only available on multi-user Gateways. Use the agent workspace USER.md on a single-user Gateway.");
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
		const profile = readResidentUserProfileIdentity(canonicalId);
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
		const identity = {
			agentId: target.agentId,
			profileId: target.profileId
		};
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
					...identity,
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
					...identity,
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
				...identity,
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
	...usersBackgroundHandlers,
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
			let syncError;
			if (client.authenticatedGitHubIdentitySync) try {
				await client.authenticatedGitHubIdentitySync();
			} catch (error) {
				syncError = error;
			}
			const profile = await prepareAuthenticatedProfile(options, true);
			profile.assertCurrent();
			if (!profile.profileId || !profile.listItem) {
				respond(false, void 0, authenticatedProfileUnavailableError(syncError));
				return;
			}
			respond(true, { profile: profile.listItem });
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
	"users.prefs.set": async (options) => {
		const { client, context, params, respond } = options;
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
			const assertPersonal = preparePersonalPreferences(client);
			const backgroundAction = Object.hasOwn(params.entries, "ui.background") ? await prepareUserBackgroundAction(options, "operator.write") : void 0;
			const assertCurrent = () => {
				assertPersonal();
				options.sessionMutationAuthorization?.assertCurrent();
				backgroundAction?.assertCurrent();
			};
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
	"users.merge": defineValidatedGatewayHandler("users.merge", validateUsersMergeParams, async (options) => {
		const { context, params, respond } = options;
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
	}, profileError),
	"users.setDisplayName": defineValidatedGatewayHandler("users.setDisplayName", validateUsersSetDisplayNameParams, async (options) => {
		const { context, params, respond } = options;
		const assertCurrent = await prepareProfileMutationAccess(options, params.profileId);
		if (!assertCurrent) return;
		const { profile } = await setCanonicalUserProfileDisplayName(params.profileId, params.displayName, { assertCurrent });
		assertCurrent();
		refreshConnectedProfile(context, profile.id);
		respond(true, { profile });
	}, profileError),
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
