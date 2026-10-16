import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { Lt as boolean } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { D as parseSessionDeliveryRoute, M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { g as toCanonicalOpenAIModelRef, i as isBlockedLegacyCodexModelRef } from "./codex-route-model-ref-CA8y5Vff.mjs";
import { a as migrateLegacyToolNameList, i as hasLegacyToolNameList, n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-hwNf4VK8.mjs";
import { n as parseCodeModeScriptSyntax, t as buildCodeModeScriptParseSource } from "./code-mode-script-syntax-DZwdESO8.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BEO0zOri.mjs";
import { c as parseOptionalField, i as LowercaseNonEmptyStringFieldSchema, o as TrimmedNonEmptyStringFieldSchema, r as DeliveryThreadIdFieldSchema, t as inferCronJobName } from "./normalize-BnyTRpHq.mjs";
import { n as getInvalidPersistedCronJobReason } from "./persisted-shape-wTzSQpQE.mjs";
import { i as normalizeCronScheduledToolPolicy, s as resolveCronScheduledToolPolicy, t as createAccountCronScheduledToolPolicy } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-BLfBrJ0b.mjs";
import { i as resolveCronCurrentSessionTarget } from "./session-target-DJsUULzX.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-Bs6dAunR.mjs";
import { n as hasCronShellToolAccess, r as parseCronAgentTurnCommandPrompt, t as classifyCronAgentTurnShellPrompt } from "./agent-turn-command-prompt-DqrePHZg.mjs";
import { randomUUID } from "node:crypto";
import { tokenizer } from "acorn";
//#region src/commands/doctor/cron/legacy-delivery.ts
function parseLegacyDeliveryHintsInput(payload) {
	return {
		deliver: parseOptionalField(boolean(), payload.deliver),
		bestEffortDeliver: parseOptionalField(boolean(), payload.bestEffortDeliver),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.channel),
		provider: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.provider),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, payload.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema.transform((value) => String(value)), payload.threadId)
	};
}
/** Normalize delivery and strip consumed legacy delivery fields from the payload. */
function normalizeLegacyDeliveryInput(params) {
	const { payload } = params;
	const hints = payload ? parseLegacyDeliveryHintsInput(payload) : void 0;
	if (!payload || !hints || !Object.values(hints).some((value) => value !== void 0)) return {
		delivery: params.delivery ?? void 0,
		mutated: false
	};
	const next = {
		...params.delivery,
		mode: hints.deliver === false ? "none" : "announce"
	};
	if (hints.channel ?? hints.provider) next.channel = hints.channel ?? hints.provider;
	if (hints.to) next.to = hints.to;
	if (hints.threadId) next.threadId = hints.threadId;
	if (hints.bestEffortDeliver !== void 0) next.bestEffort = hints.bestEffortDeliver;
	for (const key of [
		"deliver",
		"channel",
		"provider",
		"to",
		"threadId",
		"bestEffortDeliver"
	]) delete payload[key];
	return {
		delivery: next,
		mutated: true
	};
}
//#endregion
//#region src/commands/doctor/cron/payload-migration.ts
const LEGACY_DELIVERY_HINT_FIELDS = [
	"deliver",
	"bestEffortDeliver",
	"channel",
	"provider",
	"to",
	"threadId"
];
function normalizePayloadKind(payload) {
	const raw = normalizeOptionalLowercaseString(payload.kind) ?? "";
	const kind = raw === "agentturn" ? "agentTurn" : raw === "systemevent" ? "systemEvent" : void 0;
	if (!kind || payload.kind === kind) return false;
	payload.kind = kind;
	return true;
}
function inferPayloadIfMissing(raw) {
	const message = normalizeOptionalString(raw.message) ?? "";
	const text = normalizeOptionalString(raw.text) ?? "";
	const command = normalizeOptionalString(raw.command) ?? "";
	if (message) {
		raw.payload = {
			kind: "agentTurn",
			message
		};
		return true;
	}
	if (text || command) {
		raw.payload = {
			kind: "systemEvent",
			text: text || command
		};
		return true;
	}
	return false;
}
function copyTopLevelAgentTurnFields(raw, payload) {
	let mutated = false;
	for (const field of ["model", "thinking"]) {
		if (normalizeOptionalString(payload[field])) continue;
		const value = normalizeOptionalString(raw[field]);
		if (value) {
			payload[field] = value;
			mutated = true;
		}
	}
	if (typeof payload.timeoutSeconds !== "number" && typeof raw.timeoutSeconds === "number" && Number.isFinite(raw.timeoutSeconds)) {
		payload.timeoutSeconds = Math.max(0, Math.floor(raw.timeoutSeconds));
		mutated = true;
	}
	const copyBoolean = (field) => {
		if (typeof payload[field] !== "boolean" && typeof raw[field] === "boolean") {
			payload[field] = raw[field];
			mutated = true;
		}
	};
	const copyString = (field) => {
		const value = normalizeOptionalString(raw[field]);
		if (typeof payload[field] !== "string" && value) {
			payload[field] = value;
			mutated = true;
		}
	};
	copyBoolean("allowUnsafeExternalContent");
	copyBoolean("deliver");
	copyString("channel");
	copyString("to");
	const rawThreadId = normalizeOptionalString(raw.threadId);
	if (!("threadId" in payload) && (typeof raw.threadId === "number" && Number.isFinite(raw.threadId) || Boolean(rawThreadId))) {
		payload.threadId = rawThreadId ?? raw.threadId;
		mutated = true;
	}
	copyBoolean("bestEffortDeliver");
	copyString("provider");
	return mutated;
}
function stripLegacyTopLevelFields(raw) {
	const removed = {
		payload: false,
		delivery: false
	};
	for (const [kind, fields] of [["payload", [
		"model",
		"thinking",
		"timeoutSeconds",
		"allowUnsafeExternalContent",
		"message",
		"text",
		"command",
		"timeout"
	]], ["delivery", LEGACY_DELIVERY_HINT_FIELDS]]) for (const field of fields) if (field in raw) {
		delete raw[field];
		removed[kind] = true;
	}
	return removed;
}
function readLegacyOpenAICodexCronModelRoute(value) {
	const legacyModelRef = readStringValue(value)?.trim();
	const canonicalModelRef = legacyModelRef ? toCanonicalOpenAIModelRef(legacyModelRef) : void 0;
	return legacyModelRef && canonicalModelRef ? {
		legacyModelRef,
		canonicalModelRef
	} : void 0;
}
/** Legacy and canonical route pairs retained for namespace-specific migration blockers. */
function collectLegacyOpenAICodexCronModelRoutes(payload) {
	const routes = /* @__PURE__ */ new Map();
	const add = (value) => {
		const route = readLegacyOpenAICodexCronModelRoute(value);
		if (route) routes.set(`${route.legacyModelRef}\u0000${route.canonicalModelRef}`, route);
	};
	add(payload.model);
	if (Array.isArray(payload.fallbacks)) for (const fallback of payload.fallbacks) add(fallback);
	return [...routes.values()];
}
function readPositiveInteger(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function migrateLegacyOpenAICodexModelRefs(payload, shouldMigrate) {
	let mutated = false;
	const model = readLegacyOpenAICodexCronModelRoute(payload.model);
	if (model && shouldMigrate(model.canonicalModelRef, model.legacyModelRef) && payload.model !== model.canonicalModelRef) {
		payload.model = model.canonicalModelRef;
		mutated = true;
	}
	const fallbacks = payload.fallbacks;
	if (Array.isArray(fallbacks)) {
		const next = fallbacks.map((fallback) => {
			const route = readLegacyOpenAICodexCronModelRoute(fallback);
			return route && shouldMigrate(route.canonicalModelRef, route.legacyModelRef) ? route.canonicalModelRef : fallback;
		});
		if (next.some((fallback, index) => fallback !== fallbacks[index])) {
			payload.fallbacks = next;
			mutated = true;
		}
	}
	return mutated;
}
function migrateLegacyCronPayload(payload, options = {}) {
	let mutated = false;
	if (migrateLegacyToolNameList(payload.toolsAllow, TASK_SUGGESTION_TOOL_NAME_MIGRATION)) mutated = true;
	if (migrateLegacyToolNameList(payload.toolsAllow, IMAGE_INSPECTION_TOOL_NAME_MIGRATION)) mutated = true;
	const channelValue = readStringValue(payload.channel);
	const nextChannel = normalizeOptionalLowercaseString(channelValue) ?? normalizeOptionalLowercaseString(payload.provider);
	if (nextChannel && channelValue !== nextChannel) {
		payload.channel = nextChannel;
		mutated = true;
	}
	if ("provider" in payload) {
		delete payload.provider;
		mutated = true;
	}
	if (migrateLegacyOpenAICodexModelRefs(payload, options.migrateCodexModelRefs === true ? options.shouldMigrateCodexModelRef ?? (() => true) : () => false)) mutated = true;
	return mutated;
}
function migrateLegacyAgentTurnCommandPayload(payload) {
	if (payload.kind !== "agentTurn") return false;
	const message = readStringValue(payload.message);
	if (typeof message !== "string") return false;
	const parsed = parseCronAgentTurnCommandPrompt(message);
	if (!parsed) return false;
	if (!hasCronShellToolAccess(payload.toolsAllow)) return false;
	const timeoutSeconds = readPositiveInteger(payload.timeoutSeconds) ?? parsed.timeoutSeconds;
	const deliveryHints = {};
	for (const key of LEGACY_DELIVERY_HINT_FIELDS) if (key in payload) deliveryHints[key] = payload[key];
	for (const key of Object.keys(payload)) delete payload[key];
	payload.kind = "command";
	payload.argv = [
		"sh",
		"-lc",
		parsed.command
	];
	if (parsed.cwd) payload.cwd = parsed.cwd;
	if (timeoutSeconds !== void 0) payload.timeoutSeconds = timeoutSeconds;
	Object.assign(payload, deliveryHints);
	return true;
}
//#endregion
//#region src/commands/doctor/cron/scheduled-tool-policy-migration.ts
/** Collects operator-visible recovery outcomes while normalizing a cron store. */
function createScheduledToolPolicyMigrationCollector() {
	const legacyJobs = [];
	const invalidJobs = [];
	return {
		legacyJobs,
		invalidJobs,
		migrate(raw, onMigrated) {
			const result = migrateScheduledToolPolicy(raw);
			const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
			if (result.status === "migrated") onMigrated("policy");
			if (result.ownerReconciled) onMigrated("owner");
			if (result.status === "legacy" && jobName) legacyJobs.push(jobName);
			else if (result.status === "invalid" && jobName) invalidJobs.push(jobName);
			return result.mutated;
		}
	};
}
function usesToolRuntime(raw) {
	const payload = asOptionalRecord(raw.payload);
	const trigger = asOptionalRecord(raw.trigger);
	return payload?.kind === "agentTurn" || payload?.kind === "script" || typeof trigger?.script === "string" && trigger.script.trim().length > 0;
}
/** Recovers only account authority proven by immutable persisted owner identity. */
function migrateScheduledToolPolicy(raw) {
	if (!usesToolRuntime(raw)) return {
		mutated: false,
		status: raw.scheduledToolPolicy === void 0 ? "not-applicable" : "invalid"
	};
	const payload = asOptionalRecord(raw.payload);
	const toolsAllow = Array.isArray(payload?.toolsAllow) && payload.toolsAllow.every((value) => typeof value === "string") ? payload.toolsAllow : void 0;
	const owner = asOptionalRecord(raw.owner);
	const ownerSessionKey = normalizeOptionalString(owner?.sessionKey);
	const ownerAccountId = normalizeOptionalAccountId(typeof owner?.accountId === "string" ? owner.accountId : void 0);
	if (raw.scheduledToolPolicy !== void 0) {
		const normalized = normalizeCronScheduledToolPolicy(raw.scheduledToolPolicy);
		const resolved = resolveCronScheduledToolPolicy({
			toolsAllow,
			scheduledToolPolicy: normalized,
			owner: {
				sessionKey: ownerSessionKey,
				accountId: ownerAccountId
			}
		});
		if (!resolved) return {
			mutated: false,
			status: "invalid"
		};
		const mutated = JSON.stringify(raw.scheduledToolPolicy) !== JSON.stringify(resolved);
		if (mutated) raw.scheduledToolPolicy = resolved;
		return {
			mutated,
			status: "current"
		};
	}
	if (!ownerSessionKey) return {
		mutated: false,
		status: "legacy"
	};
	const parsedSession = parseAgentSessionKey(ownerSessionKey);
	if (!parsedSession) return {
		mutated: false,
		status: "legacy"
	};
	const ownerAgentId = normalizeOptionalString(owner?.agentId);
	if (ownerAgentId && normalizeAgentId(ownerAgentId) !== normalizeAgentId(parsedSession.agentId)) return {
		mutated: false,
		status: "legacy"
	};
	const encodedAccountId = normalizeOptionalAccountId(parseSessionDeliveryRoute(ownerSessionKey)?.accountId);
	if (ownerAccountId && encodedAccountId && ownerAccountId !== encodedAccountId) return {
		mutated: false,
		status: "legacy"
	};
	const recoveredAccountId = ownerAccountId ?? encodedAccountId;
	if (!recoveredAccountId) return {
		mutated: false,
		status: "legacy"
	};
	const scheduledToolPolicy = createAccountCronScheduledToolPolicy({
		ownerSessionKey,
		ownerAccountId: recoveredAccountId
	});
	if (!scheduledToolPolicy) return {
		mutated: false,
		status: "legacy"
	};
	const reconciledOwner = {
		...owner,
		...ownerAgentId ? { agentId: normalizeAgentId(ownerAgentId) } : {},
		sessionKey: ownerSessionKey,
		accountId: recoveredAccountId
	};
	const ownerReconciled = JSON.stringify(raw.owner) !== JSON.stringify(reconciledOwner);
	raw.owner = reconciledOwner;
	if (!toolsAllow) return {
		mutated: ownerReconciled,
		ownerReconciled,
		status: "legacy"
	};
	raw.scheduledToolPolicy = scheduledToolPolicy;
	return {
		mutated: true,
		ownerReconciled,
		status: "migrated"
	};
}
//#endregion
//#region src/commands/doctor/cron/trigger-script-migration.ts
function sourceContainsComment(source) {
	let hasComment = false;
	const tokens = tokenizer(source, {
		ecmaVersion: "latest",
		onComment: () => {
			hasComment = true;
		}
	});
	while (tokens.getToken().type.label !== "eof") if (hasComment) return true;
	return hasComment;
}
function isSyntaxNode(value) {
	return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string" && "start" in value && typeof value.start === "number" && "end" in value && typeof value.end === "number";
}
function collectSyntaxVisits(node, ancestors = []) {
	const visits = [{
		node,
		ancestors
	}];
	for (const value of Object.values(node)) for (const child of Array.isArray(value) ? value : [value]) if (isSyntaxNode(child)) visits.push(...collectSyntaxVisits(child, [...ancestors, node]));
	return visits;
}
function isNoncomputedPropertyName(node, parent) {
	return parent?.type === "MemberExpression" && parent.property === node && !parent.computed || parent?.type === "Property" && parent.key === node && !parent.computed && !parent.shorthand;
}
function isStaticPlainObjectArgument(node) {
	return node.type === "ObjectExpression" && node.properties.every((property) => property.type === "Property" && property.kind === "init" && !property.computed && !property.method);
}
function legacyToolCall(node) {
	if (node.type !== "CallExpression") return;
	const callee = node.callee;
	if (callee.type !== "MemberExpression" || callee.computed || callee.optional || callee.object.type !== "Identifier" || callee.object.name !== "tools" || callee.property.type !== "Identifier" || callee.property.name !== "call" || node.optional || node.arguments.length !== 2) return;
	const [toolName, args] = node.arguments;
	return toolName?.type === "Literal" && toolName.value === "exec" && args && isStaticPlainObjectArgument(args) ? {
		call: node,
		tool: callee.object,
		args
	} : void 0;
}
/** Rewrite only the exact v2026.7.1 Cron trigger idiom; custom legacy code stays untouched. */
function migrateLegacyCronTriggerScript(script) {
	const parsed = parseCodeModeScriptSyntax(script);
	if (!parsed.ok) return { kind: "unsupported" };
	const wrapper = parsed.program.body[0];
	if (wrapper?.type !== "ExpressionStatement" || wrapper.expression.type !== "ArrowFunctionExpression" || wrapper.expression.body.type !== "BlockStatement") return { kind: "unsupported" };
	const body = wrapper.expression.body;
	const visits = collectSyntaxVisits(body);
	if (visits.some(({ node, ancestors }) => {
		if (node.type !== "MemberExpression") return false;
		const receiver = node.object;
		const isGlobalObject = receiver.type === "Identifier" && receiver.name === "globalThis";
		const isTopLevelThis = receiver.type === "ThisExpression" && !ancestors.some((ancestor) => ancestor.type === "FunctionDeclaration" || ancestor.type === "FunctionExpression");
		if (!isGlobalObject && !isTopLevelThis) return false;
		const property = node.property;
		const name = node.computed ? property.type === "Literal" ? property.value : void 0 : property.type === "Identifier" ? property.name : void 0;
		return name === "tools" || name === "ALL_TOOLS";
	})) return { kind: "unsupported" };
	const legacyIdentifiers = visits.filter(({ node, ancestors }) => {
		if (node.type !== "Identifier") return false;
		return (node.name === "tools" || node.name === "ALL_TOOLS") && !isNoncomputedPropertyName(node, ancestors.at(-1));
	});
	if (legacyIdentifiers.length === 0) return { kind: "current" };
	const edits = [];
	const bindings = /* @__PURE__ */ new Map();
	const recognizedTools = /* @__PURE__ */ new Set();
	const { codeOffset } = buildCodeModeScriptParseSource(script);
	for (const { node, ancestors } of visits) {
		if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression" || node.type === "WithStatement") return { kind: "unsupported" };
		const legacy = legacyToolCall(node);
		if (!legacy) continue;
		const { call, tool, args } = legacy;
		const parent = ancestors.at(-1);
		const awaited = parent?.type === "AwaitExpression";
		const expression = awaited ? parent : node;
		const owner = ancestors.at(awaited ? -2 : -1);
		const statement = ancestors.at(awaited ? -4 : -3);
		if (owner?.type === "VariableDeclarator") {
			const declaration = ancestors.at(awaited ? -3 : -2);
			const declarator = owner;
			if (!awaited || declaration?.type !== "VariableDeclaration" || declaration.kind !== "const" || declaration.declarations.length !== 1 || statement !== body || declarator.id.type !== "Identifier" || declarator.init !== expression || declarator.id.name === "exec" || bindings.has(declarator.id.name)) return { kind: "unsupported" };
			bindings.set(declarator.id.name, declarator.id);
		} else if (owner?.type !== "ExpressionStatement" || ancestors.at(awaited ? -3 : -2) !== body) return { kind: "unsupported" };
		recognizedTools.add(tool);
		if (sourceContainsComment(script.slice(call.start - codeOffset, args.start - codeOffset))) return { kind: "unsupported" };
		edits.push({
			start: call.start - codeOffset,
			end: args.start - codeOffset,
			replacement: "exec("
		});
	}
	for (const { node, ancestors } of visits) {
		if (node.type !== "Identifier") continue;
		const parent = ancestors.at(-1);
		if (isNoncomputedPropertyName(node, parent)) continue;
		if (node.name === "tools" || node.name === "ALL_TOOLS") {
			if (!recognizedTools.has(node)) return { kind: "unsupported" };
			continue;
		}
		if (node.name === "exec") {
			if (parent?.type !== "CallExpression" || parent.callee !== node) return { kind: "unsupported" };
			continue;
		}
		const declaration = bindings.get(node.name);
		if (!declaration || declaration === node) continue;
		const result = parent;
		const details = ancestors.at(-2);
		if (result?.type !== "MemberExpression" || result.object !== node || result.computed || result.property.type !== "Identifier" || result.property.name !== "result" || details?.type !== "MemberExpression" || details.object !== result || details.computed || details.property.type !== "Identifier" || details.property.name !== "details") return { kind: "unsupported" };
		if (sourceContainsComment(script.slice(node.end - codeOffset, details.end - codeOffset))) return { kind: "unsupported" };
		edits.push({
			start: node.end - codeOffset,
			end: details.end - codeOffset,
			replacement: ""
		});
	}
	if (recognizedTools.size !== legacyIdentifiers.length || edits.length === 0) return { kind: "unsupported" };
	let rewritten = script;
	for (const edit of edits.toSorted((left, right) => right.start - left.start)) rewritten = `${rewritten.slice(0, edit.start)}${edit.replacement}${rewritten.slice(edit.end)}`;
	return migrateLegacyCronTriggerScript(rewritten).kind === "current" ? {
		kind: "supported",
		script: rewritten
	} : { kind: "unsupported" };
}
//#endregion
//#region src/commands/doctor/cron/store-migration.ts
function cronCodexRuntimePolicyTargetKey(target) {
	return `${target.agentId ?? ""}\u0000${target.modelRef}\u0000${target.legacyModelRef ?? ""}`;
}
function collectStoredCronCodexRuntimePolicyTargets(jobs, blockedModelIdentities) {
	const targets = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		const agentId = normalizeOptionalString(job.agentId);
		const routes = [...collectLegacyOpenAICodexCronModelRoutes(isRecord(job.payload) ? job.payload : {}), ...collectLegacyOpenAICodexCronModelRoutes({ model: job.model })];
		for (const route of routes) {
			if (isBlockedLegacyCodexModelRef({
				modelRef: route.legacyModelRef,
				blockedModelIdentities
			})) continue;
			const target = {
				...agentId ? { agentId } : {},
				modelRef: route.canonicalModelRef,
				legacyModelRef: route.legacyModelRef
			};
			targets.set(cronCodexRuntimePolicyTargetKey(target), target);
		}
	}
	return [...targets.values()];
}
function incrementIssue(issues, key) {
	issues[key] = (issues[key] ?? 0) + 1;
}
function normalizeStoredCronJobIdentity(raw, trackIssue) {
	const id = normalizeOptionalStringifiedId(raw.id);
	const legacyJobId = normalizeOptionalStringifiedId(raw.jobId);
	const canonicalId = id ?? legacyJobId ?? `cron-${randomUUID()}`;
	const hadJobIdKey = "jobId" in raw;
	if (hadJobIdKey) trackIssue("jobId");
	if (!id && !legacyJobId) trackIssue("missingId");
	if ("id" in raw && raw.id != null && typeof raw.id !== "string") trackIssue("nonStringId");
	const mutated = raw.id !== canonicalId || hadJobIdKey;
	raw.id = canonicalId;
	delete raw.jobId;
	return mutated;
}
function resolveLegacyCronDeliveryMode(mode) {
	if (mode === void 0 || mode === null) return "announce";
	const normalized = normalizeOptionalLowercaseString(mode);
	if (normalized === "deliver") return "announce";
	return normalized === "none" || normalized === "announce" || normalized === "webhook" ? normalized : void 0;
}
/** Unknown delivery intent must remain untouched until the operator supplies a supported mode. */
function canRepairCronDeliveryForDoctor(delivery) {
	return delivery === void 0 || isRecord(delivery) && resolveLegacyCronDeliveryMode(delivery.mode) !== void 0;
}
/** Normalize persisted cron jobs in place and report issues plus rows to quarantine. */
function normalizeStoredCronJobs(jobs, options = {}) {
	const issues = {};
	const unresolvedAgentTurnCommandPromptJobs = [];
	const unresolvedAgentTurnShellToolPromptJobs = [];
	const legacyTriggerScriptJobs = [];
	const unsupportedLegacyTriggerScriptJobs = [];
	const unsupportedDeliveryModeJobs = [];
	const legacyGatewayExecJobs = [];
	const scheduledToolPolicyMigrations = createScheduledToolPolicyMigrationCollector();
	const unresolvedAgentTurnPromptJobsByKind = {
		commandPromptWithoutShellAccess: unresolvedAgentTurnCommandPromptJobs,
		shellToolPrompt: unresolvedAgentTurnShellToolPromptJobs
	};
	let mutated = false;
	const keptJobs = [];
	const removedJobs = [];
	const codexRuntimePolicyTargets = /* @__PURE__ */ new Map();
	for (const [sourceIndex, raw] of jobs.entries()) {
		if (!canRepairCronDeliveryForDoctor(raw.delivery)) {
			unsupportedDeliveryModeJobs.push(normalizeOptionalStringifiedId(raw.id) ?? normalizeOptionalStringifiedId(raw.jobId) ?? "<unnamed>");
			keptJobs.push(raw);
			continue;
		}
		const jobIssues = /* @__PURE__ */ new Set();
		const trackIssue = (key) => {
			if (jobIssues.has(key)) return;
			jobIssues.add(key);
			incrementIssue(issues, key);
		};
		const identityMutated = normalizeStoredCronJobIdentity(raw, trackIssue);
		mutated ||= identityMutated;
		if (!isRecord(raw.state)) {
			raw.state = {};
			mutated = true;
		}
		if (typeof raw.schedule === "string") {
			raw.schedule = {
				kind: "cron",
				expr: raw.schedule.trim()
			};
			mutated = true;
			trackIssue("legacyScheduleString");
		}
		const nameRaw = raw.name;
		if (typeof nameRaw !== "string" || nameRaw.trim().length === 0) {
			raw.name = inferCronJobName({
				schedule: raw.schedule,
				payload: raw.payload
			});
			mutated = true;
		} else raw.name = nameRaw.trim();
		const trigger = raw.trigger;
		if (isRecord(trigger)) {
			if (typeof trigger.script === "string") {
				const migration = migrateLegacyCronTriggerScript(trigger.script);
				const id = normalizeOptionalString(raw.id);
				const name = normalizeOptionalString(raw.name);
				const jobIdentity = name && id && name !== id ? `${name} (${id})` : name ?? id;
				if (migration.kind === "supported") {
					trigger.script = migration.script;
					mutated = true;
					if (jobIdentity) legacyTriggerScriptJobs.push(jobIdentity);
				} else if (migration.kind === "unsupported" && jobIdentity) unsupportedLegacyTriggerScriptJobs.push(jobIdentity);
			}
		}
		const desc = normalizeOptionalString(raw.description);
		if (raw.description !== desc) {
			raw.description = desc;
			mutated = true;
		}
		if ("sessionKey" in raw) {
			const sessionKey = normalizeOptionalString(raw.sessionKey);
			if (raw.sessionKey !== sessionKey) {
				raw.sessionKey = sessionKey;
				mutated = true;
			}
		}
		if (typeof raw.enabled !== "boolean") {
			raw.enabled = true;
			mutated = true;
		}
		const wakeMode = normalizeOptionalLowercaseString(raw.wakeMode) === "next-heartbeat" ? "next-heartbeat" : "now";
		if (raw.wakeMode !== wakeMode) {
			raw.wakeMode = wakeMode;
			mutated = true;
		}
		if (!isRecord(raw.payload) && inferPayloadIfMissing(raw)) {
			mutated = true;
			trackIssue("legacyTopLevelPayloadFields");
		}
		const payloadRecord = asNullableRecord(raw.payload);
		if (payloadRecord) {
			if (normalizePayloadKind(payloadRecord)) {
				mutated = true;
				trackIssue("legacyPayloadKind");
			}
			if (!payloadRecord.kind) {
				if (normalizeOptionalString(payloadRecord.message)) {
					payloadRecord.kind = "agentTurn";
					mutated = true;
					trackIssue("legacyPayloadKind");
				} else if (normalizeOptionalString(payloadRecord.text)) {
					payloadRecord.kind = "systemEvent";
					mutated = true;
					trackIssue("legacyPayloadKind");
				}
			}
			if (payloadRecord.kind === "agentTurn" && copyTopLevelAgentTurnFields(raw, payloadRecord)) mutated = true;
			if (payloadRecord.kind === "systemEvent" && !normalizeOptionalString(payloadRecord.text)) {
				const message = normalizeOptionalString(payloadRecord.message);
				if (message) {
					payloadRecord.text = message;
					delete payloadRecord.message;
					mutated = true;
					trackIssue("legacyPayloadKind");
				}
			}
		}
		const removedTopLevel = stripLegacyTopLevelFields(raw);
		if (removedTopLevel.payload || removedTopLevel.delivery) {
			mutated = true;
			if (removedTopLevel.payload) trackIssue("legacyTopLevelPayloadFields");
			if (removedTopLevel.delivery) trackIssue("legacyTopLevelDeliveryFields");
		}
		if (payloadRecord) {
			if (Array.isArray(payloadRecord.toolsAllow) && payloadRecord.toolsAllow.some((tool) => typeof tool === "string" && normalizeOptionalLowercaseString(tool) === "gateway_exec")) {
				const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
				if (name) legacyGatewayExecJobs.push(name);
			}
			const hadLegacyPayloadProvider = Boolean(normalizeOptionalString(payloadRecord.provider));
			const hadLegacyTaskSuggestionToolName = hasLegacyToolNameList(payloadRecord.toolsAllow, TASK_SUGGESTION_TOOL_NAME_MIGRATION);
			const hadLegacyImageInspectionToolName = hasLegacyToolNameList(payloadRecord.toolsAllow, IMAGE_INSPECTION_TOOL_NAME_MIGRATION);
			const legacyCodexModelRoutes = collectLegacyOpenAICodexCronModelRoutes(payloadRecord);
			const hadLegacyPayloadCodexModel = legacyCodexModelRoutes.length > 0;
			const agentId = normalizeOptionalString(raw.agentId);
			const shouldMigrateCodexModelRef = (modelRef, legacyModelRef) => options.shouldMigrateCodexRuntimePolicyTarget?.({
				...agentId ? { agentId } : {},
				modelRef,
				legacyModelRef
			}) !== false;
			if (hadLegacyPayloadCodexModel) trackIssue("legacyPayloadCodexModel");
			if (hadLegacyTaskSuggestionToolName) trackIssue("legacyTaskSuggestionToolName");
			if (hadLegacyImageInspectionToolName) trackIssue("legacyImageInspectionToolName");
			if (migrateLegacyCronPayload(payloadRecord, {
				migrateCodexModelRefs: options.migrateCodexModelRefs,
				shouldMigrateCodexModelRef
			})) {
				mutated = true;
				if (hadLegacyPayloadProvider) trackIssue("legacyPayloadProvider");
			}
			if (hadLegacyPayloadCodexModel && options.migrateCodexModelRefs === true) for (const route of legacyCodexModelRoutes) {
				const target = {
					...agentId ? { agentId } : {},
					modelRef: route.canonicalModelRef,
					legacyModelRef: route.legacyModelRef
				};
				if (shouldMigrateCodexModelRef(route.canonicalModelRef, route.legacyModelRef)) codexRuntimePolicyTargets.set(cronCodexRuntimePolicyTargetKey(target), target);
			}
			if (migrateLegacyAgentTurnCommandPayload(payloadRecord)) {
				mutated = true;
				trackIssue("legacyAgentTurnCommandPayload");
			} else {
				const unresolvedPromptKind = classifyCronAgentTurnShellPrompt(payloadRecord);
				if (unresolvedPromptKind) {
					trackIssue("unresolvedAgentTurnShellToolPrompt");
					const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
					if (name) unresolvedAgentTurnPromptJobsByKind[unresolvedPromptKind].push(name);
				}
			}
		}
		const sched = raw.schedule;
		if (isRecord(sched)) {
			const kind = normalizeOptionalLowercaseString(sched.kind) ?? "";
			const canonicalKind = kind === "at" || kind === "every" || kind === "cron" || kind === "on-exit" || kind === "stream" ? kind : void 0;
			if (canonicalKind && sched.kind !== canonicalKind) {
				sched.kind = canonicalKind;
				mutated = true;
				trackIssue("legacyScheduleKind");
			}
			if (canonicalKind === "stream") {
				const streamMode = normalizeOptionalLowercaseString(sched.mode);
				if ((streamMode === "line" || streamMode === "match") && sched.mode !== streamMode) {
					sched.mode = streamMode;
					mutated = true;
					trackIssue("legacyScheduleKind");
				}
			}
			if (!kind && ("at" in sched || "atMs" in sched)) {
				sched.kind = "at";
				mutated = true;
			}
			const atRaw = normalizeOptionalString(sched.at) ?? "";
			const atMsRaw = sched.atMs;
			const parsedAtMs = typeof atMsRaw === "number" ? atMsRaw : typeof atMsRaw === "string" ? parseAbsoluteTimeMs(atMsRaw) : atRaw ? parseAbsoluteTimeMs(atRaw) : null;
			const parsedAt = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
			const fallbackAtMs = !parsedAt && atRaw ? parseAbsoluteTimeMs(atRaw) : null;
			const fallbackAt = fallbackAtMs !== null ? timestampMsToIsoString(fallbackAtMs) : void 0;
			const normalizedAt = parsedAt ?? fallbackAt;
			if (normalizedAt && (sched.at !== normalizedAt || "atMs" in sched)) {
				sched.at = normalizedAt;
				if ("atMs" in sched) delete sched.atMs;
				mutated = true;
			}
			const everyMsRaw = sched.everyMs;
			const everyMsCoerced = coerceFiniteScheduleNumber(everyMsRaw);
			const everyMs = everyMsCoerced !== void 0 ? Math.floor(everyMsCoerced) : null;
			if (everyMs !== null && everyMsRaw !== everyMs) {
				sched.everyMs = everyMs;
				mutated = true;
			}
			if (sched.kind === "every" && everyMs !== null) {
				const anchorRaw = sched.anchorMs;
				const anchorCoerced = coerceFiniteScheduleNumber(anchorRaw);
				const normalizedAnchor = anchorCoerced !== void 0 ? Math.max(0, Math.floor(anchorCoerced)) : typeof raw.createdAtMs === "number" && Number.isFinite(raw.createdAtMs) ? Math.max(0, Math.floor(raw.createdAtMs)) : typeof raw.updatedAtMs === "number" && Number.isFinite(raw.updatedAtMs) ? Math.max(0, Math.floor(raw.updatedAtMs)) : null;
				if (normalizedAnchor !== null && anchorRaw !== normalizedAnchor) {
					sched.anchorMs = normalizedAnchor;
					mutated = true;
				}
			}
			const exprRaw = normalizeOptionalString(sched.expr) ?? "";
			const legacyCronRaw = normalizeOptionalString(sched.cron) ?? "";
			let normalizedExpr = exprRaw;
			if (!normalizedExpr && legacyCronRaw) {
				normalizedExpr = legacyCronRaw;
				sched.expr = normalizedExpr;
				mutated = true;
				trackIssue("legacyScheduleCron");
			}
			if (typeof sched.expr === "string" && sched.expr !== normalizedExpr) {
				sched.expr = normalizedExpr;
				mutated = true;
			}
			if ("cron" in sched) {
				delete sched.cron;
				mutated = true;
				trackIssue("legacyScheduleCron");
			}
			if (sched.kind === "cron" && normalizedExpr) {
				const explicitStaggerMs = normalizeCronStaggerMs(sched.staggerMs);
				const defaultStaggerMs = resolveDefaultCronStaggerMs(normalizedExpr);
				const targetStaggerMs = explicitStaggerMs ?? defaultStaggerMs;
				if (targetStaggerMs === void 0) {
					if ("staggerMs" in sched) {
						delete sched.staggerMs;
						mutated = true;
					}
				} else if (sched.staggerMs !== targetStaggerMs) {
					sched.staggerMs = targetStaggerMs;
					mutated = true;
				}
			}
		}
		const delivery = asNullableRecord(raw.delivery);
		if (delivery) {
			const mode = resolveLegacyCronDeliveryMode(delivery.mode);
			if (mode !== void 0 && mode !== delivery.mode) {
				delivery.mode = mode;
				mutated = true;
				trackIssue("legacyDeliveryMode");
			}
		}
		if (isRecord(raw.isolation)) {
			delete raw.isolation;
			mutated = true;
		}
		const payloadKind = payloadRecord && typeof payloadRecord.kind === "string" ? payloadRecord.kind : "";
		const isRunnablePayload = payloadKind === "agentTurn" || payloadKind === "command" || payloadKind === "script";
		const rawSessionTarget = normalizeOptionalString(raw.sessionTarget) ?? "";
		const loweredSessionTarget = normalizeLowercaseStringOrEmpty(rawSessionTarget);
		if (loweredSessionTarget === "main" || loweredSessionTarget === "isolated" || loweredSessionTarget === "current") {
			const sessionTarget = resolveCronCurrentSessionTarget({
				sessionTarget: loweredSessionTarget,
				sessionKey: normalizeOptionalString(raw.sessionKey)
			});
			if (raw.sessionTarget !== sessionTarget) {
				raw.sessionTarget = sessionTarget;
				mutated = true;
			}
		} else if (loweredSessionTarget.startsWith("session:")) {
			const customSessionId = rawSessionTarget.slice(8).trim();
			if (customSessionId) {
				const normalizedSessionTarget = `session:${customSessionId}`;
				if (raw.sessionTarget !== normalizedSessionTarget) {
					raw.sessionTarget = normalizedSessionTarget;
					mutated = true;
				}
			}
		} else {
			const inferredSessionTarget = isRunnablePayload ? "isolated" : "main";
			if (raw.sessionTarget !== inferredSessionTarget) {
				raw.sessionTarget = inferredSessionTarget;
				mutated = true;
			}
		}
		const sessionTarget = normalizeOptionalLowercaseString(raw.sessionTarget) ?? "";
		const isIsolatedTarget = sessionTarget === "isolated" || sessionTarget === "current" || sessionTarget.startsWith("session:");
		const normalizedLegacy = normalizeLegacyDeliveryInput({
			delivery,
			payload: payloadRecord
		});
		if (!delivery && isIsolatedTarget && isRunnablePayload) {
			raw.delivery = normalizedLegacy.delivery ?? { mode: "announce" };
			mutated = true;
		} else if (normalizedLegacy.mutated && normalizedLegacy.delivery) {
			raw.delivery = normalizedLegacy.delivery;
			mutated = true;
		}
		const scheduledPolicyMutated = scheduledToolPolicyMigrations.migrate(raw, (kind) => trackIssue(kind === "owner" ? "reconciledOwnerAccount" : "migratedScheduledToolPolicy"));
		mutated ||= scheduledPolicyMutated;
		const invalidPersistedReason = getInvalidPersistedCronJobReason(raw);
		if (invalidPersistedReason) {
			if (invalidPersistedReason === "missing-schedule" || invalidPersistedReason === "invalid-schedule") trackIssue("invalidSchedule");
			else if (invalidPersistedReason === "missing-payload" || invalidPersistedReason === "invalid-payload") trackIssue("invalidPayload");
			removedJobs.push({
				job: structuredClone(raw),
				reason: invalidPersistedReason,
				sourceIndex
			});
			mutated = true;
			continue;
		}
		keptJobs.push(raw);
	}
	if (keptJobs.length !== jobs.length) jobs.splice(0, jobs.length, ...keptJobs);
	return {
		codexRuntimePolicyTargets: [...codexRuntimePolicyTargets.values()],
		issues,
		unresolvedAgentTurnCommandPromptJobs,
		unresolvedAgentTurnShellToolPromptJobs,
		legacyTriggerScriptJobs,
		unsupportedLegacyTriggerScriptJobs,
		unsupportedDeliveryModeJobs,
		legacyScheduledToolPolicyJobs: scheduledToolPolicyMigrations.legacyJobs,
		invalidScheduledToolPolicyJobs: scheduledToolPolicyMigrations.invalidJobs,
		legacyGatewayExecJobs,
		jobs,
		mutated,
		removedJobs
	};
}
function restoredCronJobId(job) {
	return normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId);
}
/** Revalidate quarantined schedule rows for an explicit Doctor repair. */
function recoverValidQuarantinedCronScheduleJobs(entries, activeJobIds) {
	const recoveredJobs = [];
	const recoveredEntries = [];
	const retainedEntries = [];
	const recoveredJobIds = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		if (entry.reason !== "invalid-schedule" || !isRecord(entry.job)) {
			retainedEntries.push(entry);
			continue;
		}
		const candidate = structuredClone(entry.job);
		const jobId = restoredCronJobId(candidate);
		if (jobId && (activeJobIds.has(jobId) || recoveredJobIds.has(jobId))) {
			retainedEntries.push(entry);
			continue;
		}
		if (isRecord(entry.state)) candidate.state = structuredClone(entry.state);
		if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) candidate.updatedAtMs = entry.updatedAtMs;
		const normalized = normalizeStoredCronJobs([candidate]);
		if (normalized.jobs.length !== 1 || normalized.removedJobs.length !== 0) {
			retainedEntries.push(entry);
			continue;
		}
		recoveredJobs.push(candidate);
		recoveredEntries.push(entry);
		if (jobId) recoveredJobIds.add(jobId);
	}
	return {
		recoveredJobs,
		recoveredEntries,
		retainedEntries
	};
}
//#endregion
export { recoverValidQuarantinedCronScheduleJobs as a, normalizeStoredCronJobs as i, collectStoredCronCodexRuntimePolicyTargets as n, cronCodexRuntimePolicyTargetKey as r, canRepairCronDeliveryForDoctor as t };
