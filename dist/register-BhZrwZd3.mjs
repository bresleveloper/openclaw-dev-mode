import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { i as registerHealthCheck, t as getHealthCheck } from "./health-check-registry-CBxbsDqv.mjs";
import "./health-iIQJ12mA.mjs";
import "./channel-secret-basic-runtime-D_e1oNCt.mjs";
import { c as workspaceRepairsDisabledResult$1, f as POLICY_FIX_METADATA_BY_CHECK_ID, l as workspaceRepairsEnabled, m as CHECK_IDS, o as channelIdsFromFindings, s as disableChannels, t as evaluatePolicy } from "./evaluation-DMqXddFz.mjs";
//#region extensions/policy/src/doctor/automatic-repairs.ts
const AUTOMATIC_REPAIRS = /* @__PURE__ */ new Map([
	[CHECK_IDS.policyAgentsToolNotDenied, mergeRequiredDenyTools],
	[CHECK_IDS.policyToolsElevatedEnabled, disableElevatedTools],
	[CHECK_IDS.policyToolsRequiredDenyMissing, mergeRequiredDenyTools],
	[CHECK_IDS.policyGatewayControlUiInsecure, disableInsecureControlUi],
	[CHECK_IDS.policyGatewayHttpEndpointEnabled, (cfg, findings) => setFindingConfigValues(cfg, findings, "enabled", false)],
	[CHECK_IDS.policyGatewayRemoteEnabled, disableRemoteGatewayMode],
	[CHECK_IDS.policyIngressOpenGroupsDenied, (cfg, findings) => setFindingConfigValues(cfg, findings, "groupPolicy", "allowlist")],
	[CHECK_IDS.policyIngressGroupMentionRequired, (cfg, findings) => setFindingConfigValues(cfg, findings, "requireMention", true)],
	[CHECK_IDS.policyDataHandlingTelemetryContentCapture, disableTelemetryContentCapture]
]);
function repairPolicyAutomaticNarrower(ctx, findings, checkId) {
	if (!workspaceRepairsEnabled(ctx)) return Promise.resolve(workspaceRepairsDisabledResult());
	const repair = AUTOMATIC_REPAIRS.get(checkId);
	if (repair === void 0) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not an automatic narrowing repair",
		changes: []
	});
	if (findings.length === 0 || findings.some((finding) => finding.checkId !== checkId || POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId)?.fixClass !== "automatic")) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not classified as automatic",
		changes: []
	});
	const patch = repair(ctx.cfg, findings);
	if (patch.changes.length === 0) return Promise.resolve({
		status: "skipped",
		reason: "policy automatic repair had no config changes to apply",
		changes: [],
		...patch.warnings !== void 0 ? { warnings: patch.warnings } : {}
	});
	return Promise.resolve({
		status: "repaired",
		config: patch.config,
		changes: patch.changes,
		...patch.warnings !== void 0 ? { warnings: patch.warnings } : {}
	});
}
function mergeRequiredDenyTools(cfg, findings) {
	const next = cloneConfig(cfg);
	const changes = [];
	const warnings = [];
	for (const finding of findings) {
		const tool = missingRequiredTool(finding);
		if (tool === void 0 || finding.ocPath === void 0) continue;
		if (hasScopedPolicyRequirement([finding]) && finding.ocPath === "oc://openclaw.config/tools/deny") {
			warnings.push(`Skipped scoped deny repair for ${tool}. The finding reports inherited root tools.deny, so changing it would affect more than the scoped policy target.`);
			continue;
		}
		if (mergeStringArrayAtOcPath(next, finding.ocPath, tool)) changes.push(`Added ${tool} to ${configPathLabel(finding.ocPath)} for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes: uniqueStrings(changes),
		warnings
	} : {
		config: cfg,
		changes,
		warnings: uniqueStrings(warnings)
	};
}
function disableElevatedTools(cfg, findings) {
	if (hasScopedPolicyRequirement(findings)) return skippedUnsafeScopedRepair(cfg, "Skipped scoped tools repair. Scoped elevated-tools policy findings are detect-only because automatic repair cannot safely choose between shared and agent-local config targets.");
	if (!findings.some((finding) => finding.ocPath === "oc://openclaw.config/tools/elevated/enabled")) return {
		config: cfg,
		changes: []
	};
	const next = cloneConfig(cfg);
	const elevated = ensureRecord(ensureRecord(next, "tools"), "elevated");
	if (elevated.enabled === false) return {
		config: cfg,
		changes: []
	};
	elevated.enabled = false;
	return {
		config: next,
		changes: ["Set tools.elevated.enabled=false for policy conformance."]
	};
}
function disableInsecureControlUi(cfg, findings) {
	const next = cloneConfig(cfg);
	const controlUi = ensureRecord(ensureRecord(next, "gateway"), "controlUi");
	const changes = [];
	const fields = [["dangerouslyDisableDeviceAuth", "oc://openclaw.config/gateway/controlUi/dangerouslyDisableDeviceAuth"], ["dangerouslyAllowHostHeaderOriginFallback", "oc://openclaw.config/gateway/controlUi/dangerouslyAllowHostHeaderOriginFallback"]];
	const findingPaths = new Set(findings.map((finding) => finding.ocPath));
	for (const [field, ocPath] of fields) if (findingPaths.has(ocPath) && controlUi[field] !== false) {
		controlUi[field] = false;
		changes.push(`Set gateway.controlUi.${field}=false for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes
	} : {
		config: cfg,
		changes
	};
}
function disableRemoteGatewayMode(cfg, findings) {
	if (!findings.some((finding) => finding.ocPath === "oc://openclaw.config/gateway/mode")) return {
		config: cfg,
		changes: []
	};
	const next = cloneConfig(cfg);
	const gateway = ensureRecord(next, "gateway");
	const changes = [];
	if (gateway.mode === "remote") {
		gateway.mode = "local";
		changes.push("Set gateway.mode=local for policy conformance.");
	}
	return changes.length > 0 ? {
		config: next,
		changes
	} : {
		config: cfg,
		changes
	};
}
function disableTelemetryContentCapture(cfg, findings) {
	if (hasScopedPolicyRequirement(findings)) return skippedUnsafeScopedRepair(cfg, "Skipped scoped data-handling repair. The finding reports shared telemetry config, so changing it would affect more than the scoped policy target.");
	const next = cloneConfig(cfg);
	const otel = ensureRecord(ensureRecord(next, "diagnostics"), "otel");
	if (otel.captureContent === false) return {
		config: cfg,
		changes: []
	};
	otel.captureContent = false;
	return {
		config: next,
		changes: ["Set diagnostics.otel.captureContent=false for policy conformance."]
	};
}
function setFindingConfigValues(cfg, findings, fieldName, value) {
	const next = cloneConfig(cfg);
	const changes = [];
	const warnings = [];
	for (const finding of findings) {
		if (isScopedInheritedChannelDefaultFinding(finding)) {
			warnings.push(`Skipped scoped channel ingress repair for ${configPathLabel(finding.ocPath ?? "")}. The finding reports inherited channels.defaults config, so changing it would affect more than the scoped channel target.`);
			continue;
		}
		if (finding.ocPath === void 0 || configPathSegments(finding.ocPath).at(-1) !== fieldName || !setValueAtOcPath(next, finding.ocPath, value)) continue;
		changes.push(`Set ${configPathLabel(finding.ocPath)}=${String(value)} for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes: uniqueStrings(changes),
		warnings
	} : {
		config: cfg,
		changes,
		warnings: uniqueStrings(warnings)
	};
}
function cloneConfig(cfg) {
	return structuredClone(cfg);
}
function mergeStringArrayAtOcPath(cfg, ocPath, entry) {
	const segments = configPathSegments(ocPath);
	if (segments.length === 0 || segments.at(-1) !== "deny") return false;
	let current = cfg;
	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];
		if (segment === void 0) return false;
		if (segment.startsWith("#")) {
			const arrayIndex = Number.parseInt(segment.slice(1), 10);
			if (!Array.isArray(current) || !Number.isInteger(arrayIndex) || arrayIndex < 0) return false;
			current = current[arrayIndex];
			continue;
		}
		if (!isRecord(current)) return false;
		const nextSegment = segments[index + 1];
		if (current[segment] === void 0) current[segment] = nextSegment?.startsWith("#") ? [] : {};
		current = current[segment];
	}
	if (!isRecord(current)) return false;
	const existing = current.deny;
	if (existing !== void 0 && !Array.isArray(existing)) return false;
	const deny = existing ?? [];
	if (deny.some((value) => typeof value === "string" && value === entry)) return false;
	current.deny = [...deny, entry];
	return true;
}
function configPathSegments(ocPath) {
	if (!ocPath.startsWith("oc://openclaw.config/")) return [];
	return splitConfigPath(ocPath.slice(21));
}
function splitConfigPath(path) {
	const segments = [];
	let current = "";
	let quoted = false;
	let escaped = false;
	for (const char of path) {
		if (escaped) {
			current += char;
			escaped = false;
			continue;
		}
		if (quoted && char === "\\") {
			escaped = true;
			continue;
		}
		if (char === "\"") {
			quoted = !quoted;
			continue;
		}
		if (!quoted && char === "/") {
			if (current !== "") segments.push(current);
			current = "";
			continue;
		}
		current += char;
	}
	if (current !== "") segments.push(current);
	return quoted ? [] : segments;
}
function configPathLabel(ocPath) {
	let label = "";
	for (const segment of configPathSegments(ocPath)) if (segment.startsWith("#")) label += `[${segment.slice(1)}]`;
	else label += label === "" ? segment : `.${segment}`;
	return label;
}
function missingRequiredTool(finding) {
	return finding.message.match(/required tool '([^']+)'/)?.[1]?.trim();
}
function setValueAtOcPath(cfg, ocPath, value) {
	const segments = configPathSegments(ocPath);
	if (segments.length === 0) return false;
	let current = cfg;
	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];
		if (segment === void 0 || segment.startsWith("#")) return false;
		if (!isRecord(current)) return false;
		const existing = current[segment];
		if (existing !== void 0 && !isRecord(existing)) return false;
		if (existing === void 0) current[segment] = {};
		current = current[segment];
	}
	if (!isRecord(current)) return false;
	const last = segments.at(-1);
	if (last === void 0 || last.startsWith("#") || current[last] === value) return false;
	current[last] = value;
	return true;
}
function workspaceRepairsDisabledResult() {
	return {
		status: "skipped",
		reason: "workspace repairs are disabled",
		changes: [],
		warnings: ["Skipped policy config repair. Enable plugins.entries.policy.config.workspaceRepairs to let doctor --fix edit workspace policy config."]
	};
}
function hasScopedPolicyRequirement(findings) {
	return findings.some((finding) => finding.requirement?.includes("/scopes/") === true);
}
function skippedUnsafeScopedRepair(cfg, warning) {
	return {
		config: cfg,
		changes: [],
		warnings: [warning]
	};
}
function isScopedInheritedChannelDefaultFinding(finding) {
	return hasScopedPolicyRequirement([finding]) && finding.ocPath?.startsWith("oc://openclaw.config/channels/defaults/") === true;
}
function ensureRecord(parent, key) {
	const current = parent[key];
	if (isRecord(current)) {
		const copy = { ...current };
		parent[key] = copy;
		return copy;
	}
	const next = {};
	parent[key] = next;
	return next;
}
//#endregion
//#region extensions/policy/src/doctor/review-required-repairs.ts
const REVIEW_REQUIRED_REPAIR_CHECK_IDS = /* @__PURE__ */ new Set([CHECK_IDS.policyGatewayNonLoopbackBind, CHECK_IDS.policyGatewayNodeCommandDenied]);
function previewPolicyReviewRequiredRepair(_ctx, findings, checkId) {
	const metadata = POLICY_FIX_METADATA_BY_CHECK_ID.get(checkId);
	if (!REVIEW_REQUIRED_REPAIR_CHECK_IDS.has(checkId) || metadata?.fixClass !== "reviewRequired") return Promise.resolve({
		status: "skipped",
		reason: "policy finding does not have a review-required repair preview",
		changes: []
	});
	if (findings.length === 0 || findings.some((finding) => finding.checkId !== checkId || POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId)?.fixClass !== "reviewRequired")) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not classified as review-required",
		changes: []
	});
	const previews = findings.flatMap((finding) => previewForFinding(finding, checkId));
	if (previews.length === 0) return Promise.resolve({
		status: "skipped",
		reason: "policy review-required repair had no previewable config changes",
		changes: []
	});
	return Promise.resolve({
		status: "skipped",
		reason: "policy repair requires review before changing config",
		changes: uniqueStrings(previews.map((preview) => preview.change)),
		warnings: uniqueStrings(previews.map((preview) => preview.change)),
		effects: uniqueEffects(previews.map((preview) => preview.effect))
	});
}
function previewForFinding(finding, checkId) {
	switch (checkId) {
		case CHECK_IDS.policyGatewayNonLoopbackBind: return previewGatewayLoopbackBind(finding);
		case CHECK_IDS.policyGatewayNodeCommandDenied: return previewGatewayNodeDenyCommand(finding);
		default: return [];
	}
}
function previewGatewayLoopbackBind(finding) {
	if (finding.ocPath !== "oc://openclaw.config/gateway/bind" && finding.ocPath !== "oc://openclaw.config/gateway/customBindHost") return [];
	return [{
		change: "Review required: set gateway.bind=loopback for policy conformance.",
		effect: {
			kind: "config",
			action: "would-set-after-review",
			target: "gateway.bind=loopback",
			dryRunSafe: true
		}
	}];
}
function previewGatewayNodeDenyCommand(finding) {
	const command = finding.message.match(/Gateway node command '([^']+)'/)?.[1]?.trim();
	if (command === void 0 || command === "" || finding.ocPath !== "oc://openclaw.config/gateway/nodes/commands/deny") return [];
	return [{
		change: `Review required: add ${command} to gateway.nodes.commands.deny for policy conformance.`,
		effect: {
			kind: "config",
			action: "would-append-after-review",
			target: `gateway.nodes.commands.deny += ${command}`,
			dryRunSafe: true
		}
	}];
}
function uniqueEffects(values) {
	const seen = /* @__PURE__ */ new Set();
	return values.filter((value) => {
		const key = JSON.stringify(value);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
//#endregion
//#region extensions/policy/src/doctor/checks.ts
function createPolicyDoctorChecks() {
	return [
		[CHECK_IDS.policyMissingFile, "The enabled Policy plugin has a policy file to verify."],
		[CHECK_IDS.policyInvalidFile, "The enabled policy file parses before policy checks run."],
		[CHECK_IDS.policyHashMismatch, "The policy file matches the configured expected hash."],
		[CHECK_IDS.policyAttestationMismatch, "The current policy check matches the accepted attestation."],
		[
			CHECK_IDS.policyDeniedChannelProvider,
			"Configured channels satisfy policy deny rules.",
			async (ctx, findings) => {
				if (!workspaceRepairsEnabled(ctx)) return workspaceRepairsDisabledResult$1("channel config");
				const channelIds = channelIdsFromFindings(findings);
				if (channelIds.length === 0) return {
					status: "skipped",
					reason: "no channel findings matched a configurable channel",
					changes: []
				};
				const next = disableChannels(ctx.cfg, channelIds);
				if (next.changed.length === 0) return {
					status: "skipped",
					reason: "matching channels were already disabled or missing",
					changes: []
				};
				return {
					config: next.config,
					changes: next.changed.map((id) => `Disabled channels.${id}.enabled for policy conformance.`)
				};
			}
		],
		[CHECK_IDS.policyDeniedMcpServer, "Configured MCP servers do not match policy deny rules."],
		[CHECK_IDS.policyUnapprovedMcpServer, "Configured MCP servers do not match policy allow rules."],
		[CHECK_IDS.policyDeniedModelProvider, "Configured model providers do not match policy deny rules."],
		[CHECK_IDS.policyUnapprovedModelProvider, "Configured model providers do not match policy allow rules."],
		[CHECK_IDS.policyPrivateNetworkAccess, "Network SSRF policy settings match private-network requirements."],
		[CHECK_IDS.policyIngressDmPolicyUnapproved, "Channel direct-message access policy matches ingress requirements."],
		[CHECK_IDS.policyIngressDmScopeUnapproved, "Direct-message sessions use the policy-required isolation scope."],
		[
			CHECK_IDS.policyIngressOpenGroupsDenied,
			"Channel group access does not use open group policy when denied.",
			repairPolicyAutomaticNarrower
		],
		[
			CHECK_IDS.policyIngressGroupMentionRequired,
			"Channel group access keeps mention gates enabled when required.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyRoutingBindingsRequired, "Routing policy has at least one channel route binding when required."],
		[CHECK_IDS.policyRoutingBindingChannelUnconfigured, "Route bindings name channels present in configuration."],
		[CHECK_IDS.policyRoutingAgentMismatch, "Authored routing probes resolve to their expected agents."],
		[CHECK_IDS.policyRoutingMatchKindMismatch, "Authored routing probes match at their expected specificity."],
		[
			CHECK_IDS.policyGatewayNonLoopbackBind,
			"Gateway bind posture matches policy exposure requirements.",
			previewPolicyReviewRequiredRepair
		],
		[CHECK_IDS.policyGatewayAuthDisabled, "Gateway authentication remains enabled when required by policy."],
		[CHECK_IDS.policyGatewayRateLimitMissing, "Gateway authentication rate-limit posture is explicit when required by policy."],
		[
			CHECK_IDS.policyGatewayControlUiInsecure,
			"Gateway Control UI insecure exposure toggles remain disabled by policy.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyGatewayTailscaleFunnel, "Gateway Tailscale Funnel exposure matches policy."],
		[
			CHECK_IDS.policyGatewayRemoteEnabled,
			"Remote gateway mode matches policy.",
			repairPolicyAutomaticNarrower
		],
		[
			CHECK_IDS.policyGatewayHttpEndpointEnabled,
			"Gateway HTTP API endpoints match policy.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted, "Gateway HTTP URL-fetch inputs have allowlists when required by policy."],
		[
			CHECK_IDS.policyGatewayNodeCommandDenied,
			"Gateway node command allowlists match policy.",
			previewPolicyReviewRequiredRepair
		],
		[CHECK_IDS.policyAgentsWorkspaceAccessDenied, "Agent sandbox workspace access matches policy."],
		[
			CHECK_IDS.policyAgentsToolNotDenied,
			"Agent workspace mutation/runtime tools are denied when policy requires it.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyToolsProfileUnapproved, "Configured tool profiles match policy allow rules."],
		[CHECK_IDS.policyToolsFsWorkspaceOnlyRequired, "Filesystem tools use workspace-only posture when policy requires it."],
		[CHECK_IDS.policyToolsExecSecurityUnapproved, "Exec tool security mode matches policy allow rules."],
		[CHECK_IDS.policyToolsExecAskUnapproved, "Exec tool ask mode matches policy allow rules."],
		[CHECK_IDS.policyToolsExecHostUnapproved, "Exec tool host routing matches policy allow rules."],
		[
			CHECK_IDS.policyToolsElevatedEnabled,
			"Elevated tool mode remains disabled when policy requires it.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyToolsAlsoAllowMissing, "Configured tools.alsoAllow entries include policy expected lists."],
		[CHECK_IDS.policyToolsAlsoAllowUnexpected, "Configured tools.alsoAllow entries match policy expected lists."],
		[
			CHECK_IDS.policyToolsRequiredDenyMissing,
			"Configured tool deny lists include tools required by policy.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policySandboxModeUnapproved, "Sandbox mode config satisfies policy requirements."],
		[CHECK_IDS.policySandboxBackendUnapproved, "Sandbox backend config satisfies policy requirements."],
		[CHECK_IDS.policySandboxContainerPostureUnobservable, "Sandbox container posture policy only targets observable container backends."],
		[CHECK_IDS.policySandboxContainerHostNetworkDenied, "Sandbox container config avoids host network mode."],
		[CHECK_IDS.policySandboxContainerNamespaceJoinDenied, "Sandbox container config avoids joining another container network namespace."],
		[CHECK_IDS.policySandboxContainerMountModeRequired, "Sandbox container mounts are read-only when policy requires it."],
		[CHECK_IDS.policySandboxContainerRuntimeSocketMount, "Sandbox container mounts avoid host container runtime sockets."],
		[CHECK_IDS.policySandboxContainerUnconfinedProfile, "Sandbox container profile config avoids unconfined profiles."],
		[CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing, "Sandbox browser CDP config includes a source range when policy requires it."],
		[
			CHECK_IDS.policyDataHandlingTelemetryContentCapture,
			"Telemetry content capture remains disabled when policy denies it.",
			repairPolicyAutomaticNarrower
		],
		[CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced, "Session retention maintenance is enforced when policy requires it."],
		[CHECK_IDS.policyDataHandlingSessionTranscriptMemory, "Session transcript memory indexing remains disabled when policy denies it."],
		[CHECK_IDS.policySecretsUnmanagedProvider, "OpenClaw config SecretRefs use configured secret providers when policy requires managed providers."],
		[CHECK_IDS.policySecretsDeniedProviderSource, "OpenClaw config secret providers and SecretRefs do not use sources denied by policy."],
		[CHECK_IDS.policySecretsInsecureProvider, "Configured secret providers do not opt into insecure posture unless policy allows it."],
		[CHECK_IDS.policyAuthProfileInvalidMetadata, "OpenClaw config auth profiles declare required provider and mode metadata."],
		[CHECK_IDS.policyAuthProfileUnapprovedMode, "OpenClaw config auth profile modes stay within the policy allowlist."],
		[CHECK_IDS.policyExecApprovalsMissing, "Required exec approvals artifact is present for policy conformance."],
		[CHECK_IDS.policyExecApprovalsInvalid, "Exec approvals artifact parses before policy checks run."],
		[CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved, "Exec approval defaults use a policy-approved security mode."],
		[CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved, "Per-agent exec approval settings use policy-approved security modes."],
		[CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled, "Exec approval agents do not implicitly auto-allow skill CLIs unless policy allows it."],
		[CHECK_IDS.policyExecApprovalsAllowlistMissing, "Exec approval allowlists include every pattern required by policy."],
		[CHECK_IDS.policyExecApprovalsAllowlistUnexpected, "Exec approval allowlists do not contain patterns outside policy."],
		[CHECK_IDS.policyUnmigratedToolsFile, "Governed tool declarations have been migrated from TOOLS.md into AGENTS.md."],
		[CHECK_IDS.policyMissingToolRisk, "AGENTS.md tool policy entries declare explicit risk levels."],
		[CHECK_IDS.policyUnknownToolRisk, "AGENTS.md tool policy entries use known risk levels."],
		[CHECK_IDS.policyMissingToolSensitivity, "AGENTS.md tool policy entries declare default artifact sensitivity."],
		[CHECK_IDS.policyMissingToolOwner, "AGENTS.md tool policy entries declare an accountable owner."],
		[CHECK_IDS.policyUnknownToolSensitivity, "AGENTS.md tool policy entries use known sensitivity levels."]
	].map(([id, description, repair]) => {
		const check = {
			id,
			kind: "plugin",
			description,
			source: "policy",
			async detect(ctx) {
				return (await evaluatePolicy(ctx)).findings.filter((finding) => finding.checkId === id);
			}
		};
		if (repair) check.repair = (ctx, findings) => repair(ctx, findings, id);
		return check;
	});
}
//#endregion
//#region extensions/policy/src/doctor/register.ts
let policyDoctorChecks;
const registeredPolicyDoctorRegistrars = /* @__PURE__ */ new WeakSet();
function registerPolicyDoctorChecks(host) {
	if (host !== void 0 && registeredPolicyDoctorRegistrars.has(host.registerHealthCheck)) return;
	const registerHealthCheck$1 = host?.registerHealthCheck ?? registerHealthCheck;
	policyDoctorChecks ??= createPolicyDoctorChecks();
	for (const check of policyDoctorChecks) {
		if (host === void 0 && getHealthCheck(check.id) === check) continue;
		registerHealthCheck$1(check);
	}
	registeredPolicyDoctorRegistrars.add(registerHealthCheck$1);
}
//#endregion
export { registerPolicyDoctorChecks as t };
