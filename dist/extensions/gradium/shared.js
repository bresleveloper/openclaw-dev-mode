//#region extensions/gradium/shared.ts
const DEFAULT_GRADIUM_BASE_URL = "https://api.gradium.ai";
const GRADIUM_API_HOSTNAME = "api.gradium.ai";
const DEFAULT_GRADIUM_VOICE_ID = "YTpq7expH9539ERJ";
const GRADIUM_VOICES = [
	{
		id: "YTpq7expH9539ERJ",
		name: "Emma"
	},
	{
		id: "LFZvm12tW_z0xfGo",
		name: "Kent"
	},
	{
		id: "Eu9iL_CYe8N-Gkx_",
		name: "Tiffany"
	},
	{
		id: "2H4HY2CBNyJHBCrP",
		name: "Christina"
	},
	{
		id: "jtEKaLYNn6iif5PR",
		name: "Sydney"
	},
	{
		id: "KWJiFWu2O9nMPYcR",
		name: "John"
	},
	{
		id: "3jUdJyOi9pgbxBTK",
		name: "Arthur"
	}
];
function normalizeGradiumBaseUrl(baseUrl) {
	const raw = baseUrl?.trim() || DEFAULT_GRADIUM_BASE_URL;
	let url;
	try {
		url = new URL(raw);
	} catch {
		throw new Error("Gradium baseUrl must be a valid https URL");
	}
	url.username = "";
	url.password = "";
	url.search = "";
	url.hash = "";
	if (url.protocol !== "https:") throw new Error("Gradium baseUrl must use https");
	if (url.hostname.toLowerCase() !== "api.gradium.ai") throw new Error("Gradium baseUrl must target api.gradium.ai");
	return url.toString().replace(/\/+$/, "");
}
//#endregion
export { DEFAULT_GRADIUM_VOICE_ID, GRADIUM_API_HOSTNAME, GRADIUM_VOICES, normalizeGradiumBaseUrl };
