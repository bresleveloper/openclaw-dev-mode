import path from "node:path";
//#region src/agents/worktrees/gc-dependencies.ts
/** Canonical path ancestry for one allocation-owned inventory. */
function indexWorktreePaths(records) {
	const key = (value) => {
		const resolved = path.resolve(value);
		return process.platform === "win32" ? resolved.toLowerCase() : resolved;
	};
	const owners = /* @__PURE__ */ new Map();
	for (const record of records) {
		const normalized = key(record.path);
		const ids = owners.get(normalized) ?? [];
		ids.push(record.id);
		owners.set(normalized, ids);
	}
	return function* ancestors(target) {
		let current = key(target);
		for (;;) {
			yield* owners.get(current) ?? [];
			const parent = path.dirname(current);
			if (parent === current) break;
			current = parent;
		}
	};
}
function indexWorktreeEvictionDependencies(records, commonDirs) {
	const ancestors = indexWorktreePaths(records);
	const dependents = /* @__PURE__ */ new Map();
	const sourceContainers = /* @__PURE__ */ new Map();
	const unresolved = /* @__PURE__ */ new Map();
	for (const record of records) {
		const commonDir = commonDirs.get(record.repoRoot);
		if (commonDir === void 0) unresolved.set(record.id, record);
		for (const [target, source] of [
			[record.path, false],
			[record.repoRoot, true],
			[commonDir, true]
		]) {
			if (target === void 0) continue;
			for (const id of ancestors(target)) {
				if (id === record.id) continue;
				const children = dependents.get(id) ?? /* @__PURE__ */ new Set();
				children.add(record.id);
				dependents.set(id, children);
				if (source) {
					const containers = sourceContainers.get(record.id) ?? /* @__PURE__ */ new Set();
					containers.add(id);
					sourceContainers.set(record.id, containers);
				}
			}
		}
	}
	return {
		dependents,
		sourceContainers,
		unresolved
	};
}
//#endregion
export { indexWorktreePaths as n, indexWorktreeEvictionDependencies as t };
