import { a as openRootFile } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { r as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { r as publishBootstrapFile } from "./workspace-bootstrap-publish-DQeM5PYL.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/agents/workspace-bootstrap-copy.ts
const log = createSubsystemLogger("sandbox-workspace");
async function copyWorkspaceBootstrapFiles(workspaceDir, seed, assertCurrent) {
	assertCurrent();
	await fs$1.mkdir(workspaceDir, { recursive: true });
	assertCurrent();
	if (seed) {
		const files = [...GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES, DEFAULT_BOOTSTRAP_FILENAME];
		for (const name of files) {
			const src = path.join(seed, name);
			const dest = path.join(workspaceDir, name);
			const destinationExists = await fs$1.access(dest).then(() => true, () => false);
			assertCurrent();
			if (destinationExists) continue;
			const opened = await openRootFile({
				absolutePath: src,
				rootPath: seed,
				boundaryLabel: "sandbox seed workspace"
			});
			if (!opened.ok) {
				assertCurrent();
				continue;
			}
			let content;
			try {
				assertCurrent();
				content = await readWorkspaceBootstrapFile(opened.fd);
			} catch (err) {
				assertCurrent();
				if (err instanceof RangeError) {
					log.warn(`Ignoring oversized sandbox seed file ${src}: file exceeds the ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES}-byte limit`);
					continue;
				}
				throw err;
			} finally {
				fs.closeSync(opened.fd);
			}
			assertCurrent();
			await publishBootstrapFile(dest, content, assertCurrent);
			assertCurrent();
		}
	}
}
//#endregion
export { copyWorkspaceBootstrapFiles };
