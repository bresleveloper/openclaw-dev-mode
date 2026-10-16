import "./model-ref-parse-BI8o1mtw.mjs";
//#region extensions/google/model-id.ts
const GOOGLE_PROVIDER_PREFIX = "google/";
function stripGoogleProviderPrefix(id) {
	return id.startsWith(GOOGLE_PROVIDER_PREFIX) ? id.slice(7) : id;
}
//#endregion
export { stripGoogleProviderPrefix as t };
