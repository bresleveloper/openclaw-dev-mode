import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { i as registerHealthCheck, t as getHealthCheck } from "./health-check-registry-Lw8LGAUO.mjs";
import "./health-Doxm0yrp.mjs";
import "./channel-secret-basic-runtime-B9c3FTNh.mjs";
import { d as disableChannels, f as workspaceRepairsEnabled, g as POLICY_FIX_METADATA_BY_CHECK_ID, h as POLICY_CHECK_METADATA, t as evaluatePolicy, u as channelIdsFromFindings, v as CHECK_IDS } from "./evaluation-B6Fb1Ri_.mjs";
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
	return setFixedConfigFields(cfg, ["tools", "elevated"], { enabled: false });
}
function disableInsecureControlUi(cfg, findings) {
	const fields = ["dangerouslyDisableDeviceAuth", "dangerouslyAllowHostHeaderOriginFallback"];
	const findingPaths = new Set(findings.map((finding) => finding.ocPath));
	return setFixedConfigFields(cfg, ["gateway", "controlUi"], Object.fromEntries(fields.filter((field) => findingPaths.has(`oc://openclaw.config/gateway/controlUi/${field}`)).map((field) => [field, false])));
}
function disableRemoteGatewayMode(cfg, findings) {
	if (!findings.some((finding) => finding.ocPath === "oc://openclaw.config/gateway/mode")) return {
		config: cfg,
		changes: []
	};
	return setFixedConfigFields(cfg, ["gateway"], { mode: "local" }, "remote");
}
function disableTelemetryContentCapture(cfg, findings) {
	if (hasScopedPolicyRequirement(findings)) return skippedUnsafeScopedRepair(cfg, "Skipped scoped data-handling repair. The finding reports shared telemetry config, so changing it would affect more than the scoped policy target.");
	return setFixedConfigFields(cfg, ["diagnostics", "otel"], { captureContent: false });
}
function setFixedConfigFields(cfg, path, values, requiredCurrentValue) {
	const next = cloneConfig(cfg);
	const parent = path.reduce(ensureRecord, next);
	const changes = [];
	for (const [field, value] of Object.entries(values)) {
		if (parent[field] === value || requiredCurrentValue !== void 0 && parent[field] !== requiredCurrentValue) continue;
		parent[field] = value;
		changes.push(`Set ${[...path, field].join(".")}=${String(value)} for policy conformance.`);
	}
	return {
		config: changes.length > 0 ? next : cfg,
		changes
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
	const current = configPathParent(cfg, segments, true);
	if (current === void 0) return false;
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
	const current = configPathParent(cfg, segments, false);
	if (current === void 0) return false;
	const last = segments.at(-1);
	if (last === void 0 || last.startsWith("#") || current[last] === value) return false;
	current[last] = value;
	return true;
}
function configPathParent(cfg, segments, allowArrays) {
	let current = cfg;
	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];
		if (segment === void 0) return;
		if (segment.startsWith("#")) {
			const arrayIndex = Number.parseInt(segment.slice(1), 10);
			if (!allowArrays || !Array.isArray(current) || !Number.isInteger(arrayIndex) || arrayIndex < 0) return;
			current = current[arrayIndex];
			continue;
		}
		if (!isRecord(current)) return;
		const existing = current[segment];
		if (!allowArrays && existing !== void 0 && !isRecord(existing)) return;
		if (existing === void 0) current[segment] = allowArrays && segments[index + 1]?.startsWith("#") ? [] : {};
		current = current[segment];
	}
	return isRecord(current) ? current : void 0;
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
	let change;
	let action;
	let target;
	switch (checkId) {
		case CHECK_IDS.policyGatewayNonLoopbackBind:
			if (finding.ocPath !== "oc://openclaw.config/gateway/bind" && finding.ocPath !== "oc://openclaw.config/gateway/customBindHost") return [];
			change = "Review required: set gateway.bind=loopback for policy conformance.";
			action = "would-set-after-review";
			target = "gateway.bind=loopback";
			break;
		case CHECK_IDS.policyGatewayNodeCommandDenied: {
			const command = finding.message.match(/Gateway node command '([^']+)'/)?.[1]?.trim();
			if (command === void 0 || command === "" || finding.ocPath !== "oc://openclaw.config/gateway/nodes/commands/deny") return [];
			change = `Review required: add ${command} to gateway.nodes.commands.deny for policy conformance.`;
			action = "would-append-after-review";
			target = `gateway.nodes.commands.deny += ${command}`;
			break;
		}
		default: return [];
	}
	return [{
		change,
		effect: {
			kind: "config",
			action,
			target,
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
	return POLICY_CHECK_METADATA.map(({ description, fix }) => {
		const id = fix.checkId;
		const check = {
			id,
			kind: "plugin",
			description,
			source: "policy",
			async detect(ctx) {
				return (await evaluatePolicy(ctx)).findings.filter((finding) => finding.checkId === id);
			}
		};
		const repair = id === CHECK_IDS.policyDeniedChannelProvider ? repairDeniedChannels : fix.fixClass === "automatic" ? repairPolicyAutomaticNarrower : REVIEW_REQUIRED_REPAIR_CHECK_IDS.has(id) ? previewPolicyReviewRequiredRepair : void 0;
		if (repair) check.repair = (ctx, findings) => repair(ctx, findings, id);
		return check;
	});
}
async function repairDeniedChannels(ctx, findings) {
	if (!workspaceRepairsEnabled(ctx)) return {
		status: "skipped",
		reason: "workspace repairs are disabled",
		changes: [],
		warnings: ["Skipped channel config repair. Enable plugins.entries.policy.config.workspaceRepairs to let doctor --fix edit workspace files."]
	};
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
