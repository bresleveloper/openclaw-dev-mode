//#region src/logging/levels.ts
const ALLOWED_LOG_LEVELS = [
	"silent",
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace"
];
const MIN_LEVEL_BY_LOG_LEVEL = {
	trace: 1,
	debug: 2,
	info: 3,
	warn: 4,
	error: 5,
	fatal: 6,
	silent: Number.POSITIVE_INFINITY
};
function tryParseLogLevel(level) {
	if (typeof level !== "string") return;
	const candidate = level.trim();
	return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
	return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
	return MIN_LEVEL_BY_LOG_LEVEL[level];
}
//#endregion
export { tryParseLogLevel as i, levelToMinLevel as n, normalizeLogLevel as r, ALLOWED_LOG_LEVELS as t };
