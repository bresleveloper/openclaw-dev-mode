import "./oauth-BnhjzoJ0.mjs";
import "./store-CTvq6MSF.mjs";
import "./profiles-ony3GkiP.mjs";
import "./runtime-snapshots-CBozwlR0.mjs";
import "./external-cli-discovery-BbOBKQM3.mjs";
import "./order-BQhYF772.mjs";
import "./store-runtime-CEcQpLad.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-C0n2rHTU.mjs";
import "./usage-B1Y_S5UM.mjs";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	if (displayName) return `${params.profileId} (${displayName})`;
	if (email) return `${params.profileId} (${email})`;
	return params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
