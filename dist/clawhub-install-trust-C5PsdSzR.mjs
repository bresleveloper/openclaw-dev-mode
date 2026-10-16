import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as visibleWidth, i as stripAnsi } from "./ansi-BeFJ0Uu7.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { v as resolveClawHubBaseUrl } from "./clawhub-client-D-mEumEV.mjs";
import { r as fetchClawHubPackageSecurity } from "./clawhub-packages-U1mzSSOu.mjs";
import { c as fetchClawHubSkillVerification, s as fetchClawHubSkillSecurityVerdicts } from "./clawhub-skills-BFN100ff.mjs";
import pLimit from "p-limit";
//#region src/infra/clawhub-display.ts
function encodeClawHubPackagePath(packageName) {
	return packageName.split("/").map((part) => encodeURIComponent(part).replaceAll("%40", "@")).join("/");
}
function formatClawHubReleaseLabel(packageName, version) {
	return `${sanitizeTerminalText(packageName)}@${sanitizeTerminalText(version)}`;
}
//#endregion
//#region src/infra/clawhub-skill-security.ts
const MAX_SECURITY_VERDICT_BATCH_SIZE = 100;
const OWNER_QUALIFIED_FALLBACK_CONCURRENCY = 6;
const NON_SECURITY_VERIFY_REASONS = /* @__PURE__ */ new Set(["card.missing", "card_missing"]);
function normalizeOwnerHandle(ownerHandle) {
	return normalizeOptionalString(ownerHandle)?.replace(/^@+/, "").toLowerCase() || void 0;
}
function normalizeTarget(target) {
	const slug = target.slug.trim();
	const ownerHandle = normalizeOwnerHandle(target.ownerHandle);
	const version = target.version.trim();
	return {
		slug,
		...ownerHandle ? { ownerHandle } : {},
		version
	};
}
function normalizeSlug(slug) {
	return slug.trim().toLowerCase();
}
function targetKey(target) {
	return `${target.ownerHandle ?? ""}\0${normalizeSlug(target.slug)}\0${target.version}`;
}
function legacyTargetKey(target) {
	return `${normalizeSlug(target.slug)}\0${target.version}`;
}
function partitionCompatibleBatches(targets) {
	const batches = [];
	for (const target of targets) {
		const legacyKey = legacyTargetKey(target);
		let batch = batches.find((candidate) => candidate.items.length < MAX_SECURITY_VERDICT_BATCH_SIZE && !candidate.legacyKeys.has(legacyKey));
		if (!batch) {
			batch = {
				items: [],
				legacyKeys: /* @__PURE__ */ new Set()
			};
			batches.push(batch);
		}
		batch.items.push(target);
		batch.legacyKeys.add(legacyKey);
	}
	return batches.map((batch) => batch.items);
}
function readOptionalStringField(value, field) {
	return normalizeOptionalString(asOptionalRecord(value)?.[field]);
}
function readOptionalNumberField(value, field) {
	return asFiniteNumber(asOptionalRecord(value)?.[field]);
}
function normalizeReason(reason) {
	return normalizeOptionalString(reason)?.toLowerCase() ?? "";
}
function hasOnlyNonSecurityVerifyReasons(reasons) {
	return reasons.length > 0 && reasons.every((reason) => NON_SECURITY_VERIFY_REASONS.has(normalizeReason(reason)));
}
function mapVerificationSecurity(verification, allowCleanCardOnlyPass) {
	const security = asOptionalRecord(verification.security);
	if (!security || Object.hasOwn(security, "passed")) return verification.security;
	const status = normalizeOptionalString(security.status) ?? normalizeOptionalString(security.rawStatus);
	const decisionPass = verification.ok && normalizeReason(verification.decision) === "pass";
	if (!status || !decisionPass && !allowCleanCardOnlyPass) return verification.security;
	return {
		...security,
		passed: true
	};
}
function mapVerificationToVerdict(params) {
	const skill = asOptionalRecord(params.verification.skill);
	const publisher = asOptionalRecord(params.verification.publisher);
	const versionRecord = asOptionalRecord(params.verification.version);
	const pageUrl = normalizeOptionalString(params.verification.pageUrl);
	const reasons = params.verification.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	const securityStatus = normalizeReason(readOptionalStringField(params.verification.security, "status") ?? readOptionalStringField(params.verification.security, "rawStatus"));
	const cardOnlyCleanFailure = !params.verification.ok && securityStatus === "clean" && hasOnlyNonSecurityVerifyReasons(reasons);
	const verifiedVersion = normalizeOptionalString(params.verification.version) ?? readOptionalStringField(versionRecord, "version");
	return {
		ok: cardOnlyCleanFailure ? true : params.verification.ok,
		decision: cardOnlyCleanFailure ? "pass" : params.verification.decision,
		reasons: cardOnlyCleanFailure ? [] : reasons,
		requestedSlug: params.target.slug,
		requestedOwnerHandle: params.target.ownerHandle,
		requestedVersion: params.target.version,
		slug: normalizeOptionalString(params.verification.slug) ?? readOptionalStringField(skill, "slug"),
		version: verifiedVersion ?? (cardOnlyCleanFailure ? params.target.version : null),
		displayName: normalizeOptionalString(params.verification.displayName) ?? readOptionalStringField(skill, "displayName"),
		publisherHandle: normalizeOptionalString(params.verification.publisherHandle) ?? readOptionalStringField(publisher, "handle"),
		publisherDisplayName: normalizeOptionalString(params.verification.publisherDisplayName) ?? readOptionalStringField(publisher, "displayName"),
		createdAt: params.verification.createdAt ?? readOptionalNumberField(versionRecord, "createdAt") ?? null,
		checkedAt: readOptionalNumberField(params.verification.security, "checkedAt") ?? null,
		...pageUrl ? { skillUrl: pageUrl } : {},
		...pageUrl ? { securityAuditUrl: `${pageUrl}/security-audit?version=${encodeURIComponent(params.target.version)}` } : {},
		security: mapVerificationSecurity(params.verification, cardOnlyCleanFailure)
	};
}
function identityFailure(target, message) {
	return {
		ok: false,
		decision: "fail",
		reasons: ["security.identity_mismatch"],
		requestedSlug: target.slug,
		...target.ownerHandle ? { requestedOwnerHandle: target.ownerHandle } : {},
		requestedVersion: target.version,
		slug: null,
		version: null,
		publisherHandle: null,
		security: null,
		error: {
			code: "identity_mismatch",
			message
		}
	};
}
function validateVerdictIdentity(target, item) {
	const requestedSlug = normalizeOptionalString(item.requestedSlug)?.toLowerCase();
	if (requestedSlug !== normalizeSlug(target.slug)) return identityFailure(target, `ClawHub returned requested slug ${requestedSlug ?? "unknown"}.`);
	if (normalizeOptionalString(item.requestedVersion) !== target.version) return identityFailure(target, "ClawHub returned a different requested version.");
	const requestedOwnerHandle = normalizeOwnerHandle(item.requestedOwnerHandle);
	if (requestedOwnerHandle && requestedOwnerHandle !== target.ownerHandle) return identityFailure(target, `ClawHub returned requested owner ${requestedOwnerHandle}.`);
	const resolvedSlug = normalizeOptionalString(item.slug)?.toLowerCase();
	if (resolvedSlug && resolvedSlug !== normalizeSlug(target.slug)) return identityFailure(target, `ClawHub resolved skill ${resolvedSlug}.`);
	const resolvedVersion = normalizeOptionalString(item.version);
	if (resolvedVersion && resolvedVersion !== target.version) return identityFailure(target, `ClawHub resolved version ${resolvedVersion}.`);
	if (item.ok && resolvedVersion !== target.version) return identityFailure(target, "ClawHub did not return the exact requested version.");
	const publisherHandle = normalizeOwnerHandle(item.publisherHandle);
	if (target.ownerHandle && item.version !== null && publisherHandle !== target.ownerHandle) return identityFailure(target, `ClawHub resolved publisher ${publisherHandle ?? "unknown"}.`);
	return item;
}
function correlateBatchItems(targets, items) {
	if (items.length !== targets.length) throw new Error(`ClawHub skill security verdict request returned ${items.length} verdicts for ${targets.length} targets.`);
	const byKey = new Map(targets.map((target) => [targetKey(target), target]));
	const byLegacyKey = new Map(targets.map((target) => [legacyTargetKey(target), target]));
	const correlated = /* @__PURE__ */ new Map();
	for (const item of items) {
		const requestedSlug = normalizeOptionalString(item.requestedSlug)?.toLowerCase();
		const requestedVersion = normalizeOptionalString(item.requestedVersion);
		const requestedOwnerHandle = normalizeOwnerHandle(item.requestedOwnerHandle);
		if (!requestedSlug || !requestedVersion) throw new Error("ClawHub skill security verdict response omitted request identity.");
		const target = requestedOwnerHandle ? byKey.get(targetKey({
			slug: requestedSlug,
			ownerHandle: requestedOwnerHandle,
			version: requestedVersion
		})) : byLegacyKey.get(legacyTargetKey({
			slug: requestedSlug,
			version: requestedVersion
		}));
		if (!target || correlated.has(targetKey(target))) throw new Error("ClawHub skill security verdict response could not be correlated safely.");
		correlated.set(targetKey(target), item);
	}
	return correlated;
}
async function fetchExactClawHubSkillSecurityVerdicts(params) {
	const targets = params.items.map(normalizeTarget);
	const keys = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = targetKey(target);
		if (keys.has(key)) throw new Error("ClawHub skill security verdict request contains duplicate targets.");
		keys.add(key);
	}
	const resolved = /* @__PURE__ */ new Map();
	for (const batch of partitionCompatibleBatches(targets)) {
		const correlated = correlateBatchItems(batch, (await fetchClawHubSkillSecurityVerdicts({
			items: batch,
			baseUrl: params.baseUrl,
			token: params.token,
			...params.skipAuth !== void 0 ? { skipAuth: params.skipAuth } : {},
			timeoutMs: params.timeoutMs
		})).items);
		const fallbackLimit = pLimit(OWNER_QUALIFIED_FALLBACK_CONCURRENCY);
		const resolvedBatch = await Promise.all(batch.map(async (target) => {
			const key = targetKey(target);
			const item = correlated.get(key);
			if (!item) throw new Error("ClawHub skill security verdict response omitted a target.");
			const ownerHandle = target.ownerHandle;
			return [key, validateVerdictIdentity(target, ownerHandle && item.error?.code === "skill_not_found" ? await fallbackLimit(async () => mapVerificationToVerdict({
				verification: await fetchClawHubSkillVerification({
					slug: target.slug,
					ownerHandle,
					version: target.version,
					baseUrl: params.baseUrl,
					token: params.token,
					...params.skipAuth !== void 0 ? { skipAuth: params.skipAuth } : {},
					timeoutMs: params.timeoutMs
				}),
				target: {
					...target,
					ownerHandle
				}
			})) : item)];
		}));
		for (const [key, item] of resolvedBatch) resolved.set(key, item);
	}
	return targets.map((target) => {
		const item = resolved.get(targetKey(target));
		if (!item) throw new Error("ClawHub skill security verdict resolution omitted a target.");
		return item;
	});
}
//#endregion
//#region src/infra/clawhub-install-trust.ts
const CLAWHUB_TRUST_ERROR_CODE = {
	CLAWHUB_SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
	CLAWHUB_DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
const CLAWHUB_BLOCKING_MODERATION_STATES = /* @__PURE__ */ new Set([
	"blocked",
	"quarantined",
	"revoked"
]);
const CLAWHUB_SAFE_MODERATION_STATES = /* @__PURE__ */ new Set(["", "approved"]);
const CLAWHUB_NON_RISK_SCAN_STATUSES = /* @__PURE__ */ new Set([
	"pending",
	"scan_pending",
	"stale",
	"stale_scan"
]);
const CLAWHUB_NON_RISK_REASONS = /* @__PURE__ */ new Set([
	"pending",
	"pending_scan",
	"scan:pending",
	"scan_pending",
	"stale",
	"scan:stale",
	"stale_scan"
]);
function normalizeClawHubTrustToken(value) {
	return normalizeOptionalString(value)?.toLowerCase() ?? "";
}
function hasClawHubRiskReasons(trust) {
	const scanStatus = normalizeClawHubTrustToken(trust.scanStatus);
	const pendingOrStale = trust.pending || trust.stale;
	const moderationState = normalizeClawHubTrustToken(trust.moderationState);
	return trust.blockedFromDownload || scanStatus !== "clean" && !(pendingOrStale && CLAWHUB_NON_RISK_SCAN_STATUSES.has(scanStatus)) || !CLAWHUB_SAFE_MODERATION_STATES.has(moderationState) || trust.reasons.some((reason) => {
		const normalized = normalizeClawHubTrustToken(reason);
		return Boolean(normalized) && !(pendingOrStale && CLAWHUB_NON_RISK_REASONS.has(normalized));
	});
}
function isBlockingClawHubTrust(trust) {
	if (trust.blockedFromDownload) return true;
	if (normalizeClawHubTrustToken(trust.scanStatus) === "malicious") return true;
	if (CLAWHUB_BLOCKING_MODERATION_STATES.has(normalizeClawHubTrustToken(trust.moderationState))) return true;
	return trust.reasons.some((reason) => {
		const normalized = normalizeClawHubTrustToken(reason);
		return normalized === "scan:malicious" || normalized === "static:malicious";
	});
}
function assessClawHubTrust(trust) {
	const hasRiskReasons = hasClawHubRiskReasons(trust);
	if (!hasRiskReasons && !trust.pending && !trust.stale) return "clean";
	if (isBlockingClawHubTrust(trust)) return "blocked";
	return hasRiskReasons ? "review-required" : "review-recommended";
}
function buildClawHubTrustInstallRecordFields(params) {
	const scanStatus = normalizeClawHubTrustToken(params.trust.scanStatus);
	const moderationState = normalizeClawHubTrustToken(params.trust.moderationState);
	const reasons = params.trust.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	return {
		clawhubTrustDisposition: params.disposition,
		...scanStatus ? { clawhubTrustScanStatus: scanStatus } : {},
		...moderationState ? { clawhubTrustModerationState: moderationState } : {},
		...reasons.length > 0 ? { clawhubTrustReasons: reasons } : {},
		...params.trust.pending ? { clawhubTrustPending: true } : {},
		...params.trust.stale ? { clawhubTrustStale: true } : {},
		clawhubTrustCheckedAt: params.checkedAt
	};
}
function resolveClawHubSubjectUrl(params) {
	if (params.subject.kind === "skill" && params.subject.ownerHandle) return `${resolveClawHubBaseUrl(params.baseUrl)}/${encodeURIComponent(params.subject.ownerHandle)}/skills/${encodeURIComponent(params.subject.packageName)}`;
	const pathRoot = params.subject.kind === "skill" ? "skills" : "plugins";
	return `${resolveClawHubBaseUrl(params.baseUrl)}/${pathRoot}/${encodeClawHubPackagePath(params.subject.packageName)}`;
}
function resolveClawHubSecurityAuditUrl(params) {
	const subjectUrl = params.subject.kind === "skill" && normalizeOptionalString(params.links?.subject) || resolveClawHubSubjectUrl(params);
	return normalizeOptionalString(params.links?.security) ?? `${subjectUrl}/security-audit?version=${encodeURIComponent(params.version)}`;
}
function wrapClawHubAuditLine(value, width) {
	if (visibleWidth(value) <= width) return [value];
	const words = value.split(/\s+/u).filter(Boolean);
	const lines = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (line && visibleWidth(next) > width) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	return line ? [...lines, line] : lines;
}
function renderClawHubAuditBox(lines) {
	const columns = Math.max(72, Math.min(process.stdout.columns ?? 88, 104));
	const innerWidth = Math.max(54, Math.min(columns - 4, 88));
	const title = "─ ClawHub Security Audit ";
	const borderWidth = innerWidth + 2;
	return [
		`╭${title}${"─".repeat(Math.max(0, borderWidth - visibleWidth(title)))}╮`,
		...lines.flatMap((line) => {
			if (!line) return [`│ ${" ".repeat(innerWidth)} │`];
			return wrapClawHubAuditLine(line, innerWidth).map((wrapped) => `│ ${wrapped}${" ".repeat(Math.max(0, innerWidth - visibleWidth(wrapped)))} │`);
		}),
		`╰${"─".repeat(borderWidth)}╯`
	].join("\n");
}
function formatClawHubSecurityAudit(params) {
	const securityAuditUrl = resolveClawHubSecurityAuditUrl(params);
	return renderClawHubAuditBox([
		formatClawHubSubjectReleaseLabel(params.subject, params.version),
		"",
		`Outcome: ${params.disposition === "blocked" ? theme.error("Blocked") : params.disposition === "clean" ? theme.success("Safe") : theme.warn("Review")}`,
		"",
		"Overview:",
		...params.overview.split("\n").map((line) => sanitizeTerminalText(line)),
		"",
		`Details: ${sanitizeTerminalText(securityAuditUrl)}`
	]);
}
function formatClawHubSubjectPackageName(subject) {
	return subject.kind === "skill" && subject.ownerHandle ? `@${subject.ownerHandle}/${subject.packageName}` : subject.packageName;
}
function formatClawHubSubjectReleaseLabel(subject, version) {
	return formatClawHubReleaseLabel(formatClawHubSubjectPackageName(subject), version);
}
function validateClawHubSecurityIdentity(params) {
	const packageLabel = params.packageLabel ?? params.packageName;
	const responsePackageName = normalizeOptionalString(params.security.package?.name);
	if (responsePackageName !== params.packageName) return {
		ok: false,
		error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned package "${sanitizeTerminalText(responsePackageName ?? "unknown")}".`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
		version: params.version
	};
	const responseVersion = normalizeOptionalString(params.security.release?.version);
	if (responseVersion !== params.version) return {
		ok: false,
		error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}".`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
		version: params.version
	};
	return null;
}
function readSkillVerdictSecurityStatus(item) {
	if (!item.security || typeof item.security !== "object") return;
	const security = item.security;
	if (typeof security.status === "string") return security.status;
	return typeof security.rawStatus === "string" ? security.rawStatus : void 0;
}
function readSkillVerdictSecurityPassed(item) {
	if (!item.security || typeof item.security !== "object") return;
	const passed = item.security.passed;
	return typeof passed === "boolean" ? passed : void 0;
}
function hasUsablePassingSkillVerdictSecurity(item) {
	return Boolean(readSkillVerdictSecurityStatus(item)) && readSkillVerdictSecurityPassed(item) === true;
}
function hasSkillVerdictSecurityError(item) {
	return Boolean(item.error?.code || item.error?.message || item.version === null);
}
function isSkillVerdictPendingReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized === "pending" || normalized === "pending_scan" || normalized === "scan_pending";
}
function isSkillVerdictStaleReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized === "stale" || normalized === "scan:stale" || normalized === "stale_scan";
}
function isSkillVerdictBlockingReason(reason) {
	const normalized = normalizeClawHubTrustToken(reason);
	return normalized.includes("malicious") || normalized.includes("malware") || normalized.endsWith("_blocked") || normalized.endsWith(".blocked") || normalized === "blocked";
}
function mapSkillSecurityVerdictToPackageSecurity(params) {
	const responseSlug = normalizeOptionalString(params.item.slug ?? params.item.requestedSlug);
	if (responseSlug !== params.packageName) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned skill "${sanitizeTerminalText(responseSlug ?? "unknown")}".`);
	const responsePublisher = normalizeOptionalString(params.item.publisherHandle);
	if (params.ownerHandle && responsePublisher !== params.ownerHandle) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned publisher "${sanitizeTerminalText(responsePublisher ?? "unknown")}", expected "${sanitizeTerminalText(params.ownerHandle)}".`);
	const responseVersion = normalizeOptionalString(params.item.version);
	if (responseVersion !== params.version) {
		const reason = params.item.error?.message ? `: ${sanitizeTerminalText(params.item.error.message)}` : "";
		throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}"${reason}.`);
	}
	if (hasSkillVerdictSecurityError(params.item)) {
		const reason = params.item.error?.message ? `: ${sanitizeTerminalText(params.item.error.message)}` : "";
		throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict${reason}.`);
	}
	const decision = normalizeClawHubTrustToken(params.item.decision);
	if (params.item.ok && decision === "pass" && !hasUsablePassingSkillVerdictSecurity(params.item)) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict.`);
	const securityStatus = normalizeClawHubTrustToken(readSkillVerdictSecurityStatus(params.item));
	const securityPassed = readSkillVerdictSecurityPassed(params.item);
	const reasons = params.item.reasons.map((reason) => normalizeOptionalString(reason)).filter((reason) => Boolean(reason));
	const securityPassedAllowsInstall = securityPassed ?? true;
	const verdictPassed = params.item.ok && decision === "pass" && securityPassedAllowsInstall;
	const scanStatus = verdictPassed ? securityStatus || "clean" : securityStatus && securityStatus !== "clean" ? securityStatus : "suspicious";
	if (!verdictPassed && reasons.length === 0) reasons.push(decision ? `decision:${decision}` : "decision:fail");
	const hasBlockingReason = reasons.some(isSkillVerdictBlockingReason);
	const displayName = normalizeOptionalString(params.item.displayName);
	const overview = params.item.overview;
	if (typeof overview !== "string" || !overview.trim()) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return an audit overview.`);
	const securityAuditUrl = normalizeOptionalString(params.item.securityAuditUrl);
	if (!securityAuditUrl) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a security audit URL.`);
	return {
		package: {
			name: params.packageName,
			family: "skill",
			...displayName ? { displayName } : {}
		},
		release: { version: params.version },
		overview,
		securityAuditUrl,
		trust: {
			scanStatus,
			moderationState: null,
			blockedFromDownload: decision === "blocked" || securityStatus === "malicious" || hasBlockingReason,
			reasons,
			pending: securityStatus === "pending" || reasons.some(isSkillVerdictPendingReason),
			stale: securityStatus === "stale" || reasons.some(isSkillVerdictStaleReason)
		}
	};
}
function resolveSkillSecurityLinks(item) {
	const subject = normalizeOptionalString(item.skillUrl);
	const security = normalizeOptionalString(item.securityAuditUrl);
	return {
		...subject ? { subject } : {},
		...security ? { security } : {}
	};
}
async function fetchClawHubSubjectSecurity(params) {
	if (params.subject.kind === "plugin") {
		const security = await fetchClawHubPackageSecurity({
			name: params.subject.packageName,
			version: params.version,
			baseUrl: params.baseUrl,
			token: params.token,
			timeoutMs: params.timeoutMs
		});
		return {
			security,
			links: { security: security.securityAuditUrl }
		};
	}
	const [item] = await fetchExactClawHubSkillSecurityVerdicts({
		items: [{
			slug: params.subject.packageName,
			...params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {},
			version: params.version
		}],
		baseUrl: params.baseUrl,
		token: params.token,
		timeoutMs: params.timeoutMs
	});
	if (!item) throw new Error(`ClawHub skill trust check for "${formatClawHubReleaseLabel(params.subject.packageName, params.version)}" returned no verdict.`);
	return {
		security: mapSkillSecurityVerdictToPackageSecurity({
			item,
			packageName: params.subject.packageName,
			...params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {},
			version: params.version
		}),
		links: resolveSkillSecurityLinks(item)
	};
}
async function checkClawHubPackageTrust(params) {
	let trust;
	let overview;
	let warningLinks;
	const packageLabel = formatClawHubSubjectPackageName(params.subject);
	const releaseLabel = formatClawHubSubjectReleaseLabel(params.subject, params.version);
	try {
		const fetchedSecurity = await fetchClawHubSubjectSecurity({
			subject: params.subject,
			version: params.version,
			baseUrl: params.baseUrl,
			token: params.token,
			timeoutMs: params.timeoutMs
		});
		const identityFailure = validateClawHubSecurityIdentity({
			security: fetchedSecurity.security,
			packageName: params.subject.packageName,
			packageLabel,
			version: params.version
		});
		if (identityFailure) return identityFailure;
		trust = fetchedSecurity.security.trust;
		overview = fetchedSecurity.security.overview;
		warningLinks = fetchedSecurity.links;
	} catch (error) {
		return {
			ok: false,
			error: `ClawHub release trust check failed for "${releaseLabel}": ${sanitizeTerminalText(formatErrorMessage(error))}`,
			code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
			version: params.version
		};
	}
	const disposition = assessClawHubTrust(trust);
	const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
	const terminalAudit = formatClawHubSecurityAudit({
		baseUrl: params.baseUrl,
		subject: params.subject,
		version: params.version,
		overview,
		disposition,
		links: warningLinks
	});
	const audit = stripAnsi(terminalAudit);
	if (disposition === "clean") params.logger?.info?.(terminalAudit);
	else params.logger?.warn?.(terminalAudit);
	if (disposition === "blocked") return {
		ok: false,
		error: `ClawHub blocked this release; ${params.mode === "update" ? "update" : "install"} was not started.`,
		code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED,
		warning: audit,
		version: params.version
	};
	if (params.mode !== "update" && params.confirmInstall && !await params.confirmInstall()) return {
		ok: false,
		error: "Install cancelled.",
		warning: audit,
		version: params.version
	};
	return {
		ok: true,
		trustInstallRecordFields: buildClawHubTrustInstallRecordFields({
			trust,
			disposition,
			checkedAt
		}),
		...disposition === "clean" ? {} : { warning: audit }
	};
}
//#endregion
export { encodeClawHubPackagePath as a, fetchExactClawHubSkillSecurityVerdicts as i, assessClawHubTrust as n, formatClawHubReleaseLabel as o, checkClawHubPackageTrust as r, CLAWHUB_TRUST_ERROR_CODE as t };
