import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
//#region src/gateway/control-ui-root-assets.ts
const CONTROL_UI_BUILD_ID_ATTRIBUTE = "data-openclaw-control-ui-build-id";
/** Root files emitted by the Control UI build and served under any configured mount. */
const CONTROL_UI_ROOT_PUBLIC_ASSETS = [
	"apple-touch-icon.png",
	"favicon-32.png",
	"favicon.ico",
	"favicon.svg",
	"manifest.webmanifest",
	"sw.js"
];
function isControlUiRootPublicAsset(value) {
	return CONTROL_UI_ROOT_PUBLIC_ASSETS.some((asset) => asset === value);
}
/** Public build inputs covered by the document's content-bound cache identity. */
function isControlUiVersionedPublicAsset(value) {
	return isControlUiRootPublicAsset(value) && value !== "sw.js" || /^(?:fonts\/[^/]+\.(?:css|woff2)|themes\/[^/]+\.css|(?:provider-icons|cloud-provider-icons|file-icons(?:\/[^/]+)*)\/[^/]+\.svg|(?:app-art|community-art)\/[^/]+\.webp)$/u.test(value);
}
function buildControlUiRootAssetPath(basePath, asset) {
	return `${normalizeControlUiBasePath(basePath)}/${asset}`;
}
//#endregion
export { isControlUiVersionedPublicAsset as a, isControlUiRootPublicAsset as i, CONTROL_UI_ROOT_PUBLIC_ASSETS as n, buildControlUiRootAssetPath as r, CONTROL_UI_BUILD_ID_ATTRIBUTE as t };
