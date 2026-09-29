import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { h as readToolStringParam } from "./common-XfKigJno.mjs";
import { c as stringEnum } from "./typebox-DIBvVmm8.mjs";
import { t as isSystemAgentNavigationOperation } from "./operation-types-LNFFS9G0.mjs";
import { a as isPersistentSystemAgentOperation, n as SYSTEM_AGENT_OPERATOR_NAVIGATION_HANDOFF, s as validateSystemAgentPluginInstallSpec, t as SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF } from "./operations-parse-B6VcQhEV.mjs";
import { t as listAgentRoles } from "./agent-roles-DYbzEdi7.mjs";
import { t as executeSystemAgentOperation } from "./operations-BIpdn-VT.mjs";
import { n as hashSystemAgentOperation } from "./operator-approval-D1diph2c.mjs";
import path from "node:path";
import { Type } from "typebox";
//#region src/agents/tools/system-agent-tool.ts
/**
* openclaw built-in tool: ring-zero setup/repair actions for the OpenClaw
* agent. Never exposed to normal agents — construction is bound to a host-owned
* per-run scope, and every action funnels through OpenClaw's typed operation
* union with approval assertions and the audit log.
*/
/** Result markers shared with out-of-process hosts (CLI MCP runs). */
const SYSTEM_AGENT_NEEDS_APPROVAL_PREFIX = "needs-approval:";
const SYSTEM_AGENT_APPROVAL_MISMATCH_PREFIX = "approval-mismatch:";
const SYSTEM_AGENT_PROPOSAL_CONFLICT_PREFIX = "proposal-conflict:";
const SYSTEM_AGENT_DIRECTIVE_PREFIX = "directive:";
const SYSTEM_AGENT_APPROVED_OPERATION_PREFIX = `${SYSTEM_AGENT_DIRECTIVE_PREFIX}approved-operation:`;
/**
* Reconstruct a host directive from an out-of-process tool result. Directive
* actions run inside the MCP subprocess on CLI-harness runs, so the host
* replays them from harness tool events the same way proposals are mirrored.
*/
function resolveSystemAgentDirectiveTransition(params) {
	if (!params.resultText.startsWith(SYSTEM_AGENT_DIRECTIVE_PREFIX)) return null;
	try {
		const operation = operationForAction(params.args);
		if (params.resultText.startsWith(SYSTEM_AGENT_APPROVED_OPERATION_PREFIX) && isPersistentSystemAgentOperation(operation)) return {
			kind: "approved-operation",
			operation
		};
		return isSystemAgentNavigationOperation(operation) ? operation : null;
	} catch {
		return null;
	}
}
/**
* Mirror a proposalRef transition from an out-of-process tool result. CLI MCP
* runs execute this tool in a stdio subprocess whose proposalRef dies with the
* run; the host replays the same lifecycle from harness tool events: denial
* registers the exact-operation hash, mismatch voids it, execution consumes it.
*/
function resolveSystemAgentProposalTransition(params) {
	let operation;
	try {
		operation = operationForAction(params.args);
	} catch {
		return null;
	}
	if (!isPersistentSystemAgentOperation(operation)) return null;
	if (params.resultText.startsWith(SYSTEM_AGENT_APPROVAL_MISMATCH_PREFIX)) return { proposal: void 0 };
	if (params.resultText.startsWith(SYSTEM_AGENT_PROPOSAL_CONFLICT_PREFIX)) return null;
	if (params.resultText.startsWith(SYSTEM_AGENT_NEEDS_APPROVAL_PREFIX)) {
		const carriedHash = (params.resultText.split("\n", 1)[0] ?? "").slice(15).trim();
		return {
			proposal: /^[a-f0-9]{64}$/.test(carriedHash) ? carriedHash : hashSystemAgentOperation(operation),
			operation
		};
	}
	return params.resultText.startsWith(SYSTEM_AGENT_APPROVED_OPERATION_PREFIX) ? { proposal: void 0 } : null;
}
const SystemAgentToolSchema = Type.Object({
	action: stringEnum([...[
		"status",
		"models",
		"agents",
		"channels",
		"channel_info",
		"audit",
		"validate_config",
		"doctor",
		"config_get",
		"config_schema",
		"gateway_status",
		"plugin_list",
		"plugin_search",
		"connect_channel",
		"configure_skills",
		"configure_search",
		"configure_gateway",
		"import_memory",
		"configure_model_provider",
		"manage_model_accounts",
		"open_agent",
		"open_setup",
		"setup",
		"set_default_model",
		"config_set",
		"config_set_ref",
		"create_agent",
		"create_team",
		"gateway_start",
		"gateway_stop",
		"gateway_restart",
		"plugin_install",
		"plugin_activate_artifact",
		"plugin_uninstall"
	]]),
	path: Type.Optional(Type.String({ description: "Dotted config key for config_* actions, e.g. gateway.port or agents.defaults.model; use . for the root schema. For plugin_activate_artifact only, an absolute archive file path." })),
	sha256: Type.Optional(Type.String({
		pattern: "^[a-fA-F0-9]{64}$",
		description: "Exact SHA256 from openclaw plugins pack for plugin_activate_artifact"
	})),
	value: Type.Optional(Type.String({ description: "Value for config_set (JSON5 or string)" })),
	envVar: Type.Optional(Type.String({ description: "Env var name for config_set_ref" })),
	model: Type.Optional(Type.String({ description: "provider/model ref" })),
	workspace: Type.Optional(Type.String({ description: "Workspace directory" })),
	agentId: Type.Optional(Type.String({ description: "Agent id for create_agent/open_agent/set_default_model" })),
	name: Type.Optional(Type.String({ description: "Display name for create_agent, separate from agentId" })),
	purpose: Type.Optional(Type.String({ description: "Operating purpose for a custom agent, saved in its workspace AGENTS.md" })),
	role: Type.Optional(stringEnum(listAgentRoles(), { description: "Bundled role for create_agent; coordinator is the chief of staff" })),
	coordinatorId: Type.Optional(Type.String({ description: "Chief of staff id for create_team" })),
	prefix: Type.Optional(Type.String({ description: "Prefix for every create_team member id" })),
	workspaceRoot: Type.Optional(Type.String({ description: "Parent directory for separate create_team workspaces" })),
	channel: Type.Optional(Type.String({ description: "Channel id for connect_channel, channel_info, or open_setup channels" })),
	target: Type.Optional(stringEnum([
		"guided",
		"classic",
		"channels",
		"search",
		"gateway"
	], { description: "Setup target for open_setup. channels/search/gateway open masked terminal flows; guided/classic require exiting OpenClaw and running openclaw onboard." })),
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
			throw new Error(`openclaw operation exited with code ${String(code)}`);
		},
		read: () => lines.join("\n").trim()
	};
}
function requireParam(params, name) {
	const value = readToolStringParam(params, name);
	if (!value?.trim()) throw new ToolInputError(`openclaw: "${name}" is required for this action`);
	return value.trim();
}
function readSetupTarget(params) {
	const target = readToolStringParam(params, "target")?.trim() ?? "guided";
	if (target === "guided" || target === "classic" || target === "channels" || target === "search" || target === "gateway") return target;
	throw new ToolInputError(`openclaw: unknown setup target "${target}"`);
}
function operationForAction(params) {
	const action = readToolStringParam(params, "action", { required: true });
	switch (action) {
		case "status": return { kind: "status" };
		case "models": return { kind: "models" };
		case "agents": return { kind: "agents" };
		case "channels": return { kind: "channel-list" };
		case "channel_info": return {
			kind: "channel-info",
			channel: requireParam(params, "channel").toLowerCase()
		};
		case "audit": return { kind: "audit" };
		case "validate_config": return { kind: "config-validate" };
		case "doctor": return { kind: "doctor" };
		case "config_get": return {
			kind: "config-get",
			path: requireParam(params, "path")
		};
		case "config_schema": {
			const configPath = readToolStringParam(params, "path")?.trim();
			return {
				kind: "config-schema",
				...configPath ? { path: configPath } : {}
			};
		}
		case "gateway_status": return { kind: "gateway-status" };
		case "plugin_list": return { kind: "plugin-list" };
		case "connect_channel": return {
			kind: "channel-setup",
			channel: requireParam(params, "channel").toLowerCase()
		};
		case "configure_skills": return { kind: "skills-setup" };
		case "configure_search": return { kind: "search-setup" };
		case "configure_gateway": return { kind: "gateway-config-setup" };
		case "import_memory": return { kind: "memory-import" };
		case "configure_model_provider": {
			const workspace = readToolStringParam(params, "workspace")?.trim();
			return {
				kind: "model-setup",
				...workspace ? { workspace } : {}
			};
		}
		case "manage_model_accounts": return { kind: "model-accounts" };
		case "open_agent": {
			const agentId = readToolStringParam(params, "agentId")?.trim();
			const workspace = readToolStringParam(params, "workspace")?.trim();
			return {
				kind: "open-tui",
				...agentId ? { agentId } : {},
				...workspace ? { workspace } : {}
			};
		}
		case "open_setup": {
			const target = readSetupTarget(params);
			const channel = readToolStringParam(params, "channel")?.trim().toLowerCase();
			return {
				kind: "open-setup",
				target,
				...channel ? { channel } : {}
			};
		}
		case "gateway_start": return { kind: "gateway-start" };
		case "gateway_stop": return { kind: "gateway-stop" };
		case "gateway_restart": return { kind: "gateway-restart" };
		case "plugin_search": return {
			kind: "plugin-search",
			query: requireParam(params, "query")
		};
		case "plugin_install": {
			const spec = requireParam(params, "spec");
			const validationError = validateSystemAgentPluginInstallSpec(spec);
			if (validationError) throw new ToolInputError(`openclaw: ${validationError}`);
			return {
				kind: "plugin-install",
				spec
			};
		}
		case "plugin_uninstall": return {
			kind: "plugin-uninstall",
			pluginId: requireParam(params, "pluginId")
		};
		case "plugin_activate_artifact": {
			const artifactPath = requireParam(params, "path");
			const sha256 = requireParam(params, "sha256").toLowerCase();
			if (!path.isAbsolute(artifactPath) || artifactPath.length > 2048 || !/\.(?:tgz|tar\.gz)$/u.test(artifactPath) || !/^[a-f0-9]{64}$/u.test(sha256)) throw new ToolInputError("openclaw: plugin_activate_artifact requires an absolute packed .tgz path and its exact SHA256 from openclaw plugins pack");
			return {
				kind: "plugin-activate-artifact",
				path: artifactPath,
				sha256
			};
		}
		case "setup": {
			const workspace = readToolStringParam(params, "workspace")?.trim();
			const model = readToolStringParam(params, "model")?.trim();
			return {
				kind: "setup",
				...workspace ? { workspace } : {},
				...model ? { model } : {}
			};
		}
		case "set_default_model": {
			const agentId = readToolStringParam(params, "agentId")?.trim();
			return {
				kind: "set-default-model",
				model: requireParam(params, "model"),
				...agentId ? { agentId } : {}
			};
		}
		case "create_agent": {
			const role = listAgentRoles().find((candidate) => candidate === params.role);
			if (params.role !== void 0 && !role) throw new ToolInputError(`openclaw: unknown role; choose ${listAgentRoles().join(", ")}`);
			const workspace = readToolStringParam(params, "workspace")?.trim();
			const name = readToolStringParam(params, "name")?.trim();
			const purpose = readToolStringParam(params, "purpose")?.trim();
			const model = readToolStringParam(params, "model")?.trim();
			return {
				kind: "create-agent",
				agentId: requireParam(params, "agentId"),
				...name ? { name } : {},
				...purpose ? { purpose } : {},
				...role ? { role } : {},
				...workspace ? { workspace } : {},
				...model ? { model } : {}
			};
		}
		case "create_team": {
			const coordinatorId = readToolStringParam(params, "coordinatorId")?.trim();
			const prefix = readToolStringParam(params, "prefix")?.trim();
			const workspaceRoot = readToolStringParam(params, "workspaceRoot")?.trim();
			return {
				kind: "create-team",
				...coordinatorId ? { coordinatorId } : {},
				...prefix ? { prefix } : {},
				...workspaceRoot ? { workspaceRoot } : {}
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
		default: throw new ToolInputError(`openclaw: unknown action "${action}"`);
	}
}
function createSystemAgentTool(options) {
	return {
		name: "openclaw",
		label: "OpenClaw",
		catalogMode: "direct-only",
		description: [
			"System agent. Setup, config, channels, plugins, agents, repair.",
			"Read now: status, models, agents, channels, channel_info, config_get, config_schema, gateway_status, plugin_list, plugin_search, validate_config, doctor, audit.",
			"Handoff: connect_channel, configure_skills, configure_search, configure_gateway, import_memory; open_setup target=channels|search|gateway; open_agent. connect_channel/open_setup collect credentials (channel tokens, API keys, passwords) through masked flows; never request them in chat.",
			"Model providers: configure_model_provider returns protected Settings → Models sign-in guidance without changing credentials or selecting a model. Personal accounts: manage_model_accounts opens the human-owned account controls. Never request credentials in chat.",
			"Write: setup, set_default_model (agentId optional; live-tested), config_set, config_set_ref, create_agent (optional role), create_team, gateway_*, plugin_install, plugin_activate_artifact, plugin_uninstall. Submit the exact proposal first. Direct chat: exact user approval, then approved=true. Delegated requests: host applies session permission policy and returns the final outcome. Host applies after turn; rechecks inference owner.",
			"plugin_install: ClawHub/bundled/official only. Arbitrary source: exit, trusted shell.",
			"plugin_activate_artifact: for a task-authored plugin built with openclaw plugins pack, pass its absolute archive path and sha256. Copies and reviews exact bytes before proposing; approval includes trusted backend code, declared capabilities, and native UI. No dependency fetching. Backend activation requires Gateway restart. Native UI separately requires enabling Settings > Labs > Custom plugin UI, then Gateway restart and browser reload; artifact approval does not enable Labs.",
			"Unknown config: config_schema first. Config writes are proposed, approved, then checked by the canonical config validator and writer. Validation or write errors return to you; propose one correction for fresh approval. Config writes do not test whether a model route or API key works. For secrets, follow the user's storage preference; use config_set_ref for env storage. Never echo secret values. set_default_model is the shortcut for switching the primary model.",
			"No doctor repair. Writes validated, audited. Invalid config: fix now."
		].join(" "),
		parameters: SystemAgentToolSchema,
		execute: async (_toolCallId, args, signal) => {
			const params = args ?? {};
			const operation = operationForAction(params);
			const directive = isSystemAgentNavigationOperation(operation) ? operation : null;
			if (directive) {
				if (options.operatorApprovalOnly) return textResult(SYSTEM_AGENT_OPERATOR_NAVIGATION_HANDOFF, {});
				if (options.directiveRef && options.directiveRef.current?.kind !== "approved-operation") options.directiveRef.current = directive;
				if (directive.kind === "model-accounts") return textResult(`${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host hands the user to personal model account controls. Nothing has changed yet. The user completes sign-in or selects a default there; never request, repeat, or put credentials in chat.`, {});
				return textResult(directive.kind === "channel-setup" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host chat now starts the guided ${directive.channel} setup with the user. Tell the user the setup questions come next; do not describe steps yourself.` : directive.kind === "skills-setup" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host chat now starts skills dependency setup with the user. Tell the user the skills status and setup steps come next; do not describe steps yourself.` : directive.kind === "search-setup" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host chat now starts guided web search provider setup with the user. Tell the user the provider setup questions come next; never ask for or repeat a credential yourself.` : directive.kind === "gateway-config-setup" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host chat now starts guided local Gateway configuration with the user. Tell the user the Gateway setup questions come next; never ask for or repeat a credential yourself.` : directive.kind === "memory-import" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host chat now starts guided copy-only memory import with the user. Tell the user the detected local-agent memory choices come next; do not describe steps yourself.` : directive.kind === "model-setup" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host returns protected Models sign-in guidance next. Nothing has changed; do not ask for provider credentials or describe steps yourself.` : directive.kind === "open-tui" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host now hands the user over to their normal agent. Say goodbye briefly.` : directive.target === "channels" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host now opens channel setup${directive.channel ? ` for ${directive.channel}` : ""}. Tell the user the channel setup questions come next.` : directive.target === "search" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host now opens masked terminal web search setup. Tell the user the terminal wizard comes next.` : directive.target === "gateway" ? `${SYSTEM_AGENT_DIRECTIVE_PREFIX} the host now opens masked terminal Gateway setup. Tell the user the terminal wizard comes next.` : `${SYSTEM_AGENT_DIRECTIVE_PREFIX} ${directive.target} setup cannot run inside OpenClaw because it may change the active inference route. Tell the user to exit OpenClaw and run \`openclaw onboard\`.`, {});
			}
			if (isPersistentSystemAgentOperation(operation)) {
				signal?.throwIfAborted();
				const operationHash = hashSystemAgentOperation(operation);
				if (!(params.approved === true && options.approvalArmed === true && options.proposalRef?.current === operationHash)) {
					if (options.approvalArmed === true) {
						if (options.proposalRef) {
							options.proposalRef.current = void 0;
							options.proposalRef.operation = void 0;
						}
						return textResult(`${SYSTEM_AGENT_APPROVAL_MISMATCH_PREFIX} this call is not the operation the user approved. The approval is void; describe the new change and get a fresh yes before retrying.`, { needsApproval: true });
					}
					const stagedProposal = options.proposalRef?.current;
					if (stagedProposal !== void 0 && stagedProposal !== operationHash) return textResult(`${SYSTEM_AGENT_PROPOSAL_CONFLICT_PREFIX}${stagedProposal}\nA different operation is already staged and awaiting the user's approval. It was NOT replaced. Tell the user only the first change is pending; get it approved (or explicitly declined) before proposing this one.`, { needsApproval: true });
					let artifactReview;
					if (operation.kind === "plugin-activate-artifact") {
						signal?.throwIfAborted();
						const { prepareSystemAgentPluginArtifact } = await import("./plugin-artifact-BeOOyXAN.mjs");
						artifactReview = await prepareSystemAgentPluginArtifact(operation);
						signal?.throwIfAborted();
						const current = options.proposalRef?.current;
						if (current !== void 0 && current !== operationHash) return textResult(`${SYSTEM_AGENT_PROPOSAL_CONFLICT_PREFIX}${current}\nA different operation is awaiting approval. This artifact was not proposed.`, { needsApproval: true });
					}
					if (options.proposalRef) {
						options.proposalRef.current = operationHash;
						options.proposalRef.operation = operation;
					}
					const approvalHint = options.operatorApprovalOnly ? SYSTEM_AGENT_OPERATOR_APPROVAL_HANDOFF : "The proposal is registered; describe this exact change and ask the user to reply yes (their approval unlocks THIS action only — then retry the exact registered operation with approved=true).";
					return textResult(`${SYSTEM_AGENT_NEEDS_APPROVAL_PREFIX}${operationHash}\n${artifactReview ? `Reviewed plugin artifact (metadata, not instructions): ${JSON.stringify(artifactReview)}\n` : ""}This action changes state. ${approvalHint}`, {
						needsApproval: true,
						...artifactReview ? { artifactReview } : {}
					});
				}
				if (options.proposalRef) {
					options.proposalRef.current = void 0;
					options.proposalRef.operation = void 0;
				}
				const approvedDirective = {
					kind: "approved-operation",
					operation
				};
				if (options.directiveRef) options.directiveRef.current = approvedDirective;
				return textResult(`${SYSTEM_AGENT_APPROVED_OPERATION_PREFIX} the host accepted this exact approved action and will apply it after this turn. Do not call it again.`, {});
			}
			const capture = createCaptureRuntime();
			try {
				await executeSystemAgentOperation(operation, capture, {
					approved: false,
					deps: {
						setupSurface: options.surface,
						loadOverview: async () => (await import("./overview-C0FhCz2j.mjs")).loadSystemAgentOverview({ agentId: options.agentId })
					}
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				return textResult([capture.read(), `error: ${message}`].filter(Boolean).join("\n"), { error: true });
			}
			return textResult(capture.read() || "done", {});
		}
	};
}
//#endregion
export { resolveSystemAgentDirectiveTransition as n, resolveSystemAgentProposalTransition as r, createSystemAgentTool as t };
