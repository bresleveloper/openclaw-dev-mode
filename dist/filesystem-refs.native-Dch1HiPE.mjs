import path from "node:path";
import koffi from "koffi";
//#region src/agents/worktrees/filesystem-refs.native.ts
const kernel32 = koffi.load("kernel32.dll");
const getLastError = kernel32.func("uint32_t __stdcall GetLastError()");
const getVolumePath = kernel32.func("int32_t __stdcall GetVolumePathNameW(str16 path, _Out_ void *volume, uint32_t length)");
const getVolumeInformation = kernel32.func("int32_t __stdcall GetVolumeInformationW(str16 root, void *label, uint32_t labelLength, void *serial, void *componentLength, _Out_ uint32_t *flags, _Out_ void *filesystem, uint32_t filesystemLength)");
const getDiskFreeSpace = kernel32.func("int32_t __stdcall GetDiskFreeSpaceW(str16 root, _Out_ uint32_t *sectors, _Out_ uint32_t *bytes, _Out_ uint32_t *freeClusters, _Out_ uint32_t *clusters)");
const createFile = kernel32.func("void * __stdcall CreateFileW(str16 path, uint32_t access, uint32_t sharing, void *security, uint32_t disposition, uint32_t flags, void *templateFile)");
const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
const getFileInformation = kernel32.func("int32_t __stdcall GetFileInformationByHandle(void *handle, _Out_ void *information)");
const setFileInformation = kernel32.func("int32_t __stdcall SetFileInformationByHandle(void *handle, int32_t informationClass, void *information, uint32_t size)");
const setFileTime = kernel32.func("int32_t __stdcall SetFileTime(void *handle, void *created, void *accessed, void *written)");
const setFileAttributes = kernel32.func("int32_t __stdcall SetFileAttributesW(str16 path, uint32_t attributes)");
const copyFile = kernel32.func("int32_t __stdcall CopyFileExW(str16 source, str16 destination, void *progress, void *data, void *cancel, uint32_t flags)");
const deviceIoControl = kernel32.func("int32_t __stdcall DeviceIoControl(void *handle, uint32_t code, void *input, uint32_t inputSize, _Out_ void *output, uint32_t outputSize, _Out_ uint32_t *returned, void *overlapped)");
const duplicateExtents = koffi.struct({
	file: "void *",
	sourceOffset: "int64_t",
	targetOffset: "int64_t",
	length: "int64_t"
});
function failure(operation) {
	const errno = getLastError();
	return Object.assign(/* @__PURE__ */ new Error(`${operation} failed (Win32 error ${errno})`), {
		code: errno === 80 || errno === 183 ? "EEXIST" : "EIO",
		errno
	});
}
function openFile(filePath, access, disposition, flags) {
	const handle = createFile(filePath, access, 1, null, disposition, flags, null);
	if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
	return handle;
}
function control(handle, code, input, output) {
	if (!deviceIoControl(handle, code, input, input?.length ?? 0, output, output?.length ?? 0, [0], null)) throw failure(`DeviceIoControl(0x${code.toString(16)})`);
}
const refsFilesystem = {
	probe(parentPath) {
		const root = Buffer.alloc(65536);
		if (!getVolumePath(path.toNamespacedPath(path.resolve(parentPath)), root, root.length / 2)) throw failure("GetVolumePathNameW");
		const volume = root.toString("utf16le").split("\0", 1)[0];
		const filesystem = Buffer.alloc(64);
		const flags = [0];
		if (!getVolumeInformation(volume, null, 0, null, null, flags, filesystem, filesystem.length / 2)) throw failure("GetVolumeInformationW");
		if (filesystem.toString("utf16le").split("\0", 1)[0] !== "ReFS" || !(flags[0] & 134217728)) return null;
		const sectors = [0];
		const bytes = [0];
		if (!getDiskFreeSpace(volume, sectors, bytes, [0], [0])) throw failure("GetDiskFreeSpaceW");
		return { clusterSize: sectors[0] * bytes[0] };
	},
	cloneFile(source, destination, clusterSize) {
		const from = path.toNamespacedPath(path.resolve(source));
		const to = path.toNamespacedPath(path.resolve(destination));
		const sourceHandle = openFile(from, 2147483648, 3, 538968064);
		try {
			const information = Buffer.alloc(52);
			if (!getFileInformation(sourceHandle, information)) throw failure("GetFileInformationByHandle");
			const attributes = information.readUInt32LE(0);
			if (attributes & 1024) {
				if (!copyFile(from, to, null, null, null, 2049)) throw failure("CopyFileExW(symlink)");
				return;
			}
			const targetHandle = openFile(to, 3221225472, 1, 128);
			try {
				const integrity = Buffer.alloc(16);
				control(sourceHandle, 590460, null, integrity);
				control(targetHandle, 639616, integrity.subarray(0, 8), null);
				control(targetHandle, 590020, null, null);
				const size = BigInt(information.readUInt32LE(32)) << 32n | BigInt(information.readUInt32LE(36));
				const eof = Buffer.alloc(8);
				eof.writeBigInt64LE(size);
				if (!setFileInformation(targetHandle, 6, eof, eof.length)) throw failure("SetFileInformationByHandle(EOF)");
				const cluster = BigInt(clusterSize);
				const roundedSize = (size + cluster - 1n) / cluster * cluster;
				const request = Buffer.alloc(koffi.sizeof(duplicateExtents));
				for (let offset = 0n; offset < size;) {
					const length = roundedSize - offset < 2147483648n ? roundedSize - offset : 2147483648n;
					koffi.encode(request, duplicateExtents, {
						file: sourceHandle,
						sourceOffset: offset,
						targetOffset: offset,
						length
					});
					control(targetHandle, 623428, request, null);
					offset += length;
				}
				if (!setFileTime(targetHandle, information.subarray(4, 12), information.subarray(12, 20), information.subarray(20, 28))) throw failure("SetFileTime");
			} finally {
				closeHandle(targetHandle);
			}
			if (!setFileAttributes(to, attributes & 12583 || 128)) throw failure("SetFileAttributesW");
		} finally {
			closeHandle(sourceHandle);
		}
	}
};
//#endregion
export { refsFilesystem };
