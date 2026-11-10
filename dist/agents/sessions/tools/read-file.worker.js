import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { serialize } from "node:v8";
//#region src/agents/sessions/tools/read-file.worker.ts
let result;
try {
	const filePath = process.argv[2];
	if (!filePath) throw new Error("File read requires a path");
	result = { buffer: (await readRegularFile({ filePath })).buffer };
} catch (error) {
	result = {
		error: error instanceof Error ? error : new Error(String(error)),
		...error instanceof Error && "code" in error && typeof error.code === "string" ? { code: error.code } : {}
	};
}
process.stdout.write(serialize(result));
//#endregion
export {};
