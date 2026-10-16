import os from "node:os";
//#region src/shared/rosetta-translation.ts
let translated;
/**
* Whether this x86_64 Darwin process is running under Rosetta.
*
* Rosetta reads guest stack above rsp while translating some syscalls (macOS 27 reads
* [rsp+0x18, rsp+0x20) for write, getattrlist, proc_info and sysctl). Koffi enters foreign
* calls at the top of its private stack, so thin libc syscall wrappers called through it fault
* when the next page is unmapped. Native arm64 and Intel processes never read that memory.
*/
function isRosettaTranslatedProcess() {
	if (process.platform !== "darwin" || process.arch !== "x64") return false;
	translated ??= os.cpus()[0]?.model.includes("Apple") === true;
	return translated;
}
//#endregion
export { isRosettaTranslatedProcess as t };
