import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { createRequire } from "node:module";
import { createWriteStream, write, writev } from "node:fs";
//#region src/process/spawn-secret-input.ts
const require = createRequire(import.meta.url);
let createPipe;
function createSecretPipe() {
	createPipe ??= (() => {
		const koffi = require("koffi");
		const libc = koffi.load(null);
		const closeFd = libc.func("int close(int fd)");
		const close = (fd) => {
			if (closeFd(fd) !== 0) throw new Error(`secret input close failed (errno ${koffi.errno()})`);
		};
		const pipe = libc.func(process.platform === "linux" ? "int pipe2(_Out_ int *fds, int flags)" : "int pipe(_Out_ int *fds)");
		const fcntl = process.platform === "linux" ? void 0 : libc.func("int fcntl(int fd, int cmd, ...)");
		return () => {
			const fds = [-1, -1];
			if (pipe(fds, ...fcntl ? [] : [524288]) !== 0) throw new Error(`secret input pipe creation failed (errno ${koffi.errno()})`);
			try {
				if (fcntl && fds.some((fd) => fcntl(fd, 2, "int", 1) !== 0)) throw new Error(`secret input close-on-exec failed (errno ${koffi.errno()})`);
				return {
					fds,
					close
				};
			} catch (error) {
				fds.forEach(close);
				throw error;
			}
		};
	})();
	return createPipe();
}
function prepareSecretInputStdio(stdio, secretInput) {
	if (!secretInput) return;
	if (!Number.isInteger(secretInput.fd) || secretInput.fd < 3) throw new Error("secret input file descriptor must be an integer greater than 2");
	while (stdio.length <= secretInput.fd) stdio.push("ignore");
	const pipe = process.platform === "win32" ? void 0 : createSecretPipe();
	let [readFd, writeFd] = pipe?.fds ?? [];
	stdio[secretInput.fd] = readFd ?? "overlapped";
	const closeRead = () => {
		if (readFd !== void 0) {
			pipe.close(readFd);
			readFd = void 0;
		}
	};
	return {
		[Symbol.dispose]() {
			closeRead();
			if (writeFd !== void 0) {
				pipe.close(writeFd);
				writeFd = void 0;
			}
		},
		async deliverTo(child, options) {
			closeRead();
			const stream = writeFd === void 0 ? child.stdio[secretInput.fd] : createWriteStream("", {
				fd: writeFd,
				fs: {
					write,
					writev,
					close(fd, callback) {
						try {
							pipe.close(fd);
							callback(null);
						} catch (error) {
							callback(toErrorObject(error, "secret input close failed"));
						}
					}
				}
			});
			writeFd = void 0;
			if (!stream || typeof stream.end !== "function") throw new Error(`secret input file descriptor ${secretInput.fd} is unavailable`);
			const abortSignal = options?.abortSignal;
			if (abortSignal?.aborted) {
				stream.destroy();
				throw new Error("secret delivery aborted");
			}
			let data;
			try {
				data = secretInput.createData();
				await new Promise((resolve, reject) => {
					let settled = false;
					const settle = (error) => {
						if (settled) return;
						settled = true;
						abortSignal?.removeEventListener("abort", onAbort);
						if (error) reject(error);
						else resolve();
					};
					const onAbort = () => {
						stream.destroy();
						settle(/* @__PURE__ */ new Error("secret delivery aborted"));
					};
					const onError = (error) => settle(error);
					abortSignal?.addEventListener("abort", onAbort, { once: true });
					stream.on("error", onError);
					stream.once("close", () => stream.off("error", onError));
					stream.end(data, settle);
				});
			} finally {
				data?.fill(0);
				stream.destroy();
			}
		}
	};
}
//#endregion
export { prepareSecretInputStdio as t };
