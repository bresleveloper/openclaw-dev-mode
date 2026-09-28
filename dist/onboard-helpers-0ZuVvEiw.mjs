import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as canonicalPathFromExistingAncestor, c as isPathInside } from "./fs-safe-BAPek8At.mjs";
import { _ as resolveConfigDir, f as shortenHomeInString, h as sleep, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-hMJcajDi.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as isInvalidGatewaySecret } from "./known-weak-gateway-secrets-BzNXiOK5.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { r as probeGateway } from "./probe-DaF600Lm.mjs";
import "./control-ui-links-eOymVKB5.mjs";
import { t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import { r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { t as printClawBanner } from "./claw-banner-BDiTg1JQ.mjs";
import "./detect-binary-CzJJYZjS.mjs";
import "./browser-open-4uUcM1Wd.mjs";
import { c as removeWorkspaceDirs, i as moveToTrash, r as listAgentSessionDirs } from "./cleanup-utils-MkYk5me2.mjs";
import { inspect } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { cancel } from "@clack/prompts";
//#region src/commands/onboard-helpers.ts
/** Shared helpers for onboarding, reset, gateway checks, and wizard output. */
/** Handles Clack cancellation by exiting through the runtime. */
function guardCancel(value, runtime, exitCode = 0) {
	if (typeof value === "symbol") {
		cancel(stylePromptTitle("Setup cancelled.") ?? "Setup cancelled.");
		runtime.exit(exitCode);
		throw new Error("unreachable");
	}
	return value;
}
/** Summarizes existing config values before onboarding overwrites or reuses them. */
function summarizeExistingConfig(config) {
	const rows = [];
	const defaults = config.agents?.defaults;
	if (defaults?.workspace) rows.push(shortenHomeInString(`Workspace: ${defaults.workspace}`));
	if (defaults?.model) {
		const model = resolveAgentModelPrimaryValue(defaults.model);
		if (model) rows.push(shortenHomeInString(`Model: ${model}`));
	}
	const gatewaySummary = summarizeGatewayConfig(config);
	if (gatewaySummary) rows.push(shortenHomeInString(gatewaySummary));
	if (config.skills?.install?.nodeManager) rows.push(shortenHomeInString(`Node manager: ${config.skills.install.nodeManager}`));
	return rows.length ? rows.join("\n") : "No key settings detected.";
}
function summarizeGatewayConfig(config) {
	const gateway = config.gateway;
	if (!gateway?.mode && typeof gateway?.port !== "number" && !gateway?.bind && !gateway?.remote?.url) return null;
	const mode = normalizeOptionalString(gateway.mode);
	const bind = formatGatewayBind(gateway.bind);
	const remoteUrl = normalizeOptionalString(gateway.remote?.url);
	const useRemoteUrl = remoteUrl !== void 0 && mode !== "local";
	const endpoint = useRemoteUrl && remoteUrl ? remoteUrl : typeof gateway.port === "number" ? `:${gateway.port}` : void 0;
	const words = [];
	if (mode) words.push(mode);
	if (bind) words.push(mode ? `via ${bind}` : bind);
	if (mode === "remote" && !remoteUrl) {
		words.push("(missing remote URL)");
		return `Gateway: ${words.join(" ")}`;
	}
	if (endpoint) words.push(`${useRemoteUrl ? "at" : "on"} ${endpoint}`);
	return `Gateway: ${words.length > 0 ? words.join(" ") : "configured"}`;
}
function formatGatewayBind(value) {
	switch (value) {
		case "lan": return "LAN";
		case "loopback": return "loopback";
		case "tailnet": return "tailnet";
		case "auto": return "auto";
		case "custom": return "custom";
		default: return normalizeOptionalString(value);
	}
}
/** Normalizes gateway token prompts while rejecting JS stringification sentinels. */
function normalizeGatewayTokenInput(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (isInvalidGatewaySecret(trimmed)) return "";
	return trimmed;
}
/** Validates gateway password prompt input. */
function validateGatewayPasswordInput(value) {
	if (typeof value !== "string") return "Required";
	const trimmed = value.trim();
	if (!trimmed) return "Required";
	if (trimmed === "undefined" || trimmed === "null") return "Cannot be the literal string \"undefined\" or \"null\"";
}
/** Prints the onboarding banner: pixel mascot beside the OPENCLAW wordmark. */
async function printWizardHeader(runtime) {
	await printClawBanner(runtime);
}
/** Records wizard provenance metadata on config writes. */
function applyWizardMetadata(cfg, params) {
	const commit = normalizeOptionalString(process.env.GIT_COMMIT) ?? normalizeOptionalString(process.env.GIT_SHA);
	return inheritLegacyDefaultAgentId(cfg, {
		...cfg,
		wizard: {
			...cfg.wizard,
			lastRunAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastRunVersion: VERSION,
			lastRunCommit: commit,
			lastRunCommand: params.command,
			lastRunMode: params.mode
		}
	});
}
/** Formats the no-GUI SSH tunnel hint for opening the Control UI remotely. */
function formatControlUiSshHint(params) {
	const basePath = normalizeControlUiBasePath(params.basePath);
	const uiPath = basePath ? `${basePath}/` : "/";
	const localUrl = `${params.tlsEnabled ? "https" : "http"}://localhost:${params.port}${uiPath}`;
	return [
		"No GUI detected. Open from your computer:",
		`ssh -N -L ${params.port}:127.0.0.1:${params.port} <user>@<host>`,
		"Then open:",
		localUrl,
		"BYOH note: lan, tailnet, and custom bind are currently IPv4-only.",
		"If your host is IPv6-only, use an IPv4 sidecar or proxy in front of the Gateway.",
		"Docs:",
		"https://docs.openclaw.ai/gateway/remote",
		"https://docs.openclaw.ai/web/control-ui"
	].filter(Boolean).join("\n");
}
/** Ensures workspace bootstrap files and session transcript directories exist. */
async function ensureWorkspaceAndSessions(workspaceDir, runtime, options) {
	const ws = await ensureAgentWorkspace({
		dir: workspaceDir,
		ensureBootstrapFiles: !options?.skipBootstrap,
		skipOptionalBootstrapFiles: options?.skipOptionalBootstrapFiles,
		beforePersistentApply: options.beforePersistentApply
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDirForAgent(options.agentId);
	options.beforePersistentApply?.();
	await fs.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
	return { bootstrapPending: ws.bootstrapPending === true };
}
async function assertFullResetPreservesOnboardingLock(workspaceDir) {
	const [workspacePath, migrationDir] = await Promise.all([canonicalPathFromExistingAncestor(path.resolve(workspaceDir)), canonicalPathFromExistingAncestor(path.join(resolveStateDir(), "migration"))]);
	if (workspacePath === migrationDir || isPathInside(workspacePath, migrationDir) || isPathInside(migrationDir, workspacePath)) throw new Error("Full reset workspace overlaps the active onboarding lock directory. Choose a workspace outside the OpenClaw state migration directory or use a narrower reset scope.");
}
/** Deletes onboarding-managed state according to the selected reset scope. */
async function handleReset(scope, workspaceDir, runtime) {
	if (scope === "full") await assertFullResetPreservesOnboardingLock(workspaceDir);
	const failures = [];
	const trashRequiredPath = async (targetPath) => {
		if (!await moveToTrash(targetPath, runtime)) failures.push(targetPath);
	};
	await trashRequiredPath(resolveConfigPath());
	if (scope === "config") {
		throwIfResetFailed(failures);
		return;
	}
	await trashRequiredPath(path.join(resolveConfigDir(), "credentials"));
	const stateDir = resolveStateDir();
	try {
		const sessionDirs = await listAgentSessionDirs(stateDir);
		for (const sessionDir of sessionDirs) await trashRequiredPath(sessionDir);
	} catch {
		failures.push(path.join(stateDir, "agents"));
	}
	if (scope === "full") failures.push(...await removeWorkspaceDirs([workspaceDir], runtime, {
		removeStateRows: true,
		removeWorkspace: (workspace) => moveToTrash(workspace, runtime)
	}));
	throwIfResetFailed(failures);
}
function throwIfResetFailed(failures) {
	const uniqueFailures = [...new Set(failures)];
	if (uniqueFailures.length > 0) throw new Error(`Reset failed to remove required state:\n${uniqueFailures.join("\n")}`);
}
function runOnboardingGatewayProbe(params, detailLevel) {
	const url = params.url.trim();
	const timeoutMs = params.timeoutMs ?? Math.max(1500, params.preauthHandshakeTimeoutMs ?? 0);
	return probeGateway({
		url,
		...params.config ? { config: params.config } : {},
		...params.originScopedDeviceAuth ? { originScopedDeviceAuth: true } : {},
		timeoutMs,
		auth: {
			token: params.token,
			password: params.password
		},
		...params.tlsFingerprint ? { tlsFingerprint: params.tlsFingerprint } : {},
		...params.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: params.preauthHandshakeTimeoutMs } : {},
		detailLevel
	});
}
/** Runs a single lightweight gateway probe for onboarding readiness checks. */
async function probeGatewayReachable(params) {
	try {
		const probe = await runOnboardingGatewayProbe(params, "none");
		if (!probe.ok) return {
			ok: false,
			detail: probe.error ?? void 0
		};
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			detail: summarizeError(err)
		};
	}
}
/** Reads only Gateway config and classifies whether its default agent has inference. */
async function probeGatewayConfiguredModel(params) {
	let probe;
	try {
		probe = await runOnboardingGatewayProbe(params, "config");
	} catch (err) {
		return {
			kind: "unreachable",
			detail: summarizeError(err)
		};
	}
	const detail = probe.error ?? void 0;
	if (!probe.gatewayReached) return {
		kind: "unreachable",
		...detail ? { detail } : {}
	};
	if (!probe.ok) return {
		kind: "reachable-unverified",
		detail
	};
	const snapshot = probe.configSnapshot;
	const configCandidate = snapshot?.valid === true ? snapshot.runtimeConfig ?? snapshot.config : null;
	if (!configCandidate || typeof configCandidate !== "object" || Array.isArray(configCandidate)) return {
		kind: "reachable-unverified",
		detail: "Gateway returned an invalid config snapshot"
	};
	try {
		const config = configCandidate;
		return resolveAgentEffectiveModelPrimary(config, resolveDefaultAgentId(config)) ? { kind: "configured" } : {
			kind: "missing-configured-model",
			detail: "Gateway default agent has no configured model"
		};
	} catch {
		return {
			kind: "reachable-unverified",
			detail: "Gateway returned an invalid config snapshot"
		};
	}
}
/** Polls gateway reachability until success or deadline. */
async function waitForGatewayReachable(params) {
	const { deadlineMs = 15e3, pollMs = 400, probeTimeoutMs = 1500, ...probeParams } = params;
	const pollDelayMs = resolveTimerTimeoutMs(pollMs, 400, 0);
	const startedAt = Date.now();
	let lastDetail;
	while (Date.now() - startedAt < deadlineMs) {
		const probe = await probeGatewayReachable({
			...probeParams,
			timeoutMs: probeTimeoutMs
		});
		if (probe.ok) return probe;
		lastDetail = probe.detail;
		const remainingMs = deadlineMs - (Date.now() - startedAt);
		if (remainingMs <= 0) break;
		await sleep(Math.min(pollDelayMs, remainingMs));
	}
	return {
		ok: false,
		detail: lastDetail
	};
}
function summarizeError(err) {
	let raw = "unknown error";
	if (err instanceof Error) raw = err.message || raw;
	else if (typeof err === "string") raw = err || raw;
	else if (err !== void 0) raw = inspect(err, { depth: 2 });
	const line = raw.split("\n").map((s) => s.trim()).find(Boolean) ?? raw;
	return line.length > 120 ? `${truncateUtf16Safe(line, 119)}…` : line;
}
/** Default workspace path shown by onboarding prompts. */
const DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR;
//#endregion
export { guardCancel as a, printWizardHeader as c, summarizeExistingConfig as d, validateGatewayPasswordInput as f, formatControlUiSshHint as i, probeGatewayConfiguredModel as l, applyWizardMetadata as n, handleReset as o, waitForGatewayReachable as p, ensureWorkspaceAndSessions as r, normalizeGatewayTokenInput as s, DEFAULT_WORKSPACE as t, probeGatewayReachable as u };
