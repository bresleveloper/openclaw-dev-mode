import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/agents/sandbox/input-staging.ts
const INPUT_STAGER = Symbol.for("openclaw.sandboxInputStager");
/** Prepared host ownership, separate from the guest's file-mutation permissions. */
function bindSandboxInputStager(bridge, stage) {
	Object.defineProperty(bridge, INPUT_STAGER, {
		value: stage,
		configurable: true
	});
}
function getSandboxInputStager(bridge) {
	return bridge[INPUT_STAGER];
}
/** Local backend owners prepare this capability; guest paths never select its root. */
function createSandboxInputStager(owner) {
	return async (input) => {
		const assertCurrent = () => {
			input.signal?.throwIfAborted();
			owner.assertCurrent();
			input.assertCurrent();
		};
		assertCurrent();
		const [{ root: fsRoot }, { stagedInputDirectory, STAGED_INPUT_GITIGNORE }] = await Promise.all([import("./fs-safe-MZ5T9fjO.mjs"), import("./staged-inputs-DHL77Y77.mjs")]);
		const directory = stagedInputDirectory(randomUUID());
		const filePath = `${directory}/${input.prefix}.log`;
		const target = owner.bridge.resolvePath({
			filePath,
			cwd: owner.root
		});
		if (target.hostPath !== path.join(owner.root, filePath)) throw new Error("Sandbox input staging is shadowed by another mount");
		const root = await fsRoot(owner.root);
		for (const [file, data] of [[`${directory}/.gitignore`, STAGED_INPUT_GITIGNORE], [filePath, input.content]]) {
			assertCurrent();
			await root.create(file, data, {
				mode: 384,
				assertBeforeMutation: assertCurrent
			});
		}
		assertCurrent();
		return target.containerPath;
	};
}
//#endregion
export { createSandboxInputStager as n, getSandboxInputStager as r, bindSandboxInputStager as t };
