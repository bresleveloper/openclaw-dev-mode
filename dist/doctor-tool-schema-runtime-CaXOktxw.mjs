import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-CFVETBL6.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { i as collectExplicitAllowlist } from "./tool-policy-14GRhbFd.mjs";
import { a as setPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
import { u as partitionMcpServersByConnectionScope } from "./bundle-mcp-config-BEIeeWHy.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BY_ItTpJ.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { t as appendRuntimePluginToolGrant } from "./tool-grant-allowlist-WLMZChmq.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-jDkqpuYg.mjs";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-D12sns28.mjs";
//#region src/flows/doctor-tool-schema-runtime.ts
async function collectBundleMcpRuntimeToolSchemaFindings(params) {
	const { collectNormalizedToolSchemaFindings } = await import("./doctor-tool-schema-projection-Dlqfy3M2.mjs");
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
		...params,
		tools: activeBundleTools,
		normalizationFailureFinding: (error) => bundleMcpRuntimeFailureFinding(error, "normalize")
	});
}
function bundleMcpRuntimeFailureFinding(error, phase) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `Configured MCP tool schema validation could not ${phase} the runtime tool set.`,
		path: "mcp.servers",
		requirement: formatErrorMessage(error),
		fixHint: phase === "normalize" ? "Fix provider/plugin schema normalization errors, then rerun doctor before relying on assistant tool startup." : "Fix or disable the offending MCP server, then rerun doctor before relying on assistant tool startup."
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
		message: `Configured requester-scoped MCP server "${serverName}" was not checked without an authenticated requester.`,
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
async function collectRuntimeToolSchemaFindings(sourceConfig, options = {}) {
	try {
		var _usingCtx$1 = _usingCtx();
		const [{ captureRuntimeConfig }, { prepareDoctorToolSchemaFrames }, { collectAgentRuntimeToolSchemaFindings }] = await Promise.all([
			import("./runtime-source-projection-hRVww70X.mjs"),
			import("./doctor-tool-schema-frames-Bt9xsGCW.mjs"),
			import("./doctor-tool-schema-projection-Dlqfy3M2.mjs")
		]);
		const cfg = captureRuntimeConfig(sourceConfig);
		const env = options.env ?? process.env;
		const ownedMetadataScope = _usingCtx$1.a(options.runWithPluginMetadataSnapshot ? void 0 : (await import("./plugin-metadata-snapshot-scope-DcFL8x0C.mjs")).createDoctorPluginMetadataSnapshotScope({ env }));
		const runWithPluginMetadataSnapshot = options.runWithPluginMetadataSnapshot ?? ownedMetadataScope.run;
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
					const [{ acquirePluginToolInspectionRegistry }, { resolvePluginRuntimeLoadContext }] = await Promise.all([import("./tools-eN160jjr.mjs"), import("./load-context.resolve-D4j4FbHA.mjs")]);
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
			const toolRegistry = inspection?.registry ?? createEmptyPluginRegistry();
			for (const frame of frames) {
				const { agentId, agentDir, workspaceDir, modelRef, model } = frame;
				const collectForAgent = async () => {
					findings.push(...await withPluginRuntimeRegistryScope(inspection?.registry, () => collectAgentRuntimeToolSchemaFindings({
						...frame,
						cfg,
						toolRegistry
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
								message: `Configured MCP server "${serverName}" was not checked during read-only inspection because OAuth may rotate external credentials.`,
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
						const { createBundleMcpToolRuntime } = await import("./agent-bundle-mcp-tools-DyhjgasV.mjs");
						bundleRuntimeByContext.set(runtimeContext, await createBundleMcpToolRuntime({
							workspaceDir,
							agentDir,
							cfg,
							excludeServerNames,
							safeServerNamesByServer
						}));
					} catch (error) {
						bundleRuntimeLoadErrorsByContext.set(runtimeContext, bundleMcpRuntimeFailureFinding(error, "load"));
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
						const policyActiveDiagnostics = (bundleRuntime.diagnostics ?? []).filter((diagnostic) => shouldReportBundleMcpRuntimeDiagnostic({
							cfg,
							agentId,
							modelRef,
							diagnostic
						}));
						for (const diagnostic of policyActiveDiagnostics) {
							if (reportedBundleRuntimeDiagnostics.has(diagnostic.serverName)) continue;
							findings.push(bundleMcpRuntimeDiagnosticFinding(diagnostic));
							reportedBundleRuntimeDiagnostics.add(diagnostic.serverName);
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
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { collectRuntimeToolSchemaFindings };
