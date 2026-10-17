import { t as hasNonEmptyString } from "../string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "../number-coercion-CuVhdCBs.mjs";
import { o as resolveAgentEntry } from "../agent-scope-config-CDYpzA0r.mjs";
import { l as resolveExecModePolicy } from "../exec-approvals-core-s7tTQC_a.mjs";
import { n as createCorePluginStateSyncKeyedStore } from "../plugin-state-store-yKq-W0-T.mjs";
import "../exec-approvals-B1rZTeax.mjs";
import { a as isPersistentSystemAgentOperation, i as formatSystemAgentPersistentPlan, o as parseSystemAgentOperation } from "../operations-parse-BH-EPBYS.mjs";
import { t as listAgentRoles } from "../agent-roles-DcAkXaUx.mjs";
import { t as executeSystemAgentOperation } from "../operations-9NkJbThA.mjs";
import { t as classifySystemAgentApprovalText } from "../operator-approval-CFy1cqwo.mjs";
import { createHash } from "node:crypto";
//#region src/system-agent/rescue-policy.ts
function resolveScopedExecConfig(cfg, agentId) {
	return agentId ? resolveAgentEntry(cfg, agentId)?.tools?.exec : void 0;
}
function resolveScopedSandboxMode(cfg, agentId) {
	return (agentId ? resolveAgentEntry(cfg, agentId)?.sandbox?.mode : void 0) ?? cfg.agents?.defaults?.sandbox?.mode ?? "off";
}
function isYoloHostPosture(cfg, agentId) {
	const scopedExec = resolveScopedExecConfig(cfg, agentId);
	const globalExec = cfg.tools?.exec;
	const inherited = resolveExecModePolicy({
		mode: globalExec?.mode,
		security: globalExec?.security ?? "full",
		ask: globalExec?.ask ?? "off"
	});
	return resolveExecModePolicy({
		mode: scopedExec?.mode,
		security: scopedExec?.security ?? inherited.security,
		ask: scopedExec?.ask ?? inherited.ask
	}).mode === "full";
}
/** Decide whether a message-channel rescue command is allowed for this sender/context. */
function resolveSystemAgentRescuePolicy(input) {
	const ownerDmOnly = true;
	const pendingTtlMinutes = 15;
	const sandboxActive = resolveScopedSandboxMode(input.cfg, input.agentId) !== "off";
	const yolo = !sandboxActive && isYoloHostPosture(input.cfg, input.agentId);
	const enabled = yolo;
	const denied = {
		allowed: false,
		enabled,
		ownerDmOnly,
		pendingTtlMinutes,
		yolo,
		sandboxActive
	};
	if (sandboxActive) return {
		...denied,
		reason: "sandbox-active",
		message: "OpenClaw rescue is blocked because OpenClaw sandboxing is active. Fix the install locally or disable sandboxing before using remote rescue."
	};
	if (!enabled) return {
		...denied,
		reason: "disabled",
		message: "OpenClaw rescue requires YOLO host posture with sandboxing off."
	};
	if (!input.senderIsOwner) return {
		...denied,
		reason: "not-owner",
		message: "OpenClaw rescue only accepts commands from an OpenClaw owner."
	};
	if (!input.isDirectMessage) return {
		...denied,
		reason: "not-direct-message",
		message: "OpenClaw rescue is restricted to owner DMs by default."
	};
	return {
		allowed: true,
		enabled: true,
		ownerDmOnly,
		pendingTtlMinutes,
		yolo: true,
		sandboxActive: false
	};
}
//#endregion
//#region src/system-agent/rescue-message.ts
const SYSTEM_AGENT_COMMAND = "/openclaw";
const RESCUE_PENDING_NAMESPACE = "rescue-pending";
const RESCUE_PENDING_MAX_ENTRIES = 1024;
const RESCUE_OPERATION_FIELDS = /* @__PURE__ */ new Map([
	["set-default-model", {
		required: ["model"],
		optional: ["agentId"]
	}],
	["config-set", { required: ["path", "value"] }],
	["config-set-ref", {
		required: [
			"path",
			"source",
			"id"
		],
		optional: ["provider"]
	}],
	["setup", { optional: ["workspace", "model"] }],
	["plugin-install", { required: ["spec"] }],
	["create-agent", {
		required: ["agentId"],
		optional: [
			"name",
			"purpose",
			"workspace",
			"model",
			"role"
		]
	}],
	["create-team", { optional: [
		"coordinatorId",
		"prefix",
		"workspaceRoot"
	] }],
	["gateway-start", {}],
	["gateway-stop", {}],
	["gateway-restart", {}]
]);
function createCaptureRuntime() {
	const lines = [];
	const push = (...args) => {
		lines.push(args.map((arg) => typeof arg === "string" ? arg : JSON.stringify(arg)).join(" "));
	};
	return {
		runtime: {
			log: push,
			error: push,
			exit: (code) => {
				throw new Error(`OpenClaw operation exited with code ${code}`);
			}
		},
		read: () => lines.join("\n").trim()
	};
}
/** Extract the command body after `/openclaw`, or null when the message is not for rescue. */
function extractSystemAgentRescueMessage(commandBody) {
	const normalized = commandBody.trim();
	const lower = normalized.toLowerCase();
	if (lower !== SYSTEM_AGENT_COMMAND && !lower.startsWith(`${SYSTEM_AGENT_COMMAND} `)) return null;
	return normalized.slice(9).trim();
}
function resolvePendingKey(input) {
	const key = JSON.stringify({
		accountId: resolveAccountDiscriminator(input.command),
		channel: input.command.channelId ?? input.command.channel,
		from: input.command.from,
		senderId: input.command.senderId
	});
	return createHash("sha256").update(key).digest("hex").slice(0, 32);
}
function resolveAccountDiscriminator(command) {
	return command.accountId?.trim() || command.to?.trim() || "default";
}
function openPendingStore(env) {
	return createCorePluginStateSyncKeyedStore({
		ownerId: "core:system-agent",
		namespace: RESCUE_PENDING_NAMESPACE,
		maxEntries: RESCUE_PENDING_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function isPlainRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}
function hasOperationFields(value, required = [], optional = []) {
	const allowed = /* @__PURE__ */ new Set([
		"kind",
		...required,
		...optional
	]);
	return Object.hasOwn(value, "kind") && required.every((key) => Object.hasOwn(value, key) && hasNonEmptyString(value[key])) && optional.every((key) => key === "role" ? value.role === void 0 || listAgentRoles().some((role) => role === value.role) : !Object.hasOwn(value, key) || hasNonEmptyString(value[key])) && Object.keys(value).every((key) => allowed.has(key));
}
function parsePendingOperation(value) {
	if (!isPlainRecord(value) || value.version !== 1 || !isPlainRecord(value.operation)) return null;
	const operation = value.operation;
	if (typeof operation.kind !== "string") return null;
	const fields = RESCUE_OPERATION_FIELDS.get(operation.kind);
	if (!fields || !hasOperationFields(operation, fields.required, fields.optional)) return null;
	if (operation.kind === "config-set-ref" && operation.source !== "env" && operation.source !== "file" && operation.source !== "exec" && operation.source !== "store") return null;
	return isPersistentSystemAgentOperation(operation) ? operation : null;
}
function buildAuditDetails(input) {
	return {
		rescue: true,
		channel: input.command.channelId ?? input.command.channel,
		accountId: resolveAccountDiscriminator(input.command),
		senderId: input.command.senderId,
		from: input.command.from
	};
}
function formatPersistentPlan(operation) {
	return formatSystemAgentPersistentPlan(operation).replace("Say yes to apply.", "Reply /openclaw yes to apply.");
}
function formatUnsupportedRemoteOperation(operation) {
	if (operation.kind === "open-tui") return ["OpenClaw rescue cannot open the local TUI from a message channel.", "Use local `openclaw` for agent handoff, or ask for status, doctor, config, gateway, agents, or models."].join(" ");
	if (operation.kind === "channel-setup") return ["OpenClaw rescue cannot host the interactive channel setup from a message channel.", "Run `openclaw setup` locally and say `connect " + operation.channel + "` instead."].join(" ");
	if (operation.kind === "config-unset") return ["OpenClaw rescue cannot remove configuration settings.", "Ask your regular agent to remove the setting, or run `openclaw config unset <path>` locally."].join(" ");
	if (operation.kind === "doctor-fix") return ["OpenClaw rescue cannot run doctor repairs from a message channel because they can change the inference route powering this session.", "On the machine running OpenClaw, with OpenClaw stopped, run `openclaw doctor --fix`."].join(" ");
	if (operation.kind === "plugin-install") return ["OpenClaw rescue cannot install plugins from a message channel by default because plugin install downloads executable code.", "Use local `openclaw setup` or `openclaw plugins install` instead."].join(" ");
	return null;
}
/** Process one rescue message and return a reply, or null when not a rescue command. */
async function runSystemAgentRescueMessage(input) {
	const rescueMessage = extractSystemAgentRescueMessage(input.commandBody);
	if (rescueMessage === null) return null;
	const policy = resolveSystemAgentRescuePolicy({
		cfg: input.cfg,
		agentId: input.agentId,
		senderIsOwner: input.command.senderIsOwner,
		isDirectMessage: !input.isGroup
	});
	if (!policy.allowed) return policy.message;
	const pendingStore = openPendingStore(input.env);
	const pendingKey = resolvePendingKey(input);
	const approvalIntent = classifySystemAgentApprovalText(rescueMessage);
	if (approvalIntent === "approve") {
		const operation = parsePendingOperation(pendingStore.consume(pendingKey));
		if (!operation) return "No pending OpenClaw rescue change is waiting for approval.";
		const unsupported = formatUnsupportedRemoteOperation(operation);
		if (unsupported) return unsupported;
		const capture = createCaptureRuntime();
		await executeSystemAgentOperation(operation, capture.runtime, {
			approved: true,
			auditDetails: buildAuditDetails(input),
			deps: input.deps
		});
		return capture.read() || "OpenClaw rescue change applied.";
	}
	if (approvalIntent === "decline") return parsePendingOperation(pendingStore.consume(pendingKey)) ? "Dropped the pending OpenClaw rescue change." : "No pending OpenClaw rescue change is waiting for approval.";
	pendingStore.delete(pendingKey);
	const operation = parseSystemAgentOperation(rescueMessage);
	const unsupported = formatUnsupportedRemoteOperation(operation);
	if (unsupported) return unsupported;
	if (isPersistentSystemAgentOperation(operation)) {
		const nowMs = asDateTimestampMs((/* @__PURE__ */ new Date()).getTime());
		const expiresAtMs = nowMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(policy.pendingTtlMinutes * 6e4, { nowMs });
		if (nowMs === void 0 || expiresAtMs === void 0) return "OpenClaw rescue could not create a pending approval because the expiry clock is invalid.";
		const ttlMs = expiresAtMs - nowMs;
		pendingStore.register(pendingKey, {
			version: 1,
			operation
		}, { ttlMs });
		return formatPersistentPlan(operation);
	}
	const capture = createCaptureRuntime();
	await executeSystemAgentOperation(operation, capture.runtime, {
		approved: true,
		auditDetails: buildAuditDetails(input),
		deps: input.deps
	});
	return capture.read() || "OpenClaw listened, clicked a claw, and found nothing to change.";
}
//#endregion
export { extractSystemAgentRescueMessage, runSystemAgentRescueMessage };
