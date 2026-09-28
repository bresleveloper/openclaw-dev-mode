import { t as formatInternationalPhoneNumberForDisplay } from "./phone-presentation-Cm4HEhJw.mjs";
//#region src/infra/phone-number-presentation.ts
function formatPhoneNumberForCli(raw, options) {
	const trimmed = raw.trim();
	const candidate = options?.allowInternationalDigits === true && /^\d{7,15}$/u.test(trimmed) ? `+${trimmed}` : raw;
	const presentation = formatInternationalPhoneNumberForDisplay(candidate);
	return presentation && presentation !== raw ? `${presentation} (id: ${raw})` : raw;
}
//#endregion
export { formatPhoneNumberForCli as t };
