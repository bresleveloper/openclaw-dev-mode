import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { i as parseConcreteConfigPathTokens } from "./dot-path-CVD5Jolm.mjs";
import { n as getPath, r as setPathCreateStrict } from "./path-utils-DQXhHs4r.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
//#region src/wizard/setup.plugin-config.ts
const loadPluginMetadataSnapshotModule = createLazyRuntimeModule(() => import("./plugin-metadata-snapshot-DcoK08YM.mjs"));
function resolveJsonSchemaProperty(jsonSchema, pathSegments) {
	if (!jsonSchema) return;
	let cursor = jsonSchema;
	for (const segment of pathSegments) {
		if (!cursor || typeof cursor !== "object") return;
		const schema = cursor;
		const properties = schema.properties;
		cursor = schema.type === "array" ? schema.items : properties && typeof properties === "object" ? properties[String(segment)] : void 0;
	}
	return cursor && typeof cursor === "object" ? cursor : void 0;
}
function getExistingPluginConfig(config, pluginId) {
	return config.plugins?.entries?.[pluginId]?.config ?? {};
}
function toPathSegments(fieldKey, existing, jsonSchema) {
	const segments = parseConcreteConfigPathTokens(fieldKey);
	let value = existing;
	return segments.map((segment, index) => {
		const schema = resolveJsonSchemaProperty(jsonSchema, segments.slice(0, index));
		const arrayContainer = Array.isArray(value) || value == null && schema?.type === "array";
		const resolved = (typeof segment === "string" && arrayContainer ? parseConfigPathArrayIndex(segment) : void 0) ?? segment;
		value = value !== null && typeof value === "object" ? Reflect.get(value, String(resolved)) : void 0;
		return resolved;
	});
}
function formatCurrentValue(value) {
	if (value === void 0 || value === null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "boolean" || typeof value === "number") return String(value);
	if (Array.isArray(value)) return value.join(", ");
	return JSON.stringify(value);
}
function parseJsonNumberInput(value) {
	try {
		const parsed = JSON.parse(value);
		return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function discoverConfigurablePlugins(params) {
	const result = [];
	for (const plugin of params.manifestPlugins) {
		if (!plugin.configUiHints) continue;
		const promptableHints = {};
		for (const [key, hint] of Object.entries(plugin.configUiHints)) if (!hint.advanced) promptableHints[key] = hint;
		if (Object.keys(promptableHints).length === 0) continue;
		result.push({
			id: plugin.id,
			name: plugin.name ?? plugin.id,
			uiHints: promptableHints,
			jsonSchema: plugin.configSchema
		});
	}
	return result.toSorted((a, b) => a.name.localeCompare(b.name));
}
function discoverUnconfiguredPlugins(params) {
	return discoverConfigurablePlugins(params).filter((plugin) => {
		const existing = getExistingPluginConfig(params.config, plugin.id);
		return Object.keys(plugin.uiHints).some((key) => {
			const val = getPath(existing, toPathSegments(key, existing, plugin.jsonSchema).map(String));
			return val === void 0 || val === null || val === "";
		});
	});
}
async function listEnabledConfigurableManifestPlugins(params) {
	const { loadPluginMetadataSnapshot } = await loadPluginMetadataSnapshotModule();
	return loadPluginMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: process.env
	}).plugins.filter((plugin) => {
		const entry = params.config.plugins?.entries?.[plugin.id];
		return plugin.enabledByDefault || entry?.enabled === true;
	});
}
async function promptPluginFields(params) {
	const { plugin, config, prompter } = params;
	const existing = getExistingPluginConfig(config, plugin.id);
	const updatedConfig = structuredClone(existing);
	let changed = false;
	for (const [key, hint] of Object.entries(plugin.uiHints)) {
		const pathSegments = toPathSegments(key, existing, plugin.jsonSchema);
		const currentValue = getPath(existing, pathSegments.map(String));
		const hasValue = currentValue !== void 0 && currentValue !== null && currentValue !== "";
		if (hasValue && !params.showConfigured) continue;
		const schemaProp = resolveJsonSchemaProperty(plugin.jsonSchema, pathSegments);
		const label = hint.label ?? key;
		const helpSuffix = hint.help ? ` — ${hint.help}` : "";
		if (hint.sensitive) {
			await prompter.note(t("wizard.plugins.sensitiveField", {
				label,
				plugin: plugin.id,
				field: key
			}), t("wizard.plugins.sensitiveTitle"));
			continue;
		}
		let nextValue;
		if (schemaProp?.enum && Array.isArray(schemaProp.enum)) {
			const options = schemaProp.enum.map((configValue, index) => ({
				value: String(index),
				label: JSON.stringify(configValue) ?? String(configValue)
			}));
			if (hasValue) options.unshift({
				value: "__keep__",
				label: t("wizard.plugins.currentValue", { value: formatCurrentValue(currentValue) })
			});
			const selected = await prompter.select({
				message: `${label}${helpSuffix}`,
				options,
				initialValue: hasValue ? "__keep__" : void 0
			});
			if (selected === "__keep__") continue;
			nextValue = structuredClone(schemaProp.enum[Number(selected)]);
		} else if (schemaProp?.type === "boolean") {
			nextValue = await prompter.confirm({
				message: `${label}${helpSuffix}`,
				initialValue: typeof currentValue === "boolean" ? currentValue : false
			});
			if (nextValue === currentValue) continue;
		} else {
			const isArray = schemaProp?.type === "array";
			const currentStr = isArray ? Array.isArray(currentValue) ? currentValue.join(", ") : "" : formatCurrentValue(currentValue);
			const trimmed = (await prompter.text({
				message: `${label}${isArray ? t("wizard.plugins.arrayPromptSuffix") : ""}${helpSuffix}`,
				initialValue: currentStr,
				placeholder: hint.placeholder ?? (isArray ? t("wizard.plugins.arrayPlaceholder") : void 0)
			})).trim();
			if (trimmed === currentStr) continue;
			nextValue = trimmed ? isArray ? normalizeStringEntries(trimmed.split(",")) : trimmed : void 0;
			if (trimmed && (schemaProp?.type === "number" || schemaProp?.type === "integer")) {
				const parsed = parseJsonNumberInput(trimmed);
				if (parsed === void 0 || schemaProp.type === "integer" && !Number.isInteger(parsed)) continue;
				nextValue = parsed;
			}
		}
		setPathCreateStrict(updatedConfig, pathSegments, nextValue);
		changed = true;
	}
	if (!changed) return config;
	return {
		...config,
		plugins: {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[plugin.id]: {
					...config.plugins?.entries?.[plugin.id],
					config: updatedConfig
				}
			}
		}
	};
}
async function setupPluginConfig(params) {
	const unconfigured = discoverUnconfiguredPlugins({
		manifestPlugins: await listEnabledConfigurableManifestPlugins(params),
		config: params.config
	});
	if (unconfigured.length === 0) return params.config;
	const selected = await params.prompter.multiselect({
		message: t("wizard.plugins.configureSelectOnboard"),
		options: [{
			value: "__skip__",
			label: t("common.skipForNow"),
			hint: t("wizard.plugins.skipConfigHint")
		}, ...unconfigured.map((p) => ({
			value: p.id,
			label: p.name,
			hint: t("wizard.plugins.fieldsCount", {
				count: Object.keys(p.uiHints).length,
				plural: Object.keys(p.uiHints).length === 1 ? "" : "s"
			})
		}))]
	});
	let config = params.config;
	for (const pluginId of selected.filter((value) => value !== "__skip__")) {
		const plugin = unconfigured.find((p) => p.id === pluginId);
		if (!plugin) continue;
		await params.prompter.note(t("wizard.plugins.configurePlugin", { plugin: plugin.name }), t("wizard.plugins.configureFieldsTitle"));
		config = await promptPluginFields({
			plugin,
			config,
			prompter: params.prompter
		});
	}
	return config;
}
async function configurePluginConfig(params) {
	const configurable = discoverConfigurablePlugins({ manifestPlugins: await listEnabledConfigurableManifestPlugins(params) });
	if (configurable.length === 0) {
		await params.prompter.note(t("wizard.plugins.configureEmpty"), t("wizard.plugins.configureEmptyTitle"));
		return params.config;
	}
	const selected = await params.prompter.select({
		message: t("wizard.plugins.configureSelect"),
		options: [...configurable.map((p) => {
			const existing = getExistingPluginConfig(params.config, p.id);
			const configuredCount = Object.keys(p.uiHints).filter((k) => {
				const val = getPath(existing, toPathSegments(k, existing, p.jsonSchema).map(String));
				return val !== void 0 && val !== null && val !== "";
			}).length;
			const totalCount = Object.keys(p.uiHints).length;
			return {
				value: p.id,
				label: p.name,
				hint: t("wizard.plugins.configuredCount", {
					configured: configuredCount,
					total: totalCount
				})
			};
		}), {
			value: "__skip__",
			label: t("common.back"),
			hint: t("wizard.plugins.configureBackHint")
		}],
		searchable: true
	});
	if (selected === "__skip__") return params.config;
	const plugin = configurable.find((p) => p.id === selected);
	if (!plugin) return params.config;
	return promptPluginFields({
		plugin,
		config: params.config,
		prompter: params.prompter,
		showConfigured: true
	});
}
//#endregion
export { configurePluginConfig, discoverConfigurablePlugins, discoverUnconfiguredPlugins, setupPluginConfig };
