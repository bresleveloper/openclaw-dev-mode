import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/config/value-tree.ts
function visitConfigValueTree(value, visit, rootPath = []) {
	const currentPath = [...rootPath];
	const pending = [{
		kind: "visit",
		value
	}];
	while (pending.length > 0) {
		const frame = pending.pop();
		if (frame.kind === "leave") {
			currentPath.pop();
			continue;
		}
		if (frame.key !== void 0) {
			currentPath.push(frame.key);
			pending.push({ kind: "leave" });
		}
		if (!visit(frame.value, currentPath)) continue;
		const entries = Array.isArray(frame.value) || isRecord(frame.value) ? Object.entries(frame.value) : [];
		for (let index = entries.length - 1; index >= 0; index -= 1) {
			const [key, child] = entries[index];
			pending.push({
				kind: "visit",
				key,
				value: child
			});
		}
	}
}
function rejectConfigNonFiniteNumbers(value) {
	visitConfigValueTree(value, (candidate) => {
		if (typeof candidate === "number") {
			if (!Number.isFinite(candidate)) throw new Error(`Value must be a finite number, got ${String(candidate)}`);
		}
		return true;
	});
}
//#endregion
export { visitConfigValueTree as n, rejectConfigNonFiniteNumbers as t };
