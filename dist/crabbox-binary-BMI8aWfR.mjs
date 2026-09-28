import fs from "node:fs";
import path from "node:path";
//#region extensions/crabbox/src/crabbox-binary.ts
function isExecutableFile(candidate, platform) {
	try {
		if (!fs.statSync(candidate).isFile()) return false;
		fs.accessSync(candidate, platform === "win32" ? fs.constants.F_OK : fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function binaryCandidates(base, platform) {
	return platform === "win32" ? [
		".exe",
		".cmd",
		".bat",
		".com",
		""
	].map((suffix) => `${base}${suffix}`) : [base];
}
function resolveCrabboxBinary(params) {
	return params.explicit || findCrabboxBinary(params) || "crabbox";
}
function findCrabboxBinary(params) {
	const platform = params.platform ?? process.platform;
	const isExecutable = params.isExecutable ?? ((candidate) => isExecutableFile(candidate, platform));
	if (params.explicit) return isExecutable(params.cwd ? path.resolve(params.cwd, params.explicit) : params.explicit) ? params.explicit : void 0;
	if (params.openclawRoot) {
		const siblingBase = path.resolve(params.cwd ?? ".", params.openclawRoot, "../crabbox/bin/crabbox");
		for (const candidate of binaryCandidates(siblingBase, platform)) if (isExecutable(candidate)) return candidate;
	}
	const delimiter = platform === "win32" ? ";" : ":";
	const executableNames = binaryCandidates("crabbox", platform);
	for (const directory of (params.pathEnv ?? "").split(delimiter)) {
		if (!directory) continue;
		for (const name of executableNames) {
			const candidate = path.resolve(params.cwd ?? ".", directory, name);
			if (isExecutable(candidate)) return candidate;
		}
	}
}
//#endregion
export { resolveCrabboxBinary as n, findCrabboxBinary as t };
