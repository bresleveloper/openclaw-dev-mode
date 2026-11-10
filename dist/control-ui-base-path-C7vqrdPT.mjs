//#region extensions/telegram/src/control-ui-base-path.ts
function normalizeControlUiBasePath(trimmed, trailing) {
	if (!trimmed || trimmed === "/") return "";
	const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return trailing === "all" ? withLeading.replace(/\/+$/, "") : withLeading.replace(/\/$/, "");
}
//#endregion
export { normalizeControlUiBasePath as t };
