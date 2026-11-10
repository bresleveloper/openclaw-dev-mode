import { p as normalizeTrimmedStringList, r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { Ng as errorShape, ai as validateSecretsStoreImportParams, ci as validateSecretsStoreMutationResult, ii as validateSecretsStoreDeleteParams, li as validateSecretsStoreSetParams, ni as validateSecretsResolveResult, oi as validateSecretsStoreListParams, ri as validateSecretsStoreAllowedHostsParams, si as validateSecretsStoreListResult, ti as validateSecretsResolveParams } from "./src-pLJQA6J5.mjs";
import { C as collectSecretStoreRefKeysInSnapshot, l as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-DDDhACod.mjs";
import { a as isKnownSecretTargetId, i as isKnownCoreSecretTargetId } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-2inJAtve.mjs";
import { c as deleteSecretStoreEntry, d as writeSecretStoreEntry, i as purgeExpiredSecretStoreEntries, l as updateSecretStoreAllowedHosts, r as listSecretStoreEntries, u as writeSecretStoreEntries } from "./secret-store-d5UF_g7X.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-B3KjbGu2.mjs";
//#region src/gateway/server-methods/secrets.ts
const teamScope = { kind: "team" };
function toProtocolStoreEntry(entry) {
	const metadata = {
		name: entry.name,
		scopeKind: "team",
		scopeId: "",
		createdAtMs: entry.createdAtMs,
		updatedAtMs: entry.updatedAtMs,
		...entry.updatedBy ? { updatedBy: entry.updatedBy } : {}
	};
	if (entry.kind === "env") {
		if (typeof entry.valuePreview !== "string") throw new Error(`Secret store env metadata is missing its value for ${entry.name}.`);
		return {
			...metadata,
			kind: "env",
			value: entry.valuePreview
		};
	}
	return {
		...metadata,
		kind: "secret",
		allowedHosts: entry.allowedHosts ?? []
	};
}
function storeUpdatedBy(client) {
	return client?.authenticatedUserProfile?.displayName?.trim() || client?.connect?.client?.displayName?.trim() || client?.connect?.client?.id?.trim() || "gateway";
}
/** Owns redaction-first store writes and the runtime refresh shared by Gateway RPCs. */
function createSecretStoreWriteService(params) {
	const purgeRetention = async () => {
		try {
			await purgeExpiredSecretStoreEntries();
		} catch (error) {
			params.log?.warn?.(`secrets.store retention purge failed: ${formatErrorMessage(error)}`);
		}
	};
	const reloadReference = async (names) => {
		await purgeRetention();
		const snapshot = getActiveSecretsRuntimeSnapshotState();
		const refKeys = /* @__PURE__ */ new Set();
		if (snapshot) for (const name of typeof names === "string" ? [names] : names) for (const key of collectSecretStoreRefKeysInSnapshot(snapshot, name)) refKeys.add(key);
		if (refKeys.size === 0) return { reloaded: false };
		try {
			return {
				reloaded: true,
				warningCount: (await params.reloadSecrets({
					forceColdRefKeys: refKeys,
					joinInFlight: false
				})).warningCount
			};
		} catch (error) {
			params.log?.warn?.(`secrets.store runtime refresh failed: ${formatErrorMessage(error)}`);
			throw error;
		}
	};
	return {
		resolveUpdatedBy: storeUpdatedBy,
		reloadReference,
		write(input) {
			registerSecretValueForRedaction(input.value);
			return writeSecretStoreEntry({
				scope: teamScope,
				...input
			});
		}
	};
}
function invalidSecretsResolveField(errors) {
	for (const issue of errors ?? []) {
		const instancePath = issue.instancePath ?? "";
		if (instancePath === "/commandName" || instancePath === "" && (String(issue.params?.missingProperty) === "commandName" || Array.isArray(issue.params?.requiredProperties) && issue.params.requiredProperties.includes("commandName"))) return "commandName";
		for (const field of [
			"allowedPaths",
			"forcedActivePaths",
			"optionalActivePaths",
			"providerOverrides"
		]) if (instancePath.startsWith(`/${field}`)) return field;
	}
	return "targetIds";
}
function createSecretsHandlers(params) {
	const mutateStore = (action, names, options, mutate) => {
		const { params: requestParams, respond, client, context } = options;
		const requestAuthority = readGatewayRequestMutationAuthority(options);
		let assertOwner;
		try {
			assertOwner = requestParams.expectedOwnerId ? captureLocalStateMutationGuard(requestParams.expectedOwnerId, options) : void 0;
		} catch (error) {
			respond(false, void 0, localStateOwnerChangedError(error));
			return Promise.resolve();
		}
		const authority = createAgentRuntimeAuthorityGuard(client, context, respond, () => {
			requestAuthority.assertCurrent();
			assertOwner?.();
		});
		let mutationResult;
		const attempt = async () => {
			if (action === "delete") {
				const agentId = client?.internal?.agentRuntimeIdentity?.agentId;
				if (agentId) params.log?.debug?.(`secrets.store.delete requested by agent:${agentId}`);
			}
			if (!authority.ensureActive()) return false;
			holdGatewayPolicyResponse(respond);
			mutationResult = await mutate(requestParams, authority.commitGuard, client);
			return true;
		};
		return (async () => {
			const method = `secrets.store.${action}`;
			let committed = false;
			try {
				if (!await attempt()) return;
				committed = true;
				authority.commitGuard?.();
				const result = {
					ok: true,
					...await params.storeWriteService.reloadReference(names),
					...requestParams.expectedOwnerId && action === "set" && (mutationResult === "secret" || mutationResult === "env") ? { kind: mutationResult } : {}
				};
				if (!validateSecretsStoreMutationResult(result)) throw new Error(`${method} returned invalid payload.`);
				respond(true, result);
			} catch (error) {
				if (!committed && error instanceof SecretStoreValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				params.log?.warn?.(`${method} failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, !committed ? `${method} failed` : action !== "delete" ? "Secret store entry was saved, but post-write runtime refresh failed. Resolve provider errors and retry secrets.reload." : "Secret store entry was deleted, but the active runtime could not refresh. Update the config reference or restore the entry, then retry secrets.reload."));
			}
		})();
	};
	return {
		"secrets.reload": async ({ respond }) => {
			try {
				holdGatewayPolicyResponse(respond);
				respond(true, {
					ok: true,
					warningCount: (await params.reloadSecrets()).warningCount
				});
			} catch (error) {
				params.log?.warn?.(`secrets.reload failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "secrets.reload failed"));
			}
		},
		"secrets.resolve": async ({ params: requestParams, respond }) => {
			if (!validateSecretsResolveParams(requestParams)) {
				const field = invalidSecretsResolveField(validateSecretsResolveParams.errors);
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid secrets.resolve params: ${field}`));
				return;
			}
			const commandName = requestParams.commandName.trim();
			if (!commandName) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid secrets.resolve params: commandName"));
				return;
			}
			const targetIds = normalizeTrimmedStringList(requestParams.targetIds);
			const allowedPaths = normalizeArrayBackedTrimmedStringList(requestParams.allowedPaths);
			const forcedActivePaths = normalizeArrayBackedTrimmedStringList(requestParams.forcedActivePaths);
			const optionalActivePaths = normalizeArrayBackedTrimmedStringList(requestParams.optionalActivePaths);
			const providerOverrides = {
				...requestParams.providerOverrides?.webSearch?.trim() ? { webSearch: requestParams.providerOverrides.webSearch.trim() } : {},
				...requestParams.providerOverrides?.webFetch?.trim() ? { webFetch: requestParams.providerOverrides.webFetch.trim() } : {}
			};
			for (const targetId of targetIds) if (!isKnownCoreSecretTargetId(targetId) && !isKnownSecretTargetId(targetId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid secrets.resolve params: unknown target id "${String(targetId)}"`));
				return;
			}
			try {
				const result = await params.resolveSecrets({
					commandName,
					targetIds,
					...allowedPaths ? { allowedPaths } : {},
					...forcedActivePaths ? { forcedActivePaths } : {},
					...optionalActivePaths ? { optionalActivePaths } : {},
					...Object.keys(providerOverrides).length > 0 ? { providerOverrides } : {}
				});
				const payload = {
					ok: true,
					assignments: result.assignments,
					diagnostics: result.diagnostics,
					inactiveRefPaths: result.inactiveRefPaths
				};
				if (!validateSecretsResolveResult(payload)) throw new Error("secrets.resolve returned invalid payload.");
				respond(true, payload);
			} catch (error) {
				params.log?.warn?.(`secrets.resolve failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "secrets.resolve failed"));
			}
		},
		"secrets.store.list": defineValidatedGatewayHandler("secrets.store.list", validateSecretsStoreListParams, async (options) => {
			const { respond } = options;
			const { assertCurrent } = readGatewayRequestMutationAuthority(options);
			try {
				const result = { entries: (await listSecretStoreEntries({
					scope: teamScope,
					assertCurrent
				})).map(toProtocolStoreEntry) };
				assertCurrent();
				if (!validateSecretsStoreListResult(result)) throw new Error("secrets.store.list returned invalid payload.");
				respond(true, result);
			} catch (error) {
				params.log?.warn?.(`secrets.store.list failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "secrets.store.list failed"));
			}
		}),
		"secrets.store.set": defineValidatedGatewayHandler("secrets.store.set", validateSecretsStoreSetParams, (options) => mutateStore("set", [options.params.name], options, (requestParams, assertCurrent, client) => params.storeWriteService.write({
			name: requestParams.name,
			value: requestParams.value,
			kind: requestParams.kind,
			inheritExistingKind: requestParams.inheritExistingKind,
			valueSource: requestParams.valueSource,
			...requestParams.allowedHosts !== void 0 ? { allowedHosts: requestParams.allowedHosts } : {},
			updatedBy: params.storeWriteService.resolveUpdatedBy(client),
			assertCurrent
		}))),
		"secrets.store.import": defineValidatedGatewayHandler("secrets.store.import", validateSecretsStoreImportParams, (options) => mutateStore("import", options.params.entries.map((entry) => entry.name), options, (requestParams, assertCurrent, client) => writeSecretStoreEntries({
			scope: teamScope,
			entries: requestParams.entries,
			inheritExistingKind: requestParams.inheritExistingKind,
			updatedBy: params.storeWriteService.resolveUpdatedBy(client),
			assertCurrent
		}))),
		"secrets.store.allowedHosts": defineValidatedGatewayHandler("secrets.store.allowedHosts", validateSecretsStoreAllowedHostsParams, (options) => mutateStore("allowedHosts", [options.params.name], options, (requestParams, assertCurrent, client) => updateSecretStoreAllowedHosts({
			scope: teamScope,
			name: requestParams.name,
			allowedHosts: requestParams.allowedHosts,
			updatedBy: params.storeWriteService.resolveUpdatedBy(client),
			assertCurrent
		}))),
		"secrets.store.delete": defineValidatedGatewayHandler("secrets.store.delete", validateSecretsStoreDeleteParams, (options) => mutateStore("delete", [options.params.name], options, (requestParams, assertCurrent) => deleteSecretStoreEntry({
			scope: teamScope,
			name: requestParams.name,
			assertCurrent
		})))
	};
}
//#endregion
export { createSecretStoreWriteService, createSecretsHandlers };
