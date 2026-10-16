//#region extensions/xai/model-id.ts
const XAI_GROK_RELEASE_ID = /^grok-(\d+)(?:\.(\d+))?(?:-(?:latest|\d{4}))?$/u;
/**
* xAI documents reasoning effort from Grok 4.5 and xhigh "on grok-4.6 and later", so
* compare release numbers: new Grok releases work before the manifest lists them.
*/
function isXaiGrokReleaseAtLeast(id, minimum) {
	const match = XAI_GROK_RELEASE_ID.exec(normalizeXaiModelId(id.trim().toLowerCase()));
	if (!match) return false;
	const major = Number(match[1]);
	const minor = Number(match[2] ?? 0);
	if (major === 4 && minor === 20) return false;
	return major > minimum[0] || major === minimum[0] && minor >= minimum[1];
}
function isXaiXhighModelId(id) {
	return isXaiGrokReleaseAtLeast(id, [4, 6]);
}
function isXaiFrontierModelId(id) {
	return isXaiGrokReleaseAtLeast(id, [4, 5]);
}
function normalizeXaiModelId(id) {
	if (id === "grok-4.3-latest") return "grok-4.3";
	if (id === "grok-4.5-latest") return "grok-4.5";
	if (id === "grok-4.7-latest") return "grok-4.7";
	if (id === "grok-build-latest") return "grok-4.5";
	if (id === "grok-code-fast-1" || id === "grok-code-fast" || id === "grok-code-fast-1-0825") return "grok-build-0.1";
	if (id === "grok-4-fast-reasoning") return "grok-4-fast";
	if (id === "grok-4-1-fast-reasoning") return "grok-4-1-fast";
	return id;
}
//#endregion
export { normalizeXaiModelId as i, isXaiGrokReleaseAtLeast as n, isXaiXhighModelId as r, isXaiFrontierModelId as t };
