import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import "./agent-scope-B2Pk_xhT.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir, s as resolveDefaultAgentDir, t as listAgentEntries } from "./agent-scope-config-BxAUeF6t.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CngxywqI.js";
import "./defaults-mDjiWzE5.js";
import { i as resolveGatewayService, r as readGatewayServiceState } from "./service-BE0QKgp3.js";
import { t as getSystemdCgroupHygieneSummary } from "./service-runtime-Cy_yLpbt.js";
import { s as buildGatewayProbeConnectionDetails } from "./call-5Sj7eTyY.js";
import { S as findModelInCatalog } from "./model-selection-shared-DwnYeyqq.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-CFL1kjzt.js";
import { n as loadModelCatalog } from "./model-catalog-CJwDdG-7.js";
import { i as collectExplicitAllowlist, m as normalizeToolName } from "./tool-policy-BHUGxE3p.js";
import { i as getPluginToolMeta, s as setPluginToolMeta } from "./tools-D0RJIgtl.js";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-DtIGhSS3.js";
import "./agent-bundle-mcp-tools-YySi1utk.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-ZlnPcYNM.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CyHg4VZy.js";
import { _ as supportsModelTools } from "./openai-transport-stream-BR-Qo1HB.js";
import { t as buildWorkspaceSkillStatus } from "./status-DS0ZepJw.js";
import { t as createOpenClawCodingTools } from "./agent-tools-B8Z3K_fP.js";
import { r as inspectRuntimeToolInputSchemas } from "./tool-schema-projection-BtVCT_Zc.js";
import { n as normalizeAgentRuntimeTools } from "./tools-DmCDHwa6.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-Ci-oM9oO.js";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-B_ioY5W5.js";
import { t as collectUnavailableAgentSkills } from "./doctor-skills-core-DZQVCoNO.js";
import { t as probeGatewayStatus } from "./probe-Cw_-wwTn.js";
import { a as gatewayProbeResultSawGateway } from "./gateway-health-auth-diagnostic-Bd2f-neB.js";
//#region src/flows/doctor-core-checks.runtime.ts
const PROVIDER_CATALOG_ORDERS = [
	"simple",
	"profile",
	"paired",
	"late"
];
const PROVIDER_CATALOG_ORDER_SET = new Set(PROVIDER_CATALOG_ORDERS);
function formatGatewayHealthTarget(url) {
	return redactSensitiveUrlLikeString(url);
}
function detectUnavailableSkills(cfg) {
	const agentId = resolveDefaultAgentId(cfg);
	return collectUnavailableAgentSkills(buildWorkspaceSkillStatus(resolveAgentWorkspaceDir(cfg, agentId), {
		config: cfg,
		agentId
	}));
}
async function collectGatewayHealthFindings(ctx) {
	let probeDetails;
	try {
		probeDetails = await buildGatewayProbeConnectionDetails({
			config: ctx.cfg,
			...ctx.configPath ? { configPath: ctx.configPath } : {}
		});
	} catch (error) {
		return [{
			checkId: "core/doctor/gateway-health",
			severity: "warning",
			message: `Gateway health probe could not be prepared: ${formatErrorMessage(error)}`,
			path: ctx.cfg.gateway?.mode === "remote" ? "gateway.remote.url" : "gateway",
			fixHint: "Fix Gateway connection configuration, then rerun `openclaw doctor --lint --only core/doctor/gateway-health`."
		}];
	}
	const probe = await probeGatewayStatus({
		url: probeDetails.url,
		timeoutMs: 3e3,
		tlsFingerprint: probeDetails.tlsFingerprint,
		preauthHandshakeTimeoutMs: probeDetails.preauthHandshakeTimeoutMs,
		config: ctx.cfg,
		json: true
	});
	if (gatewayProbeResultSawGateway(probe)) return [];
	const mode = ctx.cfg.gateway?.mode === "remote" ? "remote" : "local";
	return [{
		checkId: "core/doctor/gateway-health",
		severity: "warning",
		message: `Gateway is not reachable: ${probe.error ?? "status probe failed"}`,
		path: mode === "remote" ? "gateway.remote.url" : "gateway.mode",
		target: formatGatewayHealthTarget(probeDetails.url),
		fixHint: mode === "remote" ? "Verify the remote Gateway URL, network path, TLS settings, and credentials." : "Start the Gateway service or run `openclaw doctor --fix` for service repair prompts."
	}];
}
function gatewayRuntimeStatus(runtime) {
	return runtime?.status ?? runtime?.state ?? runtime?.subState;
}
async function collectGatewayDaemonFindings(ctx) {
	if (ctx.cfg.gateway?.mode === "remote") return [];
	const service = resolveGatewayService();
	const state = await readGatewayServiceState(service, { env: process.env });
	const findings = [];
	if (!state.installed) {
		findings.push({
			checkId: "core/doctor/gateway-daemon",
			severity: "warning",
			message: "Gateway service is not installed.",
			path: "gateway.mode",
			target: service.label,
			fixHint: "Run `openclaw doctor --fix` or `openclaw gateway install` to install it."
		});
		return findings;
	}
	if (!state.loaded) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: "Gateway service is installed but not loaded.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: "Run `openclaw doctor --fix` or `openclaw gateway start` to load it."
	});
	const status = gatewayRuntimeStatus(state.runtime);
	if (state.loaded && !state.running) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: status ? `Gateway service runtime is ${status}, not running.` : "Gateway service is loaded but runtime status could not confirm it is running.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: "Run `openclaw gateway status --deep` or `openclaw doctor --fix` for repair hints."
	});
	if (state.runtime?.missingGuiSession) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: "Gateway service cannot attach to the user GUI session.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: state.runtime.detail ?? "Log into a GUI session, then rerun doctor."
	});
	if (state.runtime?.missingSupervision || state.runtime?.missingUnit) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: "Gateway service supervision metadata is missing.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: state.runtime.detail ?? "Reinstall or reload the Gateway service."
	});
	const hygiene = getSystemdCgroupHygieneSummary(state.runtime?.systemd);
	if (hygiene) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: `Gateway systemd service has risky ${hygiene}.`,
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: "Repair the systemd unit so stale child processes are cleaned up reliably."
	});
	return findings;
}
function providerCatalogPath(pluginId) {
	return pluginId ? `plugins.entries.${pluginId}` : void 0;
}
function providerCatalogProjectionFinding(params) {
	const path = providerCatalogPath(params.pluginId);
	return {
		checkId: "core/doctor/provider-catalog-projection",
		severity: "error",
		message: params.message,
		...path ? { path } : {},
		target: params.providerId,
		requirement: formatErrorMessage(params.error),
		fixHint: "Fix the plugin provider catalog hook or disable the plugin, then rerun doctor before relying on model discovery."
	};
}
function isReadableRecord(value) {
	return value !== null && typeof value === "object";
}
function isTrimmedNonEmptyString(value) {
	return typeof value === "string" && value.trim() === value && value.length > 0;
}
function hasProviderCatalogKey(params) {
	try {
		return {
			ok: true,
			present: params.key in params.value
		};
	} catch (error) {
		return {
			ok: false,
			finding: providerCatalogProjectionFinding({
				providerId: params.providerId,
				pluginId: params.pluginId,
				message: `Provider catalog ${params.providerId} result keys cannot be checked during doctor validation.`,
				error
			})
		};
	}
}
function readProviderCatalogValue(params) {
	if (!isReadableRecord(params.value)) return {
		ok: true,
		value: void 0
	};
	try {
		return {
			ok: true,
			value: params.value[params.key]
		};
	} catch (error) {
		return {
			ok: false,
			finding: providerCatalogProjectionFinding({
				providerId: params.providerId,
				pluginId: params.pluginId,
				message: `Provider catalog ${params.providerId} entry cannot be read during doctor validation.`,
				error
			})
		};
	}
}
function collectProviderCatalogModelFindings(params) {
	const findings = [];
	let models;
	try {
		if (!Array.isArray(params.models)) return [providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} models value is invalid during doctor validation.`,
			error: /* @__PURE__ */ new Error("models must be an array")
		})];
		models = params.models;
	} catch (error) {
		return [providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} models value cannot be checked during doctor validation.`,
			error
		})];
	}
	let modelEntries;
	try {
		modelEntries = [];
		let index = 0;
		for (const model of models) {
			modelEntries.push([index, model]);
			index += 1;
		}
	} catch (error) {
		return [providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} model rows cannot be enumerated during doctor validation.`,
			error
		})];
	}
	for (const [index, model] of modelEntries) {
		const modelId = readProviderCatalogValue({
			value: model,
			key: "id",
			providerId: params.providerId,
			pluginId: params.pluginId
		});
		if (!modelId.ok) {
			findings.push(modelId.finding);
			continue;
		}
		if (!isTrimmedNonEmptyString(modelId.value)) findings.push(providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} model row ${index} has an invalid model id.`,
			error: /* @__PURE__ */ new Error("model id must be a non-empty trimmed string")
		}));
		const modelName = readProviderCatalogValue({
			value: model,
			key: "name",
			providerId: params.providerId,
			pluginId: params.pluginId
		});
		if (!modelName.ok) {
			findings.push(modelName.finding);
			continue;
		}
		if (modelName.value !== void 0 && typeof modelName.value !== "string") findings.push(providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} model row ${index} has an invalid model name.`,
			error: /* @__PURE__ */ new Error("model name must be a string when present")
		}));
	}
	return findings;
}
function collectProviderCatalogResultFindings(params) {
	if (params.result == null) return [];
	if (!isReadableRecord(params.result)) return [providerCatalogProjectionFinding({
		providerId: params.providerId,
		pluginId: params.pluginId,
		message: `Provider catalog ${params.providerId} result is invalid during doctor validation.`,
		error: /* @__PURE__ */ new Error("result must be an object")
	})];
	const hasProvider = hasProviderCatalogKey({
		value: params.result,
		key: "provider",
		providerId: params.providerId,
		pluginId: params.pluginId
	});
	if (!hasProvider.ok) return [hasProvider.finding];
	const provider = readProviderCatalogValue({
		value: params.result,
		key: "provider",
		providerId: params.providerId,
		pluginId: params.pluginId
	});
	if (!provider.ok) return [provider.finding];
	if (hasProvider.present && !isReadableRecord(provider.value)) return [providerCatalogProjectionFinding({
		providerId: params.providerId,
		pluginId: params.pluginId,
		message: `Provider catalog ${params.providerId} provider value is invalid during doctor validation.`,
		error: /* @__PURE__ */ new Error("provider must be an object")
	})];
	if (isReadableRecord(provider.value)) {
		const models = readProviderCatalogValue({
			value: provider.value,
			key: "models",
			providerId: params.providerId,
			pluginId: params.pluginId
		});
		return models.ok ? collectProviderCatalogModelFindings({
			...params,
			models: models.value
		}) : [models.finding];
	}
	const providers = readProviderCatalogValue({
		value: params.result,
		key: "providers",
		providerId: params.providerId,
		pluginId: params.pluginId
	});
	if (!providers.ok) return [providers.finding];
	if (!isReadableRecord(providers.value)) return [providerCatalogProjectionFinding({
		providerId: params.providerId,
		pluginId: params.pluginId,
		message: `Provider catalog ${params.providerId} result is invalid during doctor validation.`,
		error: /* @__PURE__ */ new Error("result must include provider or providers object")
	})];
	let providerIds;
	try {
		providerIds = Object.keys(providers.value);
	} catch (error) {
		return [providerCatalogProjectionFinding({
			providerId: params.providerId,
			pluginId: params.pluginId,
			message: `Provider catalog ${params.providerId} provider entries cannot be enumerated during doctor validation.`,
			error
		})];
	}
	const findings = [];
	for (const providerId of providerIds) {
		if (!isTrimmedNonEmptyString(providerId)) {
			findings.push(providerCatalogProjectionFinding({
				providerId: params.providerId,
				pluginId: params.pluginId,
				message: `Provider catalog ${params.providerId} provider key is invalid during doctor validation.`,
				error: /* @__PURE__ */ new Error("provider key must be a non-empty trimmed string")
			}));
			continue;
		}
		const providerConfig = readProviderCatalogValue({
			value: providers.value,
			key: providerId,
			providerId,
			pluginId: params.pluginId
		});
		if (!providerConfig.ok) {
			findings.push(providerConfig.finding);
			continue;
		}
		if (!isReadableRecord(providerConfig.value)) {
			findings.push(providerCatalogProjectionFinding({
				providerId,
				pluginId: params.pluginId,
				message: `Provider catalog ${providerId} provider entry is invalid during doctor validation.`,
				error: /* @__PURE__ */ new Error("provider entry must be an object")
			}));
			continue;
		}
		const models = readProviderCatalogValue({
			value: providerConfig.value,
			key: "models",
			providerId,
			pluginId: params.pluginId
		});
		findings.push(...models.ok ? collectProviderCatalogModelFindings({
			providerId,
			pluginId: params.pluginId,
			models: models.value
		}) : [models.finding]);
	}
	return findings;
}
function readProviderCatalogOrder(provider) {
	let order;
	try {
		order = provider.staticCatalog?.order ?? "late";
	} catch (error) {
		return {
			ok: false,
			finding: providerCatalogProjectionFinding({
				providerId: provider.id,
				pluginId: provider.pluginId,
				message: `Provider catalog ${provider.id} order cannot be read during doctor validation.`,
				error
			})
		};
	}
	if (PROVIDER_CATALOG_ORDER_SET.has(order)) return {
		ok: true,
		order
	};
	return {
		ok: false,
		finding: providerCatalogProjectionFinding({
			providerId: provider.id,
			pluginId: provider.pluginId,
			message: `Provider catalog ${provider.id} order is invalid during doctor validation.`,
			error: /* @__PURE__ */ new Error("order must be simple, profile, paired, or late")
		})
	};
}
function groupProviderCatalogsForDoctor(providers) {
	const findings = [];
	const byOrder = {
		simple: [],
		profile: [],
		paired: [],
		late: []
	};
	for (const provider of providers) {
		const order = readProviderCatalogOrder(provider);
		if (!order.ok) {
			findings.push(order.finding);
			byOrder.late.push(provider);
			continue;
		}
		byOrder[order.order].push(provider);
	}
	for (const order of PROVIDER_CATALOG_ORDERS) byOrder[order].sort((a, b) => a.label.localeCompare(b.label));
	return {
		findings,
		byOrder
	};
}
async function collectProviderCatalogProjectionFindings(cfg) {
	const { runProviderStaticCatalog } = await import("./provider-discovery-Bxfyrdl7.js");
	const { resolvePluginProviders } = await import("./providers.runtime.js");
	const env = process.env;
	const agentDir = resolveDefaultAgentDir(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
	let providers;
	try {
		providers = resolvePluginProviders({
			config: cfg,
			workspaceDir,
			env,
			includeUntrustedWorkspacePlugins: false
		});
	} catch (error) {
		return [{
			checkId: "core/doctor/provider-catalog-projection",
			severity: "error",
			message: "Provider catalog hooks could not be loaded for doctor validation.",
			requirement: formatErrorMessage(error),
			fixHint: "Fix plugin provider discovery loading, then rerun doctor."
		}];
	}
	const findings = [];
	const grouped = groupProviderCatalogsForDoctor(providers);
	findings.push(...grouped.findings);
	for (const order of PROVIDER_CATALOG_ORDERS) for (const provider of grouped.byOrder[order]) {
		let staticCatalog;
		let staticCatalogRun;
		try {
			staticCatalog = provider.staticCatalog;
			staticCatalogRun = isReadableRecord(staticCatalog) ? staticCatalog.run : void 0;
		} catch (error) {
			findings.push(providerCatalogProjectionFinding({
				providerId: provider.id,
				pluginId: provider.pluginId,
				message: `Provider catalog ${provider.id} static catalog hook cannot be read during doctor validation.`,
				error
			}));
			continue;
		}
		if (staticCatalog === void 0) continue;
		if (typeof staticCatalogRun !== "function") {
			findings.push(providerCatalogProjectionFinding({
				providerId: provider.id,
				pluginId: provider.pluginId,
				message: `Provider catalog ${provider.id} static catalog hook is invalid during doctor validation.`,
				error: /* @__PURE__ */ new Error("static catalog run must be a function")
			}));
			continue;
		}
		let result;
		try {
			result = await runProviderStaticCatalog({
				provider,
				config: cfg,
				agentDir,
				workspaceDir,
				env
			});
		} catch (error) {
			findings.push(providerCatalogProjectionFinding({
				providerId: provider.id,
				pluginId: provider.pluginId,
				message: `Provider catalog ${provider.id} failed during doctor validation.`,
				error
			}));
			continue;
		}
		findings.push(...collectProviderCatalogResultFindings({
			providerId: provider.id,
			pluginId: provider.pluginId,
			result
		}));
	}
	return findings;
}
function buildDoctorRuntimeModel(params) {
	const provider = params.provider || "openai";
	const id = params.modelId || "gpt-5.5";
	const api = params.entry?.api ?? (provider === "openai" ? "openai-responses" : void 0);
	const baseUrl = params.entry?.baseUrl ?? (api === "openai-chatgpt-responses" ? "https://chatgpt.com/backend-api" : provider === "openai" ? "https://api.openai.com/v1" : void 0);
	return {
		...params.entry,
		provider,
		id,
		name: params.entry?.name ?? id,
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {}
	};
}
function toolSchemaDiagnosticToFinding(params) {
	let tool;
	try {
		tool = params.tools[params.diagnostic.toolIndex];
	} catch {
		tool = void 0;
	}
	const pluginId = tool ? getPluginToolMeta(tool)?.pluginId : void 0;
	const owner = pluginId ? ` from plugin ${pluginId}` : "";
	const agent = `Agent ${params.agentId} `;
	const path = pluginId === "bundle-mcp" ? "mcp.servers" : pluginId ? `plugins.entries.${pluginId}` : `tools.${params.diagnostic.toolName}`;
	const fixHint = pluginId === "bundle-mcp" ? "Disable or update the offending MCP server/tool so its parameters are a JSON object schema, then rerun doctor." : "Disable or update the offending plugin/tool so its parameters are a JSON object schema, then rerun doctor.";
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `${agent}tool ${params.diagnostic.toolName}${owner} has an unsupported input schema for runtime projection.`,
		path,
		target: params.diagnostic.toolName,
		requirement: params.diagnostic.violations.join(", "),
		fixHint
	};
}
function collectToolSchemaFindings(params) {
	return inspectRuntimeToolInputSchemas(params.tools).map((diagnostic) => toolSchemaDiagnosticToFinding({
		agentId: params.agentId,
		tools: params.tools,
		diagnostic
	}));
}
function collectNormalizedToolSchemaFindings(params) {
	const preNormalizationFindings = [];
	let normalizedTools;
	try {
		normalizedTools = normalizeAgentRuntimeTools({
			tools: params.tools,
			provider: params.modelRef.provider,
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			modelId: params.modelRef.model,
			modelApi: params.model.api,
			model: params.model,
			onPreNormalizationSchemaDiagnostics: (diagnostics, sourceTools) => {
				preNormalizationFindings.push(...diagnostics.map((diagnostic) => toolSchemaDiagnosticToFinding({
					agentId: params.agentId,
					tools: sourceTools,
					diagnostic
				})));
			}
		});
	} catch (error) {
		return [...preNormalizationFindings, params.normalizationFailureFinding(error)];
	}
	return [...preNormalizationFindings, ...collectToolSchemaFindings({
		agentId: params.agentId,
		tools: normalizedTools
	})];
}
function collectBundleMcpRuntimeToolSchemaFindings(params) {
	const activeBundleTools = applyFinalEffectiveToolPolicy({
		bundledTools: params.bundleRuntime.tools,
		config: params.cfg,
		conversationCapabilityProfile: resolveConversationCapabilityProfile({
			config: params.cfg,
			agentId: params.agentId,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model
		}),
		warn: () => {},
		toolPolicyAuditLogLevel: "debug"
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
function agentRuntimeToolLoadFailureFinding(params) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `Agent ${params.agentId} runtime tool schema validation could not load the runtime tool set.`,
		path: `agents.${params.agentId}.tools`,
		requirement: formatErrorMessage(params.error),
		fixHint: "Fix provider/plugin tool loading errors, then rerun doctor before relying on assistant tool startup."
	};
}
function agentRuntimeToolNormalizationFailureFinding(params) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `Agent ${params.agentId} runtime tool schema validation could not normalize the runtime tool set.`,
		path: `agents.${params.agentId}.tools`,
		requirement: formatErrorMessage(params.error),
		fixHint: "Fix provider/plugin schema normalization errors, then rerun doctor before relying on assistant tool startup."
	};
}
function collectAgentRuntimeToolSchemaFindings(params) {
	let tools;
	try {
		tools = createOpenClawCodingTools({
			agentId: params.agentId,
			workspaceDir: params.workspaceDir,
			config: params.cfg,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model,
			modelApi: params.model.api,
			modelCompat: params.model.compat,
			modelContextWindowTokens: params.model.contextWindow,
			allowGatewaySubagentBinding: true,
			emitBeforeToolCallDiagnostics: false,
			toolPolicyAuditLogLevel: "debug"
		});
	} catch (error) {
		return [agentRuntimeToolLoadFailureFinding({
			agentId: params.agentId,
			error
		})];
	}
	return collectNormalizedToolSchemaFindings({
		agentId: params.agentId,
		tools,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		modelRef: params.modelRef,
		model: params.model,
		normalizationFailureFinding: (error) => agentRuntimeToolNormalizationFailureFinding({
			agentId: params.agentId,
			error
		})
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
	const normalized = normalizeToolName(params.allowlistEntry);
	const serverPrefix = normalizeToolName(`${params.safeServerName}__`);
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
		warn: () => {},
		toolPolicyAuditLogLevel: "debug"
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
function isAcpRuntimeAgent(cfg, agentId) {
	return listAgentEntries(cfg).find((candidate) => normalizeAgentId(candidate.id) === agentId)?.runtime?.type === "acp";
}
async function collectRuntimeToolSchemaFindings(cfg) {
	const catalog = await loadModelCatalog({ config: cfg });
	const findings = [];
	const bundleRuntimeByWorkspace = /* @__PURE__ */ new Map();
	const bundleRuntimeLoadErrorsByWorkspace = /* @__PURE__ */ new Map();
	const reportedBundleRuntimeLoadErrors = /* @__PURE__ */ new Set();
	try {
		for (const agentId of listAgentIds(cfg)) {
			if (isAcpRuntimeAgent(cfg, agentId)) continue;
			const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
			const modelRef = resolveDefaultModelForAgent({
				cfg,
				agentId,
				allowPluginNormalization: true
			});
			const model = buildDoctorRuntimeModel({
				entry: findModelInCatalog(catalog, modelRef.provider, modelRef.model),
				provider: modelRef.provider,
				modelId: modelRef.model
			});
			if (!supportsModelTools(model)) continue;
			findings.push(...collectAgentRuntimeToolSchemaFindings({
				cfg,
				agentId,
				workspaceDir,
				modelRef,
				model
			}));
			if (!shouldCreateBundleMcpRuntimeForAttempt({ toolsEnabled: true })) continue;
			if (!bundleRuntimeByWorkspace.has(workspaceDir) && !bundleRuntimeLoadErrorsByWorkspace.has(workspaceDir)) try {
				bundleRuntimeByWorkspace.set(workspaceDir, await createBundleMcpToolRuntime({
					workspaceDir,
					cfg
				}));
			} catch (error) {
				bundleRuntimeLoadErrorsByWorkspace.set(workspaceDir, bundleMcpRuntimeLoadFailureFinding(error));
			}
			const bundleRuntimeLoadError = bundleRuntimeLoadErrorsByWorkspace.get(workspaceDir);
			if (bundleRuntimeLoadError) {
				if (!reportedBundleRuntimeLoadErrors.has(workspaceDir)) {
					findings.push(bundleRuntimeLoadError);
					reportedBundleRuntimeLoadErrors.add(workspaceDir);
				}
				continue;
			}
			const bundleRuntime = bundleRuntimeByWorkspace.get(workspaceDir);
			if (bundleRuntime) {
				if (bundleRuntime.diagnostics && bundleRuntime.diagnostics.length > 0) {
					const policyActiveDiagnostics = filterPolicyActiveBundleMcpDiagnostics({
						diagnostics: bundleRuntime.diagnostics,
						cfg,
						agentId,
						modelRef
					});
					findings.push(...policyActiveDiagnostics.map(bundleMcpRuntimeDiagnosticFinding));
				}
				findings.push(...collectBundleMcpRuntimeToolSchemaFindings({
					bundleRuntime,
					cfg,
					agentId,
					workspaceDir,
					modelRef,
					model
				}));
			}
		}
	} finally {
		await Promise.all([...bundleRuntimeByWorkspace.values()].map((runtime) => runtime.dispose()));
	}
	return findings;
}
//#endregion
export { collectGatewayDaemonFindings, collectGatewayHealthFindings, collectProviderCatalogProjectionFindings, collectRuntimeToolSchemaFindings, detectUnavailableSkills };
