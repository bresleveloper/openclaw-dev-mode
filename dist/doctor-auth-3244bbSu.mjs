import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as formatAuthDoctorHint, n as resolveApiKeyForProfile } from "./oauth-DPCtruSK.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { g as resolveAuthProfileDatabasePath, s as inspectPersistedSharedAuthProfileStoreRaw } from "./sqlite-CW8wNN4G.mjs";
import { m as resolveProfileUnusableUntilForDisplay } from "./profile-usage-stats-BLwxBqRR.mjs";
import { i as findPersistedAuthProfileCredential } from "./store-SwwRUDrm.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-bOpxmzRV.mjs";
import { a as buildOAuthRefreshFailureLoginCommand, i as buildAuthProfileUnusableHint, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { S as shouldUseMainOwnerForLocalOAuthCredential } from "./runtime-snapshot-owner-Dm2mqUH2.mjs";
import { r as hasLocalAuthProfileStoreSource, t as hasAnyAuthProfileStoreSource } from "./source-check-BDmQKwxy.mjs";
import { n as ensureAuthProfileStore, o as loadAuthProfileStoreForRuntime } from "./store-runtime-CzCCJ_Oe.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { n as buildAuthHealthSummary, r as formatRemainingShort, t as DEFAULT_OAUTH_WARN_MS } from "./auth-health-BV-braTj.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BB6wFir2.mjs";
//#region src/commands/doctor-auth.ts
const OPENAI_PROVIDER_ID = "openai";
const LEGACY_CODEX_PROVIDER_ID = "openai-codex";
const CODEX_OAUTH_WARNING_TITLE = "Codex OAuth";
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const LEGACY_CODEX_APIS = /* @__PURE__ */ new Set(["openai-responses", "openai-completions"]);
const AUTH_PROFILES_CHECK_ID = "core/doctor/auth-profiles";
const COPILOT_NOTICE_KEY = "doctor.githubCopilotAmbientTokenNotice";
const DOCTOR_REAUTH_PROVIDER_ALIASES = { [LEGACY_CODEX_PROVIDER_ID]: OPENAI_PROVIDER_ID };
/** Explain the retired ambient-token activation once per state directory. */
function noteCopilotAmbientToken(cfg, env = process.env) {
	if (!(env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim()) || env.COPILOT_GITHUB_TOKEN?.trim() || cfg.models?.providers?.["github-copilot"] || Object.values(cfg.auth?.profiles ?? {}).some((profile) => profile.provider === "github-copilot") || readConfigMachineState(COPILOT_NOTICE_KEY, { env })) return;
	const agentDirs = [void 0, ...listAgentIds(cfg).map((id) => resolveAgentDir(cfg, id, env))];
	for (const agentDir of agentDirs) {
		const store = loadAuthProfileStoreForRuntime(agentDir, {
			readOnly: true,
			allowKeychainPrompt: false
		}, env);
		if (Object.values(store.profiles).some((profile) => profile.provider === "github-copilot")) return;
	}
	let claimed = false;
	updateConfigMachineState(COPILOT_NOTICE_KEY, (shown) => {
		claimed = shown !== true;
		return true;
	}, { env });
	if (claimed) note("GitHub Copilot is no longer enabled by GH_TOKEN/GITHUB_TOKEN. To use Copilot, run `openclaw models auth login --provider github-copilot` or set COPILOT_GITHUB_TOKEN.", "GitHub Copilot");
}
/** Surface the one-time relocation while the legacy shared owner is still active. */
function noteSharedAuthStoreStatus(env = process.env) {
	if (resolveSharedAuthStoreOwnership(env).location !== "legacy-main" || inspectPersistedSharedAuthProfileStoreRaw(env).status !== "readable") return;
	note("Shared auth profiles still live in the main agent database. Run `openclaw doctor --fix` to move them into shared SQLite state and make the main agent deletable.", "Shared auth store");
}
function hasConfiguredCodexOAuthProfile(cfg) {
	return Object.values(cfg.auth?.profiles ?? {}).some((profile) => (profile.provider === OPENAI_PROVIDER_ID || profile.provider === LEGACY_CODEX_PROVIDER_ID) && profile.mode === "oauth");
}
function hasStoredCodexOAuthProfile() {
	const store = ensureAuthProfileStore(void 0, {
		allowKeychainPrompt: false,
		readOnly: true
	});
	return Object.values(store.profiles).some((profile) => (profile.provider === OPENAI_PROVIDER_ID || profile.provider === LEGACY_CODEX_PROVIDER_ID) && profile.type === "oauth");
}
function normalizeCodexOverrideBaseUrl(baseUrl) {
	if (typeof baseUrl !== "string") return;
	return baseUrl.trim().replace(/\/+$/, "");
}
function isLegacyCodexTransportShape(value, inheritedBaseUrl) {
	if (!isRecord(value)) return false;
	const api = typeof value.api === "string" ? value.api : void 0;
	if (!api || !LEGACY_CODEX_APIS.has(api)) return false;
	const baseUrl = normalizeCodexOverrideBaseUrl(value.baseUrl ?? inheritedBaseUrl);
	return !baseUrl || baseUrl === OPENAI_BASE_URL;
}
function hasLegacyCodexTransportOverride(providerOverride) {
	if (!isRecord(providerOverride)) return false;
	if (isLegacyCodexTransportShape(providerOverride)) return true;
	const models = providerOverride.models;
	if (!Array.isArray(models)) return false;
	return models.some((model) => isLegacyCodexTransportShape(model, providerOverride.baseUrl));
}
function buildCodexProviderOverrideWarning(providerOverride) {
	const lines = [`- models.providers.${LEGACY_CODEX_PROVIDER_ID} contains a legacy transport override while Codex OAuth is configured.`, "- Older OpenAI transport settings can shadow the built-in Codex OAuth provider path."];
	if (isRecord(providerOverride)) {
		const record = providerOverride;
		if (typeof record.api === "string") lines.push(`- models.providers.${LEGACY_CODEX_PROVIDER_ID}.api=${record.api}`);
		if (typeof record.baseUrl === "string") lines.push(`- models.providers.${LEGACY_CODEX_PROVIDER_ID}.baseUrl=${record.baseUrl}`);
	}
	lines.push(`- Remove or rewrite the legacy transport override to restore the built-in Codex OAuth provider path after recent fixes.`);
	lines.push("- Custom proxies and header-only overrides can stay; this warning only targets old OpenAI transport settings.");
	return lines.join("\n");
}
function noteLegacyCodexProviderOverride(cfg) {
	const providerOverride = cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
	if (!providerOverride) return;
	if (!hasLegacyCodexTransportOverride(providerOverride)) return;
	if (!hasConfiguredCodexOAuthProfile(cfg) && !hasStoredCodexOAuthProfile()) return;
	note(buildCodexProviderOverrideWarning(providerOverride), CODEX_OAUTH_WARNING_TITLE);
}
function listAuthProfileHealthTargets(cfg) {
	const targets = /* @__PURE__ */ new Map();
	if (hasAnyAuthProfileStoreSource() || Object.keys(cfg.auth?.profiles ?? {}).length > 0) targets.set(resolveSharedAuthStorePath(), { label: "Shared" });
	for (const agentId of listAgentIds(cfg)) {
		const agentDir = resolveAgentDir(cfg, agentId);
		const databasePath = resolveAuthProfileDatabasePath(agentDir);
		if (!targets.has(databasePath) && hasLocalAuthProfileStoreSource(agentDir)) targets.set(databasePath, {
			label: `Agent ${agentId}`,
			agentDir
		});
	}
	return [...targets.values()];
}
function formatOAuthRefreshFailureReason(reason) {
	switch (reason) {
		case "refresh_token_reused":
		case "expired":
		case "invalid_grant":
		case "revoked": return reason;
		case "sign_in_again": return "sign in again";
		case "invalid_refresh_token": return "invalid refresh token";
		default: return "refresh failed";
	}
}
function formatOAuthRefreshFailureDoctorLine(params) {
	const classified = classifyOAuthRefreshFailure(params.message);
	if (!classified) return null;
	const rawProvider = classified.provider ?? params.provider;
	const provider = rawProvider ? DOCTOR_REAUTH_PROVIDER_ALIASES[rawProvider] ?? rawProvider : null;
	const command = buildOAuthRefreshFailureLoginCommand(provider, { profileId: provider === rawProvider ? params.profileId : void 0 });
	const commandMarkdown = formatOAuthRefreshFailureLoginCommandMarkdown(command);
	if (classified.reason) return `- ${params.profileId}: re-auth required [${formatOAuthRefreshFailureReason(classified.reason)}] — Run ${commandMarkdown}.`;
	return `- ${params.profileId}: OAuth refresh failed — Try again; if this persists, run ${commandMarkdown}.`;
}
async function resolveAuthIssueHint(issue, cfg, store) {
	if (issue.reasonCode === "invalid_expires") return "Invalid token expires metadata. Set a future Unix ms timestamp or remove expires.";
	if (issue.reasonCode === "malformed_api_key") return "Paste the API key value, not an OpenClaw onboarding command.";
	const providerHint = await formatAuthDoctorHint({
		cfg,
		store,
		provider: issue.provider,
		profileId: issue.profileId
	});
	if (providerHint.trim()) return providerHint;
	return buildProviderAuthRecoveryHint({ provider: issue.provider }).replace(/^Run /, "Re-auth via ");
}
function collectAuthProfileCooldowns(store) {
	const cooldowns = [];
	const now = Date.now();
	for (const profileId of Object.keys(store.usageStats ?? {})) {
		const until = resolveProfileUnusableUntilForDisplay(store, profileId);
		if (!until || now >= until) continue;
		const stats = store.usageStats?.[profileId];
		const disabledActive = typeof stats?.disabledUntil === "number" && now < stats.disabledUntil;
		const reason = disabledActive ? stats?.disabledReason : stats?.cooldownReason;
		const displayReason = disabledActive ? reason : stats?.cooldownClassification ?? reason;
		cooldowns.push({
			profileId,
			kind: `${disabledActive ? "disabled" : "cooldown"}${displayReason ? `:${displayReason}` : ""}`,
			remaining: formatRemainingShort(until - now),
			hint: buildAuthProfileUnusableHint({
				kind: disabledActive ? "disabled" : "cooldown",
				reason,
				provider: store.profiles[profileId]?.provider ?? findPersistedAuthProfileCredential({ profileId })?.provider ?? profileId,
				profileId
			})
		});
	}
	return cooldowns;
}
function isAuthProfileHealthIssue(profile) {
	if (profile.type === "api_key") return profile.status === "missing";
	return (profile.type === "oauth" || profile.type === "token") && (profile.status === "expired" || profile.status === "expiring" || profile.status === "missing");
}
function loadAuthProfileHealth(params) {
	const store = loadAuthProfileStoreForRuntime(params.target.agentDir, {
		inheritedAuthDir: params.target.agentDir,
		allowKeychainPrompt: params.allowKeychainPrompt,
		readOnly: params.readOnly
	});
	const profiles = params.target.agentDir ? Object.fromEntries(Object.entries(store.profiles).filter(([profileId, local]) => local.type !== "oauth" || !shouldUseMainOwnerForLocalOAuthCredential({
		profileId,
		local,
		main: findPersistedAuthProfileCredential({ profileId })
	}))) : store.profiles;
	return {
		store,
		summary: buildAuthHealthSummary({
			store: {
				...store,
				profiles
			},
			cfg: params.cfg,
			warnAfterMs: DEFAULT_OAUTH_WARN_MS,
			allowKeychainPrompt: params.allowKeychainPrompt
		})
	};
}
/** Collects read-only structured findings for auth profile health. */
async function collectAuthProfileHealthFindings(params) {
	const activeTargets = listAuthProfileHealthTargets(params.cfg);
	const findings = [];
	const labelStores = activeTargets.length > 1;
	for (const target of activeTargets) {
		const { store, summary } = loadAuthProfileHealth({
			cfg: params.cfg,
			allowKeychainPrompt: params.allowKeychainPrompt ?? false,
			readOnly: true,
			target
		});
		const owner = labelStores ? `${target.label} auth profile` : "Auth profile";
		for (const cooldown of collectAuthProfileCooldowns(store)) findings.push({
			checkId: AUTH_PROFILES_CHECK_ID,
			severity: "warning",
			message: `${owner} ${cooldown.profileId} is ${cooldown.kind} (${cooldown.remaining}).`,
			path: resolveAuthStorePathForDisplay(target.agentDir),
			target: cooldown.profileId,
			fixHint: cooldown.hint
		});
		for (const issue of summary.profiles.filter(isAuthProfileHealthIssue)) {
			const hint = await resolveAuthIssueHint(issue, params.cfg, store);
			const remaining = issue.remainingMs !== void 0 ? ` (${formatRemainingShort(issue.remainingMs)})` : "";
			const reason = issue.reasonCode ? ` [${issue.reasonCode}]` : "";
			findings.push({
				checkId: AUTH_PROFILES_CHECK_ID,
				severity: "warning",
				message: `${owner} ${issue.profileId} is ${issue.status}${reason}${remaining}.`,
				path: resolveAuthStorePathForDisplay(target.agentDir),
				target: issue.profileId,
				...issue.reasonCode ? { requirement: issue.reasonCode } : {},
				fixHint: hint ?? (issue.status === "expiring" ? "Run `openclaw doctor --fix` to refresh expiring OAuth profiles, or re-authenticate static tokens." : "Run `openclaw doctor --fix` to refresh OAuth profiles, or re-authenticate this provider.")
			});
		}
	}
	const providerOverride = params.cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
	if (providerOverride && hasLegacyCodexTransportOverride(providerOverride) && (hasConfiguredCodexOAuthProfile(params.cfg) || hasStoredCodexOAuthProfile())) findings.push({
		checkId: AUTH_PROFILES_CHECK_ID,
		severity: "warning",
		message: "Legacy openai-codex transport override can shadow configured Codex OAuth credentials.",
		path: `models.providers.${LEGACY_CODEX_PROVIDER_ID}`,
		target: LEGACY_CODEX_PROVIDER_ID,
		fixHint: buildCodexProviderOverrideWarning(providerOverride)
	});
	return findings;
}
async function noteAuthProfileHealthForTarget(params) {
	let { store, summary } = loadAuthProfileHealth(params);
	const noteTitle = (title) => params.labelStores ? `${title} (${params.target.label})` : title;
	const unusable = collectAuthProfileCooldowns(store).map(({ profileId, kind, remaining, hint }) => `- ${profileId}: ${kind} (${remaining})${hint ? ` — ${hint}` : ""}`);
	if (unusable.length > 0) note(unusable.join("\n"), noteTitle("Auth profile cooldowns"));
	let issues = summary.profiles.filter(isAuthProfileHealthIssue);
	if (issues.length === 0) return [];
	const refreshTargets = issues.filter((issue) => issue.type === "oauth");
	if (refreshTargets.length > 0 && await params.prompter.confirmAutoFix({
		message: "Refresh expiring OAuth tokens now? (static tokens need re-auth)",
		initialValue: true
	})) {
		const errors = [];
		for (const profile of refreshTargets) try {
			await resolveApiKeyForProfile({
				cfg: params.cfg,
				store,
				profileId: profile.profileId,
				agentDir: params.target.agentDir,
				forceRefresh: true
			});
		} catch (err) {
			const message = formatErrorMessage(err);
			errors.push(formatOAuthRefreshFailureDoctorLine({
				profileId: profile.profileId,
				provider: profile.provider,
				message
			}) ?? `- ${profile.profileId}: ${message}`);
		}
		if (errors.length > 0) note(errors.join("\n"), noteTitle("OAuth refresh errors"));
		({store, summary} = loadAuthProfileHealth({
			...params,
			allowKeychainPrompt: false
		}));
		issues = summary.profiles.filter(isAuthProfileHealthIssue);
	}
	return Promise.all(issues.map(async (issue) => {
		const remaining = issue.remainingMs !== void 0 ? ` (${formatRemainingShort(issue.remainingMs)})` : "";
		const hint = await resolveAuthIssueHint(issue, params.cfg, store);
		const reason = issue.reasonCode ? ` [${issue.reasonCode}]` : "";
		return `- ${issue.profileId}: ${issue.status}${reason}${remaining}${hint ? ` — ${hint}` : ""}`;
	}));
}
async function noteAuthProfileHealth(params) {
	const activeTargets = listAuthProfileHealthTargets(params.cfg);
	if (activeTargets.length === 0) return;
	const labelStores = activeTargets.length > 1;
	const storesByIssueLine = /* @__PURE__ */ new Map();
	for (const target of activeTargets) for (const line of await noteAuthProfileHealthForTarget({
		...params,
		target,
		labelStores
	})) {
		const labels = storesByIssueLine.get(line) ?? /* @__PURE__ */ new Set();
		storesByIssueLine.set(line, labels.add(target.label));
	}
	if (storesByIssueLine.size === 0) return;
	const lines = [...storesByIssueLine.entries()].toSorted(([left], [right]) => left.localeCompare(right)).map(([line, labels]) => labels.size === activeTargets.length ? line : `${line} (stores: ${[...labels].toSorted().join(", ")})`);
	note(lines.join("\n"), "Model auth");
}
//#endregion
export { collectAuthProfileHealthFindings, noteAuthProfileHealth, noteCopilotAmbientToken, noteLegacyCodexProviderOverride, noteSharedAuthStoreStatus };
