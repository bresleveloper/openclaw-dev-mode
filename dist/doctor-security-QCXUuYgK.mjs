import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { D as listAgentEntriesWithSource } from "./agent-scope-config-IQKOEtZ4.mjs";
import { o as hasConfiguredSecretInput, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { p as hasConfiguredPlaintextSecretValue } from "./runtime-shared-Bpp2PLaL.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { g as resolveGatewayBindHost, s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import "./auth-CRxiLJL8.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-CUWP5mEd.mjs";
import { c as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import { t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-GOr5zrOa.mjs";
import { o as loadExecApprovalsReadOnly } from "./exec-approvals-store-CTT-ox-I.mjs";
import { t as countObsoleteGeneratedExecApprovals } from "./exec-approvals-generated-migration-CRYknfT-.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CvMQqs0s.mjs";
import { r as resolveExecPolicyScopeSnapshot } from "./exec-approvals-effective-8wIgsVTY.mjs";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-l9swrDqQ.mjs";
import { t as collectExecFilesystemPolicyDriftHits } from "./exec-filesystem-policy-BiVsaVDt.mjs";
import { n as findSecretStoreRedactedValueFindings } from "./audit-store-CRQSx85l.mjs";
import { t as collectChannelSecurityFindingsCore } from "./audit-channel-DQkHdbJ8.mjs";
//#region src/commands/doctor-security.ts
/** Security warnings for gateway exposure, exec policy drift, channel DMs, and plaintext secrets. */
function collectImplicitHeartbeatDirectPolicyWarnings(cfg) {
	const findings = [];
	const maybeWarn = (params) => {
		const heartbeat = params.heartbeat;
		if (!heartbeat || heartbeat.target === void 0 || heartbeat.target === "none") return;
		if (heartbeat.directPolicy !== void 0) return;
		findings.push({
			checkId: "doctor.heartbeat_direct_policy_unset",
			severity: "warn",
			title: params.label,
			detail: `heartbeat delivery is configured while ${params.pathHint} is unset.`,
			remediation: "Heartbeat now allows direct/DM targets by default. Set it explicitly to \"allow\" or \"block\" to pin upgrade behavior."
		});
	};
	maybeWarn({
		label: "Heartbeat defaults",
		heartbeat: cfg.agents?.defaults?.heartbeat,
		pathHint: "agents.defaults.heartbeat.directPolicy"
	});
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) maybeWarn({
		label: `Heartbeat agent "${agent.id}"`,
		heartbeat: agent.heartbeat,
		pathHint: source.kind === "entries" ? `agents.entries.${source.key}.heartbeat.directPolicy` : `heartbeat.directPolicy for agent "${agent.id}"`
	});
	return findings;
}
function execSecurityRank(value) {
	switch (value) {
		case "deny": return 0;
		case "allowlist": return 1;
		case "full": return 2;
	}
	throw new Error("Unsupported exec security value");
}
function execAskRank(value) {
	switch (value) {
		case "off": return 0;
		case "on-miss": return 1;
		case "always": return 2;
	}
	throw new Error("Unsupported exec ask value");
}
function collectExecPolicyConflictWarnings(cfg, approvals) {
	const findings = [];
	const defaultRequestedSecuritySource = "OpenClaw default (full)";
	const defaultRequestedAskSource = "OpenClaw default (off)";
	const maybeWarn = (params) => {
		const scopeExecConfig = params.scopeExecConfig;
		const globalExecConfig = params.globalExecConfig;
		if (!scopeExecConfig?.mode && !scopeExecConfig?.security && !scopeExecConfig?.ask && !globalExecConfig?.mode && !globalExecConfig?.security && !globalExecConfig?.ask) return;
		const snapshot = resolveExecPolicyScopeSnapshot({
			approvals,
			scopeExecConfig,
			globalExecConfig,
			configPath: params.scopeLabel === "tools.exec" ? "tools.exec" : `agents.entries.${params.agentId}.tools.exec`,
			scopeLabel: params.scopeLabel,
			agentId: params.agentId
		});
		const securityConfigured = snapshot.security.requestedSource !== defaultRequestedSecuritySource;
		const askConfigured = snapshot.ask.requestedSource !== defaultRequestedAskSource;
		const securityConflict = securityConfigured && execSecurityRank(snapshot.security.requested) > execSecurityRank(snapshot.security.effective);
		const askConflict = askConfigured && execAskRank(snapshot.ask.requested) < execAskRank(snapshot.ask.effective);
		if (!securityConflict && !askConflict) return;
		const configParts = [];
		const hostParts = [];
		const canonicalModeSource = snapshot.security.requestedSource === snapshot.ask.requestedSource && snapshot.security.requestedSource.endsWith(".mode") ? snapshot.security.requestedSource : void 0;
		if (canonicalModeSource) configParts.push(`${canonicalModeSource}="${snapshot.mode.requested}"`);
		if (securityConflict) {
			if (!canonicalModeSource) configParts.push(`${snapshot.security.requestedSource}="${snapshot.security.requested}"`);
			hostParts.push(`${snapshot.security.hostSource}="${snapshot.security.host}"`);
		}
		if (askConflict) {
			if (!canonicalModeSource) configParts.push(`${snapshot.ask.requestedSource}="${snapshot.ask.requested}"`);
			hostParts.push(`${snapshot.ask.hostSource}="${snapshot.ask.host}"`);
		}
		findings.push({
			checkId: "doctor.exec_policy_conflict",
			severity: "warn",
			title: `${params.scopeLabel} is broader than the host exec policy.`,
			detail: "",
			remediation: [
				`Config: ${configParts.join(", ")}`,
				`Host: ${hostParts.join(", ")}`,
				`Effective host exec stays security="${snapshot.security.effective}" ask="${snapshot.ask.effective}" because the stricter side wins.`,
				"Headless runs like isolated cron cannot answer approval prompts; align both files, or keep the Control UI or a macOS/iOS/Android app connected so gateway automation runs can raise approval cards.",
				`Inspect with: ${formatCliCommand("openclaw approvals get --gateway")}`
			].join("\n")
		});
	};
	maybeWarn({
		scopeLabel: "tools.exec",
		scopeExecConfig: cfg.tools?.exec
	});
	const agents = cfg.agents?.entries ?? {};
	for (const [agentId, agent] of Object.entries(agents)) maybeWarn({
		scopeLabel: `agents.entries.${agentId}.tools.exec`,
		scopeExecConfig: agent.tools?.exec,
		globalExecConfig: cfg.tools?.exec,
		agentId
	});
	return findings;
}
function collectDurableExecApprovalWarnings(approvals) {
	const count = countObsoleteGeneratedExecApprovals(approvals);
	if (count === 0) return [];
	return [{
		checkId: "doctor.exec_approvals_require_cwd_renewal",
		severity: "warn",
		title: "Exec approvals need renewal",
		detail: `${count} older generated ${count === 1 ? "approval is" : "approvals are"} inactive because they are not tied to a working directory.`,
		remediation: [
			`Run ${formatCliCommand("openclaw doctor --fix")} to remove the inactive entries.`,
			"Then rerun affected workflows and choose \"Always allow here\" when prompted.",
			"Manual allowlist rules are unchanged."
		].join("\n")
	}];
}
function collectExecFilesystemPolicyWarnings(cfg) {
	return collectExecFilesystemPolicyDriftHits(cfg).map((hit) => ({
		checkId: "doctor.exec_filesystem_policy",
		severity: "warn",
		title: hit.scopeLabel,
		detail: "filesystem write tools are disabled, but exec is still available.",
		remediation: [
			`Runtime tools: ${hit.runtimeTools.join(", ")}; disabled filesystem tools: ${hit.disabledFilesystemTools.join(", ")}.`,
			`Effective exec host is "${hit.execHost}" with sandbox.mode="${hit.sandboxMode}" and workspaceAccess="${hit.sandboxWorkspaceAccess}".`,
			"The exec shell can still write wherever that host or sandbox filesystem permits.",
			"For read-only agents, also deny exec/process; otherwise use sandbox mode \"all\" with workspaceAccess \"ro\" or \"none\"."
		].join("\n")
	}));
}
function collectPlaintextConfigSecretWarnings(cfg) {
	const plaintextPaths = [];
	const defaults = cfg.secrets?.defaults;
	for (const target of discoverConfigSecretTargets(cfg)) {
		if (!target.entry.includeInAudit) continue;
		if (target.entry.id === "models.providers.*.headers.*" && !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "")) continue;
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (ref) continue;
		if (!hasConfiguredPlaintextSecretValue(target.value, target.entry.expectedResolvedValue)) continue;
		plaintextPaths.push(target.path);
	}
	if (plaintextPaths.length === 0) return [];
	const samplePaths = plaintextPaths.slice(0, 5);
	const extraCount = plaintextPaths.length - samplePaths.length;
	const pathLine = extraCount > 0 ? `${samplePaths.join(", ")} (+${extraCount} more)` : samplePaths.join(", ");
	return [{
		checkId: "config.plaintext_secrets",
		severity: "warn",
		title: "WARNING",
		detail: "openclaw.json contains plaintext secret-bearing config fields.",
		remediation: [
			`Migrate them to SecretRefs with ${formatCliCommand("openclaw secrets configure")} or ${formatCliCommand("openclaw secrets apply")}, then verify with ${formatCliCommand("openclaw secrets audit --check")}.`,
			`Paths: ${pathLine}`,
			"Agents or workspace tools that can read config files may see these API keys/tokens."
		].join("\n")
	}];
}
/** Collects doctor security findings without emitting terminal notes. */
async function collectSecurityWarnings(cfg, env = process.env) {
	const findings = [];
	if (cfg.approvals?.exec?.enabled === false) findings.push({
		checkId: "doctor.approval_forwarding_disabled",
		severity: "warn",
		title: "Note",
		detail: "approvals.exec.enabled=false disables approval forwarding only.",
		remediation: [`Host exec gating still comes from ${resolveExecApprovalsDisplayPath()}.`, `Check local policy with: ${formatCliCommand("openclaw approvals get --gateway")}`].join("\n")
	});
	findings.push(...collectImplicitHeartbeatDirectPolicyWarnings(cfg));
	let approvals;
	try {
		approvals = loadExecApprovalsReadOnly();
	} catch (error) {
		if (!(error instanceof ExecApprovalsMigrationRequiredError)) throw error;
	}
	if (approvals) findings.push(...collectExecPolicyConflictWarnings(cfg, approvals));
	findings.push(...collectExecFilesystemPolicyWarnings(cfg));
	findings.push(...collectPlaintextConfigSecretWarnings(cfg));
	const gatewayTokenRef = resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults: cfg.secrets?.defaults
	}).ref;
	findings.push(...findSecretStoreRedactedValueFindings({ database: { env } }).map((finding) => ({
		checkId: "doctor.secret_store_redacted_value",
		severity: "warn",
		title: "Unavailable credential",
		detail: finding.message,
		remediation: gatewayTokenRef?.source === "store" && gatewayTokenRef.id === finding.name ? "Run `openclaw doctor --fix` to regenerate the Gateway token, then restart and reconnect or re-pair devices." : `This credential remains unavailable until replaced. Run \`openclaw secrets store set ${finding.name}\` with the real credential, then \`openclaw secrets reload\`.`
	})));
	if (approvals) findings.push(...collectDurableExecApprovalWarnings(approvals));
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	const gatewayBind = cfg.gateway?.bind ?? "loopback";
	const customBindHost = cfg.gateway?.customBindHost?.trim();
	const bindMode = [
		"auto",
		"lan",
		"loopback",
		"custom",
		"tailnet"
	].includes(gatewayBind) ? gatewayBind : void 0;
	const resolvedBindHost = bindMode ? await resolveGatewayBindHost(bindMode, customBindHost) : "0.0.0.0";
	const isExposed = !isLoopbackHost(resolvedBindHost);
	const resolvedAuth = resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		env,
		tailscaleMode
	});
	const authToken = normalizeOptionalString(resolvedAuth.token) ?? "";
	const authPassword = normalizeOptionalString(resolvedAuth.password) ?? "";
	const hasToken = authToken.length > 0 || hasConfiguredSecretInput(cfg.gateway?.auth?.token, cfg.secrets?.defaults);
	const hasPassword = authPassword.length > 0 || hasConfiguredSecretInput(cfg.gateway?.auth?.password, cfg.secrets?.defaults);
	const hasSharedSecret = resolvedAuth.mode === "token" && hasToken || resolvedAuth.mode === "password" && hasPassword;
	const bindDescriptor = `"${gatewayBind}" (${resolvedBindHost})`;
	const saferRemoteAccessLines = [
		"Safer remote access: keep bind loopback and use Tailscale Serve/Funnel or an SSH tunnel.",
		"Example tunnel: ssh -N -L 18789:127.0.0.1:18789 user@gateway-host",
		"Docs: https://docs.openclaw.ai/gateway/remote"
	];
	if (isExposed) {
		if (!hasSharedSecret && resolvedAuth.mode !== "trusted-proxy") {
			const authFixLines = resolvedAuth.mode === "password" ? [`Fix: ${formatCliCommand("openclaw configure")} to set a password`, `Or switch to token: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`] : [`Fix: ${formatCliCommand("openclaw doctor --fix")} to generate a token`, `Or set token directly: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`];
			findings.push({
				checkId: "gateway.bind_no_auth",
				severity: "critical",
				title: "CRITICAL",
				detail: [`Gateway bound to ${bindDescriptor} without authentication.`, "Anyone on your network (or internet if port-forwarded) can fully control your agent."].join("\n"),
				remediation: [
					`Fix: ${formatCliCommand("openclaw config set gateway.bind loopback")}`,
					...saferRemoteAccessLines,
					...authFixLines
				].join("\n")
			});
		} else findings.push({
			checkId: "gateway.bind_network_accessible",
			severity: "warn",
			title: "WARNING",
			detail: [`Gateway bound to ${bindDescriptor} (network-accessible).`, "Ensure your auth credentials are strong and not exposed."].join("\n"),
			remediation: saferRemoteAccessLines.join("\n")
		});
	}
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg,
		env
	});
	if (tokenConflict) findings.push({
		checkId: tokenConflict.checkId,
		severity: tokenConflict.severity,
		title: "WARNING",
		detail: `${tokenConflict.title}.\n${tokenConflict.detail}`,
		remediation: `Fix: ${tokenConflict.remediation}`
	});
	const channelFindings = await collectChannelSecurityFindingsCore({
		cfg,
		mode: "doctor",
		plugins: listReadOnlyChannelPluginsForConfig(cfg, {
			includePersistedAuthState: true,
			includeSetupFallbackPlugins: true
		})
	});
	findings.push(...channelFindings);
	return findings;
}
function renderSecurityFindingLines(finding) {
	const detailLines = finding.detail.split("\n");
	const firstDetail = detailLines.shift() ?? "";
	const lines = [`- ${finding.title}${firstDetail ? `: ${firstDetail}` : ""}`];
	lines.push(...detailLines.map((line) => `  ${line}`));
	if (finding.remediation) lines.push(...finding.remediation.split("\n").map((line) => `  ${line}`));
	return lines;
}
/** Emits security warnings plus the deep audit follow-up command. */
async function noteSecurityWarnings(cfg) {
	const findings = await collectSecurityWarnings(cfg);
	if (findings.length > 0) {
		const lines = findings.flatMap(renderSecurityFindingLines);
		lines.push(`- Run: ${formatCliCommand("openclaw security audit --deep")}`);
		note(lines.join("\n"), "Security");
	}
	return findings;
}
//#endregion
export { collectSecurityWarnings, noteSecurityWarnings };
