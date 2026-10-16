import { a as openRootFile } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as DEFAULT_SOUL_FILENAME, n as DEFAULT_BOOTSTRAP_FILENAME, r as DEFAULT_IDENTITY_FILENAME, s as DEFAULT_USER_FILENAME, t as DEFAULT_AGENTS_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { n as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
import { r as publishBootstrapFile } from "./workspace-bootstrap-publish-CPt9QMx9.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/workspace-bootstrap-copy.ts
const log = createSubsystemLogger("sandbox-workspace");
async function copyWorkspaceBootstrapFiles(workspaceDir, seed, assertCurrent) {
	assertCurrent();
	await fs$1.mkdir(workspaceDir, { recursive: true });
	assertCurrent();
	if (seed) {
		const files = [
			DEFAULT_AGENTS_FILENAME,
			DEFAULT_SOUL_FILENAME,
			DEFAULT_IDENTITY_FILENAME,
			DEFAULT_USER_FILENAME,
			DEFAULT_BOOTSTRAP_FILENAME
		];
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
