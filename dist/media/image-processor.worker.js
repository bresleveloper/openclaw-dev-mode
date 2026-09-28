import { n as createLocalImageProcessor } from "../image-processor-config-StN3hXY9.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-CwtaNZgU.mjs";
import { isRastermillError, isRastermillUnavailableError } from "rastermill";
//#region src/media/image-processor.worker.ts
const defaultProcessor = createLocalImageProcessor("internal");
serveWorkerTasks(async (input) => {
	const request = input;
	try {
		const processor = request.limits ? createLocalImageProcessor("internal", request.limits) : defaultProcessor;
		switch (request.kind) {
			case "encode": {
				const value = await processor.encode(request.input, request.options);
				return {
					kind: request.kind,
					value: {
						...value,
						data: Uint8Array.from(value.data)
					}
				};
			}
			case "transparency": return {
				kind: request.kind,
				value: await processor.transparency(request.input)
			};
			case "bmpToPng": {
				const { convertBmpToPngWithPhoton } = await import("../photon.runtime-CM1AAcer.mjs");
				return {
					kind: request.kind,
					value: Uint8Array.from(convertBmpToPngWithPhoton(Buffer.from(request.input)))
				};
			}
			default: throw new Error("Unsupported image worker operation");
		}
	} catch (error) {
		return {
			kind: "failed",
			error: error instanceof Error ? error : new Error(String(error)),
			...isRastermillError(error) ? { code: error.code } : {},
			unavailable: isRastermillUnavailableError(error)
		};
	}
}, { transferList: (reply) => reply.kind === "encode" ? [reply.value.data.buffer] : reply.kind === "bmpToPng" ? [reply.value.buffer] : [] });
//#endregion
export {};
