import { r as generateSecureInt } from "./secure-random-Dimnnrm0.mjs";
//#region src/agents/session-slug.ts
/**
* Human-readable session slug generator.
* Produces short adjective/noun IDs with numbered and random fallbacks when
* collisions are reported by the session store.
*/
const SLUG_ADJECTIVES = [
	"amber",
	"briny",
	"brisk",
	"calm",
	"clear",
	"cool",
	"crisp",
	"dawn",
	"delta",
	"ember",
	"faint",
	"fast",
	"fresh",
	"gentle",
	"glow",
	"good",
	"grand",
	"keen",
	"kind",
	"lucky",
	"marine",
	"mellow",
	"mild",
	"neat",
	"nimble",
	"nova",
	"oceanic",
	"plaid",
	"quick",
	"quiet",
	"rapid",
	"salty",
	"sharp",
	"swift",
	"tender",
	"tidal",
	"tidy",
	"tide",
	"vivid",
	"warm",
	"wild",
	"young"
];
const SLUG_NOUNS = [
	"atlas",
	"basil",
	"bison",
	"bloom",
	"breeze",
	"canyon",
	"cedar",
	"claw",
	"cloud",
	"comet",
	"coral",
	"cove",
	"crest",
	"crustacean",
	"daisy",
	"dune",
	"ember",
	"falcon",
	"fjord",
	"forest",
	"glade",
	"gulf",
	"harbor",
	"haven",
	"kelp",
	"lagoon",
	"lobster",
	"meadow",
	"mist",
	"nudibranch",
	"nexus",
	"ocean",
	"orbit",
	"otter",
	"pine",
	"prairie",
	"reef",
	"ridge",
	"river",
	"rook",
	"sable",
	"sage",
	"seaslug",
	"shell",
	"shoal",
	"shore",
	"slug",
	"summit",
	"tidepool",
	"trail",
	"valley",
	"wharf",
	"willow",
	"zephyr"
];
const CRUSTACEAN_NOUNS = [
	"barnacle",
	"claw",
	"crab",
	"crayfish",
	"krill",
	"langoustine",
	"lobster",
	"prawn",
	"shrimp",
	"shell"
];
function randomChoice(values, fallback) {
	return values[generateSecureInt(values.length)] ?? fallback;
}
const SLUG_FALLBACK_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
function createFallbackSuffix(length) {
	let suffix = "";
	for (let i = 0; i < length; i += 1) suffix += SLUG_FALLBACK_ALPHABET[generateSecureInt(36)] ?? "x";
	return suffix;
}
function createSlugBase(words = 2, nouns = SLUG_NOUNS) {
	const parts = [randomChoice(SLUG_ADJECTIVES, "steady"), randomChoice(nouns, "harbor")];
	if (words > 2) parts.push(randomChoice(nouns, "reef"));
	return parts.join("-");
}
function createAvailableSlug(words, isIdTaken, nouns = SLUG_NOUNS) {
	for (let attempt = 0; attempt < 12; attempt += 1) {
		const base = createSlugBase(words, nouns);
		if (!isIdTaken(base)) return base;
		for (let i = 2; i <= 12; i += 1) {
			const candidate = `${base}-${i}`;
			if (!isIdTaken(candidate)) return candidate;
		}
	}
}
function createUniqueSlug(nouns, isTaken) {
	const isIdTaken = isTaken ?? (() => false);
	for (const words of [2, 3]) {
		const slug = createAvailableSlug(words, isIdTaken, nouns);
		if (slug) return slug;
	}
	const fallback = `${createSlugBase(3, nouns)}-${createFallbackSuffix(3)}`;
	return isIdTaken(fallback) ? `${fallback}-${Date.now().toString(36)}` : fallback;
}
/** Creates a human-readable unique session slug with numbered and random fallbacks. */
function createSessionSlug(isTaken) {
	return createUniqueSlug(SLUG_NOUNS, isTaken);
}
/** Creates a human-readable crustacean-themed slug for unnamed worktrees. */
function createCrustaceanSlug(isTaken) {
	return createUniqueSlug(CRUSTACEAN_NOUNS, isTaken);
}
//#endregion
export { createSessionSlug as n, createCrustaceanSlug as t };
