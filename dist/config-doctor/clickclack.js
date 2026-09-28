import { a as asNullableRecord } from "./string-coerce-Dyy0qgLy.js";
import "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/clickclack/src/doctor-contract.ts
function stripTimeoutSeconds(value) {
	const record = asNullableRecord(value);
	if (!record) return {
		value,
		changed: false
	};
	let changed = false;
	const next = {};
	for (const [key, child] of Object.entries(record)) {
		if (key === "timeoutSeconds") {
			changed = true;
			continue;
		}
		const stripped = stripTimeoutSeconds(child);
		changed = changed || stripped.changed;
		next[key] = stripped.value;
	}
	return {
		value: changed ? next : value,
		changed
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const rawEntry = asNullableRecord(cfg.channels?.clickclack);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	const stripped = stripTimeoutSeconds(rawEntry);
	if (!stripped.changed) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...cfg,
			channels: {
				...cfg.channels,
				clickclack: stripped.value
			}
		},
		changes: ["Removed retired ClickClack timeout tuning knobs."]
	};
}
//#endregion
export { normalizeCompatibilityConfig };
