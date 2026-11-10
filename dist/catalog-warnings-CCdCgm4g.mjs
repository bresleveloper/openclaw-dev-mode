import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { f as isImplicitLocalGatewayTarget, r as callGateway } from "./call-b1jzw5fz.mjs";
//#region src/commands/models/catalog-warnings.ts
/** Shares model inventory's target selection without falling back across Gateways. */
async function readSelectedGatewayModelCatalog(config, params, timeoutMs) {
	const localTarget = await isImplicitLocalGatewayTarget({ config });
	const explicitPort = Boolean(process.env.OPENCLAW_GATEWAY_PORT?.trim());
	const owner = localTarget && !explicitPort ? await readActiveGatewayLockIdentity({ requireInspection: true }) : void 0;
	if (localTarget && !explicitPort && !owner) return;
	return callGateway({
		config,
		method: "models.list",
		...params.preparedOnly ? { sharedStateMode: "read-only" } : {},
		...timeoutMs ? { timeoutMs } : {},
		requiredCapabilities: [GATEWAY_SERVER_CAPS.PUBLISHED_MODEL_CATALOG],
		...owner ? { localPortOverride: owner.port } : {},
		params
	});
}
function getModelCatalogWarnings(result) {
	return result?.providerOutcomes?.flatMap((outcome) => outcome.status === "ready" ? (outcome.unlistedConfiguredModelIds ?? []).map((modelId) => ({
		ref: `${outcome.provider}/${modelId}`,
		message: `Configured model "${sanitizeTerminalText(`${outcome.provider}/${modelId}`)}" is not present in the provider's last successful server catalog${outcome.profileId ? ` (profile ${sanitizeTerminalText(outcome.profileId)})` : ""}.`,
		fixHint: "Pull or download it on that server, or fix the configured model name; then run openclaw models list --refresh. The model remains selectable."
	})) : []) ?? [];
}
/** Diagnostic reads consume a prepared publication; they never discover or probe providers. */
async function readModelCatalogWarnings(config, agentId) {
	return getModelCatalogWarnings(await readSelectedGatewayModelCatalog(config, {
		view: "all",
		includeDetails: true,
		preparedOnly: true,
		...agentId ? { agentId } : {}
	}, 5e3).catch(() => void 0));
}
//#endregion
export { readModelCatalogWarnings as n, readSelectedGatewayModelCatalog as r, getModelCatalogWarnings as t };
