import { D as resolveExpiresAtMsFromDurationMs } from "../../number-coercion-CkhMiRw8.mjs";
import { t as formatCliCommand } from "../../command-format-CYoE8cOC.mjs";
import { t as parseDurationMs } from "../../parse-duration-B7MSnEK8.mjs";
import { f as listProfilesForProvider } from "../../order-CElLtwMu.mjs";
import { n as suggestOAuthProfileIdForLegacyDefault } from "../../repair-WSbxspnm.mjs";
import "../../number-runtime-D3v2w3D4.mjs";
import { t as applyAuthProfileConfig } from "../../provider-auth-helpers-olPFvVdo.mjs";
import "../../cli-runtime-DAonhbWy.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { i as upsertAuthProfileWithLockOrThrowCompat } from "../../provider-auth-write-compat-OjysXMOc.mjs";
import { n as validateAnthropicSetupToken, t as buildTokenProfileId } from "../../provider-auth-token-Bw-5VAtG.mjs";
import "../../provider-auth-api-key-CX1PLM3g.mjs";
import { t as probeClaudeCliAuthStatus } from "../../cli-auth-seam-D_qDTt5a.mjs";
import { t as buildAnthropicCliMigrationResult } from "../../cli-migration-DpNIiqPT.mjs";
//#region extensions/anthropic/auth.runtime.ts
/** Auth execution stays deferred until a setup or doctor hook is invoked. */
const PROVIDER_ID = "anthropic";
/** Collect provider account scope separately from the agent's filesystem workspace. */
async function runAnthropicApiKeyAuth(ctx, runApiKeyAuth) {
	const result = await runApiKeyAuth(ctx);
	const provider = ctx.config.models?.providers?.[PROVIDER_ID];
	if ([provider?.headers, provider?.request?.headers].some((headers) => Object.entries(headers ?? {}).some(([name, value]) => name.toLowerCase() === "anthropic-workspace-id" && (typeof value !== "string" || value.trim().length > 0)))) return result;
	await ctx.prompter.note("API keys that are not scoped to a workspace require an Anthropic workspace ID from the Claude Console. This provider setting applies to all Anthropic API requests, not an agent's local workspace. Leave it blank for a workspace-scoped key.", "Anthropic API workspace");
	const workspaceId = (await ctx.prompter.text({
		message: "Anthropic workspace ID (optional for workspace-scoped keys)",
		placeholder: "wrkspc_..."
	})).trim();
	return workspaceId ? {
		...result,
		configPatch: { models: { providers: { anthropic: {
			baseUrl: "https://api.anthropic.com",
			models: [],
			...provider,
			headers: {
				...provider?.headers,
				"anthropic-workspace-id": workspaceId
			}
		} } } }
	} : result;
}
const ANTHROPIC_SETUP_TOKEN_NOTE_LINES = [
	"Anthropic setup-token auth is supported in OpenClaw.",
	"OpenClaw prefers the native Claude CLI runtime when it is available on the host.",
	"Anthropic staff told us this OpenClaw path is allowed again.",
	`If you want a direct API billing path instead, use ${formatCliCommand("openclaw models auth login --provider anthropic --method api-key --set-default")} or ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`
];
function normalizeAnthropicSetupTokenInput(value) {
	return value.replaceAll(/\s+/g, "");
}
function resolveAnthropicSetupTokenProfileId(config = {}, rawProfileId) {
	if (typeof rawProfileId === "string") {
		const trimmed = rawProfileId.trim();
		if (trimmed.length > 0) {
			if (trimmed.startsWith(`${PROVIDER_ID}:`)) return trimmed;
			return buildTokenProfileId({
				provider: PROVIDER_ID,
				name: trimmed
			});
		}
	}
	let profileId = `${PROVIDER_ID}:default`;
	for (let suffix = 1;; suffix += 1) {
		const configured = config.auth?.profiles?.[profileId];
		if (!configured || configured.provider === PROVIDER_ID && (configured.mode === "token" || configured.mode === "oauth")) return profileId;
		profileId = buildTokenProfileId({
			provider: PROVIDER_ID,
			name: suffix === 1 ? "setup-token" : `setup-token-${suffix}`
		});
	}
}
function resolveAnthropicSetupTokenExpiry(rawExpiresIn) {
	if (typeof rawExpiresIn !== "string" || rawExpiresIn.trim().length === 0) return;
	return resolveExpiresAtMsFromDurationMs(parseDurationMs(rawExpiresIn.trim(), { defaultUnit: "d" }));
}
async function runAnthropicSetupTokenAuth(ctx, defaultModel) {
	const token = (typeof ctx.opts?.token === "string" && ctx.opts.token.trim().length > 0 ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : void 0) ?? normalizeAnthropicSetupTokenInput(await ctx.prompter.text({
		message: "Paste Anthropic setup-token",
		validate: (value) => validateAnthropicSetupToken(normalizeAnthropicSetupTokenInput(value))
	}));
	const tokenError = validateAnthropicSetupToken(token);
	if (tokenError) throw new Error(tokenError);
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.config, ctx.opts?.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts?.tokenExpiresIn);
	return {
		profiles: [{
			profileId,
			credential: {
				type: "token",
				provider: PROVIDER_ID,
				token,
				...expires ? { expires } : {}
			}
		}],
		defaultModel,
		notes: [...ANTHROPIC_SETUP_TOKEN_NOTE_LINES]
	};
}
function validateAnthropicSetupTokenNonInteractive(ctx) {
	if (ctx.opts.secretInputMode === "ref") throw new Error("Anthropic setup-token input cannot be stored with --secret-input-mode ref. Use --secret-input-mode plaintext.");
	const rawToken = typeof ctx.opts.token === "string" ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : "";
	const tokenError = validateAnthropicSetupToken(rawToken);
	if (tokenError) throw new Error(["Anthropic setup-token auth requires --token with a valid setup-token.", tokenError].join("\n"));
	try {
		resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	} catch (error) {
		throw new Error(`Invalid --token-expires-in: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	return rawToken;
}
async function runAnthropicSetupTokenNonInteractive(ctx, defaultModel) {
	const rawToken = validateAnthropicSetupTokenNonInteractive(ctx);
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.config, ctx.opts.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	await upsertAuthProfileWithLockOrThrowCompat({
		profileId,
		credential: {
			type: "token",
			provider: PROVIDER_ID,
			token: rawToken,
			...expires ? { expires } : {}
		},
		agentDir: ctx.agentDir
	});
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[0]);
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[1]);
	const withProfile = applyAuthProfileConfig(ctx.config, {
		profileId,
		provider: PROVIDER_ID,
		mode: ctx.config.auth?.profiles?.[profileId]?.mode === "oauth" ? "oauth" : "token"
	});
	const existingModelConfig = withProfile.agents?.defaults?.model && typeof withProfile.agents.defaults.model === "object" ? withProfile.agents.defaults.model : {};
	return {
		...withProfile,
		agents: {
			...withProfile.agents,
			defaults: {
				...withProfile.agents?.defaults,
				model: {
					...existingModelConfig,
					primary: defaultModel
				}
			}
		}
	};
}
function buildAnthropicAuthDoctorHint(params) {
	const legacyProfileId = params.profileId ?? "anthropic:default";
	const suggested = suggestOAuthProfileIdForLegacyDefault({
		cfg: params.config,
		store: params.store,
		provider: PROVIDER_ID,
		legacyProfileId
	});
	if (!suggested || suggested === legacyProfileId) return "";
	const storeOauthProfiles = listProfilesForProvider(params.store, PROVIDER_ID).filter((id) => params.store.profiles[id]?.type === "oauth").join(", ");
	const cfgMode = params.config?.auth?.profiles?.[legacyProfileId]?.mode;
	const cfgProvider = params.config?.auth?.profiles?.[legacyProfileId]?.provider;
	return [
		"Doctor hint (for GitHub issue):",
		`- provider: ${PROVIDER_ID}`,
		`- config: ${legacyProfileId}${cfgProvider || cfgMode ? ` (provider=${cfgProvider ?? "?"}, mode=${cfgMode ?? "?"})` : ""}`,
		`- auth store oauth profiles: ${storeOauthProfiles || "(none)"}`,
		`- suggested profile: ${suggested}`,
		`Fix: run "${formatCliCommand("openclaw doctor --yes")}"`
	].join("\n");
}
async function runAnthropicCliMigration(ctx) {
	const authStatus = await probeClaudeCliAuthStatus({ env: ctx.env ?? process.env });
	if (authStatus.status !== "available") {
		const error = authStatus.status === "missing" ? ["Claude CLI is not authenticated on this host.", `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`] : authStatus.status === "not-installed" ? ["Claude CLI (`claude`) was not found on PATH.", `Install Claude Code or add it to PATH, run ${formatCliCommand("claude auth login")}, then re-run this setup.`] : [authStatus.status === "timeout" ? `Could not verify the installed Claude CLI login within ${authStatus.timeoutMs / 1e3} s.` : "Could not verify the installed Claude CLI login.", `Run ${formatCliCommand("claude auth status --json")}, then retry this setup.`];
		throw new Error(error.join("\n"));
	}
	return buildAnthropicCliMigrationResult(ctx.config);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
	const result = await runAnthropicCliMigration(ctx);
	const currentDefaults = ctx.config.agents?.defaults;
	const currentModel = currentDefaults?.model;
	const currentFallbacks = currentModel && typeof currentModel === "object" && "fallbacks" in currentModel ? currentModel.fallbacks : void 0;
	const migratedModel = result.configPatch?.agents?.defaults?.model;
	const migratedFallbacks = migratedModel && typeof migratedModel === "object" && "fallbacks" in migratedModel ? migratedModel.fallbacks : void 0;
	const nextFallbacks = Array.isArray(migratedFallbacks) ? migratedFallbacks : currentFallbacks;
	return {
		...ctx.config,
		...result.configPatch,
		agents: {
			...ctx.config.agents,
			...result.configPatch?.agents,
			defaults: {
				...currentDefaults,
				...result.configPatch?.agents?.defaults,
				model: {
					...Array.isArray(nextFallbacks) ? { fallbacks: nextFallbacks } : {},
					primary: result.defaultModel
				}
			}
		}
	};
}
//#endregion
export { buildAnthropicAuthDoctorHint, runAnthropicApiKeyAuth, runAnthropicCliMigration, runAnthropicCliMigrationNonInteractive, runAnthropicSetupTokenAuth, runAnthropicSetupTokenNonInteractive, validateAnthropicSetupTokenNonInteractive };
