import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { a as normalizeBackgroundPreference } from "./background-preferences-C24XmTL3.mjs";
//#region src/state/user-preferences.validation.ts
function prepareEntries(entries) {
	const rawEntries = Object.entries(entries);
	if (rawEntries.length > 32) return err({ code: "invalid-entry-count" });
	const serialized = [];
	const deletionKeys = [];
	for (const [prefKey, value] of rawEntries) {
		if (!prefKey || prefKey.length > 256) return err({
			code: "invalid-key",
			key: prefKey
		});
		if (value === null) {
			deletionKeys.push(prefKey);
			continue;
		}
		let valueJson;
		try {
			const background = prefKey === "ui.background" ? normalizeBackgroundPreference(value) : void 0;
			if (prefKey === "ui.background" && !background) return err({
				code: "invalid-value",
				key: prefKey
			});
			valueJson = JSON.stringify(background ?? value);
		} catch {
			return err({
				code: "invalid-value",
				key: prefKey
			});
		}
		if (valueJson === void 0) return err({
			code: "invalid-value",
			key: prefKey
		});
		if (Buffer.byteLength(valueJson, "utf8") > 4096) return err({
			code: "value-too-large",
			key: prefKey
		});
		serialized.push({
			prefKey,
			valueJson
		});
	}
	return ok({
		serialized,
		deletionKeys
	});
}
function prepareUserPreferenceUpdate(entries, expectedEntries = {}) {
	const prepared = prepareEntries(entries);
	if (!prepared.ok) return prepared;
	const expected = prepareEntries(expectedEntries);
	if (!expected.ok) return expected;
	return ok({
		...prepared.value,
		expected: [...expected.value.serialized, ...expected.value.deletionKeys.map((prefKey) => ({
			prefKey,
			valueJson: null
		}))]
	});
}
//#endregion
export { prepareUserPreferenceUpdate as t };
