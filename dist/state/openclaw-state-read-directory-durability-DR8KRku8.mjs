import { Ct as inspectFileIdentitySync, dt as realpathSync$1 } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, m as pathForWindowsFilesystem } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { d as copyRetainedDirectoryReceipt, f as createDirectoryReceiptSync, m as ownDirectoryReceipt, p as directoryReceiptAuthority, u as assertDirectoryReceiptCurrentSync } from "./openclaw-state-read-staged-directory-DUrSLJJt.mjs";
import fs from "node:fs";
import "node:path";
import fs$1 from "node:fs/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-durability.js
function directoryOpenFlags() {
	if (process.platform === "win32") return "r";
	return fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;
}
function isWindowsDirectorySyncUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EACCES" || code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP" || code === "EPERM";
}
function isWindowsDirectoryOpenUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP";
}
function unsupportedOutcome(error) {
	const code = error.code;
	return code ? {
		status: "unsupported",
		code
	} : { status: "unsupported" };
}
async function createDirectoryReceipt(directoryPath, label) {
	return createDirectoryReceiptSync(directoryPath, label, realpathSync$1.native);
}
async function assertDirectoryReceiptCurrent(receipt, label) {
	assertDirectoryReceiptCurrentSync(receipt, label, realpathSync$1.native);
}
function assertOpenDirectoryIdentity(descriptor, receipt, label) {
	inspectFileIdentitySync(() => {
		const opened = fs.fstatSync(descriptor, { bigint: true });
		if (!opened.isDirectory()) throw new FsSafeError("not-file", `${label} must be a real directory: ${receipt.path}`);
		return opened;
	}, directoryReceiptAuthority(receipt).identity);
}
async function assertOpenDirectoryCurrent(handle, receipt, label) {
	assertOpenDirectoryIdentity(handle.fd, receipt, label);
	await assertDirectoryReceiptCurrent(receipt, label);
}
var PinnedDirectoryImpl = class {
	receipt;
	#authority;
	#handle;
	#label;
	#closed = false;
	constructor(handle, receipt, label) {
		this.#handle = handle;
		this.#authority = receipt;
		this.receipt = copyRetainedDirectoryReceipt(receipt);
		this.#label = label;
	}
	async assertCurrent() {
		if (this.#closed) throw new FsSafeError("helper-failed", `${this.#label} pin is already closed`);
		await assertOpenDirectoryCurrent(this.#handle, this.#authority, this.#label);
	}
	async sync() {
		await this.assertCurrent();
		try {
			await this.#handle.sync();
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			await this.assertCurrent();
			return unsupportedOutcome(error);
		}
		await this.assertCurrent();
		return { status: "synced" };
	}
	async close() {
		if (this.#closed) return;
		this.#closed = true;
		await this.#handle.close();
	}
};
async function pinDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : ownDirectoryReceipt(directory);
	await assertDirectoryReceiptCurrent(receipt, label);
	const handle = await fs$1.open(pathForWindowsFilesystem(receipt.path), directoryOpenFlags());
	try {
		await assertOpenDirectoryCurrent(handle, receipt, label);
		return new PinnedDirectoryImpl(handle, receipt, label);
	} catch (error) {
		await handle.close().catch(() => void 0);
		throw error;
	}
}
async function syncDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : ownDirectoryReceipt(directory);
	let pinned;
	try {
		pinned = await pinDirectory(receipt, { label });
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		await assertDirectoryReceiptCurrent(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		return await pinned.sync();
	} finally {
		await pinned.close();
	}
}
function syncDirectorySync(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? createDirectoryReceiptSync(directory, label) : ownDirectoryReceipt(directory);
	assertDirectoryReceiptCurrentSync(receipt, label);
	let descriptor;
	try {
		descriptor = fs.openSync(pathForWindowsFilesystem(receipt.path), directoryOpenFlags());
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		assertDirectoryReceiptCurrentSync(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		assertOpenDirectoryIdentity(descriptor, receipt, label);
		assertDirectoryReceiptCurrentSync(receipt, label);
		try {
			fs.fsyncSync(descriptor);
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			assertDirectoryReceiptCurrentSync(receipt, label);
			return unsupportedOutcome(error);
		}
		assertDirectoryReceiptCurrentSync(receipt, label);
		return { status: "synced" };
	} finally {
		fs.closeSync(descriptor);
	}
}
async function syncDirectoryBestEffort(directoryPath) {
	await syncDirectory(directoryPath).catch(() => void 0);
}
//#endregion
export { syncDirectorySync as n, syncDirectoryBestEffort as t };
