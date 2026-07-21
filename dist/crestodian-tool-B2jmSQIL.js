import { n as ToolInputError, y as readStringParam } from "./common-DWyiui3y.js";
import { n as textResult } from "./tool-results-BCM3fdVS.js";
import { s as stringEnum } from "./typebox-B_TbP7xZ.js";
import { i as isPersistentCrestodianOperation, n as executeCrestodianOperation } from "./operations-BxcLOxmC.js";
import { Type } from "typebox";
//#region src/agents/tools/crestodian-tool.ts
/**
* crestodian built-in tool: ring-zero setup/repair actions for the Crestodian
* agent. Never exposed to normal agents — construction is gated on an explicit
* runner option, and every action funnels through Crestodian's typed operation
* union with approval assertions and the audit log.
*/
/** Canonical operation fingerprint used to bind "yes" to one exact mutation. */
function hashCrestodianOperation(operation) {
	return JSON.stringify(operation, Object.keys(operation).toSorted());
}
/** Result markers shared with out-of-process hosts (CLI MCP runs). */
const CRESTODIAN_NEEDS_APPROVAL_PREFIX = "needs-approval:";
const CRESTODIAN_APPROVAL_MISMATCH_PREFIX = "approval-mismatch:";
const CRESTODIAN_DIRECTIVE_PREFIX = "directive:";
/**
* Reconstruct a host directive from an out-of-process tool result. Directive
* actions run inside the MCP subprocess on CLI-harness runs, so the host
* replays them from harness tool events the same way proposals are mirrored.
*/
function resolveCrestodianDirectiveTransition(params) {
	if (!params.resultText.startsWith(CRESTODIAN_DIRECTIVE_PREFIX)) return null;
	try {
		return directiveForOperation(operationForAction(params.args));
	} catch {
		return null;
	}
}
function directiveForOperation(operation) {
	if (operation.kind === "channel-setup") return {
		kind: "channel-setup",
		channel: operation.channel
	};
	if (operation.kind === "model-setup") return {
		kind: "model-setup",
		...operation.workspace ? { workspace: operation.workspace } : {}
	};
	if (operation.kind === "open-tui") return {
		kind: "open-tui",
		...operation.agentId ? { agentId: operation.agentId } : {},
		...operation.workspace ? { workspace: operation.workspace } : {}
	};
	return null;
}
/**
* Mirror a proposalRef transition from an out-of-process tool result. CLI MCP
* runs execute this tool in a stdio subprocess whose proposalRef dies with the
* run; the host replays the same lifecycle from harness tool events: denial
* registers the exact-operation hash, mismatch voids it, execution consumes it.
*/
function resolveCrestodianProposalTransition(params) {
	let operation;
	try {
		operation = operationForAction(params.args);
	} catch {
		return null;
	}
	if (!isPersistentCrestodianOperation(operation)) return null;
	if (params.resultText.startsWith(CRESTODIAN_APPROVAL_MISMATCH_PREFIX)) return { proposal: void 0 };
	if (params.resultText.startsWith(CRESTODIAN_NEEDS_APPROVAL_PREFIX)) return { proposal: hashCrestodianOperation(operation) };
	return { proposal: void 0 };
}
const CrestodianToolSchema = Type.Object({
	action: stringEnum([...[
		"status",
		"models",
		"agents",
		"channels",
		"audit",
		"validate_config",
		"doctor",
		"config_get",
		"config_schema",
		"gateway_status",
		"plugin_search",
		"connect_channel",
		"configure_model_provider",
		"open_agent",
		"setup",
		"set_default_model",
		"config_set",
		"config_set_ref",
		"create_agent",
		"gateway_start",
		"gateway_stop",
		"gateway_restart",
		"plugin_install",
		"plugin_uninstall",
		"doctor_fix"
	]]),
	path: Type.Optional(Type.String({ description: "Config path for config_* actions" })),
	value: Type.Optional(Type.String({ description: "Value for config_set (JSON5 or string)" })),
	envVar: Type.Optional(Type.String({ description: "Env var name for config_set_ref" })),
	model: Type.Optional(Type.String({ description: "provider/model ref" })),
	workspace: Type.Optional(Type.String({ description: "Workspace directory" })),
	agentId: Type.Optional(Type.String({ description: "Agent id for create_agent/open_agent" })),
	channel: Type.Optional(Type.String({ description: "Channel id for connect_channel (e.g. telegram)" })),
	query: Type.Optional(Type.String({ description: "Search query for plugin_search" })),
	spec: Type.Optional(Type.String({ description: "npm/clawhub spec for plugin_install" })),
	pluginId: Type.Optional(Type.String({ description: "Plugin id for plugin_uninstall" })),
	approved: Type.Optional(Type.Boolean({ description: "Set true ONLY after the user explicitly approved this exact change in the conversation." }))
});
function createCaptureRuntime() {
	const lines = [];
	return {
		log: (...args) => lines.push(args.join(" ")),
		error: (...args) => lines.push(args.join(" ")),
		exit: (code) => {
			throw new Error(`crestodian operation exited with code ${String(code)}`);
		},
		read: () => lines.join("\n").trim()
	};
}
function requireParam(params, name) {
	const value = readStringParam(params, name);
	if (!value?.trim()) throw new ToolInputError(`crestodian: "${name}" is required for this action`);
	return value.trim();
}
function operationForAction(params) {
	const action = readStringParam(params, "action", { required: true });
	switch (action) {
		case "status": return { kind: "status" };
		case "models": return { kind: "models" };
		case "agents": return { kind: "agents" };
		case "channels": return { kind: "channel-list" };
		case "audit": return { kind: "audit" };
		case "validate_config": return { kind: "config-validate" };
		case "doctor": return { kind: "doctor" };
		case "doctor_fix": return { kind: "doctor-fix" };
		case "config_get": return {
			kind: "config-get",
			path: requireParam(params, "path")
		};
		case "config_schema": {
			const path = readStringParam(params, "path")?.trim();
			return {
				kind: "config-schema",
				...path ? { path } : {}
			};
		}
		case "gateway_status": return { kind: "gateway-status" };
		case "connect_channel": return {
			kind: "channel-setup",
			channel: requireParam(params, "channel").toLowerCase()
		};
		case "configure_model_provider": {
			const workspace = readStringParam(params, "workspace")?.trim();
			return {
				kind: "model-setup",
				...workspace ? { workspace } : {}
			};
		}
		case "open_agent": {
			const agentId = readStringParam(params, "agentId")?.trim();
			const workspace = readStringParam(params, "workspace")?.trim();
			return {
				kind: "open-tui",
				...agentId ? { agentId } : {},
				...workspace ? { workspace } : {}
			};
		}
		case "gateway_start": return { kind: "gateway-start" };
		case "gateway_stop": return { kind: "gateway-stop" };
		case "gateway_restart": return { kind: "gateway-restart" };
		case "plugin_search": return {
			kind: "plugin-search",
			query: requireParam(params, "query")
		};
		case "plugin_install": return {
			kind: "plugin-install",
			spec: requireParam(params, "spec")
		};
		case "plugin_uninstall": return {
			kind: "plugin-uninstall",
			pluginId: requireParam(params, "pluginId")
		};
		case "setup": {
			const workspace = readStringParam(params, "workspace")?.trim();
			const model = readStringParam(params, "model")?.trim();
			return {
				kind: "setup",
				...workspace ? { workspace } : {},
				...model ? { model } : {}
			};
		}
		case "set_default_model": return {
			kind: "set-default-model",
			model: requireParam(params, "model")
		};
		case "create_agent": {
			const workspace = readStringParam(params, "workspace")?.trim();
			const model = readStringParam(params, "model")?.trim();
			return {
				kind: "create-agent",
				agentId: requireParam(params, "agentId"),
				...workspace ? { workspace } : {},
				...model ? { model } : {}
			};
		}
		case "config_set": return {
			kind: "config-set",
			path: requireParam(params, "path"),
			value: requireParam(params, "value")
		};
		case "config_set_ref": return {
			kind: "config-set-ref",
			path: requireParam(params, "path"),
			source: "env",
			id: requireParam(params, "envVar")
		};
		default: throw new ToolInputError(`crestodian: unknown action "${action}"`);
	}
}
/** Validate openclaw.json after a write so the agent can fix mistakes in-loop. */
async function verifyConfigAfterToolWrite() {
	try {
		const { readConfigFileSnapshot } = await import("./config/config.js");
		const snapshot = await readConfigFileSnapshot();
		if (!snapshot.exists || snapshot.valid) return null;
		const issues = (snapshot.issues ?? []).map((issue) => `${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
		return ["CONFIG INVALID after this write — fix it before doing anything else:", ...issues.length > 0 ? issues : ["unknown validation failure"]].join("\n");
	} catch {
		return null;
	}
}
function createCrestodianTool(options) {
	return {
		name: "crestodian",
		label: "Crestodian",
		description: [
			"Ring-zero OpenClaw setup and repair. Read actions (status/models/agents/channels/config_get/config_schema/gateway_status/plugin_search/validate_config/doctor/audit) run immediately.",
			"connect_channel(channel) starts guided channel setup; configure_model_provider starts masked provider/default-model setup; open_agent hands the user to their normal agent. These interactive handoffs run immediately.",
			"Mutating actions (setup/set_default_model/config_set/config_set_ref/create_agent/gateway_*/plugin_install/plugin_uninstall/doctor_fix) REQUIRE approved=true, which you may only set after the user clearly agreed to that exact change in this conversation.",
			"Before writing an unfamiliar config path, call config_schema for it — the schema is the source of truth. Secrets go through config_set_ref (env var), never plaintext echoes.",
			"Every applied write is validated; if the result reports CONFIG INVALID, fix it immediately. All writes are audited."
		].join(" "),
		parameters: CrestodianToolSchema,
		execute: async (_toolCallId, args) => {
			const params = args ?? {};
			const operation = operationForAction(params);
			const directive = directiveForOperation(operation);
			if (directive) {
				if (options.directiveRef) options.directiveRef.current = directive;
				return textResult(directive.kind === "channel-setup" ? `${CRESTODIAN_DIRECTIVE_PREFIX} the host chat now starts the guided ${directive.channel} setup with the user. Tell the user the setup questions come next; do not describe steps yourself.` : directive.kind === "model-setup" ? `${CRESTODIAN_DIRECTIVE_PREFIX} the host now starts masked model-provider setup. Tell the user the provider questions come next; do not ask for credentials yourself.` : `${CRESTODIAN_DIRECTIVE_PREFIX} the host now hands the user over to their normal agent. Say goodbye briefly.`, {});
			}
			const persistent = isPersistentCrestodianOperation(operation);
			if (persistent) {
				const operationHash = hashCrestodianOperation(operation);
				if (!(params.approved === true && options.approvalArmed === true && options.proposalRef?.current === operationHash)) {
					if (options.approvalArmed === true) {
						if (options.proposalRef) options.proposalRef.current = void 0;
						return textResult(`${CRESTODIAN_APPROVAL_MISMATCH_PREFIX} this call is not the operation the user approved. The approval is void; describe the new change and get a fresh yes before retrying.`, { needsApproval: true });
					}
					if (options.proposalRef) options.proposalRef.current = operationHash;
					return textResult(`${CRESTODIAN_NEEDS_APPROVAL_PREFIX} this action changes state. The proposal is registered; describe this exact change and ask the user to reply yes (their approval unlocks THIS action only — then retry the identical call with approved=true).`, { needsApproval: true });
				}
				if (options.proposalRef) options.proposalRef.current = void 0;
			}
			const capture = createCaptureRuntime();
			let applied;
			try {
				applied = (await executeCrestodianOperation(operation, capture, {
					approved: persistent,
					deps: { setupSurface: options.surface },
					auditDetails: { via: "crestodian-agent-tool" }
				})).applied;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				return textResult([capture.read(), `error: ${message}`].filter(Boolean).join("\n"), { error: true });
			}
			const verify = applied ? await verifyConfigAfterToolWrite() : null;
			return textResult([capture.read() || "done", verify].filter(Boolean).join("\n\n"), verify ? { configInvalid: true } : {});
		}
	};
}
//#endregion
export { resolveCrestodianProposalTransition as i, hashCrestodianOperation as n, resolveCrestodianDirectiveTransition as r, createCrestodianTool as t };
