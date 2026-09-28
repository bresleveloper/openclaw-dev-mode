import { n as isNodeRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { M as tryResolveSoleAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as formatUnsupportedNodeVersionMessage } from "./node-version-DdJ6cN09.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as resolveNodeRuntimeInfo } from "./runtime-paths-DifTYoyV.mjs";
import { n as getSystemdCgroupHygieneSummary } from "./service-runtime-BuDPZetd.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-YFvztZiz.mjs";
import { n as inspectLocalAudioSelection, t as formatLocalAudioSelection } from "./local-audio-BUgxXnl2.mjs";
import { n as buildWorkspaceSkillStatus } from "./status-C5lk8raw.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-C2VQLl6Z.mjs";
import { t as collectUnavailableAgentSkills } from "./doctor-skills-core-DZQVCoNO.mjs";
//#region src/flows/doctor-core-checks.runtime.ts
const PROVIDER_CATALOG_ORDERS = [
	"simple",
	"profile",
	"paired",
	"late"
];
const PROVIDER_CATALOG_ORDER_SET = new Set(PROVIDER_CATALOG_ORDERS);
function detectUnavailableSkills(cfg, workspaceDir) {
	const report = buildWorkspaceSkillStatus(workspaceDir, {
		config: cfg,
		agentId: tryResolveSoleAgentId(cfg)
	});
	return collectUnavailableAgentSkills(report);
}
async function collectLocalAudioAccelerationFindings() {
	const selection = await inspectLocalAudioSelection();
	const available = selection.candidates.filter((candidate) => candidate.available);
	if (available.length === 0) return [];
	const summary = formatLocalAudioSelection(selection);
	if (summary) return [{
		checkId: "core/doctor/local-audio-acceleration",
		severity: "info",
		message: `Local STT auto-selection: ${summary}.`,
		path: "tools.media.models"
	}];
	return [{
		checkId: "core/doctor/local-audio-acceleration",
		severity: "info",
		message: `Local STT commands were found but none are ready for auto-selection: ${available.map((candidate) => `${candidate.command}: ${candidate.reason}`).join("; ")}.`,
		path: "tools.media.models",
		fixHint: "Install the matching local model/runtime, or configure an audio-capable tools.media.models CLI entry."
	}];
}
function gatewayRuntimeStatus(runtime) {
	return runtime?.status ?? runtime?.state ?? runtime?.subState;
}
async function collectGatewayDaemonFindings(ctx) {
	if (ctx.cfg.gateway?.mode === "remote" || !await shouldManageGatewayService()) return [];
	const service = resolveGatewayService();
	const state = await readGatewayServiceState(service, { env: process.env });
	const findings = [];
	if (state.loadState.status === "unknown") {
		findings.push({
			checkId: "core/doctor/gateway-daemon",
			severity: "warning",
			message: `Gateway service status could not be determined: ${state.loadState.detail}`,
			path: state.command?.sourcePath,
			target: service.label,
			fixHint: "Run `openclaw gateway status --deep`, restore service-manager access, and retry."
		});
		return findings;
	}
	if (!state.installed) {
		findings.push({
			checkId: "core/doctor/gateway-daemon",
			severity: "warning",
			message: "Gateway service is not installed.",
			path: "gateway.mode",
			target: service.label,
			fixHint: "Run `openclaw gateway install` to install the service."
		});
		return findings;
	}
	const nodePath = state.command?.programArguments[0];
	if (nodePath && isNodeRuntime(nodePath)) {
		const runtime = await resolveNodeRuntimeInfo(nodePath, state.env);
		const message = runtime.status === "probe-failed" ? runtime.error.message : runtime.capabilityError ?? runtime.note;
		if (message) findings.push({
			checkId: "core/doctor/gateway-daemon",
			severity: runtime.status === "supported" ? "info" : "warning",
			message,
			path: state.command?.sourcePath,
			target: nodePath,
			...runtime.status !== "supported" ? { fixHint: [...runtime.status === "unsupported" ? [formatUnsupportedNodeVersionMessage(runtime.version)] : [], "Repair the Node runtime, then run `openclaw gateway install`."].join("\n") } : {}
		});
	}
	if (state.loadState.status === "not-loaded") findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: "Gateway service is installed but not loaded.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: "Start the installed service with `openclaw gateway start`."
	});
	const status = gatewayRuntimeStatus(state.runtime);
	if (state.loadState.status === "loaded" && !state.running) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: status ? `Gateway service runtime is ${status}, not running.` : "Gateway service is loaded but runtime status could not confirm it is running.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: "Run `openclaw gateway status --deep` to inspect the service before choosing a recovery action."
	});
	if (state.runtime?.missingGuiSession) findings.push({
		checkId: "core/doctor/gateway-daemon",
		severity: "warning",
		message: "Gateway service cannot attach to the user GUI session.",
		path: state.command?.sourcePath,
		target: service.label,
		fixHint: state.runtime.detail ?? "Log into a GUI session, then rerun doctor."
	});
	if (state.runtime?.missingUnit) findings.push({
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
async function collectProviderCatalogProjectionFindings(cfg, workspaceDir) {
	const { runProviderStaticCatalog } = await import("./provider-discovery-FeQ0aZtT.mjs");
	const { resolvePluginProvidersCore } = await import("./providers.runtime.js");
	const env = process.env;
	let providers;
	try {
		providers = resolvePluginProvidersCore({
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
			result = await runProviderStaticCatalog({ provider });
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
//#endregion
export { collectGatewayDaemonFindings, collectLocalAudioAccelerationFindings, collectProviderCatalogProjectionFindings, detectUnavailableSkills };
