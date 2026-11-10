import { t as UI_APPEARANCE_PREFERENCE_KEYS } from "./ui-appearance-preferences-Cf7hh71Q.mjs";
import { t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { t as getCanonicalUserPreferences } from "./user-preferences-BKyFpu43.mjs";
import { r as loadGatewayRuntimeConfigSchema } from "./runtime-schema-DvdVpE4c.mjs";
//#region src/gateway/control-ui-bootstrap-preferences.ts
async function prepareControlUiBootstrapPreferences(config, viewer) {
	const profileId = viewer.authenticatedUserProfile?.profileId;
	const preferencesRead = profileId ? getCanonicalUserPreferences(profileId, [...Object.values(UI_APPEARANCE_PREFERENCE_KEYS), "ui.railShortcuts"]).catch(() => void 0) : void 0;
	const display = config && authorizeOperatorScopesForMethod("config.get", viewer.operatorScopes).allowed ? redactConfigObject({
		ui: { prefs: config.ui?.prefs },
		gateway: { publicOrigin: config.gateway?.publicOrigin },
		messages: { queue: config.messages?.queue },
		tools: {
			swarm: config.tools?.swarm,
			web: { search: { enabled: config.tools?.web?.search?.enabled } }
		},
		agents: { entries: Object.fromEntries(Object.entries(config.agents?.entries ?? {}).map(([id, agent]) => [id, { tools: { swarm: agent.tools?.swarm } }])) },
		mcp: { servers: Object.fromEntries(Object.entries(config.mcp?.servers ?? {}).map(([name, server]) => [name, {
			enabled: server.enabled,
			command: server.command,
			url: server.url,
			transport: server.transport,
			auth: server.auth,
			oauth: server.oauth ? {
				authProfileId: server.oauth.authProfileId,
				identity: server.oauth.identity
			} : void 0,
			toolFilter: Boolean(server.toolFilter),
			supportsParallelToolCalls: server.supportsParallelToolCalls,
			sslVerify: server.sslVerify,
			clientCert: Boolean(server.clientCert),
			clientKey: Boolean(server.clientKey)
		}])) }
	}, loadGatewayRuntimeConfigSchema(config).uiHints) : void 0;
	const preferences = await preferencesRead;
	return {
		...profileId ? { profileId } : {},
		...display ? { config: display } : {},
		...preferences ? { entries: preferences.entries } : {}
	};
}
//#endregion
export { prepareControlUiBootstrapPreferences };
