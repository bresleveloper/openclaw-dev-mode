import "./oauth-DPCtruSK.mjs";
import "./store-SwwRUDrm.mjs";
import "./profiles-bOpxmzRV.mjs";
import "./runtime-snapshots-CSLjByUx.mjs";
import "./external-cli-discovery-CzdLbOjb.mjs";
import "./order-B7W96aON.mjs";
import "./store-runtime-CzCCJ_Oe.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-CkXDj4l-.mjs";
import "./usage-4pZ_894X.mjs";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	const label = displayName || email;
	return label ? `${params.profileId} (${label})` : params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
