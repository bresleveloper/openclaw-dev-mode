// extensions/discord/src/internal/components.base.ts
function parseCustomId(id) {
	const [rawKey = "", ...parts] = id.split(";");
	const [keyPart = "", firstValue] = rawKey.split("=");
	const key = keyPart.split(":", 1)[0] ?? "";
	const data = {};
	const entries = firstValue === void 0 ? parts : [rawKey.slice(key.length + 1), ...parts];
	for (const entry of entries) {
		const index = entry.indexOf("=");
		if (index < 0) continue;
		const name = entry.slice(0, index).replace(/^[^:]+:/, "");
		const raw = entry.slice(index + 1);
		data[name] = raw === "true" ? true : raw === "false" ? false : raw;
	}
	return {
		key,
		data
	};
}
function colorToNumber(value) {
	if (typeof value === "number") return Number.isInteger(value) && value >= 0 && value <= 16777215 ? value : void 0;
	if (typeof value === "string" && /^#?[0-9a-f]{6}$/i.test(value)) return Number.parseInt(value.replace(/^#/, ""), 16);
}
var BaseComponent = class {
	constructor() {
		this.isV2 = false;
	}
};
var BaseMessageInteractiveComponent = class {};
var BaseModalComponent = class extends BaseComponent {};
export { parseCustomId as i, BaseModalComponent as n, colorToNumber as r, BaseMessageInteractiveComponent as t };
