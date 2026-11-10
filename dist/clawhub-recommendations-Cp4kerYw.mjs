import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { o as joinClawHubPluginCatalog } from "./catalog-discovery-CSbNyDUD.mjs";
import { v as resolveClawHubBaseUrl, y as resolveClawHubImageUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { d as searchClawHubSkills } from "./clawhub-skills-D--udhAy.mjs";
import "./clawhub-recommendations-Da9BiasP.mjs";
import { t as fetchClawHubPluginCatalog } from "./clawhub-plugin-catalog-DTFuPS1b.mjs";
import { n as registerClawHubCatalogIconUrls, r as resolveClawHubCatalogIconUrl } from "./catalog-icon-registry-QbEIkWWZ.mjs";
import { n as listManagedPlugins } from "./management-service-Dvf0JEQI.mjs";
import { i as prepareWorkspaceSkillStatus } from "./status-DQx5F0If.mjs";
//#region src/infra/outbound/clawhub-recommendations.ts
const requestSchema = object({
	query: string().trim().min(1).max(160),
	kind: _enum(["plugin", "skill"]).optional()
}).strict();
async function resolveClawHubRecommendations(params) {
	const request = requestSchema.parse(params.request);
	const unavailable = {
		cards: [],
		text: "ClawHub recommendations are unavailable right now, so I could not verify a matching capability or its installation status. Please try again."
	};
	let cards = [];
	if (request.kind !== "skill") {
		const found = await Promise.all([fetchClawHubPluginCatalog({
			query: request.query,
			intent: "official",
			limit: 3
		}), listManagedPlugins({ config: params.config })]).catch(() => void 0);
		if (!found) return unavailable;
		const [remote, local] = found;
		registerClawHubCatalogIconUrls(remote.items.map((entry) => entry.iconUrl));
		cards = joinClawHubPluginCatalog({
			remote: remote.items,
			local
		}).filter((entry) => entry.catalog.official).slice(0, 3).map((entry) => ({
			type: "clawhub",
			kind: "plugin",
			id: entry.id,
			name: truncateUtf16Safe(entry.catalog.name, 120),
			description: entry.catalog.summary ? truncateUtf16Safe(entry.catalog.summary, 240) : void 0,
			iconUrl: entry.catalog.imageUrl ? resolveClawHubCatalogIconUrl(entry.catalog.imageUrl) : void 0,
			installed: entry.local.installed,
			official: true,
			pluginId: entry.local.pluginId
		}));
	}
	if (request.kind !== "plugin" && cards.length === 0) {
		const remote = await searchClawHubSkills({
			query: request.query,
			limit: 20
		}).catch(() => void 0);
		if (!remote) return unavailable;
		const official = remote.filter((entry) => entry.official === true && !entry.installOnly).slice(0, 3);
		if (official.length > 0 && !params.workspaceDir) throw new Error("ClawHub skill recommendations require the current agent workspace.");
		const local = params.workspaceDir && official.length > 0 ? (await prepareWorkspaceSkillStatus(params.workspaceDir, {
			config: params.config,
			agentId: params.agentId
		})).report.skills : [];
		cards = official.map((entry) => ({
			type: "clawhub",
			kind: "skill",
			registry: resolveClawHubBaseUrl(),
			id: entry.installRef,
			skillRef: entry.installRef,
			name: truncateUtf16Safe(entry.displayName, 120),
			description: entry.summary ? truncateUtf16Safe(entry.summary, 240) : void 0,
			iconUrl: resolveClawHubImageUrl(entry.icon),
			installed: local.some((skill) => {
				const link = skill.clawhub;
				return link?.valid === true && !link.requestedReference && link.registry === resolveClawHubBaseUrl() && `@${link.ownerHandle}/${link.slug}` === entry.installRef;
			}),
			official: true
		}));
		registerClawHubCatalogIconUrls(cards.map((card) => card.iconUrl));
	}
	return {
		cards,
		text: cards.length > 0 ? cards.map((card) => `${card.name}: ${card.installed ? "Installed" : "Available to install"}.`).join("\n") : `No official ClawHub ${request.kind ?? "plugin or skill"} match was returned for “${request.query}”. Try a more specific capability name.`
	};
}
//#endregion
export { resolveClawHubRecommendations };
