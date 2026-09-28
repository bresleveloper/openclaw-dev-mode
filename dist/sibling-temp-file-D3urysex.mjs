import "./fs-safe-defaults-D3xd3zKO.mjs";
import { writeSiblingTempFile } from "@openclaw/fs-safe/advanced";
//#region src/infra/sibling-temp-file.ts
async function writeSiblingTempFile$1(options) {
	return await writeSiblingTempFile({
		...options,
		producerIsolation: "private-directory"
	});
}
//#endregion
export { writeSiblingTempFile$1 as t };
