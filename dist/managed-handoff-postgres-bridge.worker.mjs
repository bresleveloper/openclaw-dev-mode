import { createRequire } from "node:module";
import "node:fs";
import { platform } from "node:os";
import "node:path";
import { createHash } from "node:crypto";
import { parentPort, workerData } from "node:worker_threads";
// \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod, mod.exports), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
// node_modules/.pnpm/@openclaw+fs-safe@0.27.1/node_modules/@openclaw/fs-safe/dist/native-config.js
function configureFsSafeNative(config) {
	overrideConfig = {
		...overrideConfig,
		...config
	};
}
var overrideConfig, init_native_config = __esmMin((() => {
	overrideConfig = {};
}));
var init_errors = __esmMin((() => {}));
// node_modules/.pnpm/@openclaw+fs-safe@0.27.1/node_modules/@openclaw/fs-safe/dist/windows-path-syntax.js
init_errors();
// node_modules/.pnpm/@openclaw+fs-safe@0.27.1/node_modules/@openclaw/fs-safe/dist/safe-path-segment.js
init_errors();
process.platform;
Boolean(process.versions.bun) && platform();
// node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/unicode.js
var require_unicode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
	module.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
	module.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
}));
// node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const unicode = require_unicode();
	module.exports = {
		isSpaceSeparator(c) {
			return typeof c === "string" && unicode.Space_Separator.test(c);
		},
		isIdStartChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
		},
		isIdContinueChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "‌" || c === "‍" || unicode.ID_Continue.test(c));
		},
		isDigit(c) {
			return typeof c === "string" && /[0-9]/.test(c);
		},
		isHexDigit(c) {
			return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
		}
	};
}));
// node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util();
	let source;
	let parseState;
	let stack;
	let pos;
	let line;
	let column;
	let token;
	let key;
	let root;
	module.exports = function parse(text, reviver) {
		source = String(text);
		parseState = "start";
		stack = [];
		pos = 0;
		line = 1;
		column = 0;
		token = void 0;
		key = void 0;
		root = void 0;
		do {
			token = lex();
			parseStates[parseState]();
		} while (token.type !== "eof");
		if (typeof reviver === "function") return internalize({ "": root }, "", reviver);
		return root;
	};
	function internalize(holder, name, reviver) {
		const value = holder[name];
		if (value != null && typeof value === "object") {
			if (Array.isArray(value)) for (let i = 0; i < value.length; i++) {
				const key = String(i);
				const replacement = internalize(value, key, reviver);
				if (replacement === void 0) delete value[key];
				else Object.defineProperty(value, key, {
					value: replacement,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
			else for (const key in value) {
				const replacement = internalize(value, key, reviver);
				if (replacement === void 0) delete value[key];
				else Object.defineProperty(value, key, {
					value: replacement,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
		}
		return reviver.call(holder, name, value);
	}
	let lexState;
	let buffer;
	let doubleQuote;
	let sign;
	let c;
	function lex() {
		lexState = "default";
		buffer = "";
		doubleQuote = false;
		sign = 1;
		for (;;) {
			c = peek();
			const token = lexStates[lexState]();
			if (token) return token;
		}
	}
	function peek() {
		if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
	}
	function read() {
		const c = peek();
		if (c === "\n") {
			line++;
			column = 0;
		} else if (c) column += c.length;
		else column++;
		if (c) pos += c.length;
		return c;
	}
	const lexStates = {
		default() {
			switch (c) {
				case "	":
				case "\v":
				case "\f":
				case " ":
				case "\xA0":
				case "﻿":
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					return;
				case "/":
					read();
					lexState = "comment";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			if (util.isSpaceSeparator(c)) {
				read();
				return;
			}
			return lexStates[parseState]();
		},
		comment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineComment";
					return;
				case "/":
					read();
					lexState = "singleLineComment";
					return;
			}
			throw invalidChar(read());
		},
		multiLineComment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineCommentAsterisk";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
		},
		multiLineCommentAsterisk() {
			switch (c) {
				case "*":
					read();
					return;
				case "/":
					read();
					lexState = "default";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
			lexState = "multiLineComment";
		},
		singleLineComment() {
			switch (c) {
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					lexState = "default";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			read();
		},
		value() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
				case "n":
					read();
					literal("ull");
					return newToken("null", null);
				case "t":
					read();
					literal("rue");
					return newToken("boolean", true);
				case "f":
					read();
					literal("alse");
					return newToken("boolean", false);
				case "-":
				case "+":
					if (read() === "-") sign = -1;
					lexState = "sign";
					return;
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					buffer = "";
					lexState = "string";
					return;
			}
			throw invalidChar(read());
		},
		identifierNameStartEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_": break;
				default: if (!util.isIdStartChar(u)) throw invalidIdentifier();
			}
			buffer += u;
			lexState = "identifierName";
		},
		identifierName() {
			switch (c) {
				case "$":
				case "_":
				case "‌":
				case "‍":
					buffer += read();
					return;
				case "\\":
					read();
					lexState = "identifierNameEscape";
					return;
			}
			if (util.isIdContinueChar(c)) {
				buffer += read();
				return;
			}
			return newToken("identifier", buffer);
		},
		identifierNameEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_":
				case "‌":
				case "‍": break;
				default: if (!util.isIdContinueChar(u)) throw invalidIdentifier();
			}
			buffer += u;
			lexState = "identifierName";
		},
		sign() {
			switch (c) {
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", sign * Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
			}
			throw invalidChar(read());
		},
		zero() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
				case "x":
				case "X":
					buffer += read();
					lexState = "hexadecimal";
					return;
			}
			return newToken("numeric", sign * 0);
		},
		decimalInteger() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalPointLeading() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			throw invalidChar(read());
		},
		decimalPoint() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalFraction() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalExponent() {
			switch (c) {
				case "+":
				case "-":
					buffer += read();
					lexState = "decimalExponentSign";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentSign() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentInteger() {
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		hexadecimal() {
			if (util.isHexDigit(c)) {
				buffer += read();
				lexState = "hexadecimalInteger";
				return;
			}
			throw invalidChar(read());
		},
		hexadecimalInteger() {
			if (util.isHexDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		string() {
			switch (c) {
				case "\\":
					read();
					buffer += escape();
					return;
				case "\"":
					if (doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "'":
					if (!doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "\n":
				case "\r": throw invalidChar(read());
				case "\u2028":
				case "\u2029":
					separatorChar(c);
					break;
				case void 0: throw invalidChar(read());
			}
			buffer += read();
		},
		start() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
			}
			lexState = "value";
		},
		beforePropertyName() {
			switch (c) {
				case "$":
				case "_":
					buffer = read();
					lexState = "identifierName";
					return;
				case "\\":
					read();
					lexState = "identifierNameStartEscape";
					return;
				case "}": return newToken("punctuator", read());
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					lexState = "string";
					return;
			}
			if (util.isIdStartChar(c)) {
				buffer += read();
				lexState = "identifierName";
				return;
			}
			throw invalidChar(read());
		},
		afterPropertyName() {
			if (c === ":") return newToken("punctuator", read());
			throw invalidChar(read());
		},
		beforePropertyValue() {
			lexState = "value";
		},
		afterPropertyValue() {
			switch (c) {
				case ",":
				case "}": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		beforeArrayValue() {
			if (c === "]") return newToken("punctuator", read());
			lexState = "value";
		},
		afterArrayValue() {
			switch (c) {
				case ",":
				case "]": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		end() {
			throw invalidChar(read());
		}
	};
	function newToken(type, value) {
		return {
			type,
			value,
			line,
			column
		};
	}
	function literal(s) {
		for (const c of s) {
			if (peek() !== c) throw invalidChar(read());
			read();
		}
	}
	function escape() {
		switch (peek()) {
			case "b":
				read();
				return "\b";
			case "f":
				read();
				return "\f";
			case "n":
				read();
				return "\n";
			case "r":
				read();
				return "\r";
			case "t":
				read();
				return "	";
			case "v":
				read();
				return "\v";
			case "0":
				read();
				if (util.isDigit(peek())) throw invalidChar(read());
				return "\0";
			case "x":
				read();
				return hexEscape();
			case "u":
				read();
				return unicodeEscape();
			case "\n":
			case "\u2028":
			case "\u2029":
				read();
				return "";
			case "\r":
				read();
				if (peek() === "\n") read();
				return "";
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": throw invalidChar(read());
			case void 0: throw invalidChar(read());
		}
		return read();
	}
	function hexEscape() {
		let buffer = "";
		let c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	function unicodeEscape() {
		let buffer = "";
		let count = 4;
		while (count-- > 0) {
			const c = peek();
			if (!util.isHexDigit(c)) throw invalidChar(read());
			buffer += read();
		}
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	const parseStates = {
		start() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforePropertyName() {
			switch (token.type) {
				case "identifier":
				case "string":
					key = token.value;
					parseState = "afterPropertyName";
					return;
				case "punctuator":
					pop();
					return;
				case "eof": throw invalidEOF();
			}
		},
		afterPropertyName() {
			if (token.type === "eof") throw invalidEOF();
			parseState = "beforePropertyValue";
		},
		beforePropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforeArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			if (token.type === "punctuator" && token.value === "]") {
				pop();
				return;
			}
			push();
		},
		afterPropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforePropertyName";
					return;
				case "}": pop();
			}
		},
		afterArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforeArrayValue";
					return;
				case "]": pop();
			}
		},
		end() {}
	};
	function push() {
		let value;
		switch (token.type) {
			case "punctuator":
				switch (token.value) {
					case "{":
						value = {};
						break;
					case "[": value = [];
				}
				break;
			case "null":
			case "boolean":
			case "numeric":
			case "string": value = token.value;
		}
		if (root === void 0) root = value;
		else {
			const parent = stack[stack.length - 1];
			if (Array.isArray(parent)) parent.push(value);
			else Object.defineProperty(parent, key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		if (value !== null && typeof value === "object") {
			stack.push(value);
			if (Array.isArray(value)) parseState = "beforeArrayValue";
			else parseState = "beforePropertyName";
		} else {
			const current = stack[stack.length - 1];
			if (current == null) parseState = "end";
			else if (Array.isArray(current)) parseState = "afterArrayValue";
			else parseState = "afterPropertyValue";
		}
	}
	function pop() {
		stack.pop();
		const current = stack[stack.length - 1];
		if (current == null) parseState = "end";
		else if (Array.isArray(current)) parseState = "afterArrayValue";
		else parseState = "afterPropertyValue";
	}
	function invalidChar(c) {
		if (c === void 0) return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
		return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`);
	}
	function invalidEOF() {
		return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
	}
	function invalidIdentifier() {
		column -= 5;
		return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
	}
	function separatorChar(c) {
		console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
	}
	function formatChar(c) {
		const replacements = {
			"'": "\\'",
			"\"": "\\\"",
			"\\": "\\\\",
			"\b": "\\b",
			"\f": "\\f",
			"\n": "\\n",
			"\r": "\\r",
			"	": "\\t",
			"\v": "\\v",
			"\0": "\\0",
			"\u2028": "\\u2028",
			"\u2029": "\\u2029"
		};
		if (replacements[c]) return replacements[c];
		if (c < " ") {
			const hexString = c.charCodeAt(0).toString(16);
			return "\\x" + ("00" + hexString).substring(hexString.length);
		}
		return c;
	}
	function syntaxError(message) {
		const err = new SyntaxError(message);
		err.lineNumber = line;
		err.columnNumber = column;
		return err;
	}
}));
// node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util();
	module.exports = function stringify(value, replacer, space) {
		const stack = [];
		let indent = "";
		let propertyList;
		let replacerFunc;
		let gap = "";
		let quote;
		if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
			space = replacer.space;
			quote = replacer.quote;
			replacer = replacer.replacer;
		}
		if (typeof replacer === "function") replacerFunc = replacer;
		else if (Array.isArray(replacer)) {
			propertyList = [];
			for (const v of replacer) {
				let item;
				if (typeof v === "string") item = v;
				else if (typeof v === "number" || v instanceof String || v instanceof Number) item = String(v);
				if (item !== void 0 && propertyList.indexOf(item) < 0) propertyList.push(item);
			}
		}
		if (space instanceof Number) space = Number(space);
		else if (space instanceof String) space = String(space);
		if (typeof space === "number") {
			if (space > 0) {
				space = Math.min(10, Math.floor(space));
				gap = "          ".substr(0, space);
			}
		} else if (typeof space === "string") gap = space.substr(0, 10);
		return serializeProperty("", { "": value });
		function serializeProperty(key, holder) {
			let value = holder[key];
			if (value != null) {
				if (typeof value.toJSON5 === "function") value = value.toJSON5(key);
				else if (typeof value.toJSON === "function") value = value.toJSON(key);
			}
			if (replacerFunc) value = replacerFunc.call(holder, key, value);
			if (value instanceof Number) value = Number(value);
			else if (value instanceof String) value = String(value);
			else if (value instanceof Boolean) value = value.valueOf();
			switch (value) {
				case null: return "null";
				case true: return "true";
				case false: return "false";
			}
			if (typeof value === "string") return quoteString(value, false);
			if (typeof value === "number") return String(value);
			if (typeof value === "object") return Array.isArray(value) ? serializeArray(value) : serializeObject(value);
		}
		function quoteString(value) {
			const quotes = {
				"'": .1,
				"\"": .2
			};
			const replacements = {
				"'": "\\'",
				"\"": "\\\"",
				"\\": "\\\\",
				"\b": "\\b",
				"\f": "\\f",
				"\n": "\\n",
				"\r": "\\r",
				"	": "\\t",
				"\v": "\\v",
				"\0": "\\0",
				"\u2028": "\\u2028",
				"\u2029": "\\u2029"
			};
			let product = "";
			for (let i = 0; i < value.length; i++) {
				const c = value[i];
				switch (c) {
					case "'":
					case "\"":
						quotes[c]++;
						product += c;
						continue;
					case "\0": if (util.isDigit(value[i + 1])) {
						product += "\\x00";
						continue;
					}
				}
				if (replacements[c]) {
					product += replacements[c];
					continue;
				}
				if (c < " ") {
					let hexString = c.charCodeAt(0).toString(16);
					product += "\\x" + ("00" + hexString).substring(hexString.length);
					continue;
				}
				product += c;
			}
			const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
			product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
			return quoteChar + product + quoteChar;
		}
		function serializeObject(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let keys = propertyList || Object.keys(value);
			let partial = [];
			for (const key of keys) {
				const propertyString = serializeProperty(key, value);
				if (propertyString !== void 0) {
					let member = serializeKey(key) + ":";
					if (gap !== "") member += " ";
					member += propertyString;
					partial.push(member);
				}
			}
			let final;
			if (partial.length === 0) final = "{}";
			else {
				let properties;
				if (gap === "") {
					properties = partial.join(",");
					final = "{" + properties + "}";
				} else {
					let separator = ",\n" + indent;
					properties = partial.join(separator);
					final = "{\n" + indent + properties + ",\n" + stepback + "}";
				}
			}
			stack.pop();
			indent = stepback;
			return final;
		}
		function serializeKey(key) {
			if (key.length === 0) return quoteString(key, true);
			const firstChar = String.fromCodePoint(key.codePointAt(0));
			if (!util.isIdStartChar(firstChar)) return quoteString(key, true);
			for (let i = firstChar.length; i < key.length; i++) if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) return quoteString(key, true);
			return key;
		}
		function serializeArray(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let partial = [];
			for (let i = 0; i < value.length; i++) {
				const propertyString = serializeProperty(String(i), value);
				partial.push(propertyString !== void 0 ? propertyString : "null");
			}
			let final;
			if (partial.length === 0) final = "[]";
			else if (gap === "") final = "[" + partial.join(",") + "]";
			else {
				let separator = ",\n" + indent;
				let properties = partial.join(separator);
				final = "[\n" + indent + properties + ",\n" + stepback + "]";
			}
			stack.pop();
			indent = stepback;
			return final;
		}
	};
}));
(/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		parse: require_parse(),
		stringify: require_stringify()
	};
})))();
// src/infra/sealed-runtime-bootstrap.ts
init_native_config();
configureFsSafeNative({ mode: "off" });
// node_modules/.pnpm/postgres-array@2.0.0/node_modules/postgres-array/index.js
var require_postgres_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.parse = function(source, transform) {
		return new ArrayParser(source, transform).parse();
	};
	var ArrayParser = class ArrayParser {
		constructor(source, transform) {
			this.source = source;
			this.transform = transform || identity;
			this.position = 0;
			this.entries = [];
			this.recorded = [];
			this.dimension = 0;
		}
		isEof() {
			return this.position >= this.source.length;
		}
		nextCharacter() {
			var character = this.source[this.position++];
			if (character === "\\") return {
				value: this.source[this.position++],
				escaped: true
			};
			return {
				value: character,
				escaped: false
			};
		}
		record(character) {
			this.recorded.push(character);
		}
		newEntry(includeEmpty) {
			var entry;
			if (this.recorded.length > 0 || includeEmpty) {
				entry = this.recorded.join("");
				if (entry === "NULL" && !includeEmpty) entry = null;
				if (entry !== null) entry = this.transform(entry);
				this.entries.push(entry);
				this.recorded = [];
			}
		}
		consumeDimensions() {
			if (this.source[0] === "[") {
				while (!this.isEof()) if (this.nextCharacter().value === "=") break;
			}
		}
		parse(nested) {
			var character, parser, quote;
			this.consumeDimensions();
			while (!this.isEof()) {
				character = this.nextCharacter();
				if (character.value === "{" && !quote) {
					this.dimension++;
					if (this.dimension > 1) {
						parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
						this.entries.push(parser.parse(true));
						this.position += parser.position - 2;
					}
				} else if (character.value === "}" && !quote) {
					this.dimension--;
					if (!this.dimension) {
						this.newEntry();
						if (nested) return this.entries;
					}
				} else if (character.value === "\"" && !character.escaped) {
					if (quote) this.newEntry(true);
					quote = !quote;
				} else if (character.value === "," && !quote) this.newEntry();
				else this.record(character.value);
			}
			if (this.dimension !== 0) throw new Error("array dimension not balanced");
			return this.entries;
		}
	};
	function identity(value) {
		return value;
	}
}));
// node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/arrayParser.js
var require_arrayParser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var array = require_postgres_array();
	module.exports = { create: function(source, transform) {
		return { parse: function() {
			return array.parse(source, transform);
		} };
	} };
}));
// node_modules/.pnpm/postgres-date@1.0.7/node_modules/postgres-date/index.js
var require_postgres_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
	var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
	var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
	var INFINITY = /^-?infinity$/;
	module.exports = function parseDate(isoDate) {
		if (INFINITY.test(isoDate)) return Number(isoDate.replace("i", "I"));
		var matches = DATE_TIME.exec(isoDate);
		if (!matches) return getDate(isoDate) || null;
		var isBC = !!matches[8];
		var year = parseInt(matches[1], 10);
		if (isBC) year = bcYearToNegativeYear(year);
		var month = parseInt(matches[2], 10) - 1;
		var day = matches[3];
		var hour = parseInt(matches[4], 10);
		var minute = parseInt(matches[5], 10);
		var second = parseInt(matches[6], 10);
		var ms = matches[7];
		ms = ms ? 1e3 * parseFloat(ms) : 0;
		var date;
		var offset = timeZoneOffset(isoDate);
		if (offset != null) {
			date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
			if (is0To99(year)) date.setUTCFullYear(year);
			if (offset !== 0) date.setTime(date.getTime() - offset);
		} else {
			date = new Date(year, month, day, hour, minute, second, ms);
			if (is0To99(year)) date.setFullYear(year);
		}
		return date;
	};
	function getDate(isoDate) {
		var matches = DATE.exec(isoDate);
		if (!matches) return;
		var year = parseInt(matches[1], 10);
		if (!!matches[4]) year = bcYearToNegativeYear(year);
		var month = parseInt(matches[2], 10) - 1;
		var day = matches[3];
		var date = new Date(year, month, day);
		if (is0To99(year)) date.setFullYear(year);
		return date;
	}
	function timeZoneOffset(isoDate) {
		if (isoDate.endsWith("+00")) return 0;
		var zone = TIME_ZONE.exec(isoDate.split(" ")[1]);
		if (!zone) return;
		var type = zone[1];
		if (type === "Z") return 0;
		var sign = type === "-" ? -1 : 1;
		return (parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10)) * sign * 1e3;
	}
	function bcYearToNegativeYear(year) {
		return -(year - 1);
	}
	function is0To99(num) {
		return num >= 0 && num < 100;
	}
}));
// node_modules/.pnpm/xtend@4.0.2/node_modules/xtend/mutable.js
var require_mutable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = extend;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function extend(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	}
}));
// node_modules/.pnpm/postgres-interval@1.2.0/node_modules/postgres-interval/index.js
var require_postgres_interval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var extend = require_mutable();
	module.exports = PostgresInterval;
	function PostgresInterval(raw) {
		if (!(this instanceof PostgresInterval)) return new PostgresInterval(raw);
		extend(this, parse(raw));
	}
	var properties = [
		"seconds",
		"minutes",
		"hours",
		"days",
		"months",
		"years"
	];
	PostgresInterval.prototype.toPostgres = function() {
		var filtered = properties.filter(this.hasOwnProperty, this);
		if (this.milliseconds && filtered.indexOf("seconds") < 0) filtered.push("seconds");
		if (filtered.length === 0) return "0";
		return filtered.map(function(property) {
			var value = this[property] || 0;
			if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "");
			return value + " " + property;
		}, this).join(" ");
	};
	var propertiesISOEquivalent = {
		years: "Y",
		months: "M",
		days: "D",
		hours: "H",
		minutes: "M",
		seconds: "S"
	};
	var dateProperties = [
		"years",
		"months",
		"days"
	];
	var timeProperties = [
		"hours",
		"minutes",
		"seconds"
	];
	PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
		var datePart = dateProperties.map(buildProperty, this).join("");
		var timePart = timeProperties.map(buildProperty, this).join("");
		return "P" + datePart + "T" + timePart;
		function buildProperty(property) {
			var value = this[property] || 0;
			if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "");
			return value + propertiesISOEquivalent[property];
		}
	};
	var NUMBER = "([+-]?\\d+)";
	var YEAR = NUMBER + "\\s+years?";
	var MONTH = NUMBER + "\\s+mons?";
	var DAY = NUMBER + "\\s+days?";
	var INTERVAL = new RegExp([
		YEAR,
		MONTH,
		DAY,
		"([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?"
	].map(function(regexString) {
		return "(" + regexString + ")?";
	}).join("\\s*"));
	var positions = {
		years: 2,
		months: 4,
		days: 6,
		hours: 9,
		minutes: 10,
		seconds: 11,
		milliseconds: 12
	};
	var negatives = [
		"hours",
		"minutes",
		"seconds",
		"milliseconds"
	];
	function parseMilliseconds(fraction) {
		var microseconds = fraction + "000000".slice(fraction.length);
		return parseInt(microseconds, 10) / 1e3;
	}
	function parse(interval) {
		if (!interval) return {};
		var matches = INTERVAL.exec(interval);
		var isNegative = matches[8] === "-";
		return Object.keys(positions).reduce(function(parsed, property) {
			var value = matches[positions[property]];
			if (!value) return parsed;
			value = property === "milliseconds" ? parseMilliseconds(value) : parseInt(value, 10);
			if (!value) return parsed;
			if (isNegative && ~negatives.indexOf(property)) value *= -1;
			parsed[property] = value;
			return parsed;
		}, {});
	}
}));
// node_modules/.pnpm/postgres-bytea@1.0.1/node_modules/postgres-bytea/index.js
var require_postgres_bytea = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bufferFrom = Buffer.from || Buffer;
	module.exports = function parseBytea(input) {
		if (/^\\x/.test(input)) return bufferFrom(input.substr(2), "hex");
		var output = "";
		var i = 0;
		while (i < input.length) if (input[i] !== "\\") {
			output += input[i];
			++i;
		} else if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
			output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8));
			i += 4;
		} else {
			var backslashes = 1;
			while (i + backslashes < input.length && input[i + backslashes] === "\\") backslashes++;
			for (var k = 0; k < Math.floor(backslashes / 2); ++k) output += "\\";
			i += Math.floor(backslashes / 2) * 2;
		}
		return bufferFrom(output, "binary");
	};
}));
// node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/textParsers.js
var require_textParsers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var array = require_postgres_array();
	var arrayParser = require_arrayParser();
	var parseDate = require_postgres_date();
	var parseInterval = require_postgres_interval();
	var parseByteA = require_postgres_bytea();
	function allowNull(fn) {
		return function nullAllowed(value) {
			if (value === null) return value;
			return fn(value);
		};
	}
	function parseBool(value) {
		if (value === null) return value;
		return value === "TRUE" || value === "t" || value === "true" || value === "y" || value === "yes" || value === "on" || value === "1";
	}
	function parseBoolArray(value) {
		if (!value) return null;
		return array.parse(value, parseBool);
	}
	function parseBaseTenInt(string) {
		return parseInt(string, 10);
	}
	function parseIntegerArray(value) {
		if (!value) return null;
		return array.parse(value, allowNull(parseBaseTenInt));
	}
	function parseBigIntegerArray(value) {
		if (!value) return null;
		return array.parse(value, allowNull(function(entry) {
			return parseBigInteger(entry).trim();
		}));
	}
	var parsePointArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parsePoint(entry);
			return entry;
		}).parse();
	};
	var parseFloatArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseFloat(entry);
			return entry;
		}).parse();
	};
	var parseStringArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value).parse();
	};
	var parseDateArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseDate(entry);
			return entry;
		}).parse();
	};
	var parseIntervalArray = function(value) {
		if (!value) return null;
		return arrayParser.create(value, function(entry) {
			if (entry !== null) entry = parseInterval(entry);
			return entry;
		}).parse();
	};
	var parseByteAArray = function(value) {
		if (!value) return null;
		return array.parse(value, allowNull(parseByteA));
	};
	var parseInteger = function(value) {
		return parseInt(value, 10);
	};
	var parseBigInteger = function(value) {
		var valStr = String(value);
		if (/^\d+$/.test(valStr)) return valStr;
		return value;
	};
	var parseJsonArray = function(value) {
		if (!value) return null;
		return array.parse(value, allowNull(JSON.parse));
	};
	var parsePoint = function(value) {
		if (value[0] !== "(") return null;
		value = value.substring(1, value.length - 1).split(",");
		return {
			x: parseFloat(value[0]),
			y: parseFloat(value[1])
		};
	};
	var parseCircle = function(value) {
		if (value[0] !== "<" && value[1] !== "(") return null;
		var point = "(";
		var radius = "";
		var pointParsed = false;
		for (var i = 2; i < value.length - 1; i++) {
			if (!pointParsed) point += value[i];
			if (value[i] === ")") {
				pointParsed = true;
				continue;
			} else if (!pointParsed) continue;
			if (value[i] === ",") continue;
			radius += value[i];
		}
		var result = parsePoint(point);
		result.radius = parseFloat(radius);
		return result;
	};
	var init = function(register) {
		register(20, parseBigInteger);
		register(21, parseInteger);
		register(23, parseInteger);
		register(26, parseInteger);
		register(700, parseFloat);
		register(701, parseFloat);
		register(16, parseBool);
		register(1082, parseDate);
		register(1114, parseDate);
		register(1184, parseDate);
		register(600, parsePoint);
		register(651, parseStringArray);
		register(718, parseCircle);
		register(1e3, parseBoolArray);
		register(1001, parseByteAArray);
		register(1005, parseIntegerArray);
		register(1007, parseIntegerArray);
		register(1028, parseIntegerArray);
		register(1016, parseBigIntegerArray);
		register(1017, parsePointArray);
		register(1021, parseFloatArray);
		register(1022, parseFloatArray);
		register(1231, parseFloatArray);
		register(1014, parseStringArray);
		register(1015, parseStringArray);
		register(1008, parseStringArray);
		register(1009, parseStringArray);
		register(1040, parseStringArray);
		register(1041, parseStringArray);
		register(1115, parseDateArray);
		register(1182, parseDateArray);
		register(1185, parseDateArray);
		register(1186, parseInterval);
		register(1187, parseIntervalArray);
		register(17, parseByteA);
		register(114, JSON.parse.bind(JSON));
		register(3802, JSON.parse.bind(JSON));
		register(199, parseJsonArray);
		register(3807, parseJsonArray);
		register(3907, parseStringArray);
		register(2951, parseStringArray);
		register(791, parseStringArray);
		register(1183, parseStringArray);
		register(1270, parseStringArray);
	};
	module.exports = { init };
}));
// node_modules/.pnpm/pg-int8@1.0.1/node_modules/pg-int8/index.js
var require_pg_int8 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BASE = 1e6;
	function readInt8(buffer) {
		var high = buffer.readInt32BE(0);
		var low = buffer.readUInt32BE(4);
		var sign = "";
		if (high < 0) {
			high = ~high + (low === 0);
			low = ~low + 1 >>> 0;
			sign = "-";
		}
		var result = "";
		var carry;
		var t;
		var digits;
		var pad;
		var l;
		var i;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		high = high / BASE >>> 0;
		t = 4294967296 * carry + low;
		low = t / BASE >>> 0;
		digits = "" + (t - BASE * low);
		if (low === 0 && high === 0) return sign + digits + result;
		pad = "";
		l = 6 - digits.length;
		for (i = 0; i < l; i++) pad += "0";
		result = pad + digits + result;
		carry = high % BASE;
		t = 4294967296 * carry + low;
		digits = "" + t % BASE;
		return sign + digits + result;
	}
	module.exports = readInt8;
}));
// node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/binaryParsers.js
var require_binaryParsers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parseInt64 = require_pg_int8();
	var parseBits = function(data, bits, offset, invert, callback) {
		offset = offset || 0;
		invert = invert || false;
		callback = callback || function(lastValue, newValue, bits) {
			return lastValue * Math.pow(2, bits) + newValue;
		};
		var offsetBytes = offset >> 3;
		var inv = function(value) {
			if (invert) return ~value & 255;
			return value;
		};
		var mask = 255;
		var firstBits = 8 - offset % 8;
		if (bits < firstBits) {
			mask = 255 << 8 - bits & 255;
			firstBits = bits;
		}
		if (offset) mask = mask >> offset % 8;
		var result = 0;
		if (offset % 8 + bits >= 8) result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
		var bytes = bits + offset >> 3;
		for (var i = offsetBytes + 1; i < bytes; i++) result = callback(result, inv(data[i]), 8);
		var lastBits = (bits + offset) % 8;
		if (lastBits > 0) result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
		return result;
	};
	var parseFloatFromBits = function(data, precisionBits, exponentBits) {
		var bias = Math.pow(2, exponentBits - 1) - 1;
		var sign = parseBits(data, 1);
		var exponent = parseBits(data, exponentBits, 1);
		if (exponent === 0) return 0;
		var precisionBitsCounter = 1;
		var parsePrecisionBits = function(lastValue, newValue, bits) {
			if (lastValue === 0) lastValue = 1;
			for (var i = 1; i <= bits; i++) {
				precisionBitsCounter /= 2;
				if ((newValue & 1 << bits - i) > 0) lastValue += precisionBitsCounter;
			}
			return lastValue;
		};
		var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
		if (exponent == Math.pow(2, exponentBits + 1) - 1) {
			if (mantissa === 0) return sign === 0 ? Infinity : -Infinity;
			return NaN;
		}
		return (sign === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
	};
	var parseInt16 = function(value) {
		if (parseBits(value, 1) == 1) return -1 * (parseBits(value, 15, 1, true) + 1);
		return parseBits(value, 15, 1);
	};
	var parseInt32 = function(value) {
		if (parseBits(value, 1) == 1) return -1 * (parseBits(value, 31, 1, true) + 1);
		return parseBits(value, 31, 1);
	};
	var parseFloat32 = function(value) {
		return parseFloatFromBits(value, 23, 8);
	};
	var parseFloat64 = function(value) {
		return parseFloatFromBits(value, 52, 11);
	};
	var parseNumeric = function(value) {
		var sign = parseBits(value, 16, 32);
		if (sign == 49152) return NaN;
		var weight = Math.pow(1e4, parseBits(value, 16, 16));
		var result = 0;
		var ndigits = parseBits(value, 16);
		for (var i = 0; i < ndigits; i++) {
			result += parseBits(value, 16, 64 + 16 * i) * weight;
			weight /= 1e4;
		}
		var scale = Math.pow(10, parseBits(value, 16, 48));
		return (sign === 0 ? 1 : -1) * Math.round(result * scale) / scale;
	};
	var parseDate = function(isUTC, value) {
		var sign = parseBits(value, 1);
		var rawValue = parseBits(value, 63, 1);
		var result = /* @__PURE__ */ new Date((sign === 0 ? 1 : -1) * rawValue / 1e3 + 9466848e5);
		if (!isUTC) result.setTime(result.getTime() + result.getTimezoneOffset() * 6e4);
		result.usec = rawValue % 1e3;
		result.getMicroSeconds = function() {
			return this.usec;
		};
		result.setMicroSeconds = function(value) {
			this.usec = value;
		};
		result.getUTCMicroSeconds = function() {
			return this.usec;
		};
		return result;
	};
	var parseArray = function(value) {
		var dim = parseBits(value, 32);
		parseBits(value, 32, 32);
		var elementType = parseBits(value, 32, 64);
		var offset = 96;
		var dims = [];
		for (var i = 0; i < dim; i++) {
			dims[i] = parseBits(value, 32, offset);
			offset += 32;
			offset += 32;
		}
		var parseElement = function(elementType) {
			var length = parseBits(value, 32, offset);
			offset += 32;
			if (length == 4294967295) return null;
			var result;
			if (elementType == 23 || elementType == 20) {
				result = parseBits(value, length * 8, offset);
				offset += length * 8;
				return result;
			} else if (elementType == 25) {
				result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
				return result;
			} else console.log("ERROR: ElementType not implemented: " + elementType);
		};
		var parse = function(dimension, elementType) {
			var array = [];
			var i;
			if (dimension.length > 1) {
				var count = dimension.shift();
				for (i = 0; i < count; i++) array[i] = parse(dimension, elementType);
				dimension.unshift(count);
			} else for (i = 0; i < dimension[0]; i++) array[i] = parseElement(elementType);
			return array;
		};
		return parse(dims, elementType);
	};
	var parseText = function(value) {
		return value.toString("utf8");
	};
	var parseBool = function(value) {
		if (value === null) return null;
		return parseBits(value, 8) > 0;
	};
	var init = function(register) {
		register(20, parseInt64);
		register(21, parseInt16);
		register(23, parseInt32);
		register(26, parseInt32);
		register(1700, parseNumeric);
		register(700, parseFloat32);
		register(701, parseFloat64);
		register(16, parseBool);
		register(1114, parseDate.bind(null, false));
		register(1184, parseDate.bind(null, true));
		register(1e3, parseArray);
		register(1007, parseArray);
		register(1016, parseArray);
		register(1008, parseArray);
		register(1009, parseArray);
		register(25, parseText);
	};
	module.exports = { init };
}));
// node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/builtins.js
var require_builtins = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Following query was used to generate this file:
	
	SELECT json_object_agg(UPPER(PT.typname), PT.oid::int4 ORDER BY pt.oid)
	FROM pg_type PT
	WHERE typnamespace = (SELECT pgn.oid FROM pg_namespace pgn WHERE nspname = 'pg_catalog') -- Take only builting Postgres types with stable OID (extension types are not guaranted to be stable)
	AND typtype = 'b' -- Only basic types
	AND typelem = 0 -- Ignore aliases
	AND typisdefined -- Ignore undefined types
	*/
	module.exports = {
		BOOL: 16,
		BYTEA: 17,
		CHAR: 18,
		INT8: 20,
		INT2: 21,
		INT4: 23,
		REGPROC: 24,
		TEXT: 25,
		OID: 26,
		TID: 27,
		XID: 28,
		CID: 29,
		JSON: 114,
		XML: 142,
		PG_NODE_TREE: 194,
		SMGR: 210,
		PATH: 602,
		POLYGON: 604,
		CIDR: 650,
		FLOAT4: 700,
		FLOAT8: 701,
		ABSTIME: 702,
		RELTIME: 703,
		TINTERVAL: 704,
		CIRCLE: 718,
		MACADDR8: 774,
		MONEY: 790,
		MACADDR: 829,
		INET: 869,
		ACLITEM: 1033,
		BPCHAR: 1042,
		VARCHAR: 1043,
		DATE: 1082,
		TIME: 1083,
		TIMESTAMP: 1114,
		TIMESTAMPTZ: 1184,
		INTERVAL: 1186,
		TIMETZ: 1266,
		BIT: 1560,
		VARBIT: 1562,
		NUMERIC: 1700,
		REFCURSOR: 1790,
		REGPROCEDURE: 2202,
		REGOPER: 2203,
		REGOPERATOR: 2204,
		REGCLASS: 2205,
		REGTYPE: 2206,
		UUID: 2950,
		TXID_SNAPSHOT: 2970,
		PG_LSN: 3220,
		PG_NDISTINCT: 3361,
		PG_DEPENDENCIES: 3402,
		TSVECTOR: 3614,
		TSQUERY: 3615,
		GTSVECTOR: 3642,
		REGCONFIG: 3734,
		REGDICTIONARY: 3769,
		JSONB: 3802,
		REGNAMESPACE: 4089,
		REGROLE: 4096
	};
}));
// node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/index.js
var require_pg_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	var textParsers = require_textParsers();
	var binaryParsers = require_binaryParsers();
	var arrayParser = require_arrayParser();
	var builtinTypes = require_builtins();
	exports.getTypeParser = getTypeParser;
	exports.setTypeParser = setTypeParser;
	exports.arrayParser = arrayParser;
	exports.builtins = builtinTypes;
	var typeParsers = {
		text: {},
		binary: {}
	};
	function noParse(val) {
		return String(val);
	}
	function getTypeParser(oid, format) {
		format = format || "text";
		if (!typeParsers[format]) return noParse;
		return typeParsers[format][oid] || noParse;
	}
	function setTypeParser(oid, format, parseFn) {
		if (typeof format == "function") {
			parseFn = format;
			format = "text";
		}
		typeParsers[format][oid] = parseFn;
	}
	textParsers.init(function(oid, converter) {
		typeParsers.text[oid] = converter;
	});
	binaryParsers.init(function(oid, converter) {
		typeParsers.binary[oid] = converter;
	});
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let user;
	try {
		user = process.platform === "win32" ? process.env.USERNAME : process.env.USER;
	} catch {}
	module.exports = {
		host: "localhost",
		user,
		database: void 0,
		password: null,
		connectionString: void 0,
		port: 5432,
		rows: 0,
		binary: false,
		max: 10,
		idleTimeoutMillis: 3e4,
		client_encoding: "",
		ssl: false,
		sslnegotiation: void 0,
		application_name: void 0,
		fallback_application_name: void 0,
		options: void 0,
		parseInputDatesAsUTC: false,
		statement_timeout: false,
		lock_timeout: false,
		idle_in_transaction_session_timeout: false,
		query_timeout: false,
		connect_timeout: 0,
		keepalives: 1,
		keepalives_idle: 0
	};
	const pgTypes = require_pg_types();
	const parseBigInteger = pgTypes.getTypeParser(20, "text");
	const parseBigIntegerArray = pgTypes.getTypeParser(1016, "text");
	module.exports.__defineSetter__("parseInt8", function(val) {
		pgTypes.setTypeParser(20, "text", val ? pgTypes.getTypeParser(23, "text") : parseBigInteger);
		pgTypes.setTypeParser(1016, "text", val ? pgTypes.getTypeParser(1007, "text") : parseBigIntegerArray);
	});
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const defaults = require_defaults();
	const nodeUtils = __require("util");
	const { isDate } = __require("util/types");
	const invalidDateDeprecationNotice = nodeUtils.deprecate(() => {}, "Sending an invalid date to Postgres is deprecated and will throw an error in the next major version of pg. Ensure any Date object passed as a query parameter is valid.", "PG_INVALID_DATE");
	function escapeElement(elementRepresentation) {
		return "\"" + elementRepresentation.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
	}
	function arrayString(val) {
		let result = "{";
		for (let i = 0; i < val.length; i++) {
			if (i > 0) result += ",";
			let item = val[i];
			if (item == null) result += "NULL";
			else if (Array.isArray(item)) result += arrayString(item);
			else if (ArrayBuffer.isView(item)) {
				if (!(item instanceof Buffer)) item = Buffer.from(item.buffer, item.byteOffset, item.byteLength);
				result += "\\\\x" + item.toString("hex");
			} else result += escapeElement(prepareValue(item));
		}
		result += "}";
		return result;
	}
	const prepareValue = function(val, seen) {
		if (val == null) return null;
		if (typeof val === "object") {
			if (val instanceof Buffer) return val;
			if (ArrayBuffer.isView(val)) return Buffer.from(val.buffer, val.byteOffset, val.byteLength);
			if (isDate(val)) {
				if (isNaN(val.getTime())) invalidDateDeprecationNotice();
				if (defaults.parseInputDatesAsUTC) return dateToStringUTC(val);
				else return dateToString(val);
			}
			if (Array.isArray(val)) return arrayString(val);
			return prepareObject(val, seen);
		}
		return val.toString();
	};
	function prepareObject(val, seen) {
		if (val && typeof val.toPostgres === "function") {
			seen = seen || [];
			if (seen.indexOf(val) !== -1) throw new Error("circular reference detected while preparing \"" + val + "\" for query");
			seen.push(val);
			return prepareValue(val.toPostgres(prepareValue), seen);
		}
		return JSON.stringify(val);
	}
	function dateToString(date) {
		let offset = -date.getTimezoneOffset();
		let year = date.getFullYear();
		const isBCYear = year < 1;
		if (isBCYear) year = Math.abs(year) + 1;
		let ret = String(year).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + "T" + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + String(date.getMilliseconds()).padStart(3, "0");
		if (offset < 0) {
			ret += "-";
			offset *= -1;
		} else ret += "+";
		ret += String(Math.floor(offset / 60)).padStart(2, "0") + ":" + String(offset % 60).padStart(2, "0");
		if (isBCYear) ret += " BC";
		return ret;
	}
	function dateToStringUTC(date) {
		let year = date.getUTCFullYear();
		const isBCYear = year < 1;
		if (isBCYear) year = Math.abs(year) + 1;
		let ret = String(year).padStart(4, "0") + "-" + String(date.getUTCMonth() + 1).padStart(2, "0") + "-" + String(date.getUTCDate()).padStart(2, "0") + "T" + String(date.getUTCHours()).padStart(2, "0") + ":" + String(date.getUTCMinutes()).padStart(2, "0") + ":" + String(date.getUTCSeconds()).padStart(2, "0") + "." + String(date.getUTCMilliseconds()).padStart(3, "0");
		ret += "+00:00";
		if (isBCYear) ret += " BC";
		return ret;
	}
	function normalizeQueryConfig(config, values, callback) {
		config = typeof config === "string" ? { text: config } : cloneQueryConfig(config);
		if (values) {
			if (typeof values === "function") config.callback = values;
			else config.values = values;
		}
		if (callback) config.callback = callback;
		return config;
	}
	function cloneQueryConfig(config) {
		if (config == null) return config;
		return Object.defineProperties(Object.create(Object.getPrototypeOf(config)), Object.getOwnPropertyDescriptors(config));
	}
	const escapeIdentifier = function(str) {
		return "\"" + str.replace(/"/g, "\"\"") + "\"";
	};
	const escapeLiteral = function(str) {
		let hasBackslash = false;
		let escaped = "'";
		if (str == null) return "''";
		if (typeof str !== "string") return "''";
		for (let i = 0; i < str.length; i++) {
			const c = str[i];
			if (c === "'") escaped += c + c;
			else if (c === "\\") {
				escaped += c + c;
				hasBackslash = true;
			} else escaped += c;
		}
		escaped += "'";
		if (hasBackslash === true) escaped = " E" + escaped;
		return escaped;
	};
	module.exports = {
		prepareValue: function prepareValueWrapper(value) {
			return prepareValue(value);
		},
		normalizeQueryConfig,
		escapeIdentifier,
		escapeLiteral
	};
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/crypto/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const nodeCrypto = __require("crypto");
	module.exports = {
		postgresMd5PasswordHash,
		randomBytes,
		deriveKey,
		sha256,
		hashByName,
		hmacSha256,
		md5
	};
	/**
	* The Web Crypto API - grabbed from the Node.js library or the global
	* @type Crypto
	*/
	const webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
	/**
	* The SubtleCrypto API for low level crypto operations.
	* @type SubtleCrypto
	*/
	const subtleCrypto = webCrypto.subtle;
	const textEncoder = new TextEncoder();
	/**
	*
	* @param {*} length
	* @returns
	*/
	function randomBytes(length) {
		return webCrypto.getRandomValues(Buffer.alloc(length));
	}
	async function md5(string) {
		try {
			return nodeCrypto.createHash("md5").update(string, "utf-8").digest("hex");
		} catch (e) {
			const data = typeof string === "string" ? textEncoder.encode(string) : string;
			const hash = await subtleCrypto.digest("MD5", data);
			return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
		}
	}
	async function postgresMd5PasswordHash(user, password, salt) {
		const inner = await md5(password + user);
		return "md5" + await md5(Buffer.concat([Buffer.from(inner), salt]));
	}
	/**
	* Create a SHA-256 digest of the given data
	* @param {Buffer} data
	*/
	async function sha256(text) {
		return await subtleCrypto.digest("SHA-256", text);
	}
	async function hashByName(hashName, text) {
		return await subtleCrypto.digest(hashName, text);
	}
	/**
	* Sign the message with the given key
	* @param {ArrayBuffer} keyBuffer
	* @param {string} msg
	*/
	async function hmacSha256(keyBuffer, msg) {
		const key = await subtleCrypto.importKey("raw", keyBuffer, {
			name: "HMAC",
			hash: "SHA-256"
		}, false, ["sign"]);
		return await subtleCrypto.sign("HMAC", key, textEncoder.encode(msg));
	}
	/**
	* Derive a key from the password and salt
	* @param {string} password
	* @param {Uint8Array} salt
	* @param {number} iterations
	*/
	async function deriveKey(password, salt, iterations) {
		const key = await subtleCrypto.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
		const params = {
			name: "PBKDF2",
			hash: "SHA-256",
			salt,
			iterations
		};
		return await subtleCrypto.deriveBits(params, key, 256, ["deriveBits"]);
	}
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/crypto/cert-signatures.js
var require_cert_signatures = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function x509Error(msg, cert) {
		return /* @__PURE__ */ new Error("SASL channel binding: " + msg + " when parsing public certificate " + cert.toString("base64"));
	}
	function readASN1Length(data, index) {
		let length = data[index++];
		if (length < 128) return {
			length,
			index
		};
		const lengthBytes = length & 127;
		if (lengthBytes > 4) throw x509Error("bad length", data);
		length = 0;
		for (let i = 0; i < lengthBytes; i++) length = length << 8 | data[index++];
		return {
			length,
			index
		};
	}
	function readASN1OID(data, index) {
		if (data[index++] !== 6) throw x509Error("non-OID data", data);
		const { length: OIDLength, index: indexAfterOIDLength } = readASN1Length(data, index);
		index = indexAfterOIDLength;
		const lastIndex = index + OIDLength;
		const byte1 = data[index++];
		let oid = (byte1 / 40 >> 0) + "." + byte1 % 40;
		while (index < lastIndex) {
			let value = 0;
			while (index < lastIndex) {
				const nextByte = data[index++];
				value = value << 7 | nextByte & 127;
				if (nextByte < 128) break;
			}
			oid += "." + value;
		}
		return {
			oid,
			index
		};
	}
	function expectASN1Seq(data, index) {
		if (data[index++] !== 48) throw x509Error("non-sequence data", data);
		return readASN1Length(data, index);
	}
	function signatureAlgorithmHashFromCertificate(data, index) {
		if (index === void 0) index = 0;
		index = expectASN1Seq(data, index).index;
		const { length: certInfoLength, index: indexAfterCertInfoLength } = expectASN1Seq(data, index);
		index = indexAfterCertInfoLength + certInfoLength;
		index = expectASN1Seq(data, index).index;
		const { oid, index: indexAfterOID } = readASN1OID(data, index);
		switch (oid) {
			case "1.2.840.113549.1.1.4": return "MD5";
			case "1.2.840.113549.1.1.5": return "SHA-1";
			case "1.2.840.113549.1.1.11": return "SHA-256";
			case "1.2.840.113549.1.1.12": return "SHA-384";
			case "1.2.840.113549.1.1.13": return "SHA-512";
			case "1.2.840.113549.1.1.14": return "SHA-224";
			case "1.2.840.113549.1.1.15": return "SHA512-224";
			case "1.2.840.113549.1.1.16": return "SHA512-256";
			case "1.2.840.10045.4.1": return "SHA-1";
			case "1.2.840.10045.4.3.1": return "SHA-224";
			case "1.2.840.10045.4.3.2": return "SHA-256";
			case "1.2.840.10045.4.3.3": return "SHA-384";
			case "1.2.840.10045.4.3.4": return "SHA-512";
			case "1.2.840.113549.1.1.10": {
				index = indexAfterOID;
				index = expectASN1Seq(data, index).index;
				if (data[index++] !== 160) throw x509Error("non-tag data", data);
				index = readASN1Length(data, index).index;
				index = expectASN1Seq(data, index).index;
				const { oid: hashOID } = readASN1OID(data, index);
				switch (hashOID) {
					case "1.2.840.113549.2.5": return "MD5";
					case "1.3.14.3.2.26": return "SHA-1";
					case "2.16.840.1.101.3.4.2.1": return "SHA-256";
					case "2.16.840.1.101.3.4.2.2": return "SHA-384";
					case "2.16.840.1.101.3.4.2.3": return "SHA-512";
				}
				throw x509Error("unknown hash OID " + hashOID, data);
			}
			case "1.3.101.110":
			case "1.3.101.112": return "SHA-512";
			case "1.3.101.111":
			case "1.3.101.113": throw x509Error("Ed448 certificate channel binding is not currently supported by Postgres");
		}
		throw x509Error("unknown OID " + oid, data);
	}
	module.exports = { signatureAlgorithmHashFromCertificate };
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/crypto/sasl.js
var require_sasl = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const crypto = require_utils();
	const { signatureAlgorithmHashFromCertificate } = require_cert_signatures();
	function saslprep(password) {
		return password.replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, " ").replace(/[\u00AD\u034F\u1806\u180B\u180C\u180D\u200C\u200D\u2060\uFE00-\uFE0F\uFEFF]/g, "").normalize("NFKC");
	}
	const DEFAULT_MAX_SCRAM_ITERATIONS = 1e5;
	function startSession(mechanisms, stream, scramMaxIterations = DEFAULT_MAX_SCRAM_ITERATIONS) {
		const candidates = ["SCRAM-SHA-256"];
		if (stream) candidates.unshift("SCRAM-SHA-256-PLUS");
		const mechanism = candidates.find((candidate) => mechanisms.includes(candidate));
		if (!mechanism) throw new Error("SASL: Only mechanism(s) " + candidates.join(" and ") + " are supported");
		if (mechanism === "SCRAM-SHA-256-PLUS" && typeof stream.getPeerCertificate !== "function") throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");
		const clientNonce = crypto.randomBytes(18).toString("base64");
		return {
			mechanism,
			clientNonce,
			response: (mechanism === "SCRAM-SHA-256-PLUS" ? "p=tls-server-end-point" : stream ? "y" : "n") + ",,n=*,r=" + clientNonce,
			message: "SASLInitialResponse",
			scramMaxIterations
		};
	}
	async function continueSession(session, password, serverData, stream) {
		if (session.message !== "SASLInitialResponse") throw new Error("SASL: Last message was not SASLInitialResponse");
		if (typeof password !== "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
		if (password === "") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");
		if (typeof serverData !== "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
		const sv = parseServerFirstMessage(serverData);
		if (!sv.nonce.startsWith(session.clientNonce)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
		else if (sv.nonce.length === session.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
		const scramMaxIterations = typeof session.scramMaxIterations === "number" ? session.scramMaxIterations : DEFAULT_MAX_SCRAM_ITERATIONS;
		if (scramMaxIterations !== 0 && sv.iteration > scramMaxIterations) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration count " + sv.iteration + " exceeds scramMaxIterations of " + scramMaxIterations);
		const clientFirstMessageBare = "n=*,r=" + session.clientNonce;
		const serverFirstMessage = "r=" + sv.nonce + ",s=" + sv.salt + ",i=" + sv.iteration;
		let channelBinding = stream ? "eSws" : "biws";
		if (session.mechanism === "SCRAM-SHA-256-PLUS") {
			const peerCert = stream.getPeerCertificate().raw;
			let hashName = signatureAlgorithmHashFromCertificate(peerCert);
			if (hashName === "MD5" || hashName === "SHA-1") hashName = "SHA-256";
			const certHash = await crypto.hashByName(hashName, peerCert);
			channelBinding = Buffer.concat([Buffer.from("p=tls-server-end-point,,"), Buffer.from(certHash)]).toString("base64");
		}
		const clientFinalMessageWithoutProof = "c=" + channelBinding + ",r=" + sv.nonce;
		const authMessage = clientFirstMessageBare + "," + serverFirstMessage + "," + clientFinalMessageWithoutProof;
		const saltBytes = Buffer.from(sv.salt, "base64");
		const saltedPassword = await crypto.deriveKey(saslprep(password), saltBytes, sv.iteration);
		const clientKey = await crypto.hmacSha256(saltedPassword, "Client Key");
		const storedKey = await crypto.sha256(clientKey);
		const clientSignature = await crypto.hmacSha256(storedKey, authMessage);
		const clientProof = xorBuffers(Buffer.from(clientKey), Buffer.from(clientSignature)).toString("base64");
		const serverKey = await crypto.hmacSha256(saltedPassword, "Server Key");
		const serverSignatureBytes = await crypto.hmacSha256(serverKey, authMessage);
		session.message = "SASLResponse";
		session.serverSignature = Buffer.from(serverSignatureBytes).toString("base64");
		session.response = clientFinalMessageWithoutProof + ",p=" + clientProof;
	}
	function finalizeSession(session, serverData) {
		if (session.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
		if (typeof serverData !== "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
		const { serverSignature } = parseServerFinalMessage(serverData);
		if (serverSignature !== session.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
	}
	/**
	* printable       = %x21-2B / %x2D-7E
	*                   ;; Printable ASCII except ",".
	*                   ;; Note that any "printable" is also
	*                   ;; a valid "value".
	*/
	function isPrintableChars(text) {
		if (typeof text !== "string") throw new TypeError("SASL: text must be a string");
		return text.split("").map((_, i) => text.charCodeAt(i)).every((c) => c >= 33 && c <= 43 || c >= 45 && c <= 126);
	}
	/**
	* base64-char     = ALPHA / DIGIT / "/" / "+"
	*
	* base64-4        = 4base64-char
	*
	* base64-3        = 3base64-char "="
	*
	* base64-2        = 2base64-char "=="
	*
	* base64          = *base64-4 [base64-3 / base64-2]
	*/
	function isBase64(text) {
		return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text);
	}
	function parseAttributePairs(text) {
		if (typeof text !== "string") throw new TypeError("SASL: attribute pairs text must be a string");
		return new Map(text.split(",").map((attrValue) => {
			if (!/^.=/.test(attrValue)) throw new Error("SASL: Invalid attribute pair entry");
			return [attrValue[0], attrValue.substring(2)];
		}));
	}
	function parseServerFirstMessage(data) {
		const attrPairs = parseAttributePairs(data);
		const nonce = attrPairs.get("r");
		if (!nonce) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
		else if (!isPrintableChars(nonce)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
		const salt = attrPairs.get("s");
		if (!salt) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
		else if (!isBase64(salt)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
		const iterationText = attrPairs.get("i");
		if (!iterationText) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
		else if (!/^[1-9][0-9]*$/.test(iterationText)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
		return {
			nonce,
			salt,
			iteration: parseInt(iterationText, 10)
		};
	}
	function parseServerFinalMessage(serverData) {
		const attrPairs = parseAttributePairs(serverData);
		const error = attrPairs.get("e");
		const serverSignature = attrPairs.get("v");
		if (error) throw new Error(`SASL: SCRAM-SERVER-FINAL-MESSAGE: server returned error: "${error}"`);
		if (!serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
		else if (!isBase64(serverSignature)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
		return { serverSignature };
	}
	function xorBuffers(a, b) {
		if (!Buffer.isBuffer(a)) throw new TypeError("first argument must be a Buffer");
		if (!Buffer.isBuffer(b)) throw new TypeError("second argument must be a Buffer");
		if (a.length !== b.length) throw new Error("Buffer lengths must match");
		if (a.length === 0) throw new Error("Buffers cannot be empty");
		return Buffer.from(a.map((_, i) => a[i] ^ b[i]));
	}
	module.exports = {
		startSession,
		continueSession,
		finalizeSession,
		DEFAULT_MAX_SCRAM_ITERATIONS
	};
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/type-overrides.js
var require_type_overrides = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const types = require_pg_types();
	function TypeOverrides(userTypes) {
		this._types = userTypes || types;
		this.text = {};
		this.binary = {};
	}
	TypeOverrides.prototype.getOverrides = function(format) {
		switch (format) {
			case "text": return this.text;
			case "binary": return this.binary;
			default: return {};
		}
	};
	TypeOverrides.prototype.setTypeParser = function(oid, format, parseFn) {
		if (typeof format === "function") {
			parseFn = format;
			format = "text";
		}
		this.getOverrides(format)[oid] = parseFn;
	};
	TypeOverrides.prototype.getTypeParser = function(oid, format) {
		format = format || "text";
		return this.getOverrides(format)[oid] || this._types.getTypeParser(oid, format);
	};
	module.exports = TypeOverrides;
}));
// node_modules/.pnpm/pg-connection-string@2.14.1/node_modules/pg-connection-string/index.js
var require_pg_connection_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function parse(str, options = {}) {
		if (str.charAt(0) === "/") {
			const config = str.split(" ");
			return {
				host: config[0],
				database: config[1]
			};
		}
		const config = Object.create(null);
		let result;
		let dummyHost = false;
		if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) str = encodeURI(str).replace(/%25(\d\d)/g, "%$1");
		try {
			try {
				result = new URL(str, "postgres://base");
			} catch (e) {
				result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
				dummyHost = true;
			}
		} catch (err) {
			err.input && (err.input = "*****REDACTED*****");
			throw err;
		}
		for (const entry of result.searchParams.entries()) config[entry[0]] = entry[1];
		config.user = config.user || decodeURIComponent(result.username);
		config.password = config.password || decodeURIComponent(result.password);
		if (result.protocol == "socket:") {
			config.host = decodeURI(result.pathname);
			config.database = result.searchParams.get("db");
			config.client_encoding = result.searchParams.get("encoding");
			return config;
		}
		const hostname = (dummyHost ? "" : result.hostname).replace(/^\[(.+)\]$/, "$1");
		if (!config.host) config.host = decodeURIComponent(hostname);
		else if (hostname && /^%2f/i.test(hostname)) result.pathname = hostname + result.pathname;
		if (!config.port) config.port = result.port;
		const pathname = result.pathname.slice(1) || null;
		config.database = pathname ? decodeURI(pathname) : null;
		if (config.ssl === "true" || config.ssl === "1") config.ssl = true;
		if (config.ssl === "0") config.ssl = false;
		if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) config.ssl = {};
		if (config.sslnegotiation === "direct" && config.ssl === void 0) config.ssl = true;
		const fs = config.sslcert || config.sslkey || config.sslrootcert ? __require("fs") : null;
		if (config.sslcert) config.ssl.cert = fs.readFileSync(config.sslcert).toString();
		if (config.sslkey) config.ssl.key = fs.readFileSync(config.sslkey).toString();
		if (config.sslrootcert) config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
		if (options.useLibpqCompat && config.uselibpqcompat) throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");
		if (config.uselibpqcompat === "true" || options.useLibpqCompat) switch (config.sslmode) {
			case "disable":
				config.ssl = false;
				break;
			case "prefer":
				config.ssl.rejectUnauthorized = false;
				break;
			case "require":
				if (config.sslrootcert) config.ssl.checkServerIdentity = function() {};
				else config.ssl.rejectUnauthorized = false;
				break;
			case "verify-ca":
				if (!config.ssl.ca) throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");
				config.ssl.checkServerIdentity = function() {};
		}
		else switch (config.sslmode) {
			case "disable":
				config.ssl = false;
				break;
			case "prefer":
			case "require":
			case "verify-ca":
			case "verify-full":
				if (config.sslmode !== "verify-full") deprecatedSslModeWarning(config.sslmode);
				break;
			case "no-verify": config.ssl.rejectUnauthorized = false;
		}
		return config;
	}
	function toConnectionOptions(sslConfig) {
		return Object.entries(sslConfig).reduce((c, [key, value]) => {
			if (value !== void 0 && value !== null) c[key] = value;
			return c;
		}, Object.create(null));
	}
	function toClientConfig(config) {
		return Object.entries(config).reduce((c, [key, value]) => {
			if (key === "ssl") {
				const sslConfig = value;
				if (typeof sslConfig === "boolean") c[key] = sslConfig;
				if (typeof sslConfig === "object") c[key] = toConnectionOptions(sslConfig);
			} else if (value !== void 0 && value !== null) {
				if (key === "port") {
					if (value !== "") {
						const v = parseInt(value, 10);
						if (isNaN(v)) throw new Error(`Invalid ${key}: ${value}`);
						c[key] = v;
					}
				} else c[key] = value;
			}
			return c;
		}, Object.create(null));
	}
	function parseIntoClientConfig(str) {
		return toClientConfig(parse(str));
	}
	function deprecatedSslModeWarning(sslmode) {
		if (!deprecatedSslModeWarning.warned && typeof process !== "undefined" && process.emitWarning) {
			deprecatedSslModeWarning.warned = true;
			process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${sslmode}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`);
		}
	}
	module.exports = parse;
	parse.parse = parse;
	parse.toClientConfig = toClientConfig;
	parse.parseIntoClientConfig = parseIntoClientConfig;
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/connection-parameters.js
var require_connection_parameters = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const dns = __require("dns");
	const defaults = require_defaults();
	const parse = require_pg_connection_string().parse;
	const val = function(key, config, envVar) {
		if (config[key]) return config[key];
		if (envVar === void 0) envVar = process.env["PG" + key.toUpperCase()];
		else if (envVar === false) {} else envVar = process.env[envVar];
		return envVar || defaults[key];
	};
	const readSSLConfigFromEnvironment = function() {
		switch (process.env.PGSSLMODE) {
			case "disable": return false;
			case "prefer":
			case "require":
			case "verify-ca":
			case "verify-full": return true;
			case "no-verify": return { rejectUnauthorized: false };
		}
		return defaults.ssl;
	};
	const quoteParamValue = function(value) {
		return "'" + ("" + value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
	};
	const add = function(params, config, paramName) {
		const value = config[paramName];
		if (value !== void 0 && value !== null) params.push(paramName + "=" + quoteParamValue(value));
	};
	var ConnectionParameters = class {
		constructor(config) {
			config = typeof config === "string" ? parse(config) : config || {};
			if (config.connectionString) config = Object.assign({}, config, parse(config.connectionString));
			this.user = val("user", config);
			this.database = val("database", config);
			if (this.database === void 0) this.database = this.user;
			this.port = parseInt(val("port", config), 10);
			this.host = val("host", config);
			Object.defineProperty(this, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: val("password", config)
			});
			this.binary = val("binary", config);
			this.options = val("options", config);
			this.ssl = typeof config.ssl === "undefined" ? readSSLConfigFromEnvironment() : config.ssl;
			if (typeof this.ssl === "string") {
				if (this.ssl === "true") this.ssl = true;
			}
			if (this.ssl === "no-verify") this.ssl = { rejectUnauthorized: false };
			if (this.ssl && this.ssl.key) Object.defineProperty(this.ssl, "key", { enumerable: false });
			this.sslnegotiation = val("sslnegotiation", config, "PGSSLNEGOTIATION");
			if (this.sslnegotiation !== void 0 && this.sslnegotiation !== "postgres" && this.sslnegotiation !== "direct") throw new Error(`Invalid sslnegotiation value: "${this.sslnegotiation}". Valid values are "postgres" and "direct".`);
			if (this.sslnegotiation === "direct" && !this.ssl) throw new Error("sslnegotiation=direct requires SSL to be enabled");
			this.client_encoding = val("client_encoding", config);
			this.replication = val("replication", config);
			this.isDomainSocket = !(this.host || "").indexOf("/");
			this.application_name = val("application_name", config, "PGAPPNAME");
			this.fallback_application_name = val("fallback_application_name", config, false);
			this.statement_timeout = val("statement_timeout", config, false);
			this.lock_timeout = val("lock_timeout", config, false);
			this.idle_in_transaction_session_timeout = val("idle_in_transaction_session_timeout", config, false);
			this.query_timeout = val("query_timeout", config, false);
			if (config.connectionTimeoutMillis === void 0) this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0;
			else this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1e3);
			if (config.keepAlive === false) this.keepalives = 0;
			else if (config.keepAlive === true) this.keepalives = 1;
			if (typeof config.keepAliveInitialDelayMillis === "number") this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1e3);
		}
		getLibpqConnectionString(cb) {
			const params = [];
			add(params, this, "user");
			add(params, this, "password");
			add(params, this, "port");
			add(params, this, "application_name");
			add(params, this, "fallback_application_name");
			add(params, this, "connect_timeout");
			add(params, this, "options");
			const ssl = typeof this.ssl === "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
			add(params, ssl, "sslmode");
			add(params, ssl, "sslca");
			add(params, ssl, "sslkey");
			add(params, ssl, "sslcert");
			add(params, ssl, "sslrootcert");
			add(params, this, "sslnegotiation");
			if (this.database) params.push("dbname=" + quoteParamValue(this.database));
			if (this.replication) params.push("replication=" + quoteParamValue(this.replication));
			if (this.host) params.push("host=" + quoteParamValue(this.host));
			if (this.isDomainSocket) return cb(null, params.join(" "));
			if (this.client_encoding) params.push("client_encoding=" + quoteParamValue(this.client_encoding));
			dns.lookup(this.host, function(err, address) {
				if (err) return cb(err, null);
				params.push("hostaddr=" + quoteParamValue(address));
				return cb(null, params.join(" "));
			});
		}
	};
	module.exports = ConnectionParameters;
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/result.js
var require_result = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const types = require_pg_types();
	const matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;
	var Result = class {
		constructor(rowMode, types) {
			this.command = null;
			this.rowCount = null;
			this.oid = null;
			this.rows = [];
			this.fields = [];
			this._parsers = void 0;
			this._types = types;
			this.RowCtor = null;
			this.rowAsArray = rowMode === "array";
			if (this.rowAsArray) this.parseRow = this._parseRowAsArray;
			this._prebuiltEmptyResultObject = null;
		}
		addCommandComplete(msg) {
			let match;
			if (msg.text) match = matchRegexp.exec(msg.text);
			else match = matchRegexp.exec(msg.command);
			if (match) {
				this.command = match[1];
				if (match[3]) {
					this.oid = parseInt(match[2], 10);
					this.rowCount = parseInt(match[3], 10);
				} else if (match[2]) this.rowCount = parseInt(match[2], 10);
			}
		}
		_parseRowAsArray(rowData) {
			const row = new Array(rowData.length);
			for (let i = 0, len = rowData.length; i < len; i++) {
				const rawValue = rowData[i];
				if (rawValue !== null) row[i] = this._parsers[i](rawValue);
				else row[i] = null;
			}
			return row;
		}
		parseRow(rowData) {
			const row = { ...this._prebuiltEmptyResultObject };
			for (let i = 0, len = rowData.length; i < len; i++) {
				const rawValue = rowData[i];
				const field = this.fields[i].name;
				if (rawValue !== null) {
					const v = this.fields[i].format === "binary" ? Buffer.from(rawValue) : rawValue;
					row[field] = this._parsers[i](v);
				} else row[field] = null;
			}
			return row;
		}
		addRow(row) {
			this.rows.push(row);
		}
		addFields(fieldDescriptions) {
			this.fields = fieldDescriptions;
			if (this.fields.length) this._parsers = new Array(fieldDescriptions.length);
			const row = Object.create(null);
			for (let i = 0; i < fieldDescriptions.length; i++) {
				const desc = fieldDescriptions[i];
				row[desc.name] = null;
				if (this._types) this._parsers[i] = this._types.getTypeParser(desc.dataTypeID, desc.format || "text");
				else this._parsers[i] = types.getTypeParser(desc.dataTypeID, desc.format || "text");
			}
			this._prebuiltEmptyResultObject = { ...row };
		}
	};
	module.exports = Result;
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/query.js
var require_query$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { EventEmitter } = __require("events");
	const Result = require_result();
	const utils = require_utils$1();
	var Query = class extends EventEmitter {
		constructor(config, values, callback) {
			super();
			config = utils.normalizeQueryConfig(config, values, callback);
			this.text = config.text;
			this.values = config.values;
			this.rows = config.rows;
			this.types = config.types;
			this.name = config.name;
			this.queryMode = config.queryMode;
			this.binary = config.binary;
			this.portal = config.portal || "";
			this.callback = config.callback;
			this._rowMode = config.rowMode;
			if (process.domain && config.callback) this.callback = process.domain.bind(config.callback);
			this._result = new Result(this._rowMode, this.types);
			this._results = this._result;
			this._canceledDueToError = false;
		}
		requiresPreparation() {
			if (this.queryMode === "extended") return true;
			if (this.name) return true;
			if (this.rows) return true;
			if (!this.text) return false;
			if (!this.values) return false;
			return this.values.length > 0;
		}
		_checkForMultirow() {
			if (this._result.command) {
				if (!Array.isArray(this._results)) this._results = [this._result];
				this._result = new Result(this._rowMode, this._result._types);
				this._results.push(this._result);
			}
		}
		handleRowDescription(msg) {
			this._checkForMultirow();
			this._result.addFields(msg.fields);
			this._accumulateRows = this.callback || !this.listeners("row").length;
		}
		handleDataRow(msg) {
			let row;
			if (this._canceledDueToError) return;
			try {
				row = this._result.parseRow(msg.fields);
			} catch (err) {
				this._canceledDueToError = err;
				return;
			}
			this.emit("row", row, this._result);
			if (this._accumulateRows) this._result.addRow(row);
		}
		handleCommandComplete(msg, connection) {
			this._checkForMultirow();
			this._result.addCommandComplete(msg);
			if (this.rows) connection.sync();
		}
		handleEmptyQuery(connection) {
			if (this.rows) connection.sync();
		}
		handleError(err, connection) {
			if (this._canceledDueToError) {
				err = this._canceledDueToError;
				this._canceledDueToError = false;
			}
			if (this.callback) return this.callback(err);
			this.emit("error", err);
		}
		handleReadyForQuery(con) {
			if (this._canceledDueToError) return this.handleError(this._canceledDueToError, con);
			if (this.callback) try {
				this.callback(null, this._results);
			} catch (err) {
				process.nextTick(() => {
					throw err;
				});
			}
			this.emit("end", this._results);
		}
		submit(connection) {
			if (typeof this.text !== "string" && typeof this.name !== "string") return /* @__PURE__ */ new Error("A query must have either text or a name. Supplying neither is unsupported.");
			const previous = connection.parsedStatements[this.name] || connection.submittedNamedStatements[this.name];
			if (this.text && previous && this.text !== previous) return /* @__PURE__ */ new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
			if (this.values && !Array.isArray(this.values)) return /* @__PURE__ */ new Error("Query values must be an array");
			if (this.requiresPreparation()) {
				connection.stream.cork && connection.stream.cork();
				try {
					this.prepare(connection);
				} finally {
					connection.stream.uncork && connection.stream.uncork();
				}
			} else connection.query(this.text);
			return null;
		}
		hasBeenParsed(connection) {
			return this.name && (connection.parsedStatements[this.name] !== void 0 || connection.submittedNamedStatements[this.name] !== void 0);
		}
		handlePortalSuspended(connection) {
			this._getRows(connection, this.rows);
		}
		_getRows(connection, rows) {
			connection.execute({
				portal: this.portal,
				rows
			});
			if (!rows) connection.sync();
			else connection.flush();
		}
		prepare(connection) {
			if (!this.hasBeenParsed(connection)) {
				connection.parse({
					text: this.text,
					name: this.name,
					types: this.types
				});
				if (this.name) connection.submittedNamedStatements[this.name] = this.text;
			}
			try {
				connection.bind({
					portal: this.portal,
					statement: this.name,
					values: this.values,
					binary: this.binary,
					valueMapper: utils.prepareValue
				});
			} catch (err) {
				connection.close({
					type: "S",
					name: this.name
				});
				connection.sync();
				this.handleError(err, connection);
				return;
			}
			connection.describe({
				type: "P",
				name: this.portal || ""
			});
			this._getRows(connection, this.rows);
		}
		handleCopyInResponse(connection) {
			connection.sendCopyFail("No source stream defined");
		}
		handleCopyData(msg, connection) {}
	};
	module.exports = Query;
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/messages.js
var require_messages = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = void 0;
	exports.parseComplete = {
		name: "parseComplete",
		length: 5
	};
	exports.bindComplete = {
		name: "bindComplete",
		length: 5
	};
	exports.closeComplete = {
		name: "closeComplete",
		length: 5
	};
	exports.noData = {
		name: "noData",
		length: 5
	};
	exports.portalSuspended = {
		name: "portalSuspended",
		length: 5
	};
	exports.replicationStart = {
		name: "replicationStart",
		length: 4
	};
	exports.emptyQuery = {
		name: "emptyQuery",
		length: 4
	};
	exports.copyDone = {
		name: "copyDone",
		length: 4
	};
	var DatabaseError = class extends Error {
		constructor(message, length, name) {
			super(message);
			this.length = length;
			this.name = name;
		}
	};
	exports.DatabaseError = DatabaseError;
	var CopyDataMessage = class {
		constructor(length, chunk) {
			this.length = length;
			this.chunk = chunk;
			this.name = "copyData";
		}
	};
	exports.CopyDataMessage = CopyDataMessage;
	var CopyResponse = class {
		constructor(length, name, binary, columnCount) {
			this.length = length;
			this.name = name;
			this.binary = binary;
			this.columnTypes = new Array(columnCount);
		}
	};
	exports.CopyResponse = CopyResponse;
	var Field = class {
		constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format) {
			this.name = name;
			this.tableID = tableID;
			this.columnID = columnID;
			this.dataTypeID = dataTypeID;
			this.dataTypeSize = dataTypeSize;
			this.dataTypeModifier = dataTypeModifier;
			this.format = format;
		}
	};
	exports.Field = Field;
	var RowDescriptionMessage = class {
		constructor(length, fieldCount) {
			this.length = length;
			this.fieldCount = fieldCount;
			this.name = "rowDescription";
			this.fields = new Array(this.fieldCount);
		}
	};
	exports.RowDescriptionMessage = RowDescriptionMessage;
	var ParameterDescriptionMessage = class {
		constructor(length, parameterCount) {
			this.length = length;
			this.parameterCount = parameterCount;
			this.name = "parameterDescription";
			this.dataTypeIDs = new Array(this.parameterCount);
		}
	};
	exports.ParameterDescriptionMessage = ParameterDescriptionMessage;
	var ParameterStatusMessage = class {
		constructor(length, parameterName, parameterValue) {
			this.length = length;
			this.parameterName = parameterName;
			this.parameterValue = parameterValue;
			this.name = "parameterStatus";
		}
	};
	exports.ParameterStatusMessage = ParameterStatusMessage;
	var AuthenticationMD5Password = class {
		constructor(length, salt) {
			this.length = length;
			this.salt = salt;
			this.name = "authenticationMD5Password";
		}
	};
	exports.AuthenticationMD5Password = AuthenticationMD5Password;
	var BackendKeyDataMessage = class {
		constructor(length, processID, secretKey) {
			this.length = length;
			this.processID = processID;
			this.secretKey = secretKey;
			this.name = "backendKeyData";
		}
	};
	exports.BackendKeyDataMessage = BackendKeyDataMessage;
	var NotificationResponseMessage = class {
		constructor(length, processId, channel, payload) {
			this.length = length;
			this.processId = processId;
			this.channel = channel;
			this.payload = payload;
			this.name = "notification";
		}
	};
	exports.NotificationResponseMessage = NotificationResponseMessage;
	var ReadyForQueryMessage = class {
		constructor(length, status) {
			this.length = length;
			this.status = status;
			this.name = "readyForQuery";
		}
	};
	exports.ReadyForQueryMessage = ReadyForQueryMessage;
	var CommandCompleteMessage = class {
		constructor(length, text) {
			this.length = length;
			this.text = text;
			this.name = "commandComplete";
		}
	};
	exports.CommandCompleteMessage = CommandCompleteMessage;
	var DataRowMessage = class {
		constructor(length, fields) {
			this.length = length;
			this.fields = fields;
			this.name = "dataRow";
			this.fieldCount = fields.length;
		}
	};
	exports.DataRowMessage = DataRowMessage;
	var NoticeMessage = class {
		constructor(length, message) {
			this.length = length;
			this.message = message;
			this.name = "notice";
		}
	};
	exports.NoticeMessage = NoticeMessage;
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/buffer-writer.js
var require_buffer_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Writer = void 0;
	var Writer = class {
		constructor(size = 256) {
			this.size = size;
			this.offset = 5;
			this.headerPosition = 0;
			this.buffer = Buffer.allocUnsafe(size);
		}
		ensure(size) {
			if (this.buffer.length - this.offset < size) {
				const oldBuffer = this.buffer;
				const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
				this.buffer = Buffer.allocUnsafe(newSize);
				oldBuffer.copy(this.buffer, 0, 0, this.offset);
			}
		}
		addInt32(num) {
			this.ensure(4);
			this.buffer[this.offset++] = num >>> 24 & 255;
			this.buffer[this.offset++] = num >>> 16 & 255;
			this.buffer[this.offset++] = num >>> 8 & 255;
			this.buffer[this.offset++] = num >>> 0 & 255;
			return this;
		}
		addInt16(num) {
			this.ensure(2);
			this.buffer[this.offset++] = num >>> 8 & 255;
			this.buffer[this.offset++] = num >>> 0 & 255;
			return this;
		}
		addCString(string) {
			if (!string) this.ensure(1);
			else {
				const len = Buffer.byteLength(string);
				this.ensure(len + 1);
				this.buffer.write(string, this.offset, "utf-8");
				this.offset += len;
			}
			this.buffer[this.offset++] = 0;
			return this;
		}
		addString(string = "") {
			const len = Buffer.byteLength(string);
			this.ensure(len);
			this.buffer.write(string, this.offset);
			this.offset += len;
			return this;
		}
		addInt32PrefixedString(string) {
			const len = Buffer.byteLength(string);
			this.ensure(4 + len);
			const buffer = this.buffer;
			let offset = this.offset;
			buffer[offset++] = len >>> 24 & 255;
			buffer[offset++] = len >>> 16 & 255;
			buffer[offset++] = len >>> 8 & 255;
			buffer[offset++] = len >>> 0 & 255;
			buffer.write(string, offset, "utf-8");
			this.offset = offset + len;
			return this;
		}
		add(otherBuffer) {
			this.ensure(otherBuffer.length);
			otherBuffer.copy(this.buffer, this.offset);
			this.offset += otherBuffer.length;
			return this;
		}
		/**
		* Appends an uninitialized block of {@link size} bytes to the buffer and returns its offset.
		*/
		reserveUnsafe(size) {
			const offset = this.offset;
			this.ensure(size);
			this.offset += size;
			return offset;
		}
		join(code) {
			if (code) {
				this.buffer[this.headerPosition] = code;
				const length = this.offset - (this.headerPosition + 1);
				this.buffer.writeInt32BE(length, this.headerPosition + 1);
			}
			return this.buffer.slice(code ? 0 : 5, this.offset);
		}
		flush(code) {
			const result = this.join(code);
			this.offset = 5;
			this.headerPosition = 0;
			this.buffer = Buffer.allocUnsafe(this.size);
			return result;
		}
		clear() {
			this.offset = 5;
			this.headerPosition = 0;
		}
	};
	exports.Writer = Writer;
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/serializer.js
var require_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serialize = void 0;
	const buffer_writer_1 = require_buffer_writer();
	const writer = new buffer_writer_1.Writer();
	const startup = (opts) => {
		writer.addInt16(3).addInt16(0);
		for (const key of Object.keys(opts)) writer.addCString(key).addCString(opts[key]);
		writer.addCString("client_encoding").addCString("UTF8");
		const bodyBuffer = writer.addCString("").flush();
		const length = bodyBuffer.length + 4;
		return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
	};
	const requestSsl = () => {
		const response = Buffer.allocUnsafe(8);
		response.writeInt32BE(8, 0);
		response.writeInt32BE(80877103, 4);
		return response;
	};
	const password = (password) => {
		return writer.addCString(password).flush(112);
	};
	const sendSASLInitialResponseMessage = function(mechanism, initialResponse) {
		writer.addCString(mechanism).addInt32PrefixedString(initialResponse);
		return writer.flush(112);
	};
	const sendSCRAMClientFinalMessage = function(additionalData) {
		return writer.addString(additionalData).flush(112);
	};
	const query = (text) => {
		return writer.addCString(text).flush(81);
	};
	const emptyArray = [];
	const parse = (query) => {
		const name = query.name || "";
		if (name.length > 63) {
			console.error("Warning! Postgres only supports 63 characters for query names.");
			console.error("You supplied %s (%s)", name, name.length);
			console.error("This can cause conflicts and silent errors executing queries");
		}
		const types = query.types || emptyArray;
		const len = types.length;
		const buffer = writer.addCString(name).addCString(query.text).addInt16(len);
		for (let i = 0; i < len; i++) buffer.addInt32(types[i]);
		return writer.flush(80);
	};
	const writeValues = function(values, valueMapper, formatsOffset) {
		const len = values.length;
		for (let i = 0; i < len; i++) {
			const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
			let formatByte = 0;
			if (mappedVal == null) writer.addInt32(-1);
			else if (mappedVal instanceof Buffer) {
				formatByte = 1;
				writer.addInt32(mappedVal.length);
				writer.add(mappedVal);
			} else writer.addInt32PrefixedString(mappedVal);
			const buf = writer.buffer;
			buf[formatsOffset++] = 0;
			buf[formatsOffset++] = formatByte;
		}
	};
	const bind = (config = {}) => {
		const portal = config.portal || "";
		const statement = config.statement || "";
		const binary = config.binary || false;
		const values = config.values || emptyArray;
		const len = values.length;
		writer.addCString(portal).addCString(statement);
		writer.addInt16(len);
		const formatsOffset = writer.reserveUnsafe(len * 2);
		writer.addInt16(len);
		try {
			writeValues(values, config.valueMapper, formatsOffset);
		} catch (err) {
			writer.clear();
			throw err;
		}
		writer.addInt16(1);
		writer.addInt16(binary ? 1 : 0);
		return writer.flush(66);
	};
	const emptyExecute = Buffer.from([
		69,
		0,
		0,
		0,
		9,
		0,
		0,
		0,
		0,
		0
	]);
	const execute = (config) => {
		if (!config || !config.portal && !config.rows) return emptyExecute;
		const portal = config.portal || "";
		const rows = config.rows || 0;
		const portalLength = Buffer.byteLength(portal);
		const len = 4 + portalLength + 1 + 4;
		const buff = Buffer.allocUnsafe(1 + len);
		buff[0] = 69;
		buff.writeInt32BE(len, 1);
		buff.write(portal, 5, "utf-8");
		buff[portalLength + 5] = 0;
		buff.writeUInt32BE(rows, buff.length - 4);
		return buff;
	};
	const cancel = (processID, secretKey) => {
		const buffer = Buffer.allocUnsafe(16);
		buffer.writeInt32BE(16, 0);
		buffer.writeInt16BE(1234, 4);
		buffer.writeInt16BE(5678, 6);
		buffer.writeInt32BE(processID, 8);
		buffer.writeInt32BE(secretKey, 12);
		return buffer;
	};
	const cstringMessage = (code, string) => {
		const len = 4 + Buffer.byteLength(string) + 1;
		const buffer = Buffer.allocUnsafe(1 + len);
		buffer[0] = code;
		buffer.writeInt32BE(len, 1);
		buffer.write(string, 5, "utf-8");
		buffer[len] = 0;
		return buffer;
	};
	const emptyDescribePortal = writer.addCString("P").flush(68);
	const emptyDescribeStatement = writer.addCString("S").flush(68);
	const describe = (msg) => {
		return msg.name ? cstringMessage(68, `${msg.type}${msg.name || ""}`) : msg.type === "P" ? emptyDescribePortal : emptyDescribeStatement;
	};
	const close = (msg) => {
		const text = `${msg.type}${msg.name || ""}`;
		return cstringMessage(67, text);
	};
	const copyData = (chunk) => {
		return writer.add(chunk).flush(100);
	};
	const copyFail = (message) => {
		return cstringMessage(102, message);
	};
	const codeOnlyBuffer = (code) => Buffer.from([
		code,
		0,
		0,
		0,
		4
	]);
	const flushBuffer = codeOnlyBuffer(72);
	const syncBuffer = codeOnlyBuffer(83);
	const endBuffer = codeOnlyBuffer(88);
	const copyDoneBuffer = codeOnlyBuffer(99);
	exports.serialize = {
		startup,
		password,
		requestSsl,
		sendSASLInitialResponseMessage,
		sendSCRAMClientFinalMessage,
		query,
		parse,
		bind,
		execute,
		describe,
		close,
		flush: () => flushBuffer,
		sync: () => syncBuffer,
		end: () => endBuffer,
		copyData,
		copyDone: () => copyDoneBuffer,
		copyFail,
		cancel
	};
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/buffer-reader.js
var require_buffer_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BufferReader = void 0;
	var BufferReader = class {
		constructor(offset = 0) {
			this.offset = offset;
			this.buffer = Buffer.allocUnsafe(0);
			this.encoding = "utf-8";
		}
		setBuffer(offset, buffer) {
			this.offset = offset;
			this.buffer = buffer;
		}
		int16() {
			const result = this.buffer.readInt16BE(this.offset);
			this.offset += 2;
			return result;
		}
		byte() {
			const result = this.buffer[this.offset];
			this.offset++;
			return result;
		}
		int32() {
			const result = this.buffer.readInt32BE(this.offset);
			this.offset += 4;
			return result;
		}
		uint32() {
			const result = this.buffer.readUInt32BE(this.offset);
			this.offset += 4;
			return result;
		}
		string(length) {
			const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
			this.offset += length;
			return result;
		}
		cstring() {
			const start = this.offset;
			let end = start;
			while (this.buffer[end++]);
			this.offset = end;
			return this.buffer.toString(this.encoding, start, end - 1);
		}
		bytes(length) {
			const result = this.buffer.slice(this.offset, this.offset + length);
			this.offset += length;
			return result;
		}
	};
	exports.BufferReader = BufferReader;
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Parser = void 0;
	const messages_1 = require_messages();
	const buffer_reader_1 = require_buffer_reader();
	const CODE_LENGTH = 1;
	const HEADER_LENGTH = 5;
	const LATEINIT_LENGTH = -1;
	const emptyBuffer = Buffer.allocUnsafe(0);
	var Parser = class {
		constructor(opts) {
			this.buffer = emptyBuffer;
			this.bufferLength = 0;
			this.bufferOffset = 0;
			this.reader = new buffer_reader_1.BufferReader();
			if ((opts === null || opts === void 0 ? void 0 : opts.mode) === "binary") throw new Error("Binary mode not supported yet");
			this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || "text";
		}
		parse(buffer, callback) {
			this.mergeBuffer(buffer);
			const bufferFullLength = this.bufferOffset + this.bufferLength;
			let offset = this.bufferOffset;
			while (offset + HEADER_LENGTH <= bufferFullLength) {
				const code = this.buffer[offset];
				const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
				const fullMessageLength = CODE_LENGTH + length;
				if (fullMessageLength + offset <= bufferFullLength) {
					callback(this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer));
					offset += fullMessageLength;
				} else break;
			}
			if (offset === bufferFullLength) {
				this.buffer = emptyBuffer;
				this.bufferLength = 0;
				this.bufferOffset = 0;
			} else {
				this.bufferLength = bufferFullLength - offset;
				this.bufferOffset = offset;
			}
		}
		mergeBuffer(buffer) {
			if (this.bufferLength > 0) {
				const newLength = this.bufferLength + buffer.byteLength;
				if (newLength + this.bufferOffset > this.buffer.byteLength) {
					let newBuffer;
					if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) newBuffer = this.buffer;
					else {
						let newBufferLength = this.buffer.byteLength * 2;
						while (newLength >= newBufferLength) newBufferLength *= 2;
						newBuffer = Buffer.allocUnsafe(newBufferLength);
					}
					this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
					this.buffer = newBuffer;
					this.bufferOffset = 0;
				}
				buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
				this.bufferLength = newLength;
			} else {
				this.buffer = buffer;
				this.bufferOffset = 0;
				this.bufferLength = buffer.byteLength;
			}
		}
		handlePacket(offset, code, length, bytes) {
			const { reader } = this;
			reader.setBuffer(offset, bytes);
			let message;
			switch (code) {
				case 50:
					message = messages_1.bindComplete;
					break;
				case 49:
					message = messages_1.parseComplete;
					break;
				case 51:
					message = messages_1.closeComplete;
					break;
				case 110:
					message = messages_1.noData;
					break;
				case 115:
					message = messages_1.portalSuspended;
					break;
				case 99:
					message = messages_1.copyDone;
					break;
				case 87:
					message = messages_1.replicationStart;
					break;
				case 73:
					message = messages_1.emptyQuery;
					break;
				case 68:
					message = parseDataRowMessage(reader);
					break;
				case 67:
					message = parseCommandCompleteMessage(reader);
					break;
				case 90:
					message = parseReadyForQueryMessage(reader);
					break;
				case 65:
					message = parseNotificationMessage(reader);
					break;
				case 82:
					message = parseAuthenticationResponse(reader, length);
					break;
				case 83:
					message = parseParameterStatusMessage(reader);
					break;
				case 75:
					message = parseBackendKeyData(reader);
					break;
				case 69:
					message = parseErrorMessage(reader, "error");
					break;
				case 78:
					message = parseErrorMessage(reader, "notice");
					break;
				case 84:
					message = parseRowDescriptionMessage(reader);
					break;
				case 116:
					message = parseParameterDescriptionMessage(reader);
					break;
				case 71:
					message = parseCopyInMessage(reader);
					break;
				case 72:
					message = parseCopyOutMessage(reader);
					break;
				case 100:
					message = parseCopyData(reader, length);
					break;
				default: return new messages_1.DatabaseError("received invalid response: " + code.toString(16), length, "error");
			}
			reader.setBuffer(0, emptyBuffer);
			message.length = length;
			return message;
		}
	};
	exports.Parser = Parser;
	const parseReadyForQueryMessage = (reader) => {
		const status = reader.string(1);
		return new messages_1.ReadyForQueryMessage(LATEINIT_LENGTH, status);
	};
	const parseCommandCompleteMessage = (reader) => {
		const text = reader.cstring();
		return new messages_1.CommandCompleteMessage(LATEINIT_LENGTH, text);
	};
	const parseCopyData = (reader, length) => {
		const chunk = reader.bytes(length - 4);
		return new messages_1.CopyDataMessage(LATEINIT_LENGTH, chunk);
	};
	const parseCopyInMessage = (reader) => parseCopyMessage(reader, "copyInResponse");
	const parseCopyOutMessage = (reader) => parseCopyMessage(reader, "copyOutResponse");
	const parseCopyMessage = (reader, messageName) => {
		const isBinary = reader.byte() !== 0;
		const columnCount = reader.int16();
		const message = new messages_1.CopyResponse(LATEINIT_LENGTH, messageName, isBinary, columnCount);
		for (let i = 0; i < columnCount; i++) message.columnTypes[i] = reader.int16();
		return message;
	};
	const parseNotificationMessage = (reader) => {
		const processId = reader.int32();
		const channel = reader.cstring();
		const payload = reader.cstring();
		return new messages_1.NotificationResponseMessage(LATEINIT_LENGTH, processId, channel, payload);
	};
	const parseRowDescriptionMessage = (reader) => {
		const fieldCount = reader.int16();
		const message = new messages_1.RowDescriptionMessage(LATEINIT_LENGTH, fieldCount);
		for (let i = 0; i < fieldCount; i++) message.fields[i] = parseField(reader);
		return message;
	};
	const parseField = (reader) => {
		const name = reader.cstring();
		const tableID = reader.uint32();
		const columnID = reader.int16();
		const dataTypeID = reader.uint32();
		const dataTypeSize = reader.int16();
		const dataTypeModifier = reader.int32();
		const mode = reader.int16() === 0 ? "text" : "binary";
		return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
	};
	const parseParameterDescriptionMessage = (reader) => {
		const parameterCount = reader.int16();
		const message = new messages_1.ParameterDescriptionMessage(LATEINIT_LENGTH, parameterCount);
		for (let i = 0; i < parameterCount; i++) message.dataTypeIDs[i] = reader.uint32();
		return message;
	};
	const parseDataRowMessage = (reader) => {
		const fieldCount = reader.int16();
		const fields = new Array(fieldCount);
		for (let i = 0; i < fieldCount; i++) {
			const len = reader.int32();
			fields[i] = len === -1 ? null : reader.string(len);
		}
		return new messages_1.DataRowMessage(LATEINIT_LENGTH, fields);
	};
	const parseParameterStatusMessage = (reader) => {
		const name = reader.cstring();
		const value = reader.cstring();
		return new messages_1.ParameterStatusMessage(LATEINIT_LENGTH, name, value);
	};
	const parseBackendKeyData = (reader) => {
		const processID = reader.int32();
		const secretKey = reader.int32();
		return new messages_1.BackendKeyDataMessage(LATEINIT_LENGTH, processID, secretKey);
	};
	const parseAuthenticationResponse = (reader, length) => {
		const code = reader.int32();
		const message = {
			name: "authenticationOk",
			length
		};
		switch (code) {
			case 0: break;
			case 3:
				if (message.length === 8) message.name = "authenticationCleartextPassword";
				break;
			case 5:
				if (message.length === 12) {
					message.name = "authenticationMD5Password";
					const salt = reader.bytes(4);
					return new messages_1.AuthenticationMD5Password(LATEINIT_LENGTH, salt);
				}
				break;
			case 10:
				{
					message.name = "authenticationSASL";
					message.mechanisms = [];
					let mechanism;
					do {
						mechanism = reader.cstring();
						if (mechanism) message.mechanisms.push(mechanism);
					} while (mechanism);
				}
				break;
			case 11:
				message.name = "authenticationSASLContinue";
				message.data = reader.string(length - 8);
				break;
			case 12:
				message.name = "authenticationSASLFinal";
				message.data = reader.string(length - 8);
				break;
			default: throw new Error("Unknown authenticationOk message type " + code);
		}
		return message;
	};
	const parseErrorMessage = (reader, name) => {
		const fields = {};
		let fieldType = reader.string(1);
		while (fieldType !== "\0") {
			fields[fieldType] = reader.cstring();
			fieldType = reader.string(1);
		}
		const messageValue = fields.M;
		const message = name === "notice" ? new messages_1.NoticeMessage(LATEINIT_LENGTH, messageValue) : new messages_1.DatabaseError(messageValue, LATEINIT_LENGTH, name);
		message.severity = fields.S;
		message.code = fields.C;
		message.detail = fields.D;
		message.hint = fields.H;
		message.position = fields.P;
		message.internalPosition = fields.p;
		message.internalQuery = fields.q;
		message.where = fields.W;
		message.schema = fields.s;
		message.table = fields.t;
		message.column = fields.c;
		message.dataType = fields.d;
		message.constraint = fields.n;
		message.file = fields.F;
		message.line = fields.L;
		message.routine = fields.R;
		return message;
	};
}));
// node_modules/.pnpm/pg-protocol@1.16.1/node_modules/pg-protocol/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DatabaseError = exports.serialize = void 0;
	exports.parse = parse;
	const messages_1 = require_messages();
	Object.defineProperty(exports, "DatabaseError", {
		enumerable: true,
		get: function() {
			return messages_1.DatabaseError;
		}
	});
	const serializer_1 = require_serializer();
	Object.defineProperty(exports, "serialize", {
		enumerable: true,
		get: function() {
			return serializer_1.serialize;
		}
	});
	const parser_1 = require_parser();
	function parse(stream, callback) {
		const parser = new parser_1.Parser();
		stream.on("data", (buffer) => parser.parse(buffer, callback));
		return new Promise((resolve) => stream.on("end", () => resolve()));
	}
}));
// node_modules/.pnpm/pg-cloudflare@1.4.1/node_modules/pg-cloudflare/dist/empty.js
var require_empty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {};
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { getStream, getSecureStream } = getStreamFuncs();
	module.exports = {
		/**
		* Get a socket stream compatible with the current runtime environment.
		* @returns {Duplex}
		*/
		getStream,
		/**
		* Get a TLS secured socket, compatible with the current environment,
		* using the socket and other settings given in `options`.
		* @returns {Duplex}
		*/
		getSecureStream
	};
	/**
	* The stream functions that work in Node.js
	*/
	function getNodejsStreamFuncs() {
		function getStream(ssl) {
			return new (__require("net")).Socket();
		}
		function getSecureStream(options) {
			return __require("tls").connect(options);
		}
		return {
			getStream,
			getSecureStream
		};
	}
	/**
	* The stream functions that work in Cloudflare Workers
	*/
	function getCloudflareStreamFuncs() {
		function getStream(ssl) {
			const { CloudflareSocket } = require_empty();
			return new CloudflareSocket(ssl);
		}
		function getSecureStream(options) {
			options.socket.startTls(options);
			return options.socket;
		}
		return {
			getStream,
			getSecureStream
		};
	}
	/**
	* Are we running in a Cloudflare Worker?
	*
	* @returns true if the code is currently running inside a Cloudflare Worker.
	*/
	function isCloudflareRuntime() {
		if (typeof navigator === "object" && navigator !== null && typeof navigator.userAgent === "string") return navigator.userAgent === "Cloudflare-Workers";
		if (typeof Response === "function") {
			const resp = new Response(null, { cf: { thing: true } });
			if (typeof resp.cf === "object" && resp.cf !== null && resp.cf.thing) return true;
		}
		return false;
	}
	function getStreamFuncs() {
		if (isCloudflareRuntime()) return getCloudflareStreamFuncs();
		return getNodejsStreamFuncs();
	}
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/connection.js
var require_connection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events").EventEmitter;
	const { parse, serialize } = require_dist();
	const stream = require_stream();
	const { getStream } = stream;
	const flushBuffer = serialize.flush();
	const syncBuffer = serialize.sync();
	const endBuffer = serialize.end();
	var Connection = class extends EventEmitter {
		constructor(config) {
			super();
			config = config || {};
			this.stream = config.stream || getStream(config.ssl);
			if (typeof this.stream === "function") this.stream = this.stream(config);
			this._keepAlive = config.keepAlive;
			this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis;
			this.parsedStatements = {};
			this.submittedNamedStatements = {};
			this.ssl = config.ssl || false;
			this.sslNegotiation = config.sslNegotiation || "postgres";
			this._ending = false;
			this._emitMessage = false;
			const self = this;
			this.on("newListener", function(eventName) {
				if (eventName === "message") self._emitMessage = true;
			});
		}
		connect(port, host) {
			const self = this;
			this._connecting = true;
			this.stream.setNoDelay(true);
			this.stream.connect(port, host);
			this.stream.once("connect", function() {
				if (self._keepAlive) self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis);
				self.emit("connect");
			});
			const reportStreamError = function(error) {
				if (self._ending && (error.code === "ECONNRESET" || error.code === "EPIPE")) return;
				self.emit("error", error);
			};
			this.stream.on("error", reportStreamError);
			this.stream.on("close", function() {
				self.emit("end");
			});
			if (!this.ssl) return this.attachListeners(this.stream);
			if (this.sslNegotiation === "direct") return this.stream.once("connect", function() {
				self.upgradeToSSL(host, reportStreamError);
			});
			this.stream.once("data", function(buffer) {
				switch (buffer.toString("utf8")) {
					case "S": break;
					case "N":
						self.stream.end();
						return self.emit("error", /* @__PURE__ */ new Error("The server does not support SSL connections"));
					default:
						self.stream.end();
						return self.emit("error", /* @__PURE__ */ new Error("There was an error establishing an SSL connection"));
				}
				self.upgradeToSSL(host, reportStreamError);
			});
		}
		upgradeToSSL(host, reportStreamError) {
			const self = this;
			const options = {
				socket: self.stream,
				host
			};
			if (self.ssl !== true) {
				Object.assign(options, self.ssl);
				if ("key" in self.ssl) options.key = self.ssl.key;
			}
			if (self.sslNegotiation === "direct") options.ALPNProtocols = ["postgresql"];
			const net = __require("net");
			if (net.isIP && net.isIP(host) === 0) options.servername = host;
			try {
				self.stream = stream.getSecureStream(options);
			} catch (err) {
				return self.emit("error", err);
			}
			self.attachListeners(self.stream);
			self.stream.on("error", reportStreamError);
			self.emit("sslconnect");
		}
		attachListeners(stream) {
			parse(stream, (msg) => {
				const eventName = msg.name === "error" ? "errorMessage" : msg.name;
				if (this._emitMessage) this.emit("message", msg);
				this.emit(eventName, msg);
			});
		}
		requestSsl() {
			this.stream.write(serialize.requestSsl());
		}
		startup(config) {
			this.stream.write(serialize.startup(config));
		}
		cancel(processID, secretKey) {
			this._send(serialize.cancel(processID, secretKey));
		}
		password(password) {
			this._send(serialize.password(password));
		}
		sendSASLInitialResponseMessage(mechanism, initialResponse) {
			this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse));
		}
		sendSCRAMClientFinalMessage(additionalData) {
			this._send(serialize.sendSCRAMClientFinalMessage(additionalData));
		}
		_send(buffer) {
			if (!this.stream.writable) return false;
			return this.stream.write(buffer);
		}
		query(text) {
			this._send(serialize.query(text));
		}
		parse(query) {
			this._send(serialize.parse(query));
		}
		bind(config) {
			this._send(serialize.bind(config));
		}
		execute(config) {
			this._send(serialize.execute(config));
		}
		flush() {
			if (this.stream.writable) this.stream.write(flushBuffer);
		}
		sync() {
			this._send(syncBuffer);
		}
		ref() {
			this.stream.ref();
		}
		unref() {
			this.stream.unref();
		}
		end() {
			this._ending = true;
			if (!this._connecting || !this.stream.writable) {
				this.stream.end();
				return;
			}
			return this.stream.write(endBuffer, () => {
				this.stream.end();
			});
		}
		close(msg) {
			this._send(serialize.close(msg));
		}
		describe(msg) {
			this._send(serialize.describe(msg));
		}
		sendCopyFromChunk(chunk) {
			this._send(serialize.copyData(chunk));
		}
		endCopyFrom() {
			this._send(serialize.copyDone());
		}
		sendCopyFail(msg) {
			this._send(serialize.copyFail(msg));
		}
	};
	module.exports = Connection;
}));
// node_modules/.pnpm/split2@4.2.0/node_modules/split2/index.js
var require_split2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { Transform } = __require("stream");
	const { StringDecoder } = __require("string_decoder");
	const kLast = Symbol("last");
	const kDecoder = Symbol("decoder");
	function transform(chunk, enc, cb) {
		let list;
		if (this.overflow) {
			list = this[kDecoder].write(chunk).split(this.matcher);
			if (list.length === 1) return cb();
			list.shift();
			this.overflow = false;
		} else {
			this[kLast] += this[kDecoder].write(chunk);
			list = this[kLast].split(this.matcher);
		}
		this[kLast] = list.pop();
		for (let i = 0; i < list.length; i++) try {
			push(this, this.mapper(list[i]));
		} catch (error) {
			return cb(error);
		}
		this.overflow = this[kLast].length > this.maxLength;
		if (this.overflow && !this.skipOverflow) {
			cb(/* @__PURE__ */ new Error("maximum buffer reached"));
			return;
		}
		cb();
	}
	function flush(cb) {
		this[kLast] += this[kDecoder].end();
		if (this[kLast]) try {
			push(this, this.mapper(this[kLast]));
		} catch (error) {
			return cb(error);
		}
		cb();
	}
	function push(self, val) {
		if (val !== void 0) self.push(val);
	}
	function noop(incoming) {
		return incoming;
	}
	function split(matcher, mapper, options) {
		matcher = matcher || /\r?\n/;
		mapper = mapper || noop;
		options = options || {};
		switch (arguments.length) {
			case 1:
				if (typeof matcher === "function") {
					mapper = matcher;
					matcher = /\r?\n/;
				} else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
					options = matcher;
					matcher = /\r?\n/;
				}
				break;
			case 2: if (typeof matcher === "function") {
				options = mapper;
				mapper = matcher;
				matcher = /\r?\n/;
			} else if (typeof mapper === "object") {
				options = mapper;
				mapper = noop;
			}
		}
		options = Object.assign({}, options);
		options.autoDestroy = true;
		options.transform = transform;
		options.flush = flush;
		options.readableObjectMode = true;
		const stream = new Transform(options);
		stream[kLast] = "";
		stream[kDecoder] = new StringDecoder("utf8");
		stream.matcher = matcher;
		stream.mapper = mapper;
		stream.maxLength = options.maxLength;
		stream.skipOverflow = options.skipOverflow || false;
		stream.overflow = false;
		stream._destroy = function(err, cb) {
			this._writableState.errorEmitted = false;
			cb(err);
		};
		return stream;
	}
	module.exports = split;
}));
// node_modules/.pnpm/pgpass@1.0.5/node_modules/pgpass/lib/helper.js
var require_helper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path = __require("path");
	var Stream = __require("stream").Stream;
	var split = require_split2();
	var util = __require("util");
	var defaultPort = 5432;
	var isWin = process.platform === "win32";
	var warnStream = process.stderr;
	var S_IRWXG = 56;
	var S_IRWXO = 7;
	var S_IFMT = 61440;
	var S_IFREG = 32768;
	function isRegFile(mode) {
		return (mode & S_IFMT) == S_IFREG;
	}
	var fieldNames = [
		"host",
		"port",
		"database",
		"user",
		"password"
	];
	var nrOfFields = fieldNames.length;
	var passKey = fieldNames[nrOfFields - 1];
	function warn() {
		if (warnStream instanceof Stream && true === warnStream.writable) {
			var args = Array.prototype.slice.call(arguments).concat("\n");
			warnStream.write(util.format.apply(util, args));
		}
	}
	Object.defineProperty(module.exports, "isWin", {
		get: function() {
			return isWin;
		},
		set: function(val) {
			isWin = val;
		}
	});
	module.exports.warnTo = function(stream) {
		var old = warnStream;
		warnStream = stream;
		return old;
	};
	module.exports.getFileName = function(rawEnv) {
		var env = rawEnv || process.env;
		return env.PGPASSFILE || (isWin ? path.join(env.APPDATA || "./", "postgresql", "pgpass.conf") : path.join(env.HOME || "./", ".pgpass"));
	};
	module.exports.usePgPass = function(stats, fname) {
		if (Object.prototype.hasOwnProperty.call(process.env, "PGPASSWORD")) return false;
		if (isWin) return true;
		fname = fname || "<unkn>";
		if (!isRegFile(stats.mode)) {
			warn("WARNING: password file \"%s\" is not a plain file", fname);
			return false;
		}
		if (stats.mode & (S_IRWXG | S_IRWXO)) {
			warn("WARNING: password file \"%s\" has group or world access; permissions should be u=rw (0600) or less", fname);
			return false;
		}
		return true;
	};
	var matcher = module.exports.match = function(connInfo, entry) {
		return fieldNames.slice(0, -1).reduce(function(prev, field, idx) {
			if (idx == 1) {
				if (Number(connInfo[field] || defaultPort) === Number(entry[field])) return prev && true;
			}
			return prev && (entry[field] === "*" || entry[field] === connInfo[field]);
		}, true);
	};
	module.exports.getPassword = function(connInfo, stream, cb) {
		var pass;
		var lineStream = stream.pipe(split());
		function onLine(line) {
			var entry = parseLine(line);
			if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
				pass = entry[passKey];
				lineStream.end();
			}
		}
		var onEnd = function() {
			stream.destroy();
			cb(pass);
		};
		var onErr = function(err) {
			stream.destroy();
			warn("WARNING: error on reading file: %s", err);
			cb(void 0);
		};
		stream.on("error", onErr);
		lineStream.on("data", onLine).on("end", onEnd).on("error", onErr);
	};
	var parseLine = module.exports.parseLine = function(line) {
		if (line.length < 11 || line.match(/^\s+#/)) return null;
		var curChar = "";
		var prevChar = "";
		var fieldIdx = 0;
		var startIdx = 0;
		var obj = {};
		var isLastField = false;
		var addToObj = function(idx, i0, i1) {
			var field = line.substring(i0, i1);
			if (!Object.hasOwnProperty.call(process.env, "PGPASS_NO_DEESCAPE")) field = field.replace(/\\([:\\])/g, "$1");
			obj[fieldNames[idx]] = field;
		};
		for (var i = 0; i < line.length - 1; i += 1) {
			curChar = line.charAt(i + 1);
			prevChar = line.charAt(i);
			isLastField = fieldIdx == nrOfFields - 1;
			if (isLastField) {
				addToObj(fieldIdx, startIdx);
				break;
			}
			if (i >= 0 && curChar == ":" && prevChar !== "\\") {
				addToObj(fieldIdx, startIdx, i + 1);
				startIdx = i + 2;
				fieldIdx += 1;
			}
		}
		obj = Object.keys(obj).length === nrOfFields ? obj : null;
		return obj;
	};
	var isValidEntry = module.exports.isValidEntry = function(entry) {
		var rules = {
			0: function(x) {
				return x.length > 0;
			},
			1: function(x) {
				if (x === "*") return true;
				x = Number(x);
				return isFinite(x) && x > 0 && x < 9007199254740992 && Math.floor(x) === x;
			},
			2: function(x) {
				return x.length > 0;
			},
			3: function(x) {
				return x.length > 0;
			},
			4: function(x) {
				return x.length > 0;
			}
		};
		for (var idx = 0; idx < fieldNames.length; idx += 1) {
			var rule = rules[idx];
			if (!rule(entry[fieldNames[idx]] || "")) return false;
		}
		return true;
	};
}));
// node_modules/.pnpm/pgpass@1.0.5/node_modules/pgpass/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("path");
	var fs = __require("fs");
	var helper = require_helper();
	module.exports = function(connInfo, cb) {
		var file = helper.getFileName();
		fs.stat(file, function(err, stat) {
			if (err || !helper.usePgPass(stat, file)) return cb(void 0);
			var st = fs.createReadStream(file);
			helper.getPassword(connInfo, st, cb);
		});
	};
	module.exports.warnTo = helper.warnTo;
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/client.js
var require_client$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events").EventEmitter;
	const utils = require_utils$1();
	const nodeUtils = __require("util");
	const sasl = require_sasl();
	const TypeOverrides = require_type_overrides();
	const ConnectionParameters = require_connection_parameters();
	const Query = require_query$1();
	const defaults = require_defaults();
	const Connection = require_connection();
	const crypto = require_utils();
	const activeQueryDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.activeQuery is deprecated and will be removed in pg@9.0");
	const queryQueueDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.queryQueue is deprecated and will be removed in pg@9.0.");
	const pgPassDeprecationNotice = nodeUtils.deprecate(() => {}, "pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code.");
	const byoPromiseDeprecationNotice = nodeUtils.deprecate(() => {}, "Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0.");
	const queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
	function coerceNumberOrDefault(value, defaultValue) {
		if (typeof value === "number") return Number.isFinite(value) ? value : defaultValue;
		if (typeof value === "string" && value.trim() !== "") {
			const n = Number(value);
			return Number.isFinite(n) ? n : defaultValue;
		}
		return defaultValue;
	}
	var Client = class extends EventEmitter {
		constructor(config) {
			super();
			this.connectionParameters = new ConnectionParameters(config);
			this.user = this.connectionParameters.user;
			this.database = this.connectionParameters.database;
			this.port = this.connectionParameters.port;
			this.host = this.connectionParameters.host;
			Object.defineProperty(this, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: this.connectionParameters.password
			});
			this.replication = this.connectionParameters.replication;
			const c = config || {};
			if (c.Promise) byoPromiseDeprecationNotice();
			this._Promise = c.Promise || global.Promise;
			this._types = new TypeOverrides(c.types);
			this._ending = false;
			this._ended = false;
			this._connecting = false;
			this._connected = false;
			this._connectionError = false;
			this._queryable = true;
			this._activeQuery = null;
			this._txStatus = null;
			this.enableChannelBinding = Boolean(c.enableChannelBinding);
			this.scramMaxIterations = coerceNumberOrDefault(c.scramMaxIterations, sasl.DEFAULT_MAX_SCRAM_ITERATIONS);
			this.connection = c.connection || new Connection({
				stream: c.stream,
				ssl: this.connectionParameters.ssl,
				sslNegotiation: this.connectionParameters.sslnegotiation,
				keepAlive: c.keepAlive || false,
				keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
				encoding: this.connectionParameters.client_encoding || "utf8"
			});
			this._queryQueue = [];
			this._sentQueryQueue = [];
			this.pipeline = Boolean(c.pipeline);
			this.binary = c.binary || defaults.binary;
			this.processID = null;
			this.secretKey = null;
			this.ssl = this.connectionParameters.ssl || false;
			this.sslNegotiation = this.connectionParameters.sslnegotiation || "postgres";
			if (this.ssl && this.ssl.key) Object.defineProperty(this.ssl, "key", { enumerable: false });
			this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0;
		}
		get activeQuery() {
			activeQueryDeprecationNotice();
			return this._activeQuery;
		}
		set activeQuery(val) {
			activeQueryDeprecationNotice();
			this._activeQuery = val;
		}
		_getActiveQuery() {
			return this._activeQuery;
		}
		_errorAllQueries(err) {
			const enqueueError = (query) => {
				process.nextTick(() => {
					query.handleError(err, this.connection);
				});
			};
			const activeQuery = this._getActiveQuery();
			if (activeQuery) {
				enqueueError(activeQuery);
				this._activeQuery = null;
			}
			this._sentQueryQueue.forEach(enqueueError);
			this._sentQueryQueue.length = 0;
			this._queryQueue.forEach(enqueueError);
			this._queryQueue.length = 0;
		}
		_connect(callback) {
			const self = this;
			const con = this.connection;
			this._connectionCallback = callback;
			if (this._connecting || this._connected) {
				const err = /* @__PURE__ */ new Error("Client has already been connected. You cannot reuse a client.");
				process.nextTick(() => {
					callback(err);
				});
				return;
			}
			this._connecting = true;
			if (this._connectionTimeoutMillis > 0) {
				this.connectionTimeoutHandle = setTimeout(() => {
					con._ending = true;
					con.stream.destroy(/* @__PURE__ */ new Error("timeout expired"));
				}, this._connectionTimeoutMillis);
				if (this.connectionTimeoutHandle.unref) this.connectionTimeoutHandle.unref();
			}
			if (this.host && this.host.indexOf("/") === 0) con.connect(this.host + "/.s.PGSQL." + this.port);
			else con.connect(this.port, this.host);
			con.on("connect", function() {
				if (self.ssl) {
					if (self.sslNegotiation !== "direct") con.requestSsl();
				} else con.startup(self.getStartupConf());
			});
			con.on("sslconnect", function() {
				con.startup(self.getStartupConf());
			});
			this._attachListeners(con);
			con.once("end", () => {
				const error = this._ending ? /* @__PURE__ */ new Error("Connection terminated") : /* @__PURE__ */ new Error("Connection terminated unexpectedly");
				clearTimeout(this.connectionTimeoutHandle);
				this._errorAllQueries(error);
				this._ended = true;
				if (!this._ending) {
					if (this._connecting && !this._connectionError) {
						if (this._connectionCallback) this._connectionCallback(error);
						else this._handleErrorEvent(error);
					} else if (!this._connectionError) this._handleErrorEvent(error);
				}
				process.nextTick(() => {
					this.emit("end");
				});
			});
		}
		connect(callback) {
			if (callback) {
				this._connect(callback);
				return;
			}
			return new this._Promise((resolve, reject) => {
				this._connect((error) => {
					if (error) reject(error);
					else resolve(this);
				});
			});
		}
		_attachListeners(con) {
			con.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this));
			con.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this));
			con.on("authenticationSASL", this._handleAuthSASL.bind(this));
			con.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this));
			con.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this));
			con.on("backendKeyData", this._handleBackendKeyData.bind(this));
			con.on("error", this._handleErrorEvent.bind(this));
			con.on("errorMessage", this._handleErrorMessage.bind(this));
			con.on("readyForQuery", this._handleReadyForQuery.bind(this));
			con.on("notice", this._handleNotice.bind(this));
			con.on("rowDescription", this._handleRowDescription.bind(this));
			con.on("dataRow", this._handleDataRow.bind(this));
			con.on("portalSuspended", this._handlePortalSuspended.bind(this));
			con.on("emptyQuery", this._handleEmptyQuery.bind(this));
			con.on("commandComplete", this._handleCommandComplete.bind(this));
			con.on("parseComplete", this._handleParseComplete.bind(this));
			con.on("copyInResponse", this._handleCopyInResponse.bind(this));
			con.on("copyData", this._handleCopyData.bind(this));
			con.on("notification", this._handleNotification.bind(this));
		}
		_getPassword(cb) {
			const con = this.connection;
			if (typeof this.password === "function") this._Promise.resolve().then(() => this.password(this.connectionParameters)).then((pass) => {
				if (pass !== void 0) {
					if (typeof pass !== "string") {
						con.emit("error", /* @__PURE__ */ new TypeError("Password must be a string"));
						return;
					}
					this.connectionParameters.password = this.password = pass;
				} else this.connectionParameters.password = this.password = null;
				cb();
			}).catch((err) => {
				con.emit("error", err);
			});
			else if (this.password !== null) cb();
			else try {
				require_lib$1()(this.connectionParameters, (pass) => {
					if (void 0 !== pass) {
						pgPassDeprecationNotice();
						this.connectionParameters.password = this.password = pass;
					}
					cb();
				});
			} catch (e) {
				this.emit("error", e);
			}
		}
		_handleAuthCleartextPassword(msg) {
			this._getPassword(() => {
				this.connection.password(this.password);
			});
		}
		_handleAuthMD5Password(msg) {
			this._getPassword(async () => {
				try {
					const hashedPassword = await crypto.postgresMd5PasswordHash(this.user, this.password, msg.salt);
					this.connection.password(hashedPassword);
				} catch (e) {
					this.emit("error", e);
				}
			});
		}
		_handleAuthSASL(msg) {
			this._getPassword(() => {
				try {
					this.saslSession = sasl.startSession(msg.mechanisms, this.enableChannelBinding && this.connection.stream, this.scramMaxIterations);
					this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
				} catch (err) {
					this.connection.emit("error", err);
				}
			});
		}
		async _handleAuthSASLContinue(msg) {
			try {
				await sasl.continueSession(this.saslSession, this.password, msg.data, this.enableChannelBinding && this.connection.stream);
				this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
			} catch (err) {
				this.connection.emit("error", err);
			}
		}
		_handleAuthSASLFinal(msg) {
			try {
				sasl.finalizeSession(this.saslSession, msg.data);
				this.saslSession = null;
			} catch (err) {
				this.connection.emit("error", err);
			}
		}
		_handleBackendKeyData(msg) {
			this.processID = msg.processID;
			this.secretKey = msg.secretKey;
		}
		_handleReadyForQuery(msg) {
			if (this._connecting) {
				this._connecting = false;
				this._connected = true;
				clearTimeout(this.connectionTimeoutHandle);
				if (this._connectionCallback) {
					this._connectionCallback(null, this);
					this._connectionCallback = null;
				}
				this.emit("connect");
			}
			const activeQuery = this._getActiveQuery();
			this._activeQuery = null;
			this._txStatus = msg?.status ?? null;
			this.readyForQuery = true;
			if (activeQuery) activeQuery.handleReadyForQuery(this.connection);
			this._pulseQueryQueue();
		}
		_handleErrorWhileConnecting(err) {
			if (this._connectionError) return;
			this._connectionError = true;
			clearTimeout(this.connectionTimeoutHandle);
			if (this._connectionCallback) return this._connectionCallback(err);
			this.emit("error", err);
		}
		_handleErrorEvent(err) {
			if (this._connecting) return this._handleErrorWhileConnecting(err);
			this._queryable = false;
			this._errorAllQueries(err);
			this.emit("error", err);
		}
		_handleErrorMessage(msg) {
			if (this._connecting) return this._handleErrorWhileConnecting(msg);
			const activeQuery = this._getActiveQuery();
			if (!activeQuery) {
				this._handleErrorEvent(msg);
				return;
			}
			this._activeQuery = null;
			if (activeQuery.name) delete this.connection.submittedNamedStatements[activeQuery.name];
			activeQuery.handleError(msg, this.connection);
		}
		_handleRowDescription(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected rowDescription message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleRowDescription(msg);
		}
		_handleDataRow(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected dataRow message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleDataRow(msg);
		}
		_handlePortalSuspended(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected portalSuspended message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handlePortalSuspended(this.connection);
		}
		_handleEmptyQuery(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected emptyQuery message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleEmptyQuery(this.connection);
		}
		_handleCommandComplete(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected commandComplete message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCommandComplete(msg, this.connection);
		}
		_handleParseComplete() {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected parseComplete message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			if (activeQuery.name) {
				this.connection.parsedStatements[activeQuery.name] = activeQuery.text;
				delete this.connection.submittedNamedStatements[activeQuery.name];
			}
		}
		_handleCopyInResponse(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected copyInResponse message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCopyInResponse(this.connection);
		}
		_handleCopyData(msg) {
			const activeQuery = this._getActiveQuery();
			if (activeQuery == null) {
				const error = /* @__PURE__ */ new Error("Received unexpected copyData message from backend.");
				this._handleErrorEvent(error);
				return;
			}
			activeQuery.handleCopyData(msg, this.connection);
		}
		_handleNotification(msg) {
			this.emit("notification", msg);
		}
		_handleNotice(msg) {
			this.emit("notice", msg);
		}
		getStartupConf() {
			const params = this.connectionParameters;
			const data = {
				user: params.user,
				database: params.database
			};
			const appName = params.application_name || params.fallback_application_name;
			if (appName) data.application_name = appName;
			if (params.replication) data.replication = "" + params.replication;
			if (params.statement_timeout) data.statement_timeout = String(parseInt(params.statement_timeout, 10));
			if (params.lock_timeout) data.lock_timeout = String(parseInt(params.lock_timeout, 10));
			if (params.idle_in_transaction_session_timeout) data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10));
			if (params.options) data.options = params.options;
			return data;
		}
		cancel(client, query) {
			if (client.activeQuery === query) {
				const con = this.connection;
				if (this.host && this.host.indexOf("/") === 0) con.connect(this.host + "/.s.PGSQL." + this.port);
				else con.connect(this.port, this.host);
				con.on("connect", function() {
					con.cancel(client.processID, client.secretKey);
				});
			} else if (client._queryQueue.indexOf(query) !== -1) client._queryQueue.splice(client._queryQueue.indexOf(query), 1);
			else if (client._sentQueryQueue.indexOf(query) !== -1) query.callback = () => {};
		}
		setTypeParser(oid, format, parseFn) {
			return this._types.setTypeParser(oid, format, parseFn);
		}
		getTypeParser(oid, format) {
			return this._types.getTypeParser(oid, format);
		}
		escapeIdentifier(str) {
			return utils.escapeIdentifier(str);
		}
		escapeLiteral(str) {
			return utils.escapeLiteral(str);
		}
		_pulseQueryQueue() {
			if (this.pipeline) {
				this._pulsePipelinedQueryQueue();
				return;
			}
			if (this.readyForQuery === true) {
				this._activeQuery = this._queryQueue.shift();
				const activeQuery = this._getActiveQuery();
				if (activeQuery) {
					this.readyForQuery = false;
					this.hasExecuted = true;
					const queryError = activeQuery.submit(this.connection);
					if (queryError) process.nextTick(() => {
						activeQuery.handleError(queryError, this.connection);
						this.readyForQuery = true;
						this._pulseQueryQueue();
					});
				} else if (this.hasExecuted) {
					this._activeQuery = null;
					this.emit("drain");
				}
			}
		}
		_pulsePipelinedQueryQueue() {
			if (!this._connected || !this._queryable) return;
			while (this._queryQueue.length > 0) {
				const query = this._queryQueue.shift();
				this.hasExecuted = true;
				const queryError = query.submit(this.connection);
				if (queryError) {
					process.nextTick(() => {
						query.handleError(queryError, this.connection);
					});
					continue;
				}
				this._sentQueryQueue.push(query);
			}
			if (this.readyForQuery && !this._activeQuery && this._sentQueryQueue.length > 0) {
				this._activeQuery = this._sentQueryQueue.shift();
				this.readyForQuery = false;
			}
			if (!this._activeQuery && this._sentQueryQueue.length === 0 && this._queryQueue.length === 0 && this.hasExecuted) this.emit("drain");
		}
		query(config, values, callback) {
			let query;
			let result;
			if (config == null) throw new TypeError("Client was passed a null or undefined query");
			if (typeof config.submit === "function") {
				result = query = config;
				if (!query.callback) {
					if (typeof values === "function") query.callback = values;
					else if (callback) query.callback = callback;
				}
			} else {
				query = new Query(config, values, callback);
				if (!query.callback) result = new this._Promise((resolve, reject) => {
					query.callback = (err, res) => err ? reject(err) : resolve(res);
				}).catch((err) => {
					Error.captureStackTrace(err);
					throw err;
				});
				else if (typeof query.callback !== "function") throw new TypeError("callback is not a function");
			}
			const readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			if (readTimeout) {
				const queryCallback = query.callback || (() => {});
				const readTimeoutTimer = setTimeout(() => {
					const error = /* @__PURE__ */ new Error("Query read timeout");
					process.nextTick(() => {
						query.handleError(error, this.connection);
					});
					queryCallback(error);
					query.callback = () => {};
					const index = this._queryQueue.indexOf(query);
					if (index > -1) this._queryQueue.splice(index, 1);
					else if (this.pipeline) {
						this.connection.stream.destroy();
						return;
					}
					this._pulseQueryQueue();
				}, readTimeout);
				query.callback = (err, res) => {
					clearTimeout(readTimeoutTimer);
					queryCallback(err, res);
				};
			}
			if (this.binary && !query.binary) query.binary = true;
			if (query._result && !query._result._types) query._result._types = this._types;
			if (this.pipeline) {
				const portalQuery = typeof config.submit === "function" && !(query instanceof Query) ? "Custom query classes such as pg-cursor and pg-query-stream are" : query.rows ? "The `rows` option is" : null;
				if (portalQuery) {
					process.nextTick(() => {
						query.handleError(/* @__PURE__ */ new Error(`${portalQuery} not supported in pipeline mode`), this.connection);
					});
					return result;
				}
			}
			if (!this._queryable) {
				process.nextTick(() => {
					query.handleError(/* @__PURE__ */ new Error("Client has encountered a connection error and is not queryable"), this.connection);
				});
				return result;
			}
			if (this._ending) {
				process.nextTick(() => {
					query.handleError(/* @__PURE__ */ new Error("Client was closed and is not queryable"), this.connection);
				});
				return result;
			}
			if (this._queryQueue.length > 0 && !this.pipeline) queryQueueLengthDeprecationNotice();
			this._queryQueue.push(query);
			this._pulseQueryQueue();
			return result;
		}
		ref() {
			this.connection.ref();
		}
		unref() {
			this.connection.unref();
		}
		getTransactionStatus() {
			return this._txStatus;
		}
		end(cb) {
			this._ending = true;
			if (!this.connection._connecting || this._ended) {
				if (cb) {
					cb();
					return;
				} else return this._Promise.resolve();
			}
			if (!this._queryable) this.connection.stream.destroy();
			else if (this.pipeline && (this._getActiveQuery() || this._sentQueryQueue.length > 0 || this._queryQueue.length > 0)) this.once("drain", () => this.connection.end());
			else if (this._getActiveQuery()) this.connection.stream.destroy();
			else this.connection.end();
			if (cb) this.connection.once("end", cb);
			else return new this._Promise((resolve) => {
				this.connection.once("end", resolve);
			});
		}
		get queryQueue() {
			queryQueueDeprecationNotice();
			return this._queryQueue;
		}
	};
	Client.Query = Query;
	module.exports = Client;
}));
// node_modules/.pnpm/pg-pool@3.14.0_pg@8.23.1/node_modules/pg-pool/index.js
var require_pg_pool = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events").EventEmitter;
	const NOOP = function() {};
	const removeWhere = (list, predicate) => {
		const i = list.findIndex(predicate);
		return i === -1 ? void 0 : list.splice(i, 1)[0];
	};
	var IdleItem = class {
		constructor(client, idleListener, timeoutId) {
			this.client = client;
			this.idleListener = idleListener;
			this.timeoutId = timeoutId;
		}
	};
	var PendingItem = class {
		constructor(callback) {
			this.callback = callback;
		}
	};
	function throwOnDoubleRelease() {
		throw new Error("Release called on client which has already been released to the pool.");
	}
	function promisify(Promise, callback) {
		if (callback) return {
			callback,
			result: void 0
		};
		let rej;
		let res;
		const cb = function(err, client) {
			err ? rej(err) : res(client);
		};
		return {
			callback: cb,
			result: new Promise(function(resolve, reject) {
				res = resolve;
				rej = reject;
			}).catch((err) => {
				Error.captureStackTrace(err);
				throw err;
			})
		};
	}
	function makeIdleListener(pool, client) {
		return function idleListener(err) {
			err.client = client;
			client.removeListener("error", idleListener);
			client.on("error", () => {
				pool.log("additional client error after disconnection due to error", err);
			});
			pool._remove(client);
			pool.emit("error", err, client);
		};
	}
	var Pool = class extends EventEmitter {
		constructor(options, Client) {
			super();
			this.options = Object.assign({}, options);
			if (options != null && "password" in options) Object.defineProperty(this.options, "password", {
				configurable: true,
				enumerable: false,
				writable: true,
				value: options.password
			});
			if (options != null && options.ssl && options.ssl.key) Object.defineProperty(this.options.ssl, "key", { enumerable: false });
			this.options.max = this.options.max || this.options.poolSize || 10;
			this.options.min = this.options.min || 0;
			this.options.maxUses = this.options.maxUses || Infinity;
			this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
			this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
			this.log = this.options.log || function() {};
			this.Client = this.options.Client || Client || require_lib().Client;
			this.Promise = this.options.Promise || global.Promise;
			if (typeof this.options.idleTimeoutMillis === "undefined") this.options.idleTimeoutMillis = 1e4;
			this._clients = [];
			this._idle = [];
			this._expired = /* @__PURE__ */ new WeakSet();
			this._pendingQueue = [];
			this._endCallback = void 0;
			this.ending = false;
			this.ended = false;
		}
		_promiseTry(f) {
			const Promise = this.Promise;
			if (typeof Promise.try === "function") return Promise.try(f);
			return new Promise((resolve) => resolve(f()));
		}
		_isFull() {
			return this._clients.length >= this.options.max;
		}
		_isAboveMin() {
			return this._clients.length > this.options.min;
		}
		_pulseQueue() {
			this.log("pulse queue");
			if (this.ended) {
				this.log("pulse queue ended");
				return;
			}
			if (this.ending) {
				this.log("pulse queue on ending");
				if (this._idle.length) this._idle.slice().map((item) => {
					this._remove(item.client);
				});
				if (!this._clients.length) {
					this.ended = true;
					this._endCallback();
				}
				return;
			}
			if (!this._pendingQueue.length) {
				this.log("no queued requests");
				return;
			}
			if (!this._idle.length && this._isFull()) return;
			const pendingItem = this._pendingQueue.shift();
			if (this._idle.length) {
				const idleItem = this._idle.pop();
				clearTimeout(idleItem.timeoutId);
				const client = idleItem.client;
				client.ref && client.ref();
				const idleListener = idleItem.idleListener;
				return this._acquireClient(client, pendingItem, idleListener, false);
			}
			if (!this._isFull()) return this.newClient(pendingItem);
			throw new Error("unexpected condition");
		}
		_remove(client, callback) {
			const removed = removeWhere(this._idle, (item) => item.client === client);
			if (removed !== void 0) clearTimeout(removed.timeoutId);
			this._clients = this._clients.filter((c) => c !== client);
			const context = this;
			client.end(() => {
				context.emit("remove", client);
				if (typeof callback === "function") callback();
			});
		}
		connect(cb) {
			if (this.ending) {
				const err = /* @__PURE__ */ new Error("Cannot use a pool after calling end on the pool");
				return cb ? cb(err) : this.Promise.reject(err);
			}
			const response = promisify(this.Promise, cb);
			const result = response.result;
			if (this._isFull() || this._idle.length) {
				if (this._idle.length) process.nextTick(() => this._pulseQueue());
				if (!this.options.connectionTimeoutMillis) {
					this._pendingQueue.push(new PendingItem(response.callback));
					return result;
				}
				const queueCallback = (err, res, done) => {
					clearTimeout(tid);
					response.callback(err, res, done);
				};
				const pendingItem = new PendingItem(queueCallback);
				const tid = setTimeout(() => {
					removeWhere(this._pendingQueue, (i) => i.callback === queueCallback);
					pendingItem.timedOut = true;
					response.callback(/* @__PURE__ */ new Error("timeout exceeded when trying to connect"));
				}, this.options.connectionTimeoutMillis);
				if (tid.unref) tid.unref();
				this._pendingQueue.push(pendingItem);
				return result;
			}
			this.newClient(new PendingItem(response.callback));
			return result;
		}
		newClient(pendingItem) {
			const client = new this.Client(this.options);
			this._clients.push(client);
			const idleListener = makeIdleListener(this, client);
			this.log("checking client timeout");
			let tid;
			let timeoutHit = false;
			if (this.options.connectionTimeoutMillis) tid = setTimeout(() => {
				if (client.connection) {
					this.log("ending client due to timeout");
					timeoutHit = true;
					client.connection.stream.destroy();
				} else if (!client.isConnected()) {
					this.log("ending client due to timeout");
					timeoutHit = true;
					client.end();
				}
			}, this.options.connectionTimeoutMillis);
			this.log("connecting new client");
			client.connect((err) => {
				if (tid) clearTimeout(tid);
				client.on("error", idleListener);
				if (err) {
					this.log("client failed to connect", err);
					this._clients = this._clients.filter((c) => c !== client);
					if (timeoutHit) err = new Error("Connection terminated due to connection timeout", { cause: err });
					this._pulseQueue();
					if (!pendingItem.timedOut) pendingItem.callback(err, void 0, NOOP);
				} else {
					this.log("new client connected");
					if (this.options.onConnect) {
						this._promiseTry(() => this.options.onConnect(client)).then(() => {
							this._afterConnect(client, pendingItem, idleListener);
						}, (hookErr) => {
							this._clients = this._clients.filter((c) => c !== client);
							client.end(() => {
								this._pulseQueue();
								if (!pendingItem.timedOut) pendingItem.callback(hookErr, void 0, NOOP);
							});
						});
						return;
					}
					return this._afterConnect(client, pendingItem, idleListener);
				}
			});
		}
		_afterConnect(client, pendingItem, idleListener) {
			if (this.options.maxLifetimeSeconds !== 0) {
				const maxLifetimeTimeout = setTimeout(() => {
					this.log("ending client due to expired lifetime");
					this._expired.add(client);
					if (this._idle.findIndex((idleItem) => idleItem.client === client) !== -1) this._acquireClient(client, new PendingItem((err, client, clientRelease) => clientRelease()), idleListener, false);
				}, this.options.maxLifetimeSeconds * 1e3);
				maxLifetimeTimeout.unref();
				client.once("end", () => clearTimeout(maxLifetimeTimeout));
			}
			return this._acquireClient(client, pendingItem, idleListener, true);
		}
		_acquireClient(client, pendingItem, idleListener, isNew) {
			if (isNew) this.emit("connect", client);
			this.emit("acquire", client);
			client.release = this._releaseOnce(client, idleListener);
			client.removeListener("error", idleListener);
			if (!pendingItem.timedOut) {
				if (isNew && this.options.verify) this.options.verify(client, (err) => {
					if (err) {
						client.release(err);
						return pendingItem.callback(err, void 0, NOOP);
					}
					pendingItem.callback(void 0, client, client.release);
				});
				else pendingItem.callback(void 0, client, client.release);
			} else if (isNew && this.options.verify) this.options.verify(client, client.release);
			else client.release();
		}
		_releaseOnce(client, idleListener) {
			let released = false;
			return (err) => {
				if (released) throwOnDoubleRelease();
				released = true;
				this._release(client, idleListener, err);
			};
		}
		_release(client, idleListener, err) {
			client.on("error", idleListener);
			client._poolUseCount = (client._poolUseCount || 0) + 1;
			this.emit("release", err, client);
			if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
				if (client._poolUseCount >= this.options.maxUses) this.log("remove expended client");
				return this._remove(client, this._pulseQueue.bind(this));
			}
			if (this._expired.has(client)) {
				this.log("remove expired client");
				this._expired.delete(client);
				return this._remove(client, this._pulseQueue.bind(this));
			}
			let tid;
			if (this.options.idleTimeoutMillis && this._isAboveMin()) {
				tid = setTimeout(() => {
					if (this._isAboveMin()) {
						this.log("remove idle client");
						this._remove(client, this._pulseQueue.bind(this));
					}
				}, this.options.idleTimeoutMillis);
				if (this.options.allowExitOnIdle) tid.unref();
			}
			if (this.options.allowExitOnIdle) client.unref();
			this._idle.push(new IdleItem(client, idleListener, tid));
			this._pulseQueue();
		}
		query(text, values, cb) {
			if (typeof text === "function") {
				const response = promisify(this.Promise, text);
				setImmediate(function() {
					return response.callback(/* @__PURE__ */ new Error("Passing a function as the first parameter to pool.query is not supported"));
				});
				return response.result;
			}
			if (typeof values === "function") {
				cb = values;
				values = void 0;
			}
			const response = promisify(this.Promise, cb);
			cb = response.callback;
			this.connect((err, client) => {
				if (err) return cb(err);
				let clientReleased = false;
				const onError = (err) => {
					if (clientReleased) return;
					clientReleased = true;
					client.release(err);
					cb(err);
				};
				client.once("error", onError);
				this.log("dispatching query");
				try {
					client.query(text, values, (err, res) => {
						this.log("query dispatched");
						client.removeListener("error", onError);
						if (clientReleased) return;
						clientReleased = true;
						client.release(err);
						if (err) return cb(err);
						return cb(void 0, res);
					});
				} catch (err) {
					client.release(err);
					return cb(err);
				}
			});
			return response.result;
		}
		end(cb) {
			this.log("ending");
			if (this.ending) {
				const err = /* @__PURE__ */ new Error("Called end on pool more than once");
				return cb ? cb(err) : this.Promise.reject(err);
			}
			this.ending = true;
			const promised = promisify(this.Promise, cb);
			this._endCallback = promised.callback;
			this._pulseQueue();
			return promised.result;
		}
		get waitingCount() {
			return this._pendingQueue.length;
		}
		get idleCount() {
			return this._idle.length;
		}
		get expiredCount() {
			return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0);
		}
		get totalCount() {
			return this._clients.length;
		}
	};
	module.exports = Pool;
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/native/query.js
var require_query = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events").EventEmitter;
	const util = __require("util");
	const utils = require_utils$1();
	const NativeQuery = module.exports = function(config, values, callback) {
		EventEmitter.call(this);
		config = utils.normalizeQueryConfig(config, values, callback);
		this.text = config.text;
		this.values = config.values;
		this.name = config.name;
		this.queryMode = config.queryMode;
		this.callback = config.callback;
		this.state = "new";
		this._arrayMode = config.rowMode === "array";
		this._emitRowEvents = false;
		this.on("newListener", function(event) {
			if (event === "row") this._emitRowEvents = true;
		}.bind(this));
	};
	util.inherits(NativeQuery, EventEmitter);
	const errorFieldMap = {
		sqlState: "code",
		statementPosition: "position",
		messagePrimary: "message",
		messageDetail: "detail",
		messageHint: "hint",
		context: "where",
		schemaName: "schema",
		tableName: "table",
		columnName: "column",
		dataTypeName: "dataType",
		constraintName: "constraint",
		sourceFile: "file",
		sourceLine: "line",
		sourceFunction: "routine"
	};
	NativeQuery.prototype.handleError = function(err) {
		const fields = this.native && this.native.pq.resultErrorFields();
		if (fields) for (const key in fields) {
			const normalizedFieldName = errorFieldMap[key] || key;
			err[normalizedFieldName] = fields[key];
		}
		if (this.callback) this.callback(err);
		else this.emit("error", err);
		this.state = "error";
	};
	NativeQuery.prototype.then = function(onSuccess, onFailure) {
		return this._getPromise().then(onSuccess, onFailure);
	};
	NativeQuery.prototype.catch = function(callback) {
		return this._getPromise().catch(callback);
	};
	NativeQuery.prototype._getPromise = function() {
		if (this._promise) return this._promise;
		this._promise = new Promise(function(resolve, reject) {
			this._once("end", resolve);
			this._once("error", reject);
		}.bind(this));
		return this._promise;
	};
	NativeQuery.prototype.submit = function(client) {
		this.state = "running";
		const self = this;
		this.native = client.native;
		client.native.arrayMode = this._arrayMode;
		let after = function(err, rows, results) {
			client.native.arrayMode = false;
			setImmediate(function() {
				self.emit("_done");
			});
			if (err) return self.handleError(err);
			if (self._emitRowEvents) {
				if (results.length > 1) rows.forEach((rowOfRows, i) => {
					rowOfRows.forEach((row) => {
						self.emit("row", row, results[i]);
					});
				});
				else rows.forEach(function(row) {
					self.emit("row", row, results);
				});
			}
			self.state = "end";
			self.emit("end", results);
			if (self.callback) self.callback(null, results);
		};
		if (process.domain) after = process.domain.bind(after);
		if (this.name) {
			if (this.name.length > 63) {
				console.error("Warning! Postgres only supports 63 characters for query names.");
				console.error("You supplied %s (%s)", this.name, this.name.length);
				console.error("This can cause conflicts and silent errors executing queries");
			}
			const values = (this.values || []).map(utils.prepareValue);
			if (client.namedQueries[this.name] !== void 0) {
				if (this.text && client.namedQueries[this.name] !== this.text) {
					const err = /* @__PURE__ */ new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
					return after(err);
				}
				return client.native.execute(this.name, values, after);
			}
			return client.native.prepare(this.name, this.text, values.length, function(err) {
				if (err) return after(err);
				client.namedQueries[self.name] = self.text;
				return self.native.execute(self.name, values, after);
			});
		} else if (this.values) {
			if (!Array.isArray(this.values)) return after(/* @__PURE__ */ new Error("Query values must be an array"));
			const vals = this.values.map(utils.prepareValue);
			client.native.query(this.text, vals, after);
		} else if (this.queryMode === "extended") client.native.query(this.text, [], after);
		else client.native.query(this.text, after);
	};
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/native/client.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const nodeUtils = __require("util");
	var Native;
	try {
		Native = __require("pg-native");
	} catch (e) {
		throw e;
	}
	const TypeOverrides = require_type_overrides();
	const EventEmitter = __require("events").EventEmitter;
	const util = __require("util");
	const ConnectionParameters = require_connection_parameters();
	const NativeQuery = require_query();
	const queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
	const Client = module.exports = function(config) {
		EventEmitter.call(this);
		config = config || {};
		this._Promise = config.Promise || global.Promise;
		this._types = new TypeOverrides(config.types);
		this.native = new Native({ types: this._types });
		this._queryQueue = [];
		this._ending = false;
		this._connecting = false;
		this._connected = false;
		this._queryable = true;
		this.pipeline = Boolean(config.pipeline);
		this._pipelineInFlight = false;
		const cp = this.connectionParameters = new ConnectionParameters(config);
		if (config.nativeConnectionString) cp.nativeConnectionString = config.nativeConnectionString;
		this.user = cp.user;
		Object.defineProperty(this, "password", {
			configurable: true,
			enumerable: false,
			writable: true,
			value: cp.password
		});
		this.database = cp.database;
		this.host = cp.host;
		this.port = cp.port;
		this.namedQueries = {};
	};
	Client.Query = NativeQuery;
	util.inherits(Client, EventEmitter);
	Client.prototype._errorAllQueries = function(err) {
		const enqueueError = (query) => {
			process.nextTick(() => {
				query.native = this.native;
				query.handleError(err);
			});
		};
		if (this._hasActiveQuery()) {
			enqueueError(this._activeQuery);
			this._activeQuery = null;
		}
		this._queryQueue.forEach(enqueueError);
		this._queryQueue.length = 0;
	};
	Client.prototype._connect = function(cb) {
		const self = this;
		if (this._connecting) {
			process.nextTick(() => cb(/* @__PURE__ */ new Error("Client has already been connected. You cannot reuse a client.")));
			return;
		}
		this._connecting = true;
		this.connectionParameters.getLibpqConnectionString(function(err, conString) {
			if (self.connectionParameters.nativeConnectionString) conString = self.connectionParameters.nativeConnectionString;
			if (err) return cb(err);
			self.native.connect(conString, function(err) {
				if (err) {
					self.native.end();
					return cb(err);
				}
				self._connected = true;
				self.native.on("error", function(err) {
					self._queryable = false;
					self._errorAllQueries(err);
					self.emit("error", err);
				});
				self.native.on("notification", function(msg) {
					self.emit("notification", {
						channel: msg.relname,
						payload: msg.extra
					});
				});
				self.emit("connect");
				self._pulseQueryQueue(true);
				cb(null, this);
			});
		});
	};
	Client.prototype.connect = function(callback) {
		if (callback) {
			this._connect(callback);
			return;
		}
		return new this._Promise((resolve, reject) => {
			this._connect((error) => {
				if (error) reject(error);
				else resolve(this);
			});
		});
	};
	Client.prototype.query = function(config, values, callback) {
		let query;
		let result;
		let readTimeout;
		let readTimeoutTimer;
		let queryCallback;
		if (config === null || config === void 0) throw new TypeError("Client was passed a null or undefined query");
		else if (typeof config.submit === "function") {
			readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			result = query = config;
			if (typeof values === "function") config.callback = values;
		} else {
			readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
			query = new NativeQuery(config, values, callback);
			if (!query.callback) {
				let resolveOut, rejectOut;
				result = new this._Promise((resolve, reject) => {
					resolveOut = resolve;
					rejectOut = reject;
				}).catch((err) => {
					Error.captureStackTrace(err);
					throw err;
				});
				query.callback = (err, res) => err ? rejectOut(err) : resolveOut(res);
			}
		}
		if (readTimeout) {
			queryCallback = query.callback || (() => {});
			readTimeoutTimer = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("Query read timeout");
				process.nextTick(() => {
					query.handleError(error, this.connection);
				});
				queryCallback(error);
				query.callback = () => {};
				const index = this._queryQueue.indexOf(query);
				if (index > -1) this._queryQueue.splice(index, 1);
				this._pulseQueryQueue();
			}, readTimeout);
			query.callback = (err, res) => {
				clearTimeout(readTimeoutTimer);
				queryCallback(err, res);
			};
		}
		if (!this._queryable) {
			query.native = this.native;
			process.nextTick(() => {
				query.handleError(/* @__PURE__ */ new Error("Client has encountered a connection error and is not queryable"));
			});
			return result;
		}
		if (this._ending) {
			query.native = this.native;
			process.nextTick(() => {
				query.handleError(/* @__PURE__ */ new Error("Client was closed and is not queryable"));
			});
			return result;
		}
		if (this._queryQueue.length > 0 && !this.pipeline) queryQueueLengthDeprecationNotice();
		this._queryQueue.push(query);
		this._pulseQueryQueue();
		return result;
	};
	Client.prototype.end = function(cb) {
		const self = this;
		this._ending = true;
		if (this._connecting && !this._connected) this.once("connect", () => {
			this.end(() => {});
		});
		let result;
		if (!cb) result = new this._Promise(function(resolve, reject) {
			cb = (err) => err ? reject(err) : resolve();
		});
		const doEnd = function() {
			self.native.end(function() {
				self._connected = false;
				self._errorAllQueries(/* @__PURE__ */ new Error("Connection terminated"));
				process.nextTick(() => {
					self.emit("end");
					if (cb) cb();
				});
			});
		};
		if (this.pipeline && (this._pipelineInFlight || this._queryQueue.length > 0)) this.once("drain", doEnd);
		else doEnd();
		return result;
	};
	Client.prototype._hasActiveQuery = function() {
		return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
	};
	Client.prototype._pulseQueryQueue = function(initialConnection) {
		if (!this._connected) return;
		if (this.pipeline && !initialConnection) return this._pulsePipelinedQueryQueue();
		if (this._hasActiveQuery()) return;
		const query = this._queryQueue.shift();
		if (!query) {
			if (!initialConnection) this.emit("drain");
			return;
		}
		this._activeQuery = query;
		query.submit(this);
		const self = this;
		query.once("_done", function() {
			self._pulseQueryQueue();
		});
	};
	Client.prototype._pulsePipelinedQueryQueue = function() {
		if (!this._connected || this._pipelineInFlight) return;
		if (this._queryQueue.length === 0) {
			if (this.hasExecuted) this.emit("drain");
			return;
		}
		this._pipelineInFlight = true;
		const self = this;
		const queries = [];
		const nativeQueries = [];
		const utils = require_utils$1();
		while (this._queryQueue.length > 0) {
			const query = this._queryQueue.shift();
			this.hasExecuted = true;
			nativeQueries.push(query);
			const values = query.values ? query.values.map(utils.prepareValue) : null;
			const pipelineEntry = {
				text: query.text,
				name: query.name,
				arrayMode: query._arrayMode
			};
			if (values) pipelineEntry.values = values;
			if (query.name && this.namedQueries[query.name]) pipelineEntry._alreadyPrepared = true;
			queries.push(pipelineEntry);
		}
		this.native.pipeline(queries, function(err, results) {
			self._pipelineInFlight = false;
			if (err) {
				self._connected = false;
				self._queryable = false;
				for (let i = 0; i < nativeQueries.length; i++) {
					const q = nativeQueries[i];
					q.native = self.native;
					q.handleError(err);
				}
				self._errorAllQueries(err);
				self.emit("error", err);
				self.emit("end");
				return;
			}
			for (let i = 0; i < nativeQueries.length; i++) {
				const q = nativeQueries[i];
				const r = results[i];
				q.native = self.native;
				if (r.err) q.handleError(r.err);
				else {
					if (q.name) self.namedQueries[q.name] = q.text;
					q.state = "end";
					q.emit("end", r.result);
					if (q.callback) q.callback(null, r.result);
				}
				setImmediate(function() {
					q.emit("_done");
				});
			}
			self._pulsePipelinedQueryQueue();
		});
	};
	Client.prototype.cancel = function(query) {
		if (this._activeQuery === query) this.native.cancel(function() {});
		else if (this._queryQueue.indexOf(query) !== -1) this._queryQueue.splice(this._queryQueue.indexOf(query), 1);
	};
	Client.prototype.ref = function() {};
	Client.prototype.unref = function() {};
	Client.prototype.setTypeParser = function(oid, format, parseFn) {
		return this._types.setTypeParser(oid, format, parseFn);
	};
	Client.prototype.getTypeParser = function(oid, format) {
		return this._types.getTypeParser(oid, format);
	};
	Client.prototype.isConnected = function() {
		return this._connected;
	};
	Client.prototype.getTransactionStatus = function() {
		return this.native.getTransactionStatus();
	};
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/native/index.js
var require_native = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_client();
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Client = require_client$1();
	const defaults = require_defaults();
	const Connection = require_connection();
	const Result = require_result();
	const utils = require_utils$1();
	const Pool = require_pg_pool();
	const TypeOverrides = require_type_overrides();
	const { DatabaseError } = require_dist();
	const { escapeIdentifier, escapeLiteral } = require_utils$1();
	const poolFactory = (Client) => {
		return class BoundPool extends Pool {
			constructor(options) {
				super(options, Client);
			}
		};
	};
	const PG = function(clientConstructor) {
		this.defaults = defaults;
		this.Client = clientConstructor;
		this.Query = this.Client.Query;
		this.Pool = poolFactory(this.Client);
		this._pools = [];
		this.Connection = Connection;
		this.types = require_pg_types();
		this.DatabaseError = DatabaseError;
		this.TypeOverrides = TypeOverrides;
		this.escapeIdentifier = escapeIdentifier;
		this.escapeLiteral = escapeLiteral;
		this.Result = Result;
		this.utils = utils;
	};
	let clientConstructor = Client;
	let forceNative = false;
	try {
		forceNative = !!process.env.NODE_PG_FORCE_NATIVE;
	} catch {}
	if (forceNative) clientConstructor = require_native();
	module.exports = new PG(clientConstructor);
	Object.defineProperty(module.exports, "native", {
		configurable: true,
		enumerable: false,
		get() {
			let native = null;
			try {
				native = new PG(require_native());
			} catch (err) {
				if (err.code !== "MODULE_NOT_FOUND") throw err;
			}
			Object.defineProperty(module.exports, "native", { value: native });
			return native;
		}
	});
}));
// node_modules/.pnpm/pg@8.23.1/node_modules/pg/esm/index.mjs
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
import_lib.default.Client;
import_lib.default.Pool;
import_lib.default.Connection;
import_lib.default.types;
import_lib.default.Query;
import_lib.default.DatabaseError;
import_lib.default.escapeIdentifier;
import_lib.default.escapeLiteral;
import_lib.default.Result;
import_lib.default.TypeOverrides;
import_lib.default.defaults;
var esm_default = import_lib.default;
// src/infra/database-engine/postgres-catalog.ts
function readPostgresCatalog(value) {
	if (!Array.isArray(value) || !value.every((item) => item !== null && typeof item === "object" && typeof item.table === "string" && typeof item.kind === "string" && "value" in item)) throw new Error("PostgreSQL did not return catalog facts");
	return value;
}
/** One statement gives every catalog fact the same PostgreSQL MVCC snapshot. */
function postgresCatalogQuery(namespace, includeDefinitions = false) {
	const literal = `'${namespace.replaceAll("'", "''")}'`;
	const columns = (relation, keys) => `(SELECT jsonb_agg(a.attname ORDER BY k.ordinality) FROM unnest(${keys}) WITH ORDINALITY k(num, ordinality) JOIN pg_catalog.pg_attribute a ON a.attrelid = ${relation} AND a.attnum = k.num)`;
	const action = (field) => `CASE ${field} WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END`;
	return `WITH relations AS (
    SELECT c.oid, c.relname FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = ${literal} AND c.relkind IN ('r', 'p')
  ), attributes AS (
    SELECT r.relname, a.attname, a.atttypid, a.atttypmod, a.attnotnull,
      a.attidentity, a.attnum, a.attgenerated, a.attcollation,
      pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default_expression
    FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid
    LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum
    WHERE a.attnum > 0 AND NOT a.attisdropped
  ), facts AS (
    SELECT r.relname AS "table", 'table' AS kind, 'null'::jsonb AS value FROM relations r
    UNION ALL SELECT a.relname, 'column', jsonb_build_object(
      'name', a.attname, 'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
      'nullable', NOT a.attnotnull, 'identity', a.attidentity = 'd', 'position', a.attnum,
      'default', regexp_replace(a.default_expression, '::(text|bigint|double precision)$', ''))
      FROM attributes a
    UNION ALL SELECT r.relname, CASE c.contype WHEN 'p' THEN 'primaryKey' ELSE 'unique' END,
      ${columns("r.oid", "c.conkey")} FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid WHERE c.contype IN ('p', 'u')
    UNION ALL SELECT r.relname, 'foreignKey', jsonb_build_object(
      'columns', ${columns("r.oid", "c.conkey")}, 'target', target.relname,
      'targetColumns', ${columns("c.confrelid", "c.confkey")},
      'onUpdate', ${action("c.confupdtype")}, 'onDelete', ${action("c.confdeltype")},
      'deferrable', c.condeferrable, 'deferred', c.condeferred)
      FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
      JOIN pg_catalog.pg_class target ON target.oid = c.confrelid WHERE c.contype = 'f'
    UNION ALL SELECT r.relname, 'indexes', to_jsonb((SELECT count(*) FROM pg_catalog.pg_index i WHERE i.indrelid = r.oid)) FROM relations r
    UNION ALL SELECT r.relname, 'checks', to_jsonb((SELECT count(*) FROM pg_catalog.pg_constraint c WHERE c.conrelid = r.oid AND c.contype = 'c')) FROM relations r
    ${includeDefinitions ? `UNION ALL SELECT r.relname, 'constraintDefinition', jsonb_build_object('name', c.conname, 'definition', pg_catalog.pg_get_constraintdef(c.oid)) FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
    UNION ALL SELECT r.relname, 'indexDefinition', jsonb_build_object('name', c.relname, 'definition', pg_catalog.pg_get_indexdef(i.indexrelid), 'valid', i.indisvalid) FROM relations r JOIN pg_catalog.pg_index i ON i.indrelid = r.oid JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid
    UNION ALL SELECT a.relname, 'columnDefinition', jsonb_build_object('name', a.attname, 'default', a.default_expression, 'generated', a.attgenerated, 'identity', a.attidentity, 'collation', a.attcollation::regcollation::text) FROM attributes a
    UNION ALL SELECT r.relname, 'triggerDefinition', jsonb_build_object('name', t.tgname, 'definition', pg_catalog.pg_get_triggerdef(t.oid), 'enabled', t.tgenabled, 'function', pg_catalog.pg_get_functiondef(t.tgfoid)) FROM relations r JOIN pg_catalog.pg_trigger t ON t.tgrelid = r.oid WHERE NOT t.tgisinternal
    UNION ALL SELECT c.relname, 'viewDefinition', to_jsonb(pg_catalog.pg_get_viewdef(c.oid)) FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = ${literal} AND c.relkind IN ('v', 'm')
    UNION ALL SELECT c.cfgname, 'textSearchDefinition', jsonb_build_object('token', m.maptokentype, 'order', m.mapseqno, 'dictionary', d.dictname, 'namespace', dn.nspname)
      FROM pg_catalog.pg_ts_config c JOIN pg_catalog.pg_namespace n ON n.oid = c.cfgnamespace
      JOIN pg_catalog.pg_ts_config_map m ON m.mapcfg = c.oid JOIN pg_catalog.pg_ts_dict d ON d.oid = m.mapdict
      JOIN pg_catalog.pg_namespace dn ON dn.oid = d.dictnamespace WHERE n.nspname = ${literal} AND c.cfgname = 'openclaw_simple_unaccent'
    UNION ALL SELECT p.proname, 'functionDefinition', to_jsonb(pg_catalog.pg_get_functiondef(p.oid)) FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ${literal} AND p.proname = 'openclaw_vector' AND p.prokind = 'f'` : ""}
  ) SELECT coalesce(jsonb_agg(facts), '[]'::jsonb) AS catalog FROM facts`;
}
// src/infra/sqlite-schema-sql.ts
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
// src/snapshot/postgres-generation.ts
const GENERATION_ROW_PREFIX = 256;
const GENERATION_LIMITS = { runRows: 1e4 };
/** Hold native writers out until the caller's migration transaction settles. */
async function lockPostgresGeneration(client, namespace) {
	const relations = await client.query(`SELECT c.relname AS name, c.relkind AS kind, pg_get_userbyid(c.relowner) AS owner
     FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
     WHERE n.nspname=$1 AND c.relkind IN ('r','p','m','S') ORDER BY c.relname COLLATE "C"`, [namespace]);
	const tables = relations.rows.filter(({ kind }) => kind === "r" || kind === "p");
	if (tables.length) await client.query(`LOCK TABLE ${tables.map(({ name }) => `${quoteSqliteIdentifier(namespace)}.${quoteSqliteIdentifier(name)}`).join(",")} IN ACCESS EXCLUSIVE MODE`);
	for (const { name, kind, owner } of relations.rows) if (kind === "S" || kind === "m") await client.query(`ALTER ${kind === "S" ? "SEQUENCE" : "MATERIALIZED VIEW"} ${quoteSqliteIdentifier(namespace)}.${quoteSqliteIdentifier(name)} OWNER TO ${quoteSqliteIdentifier(owner)}`);
}
/** Observe the caller's snapshot without interpreting it through this build's schema. */
async function inspectPostgresGeneration(client, anchor, limits = GENERATION_LIMITS) {
	const metadata = await client.query(`SELECT m.store, m.version::text AS version, m.store_id,
     n.nspowner=(SELECT oid FROM pg_roles WHERE rolname=current_user) AS owned
     FROM ${quoteSqliteIdentifier(anchor.namespace)}.openclaw_schema_meta m
     CROSS JOIN pg_namespace n WHERE n.nspname=$1`, [anchor.namespace]);
	const row = metadata.rows[0];
	if (metadata.rows.length !== 1 || !row?.owned || row.store_id !== anchor.storeId || !Number.isSafeInteger(Number(row.version)) || Number(row.version) < 0) throw new Error("PostgreSQL anchor does not match its owned generation metadata");
	await client.query("SELECT set_config('search_path',$1,true)", [quoteSqliteIdentifier(anchor.namespace)]);
	const catalog = readPostgresCatalog(JSON.parse((await client.query(`SELECT catalog::text FROM (${postgresCatalogQuery(anchor.namespace, true)}) generation`)).rows[0].catalog)).filter((fact) => fact.kind !== "functionDefinition");
	const routines = await client.query(`SELECT p.oid::regprocedure::text AS name, pg_get_functiondef(p.oid) AS definition
     FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
     WHERE n.nspname=$1 AND p.prokind IN ('f','p','w')`, [anchor.namespace]);
	for (const { name, definition } of routines.rows) catalog.push({
		table: name,
		kind: "functionDefinition",
		value: definition
	});
	const tables = {};
	const relations = await client.query(`SELECT c.relname AS name, coalesce(p.remote, false) OR coalesce(p.bytes, pg_table_size(c.oid))
       < coalesce($2::bigint, pg_size_bytes(current_setting('work_mem')) / 4) AS whole
     FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
     LEFT JOIN LATERAL (SELECT sum(pg_table_size(l.relid)) AS bytes, bool_or(r.relkind='f') AS remote
       FROM pg_partition_tree(c.oid) l JOIN pg_class r ON r.oid=l.relid) p ON true
     WHERE n.nspname=$1 AND c.relkind IN ('r','p','m') ORDER BY c.relname COLLATE "C"`, [anchor.namespace, limits.wholeSortBytes ?? null]);
	for (const { name, whole } of relations.rows) {
		const hash = createHash("sha256");
		const table = `${quoteSqliteIdentifier(anchor.namespace)}.${quoteSqliteIdentifier(name)}`;
		let rows = 0;
		const stream = async (cursor, query, values = []) => {
			let read = 0;
			await client.query(`DECLARE ${cursor} NO SCROLL CURSOR FOR ${query}`, values);
			try {
				for (;;) {
					const batch = await client.query(`FETCH FORWARD 128 FROM ${cursor}`);
					for (const record of batch.rows) {
						hash.update(record.row).update("\n");
						read++;
					}
					if (batch.rows.length < 128) break;
				}
			} finally {
				await client.query(`CLOSE ${cursor}`);
			}
			rows += read;
			return read;
		};
		if (whole) {
			await stream("openclaw_generation_rows", `SELECT row_to_json(t)::text AS row FROM ${table} t ORDER BY row_to_json(t)::text COLLATE "C"`);
			tables[name] = {
				rows,
				sha256: hash.digest("hex")
			};
			continue;
		}
		let keys = [];
		let tids = [];
		let run;
		const hashRuns = async () => {
			if (!keys.length) return;
			const read = await client.query(`SELECT s.value AS row FROM (SELECT row_to_json(t)::text COLLATE "C" AS value FROM ${table} t
         WHERE t.ctid = ANY($1::tid[]) AND t.tableoid::int8::text || ':' || t.ctid::text = ANY($2::text[])) s
         ORDER BY s.value`, [tids, keys]);
			if (read.rows.length !== keys.length) throw new Error("PostgreSQL generation changed during inspection");
			for (const record of read.rows) {
				hash.update(record.row).update("\n");
				rows++;
			}
			keys = [];
			tids = [];
		};
		const closeRun = async (closed) => {
			if (closed.rows <= limits.runRows) {
				keys = keys.concat(closed.keys);
				tids = tids.concat(closed.tids);
				if (keys.length >= 128) await hashRuns();
				return;
			}
			await hashRuns();
			if (await stream("openclaw_generation_run", `SELECT row_to_json(t)::text AS row FROM ${table} t
         WHERE left(row_to_json(t)::text, ${GENERATION_ROW_PREFIX}) COLLATE "C" = $1
         ORDER BY row_to_json(t)::text COLLATE "C"`, [closed.prefix]) !== closed.rows) throw new Error("PostgreSQL generation changed during inspection");
		};
		await client.query(`DECLARE openclaw_generation_rows NO SCROLL CURSOR FOR SELECT t.tableoid::int8::text || ':' || t.ctid::text AS key,
       t.ctid::text AS tid, left(row_to_json(t)::text, ${GENERATION_ROW_PREFIX}) COLLATE "C" AS prefix FROM ${table} t ORDER BY prefix`);
		try {
			for (;;) {
				const batch = await client.query("FETCH FORWARD 128 FROM openclaw_generation_rows");
				for (const record of batch.rows) {
					if (run?.prefix !== record.prefix) {
						if (run) await closeRun(run);
						run = {
							prefix: record.prefix,
							rows: 0,
							keys: [],
							tids: []
						};
					}
					if (++run.rows <= limits.runRows) {
						run.keys.push(record.key);
						run.tids.push(record.tid);
					} else if (run.keys.length) {
						run.keys = [];
						run.tids = [];
					}
				}
				if (batch.rows.length < 128) break;
			}
			if (run) await closeRun(run);
			await hashRuns();
		} finally {
			await client.query("CLOSE openclaw_generation_rows");
		}
		tables[name] = {
			rows,
			sha256: hash.digest("hex")
		};
	}
	const sequences = await client.query(`SELECT c.relname AS name, s.seqstart::text AS start, s.seqincrement::text AS increment,
     s.seqmin::text AS minimum, s.seqmax::text AS maximum, s.seqcache::text AS cache, s.seqcycle AS cycle
     FROM pg_sequence s JOIN pg_class c ON c.oid=s.seqrelid JOIN pg_namespace n ON n.oid=c.relnamespace
     WHERE n.nspname=$1 ORDER BY c.relname COLLATE "C"`, [anchor.namespace]);
	const allocations = {};
	for (const { name, ...definition } of sequences.rows) {
		catalog.push({
			table: name,
			kind: "sequenceDefinition",
			value: definition
		});
		allocations[name] = (await client.query(`SELECT last_value::text AS value, is_called AS called FROM ${quoteSqliteIdentifier(anchor.namespace)}.${quoteSqliteIdentifier(name)}`)).rows[0];
	}
	catalog.sort((a, b) => {
		const left = JSON.stringify(a), right = JSON.stringify(b);
		return left < right ? -1 : left > right ? 1 : 0;
	});
	return {
		store: row.store,
		version: Number(row.version),
		catalog,
		tables,
		allocations
	};
}
function fingerprintPostgresGeneration(anchor, generation) {
	return createHash("sha256").update(JSON.stringify({
		engine: "postgres",
		namespace: anchor.namespace,
		storeId: anchor.storeId,
		...generation
	})).digest("hex");
}
// packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function collectErrorGraphCandidates(err, resolveNested) {
	if (err == null) return [];
	const candidates = [err];
	const seen = (/* @__PURE__ */ new Set()).add(err);
	for (const current of candidates) {
		if (!current || typeof current !== "object" || !resolveNested) continue;
		for (const nested of resolveNested(current)) if (nested != null && !seen.has(nested)) {
			seen.add(nested);
			candidates.push(nested);
		}
	}
	return candidates;
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			readProperty(current, "cause"),
			readProperty(current, "reason"),
			readProperty(current, "original"),
			readProperty(current, "error"),
			readProperty(current, "suppressed"),
			readProperty(current, "data")
		];
		const errors = readProperty(current, "errors");
		if (Array.isArray(errors)) nested.push(...errors);
		return nested;
	});
}
// src/infra/error-graph-internal.ts
/** Retained errors must not keep callers alive through V8's lazy stack frames. */
function materializeErrorStack(failure) {
	try {
		for (const error of collectNestedErrorCandidates(failure)) try {
			if (!(error instanceof Error)) continue;
			try {
				error.stack = String(error.stack);
			} catch {
				error.stack = "Stack trace unavailable: custom formatter failed";
			}
		} catch {}
	} catch {}
}
// src/infra/postgres-sync/bridge.worker.ts
const { host: serviceHost, peers } = workerData;
function watchPeer({ port, signal }) {
	port.on("close", () => {
		const peer = new Int32Array(signal);
		Atomics.store(peer, 1, 1);
		Atomics.notify(peer, 1);
	});
}
peers.forEach(watchPeer);
parentPort?.on("message", (message) => watchPeer(message.watch));
function attachHost(host) {
	const clients = /* @__PURE__ */ new Set();
	host.on("message", (message) => {
		if ("host" in message) attachHost(message.host);
		else attachConnection(message.connection, clients);
	});
	host.on("close", () => {
		for (const close of clients) close();
	});
}
const STATEMENT_LIMIT = 256;
const CACHED_PLAN_RESULT_CHANGED = "0A000";
const TRANSPORT_TIMEOUT_MS = 1e4;
/**
* Reuses server-side prepared statements on one connection, so PostgreSQL parses each
* parameterized SQL text once per session instead of on every call; plan choice stays
* automatic (plan_cache_mode). The server re-analyzes a prepared statement when
* search_path changes, so the SQL text is the key.
*/
function createStatementCache(client) {
	const { parsedStatements } = client.connection;
	const names = /* @__PURE__ */ new Map();
	const stale = /* @__PURE__ */ new Set();
	async function deallocate(name) {
		await client.query(`DEALLOCATE "${name}"`);
		delete parsedStatements[name];
		stale.delete(name);
	}
	return {
		async query(sql, parameters, singleStatement = false) {
			if (parameters.length === 0 && !singleStatement) return client.query(sql);
			let name = names.get(sql);
			if (name === void 0) {
				if (names.size >= STATEMENT_LIMIT) {
					const [victimSql, victim] = names.entries().next().value;
					await deallocate(victim);
					names.delete(victimSql);
				}
				name = createHash("sha1").update(sql).digest("hex");
			} else names.delete(sql);
			names.set(sql, name);
			if (stale.has(name)) await deallocate(name);
			const reused = parsedStatements[name] !== void 0;
			const autocommit = client.getTransactionStatus() === "I";
			const config = {
				name,
				text: sql,
				values: [...parameters]
			};
			try {
				return await client.query(config);
			} catch (error) {
				if (parsedStatements[name] === void 0) names.delete(sql);
				if (!reused || !(error instanceof esm_default.DatabaseError) || error.code !== CACHED_PLAN_RESULT_CHANGED) throw error;
				stale.add(name);
				if (!autocommit) throw error;
				await deallocate(name);
				return client.query(config);
			}
		},
		/** Drops every statement after DDL on this connection, before a stale plan can fail. */
		async reset() {
			if (names.size === 0) return;
			await client.query("DEALLOCATE ALL");
			names.clear();
			stale.clear();
			for (const name of Object.keys(parsedStatements)) delete parsedStatements[name];
		}
	};
}
function attachConnection(data, clients) {
	const { port, signal, url, connectTimeoutMs, lockTimeoutMs, statementTimeoutMs } = data;
	let schema = data.schema;
	const control = new Int32Array(signal);
	let client;
	let statements;
	let connectionError;
	const close = () => {
		clients.delete(close);
		port.close();
		client?.end().catch(() => {});
	};
	clients.add(close);
	port.on("close", close);
	function send(reply) {
		port.postMessage(reply);
		Atomics.store(control, 0, reply.id);
		Atomics.notify(control, 0);
	}
	async function connect(namespace) {
		const searchPath = `"${namespace.replaceAll("\"", "\"\"")}"`;
		if (client) await client.end().catch(() => {});
		connectionError = void 0;
		client = new esm_default.Client({
			connectionString: url,
			connectionTimeoutMillis: connectTimeoutMs,
			keepAlive: true,
			keepAliveInitialDelayMillis: TRANSPORT_TIMEOUT_MS,
			types: { getTypeParser: (oid, format) => (oid === esm_default.types.builtins.JSON || oid === esm_default.types.builtins.JSONB) && format !== "binary" ? (value) => value : esm_default.types.getTypeParser(oid, format) }
		});
		statements = createStatementCache(client);
		client.on("error", (error) => {
			materializeErrorStack(error);
			connectionError = error;
		});
		await client.connect();
		const setup = {
			text: "SELECT set_config('lock_timeout', $1, false), set_config('statement_timeout', $2, false), set_config('search_path', $3, false)",
			values: [
				`${lockTimeoutMs}ms`,
				`${statementTimeoutMs}ms`,
				searchPath
			],
			query_timeout: TRANSPORT_TIMEOUT_MS
		};
		await client.query(setup);
		if (data.readOnly) {
			const readOnly = {
				text: "SET default_transaction_read_only = on",
				query_timeout: TRANSPORT_TIMEOUT_MS
			};
			await client.query(readOnly);
		}
		schema = namespace;
	}
	async function useSchema(namespace, reconnectIfIdle, validateIfIdle) {
		if (connectionError) {
			if (!reconnectIfIdle || client.getTransactionStatus() !== "I") throw connectionError;
			await connect(namespace);
			return;
		}
		if (schema === namespace && !validateIfIdle) return;
		if (client.getTransactionStatus() !== "I") throw new Error("Cannot switch PostgreSQL schemas inside a transaction");
		try {
			const validation = {
				text: schema === namespace ? "SELECT 1" : "SELECT set_config('search_path', $1, false)",
				values: schema === namespace ? [] : [`"${namespace.replaceAll("\"", "\"\"")}"`],
				query_timeout: TRANSPORT_TIMEOUT_MS
			};
			await client.query(validation);
			schema = namespace;
		} catch {
			await connect(namespace);
		}
	}
	async function query(sql, parameters) {
		if (!data.readOnly) return statements.query(sql, parameters);
		if (/^\s*BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY\s*;?\s*$/i.test(sql) || /^\s*(?:COMMIT|ROLLBACK(?: TO SAVEPOINT openclaw_tx_nested)?)\s*;?\s*$/i.test(sql)) return statements.query(sql, parameters, true);
		const ownTransaction = client.getTransactionStatus() === "I";
		try {
			if (ownTransaction) await client.query("BEGIN READ ONLY");
			await client.query("SELECT 1");
			return await statements.query(sql, parameters, true);
		} finally {
			if (ownTransaction && client.getTransactionStatus() !== "I") await client.query("ROLLBACK");
		}
	}
	async function handleRequest(request) {
		let reply;
		const cutoff = request.operation === "query" || request.operation === "recovery-generation" ? setTimeout(() => void client.end().catch(() => {}), request.deadlineMs - 2e4) : void 0;
		try {
			if (request.operation === "connect") {
				await connect(request.schema);
				reply = {
					id: request.id,
					result: {
						inTransaction: false,
						rows: [],
						rowCount: 0,
						fields: []
					}
				};
			} else if (request.operation === "close") {
				await client.end();
				reply = {
					id: request.id,
					result: {
						inTransaction: false,
						rows: [],
						rowCount: 0,
						fields: []
					}
				};
			} else if (request.operation === "release") {
				if (connectionError) throw connectionError;
				const reusable = client.getTransactionStatus() === "I";
				if (!reusable) await client.end();
				reply = {
					id: request.id,
					reusable
				};
			} else if (request.operation === "recovery-generation") {
				await useSchema(request.schema, request.reconnectIfIdle === true, request.validateIfIdle === true);
				if (request.lock) await lockPostgresGeneration(client, schema);
				const anchor = {
					namespace: schema,
					storeId: request.storeId
				};
				const generation = fingerprintPostgresGeneration(anchor, await inspectPostgresGeneration(client, anchor));
				reply = {
					id: request.id,
					generation,
					inTransaction: client.getTransactionStatus() !== "I"
				};
			} else {
				await useSchema(request.schema, request.reconnectIfIdle === true, request.validateIfIdle === true);
				const results = await query(request.sql, request.parameters);
				const result = Array.isArray(results) ? results.at(-1) : results;
				const commands = (Array.isArray(results) ? results : [results]).map(({ command }) => command);
				const mutation = commands.some((command) => /^(?:CREATE|ALTER|DROP|TRUNCATE|COMMENT|GRANT|REVOKE|COPY|CALL|DO|REFRESH)$/.test(command)) ? "unscoped" : commands.some((command) => /^(?:INSERT|UPDATE|DELETE|MERGE)$/.test(command)) ? "scoped" : void 0;
				if (mutation === "unscoped") await statements.reset();
				reply = {
					id: request.id,
					result: {
						inTransaction: client.getTransactionStatus() !== "I",
						command: result.command,
						mutation,
						rows: result.rows,
						rowCount: result.rowCount ?? 0,
						fields: result.fields.map(({ name, dataTypeID }) => ({
							name,
							dataTypeID
						}))
					}
				};
			}
		} catch (error) {
			const failure = error instanceof Error ? error : new Error(String(error));
			const reported = request.operation === "connect" ? /* @__PURE__ */ new Error(`PostgreSQL connection failed: ${failure.message}. Check database.postgres.connection, network, and credentials.`) : failure;
			if (request.operation === "connect") reported.name = "PostgresConnectionError";
			const details = {
				name: reported.name,
				message: reported.message,
				stack: reported.stack
			};
			if (request.operation === "connect" && "code" in failure && typeof failure.code === "string") details.code = failure.code;
			if (error instanceof esm_default.DatabaseError) Object.assign(details, {
				code: error.code,
				detail: error.detail,
				constraint: error.constraint,
				column: error.column
			});
			reply = {
				id: request.id,
				error: details
			};
		}
		clearTimeout(cutoff);
		send(reply);
		if (request.operation === "close" || request.operation === "connect" && "error" in reply || "reusable" in reply && !reply.reusable) close();
	}
	port.on("message", (request) => {
		handleRequest(request);
	});
}
attachHost(serviceHost);
parentPort?.postMessage({ poolReady: true }, []);
export {};
