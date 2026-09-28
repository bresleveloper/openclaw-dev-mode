import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as isKnownSecretTargetId, i as isKnownCoreSecretTargetId } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bzzf_1MN.mjs";
import { i as listSecretStoreEntries, o as purgeExpiredSecretStoreEntries, r as deleteSecretStoreEntry, u as writeSecretStoreEntry } from "./secret-store-BjhT4Kcc.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Fr as validateSecretsStoreListResult, Ir as validateSecretsStoreMutationResult, Lr as validateSecretsStoreSetParams, Mr as validateSecretsResolveResult, Nr as validateSecretsStoreDeleteParams, Pr as validateSecretsStoreListParams, jr as validateSecretsResolveParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as collectSecretStoreRefKeysInSnapshot, u as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-CtZtwiOt.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-fX60H7oF.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority--ezHAh8Z.mjs";
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
	const reloadReference = async (name) => {
		await purgeRetention();
		const snapshot = getActiveSecretsRuntimeSnapshotState();
		const refKeys = snapshot ? collectSecretStoreRefKeysInSnapshot(snapshot, name) : /* @__PURE__ */ new Set();
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
			writeSecretStoreEntry({
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
		if (instancePath.startsWith("/allowedPaths")) return "allowedPaths";
		if (instancePath.startsWith("/forcedActivePaths")) return "forcedActivePaths";
		if (instancePath.startsWith("/optionalActivePaths")) return "optionalActivePaths";
		if (instancePath.startsWith("/providerOverrides")) return "providerOverrides";
	}
	return "targetIds";
}
function createSecretsHandlers(params) {
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
			const targetIds = requestParams.targetIds.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
			const allowedPaths = requestParams.allowedPaths?.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
			const forcedActivePaths = requestParams.forcedActivePaths?.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
			const optionalActivePaths = requestParams.optionalActivePaths?.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
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
		"secrets.store.list": ({ params: requestParams, respond }) => {
			if (!assertValidParams(requestParams, validateSecretsStoreListParams, "secrets.store.list", respond)) return;
			try {
				const result = { entries: listSecretStoreEntries({ scope: teamScope }).map(toProtocolStoreEntry) };
				if (!validateSecretsStoreListResult(result)) throw new Error("secrets.store.list returned invalid payload.");
				respond(true, result);
			} catch (error) {
				params.log?.warn?.(`secrets.store.list failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "secrets.store.list failed"));
			}
		},
		"secrets.store.set": async ({ params: requestParams, respond, client }) => {
			if (!assertValidParams(requestParams, validateSecretsStoreSetParams, "secrets.store.set", respond)) return;
			let saved = false;
			try {
				holdGatewayPolicyResponse(respond);
				params.storeWriteService.write({
					name: requestParams.name,
					value: requestParams.value,
					kind: requestParams.kind,
					...requestParams.allowedHosts !== void 0 ? { allowedHosts: requestParams.allowedHosts } : {},
					updatedBy: params.storeWriteService.resolveUpdatedBy(client)
				});
				saved = true;
				const result = {
					ok: true,
					...await params.storeWriteService.reloadReference(requestParams.name)
				};
				if (!validateSecretsStoreMutationResult(result)) throw new Error("secrets.store.set returned invalid payload.");
				respond(true, result);
			} catch (error) {
				if (!saved && error instanceof SecretStoreValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				params.log?.warn?.(`secrets.store.set failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, saved ? "Secret store entry was saved, but post-write runtime refresh failed. Resolve provider errors and retry secrets.reload." : "secrets.store.set failed"));
			}
		},
		"secrets.store.delete": async ({ params: requestParams, respond, client, context }) => {
			if (!assertValidParams(requestParams, validateSecretsStoreDeleteParams, "secrets.store.delete", respond)) return;
			let deleted = false;
			try {
				const agentId = client?.internal?.agentRuntimeIdentity?.agentId;
				if (agentId) params.log?.debug?.(`secrets.store.delete requested by agent:${agentId}`);
				if (!createAgentRuntimeAuthorityGuard(client, context, respond).ensureActive()) return;
				holdGatewayPolicyResponse(respond);
				deleteSecretStoreEntry({
					scope: teamScope,
					name: requestParams.name
				});
				deleted = true;
				const result = {
					ok: true,
					...await params.storeWriteService.reloadReference(requestParams.name)
				};
				if (!validateSecretsStoreMutationResult(result)) throw new Error("secrets.store.delete returned invalid payload.");
				respond(true, result);
			} catch (error) {
				if (!deleted && error instanceof SecretStoreValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				params.log?.warn?.(`secrets.store.delete failed: ${formatErrorMessage(error)}`);
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, deleted ? "Secret store entry was deleted, but the active runtime could not refresh. Update the config reference or restore the entry, then retry secrets.reload." : "secrets.store.delete failed"));
			}
		}
	};
}
//#endregion
export { createSecretStoreWriteService, createSecretsHandlers };
