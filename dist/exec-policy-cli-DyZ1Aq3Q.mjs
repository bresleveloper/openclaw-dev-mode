import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { h as resolveConfiguredAgentId, t as AgentSelectionRequiredError, x as resolveSoleAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as normalizeExecTarget, i as normalizeExecSecurity, l as resolveExecModePolicy, n as normalizeExecAsk, r as normalizeExecMode, s as resolveExactExecModeFromPolicy } from "./exec-approvals-core-7oJu_fRe.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { d as updateExecApprovals, l as readExecApprovalsSnapshotAsync, u as restoreExecApprovalsSnapshotLocked } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
import { l as rethrowExpectedCliError, t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { r as callGatewayFromCliWithTransport, s as resolveGatewayRpcOptionsWithLocalPort, t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { n as resolveConfiguredToolAccess } from "./tool-access-diagnostics-EgwVIsj0.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as collectExecPolicyScopeSnapshots, t as SESSION_EXEC_OVERRIDES_NOTE } from "./exec-approvals-effective-N0Z2oD0v.mjs";
//#region src/cli/exec-policy-diagnostics.ts
const TERMINAL_TOOLS = ["exec", "process"];
async function buildExecPolicyToolAccess(config, options) {
	const requestedAgent = options.agent?.trim();
	const sessionKey = options.session?.trim();
	if (options.agent !== void 0 && !requestedAgent) throw new Error("--agent must not be blank.");
	if (options.session !== void 0 && !sessionKey) throw new Error("--session must not be blank.");
	const sessionAgent = sessionKey ? parseAgentSessionKey(sessionKey)?.agentId : void 0;
	const explicitAgent = requestedAgent ? normalizeAgentId(requestedAgent) : void 0;
	if (explicitAgent && sessionAgent && explicitAgent !== sessionAgent) throw new Error(`Agent "${explicitAgent}" does not match session agent "${sessionAgent}".`);
	const agentId = sessionKey ? explicitAgent ?? sessionAgent : resolveConfiguredAgentId(config, explicitAgent ?? resolveSoleAgentId(config, {
		surface: "exec-policy show",
		hint: "Pass --agent <id> or --session <agent session key>."
	}));
	const access = {
		...agentId ? { agentId } : {},
		...sessionKey ? { sessionKey } : {}
	};
	if (sessionKey) try {
		const result = await callGatewayFromCliWithTransport("tools.effective", options, {
			...agentId ? { agentId } : {},
			sessionKey
		}, {
			progress: false,
			sharedStateMode: "read-only"
		});
		if (agentId && result.agentId !== agentId) throw new Error("The Gateway returned tool access for a different agent.");
		access.agentId = result.agentId;
		access.live = {
			status: "verified",
			diagnostics: result.toolAccess ?? describeLegacySessionPreview(result)
		};
	} catch (error) {
		access.live = {
			status: "unverified",
			error: error instanceof Error ? error.message : String(error)
		};
	}
	if (access.agentId && listAgentIds(config).includes(access.agentId)) access.local = resolveConfiguredToolAccess({
		config,
		agentId: access.agentId,
		toolNames: TERMINAL_TOOLS
	});
	return access;
}
function describeLegacySessionPreview(result) {
	const tools = result.groups.flatMap((group) => group.tools);
	return {
		checked: "live-session",
		profiles: [],
		tools: TERMINAL_TOOLS.map((id) => {
			const entry = tools.find((tool) => tool.id === id);
			return {
				id,
				status: entry?.deniedBySession ? "excluded" : entry ? "available" : "unavailable",
				reasons: entry?.deniedBySession ? [{
					kind: "session",
					label: "Denied by this session's tool restrictions"
				}] : entry ? [] : [{
					kind: "runtime",
					label: "Not included in the session preview"
				}]
			};
		})
	};
}
function display(value) {
	return sanitizeExecApprovalDisplayText(sanitizeTerminalText(value));
}
function terminalTools(diagnostics) {
	return diagnostics.tools.filter((tool) => TERMINAL_TOOLS.some((id) => id === tool.id));
}
function formatExecPolicyCommandApprovals(params) {
	const lines = params.scopes.map((approval) => {
		const ask = approval.ask.effective === "on-miss" ? "ask on miss" : approval.ask.effective === "always" ? "always ask" : approval.ask.effective === "off" ? "no approval prompts" : "approval mode unknown";
		return display(`${params.showScopeLabels && approval.scopeLabel ? `${approval.scopeLabel}: ` : ""}${approval.host.requested} · ${approval.security.effective} · ${ask} · fallback ${approval.askFallback.effective}`);
	});
	if (!params.approvalsExists) lines.push("Approvals State: defaults (no stored overrides)");
	lines.push("Command approvals do not grant tool access.", SESSION_EXEC_OVERRIDES_NOTE);
	return lines;
}
function renderExecPolicyToolAccess(params) {
	const { access } = params;
	const preview = access.live?.status === "verified" ? access.live.diagnostics : void 0;
	const diagnostics = preview ?? access.local;
	const tools = diagnostics ? terminalTools(diagnostics) : [];
	const excluded = tools.filter((tool) => tool.status === "excluded");
	const missingFromPreview = tools.some((tool) => tool.status === "unavailable");
	const status = access.live?.status === "unverified" ? "UNVERIFIED" : excluded.length === TERMINAL_TOOLS.length ? preview ? "BLOCKED" : "OFF" : excluded.length > 0 ? "PARTIAL" : preview ? "PREVIEW" : "UNVERIFIED";
	const lines = [theme.heading(`TERMINAL ACCESS · ${display(access.agentId ?? "unknown agent")} — ${status}`)];
	if (access.sessionKey) lines.push(`Session: ${display(access.sessionKey)}`);
	const section = (title) => {
		lines.push("", theme.heading(`── ${title} ${"─".repeat(Math.max(1, 43 - title.length))}`), "");
	};
	if (diagnostics && diagnostics.profiles.length > 0) {
		section(preview ? "PROFILE (GATEWAY CONFIGURATION)" : "PROFILE");
		const global = diagnostics.profiles.find((profile) => profile.source === "tools.profile");
		const agent = diagnostics.profiles.find((profile) => profile.source.startsWith("agents.") && profile.source.endsWith(".tools.profile"));
		const profileText = (profile) => `${display(profile.profile)}${profile.active ? " ← active" : ""}`;
		if (global) lines.push(`Global: ${profileText(global)}`);
		if (agent) lines.push(`${global ? "└─ " : ""}Agent: ${profileText(agent)}`);
		for (const profile of diagnostics.profiles.filter((candidate) => candidate !== global && candidate !== agent)) lines.push(`${display(profile.source)}: ${profileText(profile)}`);
	}
	section("CHECK RESULTS");
	if (!access.local) lines.push("Local tool policy: unavailable — no matching local agent.");
	if (access.live?.status === "unverified") {
		if (access.local) {
			const localExcluded = terminalTools(access.local).filter((tool) => tool.status === "excluded");
			lines.push(localExcluded.length > 0 ? `Local configuration excludes: ${localExcluded.map((tool) => tool.id).join(", ")}` : "Local configuration allows terminal tools; execution unverified");
		}
		lines.push(`Session preview: could not retrieve — ${display(access.live.error)}`);
	}
	for (const tool of tools) {
		const label = tool.status === "available" ? "Included in session preview" : tool.status === "allowed" ? "Allowed by configuration; execution unverified" : tool.status === "excluded" ? "Excluded by policy" : "Not included in session preview; execution unverified";
		lines.push(`${display(tool.id)}: ${label}`);
		for (const reason of tool.reasons) lines.push(`  ${display(reason.label)}${reason.source ? ` (${display(reason.source)})` : ""}`);
	}
	if (diagnostics) lines.push("", `Based on: ${preview ? "session preview (saved settings)" : "local configuration"}`);
	if (preview) lines.push("Session preview uses saved settings; active runs may differ.");
	section("COMMAND APPROVALS (LOCAL)");
	lines.push(...formatExecPolicyCommandApprovals({
		scopes: params.approvals ? [params.approvals] : [],
		approvalsExists: params.approvalsExists
	}));
	section("NEXT STEP");
	if (access.live?.status === "unverified") lines.push("Check the Gateway connection and session key, then retry.");
	else if (excluded.length > 0) {
		const additions = /* @__PURE__ */ new Map();
		if (!missingFromPreview && excluded.every((tool) => tool.alsoAllowPath)) {
			for (const tool of excluded) {
				const path = tool.alsoAllowPath;
				additions.set(path, [...additions.get(path) ?? [], tool.id]);
			}
			lines.push("If terminal access is intended, append:");
			for (const [path, ids] of additions) lines.push(`  ${ids.join(", ")}`, "to:", `  ${display(path)}`);
			lines.push("", "Preserve existing entries and command approvals.", "Inspect the session preview, then verify execution in a run.");
		} else lines.push("Review the policy exclusions listed above before enabling terminal access.");
	} else if (preview) lines.push(missingFromPreview ? "Missing preview tools are not necessarily disabled." : "Preview inclusion does not guarantee execution.", "Verify execution in a run; command approvals still apply.");
	else {
		lines.push("Inspect an existing session's tool preview:");
		lines.push("  openclaw exec-policy show --session <session-key>");
		lines.push("Verify execution in a run; command approvals still apply.");
	}
	if (preview && missingFromPreview && excluded.length > 0) lines.push("Missing preview tools are not necessarily disabled; verify execution in a run.");
	if (params.verbose) {
		section("TOOL POLICY SOURCES");
		for (const profile of diagnostics?.profiles ?? []) lines.push(`${display(profile.source)} = ${display(profile.profile)}`);
	} else lines.push("", "Use --verbose for policy sources and all command approval scopes.");
	defaultRuntime.log(lines.join("\n"));
}
//#endregion
//#region src/cli/exec-policy-cli.ts
const EXEC_POLICY_PRESETS = {
	yolo: {
		host: "gateway",
		security: "full",
		ask: "off",
		askFallback: "full"
	},
	cautious: {
		host: "gateway",
		security: "allowlist",
		ask: "on-miss",
		askFallback: "deny"
	},
	"deny-all": {
		host: "gateway",
		security: "deny",
		ask: "off",
		askFallback: "deny"
	}
};
function formatExecPolicyError(err) {
	return sanitizeExecPolicyMessage(err instanceof Error ? err.message : String(err));
}
async function runExecPolicyAction(opts, action) {
	try {
		await action();
	} catch (err) {
		const message = formatExecPolicyError(err);
		if (opts.json) {
			rethrowExpectedCliError(err);
			const failure = new ExpectedCliError({
				message,
				humanOutput: message,
				machineOutput: message
			});
			failure.cause = err;
			throw failure;
		}
		defaultRuntime.error(message);
		defaultRuntime.exit(1);
	}
}
function sanitizeExecPolicyTableCell(value) {
	return sanitizeExecApprovalDisplayText(sanitizeTerminalText(value));
}
function sanitizeExecPolicyMessage(value) {
	return sanitizeTerminalText(String(value));
}
function resolveExecPolicyInput(params) {
	const resolved = {};
	const parse = (value, normalize, label) => {
		const parsed = normalize(value);
		if (!parsed) throw new Error(`Invalid exec ${label}: ${sanitizeExecPolicyMessage(value)}`);
		return parsed;
	};
	if (params.host !== void 0) resolved.host = parse(params.host, normalizeExecTarget, "host");
	if (params.security !== void 0) resolved.security = parse(params.security, normalizeExecSecurity, "security");
	if (params.ask !== void 0) resolved.ask = parse(params.ask, normalizeExecAsk, "ask mode");
	if (params.askFallback !== void 0) resolved.askFallback = parse(params.askFallback, normalizeExecSecurity, "askFallback");
	return resolved;
}
function applyConfigExecPolicy(root, policy) {
	root.tools ??= {};
	root.tools.exec ??= {};
	if (policy.host !== void 0) root.tools.exec.host = policy.host;
	if (policy.security !== void 0 || policy.ask !== void 0) {
		const currentPolicy = resolveExecModePolicy({
			mode: normalizeExecMode(root.tools.exec.mode),
			security: root.tools.exec.security ?? "full",
			ask: root.tools.exec.ask ?? "off"
		});
		const security = policy.security ?? currentPolicy.security;
		const ask = policy.ask ?? currentPolicy.ask;
		const mode = resolveExactExecModeFromPolicy({
			security,
			ask
		});
		if (mode) {
			root.tools.exec.mode = mode;
			delete root.tools.exec.security;
			delete root.tools.exec.ask;
		} else {
			delete root.tools.exec.mode;
			root.tools.exec.security = security;
			root.tools.exec.ask = ask;
		}
	}
}
function applyApprovalsDefaults(file, policy) {
	const next = structuredClone(file ?? { version: 1 });
	next.version = 1;
	next.defaults ??= {};
	if (policy.security !== void 0) next.defaults.security = policy.security;
	if (policy.ask !== void 0) next.defaults.ask = policy.ask;
	if (policy.askFallback !== void 0) next.defaults.askFallback = policy.askFallback;
	return next;
}
async function buildLocalExecPolicyShowPayload(options) {
	const configSnapshot = await readConfigFileSnapshot();
	const approvalsSnapshot = await readExecApprovalsSnapshotAsync();
	const config = configSnapshot.config ?? {};
	const scopes = collectExecPolicyScopeSnapshots({
		cfg: config,
		approvals: approvalsSnapshot.file,
		hostPath: approvalsSnapshot.path
	}).map(buildExecPolicyShowScope);
	const baseNote = scopes.some((scope) => scope.runtimeApprovalsSource === "node-runtime") ? "Scopes requesting host=node are node-managed at runtime. Local approvals are shown only for local/gateway scopes." : "Effective exec policy is the host approvals policy intersected with requested tools.exec policy.";
	const payload = {
		configPath: configSnapshot.path,
		approvalsPath: approvalsSnapshot.path,
		approvalsExists: approvalsSnapshot.exists,
		effectivePolicy: {
			note: `${baseNote} ${SESSION_EXEC_OVERRIDES_NOTE}`,
			scopes
		}
	};
	if (!options) return payload;
	const hasExplicitTarget = options.agent !== void 0 || options.session !== void 0;
	if (!hasExplicitTarget && listAgentIds(config).length === 0) {
		payload.toolAccessSelectionRequired = {
			agentIds: [],
			hint: "Configure an agent with openclaw agents add to inspect terminal tool access."
		};
		return payload;
	}
	try {
		payload.toolAccess = await buildExecPolicyToolAccess(config, options);
	} catch (error) {
		if (hasExplicitTarget || !(error instanceof AgentSelectionRequiredError)) throw error;
		payload.toolAccessSelectionRequired = {
			agentIds: error.agentIds,
			hint: error.hint
		};
	}
	return payload;
}
function buildExecPolicyShowScope(snapshot) {
	const { allowedDecisions: _allowedDecisions, ...baseScope } = snapshot;
	if (snapshot.host.requested !== "node") return {
		...baseScope,
		runtimeApprovalsSource: "local-file"
	};
	const nodeManagedPolicy = (field) => ({
		requested: snapshot[field].requested,
		requestedSource: snapshot[field].requestedSource,
		host: "unknown",
		hostSource: "node runtime approvals",
		effective: "unknown",
		note: "runtime policy resolved by node approvals"
	});
	return {
		...baseScope,
		runtimeApprovalsSource: "node-runtime",
		security: nodeManagedPolicy("security"),
		ask: nodeManagedPolicy("ask"),
		askFallback: {
			effective: "unknown",
			source: "node runtime approvals"
		}
	};
}
function renderExecPolicyShow(payload) {
	defaultRuntime.log(theme.heading("Exec Policy"));
	defaultRuntime.log(renderTable({
		width: getTerminalTableWidth(),
		columns: [{
			key: "Field",
			header: "Field",
			minWidth: 14
		}, {
			key: "Value",
			header: "Value",
			minWidth: 24,
			flex: true
		}],
		rows: [
			{
				Field: "Config",
				Value: sanitizeExecPolicyTableCell(payload.configPath)
			},
			{
				Field: "Approvals",
				Value: sanitizeExecPolicyTableCell(payload.approvalsPath)
			},
			{
				Field: "Approvals State",
				Value: sanitizeExecPolicyTableCell(payload.approvalsExists ? "stored" : "defaults (no stored overrides)")
			}
		]
	}).trimEnd());
	defaultRuntime.log("");
	defaultRuntime.log(theme.heading("Effective Policy"));
	defaultRuntime.log(renderTable({
		width: getTerminalTableWidth(),
		columns: [
			{
				key: "Scope",
				header: "Scope",
				minWidth: 12
			},
			{
				key: "Requested",
				header: "Requested",
				minWidth: 24,
				flex: true
			},
			{
				key: "Host",
				header: "Host",
				minWidth: 24,
				flex: true
			},
			{
				key: "Effective",
				header: "Effective",
				minWidth: 16
			}
		],
		rows: payload.effectivePolicy.scopes.map((scope) => ({
			Scope: sanitizeExecPolicyTableCell(scope.scopeLabel),
			Requested: sanitizeExecPolicyTableCell(`host=${scope.host.requested} (${scope.host.requestedSource})\nsecurity=${scope.security.requested} (${scope.security.requestedSource})\nask=${scope.ask.requested} (${scope.ask.requestedSource})`),
			Host: sanitizeExecPolicyTableCell(`security=${scope.security.host} (${scope.security.hostSource})\nask=${scope.ask.host} (${scope.ask.hostSource})\naskFallback=${scope.askFallback.effective} (${scope.askFallback.source})`),
			Effective: sanitizeExecPolicyTableCell(`security=${scope.security.effective}\nask=${scope.ask.effective}`)
		}))
	}).trimEnd());
	defaultRuntime.log("");
	defaultRuntime.log(theme.muted(payload.effectivePolicy.note));
}
function applyLocalExecPolicy(policy) {
	return runWithLocalStateOwner({
		method: "exec-policy.set",
		params: { ...policy },
		target: "local exec policy and approvals",
		onForeignOwner: "refuse",
		runLocal: ({ assertCurrent }) => applyOwnedExecPolicy(policy, assertCurrent)
	});
}
async function applyOwnedExecPolicy(policy, assertCurrent) {
	assertCurrent();
	const context = captureOpenClawStateWorkerContext();
	const configSnapshot = await readConfigFileSnapshot();
	assertCurrent();
	const nextConfig = structuredClone(configSnapshot.config ?? {});
	applyConfigExecPolicy(nextConfig, policy);
	if (nextConfig.tools?.exec?.host === "node") throw new Error("Local exec-policy cannot synchronize host=node. Node approvals are fetched from the node at runtime.");
	const approvalsSnapshot = await readExecApprovalsSnapshotAsync(context);
	assertCurrent();
	const nextApprovals = applyApprovalsDefaults(approvalsSnapshot.file, policy);
	const writtenApprovals = await updateExecApprovals({
		baseHash: approvalsSnapshot.hash,
		assertCurrent,
		update: {
			kind: "replace",
			file: nextApprovals
		}
	}, context);
	if (!writtenApprovals) throw new Error("Exec approvals changed; reload and retry.");
	try {
		assertCurrent();
		await replaceConfigFile({
			baseHash: configSnapshot.hash,
			nextConfig,
			writeOptions: { assertCurrent }
		});
	} catch (err) {
		try {
			assertCurrent();
			if (!await restoreExecApprovalsSnapshotLocked(approvalsSnapshot, writtenApprovals.hash, context, assertCurrent)) await updateExecApprovals({
				assertCurrent,
				update: {
					kind: "rollback-defaults",
					original: approvalsSnapshot.file,
					written: writtenApprovals.file,
					policy
				}
			}, context);
		} catch (rollbackError) {
			throw new Error(`Config update failed: ${formatExecPolicyError(err)}; exec approvals rollback failed: ${formatExecPolicyError(rollbackError)}`, { cause: rollbackError });
		}
		throw err;
	}
	return await buildLocalExecPolicyShowPayload();
}
function registerExecPolicyCli(program) {
	const execPolicy = program.command("exec-policy").description("Show or synchronize requested exec policy with host approvals").addHelpText("after", () => formatDocsHelp("/cli/approvals"));
	addGatewayClientOptions(execPolicy.command("show").description("Explain terminal tool access and command approvals (offline unless --session)").option("--agent <id>", "Agent whose terminal tools to inspect (automatic for one agent)").option("--session <key>", "Fetch an existing session's tool preview from saved settings").option("--verbose", "Include policy sources and all command approval scopes", false).option("--json", "Output as JSON", false)).action(async (opts, command) => {
		await runExecPolicyAction(opts, async () => {
			const payload = await buildLocalExecPolicyShowPayload(resolveGatewayRpcOptionsWithLocalPort(opts, command));
			if (opts.json) {
				defaultRuntime.writeJson(payload, 0);
				return;
			}
			if (payload.toolAccess) {
				const scope = payload.effectivePolicy.scopes.find((candidate) => candidate.scopeLabel === `agent:${payload.toolAccess?.agentId}`) ?? payload.effectivePolicy.scopes.find((candidate) => candidate.agentId === payload.toolAccess?.agentId) ?? payload.effectivePolicy.scopes[0];
				renderExecPolicyToolAccess({
					access: payload.toolAccess,
					approvals: scope,
					approvalsExists: payload.approvalsExists,
					verbose: opts.verbose
				});
			} else if (payload.toolAccessSelectionRequired) {
				const { agentIds, hint } = payload.toolAccessSelectionRequired;
				const title = `TERMINAL ACCESS — ${agentIds.length ? "SELECT AGENT" : "NO AGENT CONFIGURED"}`;
				defaultRuntime.log(theme.heading(title));
				if (agentIds.length > 0) defaultRuntime.log(`Configured agents: ${agentIds.map(sanitizeExecPolicyTableCell).join(", ")}`);
				defaultRuntime.log("");
				defaultRuntime.log(theme.heading("── COMMAND APPROVALS (LOCAL) ──────────────────"));
				defaultRuntime.log("");
				defaultRuntime.log(formatExecPolicyCommandApprovals({
					scopes: payload.effectivePolicy.scopes,
					approvalsExists: payload.approvalsExists,
					showScopeLabels: true
				}).join("\n"));
				defaultRuntime.log("");
				defaultRuntime.log(theme.heading("── NEXT STEP ─────────────────────────────────"));
				defaultRuntime.log("");
				defaultRuntime.log(sanitizeExecPolicyTableCell(hint));
				if (!opts.verbose) defaultRuntime.log("Use --verbose for policy sources and detailed command approval scopes.");
			}
			if (opts.verbose) {
				defaultRuntime.log("");
				renderExecPolicyShow(payload);
			}
		});
	});
	execPolicy.command("preset <name>").description("Apply a synchronized preset: \"yolo\", \"cautious\", or \"deny-all\"").option("--json", "Output as JSON", false).action(async (name, opts) => {
		await runExecPolicyAction(opts, async () => {
			if (!Object.hasOwn(EXEC_POLICY_PRESETS, name)) throw new Error(`Unknown exec-policy preset: ${sanitizeExecPolicyMessage(name)}`);
			const preset = EXEC_POLICY_PRESETS[name];
			const payload = await applyLocalExecPolicy(preset);
			if (opts.json) {
				defaultRuntime.writeJson({
					preset: name,
					...payload
				}, 0);
				return;
			}
			defaultRuntime.log(`Applied exec-policy preset: ${sanitizeExecPolicyMessage(name)}`);
			defaultRuntime.log("");
			renderExecPolicyShow(payload);
		});
	});
	execPolicy.command("set").description("Synchronize local config and host approvals using explicit values").option("--host <host>", "Exec host target: auto|sandbox|gateway|node").option("--security <mode>", "Exec security: deny|allowlist|full").option("--ask <mode>", "Exec ask mode: off|on-miss|always").option("--ask-fallback <mode>", "Host approvals fallback: deny|allowlist|full").option("--json", "Output as JSON", false).action(async (opts) => {
		await runExecPolicyAction(opts, async () => {
			const policy = resolveExecPolicyInput(opts);
			if (Object.keys(policy).length === 0) throw new Error("Provide at least one of --host, --security, --ask, or --ask-fallback.");
			const payload = await applyLocalExecPolicy(policy);
			if (opts.json) {
				defaultRuntime.writeJson({
					applied: policy,
					...payload
				}, 0);
				return;
			}
			defaultRuntime.log("Synchronized local exec policy.");
			defaultRuntime.log("");
			renderExecPolicyShow(payload);
		});
	});
}
//#endregion
export { registerExecPolicyCli };
