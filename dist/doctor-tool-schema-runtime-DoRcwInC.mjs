import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-38ksiKnf.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import { i as collectExplicitAllowlist } from "./tool-policy-YDdaK0oX.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BGHKMcLd.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-BWfIk8DO.mjs";
import { l as isUpdateDoctorLintPass } from "./update-phase-DiVB4MDN.mjs";
import { a as setPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-L6QuLbuq.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DOxCMP7W.mjs";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { t as appendRuntimePluginToolGrant } from "./tool-grant-allowlist-GtrQVhRk.mjs";
//#region src/flows/doctor-tool-schema-runtime.ts
async function collectBundleMcpRuntimeToolSchemaFindings(params) {
	const { collectNormalizedToolSchemaFindings } = await import("./doctor-tool-schema-projection-BJiofoBA.mjs");
	const activeBundleTools = applyFinalEffectiveToolPolicy({
		bundledTools: params.bundleRuntime.tools,
		config: params.cfg,
		conversationCapabilityProfile: resolveConversationCapabilityProfile({
			config: params.cfg,
			agentId: params.agentId,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model
		}),
		warn: () => {}
	});
	return collectNormalizedToolSchemaFindings({
		agentId: params.agentId,
		tools: activeBundleTools,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		modelRef: params.modelRef,
		model: params.model,
		normalizationFailureFinding: bundleMcpRuntimeNormalizationFailureFinding
	});
}
function bundleMcpRuntimeNormalizationFailureFinding(error) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: "Configured MCP tool schema validation could not normalize the runtime tool set.",
		path: "mcp.servers",
		requirement: formatErrorMessage(error),
		fixHint: "Fix provider/plugin schema normalization errors, then rerun doctor before relying on assistant tool startup."
	};
}
function bundleMcpRuntimeLoadFailureFinding(error) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: "Configured MCP tool schema validation could not load the runtime tool set.",
		path: "mcp.servers",
		requirement: formatErrorMessage(error),
		fixHint: "Fix or disable the offending MCP server, then rerun doctor before relying on assistant tool startup."
	};
}
function bundleMcpRuntimeDiagnosticFinding(diagnostic) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `Configured MCP server "${diagnostic.serverName}" could not expose runtime tools for schema validation.`,
		path: `mcp.servers.${diagnostic.serverName}`,
		requirement: diagnostic.message,
		fixHint: "Fix or disable the offending MCP server, then rerun doctor before relying on assistant tool startup."
	};
}
function bundleMcpRequesterInspectionFinding(serverName) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "info",
		message: `Configured requester-scoped MCP server "${serverName}" was not probed without an authenticated requester.`,
		path: `mcp.servers.${serverName}`,
		requirement: "authenticated requester context",
		fixHint: "Verify this server from an authenticated agent turn."
	};
}
function makeBundleMcpDiagnosticSentinel(name) {
	const sentinel = {
		name,
		label: "Bundle MCP diagnostic",
		description: "Internal doctor sentinel for bundle MCP schema diagnostics.",
		parameters: {
			type: "object",
			properties: {}
		},
		execute: async () => ({
			content: [],
			details: {}
		})
	};
	setPluginToolMeta(sentinel, {
		pluginId: "bundle-mcp",
		optional: false
	});
	return sentinel;
}
function synthesizeBundleMcpAllowlistSentinelName(params) {
	const normalized = normalizeToolPolicyName(params.allowlistEntry);
	const serverPrefix = normalizeToolPolicyName(`${params.safeServerName}__`);
	if (normalized.startsWith(serverPrefix)) return normalized;
	const separatorIndex = normalized.lastIndexOf("__");
	if (separatorIndex < 0) return;
	const toolPattern = normalized.slice(separatorIndex + 2);
	if (!toolPattern) return;
	const concreteToolName = toolPattern.replace(/\*/g, "diagnostic").replace(/\?/g, "x");
	return `${params.safeServerName}__${concreteToolName}`;
}
function collectBundleMcpDiagnosticSentinels(params) {
	const sentinels = [makeBundleMcpDiagnosticSentinel(`${params.diagnostic.safeServerName}__runtime_schema`)];
	const effectivePolicy = resolveEffectiveToolPolicy({
		config: params.cfg,
		agentId: params.agentId,
		modelProvider: params.modelRef.provider,
		modelId: params.modelRef.model
	});
	const explicitAllowlist = collectExplicitAllowlist([
		effectivePolicy.globalPolicy,
		effectivePolicy.globalProviderPolicy,
		effectivePolicy.agentPolicy,
		effectivePolicy.agentProviderPolicy,
		effectivePolicy.profileAlsoAllow ? { allow: effectivePolicy.profileAlsoAllow } : void 0,
		effectivePolicy.providerProfileAlsoAllow ? { allow: effectivePolicy.providerProfileAlsoAllow } : void 0
	]);
	if (explicitAllowlist.length === 0) return sentinels;
	for (const entry of explicitAllowlist) {
		const sentinelName = synthesizeBundleMcpAllowlistSentinelName({
			safeServerName: params.diagnostic.safeServerName,
			allowlistEntry: entry
		});
		if (sentinelName) sentinels.push(makeBundleMcpDiagnosticSentinel(sentinelName));
	}
	return sentinels;
}
function shouldReportBundleMcpRuntimeDiagnostic(params) {
	return applyFinalEffectiveToolPolicy({
		bundledTools: collectBundleMcpDiagnosticSentinels(params),
		config: params.cfg,
		conversationCapabilityProfile: resolveConversationCapabilityProfile({
			config: params.cfg,
			agentId: params.agentId,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model
		}),
		warn: () => {}
	}).length > 0;
}
function filterPolicyActiveBundleMcpDiagnostics(params) {
	return params.diagnostics.filter((diagnostic) => shouldReportBundleMcpRuntimeDiagnostic({
		cfg: params.cfg,
		agentId: params.agentId,
		modelRef: params.modelRef,
		diagnostic
	}));
}
async function collectRuntimeToolSchemaFindings(sourceConfig, options = {}) {
	const [{ captureRuntimeConfig }, { prepareDoctorToolSchemaFrames }, { collectAgentRuntimeToolSchemaFindings }] = await Promise.all([
		import("./runtime-source-projection-BE22sY9S.mjs"),
		import("./doctor-tool-schema-frames-BuZJm-CV.mjs"),
		import("./doctor-tool-schema-projection-BJiofoBA.mjs")
	]);
	const cfg = captureRuntimeConfig(sourceConfig);
	const env = options.env ?? process.env;
	const runWithPluginMetadataSnapshot = options.runWithPluginMetadataSnapshot ?? (await import("./plugin-metadata-snapshot-scope-Co0NzNM4.mjs")).createDoctorPluginMetadataSnapshotScope({ env }).run;
	const { frames, findings } = await prepareDoctorToolSchemaFrames(cfg, {
		...options,
		env,
		runWithPluginMetadataSnapshot
	});
	const deferMcpProbes = isUpdateDoctorLintPass(env);
	const deferredServers = /* @__PURE__ */ new Set();
	const bundleRuntimeByContext = /* @__PURE__ */ new Map();
	const bundleRuntimeLoadErrorsByContext = /* @__PURE__ */ new Map();
	const reportedBundleRuntimeDiagnostics = /* @__PURE__ */ new Set();
	const reportedBundleRuntimeLoadErrors = /* @__PURE__ */ new Set();
	const reportedRequesterScopedServers = /* @__PURE__ */ new Set();
	let inspection;
	try {
		if (frames.length > 0) {
			try {
				const [{ acquirePluginToolInspectionRegistry }, { resolvePluginRuntimeLoadContext }] = await Promise.all([import("./tools-DGB99LgV.mjs"), import("./load-context.resolve-DoB98wly.mjs")]);
				inspection = await runWithPluginMetadataSnapshot({ config: cfg }, () => acquirePluginToolInspectionRegistry({
					loadContext: resolvePluginRuntimeLoadContext({
						config: cfg,
						env
					}),
					runWithPluginMetadataSnapshot,
					scopes: frames.map((frame) => ({
						context: {
							config: cfg,
							runtimeConfig: cfg,
							agentId: frame.agentId,
							agentDir: frame.agentDir,
							workspaceDir: frame.workspaceDir
						},
						env,
						allowGatewaySubagentBinding: true,
						toolAllowlist: appendRuntimePluginToolGrant(frame.capabilityProfile.policy.explicitToolAllowlist, frame.capabilityProfile.policy.runtimePluginToolGrant),
						toolDenylist: frame.capabilityProfile.policy.explicitToolDenylist
					}))
				}));
			} catch (error) {
				findings.push({
					checkId: "core/doctor/runtime-tool-schemas",
					severity: "warning",
					message: "Runtime tool schema inspection could not prepare plugin registrations.",
					requirement: formatErrorMessage(error),
					fixHint: "Fix plugin loading errors, then rerun doctor to inspect active tools."
				});
				return findings;
			}
			for (const plugin of inspection.registry?.plugins ?? []) if (plugin.status === "error") findings.push({
				checkId: "core/doctor/runtime-tool-schemas",
				severity: "warning",
				message: `Plugin ${plugin.id} tool schemas were not inspected because registration failed.`,
				path: `plugins.entries.${plugin.id}`,
				target: plugin.id,
				requirement: plugin.error ?? "plugin-registration-failed",
				fixHint: "Fix or disable the plugin, then rerun doctor."
			});
		}
		for (const frame of frames) {
			const { agentId, agentDir, workspaceDir, modelRef, model } = frame;
			const collectForAgent = async () => {
				findings.push(...await withPluginRuntimeRegistryScope(inspection?.registry, () => collectAgentRuntimeToolSchemaFindings({
					...frame,
					cfg
				})));
				if (!shouldCreateBundleMcpRuntimeForAttempt({ toolsEnabled: true })) return;
				const fullMcpConfig = loadSessionMcpConfig({
					workspaceDir,
					cfg,
					logDiagnostics: false
				});
				if (deferMcpProbes) {
					for (const serverName of Object.keys(fullMcpConfig.loaded.mcpServers)) {
						if (deferredServers.has(serverName)) continue;
						deferredServers.add(serverName);
						findings.push({
							checkId: "core/doctor/runtime-tool-schemas",
							severity: "warning",
							message: `MCP server "${sanitizeTerminalText(serverName)}" was not started for update validation. Run \`openclaw doctor --lint --only core/doctor/runtime-tool-schemas\` after the update to inspect its tools.`,
							path: `mcp.servers.${serverName}`
						});
					}
					return;
				}
				const safeServerNamesByServer = assignSafeServerNames(Object.keys(fullMcpConfig.loaded.mcpServers));
				const { requesterScopedServerNames } = partitionMcpServersByConnectionScope(fullMcpConfig.loaded.mcpServers);
				for (const serverName of requesterScopedServerNames) {
					if (reportedRequesterScopedServers.has(serverName)) continue;
					const diagnostic = {
						serverName,
						safeServerName: safeServerNamesByServer.get(serverName) ?? serverName,
						launchSummary: "requester-scoped connection",
						message: "authenticated requester context required"
					};
					if (shouldReportBundleMcpRuntimeDiagnostic({
						cfg,
						agentId,
						modelRef,
						diagnostic
					})) {
						findings.push(bundleMcpRequesterInspectionFinding(serverName));
						reportedRequesterScopedServers.add(serverName);
					}
				}
				const excludeServerNames = new Set(requesterScopedServerNames);
				for (const [serverName, server] of Object.entries(fullMcpConfig.loaded.mcpServers)) {
					if (excludeServerNames.has(serverName) || server.auth !== "oauth") continue;
					excludeServerNames.add(serverName);
					const diagnostic = {
						serverName,
						safeServerName: safeServerNamesByServer.get(serverName) ?? serverName,
						launchSummary: "OAuth inspection deferred",
						message: "OAuth refresh requires durable credential ownership"
					};
					if (!reportedBundleRuntimeDiagnostics.has(serverName) && shouldReportBundleMcpRuntimeDiagnostic({
						cfg,
						agentId,
						modelRef,
						diagnostic
					})) {
						findings.push({
							checkId: "core/doctor/runtime-tool-schemas",
							severity: "info",
							message: `Configured MCP server "${serverName}" was not probed during read-only inspection because OAuth may rotate external credentials.`,
							path: `mcp.servers.${serverName}`,
							fixHint: "For configured servers, run `openclaw mcp probe <name>` against the serving configuration. Validate plugin-provided or agent-local MCP servers from an authenticated serving-agent turn so refreshed credentials persist with their owner."
						});
						reportedBundleRuntimeDiagnostics.add(serverName);
					}
				}
				const runtimeContext = loadSessionMcpConfig({
					workspaceDir,
					cfg,
					logDiagnostics: false,
					excludeServerNames,
					safeServerNamesByServer
				}).fingerprint;
				if (!bundleRuntimeByContext.has(runtimeContext) && !bundleRuntimeLoadErrorsByContext.has(runtimeContext)) try {
					const { createBundleMcpToolRuntime } = await import("./agent-bundle-mcp-tools-5kGNSe-X.mjs");
					bundleRuntimeByContext.set(runtimeContext, await createBundleMcpToolRuntime({
						workspaceDir,
						agentDir,
						cfg,
						excludeServerNames,
						safeServerNamesByServer
					}));
				} catch (error) {
					bundleRuntimeLoadErrorsByContext.set(runtimeContext, bundleMcpRuntimeLoadFailureFinding(error));
				}
				const bundleRuntimeLoadError = bundleRuntimeLoadErrorsByContext.get(runtimeContext);
				if (bundleRuntimeLoadError) {
					if (!reportedBundleRuntimeLoadErrors.has(runtimeContext)) {
						findings.push(bundleRuntimeLoadError);
						reportedBundleRuntimeLoadErrors.add(runtimeContext);
					}
					return;
				}
				const bundleRuntime = bundleRuntimeByContext.get(runtimeContext);
				if (bundleRuntime) {
					if (bundleRuntime.diagnostics && bundleRuntime.diagnostics.length > 0) {
						const policyActiveDiagnostics = filterPolicyActiveBundleMcpDiagnostics({
							diagnostics: bundleRuntime.diagnostics,
							cfg,
							agentId,
							modelRef
						});
						for (const diagnostic of policyActiveDiagnostics) {
							if (reportedBundleRuntimeDiagnostics.has(diagnostic.serverName)) continue;
							findings.push(bundleMcpRuntimeDiagnosticFinding(diagnostic));
							reportedBundleRuntimeDiagnostics.add(diagnostic.serverName);
						}
					}
					findings.push(...await collectBundleMcpRuntimeToolSchemaFindings({
						bundleRuntime,
						cfg,
						agentId,
						workspaceDir,
						modelRef,
						model
					}));
				}
			};
			await runWithPluginMetadataSnapshot({
				config: cfg,
				workspaceDir
			}, collectForAgent);
		}
	} finally {
		const cleanup = await Promise.allSettled([...bundleRuntimeByContext.values()].map(async (runtime) => await runtime.dispose()));
		for (const outcome of cleanup) if (outcome.status === "rejected") findings.push({
			checkId: "core/doctor/runtime-tool-schemas",
			severity: "error",
			message: "Configured MCP tool schema inspection could not confirm child-process cleanup.",
			path: "mcp.servers",
			requirement: formatErrorMessage(outcome.reason),
			fixHint: "Inspect or stop the configured MCP server processes, then rerun doctor."
		});
		if (inspection && options.deferInspectionDisposal) {
			const resource = inspection;
			options.deferInspectionDisposal(() => resource.release());
		} else try {
			await inspection?.release();
		} catch (error) {
			findings.push({
				checkId: "core/doctor/runtime-tool-schemas",
				severity: "warning",
				message: "Runtime tool schema inspection could not confirm plugin cleanup.",
				requirement: formatErrorMessage(error),
				fixHint: "Inspect the plugin cleanup error, then rerun doctor."
			});
		}
	}
	return findings;
}
//#endregion
export { collectRuntimeToolSchemaFindings };
