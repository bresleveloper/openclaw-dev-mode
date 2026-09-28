import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as buildControlUiResourcePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/theme-catalog.ts
const catalogByPlugin = /* @__PURE__ */ new WeakMap();
function currentSnapshot() {
	return getProcessGatewayPluginMetadataSnapshot() ?? getCurrentPluginMetadataSnapshot();
}
function pluginThemes(plugin) {
	const cached = catalogByPlugin.get(plugin);
	if (cached) return cached;
	const themes = [];
	for (const { id, definition, artwork } of plugin.themeDefinitions ?? []) {
		const resourceUrl = (kind, artId, svg) => {
			const hash = createHash("sha256").update(svg).digest("hex").slice(0, 12);
			return `${buildControlUiResourcePath("pluginThemeArt", "", plugin.id, [
				id,
				kind,
				artId
			])}?v=${hash}`;
		};
		const projected = artwork ? {
			...artwork.hats ? { hats: Object.fromEntries(Object.entries(artwork.hats).map(([artId, art]) => [artId, { url: resourceUrl("hat", artId, art.svg) }])) } : {},
			...artwork.critters ? { critters: Object.fromEntries(Object.entries(artwork.critters).map(([artId, { svg, ...metadata }]) => [artId, {
				url: resourceUrl("critter", artId, svg),
				...metadata
			}])) } : {}
		} : void 0;
		themes.push({
			id: `${plugin.id}/${id}`,
			name: definition.name,
			description: definition.description,
			...definition.mascot !== void 0 ? { mascot: definition.mascot } : {},
			...definition.workingPhrases !== void 0 ? { workingPhrases: definition.workingPhrases } : {},
			...definition.critters !== void 0 ? { critters: definition.critters } : {},
			...definition.avatarHat !== void 0 ? { avatarHat: definition.avatarHat } : {},
			...projected ? { artwork: projected } : {},
			source: "plugin",
			pluginId: plugin.id,
			modes: ["light", "dark"].filter((mode) => Boolean(definition[mode])),
			definition
		});
	}
	catalogByPlugin.set(plugin, themes);
	return themes;
}
/** Returns captured bytes from the enabled owner's current published generation. */
function resolvePluginThemeArtwork(pluginId, themeId, kind, artId) {
	const snapshot = currentSnapshot();
	if (!snapshot?.index.plugins.some((plugin) => plugin.pluginId === pluginId && plugin.enabled)) return;
	const theme = snapshot.plugins.find((plugin) => plugin.id === pluginId)?.themeDefinitions?.find((entry) => entry.id === themeId);
	const artwork = kind === "hat" ? theme?.artwork?.hats : theme?.artwork?.critters;
	return artwork && Object.hasOwn(artwork, artId) ? artwork[artId]?.svg : void 0;
}
/** Reads the published inventory only; explicit plugin lifecycle operations replace its palettes. */
function listPluginThemes() {
	const snapshot = currentSnapshot();
	if (!snapshot) return [];
	const enabled = new Set(snapshot.index.plugins.filter((plugin) => plugin.enabled).map((plugin) => plugin.pluginId));
	return snapshot.plugins.flatMap((plugin) => {
		if (!enabled.has(plugin.id)) return [];
		return pluginThemes(plugin);
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
//#endregion
export { resolvePluginThemeArtwork as n, listPluginThemes as t };
