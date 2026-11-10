import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { Lt as boolean } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { D as parseSessionDeliveryRoute, M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { g as toCanonicalOpenAIModelRef } from "./codex-route-model-ref-2IYegA3O.mjs";
import { a as migrateLegacyToolNameList, i as hasLegacyToolNameList, n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-v0htBo47.mjs";
import { i as normalizeCronScheduledToolPolicy, s as resolveCronScheduledToolPolicy, t as createAccountCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { n as cronJobUsesToolRuntime } from "./tools-allow-BHyxEpHd.mjs";
import { i as resolveCronCurrentSessionTarget } from "./session-target-d98pYOqN.mjs";
import { n as parseCodeModeScriptSyntax, t as buildCodeModeScriptParseSource } from "./code-mode-script-syntax-DZwdESO8.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { n as getInvalidPersistedCronJobReason } from "./persisted-shape-CJCxeJAv.mjs";
import { c as parseOptionalField, i as LowercaseNonEmptyStringFieldSchema, o as TrimmedNonEmptyStringFieldSchema, r as DeliveryThreadIdFieldSchema, t as inferCronJobName } from "./normalize-CgAHjzjT.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-Dx0UqxJq.mjs";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-BWhos2vh.mjs";
import { n as hasCronShellToolAccess, r as parseCronAgentTurnCommandPrompt, t as classifyCronAgentTurnShellPrompt } from "./agent-turn-command-prompt-De79onH6.mjs";
import { randomUUID } from "node:crypto";
import { tokenizer } from "acorn";
//#region src/commands/doctor/cron/legacy-delivery.ts
/** Normalize delivery and strip consumed legacy delivery fields from the payload. */
function normalizeLegacyDeliveryInput(params) {
	const { payload } = params;
	const hints = payload ? {
		deliver: parseOptionalField(boolean(), payload.deliver),
		bestEffortDeliver: parseOptionalField(boolean(), payload.bestEffortDeliver),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.channel),
		provider: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.provider),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, payload.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema.transform((value) => String(value)), payload.threadId)
	} : void 0;
	if (!payload || !hints || !Object.values(hints).some((value) => value !== void 0)) return {
		delivery: params.delivery ?? void 0,
		mutated: false
	};
	const next = {
		...params.delivery,
		mode: hints.deliver === false ? "none" : "announce"
	};
	if (hints.channel ?? hints.provider) next.channel = hints.channel ?? hints.provider;
	for (const key of ["to", "threadId"]) if (hints[key]) next[key] = hints[key];
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
	let kind = raw === "agentturn" ? "agentTurn" : raw === "systemevent" ? "systemEvent" : void 0;
	if (!payload.kind) kind = normalizeOptionalString(payload.message) ? "agentTurn" : normalizeOptionalString(payload.text) ? "systemEvent" : void 0;
	if (!kind || payload.kind === kind) return false;
	payload.kind = kind;
	return true;
}
function inferPayloadIfMissing(raw) {
	const message = normalizeOptionalString(raw.message);
	const text = normalizeOptionalString(raw.text) ?? normalizeOptionalString(raw.command);
	if (!message && !text) return false;
	raw.payload = message ? {
		kind: "agentTurn",
		message
	} : {
		kind: "systemEvent",
		text
	};
	return true;
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
	const copyField = (field, type) => {
		const value = type === "string" ? normalizeOptionalString(raw[field]) : raw[field];
		if (typeof payload[field] !== type && typeof value === type) {
			payload[field] = value;
			mutated = true;
		}
	};
	copyField("allowUnsafeExternalContent", "boolean");
	copyField("deliver", "boolean");
	copyField("channel", "string");
	copyField("to", "string");
	const rawThreadId = normalizeOptionalString(raw.threadId);
	if (!("threadId" in payload) && (typeof raw.threadId === "number" && Number.isFinite(raw.threadId) || Boolean(rawThreadId))) {
		payload.threadId = rawThreadId ?? raw.threadId;
		mutated = true;
	}
	copyField("bestEffortDeliver", "boolean");
	copyField("provider", "string");
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
function migrateLegacyOpenAICodexModelRefs(payload, shouldMigrate) {
	let mutated = false;
	const migrateRef = (value) => {
		const route = readLegacyOpenAICodexCronModelRoute(value);
		return route && shouldMigrate(route.canonicalModelRef, route.legacyModelRef) ? route.canonicalModelRef : void 0;
	};
	const model = migrateRef(payload.model);
	if (model !== void 0 && payload.model !== model) {
		payload.model = model;
		mutated = true;
	}
	const fallbacks = payload.fallbacks;
	if (Array.isArray(fallbacks)) {
		const next = fallbacks.map((fallback) => migrateRef(fallback) ?? fallback);
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
	const timeout = payload.timeoutSeconds;
	const timeoutSeconds = typeof timeout === "number" && Number.isFinite(timeout) && timeout > 0 ? Math.floor(timeout) : parsed.timeoutSeconds;
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
/** Recovers only account authority proven by immutable persisted owner identity. */
function migrateScheduledToolPolicy(raw) {
	const payload = asOptionalRecord(raw.payload);
	if (!cronJobUsesToolRuntime({
		payload,
		trigger: asOptionalRecord(raw.trigger)
	})) return {
		mutated: false,
		status: "not-applicable"
	};
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
	const parsedSession = ownerSessionKey ? parseAgentSessionKey(ownerSessionKey) : void 0;
	if (!ownerSessionKey || !parsedSession) return {
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
function isNamedMember(node, name) {
	return node?.type === "MemberExpression" && !node.computed && node.property.type === "Identifier" && node.property.name === name;
}
function legacyToolCall(node) {
	if (node.type !== "CallExpression") return;
	const callee = node.callee;
	if (!isNamedMember(callee, "call") || callee.optional || callee.object.type !== "Identifier" || callee.object.name !== "tools" || node.optional || node.arguments.length !== 2) return;
	const [toolName, args] = node.arguments;
	return toolName?.type === "Literal" && toolName.value === "exec" && args?.type === "ObjectExpression" && args.properties.every((property) => property.type === "Property" && property.kind === "init" && !property.computed && !property.method) ? {
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
			if (!awaited || declaration?.type !== "VariableDeclaration" || declaration.kind !== "const" || declaration.declarations.length !== 1 || statement !== body || owner.id.type !== "Identifier" || owner.init !== expression || owner.id.name === "exec" || bindings.has(owner.id.name)) return { kind: "unsupported" };
			bindings.set(owner.id.name, owner.id);
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
		const details = ancestors.at(-2);
		if (!isNamedMember(parent, "result") || parent.object !== node || !isNamedMember(details, "details") || details.object !== parent) return { kind: "unsupported" };
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
function collectStoredCronCodexRuntimePolicyTargets(jobs) {
	const targets = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		const agentId = normalizeOptionalString(job.agentId);
		const routes = [...collectLegacyOpenAICodexCronModelRoutes(isRecord(job.payload) ? job.payload : {}), ...collectLegacyOpenAICodexCronModelRoutes({ model: job.model })];
		for (const route of routes) {
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
	const legacyScheduledToolPolicyJobs = [];
	const invalidScheduledToolPolicyJobs = [];
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
			unsupportedDeliveryModeJobs.push(storedCronJobId(raw) ?? "<unnamed>");
			keptJobs.push(raw);
			continue;
		}
		const jobIssues = /* @__PURE__ */ new Set();
		const trackIssue = (key) => {
			if (jobIssues.has(key)) return;
			jobIssues.add(key);
			issues[key] = (issues[key] ?? 0) + 1;
		};
		const trackChange = (key) => {
			mutated = true;
			trackIssue(key);
		};
		const setField = (record, key, value) => {
			if (record[key] !== value) {
				record[key] = value;
				mutated = true;
			}
		};
		const identityMutated = normalizeStoredCronJobIdentity(raw, trackIssue);
		mutated ||= identityMutated;
		if (!isRecord(raw.state)) setField(raw, "state", {});
		if (typeof raw.schedule === "string") {
			setField(raw, "schedule", {
				kind: "cron",
				expr: raw.schedule.trim()
			});
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
		if (isRecord(trigger) && typeof trigger.script === "string") {
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
		setField(raw, "description", normalizeOptionalString(raw.description));
		if ("sessionKey" in raw) setField(raw, "sessionKey", normalizeOptionalString(raw.sessionKey));
		if (typeof raw.enabled !== "boolean") setField(raw, "enabled", true);
		setField(raw, "wakeMode", normalizeOptionalLowercaseString(raw.wakeMode) === "next-heartbeat" ? "next-heartbeat" : "now");
		if (!isRecord(raw.payload) && inferPayloadIfMissing(raw)) trackChange("legacyTopLevelPayloadFields");
		const payloadRecord = asNullableRecord(raw.payload);
		if (payloadRecord) {
			if (normalizePayloadKind(payloadRecord)) trackChange("legacyPayloadKind");
			if (payloadRecord.kind === "agentTurn" && copyTopLevelAgentTurnFields(raw, payloadRecord)) mutated = true;
			if (payloadRecord.kind === "systemEvent" && !normalizeOptionalString(payloadRecord.text)) {
				const message = normalizeOptionalString(payloadRecord.message);
				if (message) {
					payloadRecord.text = message;
					delete payloadRecord.message;
					trackChange("legacyPayloadKind");
				}
			}
		}
		const removedTopLevel = stripLegacyTopLevelFields(raw);
		if (removedTopLevel.payload) trackChange("legacyTopLevelPayloadFields");
		if (removedTopLevel.delivery) trackChange("legacyTopLevelDeliveryFields");
		if (payloadRecord) {
			if (Array.isArray(payloadRecord.toolsAllow) && payloadRecord.toolsAllow.some((tool) => typeof tool === "string" && normalizeOptionalLowercaseString(tool) === "gateway_exec")) {
				const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
				if (name) legacyGatewayExecJobs.push(name);
			}
			const hadLegacyPayloadProvider = Boolean(normalizeOptionalString(payloadRecord.provider));
			const legacyCodexModelRoutes = collectLegacyOpenAICodexCronModelRoutes(payloadRecord);
			const hadLegacyPayloadCodexModel = legacyCodexModelRoutes.length > 0;
			const agentId = normalizeOptionalString(raw.agentId);
			const shouldMigrateCodexModelRef = (modelRef, legacyModelRef) => options.shouldMigrateCodexRuntimePolicyTarget?.({
				...agentId ? { agentId } : {},
				modelRef,
				legacyModelRef
			}) !== false;
			if (hadLegacyPayloadCodexModel) trackIssue("legacyPayloadCodexModel");
			for (const [issue, migration] of [["legacyTaskSuggestionToolName", TASK_SUGGESTION_TOOL_NAME_MIGRATION], ["legacyImageInspectionToolName", IMAGE_INSPECTION_TOOL_NAME_MIGRATION]]) if (hasLegacyToolNameList(payloadRecord.toolsAllow, migration)) trackIssue(issue);
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
			if (migrateLegacyAgentTurnCommandPayload(payloadRecord)) trackChange("legacyAgentTurnCommandPayload");
			else {
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
			const canonicalKind = [
				"at",
				"every",
				"cron",
				"on-exit",
				"stream"
			].includes(kind) ? kind : void 0;
			if (canonicalKind && sched.kind !== canonicalKind) {
				sched.kind = canonicalKind;
				trackChange("legacyScheduleKind");
			}
			if (canonicalKind === "stream") {
				const streamMode = normalizeOptionalLowercaseString(sched.mode);
				if ((streamMode === "line" || streamMode === "match") && sched.mode !== streamMode) {
					sched.mode = streamMode;
					trackChange("legacyScheduleKind");
				}
			}
			if (!kind && ("at" in sched || "atMs" in sched)) {
				sched.kind = "at";
				mutated = true;
			}
			const atMsRaw = sched.atMs;
			const parsedAtMs = typeof atMsRaw === "number" ? atMsRaw : typeof atMsRaw === "string" ? parseAbsoluteTimeMs(atMsRaw) : null;
			const normalizedAt = timestampMsToIsoString(parsedAtMs) ?? timestampMsToIsoString(parseAbsoluteTimeMs(normalizeOptionalString(sched.at) ?? ""));
			if (normalizedAt && (sched.at !== normalizedAt || "atMs" in sched)) {
				sched.at = normalizedAt;
				delete sched.atMs;
				mutated = true;
			}
			const everyMsCoerced = coerceFiniteScheduleNumber(sched.everyMs);
			const everyMs = everyMsCoerced !== void 0 ? Math.floor(everyMsCoerced) : null;
			if (everyMs !== null) setField(sched, "everyMs", everyMs);
			if (sched.kind === "every" && everyMs !== null) {
				const anchor = coerceFiniteScheduleNumber(sched.anchorMs) ?? asFiniteNumber(raw.createdAtMs) ?? asFiniteNumber(raw.updatedAtMs);
				if (anchor !== void 0) setField(sched, "anchorMs", Math.max(0, Math.floor(anchor)));
			}
			const exprRaw = normalizeOptionalString(sched.expr) ?? "";
			const normalizedExpr = exprRaw || normalizeOptionalString(sched.cron) || "";
			if (!exprRaw && normalizedExpr) {
				sched.expr = normalizedExpr;
				trackChange("legacyScheduleCron");
			}
			if (typeof sched.expr === "string") setField(sched, "expr", normalizedExpr);
			if ("cron" in sched) {
				delete sched.cron;
				trackChange("legacyScheduleCron");
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
				} else setField(sched, "staggerMs", targetStaggerMs);
			}
		}
		const delivery = asNullableRecord(raw.delivery);
		if (delivery) {
			const mode = resolveLegacyCronDeliveryMode(delivery.mode);
			if (mode !== void 0 && mode !== delivery.mode) {
				delivery.mode = mode;
				trackChange("legacyDeliveryMode");
			}
		}
		if (isRecord(raw.isolation)) {
			delete raw.isolation;
			mutated = true;
		}
		const payloadKind = payloadRecord?.kind;
		const isRunnablePayload = payloadKind === "agentTurn" || payloadKind === "command" || payloadKind === "script";
		const rawSessionTarget = normalizeOptionalString(raw.sessionTarget) ?? "";
		const loweredSessionTarget = normalizeLowercaseStringOrEmpty(rawSessionTarget);
		if (loweredSessionTarget === "main" || loweredSessionTarget === "isolated" || loweredSessionTarget === "current") setField(raw, "sessionTarget", resolveCronCurrentSessionTarget({
			sessionTarget: loweredSessionTarget,
			sessionKey: normalizeOptionalString(raw.sessionKey)
		}));
		else if (loweredSessionTarget.startsWith("session:")) {
			const customSessionId = rawSessionTarget.slice(8).trim();
			if (customSessionId) setField(raw, "sessionTarget", `session:${customSessionId}`);
		} else setField(raw, "sessionTarget", isRunnablePayload ? "isolated" : "main");
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
		const policyMigration = migrateScheduledToolPolicy(raw);
		if (policyMigration.status === "migrated") trackIssue("migratedScheduledToolPolicy");
		if (policyMigration.ownerReconciled) trackIssue("reconciledOwnerAccount");
		const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
		if (jobName && policyMigration.status === "legacy") legacyScheduledToolPolicyJobs.push(jobName);
		else if (jobName && policyMigration.status === "invalid") invalidScheduledToolPolicyJobs.push(jobName);
		mutated ||= policyMigration.mutated;
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
		legacyScheduledToolPolicyJobs,
		invalidScheduledToolPolicyJobs,
		legacyGatewayExecJobs,
		jobs,
		mutated,
		removedJobs
	};
}
function storedCronJobId(job) {
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
		const jobId = storedCronJobId(candidate);
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
