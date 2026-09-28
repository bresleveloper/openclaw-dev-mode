import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as createMigrationConfigPatchItem, c as hasMigrationConfigPatchConflict, f as mergeMigrationConfigValue, s as createMigrationManualItem } from "./migration-DepQtnwV.mjs";
import { n as childRecord, s as readStringArray, u as sanitizeName } from "./helpers-CRQ7DHOz.mjs";
import { r as providerConfig } from "./config-provider-contract-xoeitNVm.mjs";
import { n as mapMcpServer, r as mcpManualItems, t as importsMcpSensitiveValues } from "./config-mcp--N-o4SO1.mjs";
import { i as providerManualItems, r as collectHermesProviders, t as addSelectedModelToProvider } from "./config-providers-BNc2s8KI.mjs";
import { parse } from "yaml";
//#region extensions/migrate-hermes/config.ts
function mapSkillEntries(config) {
	const skills = childRecord(config, "skills");
	const entries = /* @__PURE__ */ new Map();
	for (const [skillKey, value] of Object.entries(childRecord(skills, "config"))) if (isRecord(value)) entries.set(skillKey, { config: value });
	let disabled = skills.disabled;
	if (typeof disabled === "string" && disabled.trimStart().startsWith("[")) try {
		disabled = parse(disabled);
	} catch {}
	for (const value of readStringArray(Array.isArray(disabled) ? disabled : [disabled])) {
		const skillKey = value.trim();
		if (skillKey !== "hermes-agent") entries.set(skillKey, {
			...entries.get(skillKey),
			enabled: false
		});
	}
	return asNonArrayRecord(mergeMigrationConfigValue({}, Object.fromEntries(entries)));
}
function buildConfigItems(params) {
	const items = [];
	const addConfigPatch = (patch) => {
		items.push(createMigrationConfigPatchItem({
			...patch,
			conflict: !params.ctx.overwrite && hasMigrationConfigPatchConflict(params.ctx.config, patch.path, patch.value)
		}));
	};
	const memory = childRecord(params.config, "memory");
	const memoryProvider = normalizeOptionalString(memory.provider);
	if (params.hasMemoryFiles || memoryProvider) addConfigPatch({
		id: "config:memory-plugin-slot",
		target: "plugins.slots",
		path: ["plugins", "slots"],
		value: { memory: "memory-core" },
		message: "Select the default OpenClaw memory plugin for imported file memory."
	});
	if (memoryProvider === "honcho") {
		addConfigPatch({
			id: "config:memory-plugin:honcho",
			target: "plugins.entries.honcho",
			path: ["plugins", "entries"],
			value: { honcho: {
				enabled: true,
				config: childRecord(memory, "honcho")
			} },
			message: "Preserve Hermes Honcho memory settings as a plugin entry for manual activation."
		});
		items.push(createMigrationManualItem({
			id: "manual:memory-provider:honcho",
			source: "config.yaml:memory.provider",
			message: "Hermes used Honcho memory. OpenClaw keeps built-in memory selected until the matching plugin is installed and reviewed.",
			recommendation: "Install or review the Honcho memory plugin before selecting it for plugins.slots.memory."
		}));
	} else if (memoryProvider && ![
		"builtin",
		"file",
		"files"
	].includes(memoryProvider)) items.push(createMigrationManualItem({
		id: `manual:memory-provider:${memoryProvider}`,
		source: "config.yaml:memory.provider",
		message: `Hermes memory provider "${memoryProvider}" does not have a known OpenClaw mapping.`,
		recommendation: "Install or configure an equivalent OpenClaw memory plugin manually."
	}));
	const providers = collectHermesProviders(params.config, params.env, Boolean(params.ctx.includeSecrets));
	addSelectedModelToProvider(providers, params.modelRef);
	for (const provider of providers) {
		const value = { [provider.id]: providerConfig(provider) };
		addConfigPatch({
			id: `config:model-provider:${sanitizeName(provider.id)}`,
			target: `models.providers.${provider.id}`,
			path: ["models", "providers"],
			value,
			message: `Import Hermes provider and custom endpoint config for "${provider.id}".`,
			sensitive: provider.sensitive
		});
	}
	items.push(...providerManualItems(params.config, params.env ?? {}, Boolean(params.ctx.includeSecrets)));
	const mcpConfig = params.config.mcp;
	const rawMcpServers = params.config.mcp_servers ?? (isRecord(mcpConfig) && isRecord(mcpConfig.servers) ? mcpConfig.servers : mcpConfig);
	const rawMcpSource = params.config.mcp_servers !== void 0 ? "config.yaml:mcp_servers" : isRecord(mcpConfig) && isRecord(mcpConfig.servers) ? "config.yaml:mcp.servers" : "config.yaml:mcp";
	if (isRecord(rawMcpServers)) {
		const mcpEnv = {
			...params.runtimeEnv,
			...params.env
		};
		for (const [name, rawServer] of Object.entries(rawMcpServers)) {
			if (!isRecord(rawServer)) continue;
			const server = mapMcpServer(rawServer, Boolean(params.ctx.includeSecrets), mcpEnv);
			if (Object.keys(server).length > 0) {
				const value = { [name]: server };
				addConfigPatch({
					id: `config:mcp-server:${sanitizeName(name)}`,
					target: `mcp.servers.${name}`,
					path: ["mcp", "servers"],
					value,
					message: `Import Hermes MCP server definition "${name}".`,
					sensitive: importsMcpSensitiveValues(rawServer, Boolean(params.ctx.includeSecrets))
				});
			}
			items.push(...mcpManualItems({
				name,
				raw: rawServer,
				includeSecrets: Boolean(params.ctx.includeSecrets),
				env: mcpEnv,
				source: `${rawMcpSource}.${name}`
			}));
		}
	}
	for (const [skillKey, value] of Object.entries(mapSkillEntries(params.config))) {
		const configPath = [
			"skills",
			"entries",
			skillKey
		];
		addConfigPatch({
			id: `config:skill-entry:${sanitizeName(skillKey)}`,
			target: configPath.join("."),
			path: configPath,
			value,
			message: "Import Hermes skill config values and global disabled state."
		});
	}
	return items;
}
//#endregion
export { buildConfigItems as t };
