import { w as root } from "./fs-safe-BAPek8At.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { l as extractArchive } from "./archive-BVJWOqLD.mjs";
import path from "node:path";
//#region src/skills/lifecycle/install-extract.ts
async function extractSkillDownloadArchive(params) {
	const { archivePath, archiveType, targetDir, stripComponents, timeoutMs } = params;
	const kind = archiveType === "zip" ? "zip" : archiveType === "tar.gz" ? "tar" : archiveType === "tar.bz2" ? "tar-bzip2" : void 0;
	if (!kind) return {
		stdout: "",
		stderr: `unsupported archive type: ${archiveType}`,
		code: null
	};
	try {
		await extractArchive({
			archivePath,
			destDir: targetDir,
			timeoutMs,
			kind,
			stripComponents: typeof stripComponents === "number" && Number.isFinite(stripComponents) ? Math.max(0, Math.floor(stripComponents)) : 0,
			tarGzip: kind === "tar" ? true : void 0,
			entryModes: kind === "tar-bzip2" ? "preserve" : "clamp",
			entryUmask: kind === "tar-bzip2" ? process.geteuid?.() === 0 ? 0 : process.umask() : 0
		});
		if (kind === "tar-bzip2") {
			const stagedRoot = await root(targetDir);
			const validateReadable = async (directory) => {
				for await (const entry of stagedRoot.entries(directory ? `./${directory}` : "", {
					order: "filesystem",
					symlinks: "reject"
				})) {
					const member = path.join(directory, entry.name);
					if (entry.isSymbolicLink || !entry.isFile && !entry.isDirectory) throw new Error(`archive staging contains a link or unsupported entry: ${entry.name}`);
					if (entry.isDirectory) await validateReadable(member);
					else try {
						var _usingCtx$1 = _usingCtx();
						const handle = _usingCtx$1.a((await stagedRoot.open(path.join(stagedRoot.rootReal, member), {
							symlinks: "reject",
							hardlinks: "reject"
						})).handle);
						await sha256File(handle);
					} catch (_) {
						_usingCtx$1.e = _;
					} finally {
						await _usingCtx$1.d();
					}
				}
			};
			await validateReadable("");
		}
		return {
			stdout: "",
			stderr: "",
			code: 0
		};
	} catch (err) {
		return {
			stdout: "",
			stderr: formatErrorMessage(err),
			code: 1
		};
	}
}
//#endregion
export { extractSkillDownloadArchive };
