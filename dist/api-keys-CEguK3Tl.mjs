import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-BjYQE8Yy.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { i as isMalformedApiKeyInput } from "./credential-state-WXO5HScp.mjs";
import { a as resolveAuthProfileOrder } from "./order-B7W96aON.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-DFyGzV4n.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import "./model-auth-efmtIdn2.mjs";
import { t as rejectOnboardingOption } from "./onboard-options-CNC8ppU5.mjs";
//#region src/commands/onboard-non-interactive/api-keys.ts
function parseEnvVarNameFromSourceLabel(source) {
	if (!source) return;
	return /^(?:shell env: |env: )([A-Z][A-Z0-9_]*)$/.exec(source.trim())?.[1];
}
async function resolveApiKeyFromProfiles(params) {
	const store = ensureAuthProfileStore(params.agentDir);
	const order = resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: params.provider
	});
	for (const profileId of order) {
		if (store.profiles[profileId]?.type !== "api_key") continue;
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store,
			profileId,
			agentDir: params.agentDir
		});
		if (resolved?.apiKey) return resolved.apiKey;
	}
	return null;
}
/** Resolves an API key for non-interactive setup without prompting the user. */
async function resolveNonInteractiveApiKey(params) {
	const reject = (message) => {
		rejectOnboardingOption(params, params.runtime, message);
		return null;
	};
	const flagKey = normalizeOptionalSecretInput(params.flagValue);
	const explicitEnvVar = params.envVarName?.trim() || params.envVar.trim();
	const resolveEnvKey = () => {
		const envResolved = resolveEnvApiKey(params.provider, process.env, {
			config: params.cfg,
			workspaceDir: params.workspaceDir
		});
		const explicitEnvKey = explicitEnvVar ? normalizeOptionalSecretInput(process.env[explicitEnvVar]) : void 0;
		return {
			key: envResolved?.apiKey ?? explicitEnvKey,
			envVarName: parseEnvVarNameFromSourceLabel(envResolved?.source) ?? explicitEnvVar
		};
	};
	const returnOperatorKey = (key, source, envVarName) => {
		if (!isMalformedApiKeyInput(key)) return envVarName ? {
			key,
			source,
			envVarName
		} : {
			key,
			source
		};
		const envHint = source === "env" ? ` Check ${envVarName ?? params.envVar}.` : "";
		return reject(`Paste the API key value, not an OpenClaw onboarding command.${envHint}`);
	};
	const useSecretRefMode = params.secretInputMode === "ref";
	if (useSecretRefMode && flagKey) {
		const explicitEnvKey = normalizeOptionalSecretInput(process.env[explicitEnvVar]);
		if (explicitEnvKey) return returnOperatorKey(explicitEnvKey, "env", explicitEnvVar);
		return reject([`${params.flagName} cannot be used with --secret-input-mode ref unless ${params.envVar} is set in env.`, `Set ${params.envVar} in env and omit ${params.flagName}, or use --secret-input-mode plaintext.`].join("\n"));
	}
	if (flagKey) return returnOperatorKey(flagKey, "flag");
	const resolvedEnv = resolveEnvKey();
	if (resolvedEnv.key) {
		if (useSecretRefMode && !resolvedEnv.envVarName) return reject([`--secret-input-mode ref requires an explicit environment variable for provider "${params.provider}".`, `Set ${params.envVar} in env and retry, or use --secret-input-mode plaintext.`].join("\n"));
		return returnOperatorKey(resolvedEnv.key, "env", resolvedEnv.envVarName);
	}
	if (params.allowProfile ?? true) {
		const profileKey = await resolveApiKeyFromProfiles({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		if (profileKey) return {
			key: profileKey,
			source: "profile"
		};
	}
	if (params.required === false) return null;
	const profileHint = params.allowProfile === false ? "" : `, or existing ${params.provider} API-key profile`;
	return reject(`Missing ${params.flagName} (or ${params.envVar} in env${profileHint}). Export ${params.envVar}, pass ${params.flagName}, or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
}
//#endregion
export { resolveNonInteractiveApiKey as t };
