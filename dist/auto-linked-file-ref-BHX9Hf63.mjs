import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
const FILE_REF_EXTENSIONS_WITH_TLD = /* @__PURE__ */ new Set([
	"md",
	"go",
	"py",
	"pl",
	"sh",
	"am",
	"at",
	"be",
	"cc"
]);
function isAutoLinkedFileRef(href, label) {
	if (href.replace(/^https?:\/\//i, "") !== label) return false;
	const dotIndex = label.lastIndexOf(".");
	if (dotIndex < 1) return false;
	const ext = normalizeLowercaseStringOrEmpty(label.slice(dotIndex + 1));
	if (!FILE_REF_EXTENSIONS_WITH_TLD.has(ext)) return false;
	return label.indexOf(".") > label.lastIndexOf("/");
}
//#endregion
export { isAutoLinkedFileRef as n, FILE_REF_EXTENSIONS_WITH_TLD as t };
