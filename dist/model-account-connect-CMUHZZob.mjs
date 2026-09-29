import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-Bm8Ih2d_.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { a as listUserProfileAuthLinks, f as setUserProfileAuthLink, i as listUserModelAccounts, n as connectUserModelAccount, s as readUserModelAccountSummary, t as clearUserProfileAuthLink } from "./user-model-accounts-C87WCnZM.mjs";
import { a as resolveDiscoverableProviderOwnerPluginIds } from "./providers-Bx7WoFEI.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-JPDhFb.mjs";
import { n as sanitizeWizardStepForClient, t as WizardSession } from "./session-DiJJJpjA.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/personal-account-auth.ts
/** Personal auth is opt-in; discovery never enables, installs, or imports host credentials. */
function listPersonalAccountAuthChoices(config) {
	const metadataSnapshot = resolvePluginMetadataSnapshot({ config });
	const choices = resolveManifestProviderAuthChoices({
		config,
		metadataSnapshot,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => choice.personalAccount);
	const allowed = new Set(resolveDiscoverableProviderOwnerPluginIds({
		config,
		pluginIds: choices.map((choice) => choice.pluginId),
		registry: metadataSnapshot.index,
		manifestRegistry: metadataSnapshot.manifestRegistry,
		includeUntrustedWorkspacePlugins: false
	}));
	return choices.filter((choice) => allowed.has(choice.pluginId));
}
async function resolvePersonalAccountAuthMethod(config, providerId, methodId) {
	const choice = listPersonalAccountAuthChoices(config).find((entry) => entry.providerId === providerId && entry.methodId === methodId);
	if (!choice) return;
	const { resolvePluginProvidersCore } = await import("./providers.runtime.js");
	return resolvePluginProvidersCore({
		config,
		onlyPluginIds: [choice.pluginId],
		mode: "setup",
		cache: true,
		activate: false,
		includeUntrustedWorkspacePlugins: false
	}).find((entry) => entry.pluginId === choice.pluginId && entry.id === providerId)?.auth.find((method) => method.id === methodId);
}
//#endregion
//#region src/gateway/model-account-connect.ts
const CONNECT_TTL_MS = 9e5;
const MAX_ACTIVE_CONNECTS = 8;
const MAX_RETAINED_CONNECTS = 64;
var ModelAccountConnectAuthorityError = class extends Error {
	constructor() {
		super("This account action requires a current authorized connection; reconnect and try again.");
	}
};
var ModelAccountConnectInputError = class extends Error {};
function matchesLiteralCredential(credential, existing) {
	if (credential.provider !== existing.provider) return false;
	return credential.type === "api_key" && existing.type === "api_key" ? credential.key === existing.key : credential.type === "token" && existing.type === "token" && credential.token === existing.token;
}
function resolveOwnedAccountProvider(owner, authProfileId) {
	const account = readUserModelAccountSummary({
		profileId: owner,
		authProfileId
	});
	if (!account) throw new ModelAccountConnectInputError("Select an account from your personal account list, or add it first.");
	return account.provider;
}
function resolveLinkableAuthProfileProvider(cfg, owner, authProfileId) {
	if (isUserModelAuthProfileId(authProfileId)) return resolveOwnedAccountProvider(owner, authProfileId);
	return ensureAuthProfileStoreWithoutExternalProfiles(resolveSharedMainAuthAgentDir(), { readOnly: true }).profiles[authProfileId]?.provider ?? cfg.auth?.profiles?.[authProfileId]?.provider;
}
/** One Gateway lifetime owns sign-in steps and authority; provider methods only stage credentials. */
function createModelAccountConnectService(options) {
	const operations = /* @__PURE__ */ new Map();
	let stopped = false;
	const finish = (operation, result) => {
		if (operation.terminal) return operation.terminal;
		operation.terminal = result;
		clearTimeout(operation.timeout);
		operation.session?.cancel();
		return result;
	};
	const snapshot = (operation) => {
		if (operation.terminal) return operation.terminal;
		if (operation.expiresAtMs <= Date.now()) return finish(operation, { status: "expired" });
		try {
			operation.action.assertCurrent();
			operation.answerAction?.assertCurrent();
		} catch {
			return finish(operation, {
				status: "failed",
				reason: "authority"
			});
		}
	};
	const assertRunning = (action) => {
		if (stopped) throw new ModelAccountConnectAuthorityError();
		action.assertCurrent();
	};
	const assertLive = (operation) => {
		if (stopped || operations.get(operation.id) !== operation || snapshot(operation)) throw new ModelAccountConnectAuthorityError();
	};
	const projectResult = (action, operation) => {
		const result = snapshot(operation);
		if (!result) {
			const step = operation.session?.getCurrentStep();
			return {
				status: "pending",
				...step ? { step: sanitizeWizardStepForClient(step) } : {}
			};
		}
		if (result.status !== "connected") return result;
		assertRunning(action);
		return {
			...result,
			links: listUserProfileAuthLinks(operation.owner)
		};
	};
	const findOperation = (action, connectId) => {
		assertRunning(action);
		const operation = operations.get(connectId);
		return operation?.owner === action.owner ? operation : void 0;
	};
	const supersede = (owner, provider) => {
		for (const operation of operations.values()) if (operation.owner === owner && operation.provider === provider) finish(operation, { status: "cancelled" });
	};
	const setLink = (action, provider, authProfileId) => {
		const links = setUserProfileAuthLink({
			profileId: action.owner,
			provider,
			authProfileId,
			assertCurrent: () => assertRunning(action)
		});
		supersede(action.owner, provider);
		options.onChanged?.();
		return { links };
	};
	return {
		listLinks(action) {
			assertRunning(action);
			return { links: listUserProfileAuthLinks(action.owner) };
		},
		link(action, authProfileId) {
			assertRunning(action);
			const provider = resolveLinkableAuthProfileProvider(options.getConfig(), action.owner, authProfileId);
			if (!provider) throw new ModelAccountConnectInputError(`unknown auth profile "${authProfileId}"; sign the account in first with "openclaw models auth login --provider <id> --profile-id ${authProfileId}", then link it`);
			return setLink(action, provider, authProfileId);
		},
		unlink(action, provider) {
			assertRunning(action);
			const links = clearUserProfileAuthLink({
				profileId: action.owner,
				provider,
				assertCurrent: () => assertRunning(action)
			});
			supersede(action.owner, provider);
			options.onChanged?.();
			return { links };
		},
		list(action, cursor) {
			assertRunning(action);
			return {
				profileId: action.owner,
				...listUserModelAccounts({
					profileId: action.owner,
					cursor
				}),
				links: listUserProfileAuthLinks(action.owner)
			};
		},
		catalog(action) {
			assertRunning(action);
			const providers = /* @__PURE__ */ new Map();
			for (const choice of listPersonalAccountAuthChoices(options.getConfig())) {
				let provider = providers.get(choice.providerId);
				if (!provider) {
					provider = {
						id: choice.providerId,
						label: choice.groupLabel ?? choice.providerId,
						methods: []
					};
					providers.set(choice.providerId, provider);
				}
				if (!provider.methods.some((method) => method.id === choice.methodId)) provider.methods.push({
					id: choice.methodId,
					label: choice.choiceLabel,
					...choice.choiceHint ? { hint: choice.choiceHint } : {}
				});
			}
			assertRunning(action);
			return { providers: [...providers.values()] };
		},
		select(action, authProfileId) {
			assertRunning(action);
			return setLink(action, resolveOwnedAccountProvider(action.owner, authProfileId), authProfileId);
		},
		async start(action, provider, methodId) {
			assertRunning(action);
			for (const operation of operations.values()) snapshot(operation);
			supersede(action.owner, provider);
			if ([...operations.values()].filter((operation) => !operation.terminal).length >= MAX_ACTIVE_CONNECTS) throw new Error("Too many model-account sign-ins are in progress; try again shortly.");
			for (const [id, operation] of operations) {
				if (operations.size < MAX_RETAINED_CONNECTS) break;
				if (operation.terminal) operations.delete(id);
			}
			const id = randomUUID();
			const operation = {
				id,
				owner: action.owner,
				provider,
				action,
				expiresAtMs: Date.now() + CONNECT_TTL_MS,
				timeout: setTimeout(() => finish(operation, { status: "expired" }), CONNECT_TTL_MS)
			};
			operation.timeout.unref();
			operations.set(id, operation);
			let resolvedMethod;
			try {
				resolvedMethod = await resolvePersonalAccountAuthMethod(options.getConfig(), provider, methodId);
				assertLive(operation);
				if (!resolvedMethod) throw new ModelAccountConnectInputError("This sign-in method is unavailable for personal accounts. Choose a method from Connected accounts.");
			} catch (error) {
				snapshot(operation);
				finish(operation, {
					status: "failed",
					reason: "unavailable"
				});
				throw error;
			}
			const method = resolvedMethod;
			operation.session = new WizardSession(async (prompter, signal) => {
				await Promise.resolve();
				let failure = "exchange";
				try {
					assertLive(operation);
					const result = await runProviderPluginAuthMethodUnpersisted({
						config: {},
						env: {},
						method,
						prompter,
						signal,
						assertCurrent: () => assertLive(operation),
						isRemote: true,
						secretInputMode: "plaintext",
						allowSecretRefPrompt: false,
						runtime: {
							log: () => {},
							error: () => {},
							exit: () => {
								throw new Error("Provider sign-in stopped.");
							}
						}
					});
					assertLive(operation);
					const profile = result.profiles[0];
					if (result.profiles.length !== 1 || !profile || profile.credential.provider !== provider || profile.secretStorage) {
						finish(operation, {
							status: "failed",
							reason: "identity"
						});
						return;
					}
					failure = "unavailable";
					const connected = connectUserModelAccount({
						ownerProfileId: operation.owner,
						credential: profile.credential,
						matchesCredential: (existing) => (method.matchesPersonalAccount ?? matchesLiteralCredential)(profile.credential, existing),
						assertCurrent: () => assertLive(operation)
					});
					finish(operation, {
						status: "connected",
						authProfileId: connected.authProfileId
					});
					options.onChanged?.();
				} catch {
					snapshot(operation);
					finish(operation, {
						status: "failed",
						reason: failure
					});
				}
			});
			return {
				connectId: id,
				expiresAtMs: operation.expiresAtMs
			};
		},
		status(action, connectId) {
			const operation = findOperation(action, connectId);
			return operation ? projectResult(action, operation) : { status: "expired" };
		},
		async answer(action, connectId, stepId, value) {
			const operation = findOperation(action, connectId);
			if (!operation) return { status: "expired" };
			if (snapshot(operation)) return projectResult(action, operation);
			const step = operation.session?.getCurrentStep();
			if (!operation.session || step?.id !== stepId || step.type === "progress") {
				const result = projectResult(action, operation);
				return result.status === "pending" ? {
					...result,
					error: "This step has changed. Follow the current sign-in instructions."
				} : result;
			}
			if (step.sensitive && typeof value === "string") registerSecretValueForRedaction(value);
			operation.answerAction = action;
			const error = await operation.session.answer(stepId, value);
			assertRunning(action);
			const result = projectResult(action, operation);
			if (error && result.status === "pending" && result.step?.id === stepId) return {
				...result,
				error: "That answer is not valid. Check the sign-in instructions and try again."
			};
			return result;
		},
		cancel(action, connectId) {
			const operation = findOperation(action, connectId);
			if (!operation) return { status: "expired" };
			snapshot(operation);
			finish(operation, { status: "cancelled" });
			return projectResult(action, operation);
		},
		supersede,
		async stop() {
			stopped = true;
			for (const operation of operations.values()) finish(operation, { status: "cancelled" });
			operations.clear();
		}
	};
}
//#endregion
export { ModelAccountConnectInputError as n, createModelAccountConnectService as r, ModelAccountConnectAuthorityError as t };
