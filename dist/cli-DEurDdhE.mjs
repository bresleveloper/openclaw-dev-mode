import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./routing-Dl7FngGa.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import "./runtime-DcwtZKkR.mjs";
import { i as parseHealthFindingSeverity, n as healthFindingMeetsSeverity } from "./health-checks-_h8bcnIK.mjs";
import { t as exitCodeFromFindings } from "./doctor-lint-flow-CUUVnNVU.mjs";
import "./health-Doxm0yrp.mjs";
import "./setup-tools-CXw-D_tA.mjs";
import { _ as POLICY_RULE_METADATA, a as scopedPolicyFields, c as policyRuleValueIsValid, g as POLICY_FIX_METADATA_BY_CHECK_ID, i as normalizePolicySelectorValues, l as createPolicyAttestation, m as getPolicyPath, n as toAttestedFinding, o as scopedPolicyOverlays, p as ocPathSegment, r as policyContainerShapeFindings, s as isPolicyValueAtLeastAsStrict, t as evaluatePolicy, y as POLICY_CHECK_IDS } from "./evaluation-B6Fb1Ri_.mjs";
import { promises } from "node:fs";
import { basename, isAbsolute, resolve } from "node:path";
import { setTimeout } from "node:timers/promises";
import JSON5 from "json5";
//#region extensions/policy/src/policy-conformance.ts
const POLICY_CONFORMANCE_CHECK_IDS = {
	missing: "policy/policy-conformance-missing",
	weaker: "policy/policy-conformance-weaker",
	invalid: "policy/policy-conformance-invalid"
};
async function buildPolicyConformanceReport(params) {
	const baselinePath = resolvePolicyPath(params.baselinePath);
	const policyPath = resolvePolicyPath(params.policyPath);
	const baselineResult = await readPolicyDocument(baselinePath);
	const policyResult = await readPolicyDocument(policyPath);
	const report = (findings, rulesChecked = 0) => ({
		ok: findings.length === 0,
		baselinePath: baselineResult.displayName,
		policyPath: policyResult.displayName,
		rulesChecked,
		findings
	});
	if (!baselineResult.ok || !policyResult.ok) return report([baselineResult, policyResult].filter((result) => {
		return !result.ok;
	}).map((result) => invalidConformanceFinding(result.displayName, result.message, result.target, `Fix ${result.displayName} so it contains valid policy JSONC.`)));
	const baseline = baselineResult;
	const policy = policyResult;
	const baselineClaims = collectPolicyRuleClaims(baseline);
	const candidateClaims = collectPolicyRuleClaims(policy);
	const documents = [baseline, policy];
	const invalidFindings = uniqueConformanceFindings([
		...documents.flatMap((document) => policyContainerShapeFindings(document.value, document.displayName, document.displayName).map((finding) => invalidConformanceFinding(document.displayName, finding.message, finding.target ?? `oc://${document.displayName}`, finding.fixHint ?? `Fix ${document.displayName} so it uses the documented policy syntax.`))),
		...documents.flatMap(collectInvalidScopedPolicyFindings),
		...[[baseline, baselineClaims], [policy, candidateClaims]].flatMap(([document, claims]) => claims.filter((claim) => !policyRuleValueIsValid(claim.metadata, claim.value)).map((claim) => invalidConformanceFinding(document.displayName, `${document.displayName} ${claim.propertyPath} is not valid policy conformance syntax.`, claim.target, `Fix ${claim.propertyPath} so it uses the documented policy syntax.`)))
	]);
	if (invalidFindings.length > 0) return report(invalidFindings);
	return report(baselineClaims.map((claim) => conformanceFinding(claim, candidateClaims, policy.displayName)).filter((finding) => finding !== void 0), baselineClaims.length);
}
function uniqueConformanceFindings(findings) {
	const seen = /* @__PURE__ */ new Set();
	return findings.filter((finding) => {
		const key = `${finding.checkId}\n${finding.target}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function collectInvalidScopedPolicyFindings(document) {
	if (!isRecord(document.value) || document.value.scopes === void 0) return [];
	if (!isRecord(document.value.scopes)) return [invalidConformanceFinding(document.displayName, `${document.displayName} scopes must be an object.`, `oc://${document.displayName}/scopes`, "Fix scopes so it uses the documented policy syntax.")];
	const findings = [];
	for (const [scopeName, overlay] of Object.entries(document.value.scopes)) {
		const scopePath = `scopes.${scopeName}`;
		const scopeTarget = `oc://${document.displayName}/scopes/${ocPathSegment(scopeName)}`;
		if (!isRecord(overlay)) {
			findings.push(invalidConformanceFinding(document.displayName, `${document.displayName} ${scopePath} must be an object.`, scopeTarget, `Fix ${scopePath} so it uses the documented policy syntax.`));
			continue;
		}
		for (const metadata of POLICY_RULE_METADATA) {
			if (getPolicyPath(overlay, metadata.policyPath) === void 0) continue;
			if ((metadata.scopeSelectors ?? []).some((selector) => normalizePolicySelectorValues(overlay[selector], selector).length > 0)) continue;
			const propertyPath = `${scopePath}.${metadata.policyPath.join(".")}`;
			findings.push(invalidConformanceFinding(document.displayName, `${document.displayName} ${propertyPath} needs a valid selector for policy conformance.`, `${scopeTarget}/${metadata.policyPath.map(ocPathSegment).join("/")}`, `Fix ${propertyPath} so it uses the documented policy syntax.`));
		}
	}
	return findings;
}
function invalidConformanceFinding(displayName, message, target, fixHint) {
	return {
		checkId: POLICY_CONFORMANCE_CHECK_IDS.invalid,
		severity: "error",
		message,
		source: "policy",
		path: displayName,
		target,
		requirement: target,
		fixHint
	};
}
function conformanceFinding(baseline, candidateClaims, policyDisplayName) {
	if (baselineRuleIsNoOp(baseline.metadata, baseline.value)) return;
	const exactCandidates = candidateClaims.filter((candidate) => candidate.key === baseline.key);
	const candidates = baseline.selector === void 0 || exactCandidates.length > 0 ? exactCandidates : candidateClaims.filter((candidate) => candidate.selector === void 0 && candidate.metadata === baseline.metadata);
	if (candidates.length === 0) return unsatisfiedConformanceFinding(baseline, policyDisplayName);
	const satisfies = (candidate) => isPolicyValueAtLeastAsStrict(baseline.metadata, candidate.value, baseline.value);
	if (baseline.selector !== void 0 && exactCandidates.length === 0 && candidates.some(satisfies)) return;
	const weaker = candidates.find((candidate) => !satisfies(candidate));
	if (weaker !== void 0) return unsatisfiedConformanceFinding(baseline, policyDisplayName, weaker);
	if (baseline.selector === void 0) {
		const weakerScopedOverride = candidateClaims.find((candidate) => candidate.selector !== void 0 && candidate.metadata === baseline.metadata && !satisfies(candidate));
		if (weakerScopedOverride !== void 0) return unsatisfiedConformanceFinding(baseline, policyDisplayName, weakerScopedOverride);
	}
}
function baselineRuleIsNoOp(metadata, baseline) {
	switch (metadata.strictness) {
		case "allowlist-subset": return metadata.emptyList === "disabled" && policyRuleListIsEmpty(baseline);
		case "denylist-superset":
		case "routing-probes": return policyRuleListIsEmpty(baseline);
		case "requires-true": return baseline !== true;
		case "requires-false": return baseline !== false;
		case "exact-list":
		case "ordered-string": return false;
	}
	return false;
}
function policyRuleListIsEmpty(value) {
	return Array.isArray(value) && value.length === 0;
}
function unsatisfiedConformanceFinding(baseline, policyDisplayName, candidate) {
	return {
		checkId: candidate === void 0 ? POLICY_CONFORMANCE_CHECK_IDS.missing : POLICY_CONFORMANCE_CHECK_IDS.weaker,
		severity: "error",
		message: candidate === void 0 ? `${policyDisplayName} is missing ${baseline.propertyPath}.` : `${policyDisplayName} ${baseline.propertyPath} is weaker than the baseline policy.`,
		source: "policy",
		path: policyDisplayName,
		target: candidate?.target ?? `oc://${policyDisplayName}/${baseline.propertyPath.replaceAll(".", "/")}`,
		requirement: baseline.target,
		fixHint: candidate === void 0 ? `Add an equally or more restrictive ${baseline.propertyPath} rule, or update the baseline policy after review.` : `Use an equally or more restrictive ${baseline.propertyPath} value, or update the baseline policy after review.`
	};
}
function collectPolicyRuleClaims(document) {
	return [...collectTopLevelPolicyRuleClaims(document), ...collectScopedPolicyRuleClaims(document)];
}
function collectTopLevelPolicyRuleClaims(document) {
	const claims = [];
	for (const metadata of POLICY_RULE_METADATA) {
		const value = getPolicyPath(document.value, metadata.policyPath);
		if (value === void 0) continue;
		const propertyPath = metadata.policyPath.join(".");
		claims.push({
			key: `global:${propertyPath}`,
			metadata,
			value,
			target: `oc://${document.displayName}/${metadata.policyPath.map(ocPathSegment).join("/")}`,
			propertyPath
		});
	}
	return claims;
}
function collectScopedPolicyRuleClaims(document) {
	const claims = [];
	for (const [scopeName, overlay] of scopedPolicyOverlays(document.value)) for (const selector of ["agentIds", "channelIds"]) {
		const selectorValues = normalizePolicySelectorValues(overlay[selector], selector);
		if (selectorValues.length === 0) continue;
		for (const { metadata, value, propertyPath, targetPath } of scopedPolicyFields(scopeName, overlay, selector)) for (const selectorValue of selectorValues) claims.push({
			key: `${selector}:${selectorValue}:${propertyPath}`,
			metadata,
			value,
			target: `oc://${document.displayName}/${targetPath}`,
			propertyPath: `scopes.${scopeName}.${propertyPath}`,
			selector: {
				kind: selector,
				value: selectorValue
			}
		});
	}
	return coalesceScopedPolicyRuleClaims(claims);
}
function coalesceScopedPolicyRuleClaims(claims) {
	const byKey = /* @__PURE__ */ new Map();
	for (const claim of claims) {
		const previous = byKey.get(claim.key);
		if (previous === void 0 || isPolicyValueAtLeastAsStrict(previous.metadata, claim.value, previous.value)) byKey.set(claim.key, claim);
	}
	return [...byKey.values()];
}
async function readPolicyDocument(path) {
	const displayName = basename(path);
	let operation = "read";
	try {
		const raw = await promises.readFile(path, "utf-8");
		operation = "parsed";
		return {
			ok: true,
			displayName,
			value: JSON5.parse(raw)
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			ok: false,
			displayName,
			message: `${displayName} could not be ${operation}: ${message}`,
			target: `oc://${displayName}`
		};
	}
}
function resolvePolicyPath(path) {
	return isAbsolute(path) ? path : resolve(path);
}
//#endregion
//#region extensions/policy/src/cli.ts
function registerPolicyCli(program) {
	const policy = program.command("policy").description("Verify workspace policy conformance");
	policy.command("compare").description("Compare policy.jsonc against an authored baseline policy file").requiredOption("--baseline <path>", "Baseline policy file to compare against").option("--policy <path>", "Policy file to check; defaults to configured policy path").option("--agent <id>", "Agent id for relative policy workspace paths").option("--json", "Emit JSON output").action(async (options) => {
		process.exitCode = await runPolicyCommand(options, async () => {
			if (options.baseline === void 0 || options.baseline.trim() === "") throw new Error("Missing required --baseline value.");
			const policyPath = await policyCompareCandidatePath(options);
			const report = await buildPolicyConformanceReport({
				baselinePath: options.baseline,
				policyPath
			});
			writePolicyConformanceReport(report, options);
			return report.ok ? 0 : 1;
		});
	});
	policy.command("check").description("Check policy requirements and emit an audit attestation").option("--agent <id>", "Agent id (required when multiple agents are configured)").option("--json", "Emit JSON output").option("--severity-min <severity>", "Minimum severity: info, warning, or error").action(async (options) => {
		process.exitCode = await runPolicyCommand(options, async () => {
			const report = await buildPolicyCheckReport(options, "policy check");
			writePolicyCheckReport(report, options);
			return report.exitCode;
		});
	});
	policy.command("watch").description("Watch policy evidence and report accepted-attestation drift").option("--agent <id>", "Agent id (required when multiple agents are configured)").option("--json", "Emit JSON output").option("--severity-min <severity>", "Minimum severity: info, warning, or error").option("--interval-ms <ms>", "Polling interval in milliseconds").option("--once", "Run one watch evaluation and exit").action(async (options) => {
		process.exitCode = await runPolicyCommand(options, async () => {
			const intervalMs = normalizeWatchIntervalMs(options.intervalMs);
			let previousKey;
			for (;;) {
				const report = await buildPolicyCheckReport(options, "policy watch");
				const status = policyWatchStatus(report);
				const key = `${status}:${report.attestation?.attestationHash ?? ""}:${report.exitCode}`;
				if (previousKey === void 0 || previousKey !== key || options.once === true) {
					writePolicyWatchReport(report, status, options);
					previousKey = key;
				}
				if (options.once === true) return status === "stale" ? 1 : report.exitCode;
				await setTimeout(intervalMs);
			}
		});
	});
}
async function runPolicyCommand(options, run) {
	try {
		return await run();
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (options.json === true || !process.stdout.isTTY) defaultRuntime.writeJson({
			ok: false,
			error: {
				type: "cli_error",
				message
			}
		}, 0);
		defaultRuntime.error(message);
		return 2;
	}
}
async function buildPolicyCheckReport(options, ownerSurface) {
	const severityMin = options.severityMin === void 0 ? "info" : parseHealthFindingSeverity(options.severityMin);
	if (severityMin === null) throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
	const snapshot = await readConfigFileSnapshot({ observe: false });
	if (!snapshot.valid) {
		const visibleFindings = snapshot.issues.map((issue) => ({
			checkId: "policy/config-invalid",
			severity: "error",
			message: issue.message,
			source: "policy",
			path: issue.path
		})).filter((finding) => healthFindingMeetsSeverity(finding, severityMin));
		return {
			ok: visibleFindings.length === 0,
			evidence: { channels: [] },
			checksRun: 1,
			checksSkipped: POLICY_CHECK_IDS.length,
			findings: visibleFindings.map(toJsonFinding),
			exitCode: visibleFindings.length === 0 ? 0 : 1
		};
	}
	const cfg = policyCommandConfig(snapshot.config);
	const ctx = {
		mode: "lint",
		runtime: {
			log(value) {
				process.stdout.write(`${String(value)}\n`);
			},
			error(value) {
				defaultRuntime.error(String(value));
			},
			exit(code) {
				process.exitCode = code;
			}
		},
		cfg,
		cwd: resolveAgentWorkspaceDir(cfg, resolvePolicyCommandAgentId(cfg, options.agent, ownerSurface)),
		...snapshot.path !== void 0 ? { configPath: snapshot.path } : {}
	};
	const evaluation = await evaluatePolicy(ctx);
	const jsonFindings = evaluation.findings.filter((finding) => healthFindingMeetsSeverity(finding, severityMin)).map(toJsonFinding);
	const attestedFindings = evaluation.attestedFindings.map(toAttestedJsonFinding);
	const exitCode = exitCodeFromFindings(evaluation.findings, severityMin);
	const attestation = createPolicyAttestation({
		ok: evaluation.attestedFindings.length === 0,
		checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
		policyPath: evaluation.policyPath,
		policyHash: evaluation.policy?.hash,
		evidence: evaluation.evidence,
		findings: attestedFindings
	});
	return {
		ok: exitCode === 0,
		attestation,
		evidence: evaluation.evidence,
		checksRun: POLICY_CHECK_IDS.length,
		checksSkipped: 0,
		findings: jsonFindings,
		expectedAttestationHash: evaluation.expectedAttestationHash,
		exitCode
	};
}
function policyCommandConfig(cfg) {
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				policy: {
					...cfg.plugins?.entries?.["policy"],
					enabled: true,
					config: {
						enabled: true,
						...typeof cfg.plugins?.entries?.["policy"]?.config === "object" && cfg.plugins.entries["policy"].config !== null ? cfg.plugins.entries["policy"].config : {}
					}
				}
			}
		}
	};
}
function resolvePolicyCommandAgentId(cfg, rawAgentId, surface) {
	const requestedAgentId = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requestedAgentId) throw new Error("--agent must not be blank");
	if (requestedAgentId) {
		const agentId = normalizeAgentId(requestedAgentId);
		if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${requestedAgentId}". Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return agentId;
	}
	return resolveDefaultAgentId(cfg, {
		surface,
		hint: "Pass --agent <id>."
	});
}
async function policyCompareCandidatePath(options) {
	if (options.policy !== void 0 && options.policy.trim() !== "") return options.policy.trim();
	const snapshot = await readConfigFileSnapshot({ observe: false });
	if (!snapshot.valid) return "policy.jsonc";
	const pluginConfig = snapshot.config.plugins?.entries?.["policy"]?.config;
	const configured = typeof pluginConfig === "object" && pluginConfig !== null && "path" in pluginConfig ? pluginConfig.path : void 0;
	const policyPath = typeof configured === "string" && configured.trim() !== "" ? configured.trim() : "policy.jsonc";
	if (isAbsolute(policyPath)) return policyPath;
	const cwd = resolveAgentWorkspaceDir(snapshot.config, resolvePolicyCommandAgentId(snapshot.config, options.agent, "policy compare"));
	return resolve(cwd, policyPath);
}
function writePolicyCheckReport(report, options) {
	if (options.json === true || !process.stdout.isTTY) process.stdout.write(JSON.stringify({
		ok: report.ok,
		attestation: report.attestation,
		evidence: report.evidence,
		checksRun: report.checksRun,
		checksSkipped: report.checksSkipped,
		findings: report.findings
	}) + "\n");
	else if (report.findings.length === 0) {
		const policyHash = report.attestation?.policy?.hash ?? "missing";
		const evidenceHash = report.attestation?.workspace.hash ?? "unavailable";
		process.stdout.write(`policy check: no findings (policy ${policyHash}, evidence ${evidenceHash})\n`);
	} else {
		process.stdout.write(`policy check: ${report.findings.length} finding(s)\n`);
		for (const finding of report.findings) {
			const where = finding.path !== void 0 ? ` ${finding.path}` : "";
			const line = finding.line !== void 0 ? `:${finding.line}` : "";
			process.stdout.write(`  [${finding.severity}] ${finding.checkId}${where}${line} - ${finding.message}\n`);
		}
	}
}
function writePolicyConformanceReport(report, options) {
	if (options.json === true || !process.stdout.isTTY) {
		process.stdout.write(JSON.stringify(report) + "\n");
		return;
	}
	if (report.findings.length === 0) {
		process.stdout.write(`policy compare: no findings (${report.policyPath} is at least as strict as ${report.baselinePath}; ${report.rulesChecked} rule(s) checked)\n`);
		return;
	}
	process.stdout.write(`policy compare: ${report.findings.length} finding(s) (${report.rulesChecked} rule(s) checked)\n`);
	for (const finding of report.findings) process.stdout.write(`  [${finding.severity}] ${finding.checkId} - ${finding.message}\n`);
}
function writePolicyWatchReport(report, status, options) {
	if (options.json === true || !process.stdout.isTTY) {
		process.stdout.write(JSON.stringify({
			status,
			ok: report.ok,
			expectedAttestationHash: report.expectedAttestationHash,
			attestation: report.attestation,
			findings: report.findings
		}) + "\n");
		return;
	}
	if (status === "stale") {
		process.stdout.write(`policy watch: accepted attestation is stale (current ${report.attestation?.attestationHash}, expected ${report.expectedAttestationHash}). Review policy check output, then update the supervisor/gateway accepted attestation.\n`);
		return;
	}
	if (status === "findings") {
		process.stdout.write(`policy watch: ${report.findings.length} finding(s); accepted attestation cannot be updated until policy check is clean.\n`);
		return;
	}
	process.stdout.write(`policy watch: clean (attestation ${report.attestation?.attestationHash}, evidence ${report.attestation?.workspace.hash})\n`);
}
function policyWatchStatus(report) {
	if (!report.ok && report.findings.some((finding) => finding.checkId !== "policy/attestation-hash-mismatch")) return "findings";
	const expected = report.expectedAttestationHash?.trim();
	if (expected && report.attestation !== void 0 && report.attestation.attestationHash !== expected) return "stale";
	return report.ok ? "clean" : "findings";
}
function normalizeWatchIntervalMs(value) {
	if (value === void 0) return 2e3;
	const raw = typeof value === "number" ? value : /^\+?\d+$/.test(value.trim()) ? Number(value.trim()) : NaN;
	if (!Number.isSafeInteger(raw) || raw < 250) throw new Error("--interval-ms must be an integer >= 250.");
	return Math.min(raw, MAX_TIMER_TIMEOUT_MS);
}
function toAttestedJsonFinding(finding) {
	const { column: _column, ...json } = toAttestedFinding(finding);
	return json;
}
function toJsonFinding(finding) {
	return {
		...toAttestedJsonFinding(finding),
		...policyFindingMetadata(finding)
	};
}
function policyFindingMetadata(finding) {
	const metadata = POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId);
	if (metadata === void 0) return {};
	return { policy: { fixRecommendation: {
		fixClass: metadata.fixClass,
		...metadata.policyPath !== void 0 ? { policyPath: metadata.policyPath } : {},
		...metadata.configTargets !== void 0 ? { configTargets: metadata.configTargets } : {},
		summary: metadata.summary
	} } };
}
//#endregion
export { registerPolicyCli };
