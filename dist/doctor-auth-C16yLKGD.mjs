import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { i as formatAuthDoctorHint, n as resolveApiKeyForProfile } from "./oauth-CIf65QWM.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { h as resolveAuthProfileDatabasePath, s as inspectPersistedSharedAuthProfileStoreRaw } from "./sqlite-BIg_k8qE.mjs";
import { a as findPersistedAuthProfileCredential } from "./store-CTvq6MSF.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-DblRQQgZ.mjs";
import { a as buildOAuthRefreshFailureLoginCommand, i as buildAuthProfileUnusableHint, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { S as shouldUseMainOwnerForLocalOAuthCredential } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { r as hasLocalAuthProfileStoreSource, t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { p as resolveProfileUnusableUntilForDisplay } from "./usage-state-Bm5iXGhR.mjs";
import { n as ensureAuthProfileStore, o as loadAuthProfileStoreForRuntime } from "./store-runtime-BcoYkagW.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { n as buildAuthHealthSummary, r as formatRemainingShort, t as DEFAULT_OAUTH_WARN_MS } from "./auth-health-BjdR9hLJ.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BWahCZqw.mjs";
//#region src/commands/doctor-auth.ts
/** Doctor notes for auth profile health, OAuth refresh failures, and legacy Codex config. */
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
function legacyCodexProviderOverrideToHealthFinding(providerOverride) {
	const message = "Legacy openai-codex transport override can shadow configured Codex OAuth credentials.";
	const details = buildCodexProviderOverrideWarning(providerOverride);
	return {
		checkId: AUTH_PROFILES_CHECK_ID,
		severity: "warning",
		message,
		path: `models.providers.${LEGACY_CODEX_PROVIDER_ID}`,
		target: LEGACY_CODEX_PROVIDER_ID,
		fixHint: details
	};
}
/** Emits a warning when legacy Codex transport overrides can shadow configured Codex OAuth. */
function noteLegacyCodexProviderOverride(cfg) {
	const providerOverride = cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
	if (!providerOverride) return;
	if (!hasLegacyCodexTransportOverride(providerOverride)) return;
	if (!hasConfiguredCodexOAuthProfile(cfg) && !hasStoredCodexOAuthProfile()) return;
	note(buildCodexProviderOverrideWarning(providerOverride), CODEX_OAUTH_WARNING_TITLE);
}
function formatAuthNoteTitle(title, target, labelStores) {
	return labelStores ? `${title} (${target.label})` : title;
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
		case "refresh_token_reused": return "refresh_token_reused";
		case "expired": return "expired";
		case "invalid_grant": return "invalid_grant";
		case "sign_in_again": return "sign in again";
		case "invalid_refresh_token": return "invalid refresh token";
		case "revoked": return "revoked";
		default: return "refresh failed";
	}
}
/** Formats provider OAuth refresh failures as actionable doctor note lines. */
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
async function formatAuthIssueLine(issue, cfg, store) {
	const remaining = issue.remainingMs !== void 0 ? ` (${formatRemainingShort(issue.remainingMs)})` : "";
	const hint = await resolveAuthIssueHint(issue, cfg, store);
	const reason = issue.reasonCode ? ` [${issue.reasonCode}]` : "";
	return `- ${issue.profileId}: ${issue.status}${reason}${remaining}${hint ? ` — ${hint}` : ""}`;
}
function resolveAuthProfileStorePath(target) {
	return resolveAuthStorePathForDisplay(target.agentDir);
}
function authProfileIssueToHealthFinding(params) {
	const remaining = params.issue.remainingMs !== void 0 ? ` (${formatRemainingShort(params.issue.remainingMs)})` : "";
	const reason = params.issue.reasonCode ? ` [${params.issue.reasonCode}]` : "";
	const owner = params.labelStores ? `${params.target.label} auth profile` : "Auth profile";
	return {
		checkId: AUTH_PROFILES_CHECK_ID,
		severity: "warning",
		message: `${owner} ${params.issue.profileId} is ${params.issue.status}${reason}${remaining}.`,
		path: resolveAuthProfileStorePath(params.target),
		target: params.issue.profileId,
		...params.issue.reasonCode ? { requirement: params.issue.reasonCode } : {},
		fixHint: params.hint ?? (params.issue.status === "expiring" ? "Run `openclaw doctor --fix` to refresh expiring OAuth profiles, or re-authenticate static tokens." : "Run `openclaw doctor --fix` to refresh OAuth profiles, or re-authenticate this provider.")
	};
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
function authProfileCooldownToHealthFinding(params) {
	return {
		checkId: AUTH_PROFILES_CHECK_ID,
		severity: "warning",
		message: params.labelStores ? `${params.target.label} auth profile ${params.profileId} is ${params.kind} (${params.remaining}).` : `Auth profile ${params.profileId} is ${params.kind} (${params.remaining}).`,
		path: resolveAuthProfileStorePath(params.target),
		target: params.profileId,
		fixHint: params.hint
	};
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
async function collectAuthProfileHealthFindingsForTarget(params) {
	const { store, summary } = loadAuthProfileHealth({
		...params,
		readOnly: true
	});
	const findings = [];
	for (const cooldown of collectAuthProfileCooldowns(store)) findings.push(authProfileCooldownToHealthFinding({
		...cooldown,
		target: params.target,
		labelStores: params.labelStores
	}));
	const issues = summary.profiles.filter(isAuthProfileHealthIssue);
	for (const issue of issues) {
		const authIssue = {
			profileId: issue.profileId,
			provider: issue.provider,
			status: issue.status,
			reasonCode: issue.reasonCode,
			remainingMs: issue.remainingMs
		};
		findings.push(authProfileIssueToHealthFinding({
			issue: authIssue,
			target: params.target,
			labelStores: params.labelStores,
			hint: await resolveAuthIssueHint(authIssue, params.cfg, store)
		}));
	}
	return findings;
}
/** Collects read-only structured findings for auth profile health. */
async function collectAuthProfileHealthFindings(params) {
	const activeTargets = listAuthProfileHealthTargets(params.cfg);
	const findings = [];
	const labelStores = activeTargets.length > 1;
	for (const target of activeTargets) findings.push(...await collectAuthProfileHealthFindingsForTarget({
		cfg: params.cfg,
		allowKeychainPrompt: params.allowKeychainPrompt ?? false,
		target,
		labelStores
	}));
	const providerOverride = params.cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
	if (providerOverride && hasLegacyCodexTransportOverride(providerOverride) && (hasConfiguredCodexOAuthProfile(params.cfg) || hasStoredCodexOAuthProfile())) findings.push(legacyCodexProviderOverrideToHealthFinding(providerOverride));
	return findings;
}
async function noteAuthProfileHealthForTarget(params) {
	let { store, summary } = loadAuthProfileHealth(params);
	const noteTitle = (title) => formatAuthNoteTitle(title, params.target, params.labelStores);
	const unusable = collectAuthProfileCooldowns(store).map(({ profileId, kind, remaining, hint }) => `- ${profileId}: ${kind} (${remaining})${hint ? ` — ${hint}` : ""}`);
	if (unusable.length > 0) note(unusable.join("\n"), noteTitle("Auth profile cooldowns"));
	const findIssues = () => summary.profiles.filter(isAuthProfileHealthIssue);
	let issues = findIssues();
	if (issues.length === 0) return [];
	const refreshTargets = issues.filter((issue) => issue.type === "oauth" && [
		"expired",
		"expiring",
		"missing"
	].includes(issue.status));
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
		issues = findIssues();
	}
	return Promise.all(issues.map((issue) => formatAuthIssueLine(issue, params.cfg, store)));
}
/** Checks configured agent auth stores and emits doctor notes for stale or unusable profiles. */
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
