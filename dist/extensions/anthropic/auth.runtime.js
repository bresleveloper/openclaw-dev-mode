import { D as resolveExpiresAtMsFromDurationMs } from "../../number-coercion-CuVhdCBs.mjs";
import { t as formatCliCommand } from "../../command-format-DwEdrDKL.mjs";
import { t as parseDurationMs } from "../../parse-duration-C4JaJvt9.mjs";
import { f as listProfilesForProvider } from "../../order-B7W96aON.mjs";
import { n as suggestOAuthProfileIdForLegacyDefault } from "../../repair-CkThvU-e.mjs";
import "../../number-runtime-CgyXj1A5.mjs";
import { t as applyAuthProfileConfig } from "../../provider-auth-helpers-DYE6_4KQ.mjs";
import "../../cli-runtime-DIoqxVK3.mjs";
import "../../provider-auth-C3BBF7yn.mjs";
import { i as upsertAuthProfileWithLockOrThrowCompat } from "../../provider-auth-write-compat-B5xygsJD.mjs";
import { n as validateAnthropicSetupToken, t as buildTokenProfileId } from "../../provider-auth-token-Bn7OhxfC.mjs";
import "../../provider-auth-api-key-uE6qOqkQ.mjs";
import { t as probeClaudeCliAuthStatus } from "../../cli-auth-seam-D_p5Ffc_.mjs";
import { t as buildAnthropicCliMigrationResult } from "../../cli-migration-BXeCHwq5.mjs";
//#region extensions/anthropic/auth.runtime.ts
/** Auth execution stays deferred until a setup or doctor hook is invoked. */
const PROVIDER_ID = "anthropic";
const ANTHROPIC_SETUP_TOKEN_NOTE_LINES = [
	"Anthropic setup-token auth is supported in OpenClaw.",
	"OpenClaw prefers the native Claude CLI runtime when it is available on the host.",
	"Anthropic staff told us this OpenClaw path is allowed again.",
	`If you want a direct API billing path instead, use ${formatCliCommand("openclaw models auth login --provider anthropic --method api-key --set-default")} or ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`
];
function normalizeAnthropicSetupTokenInput(value) {
	return value.replaceAll(/\s+/g, "");
}
function resolveAnthropicSetupTokenProfileId(rawProfileId) {
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
	return `${PROVIDER_ID}:default`;
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
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts?.tokenProfileId);
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
	if (ctx.opts.secretInputMode === "ref") {
		ctx.runtime.error("Anthropic setup-token input cannot be stored with --secret-input-mode ref. Use --secret-input-mode plaintext.");
		ctx.runtime.exit(1);
		return null;
	}
	const rawToken = typeof ctx.opts.token === "string" ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : "";
	const tokenError = validateAnthropicSetupToken(rawToken);
	if (tokenError) {
		ctx.runtime.error(["Anthropic setup-token auth requires --token with a valid setup-token.", tokenError].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	try {
		resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	} catch (error) {
		ctx.runtime.error(`Invalid --token-expires-in: ${error instanceof Error ? error.message : String(error)}`);
		ctx.runtime.exit(1);
		return null;
	}
	return rawToken;
}
async function runAnthropicSetupTokenNonInteractive(ctx, defaultModel) {
	const rawToken = validateAnthropicSetupTokenNonInteractive(ctx);
	if (!rawToken) return null;
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts.tokenProfileId);
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
		mode: "token"
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
	if ((await probeClaudeCliAuthStatus({ env: ctx.env ?? process.env })).status !== "available") throw new Error(["Claude CLI is not authenticated on this host.", `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`].join("\n"));
	return buildAnthropicCliMigrationResult(ctx.config);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
	const authStatus = await probeClaudeCliAuthStatus();
	if (authStatus.status !== "available") {
		const error = authStatus.status === "unreadable" ? ["Auth choice \"anthropic-cli\" could not verify the installed Claude CLI login.", `Run ${formatCliCommand("claude auth status")}, then retry.`] : ["Auth choice \"anthropic-cli\" requires Claude CLI auth on this host.", `Run ${formatCliCommand("claude auth login")} first.`];
		ctx.runtime.error(error.join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const result = buildAnthropicCliMigrationResult(ctx.config);
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
export { buildAnthropicAuthDoctorHint, runAnthropicCliMigration, runAnthropicCliMigrationNonInteractive, runAnthropicSetupTokenAuth, runAnthropicSetupTokenNonInteractive, validateAnthropicSetupTokenNonInteractive };
