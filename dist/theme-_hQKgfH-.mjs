//#region packages/gateway-protocol/src/theme-ids.ts
/** Lightweight theme identifiers used while browser preferences boot. */
const BUILTIN_THEME_IDS = [
	"claw",
	"knot",
	"dash",
	"absolutely",
	"tide",
	"beacon",
	"phosphor",
	"crt",
	"manuscript",
	"rose",
	"miami"
];
const THEME_LOCAL_ID_MAX_LENGTH = 64;
const THEME_LOCAL_ID_PATTERN = new RegExp(`^[a-z0-9][a-z0-9_-]{0,63}$`);
function isBuiltinThemeId(value) {
	return BUILTIN_THEME_IDS.some((id) => id === value);
}
function isThemeId(value) {
	if (isBuiltinThemeId(value)) return true;
	if (typeof value !== "string" || value.length > 256) return false;
	const separator = value.lastIndexOf("/");
	const owner = value.slice(0, separator);
	return separator > 0 && !owner.startsWith("user/") && /^@?[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/i.test(owner) && THEME_LOCAL_ID_PATTERN.test(value.slice(separator + 1));
}
function normalizeThemeMode(value) {
	return value === "system" || value === "light" || value === "dark" ? value : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/theme.ts
const THEME_COLOR_KEYS = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"popover",
	"popover-foreground",
	"primary",
	"primary-foreground",
	"secondary",
	"secondary-foreground",
	"muted",
	"muted-foreground",
	"accent",
	"accent-foreground",
	"destructive",
	"destructive-foreground",
	"border",
	"input",
	"ring"
];
const THEME_FONT_KEYS = ["font-sans", "font-mono"];
const THEME_MASCOT_VALUES = ["claw", "none"];
const THEME_CRITTER_IDS = ["penguin", "fedora"];
function isThemeCritterId(value) {
	return THEME_CRITTER_IDS.some((id) => id === value);
}
const THEME_AVATAR_HAT_IDS = [
	"fedora",
	"crown",
	"santa",
	"party",
	"pumpkin"
];
function isThemeAvatarHatId(value) {
	return THEME_AVATAR_HAT_IDS.some((id) => id === value);
}
const THEME_ARTWORK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const THEME_WORKING_PHRASES_MAX = 24;
const THEME_WORKING_PHRASE_MAX_LENGTH = 24;
const MAX_THEME_DEFINITION_BYTES = 4096;
const THEME_NAME_MAX_LENGTH = 80;
const THEME_DESCRIPTION_MAX_LENGTH = 320;
const THEME_TOKEN_MAX_LENGTH = 120;
const DEFAULT_THEME_CRITTERS = [];
function resolveThemeBranding(source) {
	return {
		mascot: source?.mascot ?? "claw",
		workingPhrases: source?.workingPhrases,
		critters: source?.critters ?? DEFAULT_THEME_CRITTERS,
		avatarHat: source?.avatarHat,
		...source?.artwork ? { artwork: source.artwork } : {}
	};
}
const BUILTIN_THEMES = [
	{
		id: "claw",
		name: "Claw",
		description: "Signature coral red and teal on charcoal or pale surfaces, with Instrument Sans throughout. A balanced everyday workspace."
	},
	{
		id: "knot",
		name: "Knot",
		description: "Crimson accents on true black or clean white, with Geist typography. Sharp, minimal, and high contrast."
	},
	{
		id: "dash",
		name: "Dash",
		description: "Toasted caramel on deep cocoa or warm cream, with DM Sans controls and Fraunces serif chat. Warm and bookish."
	},
	{
		id: "absolutely",
		name: "Absolutely",
		description: "Terracotta clay on warm graphite or soft cream, with Space Grotesk controls and Lora serif chat. Quiet editorial character."
	},
	{
		id: "tide",
		name: "Tide",
		description: "Steel cyan on cool slate or pale blue-gray, with IBM Plex Sans throughout. Calm, technical, and understated."
	},
	{
		id: "beacon",
		name: "Beacon",
		description: "High-visibility amber on black or white, bold focus rings, and Atkinson Hyperlegible typography. Designed for maximum readability."
	},
	{
		id: "phosphor",
		name: "Phosphor",
		description: "Luminous green on green-tinted black or pale green, with JetBrains Mono throughout. A classic green terminal atmosphere."
	},
	{
		id: "crt",
		name: "CRT",
		description: "White phosphor and amber on tube black, with a light counterpart, JetBrains Mono, and nearly square corners. A retro computer console."
	},
	{
		id: "manuscript",
		name: "Manuscript",
		description: "Lapis blue and gold on aged paper, with a dark reading-room variant and Lora serif throughout. A quiet illuminated manuscript."
	},
	{
		id: "rose",
		name: "Rosé",
		description: "Dried rose and gold on deep plum-gray or soft rose-tinted cream, with DM Sans. Gentle, muted, and warm."
	},
	{
		id: "miami",
		name: "Miami",
		description: "Hot magenta and cyan on violet-black or pale lavender, with Space Grotesk. Bright neon energy and a synthwave character."
	}
].map((theme) => ({
	id: theme.id,
	name: theme.name,
	description: theme.description,
	source: "builtin",
	modes: ["light", "dark"]
}));
function requireRecord(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
	return value;
}
function requireKeys(value, allowed, label) {
	const unknown = Object.keys(value).find((key) => !allowed.includes(key));
	if (unknown) throw new Error(`${label} has unsupported field ${unknown}`);
}
function requireText(value, label, maxLength) {
	if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength || Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) throw new Error(`${label} must be nonempty text of at most ${maxLength} characters`);
	return value.trim();
}
const NUMBER = "[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?";
const COMPONENT = `${NUMBER}%?`;
const HUE = `${NUMBER}(?:deg|grad|rad|turn)?`;
const LEGACY_COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba)\\( *(?:${NUMBER} *, *${NUMBER} *, *${NUMBER}|${NUMBER}% *, *${NUMBER}% *, *${NUMBER}%)|(?:hsl|hsla)\\( *${HUE} *, *${NUMBER}% *, *${NUMBER}%)(?: *, *${COMPONENT})? *\\)$`, "i");
const COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba|oklab|lab)\\( *${COMPONENT} +${COMPONENT} +${COMPONENT}|(?:hsl|hsla)\\( *${HUE} +${COMPONENT} +${COMPONENT}|(?:oklch|lch)\\( *${COMPONENT} +${COMPONENT} +${HUE})(?: */ *${COMPONENT})? *\\)$`, "i");
const COLOR_SPACE_FUNCTION = new RegExp(`^color\\( *(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65) +${COMPONENT} +${COMPONENT} +${COMPONENT}(?: */ *${COMPONENT})? *\\)$`, "i");
const FONT_IDENTIFIER = "(?:--[a-z0-9_-]*|-?[a-z_][a-z0-9_-]*)";
const FONT_FAMILY = `(?:"[a-z0-9 ,'._-]*"|'[a-z0-9 ,"._-]*'|${FONT_IDENTIFIER}(?: +${FONT_IDENTIFIER})*)`;
const FONT_FAMILY_LIST = new RegExp(`^${FONT_FAMILY}(?: *, *${FONT_FAMILY})*$`, "i");
const CSS_WIDE_KEYWORDS = /* @__PURE__ */ new Set([
	"inherit",
	"initial",
	"unset",
	"revert",
	"revert-layer"
]);
const GENERIC_FONT_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-serif",
	"ui-sans-serif",
	"ui-monospace",
	"ui-rounded",
	"emoji",
	"math",
	"fangsong",
	"-webkit-body"
]);
function isFontFamilyList(value) {
	if (!FONT_FAMILY_LIST.test(value)) return false;
	return value.replace(/"[^"]*"|'[^']*'/g, "").split(",").every((family) => {
		const words = family.trim().toLowerCase().split(/ +/);
		return words.every((word) => !CSS_WIDE_KEYWORDS.has(word) && word !== "default" && (words.length === 1 || !GENERIC_FONT_FAMILIES.has(word)));
	});
}
function requireColor(value, label) {
	const color = requireText(value, label, 120);
	if (!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color) && !/^(?:transparent|black|white)$/i.test(color) && !LEGACY_COLOR_FUNCTION.test(color) && !COLOR_FUNCTION.test(color) && !COLOR_SPACE_FUNCTION.test(color)) throw new Error(`${label} must be a hex, rgb, hsl, lab, lch, oklab, oklch, or color() color`);
	return color;
}
function normalizePalette(value, mode) {
	const palette = requireRecord(value, `theme.${mode}`);
	requireKeys(palette, [...THEME_COLOR_KEYS, ...THEME_FONT_KEYS], `theme.${mode}`);
	const entries = THEME_COLOR_KEYS.map((key) => [key, requireColor(palette[key], `theme.${mode}.${key}`)]);
	const result = { ...Object.fromEntries(entries) };
	for (const key of THEME_FONT_KEYS) {
		if (palette[key] === void 0) continue;
		const font = requireText(palette[key], `theme.${mode}.${key}`, 120);
		if (!isFontFamilyList(font)) throw new Error(`theme.${mode}.${key} must contain only font family names`);
		result[key] = font;
	}
	return result;
}
/** Rejects executable CSS and incomplete palettes before they reach storage or a stylesheet. */
function normalizeThemeDefinition(input, options) {
	const record = requireRecord(input, "theme");
	requireKeys(record, [
		"name",
		"description",
		"mascot",
		"workingPhrases",
		"critters",
		"avatarHat",
		"light",
		"dark"
	], "theme");
	const definition = {
		name: requireText(record.name, "theme.name", 80),
		description: requireText(record.description, "theme.description", 320),
		...record.light !== void 0 ? { light: normalizePalette(record.light, "light") } : {},
		...record.dark !== void 0 ? { dark: normalizePalette(record.dark, "dark") } : {}
	};
	if (record.mascot !== void 0) {
		const mascot = THEME_MASCOT_VALUES.find((candidate) => candidate === record.mascot);
		if (!mascot) throw new Error(`theme.mascot must be one of ${THEME_MASCOT_VALUES.join(", ")}`);
		definition.mascot = mascot;
	}
	if (record.workingPhrases !== void 0) {
		if (!Array.isArray(record.workingPhrases) || record.workingPhrases.length > 24) throw new Error(`theme.workingPhrases must be an array of at most 24 entries`);
		const phrases = Array.from(record.workingPhrases, (phrase, index) => requireText(phrase, `theme.workingPhrases[${index}]`, 24));
		if (new Set(phrases).size !== phrases.length) throw new Error("theme.workingPhrases must not contain duplicate entries after trimming");
		definition.workingPhrases = phrases;
	}
	if (record.critters !== void 0) {
		if (!Array.isArray(record.critters) || record.critters.length > 8) throw new Error("theme.critters must be an array of at most 8 entries");
		const allowedIds = [...THEME_CRITTER_IDS, ...options?.critterIds ?? []];
		const critters = Array.from(record.critters, (entry, index) => {
			const critter = allowedIds.find((id) => id === entry);
			if (!critter) throw new Error(`theme.critters[${index}] must be one of ${allowedIds.join(", ")}`);
			return critter;
		});
		if (new Set(critters).size !== critters.length) throw new Error("theme.critters must not contain duplicate entries");
		definition.critters = critters;
	}
	if (record.avatarHat !== void 0) {
		const allowedIds = [...THEME_AVATAR_HAT_IDS, ...options?.hatIds ?? []];
		const avatarHat = allowedIds.find((id) => id === record.avatarHat);
		if (!avatarHat) throw new Error(`theme.avatarHat must be one of ${allowedIds.join(", ")}`);
		definition.avatarHat = avatarHat;
	}
	if (!definition.light && !definition.dark) throw new Error("theme must provide at least one light or dark palette");
	if (new TextEncoder().encode(JSON.stringify(definition)).length > 4096) throw new Error(`theme definition exceeds ${MAX_THEME_DEFINITION_BYTES} bytes`);
	return definition;
}
function parseThemeDefinition(value) {
	try {
		return normalizeThemeDefinition(value);
	} catch {
		return null;
	}
}
//#endregion
export { isThemeId as C, isBuiltinThemeId as S, parseThemeDefinition as _, THEME_COLOR_KEYS as a, THEME_LOCAL_ID_MAX_LENGTH as b, THEME_FONT_KEYS as c, THEME_TOKEN_MAX_LENGTH as d, THEME_WORKING_PHRASES_MAX as f, normalizeThemeDefinition as g, isThemeCritterId as h, THEME_AVATAR_HAT_IDS as i, THEME_MASCOT_VALUES as l, isThemeAvatarHatId as m, MAX_THEME_DEFINITION_BYTES as n, THEME_CRITTER_IDS as o, THEME_WORKING_PHRASE_MAX_LENGTH as p, THEME_ARTWORK_ID_PATTERN as r, THEME_DESCRIPTION_MAX_LENGTH as s, BUILTIN_THEMES as t, THEME_NAME_MAX_LENGTH as u, resolveThemeBranding as v, normalizeThemeMode as w, THEME_LOCAL_ID_PATTERN as x, BUILTIN_THEME_IDS as y };
