import koffi from "koffi";
//#region src/agents/worktrees/filesystem-apfs.native.ts
const libc = koffi.load("/usr/lib/libSystem.B.dylib");
const getattrlist = libc.func("int getattrlist(const char *path, const void *attributes, void *result, size_t size, unsigned long options)");
const aclGetFile = libc.func("void *acl_get_file(const char *path, int type)");
const aclGetEntry = libc.func("int acl_get_entry(void *acl, int entryId, _Out_ void **entry)");
const aclGetFlagset = libc.func("int acl_get_flagset_np(void *entry, _Out_ void **flags)");
const aclGetFlag = libc.func("int acl_get_flag_np(void *flags, uint32_t flag)");
const aclFree = libc.func("int acl_free(void *acl)");
const aclAttributes = Buffer.alloc(24);
aclAttributes.writeUInt16LE(5, 0);
aclAttributes.writeUInt32LE(4194304, 4);
const apfsFilesystem = { readDirectoryAcl(directory) {
	const result = Buffer.alloc(12);
	if (getattrlist(directory, aclAttributes, result, result.length, 5) !== 0) return;
	const length = result.readUInt32LE(0);
	const size = result.readUInt32LE(8);
	if (length < result.length || size > length - result.length) return;
	if (size === 0) return length === result.length ? "none" : void 0;
	const acl = aclGetFile(directory, 256);
	if (!acl) return;
	try {
		const entry = [null];
		const flags = [null];
		for (let selection = 0;; selection = -1) {
			const code = aclGetEntry(acl, selection, entry);
			if (code !== 0) return code === -1 && koffi.errno() === 22 ? "non-inheritable" : void 0;
			if (aclGetFlagset(entry[0], flags) !== 0) return;
			const files = aclGetFlag(flags[0], 32);
			const directories = aclGetFlag(flags[0], 64);
			if (files !== 0 && files !== 1 || directories !== 0 && directories !== 1) return;
			if (files === 1 || directories === 1) return "inheritable";
		}
	} finally {
		aclFree(acl);
	}
} };
//#endregion
export { apfsFilesystem };
