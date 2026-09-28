import { w as root } from "./fs-safe-BAPek8At.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import path from "node:path";
//#region extensions/browser/src/browser/extension-native-host-file.ts
/** Read POSIX native-host artifacts through the descriptor that passed admission. */
async function readPrivateNativeHostFile(filePath, executable) {
	try {
		var _usingCtx$1 = _usingCtx();
		const resolved = path.resolve(filePath);
		const directory = await root(path.dirname(resolved));
		const file = _usingCtx$1.a(await directory.open(path.basename(resolved), { hardlinks: "allow" }));
		if (file.realPath !== resolved) throw new Error("non-canonical native host file path");
		const uid = process.getuid?.();
		if (uid !== void 0 && file.stat.uid !== uid) throw new Error("foreign native host file owner");
		if ((file.stat.mode & 63) !== 0 || executable && (file.stat.mode & 64) === 0) throw new Error("native host file has unsafe mode");
		return {
			realPath: file.realPath,
			buffer: await file.handle.readFile()
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { readPrivateNativeHostFile as t };
