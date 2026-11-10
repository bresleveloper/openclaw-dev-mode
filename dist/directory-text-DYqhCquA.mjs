import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import "./security-runtime-6domDoE8.mjs";
//#region extensions/file-transfer/src/tools/directory-text.ts
function renderDirectoryText(params) {
	const visible = [];
	const render = () => {
		const { manifest, text } = params.render(visible);
		const wrapped = wrapExternalContent(text, { source: "unknown" });
		return wrapped.includes(manifest) && Buffer.byteLength(wrapped, "utf8") <= 8192 ? wrapped : void 0;
	};
	let text = render();
	for (const entry of params.entries) {
		visible.push(JSON.stringify(params.project(entry)));
		const candidate = render();
		if (!candidate) break;
		text = candidate;
	}
	return text ?? wrapExternalContent(params.fallback, { source: "unknown" });
}
//#endregion
export { renderDirectoryText as t };
