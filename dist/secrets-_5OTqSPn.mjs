import { p as normalizeTrimmedStringList, r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { a as isKnownSecretTargetId, i as isKnownCoreSecretTargetId } from "./target-registry-query-f56MMhmb.mjs";
import "./target-registry-1a6D8fYt.mjs";
import { Br as validateSecretsStoreMutationResult, Fr as validateSecretsResolveParams, Ir as validateSecretsResolveResult, Lr as validateSecretsStoreDeleteParams, Rr as validateSecretsStoreListParams, Vr as validateSecretsStoreSetParams, zr as validateSecretsStoreListResult } from "./src-l2dWvEsN.mjs";
import { a as collectSecretStoreRefKeysInSnapshot, u as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-D5wZ6Dom.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { c as deleteSecretStoreEntry, n as listSecretStoreEntries, r as purgeExpiredSecretStoreEntries, u as writeSecretStoreEntry } from "./secret-store-B2HXTuK3.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-BgtfQbi3.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
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
	const mutateStore = async (action, name, respond, mutate, assertCurrent) => {
		const method = `secrets.store.${action}`;
		let committed = false;
		try {
			if (!await mutate()) return;
			committed = true;
			assertCurrent?.();
			const result = {
				ok: true,
				...await params.storeWriteService.reloadReference(name)
			};
			if (!validateSecretsStoreMutationResult(result)) throw new Error(`${method} returned invalid payload.`);
			respond(true, result);
		} catch (error) {
			if (!committed && error instanceof SecretStoreValidationError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			params.log?.warn?.(`${method} failed: ${formatErrorMessage(error)}`);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, !committed ? `${method} failed` : action === "set" ? "Secret store entry was saved, but post-write runtime refresh failed. Resolve provider errors and retry secrets.reload." : "Secret store entry was deleted, but the active runtime could not refresh. Update the config reference or restore the entry, then retry secrets.reload."));
		}
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
		"secrets.store.set": defineValidatedGatewayHandler("secrets.store.set", validateSecretsStoreSetParams, (options) => {
			const { params: requestParams, respond, client, context } = options;
			const authority = createAgentRuntimeAuthorityGuard(client, context, respond, readGatewayRequestMutationAuthority(options).assertCurrent);
			return mutateStore("set", requestParams.name, respond, async () => {
				if (!authority.ensureActive()) return false;
				holdGatewayPolicyResponse(respond);
				await params.storeWriteService.write({
					name: requestParams.name,
					value: requestParams.value,
					kind: requestParams.kind,
					...requestParams.allowedHosts !== void 0 ? { allowedHosts: requestParams.allowedHosts } : {},
					updatedBy: params.storeWriteService.resolveUpdatedBy(client),
					assertCurrent: authority.commitGuard
				});
				return true;
			}, authority.commitGuard);
		}),
		"secrets.store.delete": defineValidatedGatewayHandler("secrets.store.delete", validateSecretsStoreDeleteParams, (options) => {
			const { params: requestParams, respond, client, context } = options;
			const authority = createAgentRuntimeAuthorityGuard(client, context, respond, readGatewayRequestMutationAuthority(options).assertCurrent);
			return mutateStore("delete", requestParams.name, respond, async () => {
				const agentId = client?.internal?.agentRuntimeIdentity?.agentId;
				if (agentId) params.log?.debug?.(`secrets.store.delete requested by agent:${agentId}`);
				if (!authority.ensureActive()) return false;
				holdGatewayPolicyResponse(respond);
				await deleteSecretStoreEntry({
					scope: teamScope,
					name: requestParams.name,
					assertCurrent: authority.commitGuard
				});
				return true;
			}, authority.commitGuard);
		})
	};
}
//#endregion
export { createSecretStoreWriteService, createSecretsHandlers };
