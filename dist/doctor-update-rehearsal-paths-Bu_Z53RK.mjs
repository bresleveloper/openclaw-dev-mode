import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as assertUpdateCandidatePluginCodeLink } from "./update-candidate-plugin-code-links-C3dE-q0T.mjs";
import { lstatSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-update-rehearsal-paths.ts
function refuseRehearsal(detail) {
	throw new Error(`Legacy update rehearsal was refused: ${detail}. Run npx openclaw@latest update from a terminal for a protected update.`);
}
function isWithinRehearsal(root, target) {
	const relative = path.relative(root, target);
	return relative === "" || !path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`);
}
/** Strict data inspection; only the terminal entry in a code walk may be an owned link. */
function createRehearsalPathInspector(stateDir, facts) {
	const codeLinks = /* @__PURE__ */ new Map();
	for (const fact of facts) {
		const previous = codeLinks.get(fact.path);
		if (previous && !isDeepStrictEqual(previous, fact)) refuseRehearsal(`conflicting plugin code link identities: ${fact.path}`);
		codeLinks.set(fact.path, fact);
	}
	const uid = process.getuid?.();
	const identities = /* @__PURE__ */ new Map();
	function inspectPath(filename, privateMode = false, allowCodeLink = false) {
		if (path.normalize(filename) !== filename) refuseRehearsal(`migration data is not a canonical path: ${filename}`);
		if (!path.isAbsolute(filename) || !isWithinRehearsal(stateDir, filename)) refuseRehearsal(`migration data escapes the copied state: ${filename}`);
		let current = stateDir;
		let last;
		for (const part of ["", ...path.relative(stateDir, filename).split(path.sep).filter(Boolean)]) {
			current = path.join(current, part);
			try {
				last = lstatSync(current);
			} catch (error) {
				if (isRecord(error) && error.code === "ENOENT") return;
				throw error;
			}
			const codeLink = allowCodeLink && current === filename ? codeLinks.get(current) : void 0;
			if (codeLink) assertUpdateCandidatePluginCodeLink(codeLink);
			if (last.isSymbolicLink() && !codeLink || !last.isDirectory() && !last.isFile() && !codeLink || last.isFile() && last.nlink !== 1 || uid !== void 0 && last.uid !== uid || process.platform !== "win32" && (current === stateDir || privateMode && current === filename) && (last.mode & 63) !== 0) refuseRehearsal(`copied data has unsafe ownership or links: ${current}`);
			const previous = identities.get(current);
			if (previous && (previous.dev !== last.dev || previous.ino !== last.ino)) refuseRehearsal(`copied data identity changed: ${current}`);
			identities.set(current, last);
		}
		return last;
	}
	return {
		identities,
		inspectPath
	};
}
//#endregion
export { isWithinRehearsal as n, refuseRehearsal as r, createRehearsalPathInspector as t };
