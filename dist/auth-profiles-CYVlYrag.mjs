import "./oauth-CIf65QWM.mjs";
import "./store-CTvq6MSF.mjs";
import "./profiles-DblRQQgZ.mjs";
import "./runtime-snapshots-CBozwlR0.mjs";
import "./external-cli-discovery-BbOBKQM3.mjs";
import "./order-BQhYF772.mjs";
import "./store-runtime-BcoYkagW.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-C0n2rHTU.mjs";
import "./usage-BGZHRVrb.mjs";
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
