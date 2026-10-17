import "./oauth-BjYQE8Yy.mjs";
import "./store-SwwRUDrm.mjs";
import "./profiles-Dk53jI-3.mjs";
import "./runtime-snapshots-CSLjByUx.mjs";
import "./external-cli-discovery-CzdLbOjb.mjs";
import "./order-B7W96aON.mjs";
import "./store-runtime-Qx0DZ2Si.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-CkXDj4l-.mjs";
import "./usage-Cfv9IA36.mjs";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	const label = displayName || email;
	return label ? `${params.profileId} (${label})` : params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
