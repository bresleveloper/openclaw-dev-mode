import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as getAcpSessionManager } from "./manager-BSwH2tZB.mjs";
import { t as buildConfiguredAcpSessionKey } from "./persistent-bindings.types-C5MKo8rH.mjs";
//#region src/acp/persistent-bindings.lifecycle.ts
/** Ensures configured channel-to-ACP bindings have live sessions and matching runtime options. */
function sessionStructurallyMatchesConfiguredBinding(params) {
	if (params.meta.state === "error") return false;
	const desiredAgent = normalizeLowercaseStringOrEmpty(params.spec.acpAgentId ?? params.spec.agentId);
	const currentAgent = normalizeLowercaseStringOrEmpty(params.meta.agent);
	if (!currentAgent || currentAgent !== desiredAgent) return false;
	if (params.meta.mode !== params.spec.mode) return false;
	const desiredBackend = normalizeOptionalString(params.spec.backend) ?? normalizeOptionalString(params.cfg.acp?.backend) ?? "";
	if (desiredBackend) {
		const currentBackend = (params.meta.backend ?? "").trim();
		if (!currentBackend || currentBackend !== desiredBackend) return false;
	}
	const desiredCwd = normalizeOptionalString(params.spec.cwd);
	if (desiredCwd !== void 0) {
		if (desiredCwd !== (params.meta.runtimeOptions?.cwd ?? params.meta.cwd ?? "").trim()) return false;
	}
	return true;
}
/** Creates or replaces the ACP session required by one configured binding. */
async function ensureConfiguredAcpBindingSession(params) {
	const sessionKey = buildConfiguredAcpSessionKey(params.spec);
	const acpManager = getAcpSessionManager();
	const runtimeOptions = {
		...params.spec.model ? { model: params.spec.model } : {},
		...params.spec.thinking ? { thinking: params.spec.thinking } : {}
	};
	try {
		const resolution = acpManager.resolveSession({
			cfg: params.cfg,
			agentId: params.spec.agentId,
			sessionKey
		});
		if (resolution.kind === "ready" && sessionStructurallyMatchesConfiguredBinding({
			cfg: params.cfg,
			spec: params.spec,
			meta: resolution.meta
		})) {
			let currentOptions = resolution.meta.runtimeOptions;
			for (const key of ["model", "thinking"]) {
				const value = runtimeOptions[key];
				if (value !== void 0 && normalizeOptionalString(currentOptions?.[key]) !== value) {
					params.assertActive?.();
					currentOptions = await acpManager.setSessionConfigOption({
						...params.assertActive ? { assertActive: params.assertActive } : {},
						cfg: params.cfg,
						agentId: params.spec.agentId,
						sessionKey,
						key,
						value
					});
				}
			}
			return {
				ok: true,
				sessionKey
			};
		}
		if (resolution.kind !== "none") {
			params.assertActive?.();
			await acpManager.closeSession({
				...params.assertActive ? { assertActive: params.assertActive } : {},
				cfg: params.cfg,
				agentId: params.spec.agentId,
				sessionKey,
				reason: "config-binding-reconfigure",
				clearMeta: false,
				allowBackendUnavailable: true,
				requireAcpSession: false
			});
		}
		params.assertActive?.();
		await acpManager.initializeSession({
			...params.assertActive ? { assertActive: params.assertActive } : {},
			cfg: params.cfg,
			agentId: params.spec.agentId,
			sessionKey,
			agent: params.spec.acpAgentId ?? params.spec.agentId,
			mode: params.spec.mode,
			runtimeOptions,
			cwd: params.spec.cwd,
			backendId: params.spec.backend
		});
		return {
			ok: true,
			sessionKey
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		logVerbose(`acp-configured-binding: failed ensuring ${params.spec.channel}:${params.spec.accountId}:${params.spec.conversationId} -> ${sessionKey}: ${message}`);
		return {
			ok: false,
			sessionKey,
			error: message
		};
	}
}
/** Resolves a configured binding for a conversation and ensures its ACP session exists. */
async function ensureConfiguredAcpBindingReadyCore(params) {
	if (!params.configuredBinding) return { ok: true };
	const ensured = await ensureConfiguredAcpBindingSession({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		spec: params.configuredBinding.spec
	});
	if (ensured.ok) return { ok: true };
	return {
		ok: false,
		error: ensured.error ?? "unknown error"
	};
}
//#endregion
export { ensureConfiguredAcpBindingSession as n, ensureConfiguredAcpBindingReadyCore as t };
