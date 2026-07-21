import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-CI28sGsm.js";
import { GoogleGenAI } from "@google/genai";
//#region extensions/google/google-genai-runtime.ts
function createGoogleGenAI(options) {
	const httpOptions = options.httpOptions ?? {};
	return new GoogleGenAI({
		...options,
		httpOptions: {
			...httpOptions,
			headers: {
				...httpOptions.headers,
				...resolveGoogleApiClientHeaders({ baseUrl: typeof httpOptions.baseUrl === "string" ? httpOptions.baseUrl : void 0 })
			}
		}
	});
}
//#endregion
export { createGoogleGenAI as t };
