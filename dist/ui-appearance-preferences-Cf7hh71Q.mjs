import { D as normalizeThemeMode, E as isThemeId } from "./theme-BshtYPJX.mjs";
import { a as normalizeBackgroundPreference } from "./background-preferences-C24XmTL3.mjs";
//#region packages/gateway-protocol/src/schema/tab-icon.ts
function normalizeTabIconPreference(value) {
	if (value === "default" || value === "agent" || value === "agent:rounded" || value === "agent:circle") return value;
	if (typeof value !== "string" || value !== value.trim() || !/^lobster:[a-z][a-z0-9-]{0,47}$/.test(value)) return;
	return `lobster:${value.slice(8)}`;
}
//#endregion
//#region packages/gateway-protocol/src/schema/ui-appearance-typefaces.ts
const UI_APPEARANCE_TYPEFACE_VALUES = [
	"instrument-sans",
	"geist",
	"dm-sans",
	"ibm-plex-sans",
	"space-grotesk",
	"atkinson-hyperlegible",
	"fraunces",
	"lora",
	"jetbrains-mono",
	"system"
];
//#endregion
//#region packages/gateway-protocol/src/schema/ui-appearance-preferences.ts
const UI_APPEARANCE_PREFERENCE_KEYS = {
	theme: "ui.theme",
	themeMode: "ui.themeMode",
	accent: "ui.accent",
	fontUi: "ui.fontUi",
	fontChat: "ui.fontChat",
	background: "ui.background",
	tabIcon: "ui.tabIcon"
};
const normalizeTypeface = (value) => UI_APPEARANCE_TYPEFACE_VALUES.find((typeface) => typeface === value);
const normalizers = {
	"ui.theme": (value) => isThemeId(value) ? value : void 0,
	"ui.themeMode": normalizeThemeMode,
	"ui.accent": (value) => typeof value === "string" && (value === "theme" || /^#[0-9a-f]{6}$/i.test(value)) ? value.toLowerCase() : void 0,
	"ui.fontUi": normalizeTypeface,
	"ui.fontChat": normalizeTypeface,
	"ui.background": normalizeBackgroundPreference,
	"ui.tabIcon": normalizeTabIconPreference
};
function normalizeUiAppearancePreference(key, value) {
	return normalizers[key](value);
}
//#endregion
export { normalizeUiAppearancePreference as n, UI_APPEARANCE_PREFERENCE_KEYS as t };
