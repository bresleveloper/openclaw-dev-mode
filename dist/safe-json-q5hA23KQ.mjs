//#region src/utils/safe-json.ts
/**
* The replacer handles values common in runtime logs that JSON.stringify would
* otherwise reject or erase, and returns null for circular structures.
*/
function safeJsonStringify(value) {
	try {
		return JSON.stringify(value, (_key, val) => {
			if (typeof val === "bigint") return val.toString();
			if (typeof val === "function") return "[Function]";
			if (val instanceof Error) return {
				name: val.name,
				message: val.message,
				stack: val.stack
			};
			if (val instanceof Uint8Array) return {
				type: "Uint8Array",
				data: Buffer.from(val).toString("base64")
			};
			return val;
		});
	} catch {
		return null;
	}
}
//#endregion
export { safeJsonStringify as t };
