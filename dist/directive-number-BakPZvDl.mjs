import { c as asFiniteNumberInRange, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
//#region src/tts/directive-number.ts
/** Parse a numeric speech directive token and return provider overrides when policy allows it. */
function parseSpeechDirectiveNumberOverride(params) {
	if (!params.ctx.policy.allowVoiceSettings) return { handled: true };
	const value = parseStrictFiniteNumber(params.ctx.value);
	if (value === void 0 || asFiniteNumberInRange(value, params.range) === void 0) return {
		handled: true,
		warnings: [params.warning(params.ctx.value)]
	};
	const nextOverride = { [params.overrideKey]: value };
	return {
		handled: true,
		overrides: params.mergeCurrentOverrides ? {
			...params.ctx.currentOverrides,
			...nextOverride
		} : nextOverride
	};
}
//#endregion
export { parseSpeechDirectiveNumberOverride as t };
