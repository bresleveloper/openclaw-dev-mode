import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { $ as globalRegistry, $n as $ZodCheckMimeType, $r as $ZodEncodeError, $t as $ZodPipe, An as isValidCreditCard, Ar as _safeParseAsync, At as $ZodIPv6, Bn as validateURL, Br as safeEncodeAsync, Bt as $ZodMAC, Cn as base64Charset, Cr as _parse, Ct as $ZodEnum, Dn as isValidBase64, Dr as _safeEncode, Dt as $ZodGUID, En as getDiscriminatedOption, Er as _safeDecodeAsync, Et as $ZodFunction, Fi as util_exports, Fn as parseURLObject, Fr as parse, Ft as $ZodIntersection, G as extractDefs, Gn as $ZodCheckEndsWith, Gr as $ZodError, Gt as $ZodNonOptional, Hn as Doc, Hr as safeParseAsync, Ht as $ZodNaN, I as toJSONSchema, In as standardProps, Ir as parseAsync, It as $ZodJWT, J as initializeContext, Jn as $ZodCheckLengthEquals, Jr as formatError, Jt as $ZodNumber, K as finalize, Kn as $ZodCheckGreaterThan, Kr as $ZodRealError, Kt as $ZodNull, Ln as stripTabAndNewline, Lr as safeDecode, Lt as $ZodKSUID, Mn as isValidIPv6, Mr as decodeAsync, Mt as $ZodISODateTime, Ni as stringifyPrimitive, Nn as isValidJWT, Nr as encode, Nt as $ZodISODuration, On as isValidBase64URL, Or as _safeEncodeAsync, Ot as $ZodIBAN, Pi as toZod, Pn as mergeValues, Pr as encodeAsync, Pt as $ZodISOTime, Q as $output, Qn as $ZodCheckMaxSize, Qr as $ZodAsyncError, Qt as $ZodOptional, Rn as urlHostnameOk, Rr as safeDecodeAsync, Rt as $ZodLazy, Sn as $ZodXor, Sr as _encodeAsync, St as $ZodEmoji, Ti as parsedType, Tn as canParseURL, Tr as _safeDecode, Tt as $ZodFile, U as createStandardJSONSchemaMethod, Un as $ZodCheck, Ur as validate, Ut as $ZodNanoID, Vn as version, Vr as safeParse, Vt as $ZodMap, W as createToJSONSchemaMethod, Wn as $ZodCheckBigIntFormat, Wr as validateAsync, Wt as $ZodNever, X as $ZodRegistry, Xn as $ZodCheckLowerCase, Xr as toDotPath, Xt as $ZodObject, Y as processSchema, Yn as $ZodCheckLessThan, Yr as prettifyError, Yt as $ZodNumberFormat, Z as $input, Zn as $ZodCheckMaxLength, Zr as treeifyError, Zt as $ZodObjectJIT, _n as $ZodUndefined, _t as $ZodDate, an as $ZodSet, ar as $ZodCheckProperties, at as $ZodBigInt, bn as $ZodVoid, br as _decodeAsync, bt as $ZodE164, cn as $ZodSuccess, cr as $ZodCheckSizeEquals, ct as $ZodCIDRv4, dn as $ZodTransform, dr as $ZodCheckUpperCase, dt as $ZodCUID2, ei as $brand, en as $ZodPrefault, er as $ZodCheckMinLength, et as registry, fn as $ZodTuple, ft as $ZodCatch, gi as isPlainObject, gn as $ZodUUID, gt as $ZodCustomStringFormat, hn as $ZodURL, ht as $ZodCustom, ii as globalConfig, in as $ZodRecord, ir as $ZodCheckOverwrite, it as $ZodBase64URL, jn as isValidIBAN, jr as decode, jt as $ZodISODate, kn as isValidCIDRv6, kr as _safeParse, kt as $ZodIPv4, ln as $ZodSymbol, lr as $ZodCheckStartsWith, lt as $ZodCIDRv6, mn as $ZodULID, mt as $ZodCreditCard, n as allProcessors, ni as NEVER, nn as $ZodPromise, nr as $ZodCheckMultipleOf, nt as $ZodArray, oi as assignProp, on as $ZodString, or as $ZodCheckProperty, ot as $ZodBigIntFormat, pn as $ZodType, pt as $ZodCodec, q as handleUnrepresentable, qn as $ZodCheckIncludes, qr as flattenError, qt as $ZodNullable, ri as config, rn as $ZodReadonly, rr as $ZodCheckNumberFormat, rt as $ZodBase64, si as clone, sn as $ZodStringFormat, sr as $ZodCheckRegex, st as $ZodBoolean, ti as $constructor, tn as $ZodPreprocess, tr as $ZodCheckMinSize, tt as $ZodAny, un as $ZodTemplateLiteral, ur as $ZodCheckStringFormat, ut as $ZodCUID, vi as joinValues, vn as $ZodUnion, vr as regexes_exports, vt as $ZodDefault, wn as base64urlCharset, wr as _parseAsync, wt as $ZodExactOptional, xi as mergeDefs, xn as $ZodXID, xr as _encode, xt as $ZodEmail, yn as $ZodUnknown, yr as _decode, yt as $ZodDiscriminatedUnion, zn as urlProtocolOk, zr as safeEncode, zt as $ZodLiteral } from "./json-schema-processors-C6KO_BFy.mjs";
import { $ as ZodPipe, $i as _promise, $n as symbol, $r as _email, $t as exactOptional, A as ZodIPv6, Aa as _uuid, Ai as _map, An as never, Ar as _any, At as _undefined$1, B as ZodLiteral, Ba as $ZodCyclicError, Bi as _negative, Bn as preprocess, Br as _coercedBigint, Bt as cidrv6, C as ZodEnum, Ca as _uint64, Ci as _lazy, Cn as looseRecord, Cr as safeEncode$1, Ct as _ZodString, D as ZodGUID, Da as _unknown, Di as _lt, Dn as nan, Dr as ZodError, Dt as _function, E as ZodFunction, Ea as _union, Ei as _lowercase, En as meta$1, Er as safeParseAsync$1, Et as _enum$1, F as ZodInstanceOf, Fa as _xid, Fi as _minSize, Fn as object, Fr as _boolean, Ft as base64url, G as ZodNever, Gi as _normalize, Gn as schemas_exports, Gr as _creditCard, Gt as currencyCode, H as ZodMap, Ha as isRecursiveSchema, Hi as _nonnegative, Hn as readonly, Hr as _coercedDate, Ht as creditCard, I as ZodIntersection, Ia as _xor, Ii as _multipleOf, In as optional, Ir as _catch, It as bigint, J as ZodNullable, Ji as _number, Jn as string, Jr as _custom, Jt as describe$1, K as ZodNonOptional, Ki as _null, Kn as set, Kr as _cuid, Kt as custom, L as ZodJWT, La as describe, Li as _nan, Ln as partialRecord, Lr as _check, Lt as boolean, M as ZodISODateTime, Ma as _uuidv6, Mi as _maxSize, Mn as nullable, Mr as _base64, Mt as any, N as ZodISODuration, Na as _uuidv7, Ni as _mime, Nn as nullish, Nr as _base64url, Nt as array, O as ZodIBAN, Oa as _uppercase, Oi as _lte, On as nanoid, Or as ZodRealError, Ot as _instanceof, P as ZodISOTime, Pa as _void, Pi as _minLength, Pn as number, Pr as _bigint, Pt as base64, Q as ZodOptional, Qi as _positive, Qn as superRefine, Qr as _e164, Qt as emoji, R as ZodKSUID, Ra as meta, Ri as _nanoid, Rn as pipe, Rr as _cidrv4, Rt as check, S as ZodEmoji, Sa as _uint32, Si as _ksuid, Sn as looseObject, Sr as safeDecodeAsync$1, St as ZodXor, T as ZodFile, Ta as _undefined, Ti as _literal, Tn as map, Tr as safeParse$1, Tt as _default$1, U as ZodNaN, Ua as memoizer, Ui as _nonoptional, Un as record, Ur as _coercedNumber, Ut as cuid, V as ZodMAC, Va as isBackEdge, Vi as _never, Vn as promise, Vr as _coercedBoolean, Vt as codec, W as ZodNanoID, Wi as _nonpositive, Wn as refine, Wr as _coercedString, Wt as cuid2, X as ZodNumberFormat, Xi as _overwrite, Xn as stringbool, Xr as _default, Xt as e164, Y as ZodNumber, Yi as _optional, Yn as stringFormat, Yr as _date, Yt as discriminatedUnion, Z as ZodObject, Zi as _pipe, Zn as success, Zr as _discriminatedUnion, Zt as email, _ as ZodDate, _a as _toLowerCase, _i as _isoDate, _n as jwt, _r as encode$1, _t as ZodUndefined, a as ZodBigInt, aa as _regex, ai as _float64, an as hex, ar as ulid, at as ZodSet, b as ZodE164, ba as _trim, bi as _isoTime, bn as lazy, br as parseAsync$1, bt as ZodVoid, c as ZodCIDRv4, ca as _slugify, ci as _guid, cn as iban, cr as url, ct as ZodSuccess, d as ZodCUID2, da as _stringFormat, di as _int, dn as int64, dr as uuidv6, dt as ZodTransform, ea as _properties, ei as _emoji, en as file, er as templateLiteral, et as ZodPrefault, f as ZodCatch, fa as _stringbool, fi as _int32, fn as intersection, fr as uuidv7, ft as ZodTuple, g as ZodCustomStringFormat, ga as _templateLiteral, gi as _ipv6, gn as json, gr as decodeAsync$1, gt as ZodUUID, h as ZodCustom, ha as _symbol, hi as _ipv4, hn as ipv6, hr as decode$1, ht as ZodURL, i as ZodBase64URL, ia as _refine, ii as _float32, in as hash, ir as uint64, it as ZodRecord, j as ZodISODate, ja as _uuidv4, ji as _maxLength, jn as nonoptional, jr as _array, jt as _void$1, k as ZodIPv4, ka as _url, ki as _mac, kn as nativeEnum, kr as TimePrecision, kt as _null$1, l as ZodCIDRv6, la as _startsWith, li as _iban, ln as int, lr as uuid, lt as ZodSymbol, m as ZodCreditCard, ma as _superRefine, mi as _intersection, mn as ipv4, mr as xor, mt as ZodULID, n as ZodArray, na as _readonly, ni as _enum, nn as float64, nr as tuple, nt as ZodPromise, o as ZodBigIntFormat, oa as _set, oi as _gt, on as hostname, or as union, ot as ZodString, p as ZodCodec, pa as _success, pi as _int64, pn as invertCodec, pr as xid, pt as ZodType, q as ZodNull, qi as _nullable, qn as strictObject, qr as _cuid2, qt as date$1, r as ZodBase64, ra as _record, ri as _file, rn as guid, rr as uint32, rt as ZodReadonly, s as ZodBoolean, sa as _size, si as _gte, sn as httpUrl, sr as unknown, st as ZodStringFormat, t as ZodAny, ta as _property, ti as _endsWith, tn as float32, tr as transform, tt as ZodPreprocess, u as ZodCUID, ua as _string, ui as _includes, un as int32, ur as uuidv4, ut as ZodTemplateLiteral, v as ZodDefault, va as _toUpperCase, vi as _isoDateTime, vn as keyof, vr as encodeAsync$1, vt as ZodUnion, w as ZodExactOptional, wa as _ulid, wi as _length, wn as mac, wr as safeEncodeAsync$1, wt as _catch$1, x as ZodEmail, xa as _tuple, xi as _jwt, xn as literal, xr as safeDecode$1, xt as ZodXID, y as ZodDiscriminatedUnion, ya as _transform, yi as _isoDuration, yn as ksuid, yr as parse$1, yt as ZodUnknown, z as ZodLazy, za as en_default, zi as _nativeEnum, zn as prefault, zr as _cidrv6, zt as cidrv4 } from "./schemas-BOYIvvln.mjs";
import { a as compileFn, i as compile, n as ZodCompileAsyncError, o as withParser, r as ZodCompileUnsupportedError, t as INVALID } from "./compile-wI2qQAAF.mjs";
import { i as setErrorMap, n as ZodIssueCode, r as getErrorMap, t as ZodFirstPartyTypeKind } from "./compat-CVCDeluo.mjs";
import { t as coerce_exports } from "./coerce-D2Vs59dx.mjs";
import "./plugin-entry-BOulgRcx.mjs";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ar.js
const error$59 = () => {
	const Sizable = {
		string: {
			unit: "حرف",
			verb: "أن يحوي"
		},
		file: {
			unit: "بايت",
			verb: "أن يحوي"
		},
		array: {
			unit: "عنصر",
			verb: "أن يحوي"
		},
		set: {
			unit: "عنصر",
			verb: "أن يحوي"
		},
		map: {
			unit: "عنصر",
			verb: "أن يحوي"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "مدخل",
		email: "بريد إلكتروني",
		url: "رابط",
		emoji: "إيموجي",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "تاريخ ووقت بمعيار ISO",
		date: "تاريخ بمعيار ISO",
		time: "وقت بمعيار ISO",
		duration: "مدة بمعيار ISO",
		ipv4: "عنوان IPv4",
		ipv6: "عنوان IPv6",
		mac: "عنوان MAC",
		cidrv4: "مدى عناوين بصيغة IPv4",
		cidrv6: "مدى عناوين بصيغة IPv6",
		base64: "نَص بترميز base64-encoded",
		base64url: "نَص بترميز base64url-encoded",
		json_string: "نَص على هيئة JSON",
		e164: "رقم هاتف بمعيار E.164",
		credit_card: "رقم بطاقة الائتمان",
		currency_code: "رمز العملة",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "مدخل"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `مدخلات غير مقبولة: يفترض إدخال instanceof ${issue.expected}، ولكن تم إدخال ${received}`;
				return `مدخلات غير مقبولة: يفترض إدخال ${expected}، ولكن تم إدخال ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue.values[0])}`;
				return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return ` أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
				return `أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
				if (_issue.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
				if (_issue.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
				if (_issue.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} غير مقبول`;
			}
			case "not_multiple_of": return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
			case "unrecognized_keys": return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${joinValues(issue.keys, "، ")}`;
			case "invalid_key": return `معرف غير مقبول في ${issue.origin}`;
			case "invalid_union": return "مدخل غير مقبول";
			case "invalid_element": return `مدخل غير مقبول في ${issue.origin}`;
			default: return "مدخل غير مقبول";
		}
	};
};
function ar_default() {
	return { localeError: error$59() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/az.js
const error$58 = () => {
	const Sizable = {
		string: {
			unit: "simvol",
			verb: "olmalıdır"
		},
		file: {
			unit: "bayt",
			verb: "olmalıdır"
		},
		array: {
			unit: "element",
			verb: "olmalıdır"
		},
		set: {
			unit: "element",
			verb: "olmalıdır"
		},
		map: {
			unit: "element",
			verb: "olmalıdır"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		credit_card: "kredit kartı nömrəsi",
		currency_code: "valyuta kodu",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Yanlış dəyər: gözlənilən instanceof ${issue.expected}, daxil olan ${received}`;
				return `Yanlış dəyər: gözlənilən ${expected}, daxil olan ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue.values[0])}`;
				return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
				return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
				if (_issue.format === "ends_with") return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
				if (_issue.format === "includes") return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
				if (_issue.format === "regex") return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
				return `Yanlış ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
			case "unrecognized_keys": return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} daxilində yanlış açar`;
			case "invalid_union": return "Yanlış dəyər";
			case "invalid_element": return `${issue.origin} daxilində yanlış dəyər`;
			default: return `Yanlış dəyər`;
		}
	};
};
function az_default() {
	return { localeError: error$58() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/be.js
function getBelarusianPlural(count, one, few, many) {
	const absCount = Math.abs(count);
	const lastDigit = absCount % 10;
	const lastTwoDigits = absCount % 100;
	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return many;
	if (lastDigit === 1) return one;
	if (lastDigit >= 2 && lastDigit <= 4) return few;
	return many;
}
const error$57 = () => {
	const Sizable = {
		string: {
			unit: {
				one: "сімвал",
				few: "сімвалы",
				many: "сімвалаў"
			},
			verb: "мець"
		},
		array: {
			unit: {
				one: "элемент",
				few: "элементы",
				many: "элементаў"
			},
			verb: "мець"
		},
		set: {
			unit: {
				one: "элемент",
				few: "элементы",
				many: "элементаў"
			},
			verb: "мець"
		},
		map: {
			unit: {
				one: "элемент",
				few: "элементы",
				many: "элементаў"
			},
			verb: "мець"
		},
		file: {
			unit: {
				one: "байт",
				few: "байты",
				many: "байтаў"
			},
			verb: "мець"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "увод",
		email: "email адрас",
		url: "URL",
		emoji: "эмодзі",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO дата і час",
		date: "ISO дата",
		time: "ISO час",
		duration: "ISO працягласць",
		ipv4: "IPv4 адрас",
		ipv6: "IPv6 адрас",
		mac: "MAC адрас",
		cidrv4: "IPv4 дыяпазон",
		cidrv6: "IPv6 дыяпазон",
		base64: "радок у фармаце base64",
		base64url: "радок у фармаце base64url",
		json_string: "JSON радок",
		e164: "нумар E.164",
		credit_card: "нумар крэдытнай карты",
		currency_code: "код валюты",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "увод"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "лік",
		array: "масіў"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Няправільны ўвод: чакаўся instanceof ${issue.expected}, атрымана ${received}`;
				return `Няправільны ўвод: чакаўся ${expected}, атрымана ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue.values[0])}`;
				return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getBelarusianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
					return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
				}
				return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getBelarusianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
					return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
				}
				return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
				if (_issue.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
				return `Няправільны ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
			case "unrecognized_keys": return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Няправільны ключ у ${issue.origin}`;
			case "invalid_union": return "Няправільны ўвод";
			case "invalid_element": return `Няправільнае значэнне ў ${issue.origin}`;
			default: return `Няправільны ўвод`;
		}
	};
};
function be_default() {
	return { localeError: error$57() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/bg.js
const error$56 = () => {
	const Sizable = {
		string: {
			unit: "символа",
			verb: "да съдържа"
		},
		file: {
			unit: "байта",
			verb: "да съдържа"
		},
		array: {
			unit: "елемента",
			verb: "да съдържа"
		},
		set: {
			unit: "елемента",
			verb: "да съдържа"
		},
		map: {
			unit: "елемента",
			verb: "да съдържа"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "вход",
		email: "имейл адрес",
		url: "URL",
		emoji: "емоджи",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO време",
		date: "ISO дата",
		time: "ISO време",
		duration: "ISO продължителност",
		ipv4: "IPv4 адрес",
		ipv6: "IPv6 адрес",
		mac: "MAC адрес",
		cidrv4: "IPv4 диапазон",
		cidrv6: "IPv6 диапазон",
		base64: "base64-кодиран низ",
		base64url: "base64url-кодиран низ",
		json_string: "JSON низ",
		e164: "E.164 номер",
		credit_card: "номер на кредитна карта",
		currency_code: "код на валута",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "вход"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "число",
		array: "масив"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Невалиден вход: очакван instanceof ${issue.expected}, получен ${received}`;
				return `Невалиден вход: очакван ${expected}, получен ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Невалиден вход: очакван ${stringifyPrimitive(issue.values[0])}`;
				return `Невалидна опция: очаквано едно от ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да съдържа ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елемента"}`;
				return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да бъде ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Твърде малко: очаква се ${issue.origin} да съдържа ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Твърде малко: очаква се ${issue.origin} да бъде ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Невалиден низ: трябва да включва "${_issue.includes}"`;
				if (_issue.format === "regex") return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
				let invalid_adj = "Невалиден";
				if (_issue.format === "emoji") invalid_adj = "Невалидно";
				if (_issue.format === "datetime") invalid_adj = "Невалидно";
				if (_issue.format === "date") invalid_adj = "Невалидна";
				if (_issue.format === "time") invalid_adj = "Невалидно";
				if (_issue.format === "duration") invalid_adj = "Невалидна";
				return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Невалидно число: трябва да бъде кратно на ${issue.divisor}`;
			case "unrecognized_keys": return `Неразпознат${issue.keys.length > 1 ? "и" : ""} ключ${issue.keys.length > 1 ? "ове" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Невалиден ключ в ${issue.origin}`;
			case "invalid_union": return "Невалиден вход";
			case "invalid_element": return `Невалидна стойност в ${issue.origin}`;
			default: return `Невалиден вход`;
		}
	};
};
function bg_default() {
	return { localeError: error$56() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/bn.js
const error$55 = () => {
	const Sizable = {
		string: {
			unit: "অক্ষর",
			verb: "থাকতে হবে"
		},
		file: {
			unit: "বাইট",
			verb: "থাকতে হবে"
		},
		array: {
			unit: "আইটেম",
			verb: "থাকতে হবে"
		},
		set: {
			unit: "আইটেম",
			verb: "থাকতে হবে"
		},
		map: {
			unit: "এন্ট্রি",
			verb: "থাকতে হবে"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ইনপুট",
		email: "ইমেইল ঠিকানা",
		url: "URL",
		emoji: "ইমোজি",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO তারিখ ও সময়",
		date: "ISO তারিখ",
		time: "ISO সময়",
		duration: "ISO সময়কাল",
		ipv4: "IPv4 ঠিকানা",
		ipv6: "IPv6 ঠিকানা",
		mac: "MAC ঠিকানা",
		cidrv4: "IPv4 রেঞ্জ",
		cidrv6: "IPv6 রেঞ্জ",
		base64: "base64-এনকোডেড স্ট্রিং",
		base64url: "base64url-এনকোডেড স্ট্রিং",
		json_string: "JSON স্ট্রিং",
		e164: "E.164 নম্বর",
		credit_card: "ক্রেডিট কার্ড নম্বর",
		currency_code: "মুদ্রা কোড",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ইনপুট"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `অবৈধ ইনপুট: প্রত্যাশিত ${expected}, প্রাপ্ত ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `অবৈধ ইনপুট: প্রত্যাশিত ${stringifyPrimitive(issue.values[0])}`;
				return `অবৈধ অপশন: ${joinValues(issue.values, " | ")} এর মধ্যে একটি প্রত্যাশিত`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `অনেক বড়: ${issue.origin ?? "মান"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "এলিমেন্ট"} হতে হবে`;
				return `অনেক বড়: ${issue.origin ?? "মান"} ${adj}${issue.maximum.toString()} হতে হবে`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `অনেক ছোট: ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} হতে হবে`;
				return `অনেক ছোট: ${issue.origin} ${adj}${issue.minimum.toString()} হতে হবে`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `অবৈধ স্ট্রিং: "${_issue.prefix}" দিয়ে শুরু হতে হবে`;
				if (_issue.format === "ends_with") return `অবৈধ স্ট্রিং: "${_issue.suffix}" দিয়ে শেষ হতে হবে`;
				if (_issue.format === "includes") return `অবৈধ স্ট্রিং: "${_issue.includes}" অন্তর্ভুক্ত থাকতে হবে`;
				if (_issue.format === "regex") return `অবৈধ স্ট্রিং: ${_issue.pattern} প্যাটার্ন মিলতে হবে`;
				return `অবৈধ ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `অবৈধ নম্বর: ${issue.divisor} এর গুণিতক হতে হবে`;
			case "unrecognized_keys": return `অচেনা কী${issue.keys.length > 1 ? "গুলো" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} এ অবৈধ কী`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `অবৈধ ডিসক্রিমিনেটর মান। প্রত্যাশিত ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "অবৈধ ইনপুট";
			case "invalid_element": return `${issue.origin} এ অবৈধ মান`;
			default: return "অবৈধ ইনপুট";
		}
	};
};
function bn_default() {
	return { localeError: error$55() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ca.js
const error$54 = () => {
	const Sizable = {
		string: {
			unit: "caràcters",
			verb: "contenir"
		},
		file: {
			unit: "bytes",
			verb: "contenir"
		},
		array: {
			unit: "elements",
			verb: "contenir"
		},
		set: {
			unit: "elements",
			verb: "contenir"
		},
		map: {
			unit: "elements",
			verb: "contenir"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "entrada",
		email: "adreça electrònica",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "data i hora ISO",
		date: "data ISO",
		time: "hora ISO",
		duration: "durada ISO",
		ipv4: "adreça IPv4",
		ipv6: "adreça IPv6",
		mac: "adreça MAC",
		cidrv4: "rang IPv4",
		cidrv6: "rang IPv6",
		base64: "cadena codificada en base64",
		base64url: "cadena codificada en base64url",
		json_string: "cadena JSON",
		e164: "número E.164",
		credit_card: "número de targeta de crèdit",
		currency_code: "codi de moneda",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "entrada"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Tipus invàlid: s'esperava instanceof ${issue.expected}, s'ha rebut ${received}`;
				return `Tipus invàlid: s'esperava ${expected}, s'ha rebut ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Valor invàlid: s'esperava ${stringifyPrimitive(issue.values[0])}`;
				return `Opció invàlida: s'esperava una de ${joinValues(issue.values, " o ")}`;
			case "too_big": {
				const adj = issue.inclusive ? "com a màxim" : "menys de";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingués ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? "com a mínim" : "més de";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Format invàlid: ha d'incloure "${_issue.includes}"`;
				if (_issue.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
				return `Format invàlid per a ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
			case "unrecognized_keys": return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Clau invàlida a ${issue.origin}`;
			case "invalid_union": return "Entrada invàlida";
			case "invalid_element": return `Element invàlid a ${issue.origin}`;
			default: return `Entrada invàlida`;
		}
	};
};
function ca_default() {
	return { localeError: error$54() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ckb.js
const error$53 = () => {
	const Sizable = {
		string: {
			unit: "پیت",
			verb: "بێت"
		},
		file: {
			unit: "بایت",
			verb: "بێت"
		},
		array: {
			unit: "دانە",
			verb: "بێت"
		},
		set: {
			unit: "دانە",
			verb: "بێت"
		},
		map: {
			unit: "دانە",
			verb: "بێت"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "regex",
		email: "ئیمەیڵ",
		url: "بەستەر (URL)",
		emoji: "ئیمۆجی",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ڕێکەوت و کات",
		date: "ڕێکەوت",
		time: "کات",
		duration: "ماوە",
		ipv4: "ناونیشانی IPv4",
		ipv6: "ناونیشانی IPv6",
		mac: "ناونیشانی MAC",
		cidrv4: "مەودای IPv4",
		cidrv6: "مەودای IPv6",
		base64: "دەقی base64",
		base64url: "دەقی base64url",
		json_string: "دەقی JSON",
		e164: "ژمارەی E.164",
		credit_card: "ژمارەی کارتی کرێدیت",
		currency_code: "کۆدی دراو",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "تێکردە"
	};
	const TypeDictionary = {
		nan: "NaN",
		string: "نووسین",
		number: "ژمارە",
		boolean: "boolean",
		array: "array",
		object: "object",
		date: "ڕێکەوت",
		integer: "ژمارە",
		float: "ژمارە",
		null: "null",
		undefined: "undefined",
		function: "function",
		symbol: "symbol",
		unknown: "unknown",
		promise: "promise",
		void: "void",
		never: "never",
		map: "map",
		set: "set"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				const postfix = [
					"ا",
					"و",
					"ۆ",
					"وو",
					"ە",
					"ی",
					"ێ"
				].some((p) => received.endsWith(p)) ? "یە" : "ە";
				const isEnglish = /^[a-zA-Z]+$/.test(received);
				if (receivedType === "null" || receivedType === "undefined") return `داواکراوە`;
				return `چاوەڕوانکراوە ${expected} بێت، بەڵام ${received}${isEnglish ? "" : postfix}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `بەهاکە نادرووستە: چاوەڕوانکراوە ${stringifyPrimitive(issue.values[0])} بێت`;
				return `هەڵبژاردەی نادروست: چاوەڕوانکراوە یەکێک بێت لە ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const sizing = getSizing(issue.origin);
				if (sizing) return `پێویستە بە لایەنی زۆرەوە ${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `پێویستە بە لایەنی زۆرەوە ${issue.maximum.toString()} بێت`;
			}
			case "too_small": {
				const sizing = getSizing(issue.origin);
				if (sizing) return `پێویستە بە لایەنی کەمەوە ${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `پێویستە بە لایەنی کەمەوە ${issue.minimum.toString()} بێت`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `دەقی نادروست: پێویستە دەستپێبکات بە "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `دەقی نادروست: پێویستە کۆتاییبێت بە "${_issue.suffix}"`;
				if (_issue.format === "includes") return `دەقی نادروست: پێویستە "${_issue.includes}" لەخۆبگرێت`;
				if (_issue.format === "regex") return `دەقی نادروست: پێویستە لەگەڵ پاتێرنی ${_issue.pattern} بگونجێت`;
				return `بەهای ${FormatDictionary[_issue.format] ?? issue.format} نادروستە`;
			}
			case "not_multiple_of": return `ژمارەی نادروست: دەبێت چەند هێندە بێت بۆ ${issue.divisor}`;
			case "unrecognized_keys": return `کلیلی نەناسراو: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `کلیلی نادروست لە ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `بەهای نەناسراو هەیە. بەهای چاوەڕوانکراو: ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "یەکگرتنی نادروست";
			case "invalid_element": return `${issue.origin} بەهاکە نادروستە`;
			default: return `تێکردەی نادروست`;
		}
	};
};
function ckb_default() {
	return { localeError: error$53() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/cs.js
const error$52 = () => {
	const Sizable = {
		string: {
			unit: "znaků",
			verb: "mít"
		},
		file: {
			unit: "bajtů",
			verb: "mít"
		},
		array: {
			unit: "prvků",
			verb: "mít"
		},
		set: {
			unit: "prvků",
			verb: "mít"
		},
		map: {
			unit: "prvků",
			verb: "mít"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "regulární výraz",
		email: "e-mailová adresa",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "datum a čas ve formátu ISO",
		date: "datum ve formátu ISO",
		time: "čas ve formátu ISO",
		duration: "doba trvání ISO",
		ipv4: "IPv4 adresa",
		ipv6: "IPv6 adresa",
		mac: "MAC adresa",
		cidrv4: "rozsah IPv4",
		cidrv6: "rozsah IPv6",
		base64: "řetězec zakódovaný ve formátu base64",
		base64url: "řetězec zakódovaný ve formátu base64url",
		json_string: "řetězec ve formátu JSON",
		e164: "číslo E.164",
		credit_card: "číslo kreditní karty",
		currency_code: "kód měny",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "vstup"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "číslo",
		string: "řetězec",
		function: "funkce",
		array: "pole"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Neplatný vstup: očekáváno instanceof ${issue.expected}, obdrženo ${received}`;
				return `Neplatný vstup: očekáváno ${expected}, obdrženo ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue.values[0])}`;
				return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvků"}`;
				return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvků"}`;
				return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
				if (_issue.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
				return `Neplatný formát ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
			case "unrecognized_keys": return `Neznámé klíče: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Neplatný klíč v ${issue.origin}`;
			case "invalid_union": return "Neplatný vstup";
			case "invalid_element": return `Neplatná hodnota v ${issue.origin}`;
			default: return `Neplatný vstup`;
		}
	};
};
function cs_default() {
	return { localeError: error$52() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/da.js
const error$51 = () => {
	const Sizable = {
		string: {
			unit: "tegn",
			verb: "havde"
		},
		file: {
			unit: "bytes",
			verb: "havde"
		},
		array: {
			unit: "elementer",
			verb: "indeholdt"
		},
		set: {
			unit: "elementer",
			verb: "indeholdt"
		},
		map: {
			unit: "elementer",
			verb: "indeholdt"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "e-mailadresse",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO dato- og klokkeslæt",
		date: "ISO-dato",
		time: "ISO-klokkeslæt",
		duration: "ISO-varighed",
		ipv4: "IPv4-adresse",
		ipv6: "IPv6-adresse",
		mac: "MAC-adresse",
		cidrv4: "IPv4-spektrum",
		cidrv6: "IPv6-spektrum",
		base64: "base64-kodet streng",
		base64url: "base64url-kodet streng",
		json_string: "JSON-streng",
		e164: "E.164-nummer",
		credit_card: "kreditkortnummer",
		currency_code: "valutakode",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		string: "streng",
		number: "tal",
		boolean: "boolean",
		array: "liste",
		object: "objekt",
		set: "sæt",
		file: "fil"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ugyldigt input: forventede instanceof ${issue.expected}, fik ${received}`;
				return `Ugyldigt input: forventede ${expected}, fik ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ugyldig værdi: forventede ${stringifyPrimitive(issue.values[0])}`;
				return `Ugyldigt valg: forventede en af følgende ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
				return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `For lille: forventede ${origin} havde ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
				return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ugyldigt tal: skal være deleligt med ${issue.divisor}`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ugyldig nøgle i ${issue.origin}`;
			case "invalid_union": return "Ugyldigt input: matcher ingen af de tilladte typer";
			case "invalid_element": return `Ugyldig værdi i ${issue.origin}`;
			default: return `Ugyldigt input`;
		}
	};
};
function da_default() {
	return { localeError: error$51() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/de.js
const error$50 = () => {
	const Sizable = {
		string: {
			unit: "Zeichen",
			verb: "zu haben"
		},
		file: {
			unit: "Bytes",
			verb: "zu haben"
		},
		array: {
			unit: "Elemente",
			verb: "zu haben"
		},
		set: {
			unit: "Elemente",
			verb: "zu haben"
		},
		map: {
			unit: "Elemente",
			verb: "zu haben"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "Eingabe",
		email: "E-Mail-Adresse",
		url: "URL",
		emoji: "Emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO-Datum und -Uhrzeit",
		date: "ISO-Datum",
		time: "ISO-Uhrzeit",
		duration: "ISO-Dauer",
		ipv4: "IPv4-Adresse",
		ipv6: "IPv6-Adresse",
		mac: "MAC-Adresse",
		cidrv4: "IPv4-Bereich",
		cidrv6: "IPv6-Bereich",
		base64: "Base64-codierter String",
		base64url: "Base64-URL-codierter String",
		json_string: "JSON-String",
		e164: "E.164-Nummer",
		credit_card: "Kreditkartennummer",
		currency_code: "Währungscode",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "Eingabe"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "Zahl",
		array: "Array"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ungültige Eingabe: erwartet instanceof ${issue.expected}, erhalten ${received}`;
				return `Ungültige Eingabe: erwartet ${expected}, erhalten ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue.values[0])}`;
				return `Ungültige Option: erwartet eine von ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
				return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
				return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
				if (_issue.format === "ends_with") return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
				if (_issue.format === "includes") return `Ungültiger String: muss "${_issue.includes}" enthalten`;
				if (_issue.format === "regex") return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
				return `Ungültig: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ungültiger Schlüssel in ${issue.origin}`;
			case "invalid_union": return "Ungültige Eingabe";
			case "invalid_element": return `Ungültiger Wert in ${issue.origin}`;
			default: return `Ungültige Eingabe`;
		}
	};
};
function de_default() {
	return { localeError: error$50() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/el.js
const error$49 = () => {
	const Sizable = {
		string: {
			unit: "χαρακτήρες",
			verb: "να έχει"
		},
		file: {
			unit: "bytes",
			verb: "να έχει"
		},
		array: {
			unit: "στοιχεία",
			verb: "να έχει"
		},
		set: {
			unit: "στοιχεία",
			verb: "να έχει"
		},
		map: {
			unit: "καταχωρήσεις",
			verb: "να έχει"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "είσοδος",
		email: "διεύθυνση email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO ημερομηνία και ώρα",
		date: "ISO ημερομηνία",
		time: "ISO ώρα",
		duration: "ISO διάρκεια",
		ipv4: "διεύθυνση IPv4",
		ipv6: "διεύθυνση IPv6",
		mac: "διεύθυνση MAC",
		cidrv4: "εύρος IPv4",
		cidrv6: "εύρος IPv6",
		base64: "συμβολοσειρά κωδικοποιημένη σε base64",
		base64url: "συμβολοσειρά κωδικοποιημένη σε base64url",
		json_string: "συμβολοσειρά JSON",
		e164: "αριθμός E.164",
		credit_card: "αριθμός πιστωτικής κάρτας",
		currency_code: "κωδικός νομίσματος",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "είσοδος"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (typeof issue.expected === "string" && /^[A-Z]/.test(issue.expected)) return `Μη έγκυρη είσοδος: αναμενόταν instanceof ${issue.expected}, λήφθηκε ${received}`;
				return `Μη έγκυρη είσοδος: αναμενόταν ${expected}, λήφθηκε ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Μη έγκυρη είσοδος: αναμενόταν ${stringifyPrimitive(issue.values[0])}`;
				return `Μη έγκυρη επιλογή: αναμενόταν ένα από ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Πολύ μεγάλο: αναμενόταν ${issue.origin ?? "τιμή"} να έχει ${adj}${issue.maximum.toString()} ${sizing.unit ?? "στοιχεία"}`;
				return `Πολύ μεγάλο: αναμενόταν ${issue.origin ?? "τιμή"} να είναι ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Πολύ μικρό: αναμενόταν ${issue.origin} να έχει ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Πολύ μικρό: αναμενόταν ${issue.origin} να είναι ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${_issue.includes}"`;
				if (_issue.format === "regex") return `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${_issue.pattern}`;
				return `Μη έγκυρο: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${issue.divisor}`;
			case "unrecognized_keys": return `Άγνωστ${issue.keys.length > 1 ? "α" : "ο"} κλειδ${issue.keys.length > 1 ? "ιά" : "ί"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Μη έγκυρο κλειδί στο ${issue.origin}`;
			case "invalid_union": return "Μη έγκυρη είσοδος";
			case "invalid_element": return `Μη έγκυρη τιμή στο ${issue.origin}`;
			default: return `Μη έγκυρη είσοδος`;
		}
	};
};
function el_default() {
	return { localeError: error$49() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/eo.js
const error$48 = () => {
	const Sizable = {
		string: {
			unit: "karaktrojn",
			verb: "havi"
		},
		file: {
			unit: "bajtojn",
			verb: "havi"
		},
		array: {
			unit: "elementojn",
			verb: "havi"
		},
		set: {
			unit: "elementojn",
			verb: "havi"
		},
		map: {
			unit: "elementojn",
			verb: "havi"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "enigo",
		email: "retadreso",
		url: "URL",
		emoji: "emoĝio",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO-datotempo",
		date: "ISO-dato",
		time: "ISO-tempo",
		duration: "ISO-daŭro",
		ipv4: "IPv4-adreso",
		ipv6: "IPv6-adreso",
		mac: "MAC-adreso",
		cidrv4: "IPv4-rango",
		cidrv6: "IPv6-rango",
		base64: "64-ume kodita karaktraro",
		base64url: "URL-64-ume kodita karaktraro",
		json_string: "JSON-karaktraro",
		e164: "E.164-nombro",
		credit_card: "kreditkarta numero",
		currency_code: "valuta kodo",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "enigo"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "nombro",
		array: "tabelo",
		null: "senvalora"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Nevalida enigo: atendiĝis instanceof ${issue.expected}, riceviĝis ${received}`;
				return `Nevalida enigo: atendiĝis ${expected}, riceviĝis ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue.values[0])}`;
				return `Nevalida opcio: atendiĝis unu el ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
				return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Tro malgranda: atendiĝis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Tro malgranda: atendiĝis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
				if (_issue.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
				return `Nevalida ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
			case "unrecognized_keys": return `Nekonata${issue.keys.length > 1 ? "j" : ""} ŝlosilo${issue.keys.length > 1 ? "j" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Nevalida ŝlosilo en ${issue.origin}`;
			case "invalid_union": return "Nevalida enigo";
			case "invalid_element": return `Nevalida valoro en ${issue.origin}`;
			default: return `Nevalida enigo`;
		}
	};
};
function eo_default() {
	return { localeError: error$48() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/es.js
const error$47 = () => {
	const Sizable = {
		string: {
			unit: "caracteres",
			verb: "tener"
		},
		file: {
			unit: "bytes",
			verb: "tener"
		},
		array: {
			unit: "elementos",
			verb: "tener"
		},
		set: {
			unit: "elementos",
			verb: "tener"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "entrada",
		email: "dirección de correo electrónico",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "fecha y hora ISO",
		date: "fecha ISO",
		time: "hora ISO",
		duration: "duración ISO",
		ipv4: "dirección IPv4",
		ipv6: "dirección IPv6",
		mac: "dirección MAC",
		cidrv4: "rango IPv4",
		cidrv6: "rango IPv6",
		base64: "cadena codificada en base64",
		base64url: "URL codificada en base64",
		json_string: "cadena JSON",
		e164: "número E.164",
		credit_card: "número de tarjeta de crédito",
		currency_code: "código de moneda",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "entrada"
	};
	const TypeDictionary = {
		nan: "NaN",
		string: "texto",
		number: "número",
		boolean: "booleano",
		array: "arreglo",
		object: "objeto",
		set: "conjunto",
		file: "archivo",
		date: "fecha",
		bigint: "número grande",
		symbol: "símbolo",
		undefined: "indefinido",
		null: "nulo",
		function: "función",
		map: "mapa",
		record: "registro",
		tuple: "tupla",
		enum: "enumeración",
		union: "unión",
		literal: "literal",
		promise: "promesa",
		void: "vacío",
		never: "nunca",
		unknown: "desconocido",
		any: "cualquiera"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Entrada inválida: se esperaba instanceof ${issue.expected}, recibido ${received}`;
				return `Entrada inválida: se esperaba ${expected}, recibido ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Entrada inválida: se esperaba ${stringifyPrimitive(issue.values[0])}`;
				return `Opción inválida: se esperaba una de ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
				return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Cadena inválida: debe incluir "${_issue.includes}"`;
				if (_issue.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
				return `Inválido ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
			case "unrecognized_keys": return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Llave inválida en ${TypeDictionary[issue.origin] ?? issue.origin}`;
			case "invalid_union": return "Entrada inválida";
			case "invalid_element": return `Valor inválido en ${TypeDictionary[issue.origin] ?? issue.origin}`;
			default: return `Entrada inválida`;
		}
	};
};
function es_default() {
	return { localeError: error$47() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/fa.js
const error$46 = () => {
	const Sizable = {
		string: {
			unit: "کاراکتر",
			verb: "داشته باشد"
		},
		file: {
			unit: "بایت",
			verb: "داشته باشد"
		},
		array: {
			unit: "آیتم",
			verb: "داشته باشد"
		},
		set: {
			unit: "آیتم",
			verb: "داشته باشد"
		},
		map: {
			unit: "آیتم",
			verb: "داشته باشد"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ورودی",
		email: "آدرس ایمیل",
		url: "URL",
		emoji: "ایموجی",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "تاریخ و زمان ایزو",
		date: "تاریخ ایزو",
		time: "زمان ایزو",
		duration: "مدت زمان ایزو",
		ipv4: "IPv4 آدرس",
		ipv6: "IPv6 آدرس",
		mac: "MAC آدرس",
		cidrv4: "IPv4 دامنه",
		cidrv6: "IPv6 دامنه",
		base64: "base64-encoded رشته",
		base64url: "base64url-encoded رشته",
		json_string: "JSON رشته",
		e164: "E.164 عدد",
		credit_card: "شماره کارت اعتباری",
		currency_code: "کد ارز",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ورودی"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "عدد",
		array: "آرایه"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `ورودی نامعتبر: می‌بایست instanceof ${issue.expected} می‌بود، ${received} دریافت شد`;
				return `ورودی نامعتبر: می‌بایست ${expected} می‌بود، ${received} دریافت شد`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue.values[0])} می‌بود`;
				return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue.values, "|")} می‌بود`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
				return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
				return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
				if (_issue.format === "ends_with") return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
				if (_issue.format === "includes") return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
				if (_issue.format === "regex") return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
				return `${FormatDictionary[_issue.format] ?? issue.format} نامعتبر`;
			}
			case "not_multiple_of": return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
			case "unrecognized_keys": return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `کلید ناشناس در ${issue.origin}`;
			case "invalid_union": return `ورودی نامعتبر`;
			case "invalid_element": return `مقدار نامعتبر در ${issue.origin}`;
			default: return `ورودی نامعتبر`;
		}
	};
};
function fa_default() {
	return { localeError: error$46() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/fi.js
const error$45 = () => {
	const Sizable = {
		string: {
			unit: "merkkiä",
			subject: "merkkijonon"
		},
		file: {
			unit: "tavua",
			subject: "tiedoston"
		},
		array: {
			unit: "alkiota",
			subject: "listan"
		},
		set: {
			unit: "alkiota",
			subject: "joukon"
		},
		map: {
			unit: "alkiota",
			subject: "kuvauksen"
		},
		number: {
			unit: "",
			subject: "luvun"
		},
		bigint: {
			unit: "",
			subject: "suuren kokonaisluvun"
		},
		int: {
			unit: "",
			subject: "kokonaisluvun"
		},
		date: {
			unit: "",
			subject: "päivämäärän"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "säännöllinen lauseke",
		email: "sähköpostiosoite",
		url: "URL-osoite",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO-aikaleima",
		date: "ISO-päivämäärä",
		time: "ISO-aika",
		duration: "ISO-kesto",
		ipv4: "IPv4-osoite",
		ipv6: "IPv6-osoite",
		mac: "MAC-osoite",
		cidrv4: "IPv4-alue",
		cidrv6: "IPv6-alue",
		base64: "base64-koodattu merkkijono",
		base64url: "base64url-koodattu merkkijono",
		json_string: "JSON-merkkijono",
		e164: "E.164-luku",
		credit_card: "luottokortin numero",
		currency_code: "valuuttakoodi",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "templaattimerkkijono"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Virheellinen tyyppi: odotettiin instanceof ${issue.expected}, oli ${received}`;
				return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue.values[0])}`;
				return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
				return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
				return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
				if (_issue.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
				return `Virheellinen ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return "Virheellinen avain tietueessa";
			case "invalid_union": return "Virheellinen unioni";
			case "invalid_element": return "Virheellinen arvo joukossa";
			default: return `Virheellinen syöte`;
		}
	};
};
function fi_default() {
	return { localeError: error$45() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/fr.js
const error$44 = () => {
	const Sizable = {
		string: {
			unit: "caractères",
			verb: "avoir"
		},
		file: {
			unit: "octets",
			verb: "avoir"
		},
		array: {
			unit: "éléments",
			verb: "avoir"
		},
		set: {
			unit: "éléments",
			verb: "avoir"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "expression régulière",
		email: "adresse e-mail",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "date et heure ISO",
		date: "date ISO",
		time: "heure ISO",
		duration: "durée ISO",
		ipv4: "adresse IPv4",
		ipv6: "adresse IPv6",
		mac: "adresse MAC",
		cidrv4: "plage IPv4",
		cidrv6: "plage IPv6",
		base64: "chaîne de caractères encodée en base64",
		base64url: "chaîne de caractères encodée en base64url",
		json_string: "chaîne de caractères JSON",
		e164: "numéro au format E.164",
		credit_card: "numéro de carte de crédit",
		currency_code: "code de devise",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "entrée"
	};
	const TypeDictionary = {
		string: "chaîne de caractères",
		number: "nombre",
		int: "entier",
		boolean: "booléen",
		bigint: "grand entier",
		symbol: "symbole",
		undefined: "indéfini",
		null: "null",
		never: "jamais",
		void: "vide",
		date: "date",
		array: "tableau",
		object: "objet",
		tuple: "tuple",
		record: "record",
		map: "map",
		set: "ensemble",
		file: "fichier",
		nonoptional: "non optionnel",
		nan: "NaN",
		function: "fonction"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Entrée invalide : instance de ${issue.expected} attendu, ${received} reçu`;
				return `Entrée invalide : ${expected} attendu, ${received} reçu`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Entrée invalide : ${stringifyPrimitive(issue.values[0])} attendu`;
				return `Option invalide : une valeur parmi ${joinValues(issue.values, "|")} attendue`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
				return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit être ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit être ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Chaîne de caractères invalide : doit commencer par "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Chaîne de caractères invalide : doit se terminer par "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Chaîne de caractères invalide : doit inclure "${_issue.includes}"`;
				if (_issue.format === "regex") return `Chaîne de caractères invalide : doit correspondre au motif ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
			}
			case "not_multiple_of": return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
			case "unrecognized_keys": return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Clé invalide dans ${issue.origin}`;
			case "invalid_union": return "Entrée invalide";
			case "invalid_element": return `Valeur invalide dans ${issue.origin}`;
			default: return `Entrée invalide`;
		}
	};
};
function fr_default() {
	return { localeError: error$44() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/fr-CA.js
const error$43 = () => {
	const Sizable = {
		string: {
			unit: "caractères",
			verb: "avoir"
		},
		file: {
			unit: "octets",
			verb: "avoir"
		},
		array: {
			unit: "éléments",
			verb: "avoir"
		},
		set: {
			unit: "éléments",
			verb: "avoir"
		},
		map: {
			unit: "éléments",
			verb: "avoir"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "entrée",
		email: "adresse courriel",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "date-heure ISO",
		date: "date ISO",
		time: "heure ISO",
		duration: "durée ISO",
		ipv4: "adresse IPv4",
		ipv6: "adresse IPv6",
		mac: "adresse MAC",
		cidrv4: "plage IPv4",
		cidrv6: "plage IPv6",
		base64: "chaîne encodée en base64",
		base64url: "chaîne encodée en base64url",
		json_string: "chaîne JSON",
		e164: "numéro E.164",
		credit_card: "numéro de carte de crédit",
		currency_code: "code de devise",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "entrée"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Entrée invalide : attendu instanceof ${issue.expected}, reçu ${received}`;
				return `Entrée invalide : attendu ${expected}, reçu ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Entrée invalide : attendu ${stringifyPrimitive(issue.values[0])}`;
				return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "≤" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
				return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? "≥" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Chaîne invalide : doit inclure "${_issue.includes}"`;
				if (_issue.format === "regex") return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
			}
			case "not_multiple_of": return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
			case "unrecognized_keys": return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Clé invalide dans ${issue.origin}`;
			case "invalid_union": return "Entrée invalide";
			case "invalid_element": return `Valeur invalide dans ${issue.origin}`;
			default: return `Entrée invalide`;
		}
	};
};
function fr_CA_default() {
	return { localeError: error$43() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/gu.js
const error$42 = () => {
	const Sizable = {
		string: {
			unit: "અક્ષર",
			verb: "હોવા જોઈએ"
		},
		file: {
			unit: "બાયટ",
			verb: "હોવા જોઈએ"
		},
		array: {
			unit: "આઇટમ",
			verb: "હોવા જોઈએ"
		},
		set: {
			unit: "આઇટમ",
			verb: "હોવા જોઈએ"
		},
		map: {
			unit: "એન્ટ્રી",
			verb: "હોવા જોઈએ"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ઇનપુટ",
		email: "ઈમેઇલ એડ્રેસ",
		url: "URL",
		emoji: "ઇમોજી",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO તારીખ અને સમય",
		date: "ISO તારીખ",
		time: "ISO સમય",
		duration: "ISO અવધિ",
		ipv4: "IPv4 એડ્રેસ",
		ipv6: "IPv6 એડ્રેસ",
		mac: "MAC એડ્રેસ",
		cidrv4: "IPv4 શ્રેણી",
		cidrv6: "IPv6 શ્રેણી",
		base64: "base64-એન્કોડેડ સ્ટ્રિંગ",
		base64url: "base64url-એન્કોડેડ સ્ટ્રિંગ",
		json_string: "JSON સ્ટ્રિંગ",
		e164: "E.164 નંબર",
		credit_card: "ક્રેડિટ કાર્ડ નંબર",
		currency_code: "ચલણ કોડ",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ઇનપુટ"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `અમાન્ય ઇનપુટ: અપેક્ષિત ${expected}, પ્રાપ્ત ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `અમાન્ય ઇનપુટ: અપેક્ષિત ${stringifyPrimitive(issue.values[0])}`;
				return `અમાન્ય વિકલ્પ: ${joinValues(issue.values, " | ")} માધ્યમથી એક અપેક્ષિત`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ખૂબ મોટું: ${issue.origin ?? "મૂલ્ય"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "એલિમેન્ટ"} હોવા જોઈએ`;
				return `ખૂબ મોટું: ${issue.origin ?? "મૂલ્ય"} ${adj}${issue.maximum.toString()} હોવું જોઈએ`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ખૂબ નાનું: ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} હોવા જોઈએ`;
				return `ખૂબ નાનું: ${issue.origin} ${adj}${issue.minimum.toString()} હોવું જોઈએ`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `અમાન્ય સ્ટ્રિંગ: "${_issue.prefix}" થી શરૂ થવું જોઈએ`;
				if (_issue.format === "ends_with") return `અમાન્ય સ્ટ્રિંગ: "${_issue.suffix}" પર સમાપ્ત થવું જોઈએ`;
				if (_issue.format === "includes") return `અમાન્ય સ્ટ્રિંગ: "${_issue.includes}" શામેલ હોવું જોઈએ`;
				if (_issue.format === "regex") return `અમાન્ય સ્ટ્રિંગ: પેટર્ન ${_issue.pattern} સાથે મેળ ખાવું જોઈએ`;
				return `અમાન્ય ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `અમાન્ય નંબર: ${issue.divisor} નો ગુણાંક હોવો જોઈએ`;
			case "unrecognized_keys": return `ઓળખી શકાતા નહીં તે કી${issue.keys.length > 1 ? "ઓ" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} માં અમાન્ય કી`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `અમાન્ય ડિસ્ક્રિમિનેટર મૂલ્ય. અપેક્ષિત ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "અમાન્ય ઇનપુટ";
			case "invalid_element": return `${issue.origin} માં અમાન્ય મૂલ્ય`;
			default: return "અમાન્ય ઇનપુટ";
		}
	};
};
function gu_default() {
	return { localeError: error$42() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/he.js
const error$41 = () => {
	const TypeNames = {
		string: {
			label: "מחרוזת",
			gender: "f"
		},
		number: {
			label: "מספר",
			gender: "m"
		},
		boolean: {
			label: "ערך בוליאני",
			gender: "m"
		},
		bigint: {
			label: "BigInt",
			gender: "m"
		},
		date: {
			label: "תאריך",
			gender: "m"
		},
		array: {
			label: "מערך",
			gender: "m"
		},
		object: {
			label: "אובייקט",
			gender: "m"
		},
		null: {
			label: "ערך ריק (null)",
			gender: "m"
		},
		undefined: {
			label: "ערך לא מוגדר (undefined)",
			gender: "m"
		},
		symbol: {
			label: "סימבול (Symbol)",
			gender: "m"
		},
		function: {
			label: "פונקציה",
			gender: "f"
		},
		map: {
			label: "מפה (Map)",
			gender: "f"
		},
		set: {
			label: "קבוצה (Set)",
			gender: "f"
		},
		file: {
			label: "קובץ",
			gender: "m"
		},
		promise: {
			label: "Promise",
			gender: "m"
		},
		NaN: {
			label: "NaN",
			gender: "m"
		},
		unknown: {
			label: "ערך לא ידוע",
			gender: "m"
		},
		value: {
			label: "ערך",
			gender: "m"
		}
	};
	const Sizable = {
		string: {
			unit: "תווים",
			shortLabel: "קצר",
			longLabel: "ארוך"
		},
		file: {
			unit: "בייטים",
			shortLabel: "קטן",
			longLabel: "גדול"
		},
		array: {
			unit: "פריטים",
			shortLabel: "קטן",
			longLabel: "גדול"
		},
		set: {
			unit: "פריטים",
			shortLabel: "קטן",
			longLabel: "גדול"
		},
		number: {
			unit: "",
			shortLabel: "קטן",
			longLabel: "גדול"
		}
	};
	const typeEntry = (t) => t ? TypeNames[t] : void 0;
	const typeLabel = (t) => {
		const e = typeEntry(t);
		if (e) return e.label;
		return t ?? TypeNames.unknown.label;
	};
	const withDefinite = (t) => `ה${typeLabel(t)}`;
	const verbFor = (t) => {
		return (typeEntry(t)?.gender ?? "m") === "f" ? "צריכה להיות" : "צריך להיות";
	};
	const getSizing = (origin) => {
		if (!origin) return null;
		return Sizable[origin] ?? null;
	};
	const FormatDictionary = {
		regex: {
			label: "קלט",
			gender: "m"
		},
		email: {
			label: "כתובת אימייל",
			gender: "f"
		},
		url: {
			label: "כתובת רשת",
			gender: "f"
		},
		emoji: {
			label: "אימוג'י",
			gender: "m"
		},
		uuid: {
			label: "UUID",
			gender: "m"
		},
		uuidv4: {
			label: "UUIDv4",
			gender: "m"
		},
		uuidv6: {
			label: "UUIDv6",
			gender: "m"
		},
		nanoid: {
			label: "nanoid",
			gender: "m"
		},
		guid: {
			label: "GUID",
			gender: "m"
		},
		cuid: {
			label: "cuid",
			gender: "m"
		},
		cuid2: {
			label: "cuid2",
			gender: "m"
		},
		ulid: {
			label: "ULID",
			gender: "m"
		},
		xid: {
			label: "XID",
			gender: "m"
		},
		ksuid: {
			label: "KSUID",
			gender: "m"
		},
		datetime: {
			label: "תאריך וזמן ISO",
			gender: "m"
		},
		date: {
			label: "תאריך ISO",
			gender: "m"
		},
		time: {
			label: "זמן ISO",
			gender: "m"
		},
		duration: {
			label: "משך זמן ISO",
			gender: "m"
		},
		ipv4: {
			label: "כתובת IPv4",
			gender: "f"
		},
		ipv6: {
			label: "כתובת IPv6",
			gender: "f"
		},
		mac: {
			label: "כתובת MAC",
			gender: "f"
		},
		cidrv4: {
			label: "טווח IPv4",
			gender: "m"
		},
		cidrv6: {
			label: "טווח IPv6",
			gender: "m"
		},
		base64: {
			label: "מחרוזת בבסיס 64",
			gender: "f"
		},
		base64url: {
			label: "מחרוזת בבסיס 64 לכתובות רשת",
			gender: "f"
		},
		json_string: {
			label: "מחרוזת JSON",
			gender: "f"
		},
		e164: {
			label: "מספר E.164",
			gender: "m"
		},
		credit_card: {
			label: "מספר כרטיס אשראי",
			gender: "m"
		},
		currency_code: {
			label: "קוד מטבע",
			gender: "m"
		},
		iban: {
			label: "IBAN",
			gender: "m"
		},
		jwt: {
			label: "JWT",
			gender: "m"
		},
		template_literal: {
			label: "קלט",
			gender: "m"
		},
		ends_with: {
			label: "קלט",
			gender: "m"
		},
		includes: {
			label: "קלט",
			gender: "m"
		},
		lowercase: {
			label: "קלט",
			gender: "m"
		},
		starts_with: {
			label: "קלט",
			gender: "m"
		},
		uppercase: {
			label: "קלט",
			gender: "m"
		}
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expectedKey = issue.expected;
				const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `קלט לא תקין: צריך להיות instanceof ${issue.expected}, התקבל ${received}`;
				return `קלט לא תקין: צריך להיות ${expected}, התקבל ${received}`;
			}
			case "invalid_value": {
				if (issue.values.length === 1) return `ערך לא תקין: הערך חייב להיות ${stringifyPrimitive(issue.values[0])}`;
				const stringified = issue.values.map((v) => stringifyPrimitive(v));
				if (issue.values.length === 2) return `ערך לא תקין: האפשרויות המתאימות הן ${stringified[0]} או ${stringified[1]}`;
				const lastValue = stringified[stringified.length - 1];
				return `ערך לא תקין: האפשרויות המתאימות הן ${stringified.slice(0, -1).join(", ")} או ${lastValue}`;
			}
			case "too_big": {
				const sizing = getSizing(issue.origin);
				const subject = withDefinite(issue.origin ?? "value");
				if (issue.origin === "string") return `${sizing?.longLabel ?? "ארוך"} מדי: ${subject} צריכה להכיל ${issue.maximum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "או פחות" : "לכל היותר"}`.trim();
				if (issue.origin === "number") return `גדול מדי: ${subject} צריך להיות ${issue.inclusive ? `קטן או שווה ל-${issue.maximum}` : `קטן מ-${issue.maximum}`}`;
				if (issue.origin === "array" || issue.origin === "set") return `גדול מדי: ${subject} ${issue.origin === "set" ? "צריכה" : "צריך"} להכיל ${issue.inclusive ? `${issue.maximum} ${sizing?.unit ?? ""} או פחות` : `פחות מ-${issue.maximum} ${sizing?.unit ?? ""}`}`.trim();
				const adj = issue.inclusive ? "<=" : "<";
				const be = verbFor(issue.origin ?? "value");
				if (sizing?.unit) return `${sizing.longLabel} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
				return `${sizing?.longLabel ?? "גדול"} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const sizing = getSizing(issue.origin);
				const subject = withDefinite(issue.origin ?? "value");
				if (issue.origin === "string") return `${sizing?.shortLabel ?? "קצר"} מדי: ${subject} צריכה להכיל ${issue.minimum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "או יותר" : "לפחות"}`.trim();
				if (issue.origin === "number") return `קטן מדי: ${subject} צריך להיות ${issue.inclusive ? `גדול או שווה ל-${issue.minimum}` : `גדול מ-${issue.minimum}`}`;
				if (issue.origin === "array" || issue.origin === "set") {
					const verb = issue.origin === "set" ? "צריכה" : "צריך";
					if (issue.minimum === 1 && issue.inclusive) return `קטן מדי: ${subject} ${verb} להכיל ${issue.origin === "set" ? "לפחות פריט אחד" : "לפחות פריט אחד"}`;
					return `קטן מדי: ${subject} ${verb} להכיל ${issue.inclusive ? `${issue.minimum} ${sizing?.unit ?? ""} או יותר` : `יותר מ-${issue.minimum} ${sizing?.unit ?? ""}`}`.trim();
				}
				const adj = issue.inclusive ? ">=" : ">";
				const be = verbFor(issue.origin ?? "value");
				if (sizing?.unit) return `${sizing.shortLabel} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `${sizing?.shortLabel ?? "קטן"} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `המחרוזת חייבת להתחיל ב "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `המחרוזת חייבת להסתיים ב "${_issue.suffix}"`;
				if (_issue.format === "includes") return `המחרוזת חייבת לכלול "${_issue.includes}"`;
				if (_issue.format === "regex") return `המחרוזת חייבת להתאים לתבנית ${_issue.pattern}`;
				const nounEntry = FormatDictionary[_issue.format];
				return `${nounEntry?.label ?? _issue.format} לא ${(nounEntry?.gender ?? "m") === "f" ? "תקינה" : "תקין"}`;
			}
			case "not_multiple_of": return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
			case "unrecognized_keys": return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `שדה לא תקין באובייקט`;
			case "invalid_union": return "קלט לא תקין";
			case "invalid_element": return `ערך לא תקין ב${withDefinite(issue.origin ?? "array")}`;
			default: return `קלט לא תקין`;
		}
	};
};
function he_default() {
	return { localeError: error$41() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/hi.js
const error$40 = () => {
	const Sizable = {
		string: {
			unit: "अक्षर",
			verb: "रखने के लिए"
		},
		file: {
			unit: "बाइट्स",
			verb: "रखने के लिए"
		},
		array: {
			unit: "तत्व",
			verb: "रखने के लिए"
		},
		set: {
			unit: "तत्व",
			verb: "रखने के लिए"
		},
		map: {
			unit: "प्रविष्टियाँ",
			verb: "रखने के लिए"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "इनपुट",
		email: "ईमेल पता",
		url: "URL",
		emoji: "इमोजी",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO तिथि और समय",
		date: "ISO तिथि",
		time: "ISO समय",
		duration: "ISO अवधि",
		ipv4: "IPv4 पता",
		ipv6: "IPv6 पता",
		mac: "MAC पता",
		cidrv4: "IPv4 श्रेणी",
		cidrv6: "IPv6 श्रेणी",
		base64: "Base64-एन्कोडेड स्ट्रिंग",
		base64url: "Base64URL-एन्कोडेड स्ट्रिंग",
		json_string: "JSON स्ट्रिंग",
		e164: "E.164 संख्या",
		credit_card: "क्रेडिट कार्ड संख्या",
		currency_code: "मुद्रा कोड",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "इनपुट"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `अमान्य इनपुट: अपेक्षित ${expected}, प्राप्त ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `अमान्य इनपुट: अपेक्षित ${stringifyPrimitive(issue.values[0])}`;
				return `अमान्य विकल्प: अपेक्षित मानों में से एक ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `बहुत बड़ा: अपेक्षित था कि ${issue.origin ?? "मान"} में ${adj}${issue.maximum} ${sizing.unit} हों`;
				return `बहुत बड़ा: अपेक्षित था कि ${issue.origin ?? "मान"} ${adj}${issue.maximum} हो`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `बहुत छोटा: अपेक्षित था कि ${issue.origin} में ${adj}${issue.minimum} ${sizing.unit} हों`;
				return `बहुत छोटा: अपेक्षित था कि ${issue.origin} ${adj}${issue.minimum} हो`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `अमान्य स्ट्रिंग: "${_issue.prefix}" से शुरू होना चाहिए`;
				if (_issue.format === "ends_with") return `अमान्य स्ट्रिंग: "${_issue.suffix}" पर समाप्त होना चाहिए`;
				if (_issue.format === "includes") return `अमान्य स्ट्रिंग: इसमें "${_issue.includes}" शामिल होना चाहिए`;
				if (_issue.format === "regex") return `अमान्य स्ट्रिंग: पैटर्न ${_issue.pattern} से मेल खाना चाहिए`;
				return `अमान्य ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `अमान्य संख्या: यह ${issue.divisor} का गुणज होना चाहिए`;
			case "unrecognized_keys": return `अपरिचित कुंजी${issue.keys.length > 1 ? "याँ" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `अमान्य कुंजी: ${issue.origin} में`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `अमान्य डिस्क्रिमिनेटर मान: अपेक्षित ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "अमान्य इनपुट";
			case "invalid_element": return `अमान्य मान: ${issue.origin} में`;
			default: return `अमान्य इनपुट`;
		}
	};
};
function hi_default() {
	return { localeError: error$40() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/hr.js
const error$39 = () => {
	const Sizable = {
		string: {
			unit: "znakova",
			verb: "imati"
		},
		file: {
			unit: "bajtova",
			verb: "imati"
		},
		array: {
			unit: "stavki",
			verb: "imati"
		},
		set: {
			unit: "stavki",
			verb: "imati"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "unos",
		email: "email adresa",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datum i vrijeme",
		date: "ISO datum",
		time: "ISO vrijeme",
		duration: "ISO trajanje",
		ipv4: "IPv4 adresa",
		ipv6: "IPv6 adresa",
		mac: "MAC adresa",
		cidrv4: "IPv4 raspon",
		cidrv6: "IPv6 raspon",
		base64: "base64 kodirani tekst",
		base64url: "base64url kodirani tekst",
		json_string: "JSON tekst",
		e164: "E.164 broj",
		credit_card: "broj kreditne kartice",
		currency_code: "kod valute",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "unos"
	};
	const TypeDictionary = {
		nan: "NaN",
		string: "tekst",
		number: "broj",
		boolean: "boolean",
		array: "niz",
		object: "objekt",
		set: "skup",
		file: "datoteka",
		date: "datum",
		bigint: "bigint",
		symbol: "simbol",
		undefined: "undefined",
		null: "null",
		function: "funkcija",
		map: "mapa"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Neispravan unos: očekuje se instanceof ${issue.expected}, a primljeno je ${received}`;
				return `Neispravan unos: očekuje se ${expected}, a primljeno je ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Neispravna vrijednost: očekivano ${stringifyPrimitive(issue.values[0])}`;
				return `Neispravna opcija: očekivano jedno od ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `Preveliko: očekivano da ${origin ?? "vrijednost"} ima ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
				return `Preveliko: očekivano da ${origin ?? "vrijednost"} bude ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				if (sizing) return `Premalo: očekivano da ${origin} ima ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Premalo: očekivano da ${origin} bude ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Neispravan tekst: mora započinjati s "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Neispravan tekst: mora završavati s "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Neispravan tekst: mora sadržavati "${_issue.includes}"`;
				if (_issue.format === "regex") return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
				return `Neispravna ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Neispravan broj: mora biti višekratnik od ${issue.divisor}`;
			case "unrecognized_keys": return `Neprepoznat${issue.keys.length > 1 ? "i ključevi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Neispravan ključ u ${TypeDictionary[issue.origin] ?? issue.origin}`;
			case "invalid_union": return "Neispravan unos";
			case "invalid_element": return `Neispravna vrijednost u ${TypeDictionary[issue.origin] ?? issue.origin}`;
			default: return `Neispravan unos`;
		}
	};
};
function hr_default() {
	return { localeError: error$39() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/hu.js
const error$38 = () => {
	const Sizable = {
		string: {
			unit: "karakter",
			verb: "legyen"
		},
		file: {
			unit: "byte",
			verb: "legyen"
		},
		array: {
			unit: "elem",
			verb: "legyen"
		},
		set: {
			unit: "elem",
			verb: "legyen"
		},
		map: {
			unit: "elem",
			verb: "legyen"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "bemenet",
		email: "email cím",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO időbélyeg",
		date: "ISO dátum",
		time: "ISO idő",
		duration: "ISO időintervallum",
		ipv4: "IPv4 cím",
		ipv6: "IPv6 cím",
		mac: "MAC cím",
		cidrv4: "IPv4 tartomány",
		cidrv6: "IPv6 tartomány",
		base64: "base64-kódolt string",
		base64url: "base64url-kódolt string",
		json_string: "JSON string",
		e164: "E.164 szám",
		credit_card: "hitelkártyaszám",
		currency_code: "pénznemkód",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "bemenet"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "szám",
		array: "tömb"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Érvénytelen bemenet: a várt érték instanceof ${issue.expected}, a kapott érték ${received}`;
				return `Érvénytelen bemenet: a várt érték ${expected}, a kapott érték ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue.values[0])}`;
				return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Túl nagy: ${issue.origin ?? "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
				return `Túl nagy: a bemeneti érték ${issue.origin ?? "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
				if (_issue.format === "ends_with") return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
				if (_issue.format === "includes") return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
				if (_issue.format === "regex") return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
				return `Érvénytelen ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
			case "unrecognized_keys": return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Érvénytelen kulcs ${issue.origin}`;
			case "invalid_union": return "Érvénytelen bemenet";
			case "invalid_element": return `Érvénytelen érték: ${issue.origin}`;
			default: return `Érvénytelen bemenet`;
		}
	};
};
function hu_default() {
	return { localeError: error$38() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/hy.js
function getArmenianPlural(count, one, many) {
	return Math.abs(count) === 1 ? one : many;
}
function withDefiniteArticle(word) {
	if (!word) return "";
	const vowels = [
		"ա",
		"ե",
		"ը",
		"ի",
		"ո",
		"ու",
		"օ"
	];
	const lastChar = word[word.length - 1];
	return word + (vowels.includes(lastChar) ? "ն" : "ը");
}
const error$37 = () => {
	const Sizable = {
		string: {
			unit: {
				one: "նշան",
				many: "նշաններ"
			},
			verb: "ունենալ"
		},
		file: {
			unit: {
				one: "բայթ",
				many: "բայթեր"
			},
			verb: "ունենալ"
		},
		array: {
			unit: {
				one: "տարր",
				many: "տարրեր"
			},
			verb: "ունենալ"
		},
		set: {
			unit: {
				one: "տարր",
				many: "տարրեր"
			},
			verb: "ունենալ"
		},
		map: {
			unit: {
				one: "տարր",
				many: "տարրեր"
			},
			verb: "ունենալ"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "մուտք",
		email: "էլ. հասցե",
		url: "URL",
		emoji: "էմոջի",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO ամսաթիվ և ժամ",
		date: "ISO ամսաթիվ",
		time: "ISO ժամ",
		duration: "ISO տևողություն",
		ipv4: "IPv4 հասցե",
		ipv6: "IPv6 հասցե",
		mac: "MAC հասցե",
		cidrv4: "IPv4 միջակայք",
		cidrv6: "IPv6 միջակայք",
		base64: "base64 ձևաչափով տող",
		base64url: "base64url ձևաչափով տող",
		json_string: "JSON տող",
		e164: "E.164 համար",
		credit_card: "կրեդիտ քարտի համար",
		currency_code: "արժույթի կոդ",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "մուտք"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "թիվ",
		array: "զանգված"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Սխալ մուտքագրում․ սպասվում էր instanceof ${issue.expected}, ստացվել է ${received}`;
				return `Սխալ մուտքագրում․ սպասվում էր ${expected}, ստացվել է ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Սխալ մուտքագրում․ սպասվում էր ${stringifyPrimitive(issue.values[1])}`;
				return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getArmenianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.many);
					return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin ?? "արժեք")} կունենա ${adj}${issue.maximum.toString()} ${unit}`;
				}
				return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin ?? "արժեք")} լինի ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getArmenianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.many);
					return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} կունենա ${adj}${issue.minimum.toString()} ${unit}`;
				}
				return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} լինի ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Սխալ տող․ պետք է սկսվի "${_issue.prefix}"-ով`;
				if (_issue.format === "ends_with") return `Սխալ տող․ պետք է ավարտվի "${_issue.suffix}"-ով`;
				if (_issue.format === "includes") return `Սխալ տող․ պետք է պարունակի "${_issue.includes}"`;
				if (_issue.format === "regex") return `Սխալ տող․ պետք է համապատասխանի ${_issue.pattern} ձևաչափին`;
				return `Սխալ ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${issue.divisor}-ի`;
			case "unrecognized_keys": return `Չճանաչված բանալի${issue.keys.length > 1 ? "ներ" : ""}. ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Սխալ բանալի ${withDefiniteArticle(issue.origin)}-ում`;
			case "invalid_union": return "Սխալ մուտքագրում";
			case "invalid_element": return `Սխալ արժեք ${withDefiniteArticle(issue.origin)}-ում`;
			default: return `Սխալ մուտքագրում`;
		}
	};
};
function hy_default() {
	return { localeError: error$37() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/id.js
const error$36 = () => {
	const Sizable = {
		string: {
			unit: "karakter",
			verb: "memiliki"
		},
		file: {
			unit: "byte",
			verb: "memiliki"
		},
		array: {
			unit: "item",
			verb: "memiliki"
		},
		set: {
			unit: "item",
			verb: "memiliki"
		},
		map: {
			unit: "item",
			verb: "memiliki"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "alamat email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "tanggal dan waktu format ISO",
		date: "tanggal format ISO",
		time: "jam format ISO",
		duration: "durasi format ISO",
		ipv4: "alamat IPv4",
		ipv6: "alamat IPv6",
		mac: "alamat MAC",
		cidrv4: "rentang alamat IPv4",
		cidrv6: "rentang alamat IPv6",
		base64: "string dengan enkode base64",
		base64url: "string dengan enkode base64url",
		json_string: "string JSON",
		e164: "angka E.164",
		credit_card: "nomor kartu kredit",
		currency_code: "kode mata uang",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Input tidak valid: diharapkan instanceof ${issue.expected}, diterima ${received}`;
				return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Input tidak valid: diharapkan ${stringifyPrimitive(issue.values[0])}`;
				return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
				return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
				if (_issue.format === "includes") return `String tidak valid: harus menyertakan "${_issue.includes}"`;
				if (_issue.format === "regex") return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} tidak valid`;
			}
			case "not_multiple_of": return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
			case "unrecognized_keys": return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Kunci tidak valid di ${issue.origin}`;
			case "invalid_union": return "Input tidak valid";
			case "invalid_element": return `Nilai tidak valid di ${issue.origin}`;
			default: return `Input tidak valid`;
		}
	};
};
function id_default() {
	return { localeError: error$36() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/is.js
const error$35 = () => {
	const Sizable = {
		string: {
			unit: "stafi",
			verb: "að hafa"
		},
		file: {
			unit: "bæti",
			verb: "að hafa"
		},
		array: {
			unit: "hluti",
			verb: "að hafa"
		},
		set: {
			unit: "hluti",
			verb: "að hafa"
		},
		map: {
			unit: "hluti",
			verb: "að hafa"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "gildi",
		email: "netfang",
		url: "vefslóð",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO dagsetning og tími",
		date: "ISO dagsetning",
		time: "ISO tími",
		duration: "ISO tímalengd",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded strengur",
		base64url: "base64url-encoded strengur",
		json_string: "JSON strengur",
		e164: "E.164 tölugildi",
		credit_card: "kreditkortanúmer",
		currency_code: "gjaldmiðilskóði",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "gildi"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "númer",
		array: "fylki"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera instanceof ${issue.expected}`;
				return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera ${expected}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue.values[0])}`;
				return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} hafi ${adj}${issue.maximum.toString()} ${sizing.unit ?? "hluti"}`;
				return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} sé ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Of lítið: gert er ráð fyrir að ${issue.origin} hafi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Of lítið: gert er ráð fyrir að ${issue.origin} sé ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
				return `Rangt ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Röng tala: verður að vera margfeldi af ${issue.divisor}`;
			case "unrecognized_keys": return `Óþekkt ${issue.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Rangur lykill í ${issue.origin}`;
			case "invalid_union": return "Rangt gildi";
			case "invalid_element": return `Rangt gildi í ${issue.origin}`;
			default: return `Rangt gildi`;
		}
	};
};
function is_default() {
	return { localeError: error$35() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/it.js
const error$34 = () => {
	const Sizable = {
		string: {
			unit: "caratteri",
			verb: "avere"
		},
		file: {
			unit: "byte",
			verb: "avere"
		},
		array: {
			unit: "elementi",
			verb: "avere"
		},
		set: {
			unit: "elementi",
			verb: "avere"
		},
		map: {
			unit: "elementi",
			verb: "avere"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "indirizzo email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "data e ora ISO",
		date: "data ISO",
		time: "ora ISO",
		duration: "durata ISO",
		ipv4: "indirizzo IPv4",
		ipv6: "indirizzo IPv6",
		mac: "indirizzo MAC",
		cidrv4: "intervallo IPv4",
		cidrv6: "intervallo IPv6",
		base64: "stringa codificata in base64",
		base64url: "URL codificata in base64",
		json_string: "stringa JSON",
		e164: "numero E.164",
		credit_card: "numero di carta di credito",
		currency_code: "codice valuta",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "numero",
		array: "vettore"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Input non valido: atteso instanceof ${issue.expected}, ricevuto ${received}`;
				return `Input non valido: atteso ${expected}, ricevuto ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Input non valido: atteso ${stringifyPrimitive(issue.values[0])}`;
				return `Opzione non valida: atteso uno tra ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
				return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Stringa non valida: deve includere "${_issue.includes}"`;
				if (_issue.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
				return `Input non valido: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
			case "unrecognized_keys": return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Chiave non valida in ${issue.origin}`;
			case "invalid_union": return "Input non valido";
			case "invalid_element": return `Valore non valido in ${issue.origin}`;
			default: return `Input non valido`;
		}
	};
};
function it_default() {
	return { localeError: error$34() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ja.js
const error$33 = () => {
	const Sizable = {
		string: {
			unit: "文字",
			verb: "である"
		},
		file: {
			unit: "バイト",
			verb: "である"
		},
		array: {
			unit: "要素",
			verb: "である"
		},
		set: {
			unit: "要素",
			verb: "である"
		},
		map: {
			unit: "要素",
			verb: "である"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "入力値",
		email: "メールアドレス",
		url: "URL",
		emoji: "絵文字",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO日時",
		date: "ISO日付",
		time: "ISO時刻",
		duration: "ISO期間",
		ipv4: "IPv4アドレス",
		ipv6: "IPv6アドレス",
		mac: "MACアドレス",
		cidrv4: "IPv4範囲",
		cidrv6: "IPv6範囲",
		base64: "base64エンコード文字列",
		base64url: "base64urlエンコード文字列",
		json_string: "JSON文字列",
		e164: "E.164番号",
		credit_card: "クレジットカード番号",
		currency_code: "通貨コード",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "入力値"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "数値",
		array: "配列"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `無効な入力: instanceof ${issue.expected}が期待されましたが、${received}が入力されました`;
				return `無効な入力: ${expected}が期待されましたが、${received}が入力されました`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `無効な入力: ${stringifyPrimitive(issue.values[0])}が期待されました`;
				return `無効な選択: ${joinValues(issue.values, "、")}のいずれかである必要があります`;
			case "too_big": {
				const adj = issue.inclusive ? "以下である" : "より小さい";
				const sizing = getSizing(issue.origin);
				if (sizing) return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
				return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${adj}必要があります`;
			}
			case "too_small": {
				const adj = issue.inclusive ? "以上である" : "より大きい";
				const sizing = getSizing(issue.origin);
				if (sizing) return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}必要があります`;
				return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}必要があります`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
				if (_issue.format === "ends_with") return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
				if (_issue.format === "includes") return `無効な文字列: "${_issue.includes}"を含む必要があります`;
				if (_issue.format === "regex") return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
				return `無効な${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `無効な数値: ${issue.divisor}の倍数である必要があります`;
			case "unrecognized_keys": return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${joinValues(issue.keys, "、")}`;
			case "invalid_key": return `${issue.origin}内の無効なキー`;
			case "invalid_union": return "無効な入力";
			case "invalid_element": return `${issue.origin}内の無効な値`;
			default: return `無効な入力`;
		}
	};
};
function ja_default() {
	return { localeError: error$33() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ka.js
const error$32 = () => {
	const Sizable = {
		string: {
			unit: "სიმბოლო",
			verb: "უნდა შეიცავდეს"
		},
		file: {
			unit: "ბაიტი",
			verb: "უნდა შეიცავდეს"
		},
		array: {
			unit: "ელემენტი",
			verb: "უნდა შეიცავდეს"
		},
		set: {
			unit: "ელემენტი",
			verb: "უნდა შეიცავდეს"
		},
		map: {
			unit: "ელემენტი",
			verb: "უნდა შეიცავდეს"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "შეყვანა",
		email: "ელ-ფოსტის მისამართი",
		url: "URL",
		emoji: "ემოჯი",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "თარიღი-დრო",
		date: "თარიღი",
		time: "დრო",
		duration: "ხანგრძლივობა",
		ipv4: "IPv4 მისამართი",
		ipv6: "IPv6 მისამართი",
		mac: "MAC მისამართი",
		cidrv4: "IPv4 დიაპაზონი",
		cidrv6: "IPv6 დიაპაზონი",
		base64: "base64-კოდირებული ველი",
		base64url: "base64url-კოდირებული ველი",
		json_string: "JSON ველი",
		e164: "E.164 ნომერი",
		credit_card: "საკრედიტო ბარათის ნომერი",
		currency_code: "ვალუტის კოდი",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "შეყვანა"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "რიცხვი",
		string: "ველი",
		boolean: "ბულეანი",
		function: "ფუნქცია",
		array: "მასივი"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `არასწორი შეყვანა: მოსალოდნელი instanceof ${issue.expected}, მიღებული ${received}`;
				return `არასწორი შეყვანა: მოსალოდნელი ${expected}, მიღებული ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue.values[0])}`;
				return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue.values, "|")}-დან`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
				return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} იყოს ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `არასწორი ველი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
				if (_issue.format === "ends_with") return `არასწორი ველი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
				if (_issue.format === "includes") return `არასწორი ველი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
				if (_issue.format === "regex") return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
				return `არასწორი ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `არასწორი რიცხვი: უნდა იყოს ${issue.divisor}-ის ჯერადი`;
			case "unrecognized_keys": return `უცნობი გასაღებ${issue.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `არასწორი გასაღები ${issue.origin}-ში`;
			case "invalid_union": return "არასწორი შეყვანა";
			case "invalid_element": return `არასწორი მნიშვნელობა ${issue.origin}-ში`;
			default: return `არასწორი შეყვანა`;
		}
	};
};
function ka_default() {
	return { localeError: error$32() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/km.js
const error$31 = () => {
	const Sizable = {
		string: {
			unit: "តួអក្សរ",
			verb: "គួរមាន"
		},
		file: {
			unit: "បៃ",
			verb: "គួរមាន"
		},
		array: {
			unit: "ធាតុ",
			verb: "គួរមាន"
		},
		set: {
			unit: "ធាតុ",
			verb: "គួរមាន"
		},
		map: {
			unit: "ធាតុ",
			verb: "គួរមាន"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ទិន្នន័យបញ្ចូល",
		email: "អាសយដ្ឋានអ៊ីមែល",
		url: "URL",
		emoji: "សញ្ញាអារម្មណ៍",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
		date: "កាលបរិច្ឆេទ ISO",
		time: "ម៉ោង ISO",
		duration: "រយៈពេល ISO",
		ipv4: "អាសយដ្ឋាន IPv4",
		ipv6: "អាសយដ្ឋាន IPv6",
		mac: "អាសយដ្ឋាន MAC",
		cidrv4: "ដែនអាសយដ្ឋាន IPv4",
		cidrv6: "ដែនអាសយដ្ឋាន IPv6",
		base64: "ខ្សែអក្សរអ៊ិកូដ base64",
		base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
		json_string: "ខ្សែអក្សរ JSON",
		e164: "លេខ E.164",
		credit_card: "លេខប័ណ្ណឥណទាន",
		currency_code: "កូដរូបិយប័ណ្ណ",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ទិន្នន័យបញ្ចូល"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "លេខ",
		array: "អារេ (Array)",
		null: "គ្មានតម្លៃ (null)"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${issue.expected} ប៉ុន្តែទទួលបាន ${received}`;
				return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${expected} ប៉ុន្តែទទួលបាន ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue.values[0])}`;
				return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
				return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
				if (_issue.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
				if (_issue.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
				return `មិនត្រឹមត្រូវ៖ ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue.divisor}`;
			case "unrecognized_keys": return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
			case "invalid_union": return `ទិន្នន័យមិនត្រឹមត្រូវ`;
			case "invalid_element": return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
			default: return `ទិន្នន័យមិនត្រឹមត្រូវ`;
		}
	};
};
function km_default() {
	return { localeError: error$31() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/kh.js
/** @deprecated Use `km` instead. */
function kh_default() {
	return km_default();
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/kn.js
const error$30 = () => {
	const Sizable = {
		string: {
			unit: "ಅಕ್ಷರಗಳು",
			verb: "ಹೊಂದಲು"
		},
		file: {
			unit: "ಬೈಟ್‌ಗಳು",
			verb: "ಹೊಂದಲು"
		},
		array: {
			unit: "ವಸ್ತುಗಳು",
			verb: "ಹೊಂದಲು"
		},
		set: {
			unit: "ವಸ್ತುಗಳು",
			verb: "ಹೊಂದಲು"
		},
		map: {
			unit: "entries",
			verb: "ಹೊಂದಲು"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ಇನ್ಪುಟ್",
		email: "email ವಿಳಾಸ",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO ದಿನಾಂಕದ ಸಮಯ",
		date: "ISO ದಿನಾಂಕ",
		time: "ISO ಸಮಯ",
		duration: "ISO ಅವಧಿ",
		ipv4: "IPv4 ವಿಳಾಸ",
		ipv6: "IPv6 ವಿಳಾಸ",
		mac: "MAC ವಿಳಾಸ",
		cidrv4: "IPv4 ವ್ಯಾಪ್ತಿಯ",
		cidrv6: "IPv6 ವ್ಯಾಪ್ತಿಯ",
		base64: "base64-encodedಸ್ಟ್ರಿಂಗ್",
		base64url: "base64url-encodedಸ್ಟ್ರಿಂಗ್",
		json_string: "JSONಸ್ಟ್ರಿಂಗ್",
		e164: "E.164 ಸಂಖ್ಯೆ",
		credit_card: "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ",
		currency_code: "ಕರೆನ್ಸಿ ಕೋಡ್",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ಇನ್ಪುಟ್"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${expected}, ಸ್ವೀಕರಿಸಿದನು ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${stringifyPrimitive(issue.values[0])}`;
				return `ಅಮಾನ್ಯ ಆಯ್ಕೆ: ಇವುಗಳಲ್ಲಿ ಒಂದನ್ನು ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ತುಂಬಾ ದೊಡ್ಡದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${issue.origin ?? "value"} ಹೊಂದಲು ${adj}${issue.maximum.toString()} ${sizing.unit ?? "ಅಂಶಗಳು"}`;
				return `ತುಂಬಾ ದೊಡ್ಡದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${issue.origin ?? "value"} ಎಂದು ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ತುಂಬಾ ಚಿಕ್ಕದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${issue.origin} ಹೊಂದಲು ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `ತುಂಬಾ ಚಿಕ್ಕದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${issue.origin} ಎಂದು ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಇದರೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಬೇಕು "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಇದರೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳಬೇಕು "${_issue.suffix}"`;
				if (_issue.format === "includes") return `ಅಮಾನ್ಯ ಸ್ಟ್ರಿಂಗ್: ಒಳಗೊಂಡಿರಬೇಕು "${_issue.includes}"`;
				if (_issue.format === "regex") return `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಮಾದರಿಗೆ ಹೊಂದಿಕೆಯಾಗಬೇಕು ${_issue.pattern}`;
				return `ಅಮಾನ್ಯ ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `ಅಮಾನ್ಯ ಸಂಖ್ಯೆ: ಬಹುಸಂಖ್ಯೆಯಾಗಿರಬೇಕು ${issue.divisor}`;
			case "unrecognized_keys": return `ಗುರುತಿಸಲಾಗದ ಕೀ ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `ಅಮಾನ್ಯವಾದ ಕೀ ಇನ್ ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `ಅಮಾನ್ಯ ತಾರತಮ್ಯ ಮೌಲ್ಯ. ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್";
			case "invalid_element": return `ರಲ್ಲಿ ಅಮಾನ್ಯ ಮೌಲ್ಯ ${issue.origin}`;
			default: return `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್`;
		}
	};
};
function kn_default() {
	return { localeError: error$30() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ko.js
const error$29 = () => {
	const Sizable = {
		string: {
			unit: "문자",
			verb: "to have"
		},
		file: {
			unit: "바이트",
			verb: "to have"
		},
		array: {
			unit: "개",
			verb: "to have"
		},
		set: {
			unit: "개",
			verb: "to have"
		},
		map: {
			unit: "개",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "입력",
		email: "이메일 주소",
		url: "URL",
		emoji: "이모지",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO 날짜시간",
		date: "ISO 날짜",
		time: "ISO 시간",
		duration: "ISO 기간",
		ipv4: "IPv4 주소",
		ipv6: "IPv6 주소",
		mac: "MAC 주소",
		cidrv4: "IPv4 범위",
		cidrv6: "IPv6 범위",
		base64: "base64 인코딩 문자열",
		base64url: "base64url 인코딩 문자열",
		json_string: "JSON 문자열",
		e164: "E.164 번호",
		credit_card: "신용카드 번호",
		currency_code: "통화 코드",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "입력"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `잘못된 입력: 예상 타입은 instanceof ${issue.expected}, 받은 타입은 ${received}입니다`;
				return `잘못된 입력: 예상 타입은 ${expected}, 받은 타입은 ${received}입니다`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `잘못된 입력: 값은 ${stringifyPrimitive(issue.values[0])} 이어야 합니다`;
				return `잘못된 옵션: ${joinValues(issue.values, "또는 ")} 중 하나여야 합니다`;
			case "too_big": {
				const adj = issue.inclusive ? "이하" : "미만";
				const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
				const sizing = getSizing(issue.origin);
				const unit = sizing?.unit ?? "요소";
				if (sizing) return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
				return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? "이상" : "초과";
				const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
				const sizing = getSizing(issue.origin);
				const unit = sizing?.unit ?? "요소";
				if (sizing) return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
				return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
				if (_issue.format === "ends_with") return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
				if (_issue.format === "includes") return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
				if (_issue.format === "regex") return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
				return `잘못된 ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
			case "unrecognized_keys": return `인식할 수 없는 키: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `잘못된 키: ${issue.origin}`;
			case "invalid_union": return `잘못된 입력`;
			case "invalid_element": return `잘못된 값: ${issue.origin}`;
			default: return `잘못된 입력`;
		}
	};
};
function ko_default() {
	return { localeError: error$29() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/lt.js
const capitalizeFirstCharacter = (text) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};
function getUnitTypeFromNumber(number) {
	const abs = Math.abs(number);
	const last = abs % 10;
	const last2 = abs % 100;
	if (last2 >= 11 && last2 <= 19 || last === 0) return "many";
	if (last === 1) return "one";
	return "few";
}
const error$28 = () => {
	const Sizable = {
		string: {
			unit: {
				one: "simbolis",
				few: "simboliai",
				many: "simbolių"
			},
			verb: {
				smaller: {
					inclusive: "turi būti ne ilgesnė kaip",
					notInclusive: "turi būti trumpesnė kaip"
				},
				bigger: {
					inclusive: "turi būti ne trumpesnė kaip",
					notInclusive: "turi būti ilgesnė kaip"
				}
			}
		},
		file: {
			unit: {
				one: "baitas",
				few: "baitai",
				many: "baitų"
			},
			verb: {
				smaller: {
					inclusive: "turi būti ne didesnis kaip",
					notInclusive: "turi būti mažesnis kaip"
				},
				bigger: {
					inclusive: "turi būti ne mažesnis kaip",
					notInclusive: "turi būti didesnis kaip"
				}
			}
		},
		array: {
			unit: {
				one: "elementą",
				few: "elementus",
				many: "elementų"
			},
			verb: {
				smaller: {
					inclusive: "turi turėti ne daugiau kaip",
					notInclusive: "turi turėti mažiau kaip"
				},
				bigger: {
					inclusive: "turi turėti ne mažiau kaip",
					notInclusive: "turi turėti daugiau kaip"
				}
			}
		},
		set: {
			unit: {
				one: "elementą",
				few: "elementus",
				many: "elementų"
			},
			verb: {
				smaller: {
					inclusive: "turi turėti ne daugiau kaip",
					notInclusive: "turi turėti mažiau kaip"
				},
				bigger: {
					inclusive: "turi turėti ne mažiau kaip",
					notInclusive: "turi turėti daugiau kaip"
				}
			}
		}
	};
	function getSizing(origin, unitType, inclusive, targetShouldBe) {
		const result = Sizable[origin] ?? null;
		if (result === null) return result;
		return {
			unit: result.unit[unitType],
			verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
		};
	}
	const FormatDictionary = {
		regex: "įvestis",
		email: "el. pašto adresas",
		url: "URL",
		emoji: "jaustukas",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO data ir laikas",
		date: "ISO data",
		time: "ISO laikas",
		duration: "ISO trukmė",
		ipv4: "IPv4 adresas",
		ipv6: "IPv6 adresas",
		mac: "MAC adresas",
		cidrv4: "IPv4 tinklo prefiksas (CIDR)",
		cidrv6: "IPv6 tinklo prefiksas (CIDR)",
		base64: "base64 užkoduota eilutė",
		base64url: "base64url užkoduota eilutė",
		json_string: "JSON eilutė",
		e164: "E.164 numeris",
		credit_card: "kredito kortelės numeris",
		currency_code: "valiutos kodas",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "įvestis"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "skaičius",
		bigint: "sveikasis skaičius",
		string: "eilutė",
		boolean: "loginė reikšmė",
		undefined: "neapibrėžta reikšmė",
		function: "funkcija",
		symbol: "simbolis",
		array: "masyvas",
		object: "objektas",
		null: "nulinė reikšmė"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Gautas tipas ${received}, o tikėtasi - instanceof ${issue.expected}`;
				return `Gautas tipas ${received}, o tikėtasi - ${expected}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Privalo būti ${stringifyPrimitive(issue.values[0])}`;
				return `Privalo būti vienas iš ${joinValues(issue.values, "|")} pasirinkimų`;
			case "too_big": {
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), issue.inclusive ?? false, "smaller");
				if (sizing?.verb) return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.maximum.toString()} ${sizing.unit ?? "elementų"}`;
				const adj = issue.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
				return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.maximum.toString()} ${sizing?.unit}`;
			}
			case "too_small": {
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), issue.inclusive ?? false, "bigger");
				if (sizing?.verb) return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.minimum.toString()} ${sizing.unit ?? "elementų"}`;
				const adj = issue.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
				return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.minimum.toString()} ${sizing?.unit}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Eilutė privalo prasidėti "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Eilutė privalo įtraukti "${_issue.includes}"`;
				if (_issue.format === "regex") return `Eilutė privalo atitikti ${_issue.pattern}`;
				return `Neteisingas ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Skaičius privalo būti ${issue.divisor} kartotinis.`;
			case "unrecognized_keys": return `Neatpažint${issue.keys.length > 1 ? "i" : "as"} rakt${issue.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return "Rastas klaidingas raktas";
			case "invalid_union": return "Klaidinga įvestis";
			case "invalid_element": {
				const origin = TypeDictionary[issue.origin] ?? issue.origin;
				return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi klaidingą įvestį`;
			}
			default: return "Klaidinga įvestis";
		}
	};
};
function lt_default() {
	return { localeError: error$28() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/mk.js
const error$27 = () => {
	const Sizable = {
		string: {
			unit: "знаци",
			verb: "да имаат"
		},
		file: {
			unit: "бајти",
			verb: "да имаат"
		},
		array: {
			unit: "ставки",
			verb: "да имаат"
		},
		set: {
			unit: "ставки",
			verb: "да имаат"
		},
		map: {
			unit: "ставки",
			verb: "да имаат"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "внес",
		email: "адреса на е-пошта",
		url: "URL",
		emoji: "емоџи",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO датум и време",
		date: "ISO датум",
		time: "ISO време",
		duration: "ISO времетраење",
		ipv4: "IPv4 адреса",
		ipv6: "IPv6 адреса",
		mac: "MAC адреса",
		cidrv4: "IPv4 опсег",
		cidrv6: "IPv6 опсег",
		base64: "base64-енкодирана низа",
		base64url: "base64url-енкодирана низа",
		json_string: "JSON низа",
		e164: "E.164 број",
		credit_card: "број на кредитна картичка",
		currency_code: "код на валута",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "внес"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "број",
		array: "низа"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Грешен внес: се очекува instanceof ${issue.expected}, примено ${received}`;
				return `Грешен внес: се очекува ${expected}, примено ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Грешана опција: се очекува една ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да има ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементи"}`;
				return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
				if (_issue.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Грешен број: мора да биде делив со ${issue.divisor}`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Грешен клуч во ${issue.origin}`;
			case "invalid_union": return "Грешен внес";
			case "invalid_element": return `Грешна вредност во ${issue.origin}`;
			default: return `Грешен внес`;
		}
	};
};
function mk_default() {
	return { localeError: error$27() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ms.js
const error$26 = () => {
	const Sizable = {
		string: {
			unit: "aksara",
			verb: "mempunyai"
		},
		file: {
			unit: "bait",
			verb: "mempunyai"
		},
		array: {
			unit: "elemen",
			verb: "mempunyai"
		},
		set: {
			unit: "elemen",
			verb: "mempunyai"
		},
		map: {
			unit: "elemen",
			verb: "mempunyai"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "alamat e-mel",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "tarikh masa ISO",
		date: "tarikh ISO",
		time: "masa ISO",
		duration: "tempoh ISO",
		ipv4: "alamat IPv4",
		ipv6: "alamat IPv6",
		mac: "alamat MAC",
		cidrv4: "julat IPv4",
		cidrv6: "julat IPv6",
		base64: "string dikodkan base64",
		base64url: "string dikodkan base64url",
		json_string: "string JSON",
		e164: "nombor E.164",
		credit_card: "nombor kad kredit",
		currency_code: "kod mata wang",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "nombor"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Input tidak sah: dijangka instanceof ${issue.expected}, diterima ${received}`;
				return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Input tidak sah: dijangka ${stringifyPrimitive(issue.values[0])}`;
				return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
				return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
				if (_issue.format === "includes") return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
				if (_issue.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} tidak sah`;
			}
			case "not_multiple_of": return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
			case "unrecognized_keys": return `Kunci tidak dikenali: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Kunci tidak sah dalam ${issue.origin}`;
			case "invalid_union": return "Input tidak sah";
			case "invalid_element": return `Nilai tidak sah dalam ${issue.origin}`;
			default: return `Input tidak sah`;
		}
	};
};
function ms_default() {
	return { localeError: error$26() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ne.js
const error$25 = () => {
	const Sizable = {
		string: {
			unit: "अक्षर",
			verb: "हुनुपर्छ"
		},
		file: {
			unit: "बाइट",
			verb: "हुनुपर्छ"
		},
		array: {
			unit: "तत्व",
			verb: "हुनुपर्छ"
		},
		set: {
			unit: "तत्व",
			verb: "हुनुपर्छ"
		},
		map: {
			unit: "प्रविष्टि",
			verb: "हुनुपर्छ"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "इनपुट",
		email: "इमेल ठेगाना",
		url: "URL",
		emoji: "इमोजी",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO मिति र समय",
		date: "ISO मिति",
		time: "ISO समय",
		duration: "ISO अवधि",
		ipv4: "IPv4 ठेगाना",
		ipv6: "IPv6 ठेगाना",
		mac: "MAC ठेगाना",
		cidrv4: "IPv4 दायरा",
		cidrv6: "IPv6 दायरा",
		base64: "base64-इन्कोड गरिएको स्ट्रिङ",
		base64url: "base64url-इन्कोड गरिएको स्ट्रिङ",
		json_string: "JSON स्ट्रिङ",
		e164: "E.164 नम्बर",
		credit_card: "क्रेडिट कार्ड नम्बर",
		currency_code: "मुद्रा कोड",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "इनपुट"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `अमान्य इनपुट: अपेक्षित ${expected}, प्राप्त ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `अमान्य इनपुट: अपेक्षित ${stringifyPrimitive(issue.values[0])}`;
				return `अमान्य विकल्प: अपेक्षित मानहरू मध्ये एक ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `धेरै ठूलो: ${issue.origin ?? "मान"} मा ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `धेरै ठूलो: ${issue.origin ?? "मान"} ${adj}${issue.maximum.toString()} हुनुपर्छ`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `धेरै सानो: ${issue.origin} मा ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `धेरै सानो: ${issue.origin} ${adj}${issue.minimum.toString()} हुनुपर्छ`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `अमान्य स्ट्रिङ: "${_issue.prefix}" बाट सुरु हुनुपर्छ`;
				if (_issue.format === "ends_with") return `अमान्य स्ट्रिङ: "${_issue.suffix}" मा समाप्त हुनुपर्छ`;
				if (_issue.format === "includes") return `अमान्य स्ट्रिङ: "${_issue.includes}" समावेश हुनुपर्छ`;
				if (_issue.format === "regex") return `अमान्य स्ट्रिङ: ढाँचा ${_issue.pattern} सँग मेल खानुपर्छ`;
				return `अमान्य ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `अमान्य संख्या: ${issue.divisor} को गुणज हुनुपर्छ`;
			case "unrecognized_keys": return `अपरिचित कुञ्जी${issue.keys.length > 1 ? "हरू" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `अमान्य कुञ्जी: ${issue.origin} मा`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `अमान्य डिस्क्रिमिनेटर मान: अपेक्षित ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "अमान्य इनपुट";
			case "invalid_element": return `अमान्य मान: ${issue.origin} मा`;
			default: return `अमान्य इनपुट`;
		}
	};
};
function ne_default() {
	return { localeError: error$25() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/nl.js
const error$24 = () => {
	const Sizable = {
		string: {
			unit: "tekens",
			verb: "heeft"
		},
		file: {
			unit: "bytes",
			verb: "heeft"
		},
		array: {
			unit: "elementen",
			verb: "heeft"
		},
		set: {
			unit: "elementen",
			verb: "heeft"
		},
		map: {
			unit: "elementen",
			verb: "heeft"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "invoer",
		email: "emailadres",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datum en tijd",
		date: "ISO datum",
		time: "ISO tijd",
		duration: "ISO duur",
		ipv4: "IPv4-adres",
		ipv6: "IPv6-adres",
		mac: "MAC-adres",
		cidrv4: "IPv4-bereik",
		cidrv6: "IPv6-bereik",
		base64: "base64-gecodeerde tekst",
		base64url: "base64 URL-gecodeerde tekst",
		json_string: "JSON string",
		e164: "E.164-nummer",
		credit_card: "creditcardnummer",
		currency_code: "valutacode",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "invoer"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "getal"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ongeldige invoer: verwacht instanceof ${issue.expected}, ontving ${received}`;
				return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue.values[0])}`;
				return `Ongeldige optie: verwacht één van ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				const longName = issue.origin === "date" ? "laat" : issue.origin === "string" ? "lang" : "groot";
				if (sizing) return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
				return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} is`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				const shortName = issue.origin === "date" ? "vroeg" : issue.origin === "string" ? "kort" : "klein";
				if (sizing) return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
				if (_issue.format === "ends_with") return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
				if (_issue.format === "includes") return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
				if (_issue.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
				return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
			case "unrecognized_keys": return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ongeldige key in ${issue.origin}`;
			case "invalid_union": return "Ongeldige invoer";
			case "invalid_element": return `Ongeldige waarde in ${issue.origin}`;
			default: return `Ongeldige invoer`;
		}
	};
};
function nl_default() {
	return { localeError: error$24() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/nn.js
const error$23 = () => {
	const Sizable = {
		string: {
			unit: "teikn",
			verb: "å ha"
		},
		file: {
			unit: "bytes",
			verb: "å ha"
		},
		array: {
			unit: "element",
			verb: "å innehalde"
		},
		set: {
			unit: "element",
			verb: "å innehalde"
		},
		map: {
			unit: "element",
			verb: "å innehalde"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "e-postadresse",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO dato- og klokkeslett",
		date: "ISO-dato",
		time: "ISO-klokkeslett",
		duration: "ISO-varigheit",
		ipv4: "IPv4-adresse",
		ipv6: "IPv6-adresse",
		mac: "MAC-adresse",
		cidrv4: "IPv4-spekter",
		cidrv6: "IPv6-spekter",
		base64: "base64-enkoda streng",
		base64url: "base64url-enkoda streng",
		json_string: "JSON-streng",
		e164: "E.164-nummer",
		credit_card: "kredittkortnummer",
		currency_code: "valutakode",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "tal",
		array: "liste"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ugyldig input: forventa instanceof ${issue.expected}, fekk ${received}`;
				return `Ugyldig input: forventa ${expected}, fekk ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ugyldig verdi: forventa ${stringifyPrimitive(issue.values[0])}`;
				return `Ugyldig val: forventa eitt av ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `For stor(t): forventa ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
				return `For stor(t): forventa ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `For lite(n): forventa ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `For lite(n): forventa ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ugyldig streng: må starte med "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ugyldig streng: må slutte med "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ugyldig streng: må innehalde "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
				return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ugyldig tal: må vere eit multiplum av ${issue.divisor}`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Ukjende nøklar" : "Ukjend nøkkel"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ugyldig nøkkel i ${issue.origin}`;
			case "invalid_union": return "Ugyldig input";
			case "invalid_element": return `Ugyldig verdi i ${issue.origin}`;
			default: return `Ugyldig input`;
		}
	};
};
function nn_default() {
	return { localeError: error$23() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/no.js
const error$22 = () => {
	const Sizable = {
		string: {
			unit: "tegn",
			verb: "å ha"
		},
		file: {
			unit: "bytes",
			verb: "å ha"
		},
		array: {
			unit: "elementer",
			verb: "å inneholde"
		},
		set: {
			unit: "elementer",
			verb: "å inneholde"
		},
		map: {
			unit: "elementer",
			verb: "å inneholde"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "e-postadresse",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO dato- og klokkeslett",
		date: "ISO-dato",
		time: "ISO-klokkeslett",
		duration: "ISO-varighet",
		ipv4: "IPv4-adresse",
		ipv6: "IPv6-adresse",
		mac: "MAC-adresse",
		cidrv4: "IPv4-spekter",
		cidrv6: "IPv6-spekter",
		base64: "base64-enkodet streng",
		base64url: "base64url-enkodet streng",
		json_string: "JSON-streng",
		e164: "E.164-nummer",
		credit_card: "kredittkortnummer",
		currency_code: "valutakode",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "tall",
		array: "liste"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ugyldig input: forventet instanceof ${issue.expected}, fikk ${received}`;
				return `Ugyldig input: forventet ${expected}, fikk ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ugyldig verdi: forventet ${stringifyPrimitive(issue.values[0])}`;
				return `Ugyldig valg: forventet en av ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
				return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ugyldig streng: må starte med "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ugyldig streng: må ende med "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ugyldig streng: må inneholde "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
				return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ugyldig nøkkel i ${issue.origin}`;
			case "invalid_union": return "Ugyldig input";
			case "invalid_element": return `Ugyldig verdi i ${issue.origin}`;
			default: return `Ugyldig input`;
		}
	};
};
function no_default() {
	return { localeError: error$22() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ota.js
const error$21 = () => {
	const Sizable = {
		string: {
			unit: "harf",
			verb: "olmalıdır"
		},
		file: {
			unit: "bayt",
			verb: "olmalıdır"
		},
		array: {
			unit: "unsur",
			verb: "olmalıdır"
		},
		set: {
			unit: "unsur",
			verb: "olmalıdır"
		},
		map: {
			unit: "unsur",
			verb: "olmalıdır"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "giren",
		email: "epostagâh",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO hengâmı",
		date: "ISO tarihi",
		time: "ISO zamanı",
		duration: "ISO müddeti",
		ipv4: "IPv4 nişânı",
		ipv6: "IPv6 nişânı",
		mac: "MAC nişânı",
		cidrv4: "IPv4 menzili",
		cidrv6: "IPv6 menzili",
		base64: "base64-şifreli metin",
		base64url: "base64url-şifreli metin",
		json_string: "JSON metin",
		e164: "E.164 sayısı",
		credit_card: "i'tibâr kartı numarası",
		currency_code: "para birimi kodu",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "giren"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "numara",
		array: "saf",
		null: "gayb"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Fâsit giren: umulan instanceof ${issue.expected}, alınan ${received}`;
				return `Fâsit giren: umulan ${expected}, alınan ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Fâsit giren: umulan ${stringifyPrimitive(issue.values[0])}`;
				return `Fâsit tercih: mûteberler ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
				return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
				return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
				if (_issue.format === "ends_with") return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
				if (_issue.format === "includes") return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
				if (_issue.format === "regex") return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
				return `Fâsit ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
			case "unrecognized_keys": return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} için tanınmayan anahtar var.`;
			case "invalid_union": return "Giren tanınamadı.";
			case "invalid_element": return `${issue.origin} için tanınmayan kıymet var.`;
			default: return `Kıymet tanınamadı.`;
		}
	};
};
function ota_default() {
	return { localeError: error$21() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ps.js
const error$20 = () => {
	const Sizable = {
		string: {
			unit: "توکي",
			verb: "ولري"
		},
		file: {
			unit: "بایټس",
			verb: "ولري"
		},
		array: {
			unit: "توکي",
			verb: "ولري"
		},
		set: {
			unit: "توکي",
			verb: "ولري"
		},
		map: {
			unit: "توکي",
			verb: "ولري"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ورودي",
		email: "بریښنالیک",
		url: "یو آر ال",
		emoji: "ایموجي",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "نیټه او وخت",
		date: "نېټه",
		time: "وخت",
		duration: "موده",
		ipv4: "د IPv4 پته",
		ipv6: "د IPv6 پته",
		mac: "د MAC پته",
		cidrv4: "د IPv4 ساحه",
		cidrv6: "د IPv6 ساحه",
		base64: "base64-encoded متن",
		base64url: "base64url-encoded متن",
		json_string: "JSON متن",
		e164: "د E.164 شمېره",
		credit_card: "د کریډیټ کارت شمیره",
		currency_code: "د اسعارو کوډ",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ورودي"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "عدد",
		array: "ارې"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `ناسم ورودي: باید instanceof ${issue.expected} وای, مګر ${received} ترلاسه شو`;
				return `ناسم ورودي: باید ${expected} وای, مګر ${received} ترلاسه شو`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `ناسم ورودي: باید ${stringifyPrimitive(issue.values[0])} وای`;
				return `ناسم انتخاب: باید یو له ${joinValues(issue.values, "|")} څخه وای`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
				return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} وي`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} ولري`;
				return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} وي`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
				if (_issue.format === "ends_with") return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
				if (_issue.format === "includes") return `ناسم متن: باید "${_issue.includes}" ولري`;
				if (_issue.format === "regex") return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
				return `${FormatDictionary[_issue.format] ?? issue.format} ناسم دی`;
			}
			case "not_multiple_of": return `ناسم عدد: باید د ${issue.divisor} مضرب وي`;
			case "unrecognized_keys": return `ناسم ${issue.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `ناسم کلیډ په ${issue.origin} کې`;
			case "invalid_union": return `ناسمه ورودي`;
			case "invalid_element": return `ناسم عنصر په ${issue.origin} کې`;
			default: return `ناسمه ورودي`;
		}
	};
};
function ps_default() {
	return { localeError: error$20() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/pl.js
const error$19 = () => {
	const Sizable = {
		string: {
			unit: "znaków",
			verb: "mieć"
		},
		file: {
			unit: "bajtów",
			verb: "mieć"
		},
		array: {
			unit: "elementów",
			verb: "mieć"
		},
		set: {
			unit: "elementów",
			verb: "mieć"
		},
		map: {
			unit: "elementów",
			verb: "mieć"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "wyrażenie",
		email: "adres email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "data i godzina w formacie ISO",
		date: "data w formacie ISO",
		time: "godzina w formacie ISO",
		duration: "czas trwania ISO",
		ipv4: "adres IPv4",
		ipv6: "adres IPv6",
		mac: "adres MAC",
		cidrv4: "zakres IPv4",
		cidrv6: "zakres IPv6",
		base64: "ciąg znaków zakodowany w formacie base64",
		base64url: "ciąg znaków zakodowany w formacie base64url",
		json_string: "ciąg znaków w formacie JSON",
		e164: "liczba E.164",
		credit_card: "numer karty kredytowej",
		currency_code: "kod waluty",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "wejście"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "liczba",
		array: "tablica"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${issue.expected}, otrzymano ${received}`;
				return `Nieprawidłowe dane wejściowe: oczekiwano ${expected}, otrzymano ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue.values[0])}`;
				return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Za duża wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementów"}`;
				return `Zbyt duż(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Za mała wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${sizing.unit ?? "elementów"}`;
				return `Zbyt mał(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
				if (_issue.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
				return `Nieprawidłow(y/a/e) ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
			case "unrecognized_keys": return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Nieprawidłowy klucz w ${issue.origin}`;
			case "invalid_union": return "Nieprawidłowe dane wejściowe";
			case "invalid_element": return `Nieprawidłowa wartość w ${issue.origin}`;
			default: return `Nieprawidłowe dane wejściowe`;
		}
	};
};
function pl_default() {
	return { localeError: error$19() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/pt.js
const error$18 = () => {
	const Sizable = {
		string: { unit: "caracteres" },
		file: { unit: "bytes" },
		array: { unit: "elementos" },
		set: { unit: "elementos" },
		map: { unit: "entradas" }
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "a entrada",
		email: "o endereço de e-mail",
		url: "o URL",
		emoji: "o emoji",
		uuid: "o UUID",
		uuidv4: "o UUIDv4",
		uuidv6: "o UUIDv6",
		nanoid: "o nanoid",
		guid: "o GUID",
		cuid: "o cuid",
		cuid2: "o cuid2",
		ulid: "o ULID",
		xid: "o XID",
		ksuid: "o KSUID",
		datetime: "a data e hora ISO",
		date: "a data ISO",
		time: "a hora ISO",
		duration: "a duração ISO",
		ipv4: "o endereço IPv4",
		ipv6: "o endereço IPv6",
		mac: "o endereço MAC",
		cidrv4: "o intervalo de endereços IPv4",
		cidrv6: "o intervalo de endereços IPv6",
		base64: "o texto codificado em base64",
		base64url: "o texto codificado em base64url",
		json_string: "o texto JSON",
		e164: "o número E.164",
		credit_card: "o número de cartão de crédito",
		currency_code: "o código de moeda",
		iban: "o IBAN",
		jwt: "o JWT",
		template_literal: "a entrada"
	};
	const Gender = {
		masculine: {
			definite: "o",
			indefinite: "um"
		},
		feminine: {
			definite: "a",
			indefinite: "uma"
		}
	};
	const TypeDictionary = {
		string: {
			name: "texto",
			articles: Gender.masculine
		},
		number: {
			name: "número",
			articles: Gender.masculine
		},
		int: {
			name: "número inteiro",
			articles: Gender.masculine
		},
		boolean: {
			name: "valor booleano",
			articles: Gender.masculine
		},
		bigint: {
			name: "número bigint",
			articles: Gender.masculine
		},
		symbol: {
			name: "símbolo",
			articles: Gender.masculine
		},
		undefined: {
			name: "valor \"undefined\"",
			articles: Gender.masculine
		},
		null: {
			name: "valor \"nulo\"",
			articles: Gender.masculine
		},
		never: {
			name: "valor \"never\"",
			articles: Gender.masculine
		},
		void: {
			name: "valor \"void\"",
			articles: Gender.masculine
		},
		date: {
			name: "data",
			articles: Gender.feminine
		},
		array: {
			name: "vetor",
			articles: Gender.masculine
		},
		object: {
			name: "objeto",
			articles: Gender.masculine
		},
		tuple: {
			name: "tuplo",
			articles: Gender.masculine
		},
		record: {
			name: "registo",
			articles: Gender.masculine
		},
		map: {
			name: "mapa",
			articles: Gender.masculine
		},
		set: {
			name: "conjunto",
			articles: Gender.masculine
		},
		file: {
			name: "ficheiro",
			articles: Gender.masculine
		},
		nonoptional: {
			name: "valor não opcional",
			articles: Gender.masculine
		},
		nan: {
			name: "valor \"NaN\"",
			articles: Gender.masculine
		},
		function: {
			name: "função",
			articles: Gender.feminine
		}
	};
	function translateOriginWithArticle(type, articleType) {
		const translatedValue = TypeDictionary[type] ?? {
			name: `valor "${type}"`,
			articles: Gender.masculine
		};
		return `${translatedValue.articles[articleType]} ${translatedValue.name}`;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Entrada inválida: esperava ${translateOriginWithArticle(issue.expected, "indefinite")}, recebeu ${translateOriginWithArticle(parsedType(issue.input), "indefinite")}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Entrada inválida: esperava ${stringifyPrimitive(issue.values[0])}`;
				return `Opção inválida: esperava uma das seguintes opções: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Demasiado grande: esperava que ${translateOriginWithArticle(issue.origin, "definite")} tivesse ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
				return `Demasiado grande: esperava que ${translateOriginWithArticle(issue.origin, "definite")} fosse ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Demasiado pequeno: esperava que ${translateOriginWithArticle(issue.origin, "definite")} tivesse ${adj} ${issue.minimum.toString()} ${sizing.unit ?? "elementos"}`;
				return `Demasiado pequeno: esperava que ${translateOriginWithArticle(issue.origin, "definite")} fosse ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Texto inválido: deve começar por "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Texto inválido: deve terminar em "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Texto inválido: deve incluir "${_issue.includes}"`;
				if (_issue.format === "regex") return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
				return `Formato d${FormatDictionary[_issue.format] ?? issue.format} inválido`;
			}
			case "not_multiple_of": return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
			case "unrecognized_keys": {
				const plural = issue.keys.length > 1 ? "s" : "";
				return `Chave${plural} inválida${plural}: ${joinValues(issue.keys, ", ")}`;
			}
			case "invalid_key": return `Entrada inválida n${translateOriginWithArticle(issue.origin, "definite")}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Valor de discriminação inválido. Esperava ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "Entrada inválida";
			case "invalid_element": return `Entrada inválida n${translateOriginWithArticle(issue.origin, "definite")}`;
			default: return `Entrada inválida`;
		}
	};
};
function pt_default() {
	return { localeError: error$18() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/pt-BR.js
const error$17 = () => {
	const Sizable = {
		string: { unit: "caracteres" },
		file: { unit: "bytes" },
		array: { unit: "elementos" },
		set: { unit: "elementos" },
		map: { unit: "entradas" }
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "a entrada",
		email: "o endereço de e-mail",
		url: "o URL",
		emoji: "o emoji",
		uuid: "o UUID",
		uuidv4: "o UUIDv4",
		uuidv6: "o UUIDv6",
		nanoid: "o nanoid",
		guid: "o GUID",
		cuid: "o cuid",
		cuid2: "o cuid2",
		ulid: "o ULID",
		xid: "o XID",
		ksuid: "o KSUID",
		datetime: "a data e hora ISO",
		date: "a data ISO",
		time: "a hora ISO",
		duration: "a duração ISO",
		ipv4: "o endereço IPv4",
		ipv6: "o endereço IPv6",
		mac: "o endereço MAC",
		cidrv4: "a faixa de endereços IPv4",
		cidrv6: "a faixa de endereços IPv6",
		base64: "o texto codificado em base64",
		base64url: "o texto codificado em base64url",
		json_string: "o texto JSON",
		e164: "o número E.164",
		credit_card: "o número de cartão de crédito",
		currency_code: "o código de moeda",
		iban: "o IBAN",
		jwt: "o JWT",
		template_literal: "a entrada"
	};
	const Gender = {
		masculine: {
			definite: "o",
			indefinite: "um"
		},
		feminine: {
			definite: "a",
			indefinite: "uma"
		}
	};
	const TypeDictionary = {
		string: {
			name: "texto",
			articles: Gender.masculine
		},
		number: {
			name: "número",
			articles: Gender.masculine
		},
		int: {
			name: "número inteiro",
			articles: Gender.masculine
		},
		boolean: {
			name: "valor booleano",
			articles: Gender.masculine
		},
		bigint: {
			name: "número bigint",
			articles: Gender.masculine
		},
		symbol: {
			name: "símbolo",
			articles: Gender.masculine
		},
		undefined: {
			name: "valor \"undefined\"",
			articles: Gender.masculine
		},
		null: {
			name: "valor \"nulo\"",
			articles: Gender.masculine
		},
		never: {
			name: "valor \"never\"",
			articles: Gender.masculine
		},
		void: {
			name: "valor \"void\"",
			articles: Gender.masculine
		},
		date: {
			name: "data",
			articles: Gender.feminine
		},
		array: {
			name: "vetor",
			articles: Gender.masculine
		},
		object: {
			name: "objeto",
			articles: Gender.masculine
		},
		tuple: {
			name: "tupla",
			articles: Gender.feminine
		},
		record: {
			name: "registro",
			articles: Gender.masculine
		},
		map: {
			name: "mapa",
			articles: Gender.masculine
		},
		set: {
			name: "conjunto",
			articles: Gender.masculine
		},
		file: {
			name: "arquivo",
			articles: Gender.masculine
		},
		nonoptional: {
			name: "valor não opcional",
			articles: Gender.masculine
		},
		nan: {
			name: "valor \"NaN\"",
			articles: Gender.masculine
		},
		function: {
			name: "função",
			articles: Gender.feminine
		}
	};
	function translateOriginWithArticle(type, articleType) {
		const translatedValue = TypeDictionary[type] ?? {
			name: `valor "${type}"`,
			articles: Gender.masculine
		};
		return `${translatedValue.articles[articleType]} ${translatedValue.name}`;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Entrada inválida: esperava ${translateOriginWithArticle(issue.expected, "indefinite")}, recebeu ${translateOriginWithArticle(parsedType(issue.input), "indefinite")}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Entrada inválida: esperava ${stringifyPrimitive(issue.values[0])}`;
				return `Opção inválida: esperava uma das seguintes opções: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Grande demais: esperava que ${translateOriginWithArticle(issue.origin, "definite")} tivesse ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
				return `Grande demais: esperava que ${translateOriginWithArticle(issue.origin, "definite")} fosse ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Pequeno demais: esperava que ${translateOriginWithArticle(issue.origin, "definite")} tivesse ${adj} ${issue.minimum.toString()} ${sizing.unit ?? "elementos"}`;
				return `Pequeno demais: esperava que ${translateOriginWithArticle(issue.origin, "definite")} fosse ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Texto inválido: deve começar com "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Texto inválido: deve terminar com "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Texto inválido: deve incluir "${_issue.includes}"`;
				if (_issue.format === "regex") return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
				return `Formato d${FormatDictionary[_issue.format] ?? issue.format} inválido`;
			}
			case "not_multiple_of": return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
			case "unrecognized_keys": {
				const plural = issue.keys.length > 1 ? "s" : "";
				return `Chave${plural} inválida${plural}: ${joinValues(issue.keys, ", ")}`;
			}
			case "invalid_key": return `Entrada inválida n${translateOriginWithArticle(issue.origin, "definite")}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Valor de discriminação inválido. Esperava ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				return "Entrada inválida";
			case "invalid_element": return `Entrada inválida n${translateOriginWithArticle(issue.origin, "definite")}`;
			default: return `Entrada inválida`;
		}
	};
};
function pt_BR_default() {
	return { localeError: error$17() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ro.js
const error$16 = () => {
	const Sizable = {
		string: {
			unit: "caractere",
			verb: "să aibă"
		},
		file: {
			unit: "octeți",
			verb: "să aibă"
		},
		array: {
			unit: "elemente",
			verb: "să aibă"
		},
		set: {
			unit: "elemente",
			verb: "să aibă"
		},
		map: {
			unit: "intrări",
			verb: "să aibă"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "intrare",
		email: "adresă de email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "dată și oră ISO",
		date: "dată ISO",
		time: "oră ISO",
		duration: "durată ISO",
		ipv4: "adresă IPv4",
		ipv6: "adresă IPv6",
		mac: "adresă MAC",
		cidrv4: "interval IPv4",
		cidrv6: "interval IPv6",
		base64: "șir codat base64",
		base64url: "șir codat base64url",
		json_string: "șir JSON",
		e164: "număr E.164",
		credit_card: "număr de card de credit",
		currency_code: "cod valutar",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "intrare"
	};
	const TypeDictionary = {
		nan: "NaN",
		string: "șir",
		number: "număr",
		boolean: "boolean",
		function: "funcție",
		array: "matrice",
		object: "obiect",
		undefined: "nedefinit",
		symbol: "simbol",
		bigint: "număr mare",
		void: "void",
		never: "never",
		map: "hartă",
		set: "set"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `Intrare invalidă: așteptat ${expected}, primit ${TypeDictionary[receivedType] ?? receivedType}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Intrare invalidă: așteptat ${stringifyPrimitive(issue.values[0])}`;
				return `Opțiune invalidă: așteptat una dintre ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Prea mare: așteptat ca ${issue.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemente"}`;
				return `Prea mare: așteptat ca ${issue.origin ?? "valoarea"} să fie ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Prea mic: așteptat ca ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Prea mic: așteptat ca ${issue.origin} să fie ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Șir invalid: trebuie să înceapă cu "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Șir invalid: trebuie să se termine cu "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Șir invalid: trebuie să includă "${_issue.includes}"`;
				if (_issue.format === "regex") return `Șir invalid: trebuie să se potrivească cu modelul ${_issue.pattern}`;
				return `Format invalid: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Număr invalid: trebuie să fie multiplu de ${issue.divisor}`;
			case "unrecognized_keys": return `Chei nerecunoscute: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Cheie invalidă în ${issue.origin}`;
			case "invalid_union": return "Intrare invalidă";
			case "invalid_element": return `Valoare invalidă în ${issue.origin}`;
			default: return `Intrare invalidă`;
		}
	};
};
function ro_default() {
	return { localeError: error$16() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ru.js
function getRussianPlural(count, one, few, many) {
	const absCount = Math.abs(count);
	const lastDigit = absCount % 10;
	const lastTwoDigits = absCount % 100;
	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return many;
	if (lastDigit === 1) return one;
	if (lastDigit >= 2 && lastDigit <= 4) return few;
	return many;
}
const error$15 = () => {
	const Sizable = {
		string: {
			unit: {
				one: "символ",
				few: "символа",
				many: "символов"
			},
			verb: "иметь"
		},
		file: {
			unit: {
				one: "байт",
				few: "байта",
				many: "байт"
			},
			verb: "иметь"
		},
		array: {
			unit: {
				one: "элемент",
				few: "элемента",
				many: "элементов"
			},
			verb: "иметь"
		},
		set: {
			unit: {
				one: "элемент",
				few: "элемента",
				many: "элементов"
			},
			verb: "иметь"
		},
		map: {
			unit: {
				one: "элемент",
				few: "элемента",
				many: "элементов"
			},
			verb: "иметь"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ввод",
		email: "email адрес",
		url: "URL",
		emoji: "эмодзи",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO дата и время",
		date: "ISO дата",
		time: "ISO время",
		duration: "ISO длительность",
		ipv4: "IPv4 адрес",
		ipv6: "IPv6 адрес",
		mac: "MAC адрес",
		cidrv4: "IPv4 диапазон",
		cidrv6: "IPv6 диапазон",
		base64: "строка в формате base64",
		base64url: "строка в формате base64url",
		json_string: "JSON строка",
		e164: "номер E.164",
		credit_card: "номер кредитной карты",
		currency_code: "код валюты",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ввод"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "число",
		array: "массив"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Неверный ввод: ожидалось instanceof ${issue.expected}, получено ${received}`;
				return `Неверный ввод: ожидалось ${expected}, получено ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Неверный ввод: ожидалось ${stringifyPrimitive(issue.values[0])}`;
				return `Неверный вариант: ожидалось одно из ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getRussianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
					return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
				}
				return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) {
					const unit = getRussianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
					return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
				}
				return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Неверная строка: должна содержать "${_issue.includes}"`;
				if (_issue.format === "regex") return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
				return `Неверный ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Неверное число: должно быть кратным ${issue.divisor}`;
			case "unrecognized_keys": return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Неверный ключ в ${issue.origin}`;
			case "invalid_union": return "Неверные входные данные";
			case "invalid_element": return `Неверное значение в ${issue.origin}`;
			default: return `Неверные входные данные`;
		}
	};
};
function ru_default() {
	return { localeError: error$15() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/sk.js
const error$14 = () => {
	const Sizable = {
		string: {
			unit: "znakov",
			verb: "mať"
		},
		file: {
			unit: "bajtov",
			verb: "mať"
		},
		array: {
			unit: "prvkov",
			verb: "mať"
		},
		set: {
			unit: "prvkov",
			verb: "mať"
		},
		map: {
			unit: "položiek",
			verb: "mať"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "regulárny výraz",
		email: "e-mailová adresa",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "dátum a čas vo formáte ISO",
		date: "dátum vo formáte ISO",
		time: "čas vo formáte ISO",
		duration: "doba trvania ISO",
		ipv4: "IPv4 adresa",
		ipv6: "IPv6 adresa",
		mac: "MAC adresa",
		cidrv4: "rozsah IPv4",
		cidrv6: "rozsah IPv6",
		base64: "reťazec zakódovaný vo formáte base64",
		base64url: "reťazec zakódovaný vo formáte base64url",
		json_string: "reťazec vo formáte JSON",
		e164: "číslo E.164",
		credit_card: "číslo kreditnej karty",
		currency_code: "kód meny",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "vstup"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "číslo",
		string: "reťazec",
		function: "funkcia",
		array: "pole"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Neplatný vstup: očakávané instanceof ${issue.expected}, obdržané ${received}`;
				return `Neplatný vstup: očakávané ${expected}, obdržané ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Neplatný vstup: očakávané ${stringifyPrimitive(issue.values[0])}`;
				return `Neplatný vstup: očakávaná jedna z hodnôt ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Hodnota je príliš veľká: ${issue.origin ?? "hodnota"} musí mať ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvkov"}`;
				return `Hodnota je príliš veľká: ${issue.origin ?? "hodnota"} musí byť ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Hodnota je príliš malá: ${issue.origin ?? "hodnota"} musí mať ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvkov"}`;
				return `Hodnota je príliš malá: ${issue.origin ?? "hodnota"} musí byť ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Neplatný reťazec: musí začínať na "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Neplatný reťazec: musí končiť na "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Neplatný reťazec: musí obsahovať "${_issue.includes}"`;
				if (_issue.format === "regex") return `Neplatný reťazec: musí zodpovedať vzoru ${_issue.pattern}`;
				return `Neplatný formát ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Neplatné číslo: musí byť násobkom ${issue.divisor}`;
			case "unrecognized_keys": return `Neznáme klúče: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Neplatný klúč v ${issue.origin}`;
			case "invalid_union": return "Neplatný vstup";
			case "invalid_element": return `Neplatná hodnota v ${issue.origin}`;
			default: return `Neplatný vstup`;
		}
	};
};
function sk_default() {
	return { localeError: error$14() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/sl.js
const error$13 = () => {
	const Sizable = {
		string: {
			unit: "znakov",
			verb: "imeti"
		},
		file: {
			unit: "bajtov",
			verb: "imeti"
		},
		array: {
			unit: "elementov",
			verb: "imeti"
		},
		set: {
			unit: "elementov",
			verb: "imeti"
		},
		map: {
			unit: "elementov",
			verb: "imeti"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "vnos",
		email: "e-poštni naslov",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datum in čas",
		date: "ISO datum",
		time: "ISO čas",
		duration: "ISO trajanje",
		ipv4: "IPv4 naslov",
		ipv6: "IPv6 naslov",
		mac: "MAC naslov",
		cidrv4: "obseg IPv4",
		cidrv6: "obseg IPv6",
		base64: "base64 kodiran niz",
		base64url: "base64url kodiran niz",
		json_string: "JSON niz",
		e164: "E.164 številka",
		credit_card: "številka kreditne kartice",
		currency_code: "koda valute",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "vnos"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "število",
		array: "tabela"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Neveljaven vnos: pričakovano instanceof ${issue.expected}, prejeto ${received}`;
				return `Neveljaven vnos: pričakovano ${expected}, prejeto ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue.values[0])}`;
				return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
				return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
				if (_issue.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
				return `Neveljaven ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
			case "unrecognized_keys": return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Neveljaven ključ v ${issue.origin}`;
			case "invalid_union": return "Neveljaven vnos";
			case "invalid_element": return `Neveljavna vrednost v ${issue.origin}`;
			default: return "Neveljaven vnos";
		}
	};
};
function sl_default() {
	return { localeError: error$13() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/sv.js
const error$12 = () => {
	const Sizable = {
		string: {
			unit: "tecken",
			verb: "att ha"
		},
		file: {
			unit: "bytes",
			verb: "att ha"
		},
		array: {
			unit: "objekt",
			verb: "att innehålla"
		},
		set: {
			unit: "objekt",
			verb: "att innehålla"
		},
		map: {
			unit: "objekt",
			verb: "att innehålla"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "reguljärt uttryck",
		email: "e-postadress",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO-datum och tid",
		date: "ISO-datum",
		time: "ISO-tid",
		duration: "ISO-varaktighet",
		ipv4: "IPv4-adress",
		ipv6: "IPv6-adress",
		mac: "MAC-adress",
		cidrv4: "IPv4-spektrum",
		cidrv6: "IPv6-spektrum",
		base64: "base64-kodad sträng",
		base64url: "base64url-kodad sträng",
		json_string: "JSON-sträng",
		e164: "E.164-nummer",
		credit_card: "kreditkortsnummer",
		currency_code: "valutakod",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "mall-literal"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "antal",
		array: "lista"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ogiltig inmatning: förväntat instanceof ${issue.expected}, fick ${received}`;
				return `Ogiltig inmatning: förväntat ${expected}, fick ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue.values[0])}`;
				return `Ogiltigt val: förväntade en av ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `För stor(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
				return `För stor(t): förväntat ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
				return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Ogiltigt tal: måste vara en multipel av ${issue.divisor}`;
			case "unrecognized_keys": return `${issue.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Ogiltig nyckel i ${issue.origin ?? "värdet"}`;
			case "invalid_union": return "Ogiltig input";
			case "invalid_element": return `Ogiltigt värde i ${issue.origin ?? "värdet"}`;
			default: return `Ogiltig input`;
		}
	};
};
function sv_default() {
	return { localeError: error$12() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ta.js
const error$11 = () => {
	const Sizable = {
		string: {
			unit: "எழுத்துக்கள்",
			verb: "கொண்டிருக்க வேண்டும்"
		},
		file: {
			unit: "பைட்டுகள்",
			verb: "கொண்டிருக்க வேண்டும்"
		},
		array: {
			unit: "உறுப்புகள்",
			verb: "கொண்டிருக்க வேண்டும்"
		},
		set: {
			unit: "உறுப்புகள்",
			verb: "கொண்டிருக்க வேண்டும்"
		},
		map: {
			unit: "உறுப்புகள்",
			verb: "கொண்டிருக்க வேண்டும்"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "உள்ளீடு",
		email: "மின்னஞ்சல் முகவரி",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO தேதி நேரம்",
		date: "ISO தேதி",
		time: "ISO நேரம்",
		duration: "ISO கால அளவு",
		ipv4: "IPv4 முகவரி",
		ipv6: "IPv6 முகவரி",
		mac: "MAC முகவரி",
		cidrv4: "IPv4 வரம்பு",
		cidrv6: "IPv6 வரம்பு",
		base64: "base64-encoded சரம்",
		base64url: "base64url-encoded சரம்",
		json_string: "JSON சரம்",
		e164: "E.164 எண்",
		credit_card: "கடன் அட்டை எண்",
		currency_code: "நாணயக் குறியீடு",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "எண்",
		array: "அணி",
		null: "வெறுமை"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${issue.expected}, பெறப்பட்டது ${received}`;
				return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${expected}, பெறப்பட்டது ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue.values[0])}`;
				return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue.values, "|")} இல் ஒன்று`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
				return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
				return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
				if (_issue.format === "ends_with") return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
				if (_issue.format === "includes") return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
				if (_issue.format === "regex") return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
				return `தவறான ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
			case "unrecognized_keys": return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} இல் தவறான விசை`;
			case "invalid_union": return "தவறான உள்ளீடு";
			case "invalid_element": return `${issue.origin} இல் தவறான மதிப்பு`;
			default: return `தவறான உள்ளீடு`;
		}
	};
};
function ta_default() {
	return { localeError: error$11() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/tg.js
const error$10 = () => {
	const Sizable = {
		string: {
			unit: "аломат",
			verb: "дошта бошад"
		},
		file: {
			unit: "байт",
			verb: "дошта бошад"
		},
		array: {
			unit: "унсур",
			verb: "дошта бошад"
		},
		set: {
			unit: "унсур",
			verb: "дошта бошад"
		},
		map: {
			unit: "сабт",
			verb: "дошта бошад"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "вуруд",
		email: "суроғаи email",
		url: "URL",
		emoji: "эмоҷи",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "санаву вақти ISO",
		date: "санаи ISO",
		time: "вақти ISO",
		duration: "давомнокии ISO",
		ipv4: "суроғаи IPv4",
		ipv6: "суроғаи IPv6",
		mac: "суроғаи MAC",
		cidrv4: "маҳдудаи IPv4",
		cidrv6: "маҳдудаи IPv6",
		base64: "сатри дар формати base64",
		base64url: "сатри дар формати base64url",
		json_string: "сатри JSON",
		e164: "рақами E.164",
		credit_card: "рақами корти кредитӣ",
		currency_code: "рамзи асъор",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "вуруд"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "рақам",
		string: "сатр",
		array: "массив",
		object: "объект",
		date: "сана"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `Вуруди нодуруст: ${expected} интизор мерафт, ${TypeDictionary[receivedType] ?? receivedType} гирифта шуд`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Вуруди нодуруст: ${stringifyPrimitive(issue.values[0])} интизор мерафт`;
				return `Интихоби нодуруст: яке аз ${joinValues(issue.values, "|")} интизор мерафт`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Хеле калон: ${issue.origin ?? "қимат"} бояд ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `Хеле калон: ${issue.origin ?? "қимат"} бояд ${adj}${issue.maximum.toString()} бошад`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Хеле хурд: ${issue.origin} бояд ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `Хеле хурд: ${issue.origin} бояд ${adj}${issue.minimum.toString()} бошад`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Сатри нодуруст: бояд бо "${_issue.prefix}" оғоз шавад`;
				if (_issue.format === "ends_with") return `Сатри нодуруст: бояд бо "${_issue.suffix}" анҷом ёбад`;
				if (_issue.format === "includes") return `Сатри нодуруст: бояд "${_issue.includes}"-ро дар бар гирад`;
				if (_issue.format === "regex") return `Сатри нодуруст: бояд ба намунаи ${_issue.pattern} мувофиқат кунад`;
				return `${FormatDictionary[_issue.format] ?? issue.format}-и нодуруст`;
			}
			case "not_multiple_of": return `Рақами нодуруст: бояд ба ${issue.divisor} бе бақия тақсим шавад`;
			case "unrecognized_keys": return `Калид${issue.keys.length > 1 ? "ҳои" : "и"} номаълум: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Калиди нодуруст дар ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Қимати нодурусти дискриминатор: ${issue.options.map((o) => `'${o}'`).join(" | ")} интизор мерафт`;
				return "Вуруди нодуруст";
			case "invalid_element": return `Қимати нодуруст дар ${issue.origin}`;
			default: return `Вуруди нодуруст`;
		}
	};
};
function tg_default() {
	return { localeError: error$10() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/th.js
const error$9 = () => {
	const Sizable = {
		string: {
			unit: "ตัวอักษร",
			verb: "ควรมี"
		},
		file: {
			unit: "ไบต์",
			verb: "ควรมี"
		},
		array: {
			unit: "รายการ",
			verb: "ควรมี"
		},
		set: {
			unit: "รายการ",
			verb: "ควรมี"
		},
		map: {
			unit: "รายการ",
			verb: "ควรมี"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ข้อมูลที่ป้อน",
		email: "ที่อยู่อีเมล",
		url: "URL",
		emoji: "อิโมจิ",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "วันที่เวลาแบบ ISO",
		date: "วันที่แบบ ISO",
		time: "เวลาแบบ ISO",
		duration: "ช่วงเวลาแบบ ISO",
		ipv4: "ที่อยู่ IPv4",
		ipv6: "ที่อยู่ IPv6",
		mac: "ที่อยู่ MAC",
		cidrv4: "ช่วง IP แบบ IPv4",
		cidrv6: "ช่วง IP แบบ IPv6",
		base64: "ข้อความแบบ Base64",
		base64url: "ข้อความแบบ Base64 สำหรับ URL",
		json_string: "ข้อความแบบ JSON",
		e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
		credit_card: "หมายเลขบัตรเครดิต",
		currency_code: "รหัสสกุลเงิน",
		iban: "IBAN",
		jwt: "โทเคน JWT",
		template_literal: "ข้อมูลที่ป้อน"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "ตัวเลข",
		array: "อาร์เรย์ (Array)",
		null: "ไม่มีค่า (null)"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${issue.expected} แต่ได้รับ ${received}`;
				return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${expected} แต่ได้รับ ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue.values[0])}`;
				return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
				const sizing = getSizing(issue.origin);
				if (sizing) return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
				return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
				const sizing = getSizing(issue.origin);
				if (sizing) return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
				if (_issue.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
				if (_issue.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
				return `รูปแบบไม่ถูกต้อง: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
			case "unrecognized_keys": return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
			case "invalid_union": return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
			case "invalid_element": return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
			default: return `ข้อมูลไม่ถูกต้อง`;
		}
	};
};
function th_default() {
	return { localeError: error$9() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/tk.js
const error$8 = () => {
	const Sizable = {
		string: {
			unit: "simwol",
			verb: "bolmaly"
		},
		file: {
			unit: "baýt",
			verb: "bolmaly"
		},
		array: {
			unit: "elementler",
			verb: "bolmaly"
		},
		set: {
			unit: "elementler",
			verb: "bolmaly"
		},
		map: {
			unit: "elementler",
			verb: "bolmaly"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "giriş",
		email: "e-poçta salgysy",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO sene we wagt",
		date: "ISO sene",
		time: "ISO wagt",
		duration: "ISO wagt aralygy",
		ipv4: "IPv4 salgysy",
		ipv6: "IPv6 salgysy",
		mac: "MAC salgysy",
		cidrv4: "IPv4 aralygy",
		cidrv6: "IPv6 aralygy",
		base64: "base64 bilen şifrlenen setir",
		base64url: "base64url bilen şifrlenen setir",
		json_string: "JSON setiri",
		e164: "E.164 nomeri",
		credit_card: "kredit kartynyň nomeri",
		currency_code: "walýuta kody",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "şablon"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				return `Nädogry baha: garaşylan ${expected} ýerine ${TypeDictionary[receivedType] ?? receivedType} alyndy`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Nädogry baha: ${stringifyPrimitive(issue.values[0])} bolmaly`;
				return `Nädogry saýlaw: aşakdakylardan biri bolmaly: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Has uly: garaşylýan ${issue.origin ?? "baha"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
				return `Has uly: garaşylýan ${issue.origin ?? "baha"} ${adj} ${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Has kiçi: garaşylýan ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
				return `Has kiçi: garaşylýan ${issue.origin} ${adj} ${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Nädogry setir: "${_issue.prefix}" bilen başlamaly`;
				if (_issue.format === "ends_with") return `Nädogry setir: "${_issue.suffix}" bilen gutarmaly`;
				if (_issue.format === "includes") return `Nädogry setir: "${_issue.includes}" saklamaly`;
				if (_issue.format === "regex") return `Nädogry setir: ${_issue.pattern} nusga laýyk bolmaly`;
				return `Nädogry ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Nädogry san: ${issue.divisor} bilen galyndysyz bölünmeli`;
			case "unrecognized_keys": return `Tanalmaýan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} içinde nädogry açar`;
			case "invalid_union": return "Nädogry baha";
			case "invalid_element": return `${issue.origin} içinde nädogry baha`;
			default: return `Nädogry baha`;
		}
	};
};
function tk_default() {
	return { localeError: error$8() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/tr.js
const error$7 = () => {
	const Sizable = {
		string: {
			unit: "karakter",
			verb: "olmalı"
		},
		file: {
			unit: "bayt",
			verb: "olmalı"
		},
		array: {
			unit: "öğe",
			verb: "olmalı"
		},
		set: {
			unit: "öğe",
			verb: "olmalı"
		},
		map: {
			unit: "öğe",
			verb: "olmalı"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "girdi",
		email: "e-posta adresi",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO tarih ve saat",
		date: "ISO tarih",
		time: "ISO saat",
		duration: "ISO süre",
		ipv4: "IPv4 adresi",
		ipv6: "IPv6 adresi",
		mac: "MAC adresi",
		cidrv4: "IPv4 aralığı",
		cidrv6: "IPv6 aralığı",
		base64: "base64 ile şifrelenmiş metin",
		base64url: "base64url ile şifrelenmiş metin",
		json_string: "JSON dizesi",
		e164: "E.164 sayısı",
		credit_card: "kredi kartı numarası",
		currency_code: "para birimi kodu",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "Şablon dizesi"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Geçersiz değer: beklenen instanceof ${issue.expected}, alınan ${received}`;
				return `Geçersiz değer: beklenen ${expected}, alınan ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Geçersiz değer: beklenen ${stringifyPrimitive(issue.values[0])}`;
				return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "öğe"}`;
				return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
				if (_issue.format === "ends_with") return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
				if (_issue.format === "includes") return `Geçersiz metin: "${_issue.includes}" içermeli`;
				if (_issue.format === "regex") return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
				return `Geçersiz ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
			case "unrecognized_keys": return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} içinde geçersiz anahtar`;
			case "invalid_union": return "Geçersiz değer";
			case "invalid_element": return `${issue.origin} içinde geçersiz değer`;
			default: return `Geçersiz değer`;
		}
	};
};
function tr_default() {
	return { localeError: error$7() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/uk.js
const error$6 = () => {
	const Sizable = {
		string: {
			unit: "символів",
			verb: "матиме"
		},
		file: {
			unit: "байтів",
			verb: "матиме"
		},
		array: {
			unit: "елементів",
			verb: "матиме"
		},
		set: {
			unit: "елементів",
			verb: "матиме"
		},
		map: {
			unit: "елементів",
			verb: "матиме"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "вхідні дані",
		email: "адреса електронної пошти",
		url: "URL",
		emoji: "емодзі",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "дата та час ISO",
		date: "дата ISO",
		time: "час ISO",
		duration: "тривалість ISO",
		ipv4: "адреса IPv4",
		ipv6: "адреса IPv6",
		mac: "адреса MAC",
		cidrv4: "діапазон IPv4",
		cidrv6: "діапазон IPv6",
		base64: "рядок у кодуванні base64",
		base64url: "рядок у кодуванні base64url",
		json_string: "рядок JSON",
		e164: "номер E.164",
		credit_card: "номер кредитної картки",
		currency_code: "код валюти",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "вхідні дані"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "число",
		array: "масив"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Неправильні вхідні дані: очікується instanceof ${issue.expected}, отримано ${received}`;
				return `Неправильні вхідні дані: очікується ${expected}, отримано ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue.values[0])}`;
				return `Неправильна опція: очікується одне з ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Занадто велике: очікується, що ${issue.origin ?? "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементів"}`;
				return `Занадто велике: очікується, що ${issue.origin ?? "значення"} буде ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Неправильний рядок: повинен містити "${_issue.includes}"`;
				if (_issue.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
				return `Неправильний ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Неправильне число: повинно бути кратним ${issue.divisor}`;
			case "unrecognized_keys": return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Неправильний ключ у ${issue.origin}`;
			case "invalid_union": return "Неправильні вхідні дані";
			case "invalid_element": return `Неправильне значення у ${issue.origin}`;
			default: return `Неправильні вхідні дані`;
		}
	};
};
function uk_default() {
	return { localeError: error$6() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ua.js
/** @deprecated Use `uk` instead. */
function ua_default() {
	return uk_default();
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/ur.js
const error$5 = () => {
	const Sizable = {
		string: {
			unit: "حروف",
			verb: "ہونا"
		},
		file: {
			unit: "بائٹس",
			verb: "ہونا"
		},
		array: {
			unit: "آئٹمز",
			verb: "ہونا"
		},
		set: {
			unit: "آئٹمز",
			verb: "ہونا"
		},
		map: {
			unit: "آئٹمز",
			verb: "ہونا"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ان پٹ",
		email: "ای میل ایڈریس",
		url: "یو آر ایل",
		emoji: "ایموجی",
		uuid: "یو یو آئی ڈی",
		uuidv4: "یو یو آئی ڈی وی 4",
		uuidv6: "یو یو آئی ڈی وی 6",
		nanoid: "نینو آئی ڈی",
		guid: "جی یو آئی ڈی",
		cuid: "سی یو آئی ڈی",
		cuid2: "سی یو آئی ڈی 2",
		ulid: "یو ایل آئی ڈی",
		xid: "ایکس آئی ڈی",
		ksuid: "کے ایس یو آئی ڈی",
		datetime: "آئی ایس او ڈیٹ ٹائم",
		date: "آئی ایس او تاریخ",
		time: "آئی ایس او وقت",
		duration: "آئی ایس او مدت",
		ipv4: "آئی پی وی 4 ایڈریس",
		ipv6: "آئی پی وی 6 ایڈریس",
		mac: "ایم اے سی ایڈریس",
		cidrv4: "آئی پی وی 4 رینج",
		cidrv6: "آئی پی وی 6 رینج",
		base64: "بیس 64 ان کوڈڈ سٹرنگ",
		base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
		json_string: "جے ایس او این سٹرنگ",
		e164: "ای 164 نمبر",
		credit_card: "کریڈٹ کارڈ نمبر",
		currency_code: "کرنسی کوڈ",
		iban: "IBAN",
		jwt: "جے ڈبلیو ٹی",
		template_literal: "ان پٹ"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "نمبر",
		array: "آرے",
		null: "نل"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `غلط ان پٹ: instanceof ${issue.expected} متوقع تھا، ${received} موصول ہوا`;
				return `غلط ان پٹ: ${expected} متوقع تھا، ${received} موصول ہوا`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `غلط ان پٹ: ${stringifyPrimitive(issue.values[0])} متوقع تھا`;
				return `غلط آپشن: ${joinValues(issue.values, "|")} میں سے ایک متوقع تھا`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `بہت بڑا: ${issue.origin ?? "ویلیو"} کے ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
				return `بہت بڑا: ${issue.origin ?? "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
				return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
				if (_issue.format === "ends_with") return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
				if (_issue.format === "includes") return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
				if (_issue.format === "regex") return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
				return `غلط ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
			case "unrecognized_keys": return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${joinValues(issue.keys, "، ")}`;
			case "invalid_key": return `${issue.origin} میں غلط کی`;
			case "invalid_union": return "غلط ان پٹ";
			case "invalid_element": return `${issue.origin} میں غلط ویلیو`;
			default: return `غلط ان پٹ`;
		}
	};
};
function ur_default() {
	return { localeError: error$5() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/uz.js
const error$4 = () => {
	const Sizable = {
		string: {
			unit: "belgi",
			verb: "bo‘lishi kerak"
		},
		file: {
			unit: "bayt",
			verb: "bo‘lishi kerak"
		},
		array: {
			unit: "element",
			verb: "bo‘lishi kerak"
		},
		set: {
			unit: "element",
			verb: "bo‘lishi kerak"
		},
		map: {
			unit: "yozuv",
			verb: "bo‘lishi kerak"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "kirish",
		email: "elektron pochta manzili",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO sana va vaqti",
		date: "ISO sana",
		time: "ISO vaqt",
		duration: "ISO davomiylik",
		ipv4: "IPv4 manzil",
		ipv6: "IPv6 manzil",
		mac: "MAC manzil",
		cidrv4: "IPv4 diapazon",
		cidrv6: "IPv6 diapazon",
		base64: "base64 kodlangan satr",
		base64url: "base64url kodlangan satr",
		json_string: "JSON satr",
		e164: "E.164 raqam",
		credit_card: "kredit karta raqami",
		currency_code: "valyuta kodi",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "kirish"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "raqam",
		array: "massiv"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Noto‘g‘ri kirish: kutilgan instanceof ${issue.expected}, qabul qilingan ${received}`;
				return `Noto‘g‘ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Noto‘g‘ri kirish: kutilgan ${stringifyPrimitive(issue.values[0])}`;
				return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
				return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Noto‘g‘ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
				if (_issue.format === "ends_with") return `Noto‘g‘ri satr: "${_issue.suffix}" bilan tugashi kerak`;
				if (_issue.format === "includes") return `Noto‘g‘ri satr: "${_issue.includes}" ni o‘z ichiga olishi kerak`;
				if (_issue.format === "regex") return `Noto‘g‘ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
				return `Noto‘g‘ri ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Noto‘g‘ri raqam: ${issue.divisor} ning karralisi bo‘lishi kerak`;
			case "unrecognized_keys": return `Noma’lum kalit${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} dagi kalit noto‘g‘ri`;
			case "invalid_union": return "Noto‘g‘ri kirish";
			case "invalid_element": return `${issue.origin} da noto‘g‘ri qiymat`;
			default: return `Noto‘g‘ri kirish`;
		}
	};
};
function uz_default() {
	return { localeError: error$4() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/vi.js
const error$3 = () => {
	const Sizable = {
		string: {
			unit: "ký tự",
			verb: "có"
		},
		file: {
			unit: "byte",
			verb: "có"
		},
		array: {
			unit: "phần tử",
			verb: "có"
		},
		set: {
			unit: "phần tử",
			verb: "có"
		},
		map: {
			unit: "phần tử",
			verb: "có"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "đầu vào",
		email: "địa chỉ email",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ngày giờ ISO",
		date: "ngày ISO",
		time: "giờ ISO",
		duration: "khoảng thời gian ISO",
		ipv4: "địa chỉ IPv4",
		ipv6: "địa chỉ IPv6",
		mac: "địa chỉ MAC",
		cidrv4: "dải IPv4",
		cidrv6: "dải IPv6",
		base64: "chuỗi mã hóa base64",
		base64url: "chuỗi mã hóa base64url",
		json_string: "chuỗi JSON",
		e164: "số E.164",
		credit_card: "số thẻ tín dụng",
		currency_code: "mã tiền tệ",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "đầu vào"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "số",
		array: "mảng"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Đầu vào không hợp lệ: mong đợi instanceof ${issue.expected}, nhận được ${received}`;
				return `Đầu vào không hợp lệ: mong đợi ${expected}, nhận được ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue.values[0])}`;
				return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
				return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
				if (_issue.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
				return `${FormatDictionary[_issue.format] ?? issue.format} không hợp lệ`;
			}
			case "not_multiple_of": return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
			case "unrecognized_keys": return `Khóa không được nhận dạng: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Khóa không hợp lệ trong ${issue.origin}`;
			case "invalid_union": return "Đầu vào không hợp lệ";
			case "invalid_element": return `Giá trị không hợp lệ trong ${issue.origin}`;
			default: return `Đầu vào không hợp lệ`;
		}
	};
};
function vi_default() {
	return { localeError: error$3() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/zh-CN.js
const error$2 = () => {
	const Sizable = {
		string: {
			unit: "字符",
			verb: "包含"
		},
		file: {
			unit: "字节",
			verb: "包含"
		},
		array: {
			unit: "项",
			verb: "包含"
		},
		set: {
			unit: "项",
			verb: "包含"
		},
		map: {
			unit: "项",
			verb: "包含"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "输入",
		email: "电子邮件",
		url: "URL",
		emoji: "表情符号",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO日期时间",
		date: "ISO日期",
		time: "ISO时间",
		duration: "ISO时长",
		ipv4: "IPv4地址",
		ipv6: "IPv6地址",
		mac: "MAC地址",
		cidrv4: "IPv4网段",
		cidrv6: "IPv6网段",
		base64: "base64编码字符串",
		base64url: "base64url编码字符串",
		json_string: "JSON字符串",
		e164: "E.164号码",
		credit_card: "信用卡号",
		currency_code: "货币代码",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "输入"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "数字",
		array: "数组",
		null: "空值(null)"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `无效输入：期望 instanceof ${issue.expected}，实际接收 ${received}`;
				return `无效输入：期望 ${expected}，实际接收 ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `无效输入：期望 ${stringifyPrimitive(issue.values[0])}`;
				return `无效选项：期望以下之一 ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "个元素"}`;
				return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `无效字符串：必须以 "${_issue.prefix}" 开头`;
				if (_issue.format === "ends_with") return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
				if (_issue.format === "includes") return `无效字符串：必须包含 "${_issue.includes}"`;
				if (_issue.format === "regex") return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
				return `无效${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `无效数字：必须是 ${issue.divisor} 的倍数`;
			case "unrecognized_keys": return `出现未知的键(key): ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `${issue.origin} 中的键(key)无效`;
			case "invalid_union": return "无效输入";
			case "invalid_element": return `${issue.origin} 中包含无效值(value)`;
			default: return `无效输入`;
		}
	};
};
function zh_CN_default() {
	return { localeError: error$2() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/zh-TW.js
const error$1 = () => {
	const Sizable = {
		string: {
			unit: "字元",
			verb: "擁有"
		},
		file: {
			unit: "位元組",
			verb: "擁有"
		},
		array: {
			unit: "項目",
			verb: "擁有"
		},
		set: {
			unit: "項目",
			verb: "擁有"
		},
		map: {
			unit: "項目",
			verb: "擁有"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "輸入",
		email: "郵件地址",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO 日期時間",
		date: "ISO 日期",
		time: "ISO 時間",
		duration: "ISO 期間",
		ipv4: "IPv4 位址",
		ipv6: "IPv6 位址",
		mac: "MAC 位址",
		cidrv4: "IPv4 範圍",
		cidrv6: "IPv6 範圍",
		base64: "base64 編碼字串",
		base64url: "base64url 編碼字串",
		json_string: "JSON 字串",
		e164: "E.164 數值",
		credit_card: "信用卡號",
		currency_code: "貨幣代碼",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "輸入"
	};
	const TypeDictionary = { nan: "NaN" };
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `無效的輸入值：預期為 instanceof ${issue.expected}，但收到 ${received}`;
				return `無效的輸入值：預期為 ${expected}，但收到 ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `無效的輸入值：預期為 ${stringifyPrimitive(issue.values[0])}`;
				return `無效的選項：預期為以下其中之一 ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "個元素"}`;
				return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
				if (_issue.format === "ends_with") return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
				if (_issue.format === "includes") return `無效的字串：必須包含 "${_issue.includes}"`;
				if (_issue.format === "regex") return `無效的字串：必須符合格式 ${_issue.pattern}`;
				return `無效的 ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `無效的數字：必須為 ${issue.divisor} 的倍數`;
			case "unrecognized_keys": return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${joinValues(issue.keys, "、")}`;
			case "invalid_key": return `${issue.origin} 中有無效的鍵值`;
			case "invalid_union": return "無效的輸入值";
			case "invalid_element": return `${issue.origin} 中有無效的值`;
			default: return `無效的輸入值`;
		}
	};
};
function zh_TW_default() {
	return { localeError: error$1() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/yo.js
const error = () => {
	const Sizable = {
		string: {
			unit: "àmi",
			verb: "ní"
		},
		file: {
			unit: "bytes",
			verb: "ní"
		},
		array: {
			unit: "nkan",
			verb: "ní"
		},
		set: {
			unit: "nkan",
			verb: "ní"
		},
		map: {
			unit: "nkan",
			verb: "ní"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "ẹ̀rọ ìbáwọlé",
		email: "àdírẹ́sì ìmẹ́lì",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "àkókò ISO",
		date: "ọjọ́ ISO",
		time: "àkókò ISO",
		duration: "àkókò tó pé ISO",
		ipv4: "àdírẹ́sì IPv4",
		ipv6: "àdírẹ́sì IPv6",
		mac: "àdírẹ́sì MAC",
		cidrv4: "àgbègbè IPv4",
		cidrv6: "àgbègbè IPv6",
		base64: "ọ̀rọ̀ tí a kọ́ ní base64",
		base64url: "ọ̀rọ̀ base64url",
		json_string: "ọ̀rọ̀ JSON",
		e164: "nọ́mbà E.164",
		credit_card: "nọmba kaadi gbese",
		currency_code: "koodu owó",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "ẹ̀rọ ìbáwọlé"
	};
	const TypeDictionary = {
		nan: "NaN",
		number: "nọ́mbà",
		array: "akopọ"
	};
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": {
				const expected = TypeDictionary[issue.expected] ?? issue.expected;
				const receivedType = parsedType(issue.input);
				const received = TypeDictionary[receivedType] ?? receivedType;
				if (/^[A-Z]/.test(issue.expected)) return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${issue.expected}, àmọ̀ a rí ${received}`;
				return `Ìbáwọlé aṣìṣe: a ní láti fi ${expected}, àmọ̀ a rí ${received}`;
			}
			case "invalid_value":
				if (issue.values.length === 1) return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue.values[0])}`;
				return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue.origin ?? "iye"} ${sizing.verb} ${adj}${issue.maximum} ${sizing.unit}`;
				return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue.maximum}`;
			}
			case "too_small": {
				const adj = issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Kéré ju: a ní láti jẹ́ pé ${issue.origin} ${sizing.verb} ${adj}${issue.minimum} ${sizing.unit}`;
				return `Kéré ju: a ní láti jẹ́ ${adj}${issue.minimum}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
				if (_issue.format === "regex") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
				return `Aṣìṣe: ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue.divisor}`;
			case "unrecognized_keys": return `Bọtìnì àìmọ̀: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Bọtìnì aṣìṣe nínú ${issue.origin}`;
			case "invalid_union": return "Ìbáwọlé aṣìṣe";
			case "invalid_element": return `Iye aṣìṣe nínú ${issue.origin}`;
			default: return "Ìbáwọlé aṣìṣe";
		}
	};
};
function yo_default() {
	return { localeError: error() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/index.js
var locales_exports = /* @__PURE__ */ __exportAll({
	ar: () => ar_default,
	az: () => az_default,
	be: () => be_default,
	bg: () => bg_default,
	bn: () => bn_default,
	ca: () => ca_default,
	ckb: () => ckb_default,
	cs: () => cs_default,
	da: () => da_default,
	de: () => de_default,
	el: () => el_default,
	en: () => en_default,
	eo: () => eo_default,
	es: () => es_default,
	fa: () => fa_default,
	fi: () => fi_default,
	fr: () => fr_default,
	frCA: () => fr_CA_default,
	gu: () => gu_default,
	he: () => he_default,
	hi: () => hi_default,
	hr: () => hr_default,
	hu: () => hu_default,
	hy: () => hy_default,
	id: () => id_default,
	is: () => is_default,
	it: () => it_default,
	ja: () => ja_default,
	ka: () => ka_default,
	kh: () => kh_default,
	km: () => km_default,
	kn: () => kn_default,
	ko: () => ko_default,
	lt: () => lt_default,
	mk: () => mk_default,
	ms: () => ms_default,
	ne: () => ne_default,
	nl: () => nl_default,
	nn: () => nn_default,
	no: () => no_default,
	ota: () => ota_default,
	pl: () => pl_default,
	ps: () => ps_default,
	pt: () => pt_default,
	ptBR: () => pt_BR_default,
	ro: () => ro_default,
	ru: () => ru_default,
	sk: () => sk_default,
	sl: () => sl_default,
	sv: () => sv_default,
	ta: () => ta_default,
	tg: () => tg_default,
	th: () => th_default,
	tk: () => tk_default,
	tr: () => tr_default,
	ua: () => ua_default,
	uk: () => uk_default,
	ur: () => ur_default,
	uz: () => uz_default,
	vi: () => vi_default,
	yo: () => yo_default,
	zhCN: () => zh_CN_default,
	zhTW: () => zh_TW_default
});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/json-schema-generator.js
/**
* Legacy class-based interface for JSON Schema generation.
* This class wraps the new functional implementation to provide backward compatibility.
*
* @deprecated Use the `toJSONSchema` function instead for new code.
*
* @example
* ```typescript
* // Legacy usage (still supported)
* const gen = new JSONSchemaGenerator({ target: "draft-07" });
* gen.process(schema);
* const result = gen.emit(schema);
*
* // Preferred modern usage
* const result = toJSONSchema(schema, { target: "draft-07" });
* ```
*/
var JSONSchemaGenerator = class {
	/** @deprecated Access via ctx instead */
	get metadataRegistry() {
		return this.ctx.metadataRegistry;
	}
	/** @deprecated Access via ctx instead */
	get target() {
		return this.ctx.target;
	}
	/** @deprecated Access via ctx instead */
	get unrepresentable() {
		return this.ctx.unrepresentable;
	}
	/** @deprecated Access via ctx instead */
	get override() {
		return this.ctx.override;
	}
	/** @deprecated Access via ctx instead */
	get io() {
		return this.ctx.io;
	}
	/** @deprecated Access via ctx instead */
	get counter() {
		return this.ctx.counter;
	}
	set counter(value) {
		this.ctx.counter = value;
	}
	/** @deprecated Access via ctx instead */
	get seen() {
		return this.ctx.seen;
	}
	constructor(params) {
		let normalizedTarget = params?.target ?? "draft-2020-12";
		if (normalizedTarget === "draft-4") normalizedTarget = "draft-04";
		if (normalizedTarget === "draft-7") normalizedTarget = "draft-07";
		this.ctx = initializeContext({
			processors: allProcessors,
			target: normalizedTarget,
			...params?.metadata && { metadata: params.metadata },
			...params?.unrepresentable && { unrepresentable: params.unrepresentable },
			...params?.override && { override: params.override },
			...params?.io && { io: params.io }
		});
	}
	/**
	* Process a schema to prepare it for JSON Schema generation.
	* This must be called before emit().
	*/
	process(schema, _params = {
		path: [],
		schemaPath: []
	}) {
		return processSchema(schema, this.ctx, _params);
	}
	/**
	* Emit the final JSON Schema after processing.
	* Must call process() first.
	*/
	emit(schema, _params) {
		if (_params) {
			if (_params.cycles) this.ctx.cycles = _params.cycles;
			if (_params.reused) this.ctx.reused = _params.reused;
			if (_params.external) this.ctx.external = _params.external;
		}
		this.ctx.sharedDefsExtractedFor = void 0;
		this.ctx.sharedEmitDoneFor = void 0;
		extractDefs(this.ctx, schema);
		const { "~standard": _, ...plainResult } = finalize(this.ctx, schema);
		return plainResult;
	}
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/json-schema.js
var json_schema_exports = /* @__PURE__ */ __exportAll({});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/index.js
var core_exports = /* @__PURE__ */ __exportAll({
	$ZodAny: () => $ZodAny,
	$ZodArray: () => $ZodArray,
	$ZodAsyncError: () => $ZodAsyncError,
	$ZodBase64: () => $ZodBase64,
	$ZodBase64URL: () => $ZodBase64URL,
	$ZodBigInt: () => $ZodBigInt,
	$ZodBigIntFormat: () => $ZodBigIntFormat,
	$ZodBoolean: () => $ZodBoolean,
	$ZodCIDRv4: () => $ZodCIDRv4,
	$ZodCIDRv6: () => $ZodCIDRv6,
	$ZodCUID: () => $ZodCUID,
	$ZodCUID2: () => $ZodCUID2,
	$ZodCatch: () => $ZodCatch,
	$ZodCheck: () => $ZodCheck,
	$ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
	$ZodCheckEndsWith: () => $ZodCheckEndsWith,
	$ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
	$ZodCheckIncludes: () => $ZodCheckIncludes,
	$ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
	$ZodCheckLessThan: () => $ZodCheckLessThan,
	$ZodCheckLowerCase: () => $ZodCheckLowerCase,
	$ZodCheckMaxLength: () => $ZodCheckMaxLength,
	$ZodCheckMaxSize: () => $ZodCheckMaxSize,
	$ZodCheckMimeType: () => $ZodCheckMimeType,
	$ZodCheckMinLength: () => $ZodCheckMinLength,
	$ZodCheckMinSize: () => $ZodCheckMinSize,
	$ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
	$ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
	$ZodCheckOverwrite: () => $ZodCheckOverwrite,
	$ZodCheckProperties: () => $ZodCheckProperties,
	$ZodCheckProperty: () => $ZodCheckProperty,
	$ZodCheckRegex: () => $ZodCheckRegex,
	$ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
	$ZodCheckStartsWith: () => $ZodCheckStartsWith,
	$ZodCheckStringFormat: () => $ZodCheckStringFormat,
	$ZodCheckUpperCase: () => $ZodCheckUpperCase,
	$ZodCodec: () => $ZodCodec,
	$ZodCreditCard: () => $ZodCreditCard,
	$ZodCustom: () => $ZodCustom,
	$ZodCustomStringFormat: () => $ZodCustomStringFormat,
	$ZodCyclicError: () => $ZodCyclicError,
	$ZodDate: () => $ZodDate,
	$ZodDefault: () => $ZodDefault,
	$ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
	$ZodE164: () => $ZodE164,
	$ZodEmail: () => $ZodEmail,
	$ZodEmoji: () => $ZodEmoji,
	$ZodEncodeError: () => $ZodEncodeError,
	$ZodEnum: () => $ZodEnum,
	$ZodError: () => $ZodError,
	$ZodExactOptional: () => $ZodExactOptional,
	$ZodFile: () => $ZodFile,
	$ZodFunction: () => $ZodFunction,
	$ZodGUID: () => $ZodGUID,
	$ZodIBAN: () => $ZodIBAN,
	$ZodIPv4: () => $ZodIPv4,
	$ZodIPv6: () => $ZodIPv6,
	$ZodISODate: () => $ZodISODate,
	$ZodISODateTime: () => $ZodISODateTime,
	$ZodISODuration: () => $ZodISODuration,
	$ZodISOTime: () => $ZodISOTime,
	$ZodIntersection: () => $ZodIntersection,
	$ZodJWT: () => $ZodJWT,
	$ZodKSUID: () => $ZodKSUID,
	$ZodLazy: () => $ZodLazy,
	$ZodLiteral: () => $ZodLiteral,
	$ZodMAC: () => $ZodMAC,
	$ZodMap: () => $ZodMap,
	$ZodNaN: () => $ZodNaN,
	$ZodNanoID: () => $ZodNanoID,
	$ZodNever: () => $ZodNever,
	$ZodNonOptional: () => $ZodNonOptional,
	$ZodNull: () => $ZodNull,
	$ZodNullable: () => $ZodNullable,
	$ZodNumber: () => $ZodNumber,
	$ZodNumberFormat: () => $ZodNumberFormat,
	$ZodObject: () => $ZodObject,
	$ZodObjectJIT: () => $ZodObjectJIT,
	$ZodOptional: () => $ZodOptional,
	$ZodPipe: () => $ZodPipe,
	$ZodPrefault: () => $ZodPrefault,
	$ZodPreprocess: () => $ZodPreprocess,
	$ZodPromise: () => $ZodPromise,
	$ZodReadonly: () => $ZodReadonly,
	$ZodRealError: () => $ZodRealError,
	$ZodRecord: () => $ZodRecord,
	$ZodRegistry: () => $ZodRegistry,
	$ZodSet: () => $ZodSet,
	$ZodString: () => $ZodString,
	$ZodStringFormat: () => $ZodStringFormat,
	$ZodSuccess: () => $ZodSuccess,
	$ZodSymbol: () => $ZodSymbol,
	$ZodTemplateLiteral: () => $ZodTemplateLiteral,
	$ZodTransform: () => $ZodTransform,
	$ZodTuple: () => $ZodTuple,
	$ZodType: () => $ZodType,
	$ZodULID: () => $ZodULID,
	$ZodURL: () => $ZodURL,
	$ZodUUID: () => $ZodUUID,
	$ZodUndefined: () => $ZodUndefined,
	$ZodUnion: () => $ZodUnion,
	$ZodUnknown: () => $ZodUnknown,
	$ZodVoid: () => $ZodVoid,
	$ZodXID: () => $ZodXID,
	$ZodXor: () => $ZodXor,
	$brand: () => $brand,
	$constructor: () => $constructor,
	$input: () => $input,
	$output: () => $output,
	Doc: () => Doc,
	INVALID: () => INVALID,
	JSONSchema: () => json_schema_exports,
	JSONSchemaGenerator: () => JSONSchemaGenerator,
	NEVER: () => NEVER,
	TimePrecision: () => TimePrecision,
	URL_BAD_FORMAT: () => 1,
	URL_UNPARSEABLE: () => 2,
	ZodCompileAsyncError: () => ZodCompileAsyncError,
	ZodCompileUnsupportedError: () => ZodCompileUnsupportedError,
	_any: () => _any,
	_array: () => _array,
	_base64: () => _base64,
	_base64url: () => _base64url,
	_bigint: () => _bigint,
	_boolean: () => _boolean,
	_catch: () => _catch,
	_check: () => _check,
	_cidrv4: () => _cidrv4,
	_cidrv6: () => _cidrv6,
	_coercedBigint: () => _coercedBigint,
	_coercedBoolean: () => _coercedBoolean,
	_coercedDate: () => _coercedDate,
	_coercedNumber: () => _coercedNumber,
	_coercedString: () => _coercedString,
	_creditCard: () => _creditCard,
	_cuid: () => _cuid,
	_cuid2: () => _cuid2,
	_custom: () => _custom,
	_date: () => _date,
	_decode: () => _decode,
	_decodeAsync: () => _decodeAsync,
	_default: () => _default,
	_discriminatedUnion: () => _discriminatedUnion,
	_e164: () => _e164,
	_email: () => _email,
	_emoji: () => _emoji,
	_encode: () => _encode,
	_encodeAsync: () => _encodeAsync,
	_endsWith: () => _endsWith,
	_enum: () => _enum,
	_file: () => _file,
	_float32: () => _float32,
	_float64: () => _float64,
	_gt: () => _gt,
	_gte: () => _gte,
	_guid: () => _guid,
	_iban: () => _iban,
	_includes: () => _includes,
	_int: () => _int,
	_int32: () => _int32,
	_int64: () => _int64,
	_intersection: () => _intersection,
	_ipv4: () => _ipv4,
	_ipv6: () => _ipv6,
	_isoDate: () => _isoDate,
	_isoDateTime: () => _isoDateTime,
	_isoDuration: () => _isoDuration,
	_isoTime: () => _isoTime,
	_jwt: () => _jwt,
	_ksuid: () => _ksuid,
	_lazy: () => _lazy,
	_length: () => _length,
	_literal: () => _literal,
	_lowercase: () => _lowercase,
	_lt: () => _lt,
	_lte: () => _lte,
	_mac: () => _mac,
	_map: () => _map,
	_max: () => _lte,
	_maxLength: () => _maxLength,
	_maxSize: () => _maxSize,
	_mime: () => _mime,
	_min: () => _gte,
	_minLength: () => _minLength,
	_minSize: () => _minSize,
	_multipleOf: () => _multipleOf,
	_nan: () => _nan,
	_nanoid: () => _nanoid,
	_nativeEnum: () => _nativeEnum,
	_negative: () => _negative,
	_never: () => _never,
	_nonnegative: () => _nonnegative,
	_nonoptional: () => _nonoptional,
	_nonpositive: () => _nonpositive,
	_normalize: () => _normalize,
	_null: () => _null,
	_nullable: () => _nullable,
	_number: () => _number,
	_optional: () => _optional,
	_overwrite: () => _overwrite,
	_parse: () => _parse,
	_parseAsync: () => _parseAsync,
	_pipe: () => _pipe,
	_positive: () => _positive,
	_promise: () => _promise,
	_properties: () => _properties,
	_property: () => _property,
	_readonly: () => _readonly,
	_record: () => _record,
	_refine: () => _refine,
	_regex: () => _regex,
	_safeDecode: () => _safeDecode,
	_safeDecodeAsync: () => _safeDecodeAsync,
	_safeEncode: () => _safeEncode,
	_safeEncodeAsync: () => _safeEncodeAsync,
	_safeParse: () => _safeParse,
	_safeParseAsync: () => _safeParseAsync,
	_set: () => _set,
	_size: () => _size,
	_slugify: () => _slugify,
	_startsWith: () => _startsWith,
	_string: () => _string,
	_stringFormat: () => _stringFormat,
	_stringbool: () => _stringbool,
	_success: () => _success,
	_superRefine: () => _superRefine,
	_symbol: () => _symbol,
	_templateLiteral: () => _templateLiteral,
	_toLowerCase: () => _toLowerCase,
	_toUpperCase: () => _toUpperCase,
	_transform: () => _transform,
	_trim: () => _trim,
	_tuple: () => _tuple,
	_uint32: () => _uint32,
	_uint64: () => _uint64,
	_ulid: () => _ulid,
	_undefined: () => _undefined,
	_union: () => _union,
	_unknown: () => _unknown,
	_uppercase: () => _uppercase,
	_url: () => _url,
	_uuid: () => _uuid,
	_uuidv4: () => _uuidv4,
	_uuidv6: () => _uuidv6,
	_uuidv7: () => _uuidv7,
	_void: () => _void,
	_xid: () => _xid,
	_xor: () => _xor,
	base64Charset: () => base64Charset,
	base64urlCharset: () => base64urlCharset,
	canParseURL: () => canParseURL,
	clone: () => clone,
	compile: () => compile,
	compileFn: () => compileFn,
	config: () => config,
	createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
	createToJSONSchemaMethod: () => createToJSONSchemaMethod,
	decode: () => decode,
	decodeAsync: () => decodeAsync,
	describe: () => describe,
	encode: () => encode,
	encodeAsync: () => encodeAsync,
	extractDefs: () => extractDefs,
	finalize: () => finalize,
	flattenError: () => flattenError,
	formatError: () => formatError,
	getDiscriminatedOption: () => getDiscriminatedOption,
	globalConfig: () => globalConfig,
	globalRegistry: () => globalRegistry,
	handleUnrepresentable: () => handleUnrepresentable,
	initializeContext: () => initializeContext,
	isBackEdge: () => isBackEdge,
	isRecursiveSchema: () => isRecursiveSchema,
	isValidBase64: () => isValidBase64,
	isValidBase64URL: () => isValidBase64URL,
	isValidCIDRv6: () => isValidCIDRv6,
	isValidCreditCard: () => isValidCreditCard,
	isValidIBAN: () => isValidIBAN,
	isValidIPv6: () => isValidIPv6,
	isValidJWT: () => isValidJWT,
	locales: () => locales_exports,
	memoizer: () => memoizer,
	mergeValues: () => mergeValues,
	meta: () => meta,
	parse: () => parse,
	parseAsync: () => parseAsync,
	parseURLObject: () => parseURLObject,
	prettifyError: () => prettifyError,
	process: () => processSchema,
	processSchema: () => processSchema,
	regexes: () => regexes_exports,
	registry: () => registry,
	safeDecode: () => safeDecode,
	safeDecodeAsync: () => safeDecodeAsync,
	safeEncode: () => safeEncode,
	safeEncodeAsync: () => safeEncodeAsync,
	safeParse: () => safeParse,
	safeParseAsync: () => safeParseAsync,
	standardProps: () => standardProps,
	stripTabAndNewline: () => stripTabAndNewline,
	toDotPath: () => toDotPath,
	toJSONSchema: () => toJSONSchema,
	toZod: () => toZod,
	treeifyError: () => treeifyError,
	urlHostnameOk: () => urlHostnameOk,
	urlProtocolOk: () => urlProtocolOk,
	util: () => util_exports,
	validate: () => validate,
	validateAsync: () => validateAsync,
	validateURL: () => validateURL,
	version: () => version,
	withParser: () => withParser
});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/checks.js
var checks_exports = /* @__PURE__ */ __exportAll({
	endsWith: () => _endsWith,
	gt: () => _gt,
	gte: () => _gte,
	includes: () => _includes,
	length: () => _length,
	lowercase: () => _lowercase,
	lt: () => _lt,
	lte: () => _lte,
	maxLength: () => _maxLength,
	maxSize: () => _maxSize,
	mime: () => _mime,
	minLength: () => _minLength,
	minSize: () => _minSize,
	multipleOf: () => _multipleOf,
	negative: () => _negative,
	nonnegative: () => _nonnegative,
	nonpositive: () => _nonpositive,
	normalize: () => _normalize,
	overwrite: () => _overwrite,
	positive: () => _positive,
	properties: () => _properties,
	property: () => _property,
	regex: () => _regex,
	size: () => _size,
	slugify: () => _slugify,
	startsWith: () => _startsWith,
	toLowerCase: () => _toLowerCase,
	toUpperCase: () => _toUpperCase,
	trim: () => _trim,
	uppercase: () => _uppercase
});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/iso.js
var iso_exports = /* @__PURE__ */ __exportAll({
	ZodISODate: () => ZodISODate,
	ZodISODateTime: () => ZodISODateTime,
	ZodISODuration: () => ZodISODuration,
	ZodISOTime: () => ZodISOTime,
	date: () => date,
	datetime: () => datetime,
	duration: () => duration,
	time: () => time
});
function datetime(params) {
	return _isoDateTime(ZodISODateTime, params);
}
function date(params) {
	return _isoDate(ZodISODate, params);
}
function time(params) {
	return _isoTime(ZodISOTime, params);
}
function duration(params) {
	return _isoDuration(ZodISODuration, params);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/from-json-schema.js
const z = {
	...schemas_exports,
	...checks_exports,
	iso: iso_exports
};
const RECOGNIZED_KEYS = /*@__PURE__*/ new Set([
	"$schema",
	"$ref",
	"$defs",
	"definitions",
	"$id",
	"id",
	"$comment",
	"$anchor",
	"$vocabulary",
	"$dynamicRef",
	"$dynamicAnchor",
	"type",
	"enum",
	"const",
	"anyOf",
	"oneOf",
	"allOf",
	"not",
	"properties",
	"required",
	"additionalProperties",
	"patternProperties",
	"propertyNames",
	"minProperties",
	"maxProperties",
	"items",
	"prefixItems",
	"additionalItems",
	"minItems",
	"maxItems",
	"uniqueItems",
	"contains",
	"minContains",
	"maxContains",
	"minLength",
	"maxLength",
	"pattern",
	"format",
	"minimum",
	"maximum",
	"exclusiveMinimum",
	"exclusiveMaximum",
	"multipleOf",
	"description",
	"default",
	"contentEncoding",
	"contentMediaType",
	"contentSchema",
	"unevaluatedItems",
	"unevaluatedProperties",
	"if",
	"then",
	"else",
	"dependentSchemas",
	"dependentRequired",
	"nullable",
	"readOnly"
]);
function detectVersion(schema, defaultTarget) {
	const $schema = schema.$schema;
	if ($schema === "https://json-schema.org/draft/2020-12/schema") return "draft-2020-12";
	if ($schema === "http://json-schema.org/draft-07/schema#") return "draft-7";
	if ($schema === "http://json-schema.org/draft-04/schema#") return "draft-4";
	return defaultTarget ?? "draft-2020-12";
}
function applyMinItems(items, minItems) {
	return items.map((item, index) => index < minItems ? item : item.optional());
}
function decodeJSONPointerSegment(segment) {
	return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}
function resolveRef(ref, ctx) {
	if (!ref.startsWith("#")) throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
	const path = ref.slice(1).split("/").filter(Boolean);
	if (path.length === 0) return ctx.rootSchema;
	const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
	if (path[0] === defsKey) {
		const key = path[1] === void 0 ? void 0 : decodeJSONPointerSegment(path[1]);
		if (!key || !ctx.defs[key]) throw new Error(`Reference not found: ${ref}`);
		return ctx.defs[key];
	}
	throw new Error(`Reference not found: ${ref}`);
}
/**
* Enforces the keywords that constrain an object's own keys — `propertyNames`,
* `minProperties`, `maxProperties` — before `objectSchema` runs. The guard has
* to see the raw input: an object parse drops `__proto__` and can add keys from
* a property `default`, so its output is not the set of names the instance
* actually carried.
*/
function checkObjectGuards(objectSchema, guards) {
	return z.transform((value) => value).check((payload) => {
		const value = payload.value;
		if (typeof value !== "object" || value === null || Array.isArray(value)) return;
		const keys = Object.getOwnPropertyNames(value);
		if (guards.minProperties !== void 0 && keys.length < guards.minProperties) payload.issues.push({
			origin: "object",
			code: "too_small",
			minimum: guards.minProperties,
			inclusive: true,
			message: `Too small: expected object to have >=${guards.minProperties} properties`,
			input: value,
			inst: objectSchema,
			continue: true
		});
		if (guards.maxProperties !== void 0 && keys.length > guards.maxProperties) payload.issues.push({
			origin: "object",
			code: "too_big",
			maximum: guards.maxProperties,
			inclusive: true,
			message: `Too big: expected object to have <=${guards.maxProperties} properties`,
			input: value,
			inst: objectSchema,
			continue: true
		});
		if (guards.keySchema) for (const key of keys) {
			const result = guards.keySchema.safeParse(key);
			if (result.success) continue;
			payload.issues.push({
				code: "invalid_key",
				origin: "record",
				issues: result.error.issues,
				input: key,
				path: [key],
				continue: true
			});
		}
	}).pipe(objectSchema);
}
/**
* An injective string for JSON data: two values share a key exactly when `uniqueItems` calls them
* equal, so duplicate detection is a Map lookup rather than a pairwise walk. Strings and keys are
* length-prefixed so no value can spell another one. `null` means "never equal to anything" — a
* cycle or a NaN, neither of which JSON can express.
*/
function canonicalKey(value, seen) {
	if (value === null) return "z";
	const type = typeof value;
	if (type !== "object") {
		if (type === "number" && Number.isNaN(value)) return null;
		const raw = String(value);
		return `${type[0]}${raw.length}:${raw}`;
	}
	if (seen.has(value)) return null;
	seen.add(value);
	try {
		if (Array.isArray(value)) {
			const parts = [];
			for (const item of value) {
				const key = canonicalKey(item, seen);
				if (key === null) return null;
				parts.push(key);
			}
			return `a${parts.length}:[${parts.join(",")}]`;
		}
		const keys = Object.keys(value).sort();
		const parts = [];
		for (const k of keys) {
			const key = canonicalKey(value[k], seen);
			if (key === null) return null;
			parts.push(`${k.length}:${k}=${key}`);
		}
		return `o${parts.length}:{${parts.join(",")}}`;
	} finally {
		seen.delete(value);
	}
}
const SCHEMA_KEYWORDS = /*@__PURE__*/ new Set([
	"items",
	"prefixItems",
	"additionalItems",
	"additionalProperties",
	"contains",
	"propertyNames",
	"not",
	"if",
	"then",
	"else",
	"allOf",
	"anyOf",
	"oneOf",
	"unevaluatedItems",
	"unevaluatedProperties",
	"contentSchema"
]);
const SCHEMA_MAP_KEYWORDS = /*@__PURE__*/ new Set([
	"properties",
	"patternProperties",
	"dependentSchemas",
	"dependencies",
	"$defs",
	"definitions"
]);
/**
* True when a subschema holds a `$ref` anywhere a schema can appear. Only those positions are
* walked: `$ref` under `default` or an `x-` annotation is instance data with an ordinary key, and
* reading it as a reference would drop a constraint that resolves perfectly well.
*/
function containsRef(value) {
	if (typeof value !== "object" || value === null) return false;
	if (Array.isArray(value)) return value.some(containsRef);
	if (typeof value.$ref === "string") return true;
	return Object.entries(value).some(([key, sub]) => {
		if (SCHEMA_KEYWORDS.has(key)) return containsRef(sub);
		if (!SCHEMA_MAP_KEYWORDS.has(key) || typeof sub !== "object" || sub === null) return false;
		return Object.values(sub).some(containsRef);
	});
}
function plural(n) {
	return n === 1 ? "element" : "elements";
}
/**
* Enforces `uniqueItems` and the `contains` family before `arraySchema` runs, for the same reason
* `checkObjectGuards` runs pre-pipe: an item parse can apply a nested `default`, so the parsed
* array is not the instance the keywords are defined over. A guard issue aborts the pipe, so
* `minItems`/`maxItems` are not also reported on the same parse — instance correctness is worth
* more than co-reporting two issues.
*/
function checkArrayGuards(arraySchema, guards) {
	return z.transform((value) => value).check((payload) => {
		const items = payload.value;
		if (!Array.isArray(items)) return;
		if (guards.uniqueItems === true) {
			const firstSeen = /* @__PURE__ */ new Map();
			for (let i = 0; i < items.length; i++) {
				const key = canonicalKey(items[i], /* @__PURE__ */ new Set());
				if (key === null) continue;
				const first = firstSeen.get(key);
				if (first === void 0) {
					firstSeen.set(key, i);
					continue;
				}
				payload.issues.push({
					code: "custom",
					message: `Array items must be unique: element at index ${i} duplicates the one at index ${first}`,
					input: items,
					path: [i],
					continue: true
				});
			}
		}
		if (guards.containsSchema) {
			const minContains = guards.minContains ?? 1;
			const ceiling = guards.maxContains !== void 0 ? guards.maxContains + 1 : Number.POSITIVE_INFINITY;
			let matches = 0;
			for (const item of items) if (guards.containsSchema.safeParse(item).success && ++matches >= ceiling) break;
			if (matches < minContains) payload.issues.push({
				code: "custom",
				message: `Array must contain at least ${minContains} matching ${plural(minContains)}; found ${matches}`,
				input: items,
				continue: true
			});
			if (guards.maxContains !== void 0 && matches > guards.maxContains) payload.issues.push({
				code: "custom",
				message: `Array must contain at most ${guards.maxContains} matching ${plural(guards.maxContains)}`,
				input: items,
				continue: true
			});
		}
	}).pipe(arraySchema);
}
function getTupleRest(restSchema, ctx) {
	if (restSchema === false) return;
	if (restSchema === void 0 || restSchema === true) return z.any();
	return convertSchema(restSchema, ctx);
}
const fullTime = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
function convertBaseSchema(schema, ctx) {
	if (schema.not !== void 0) {
		if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) return z.never();
		throw new Error("not is not supported in Zod (except { not: {} } for never)");
	}
	if (schema.unevaluatedItems !== void 0) throw new Error("unevaluatedItems is not supported");
	if (schema.unevaluatedProperties !== void 0) throw new Error("unevaluatedProperties is not supported");
	if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) throw new Error("Conditional schemas (if/then/else) are not supported");
	if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) throw new Error("dependentSchemas and dependentRequired are not supported");
	if (schema.$ref) {
		const refPath = schema.$ref;
		if (ctx.refs.has(refPath)) return ctx.refs.get(refPath);
		if (ctx.processing.has(refPath)) return z.lazy(() => {
			if (!ctx.refs.has(refPath)) throw new Error(`Circular reference not resolved: ${refPath}`);
			return ctx.refs.get(refPath);
		});
		ctx.processing.add(refPath);
		const zodSchema = convertSchema(resolveRef(refPath, ctx), ctx);
		ctx.refs.set(refPath, zodSchema);
		ctx.processing.delete(refPath);
		return zodSchema;
	}
	if (schema.enum !== void 0) {
		const enumValues = schema.enum;
		if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) return z.null();
		if (enumValues.length === 0) return z.never();
		if (enumValues.length === 1) return z.literal(enumValues[0]);
		if (enumValues.every((v) => typeof v === "string")) return z.enum(enumValues);
		const literalSchemas = enumValues.map((v) => z.literal(v));
		if (literalSchemas.length < 2) return literalSchemas[0];
		return z.union([
			literalSchemas[0],
			literalSchemas[1],
			...literalSchemas.slice(2)
		]);
	}
	if (schema.const !== void 0) return z.literal(schema.const);
	const type = schema.type;
	if (Array.isArray(type)) {
		const typeSchemas = type.map((t) => {
			return convertBaseSchema({
				...schema,
				type: t
			}, ctx);
		});
		if (typeSchemas.length === 0) return z.never();
		if (typeSchemas.length === 1) return typeSchemas[0];
		return z.union(typeSchemas);
	}
	if (!type) return z.any();
	let zodSchema;
	switch (type) {
		case "string": {
			let stringSchema = z.string();
			if (schema.format) {
				const format = schema.format;
				if (format === "email") stringSchema = stringSchema.check(z.email());
				else if (format === "uri" || format === "uri-reference") stringSchema = stringSchema.check(z.url());
				else if (format === "uuid" || format === "guid") stringSchema = stringSchema.check(z.uuid());
				else if (format === "date-time") stringSchema = stringSchema.check(z.iso.datetime({ offset: true }));
				else if (format === "date") stringSchema = stringSchema.check(z.iso.date());
				else if (format === "time") stringSchema = stringSchema.check(z.regex(fullTime));
				else if (format === "duration") stringSchema = stringSchema.check(z.iso.duration());
				else if (format === "hostname") stringSchema = stringSchema.check(z.hostname());
				else if (format === "ipv4") stringSchema = stringSchema.check(z.ipv4());
				else if (format === "ipv6") stringSchema = stringSchema.check(z.ipv6());
				else if (format === "mac") stringSchema = stringSchema.check(z.mac());
				else if (format === "cidr") stringSchema = stringSchema.check(z.cidrv4());
				else if (format === "cidr-v6") stringSchema = stringSchema.check(z.cidrv6());
				else if (format === "base64") stringSchema = stringSchema.check(z.base64());
				else if (format === "base64url") stringSchema = stringSchema.check(z.base64url());
				else if (format === "e164") stringSchema = stringSchema.check(z.e164());
				else if (format === "credit_card") stringSchema = stringSchema.check(z.creditCard());
				else if (format === "iban") stringSchema = stringSchema.check(z.iban());
				else if (format === "jwt") stringSchema = stringSchema.check(z.jwt());
				else if (format === "emoji") stringSchema = stringSchema.check(z.emoji());
				else if (format === "nanoid") stringSchema = stringSchema.check(z.nanoid());
				else if (format === "cuid") stringSchema = stringSchema.check(z.cuid());
				else if (format === "cuid2") stringSchema = stringSchema.check(z.cuid2());
				else if (format === "ulid") stringSchema = stringSchema.check(z.ulid());
				else if (format === "xid") stringSchema = stringSchema.check(z.xid());
				else if (format === "ksuid") stringSchema = stringSchema.check(z.ksuid());
			}
			if (typeof schema.minLength === "number") stringSchema = stringSchema.min(schema.minLength);
			if (typeof schema.maxLength === "number") stringSchema = stringSchema.max(schema.maxLength);
			if (schema.pattern) stringSchema = stringSchema.regex(new RegExp(schema.pattern));
			zodSchema = stringSchema;
			break;
		}
		case "number":
		case "integer": {
			let numberSchema = type === "integer" ? z.number().int() : z.number();
			if (typeof schema.minimum === "number" && schema.exclusiveMinimum !== true) numberSchema = numberSchema.min(schema.minimum);
			if (typeof schema.maximum === "number" && schema.exclusiveMaximum !== true) numberSchema = numberSchema.max(schema.maximum);
			if (typeof schema.exclusiveMinimum === "number") numberSchema = numberSchema.gt(schema.exclusiveMinimum);
			else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") numberSchema = numberSchema.gt(schema.minimum);
			if (typeof schema.exclusiveMaximum === "number") numberSchema = numberSchema.lt(schema.exclusiveMaximum);
			else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") numberSchema = numberSchema.lt(schema.maximum);
			if (typeof schema.multipleOf === "number") numberSchema = numberSchema.multipleOf(schema.multipleOf);
			zodSchema = numberSchema;
			break;
		}
		case "boolean":
			zodSchema = z.boolean();
			break;
		case "null":
			zodSchema = z.null();
			break;
		case "object": {
			const shape = {};
			const properties = schema.properties || {};
			const requiredSet = new Set(schema.required || []);
			const additionalSchema = typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : void 0;
			for (const [key, propSchema] of Object.entries(properties)) {
				const propZodSchema = convertSchema(propSchema, ctx);
				assignProp(shape, key, requiredSet.has(key) ? propZodSchema : propZodSchema.optional());
			}
			if (schema.patternProperties) {
				const patternProps = schema.patternProperties;
				const patternKeys = Object.keys(patternProps);
				const looseRecords = [];
				for (const pattern of patternKeys) {
					const patternValue = convertSchema(patternProps[pattern], ctx);
					const keySchema = z.string().regex(new RegExp(pattern));
					looseRecords.push(z.looseRecord(keySchema, patternValue));
				}
				const schemasToIntersect = [];
				if (Object.keys(shape).length > 0) schemasToIntersect.push(z.object(shape).passthrough());
				schemasToIntersect.push(...looseRecords);
				if (schemasToIntersect.length === 0) zodSchema = z.object({}).passthrough();
				else if (schemasToIntersect.length === 1) zodSchema = schemasToIntersect[0];
				else {
					let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
					for (let i = 2; i < schemasToIntersect.length; i++) result = z.intersection(result, schemasToIntersect[i]);
					zodSchema = result;
				}
				if (schema.additionalProperties === false) {
					const propertyKeys = Object.keys(shape);
					const patterns = patternKeys.map((p) => new RegExp(p));
					const basePatternSchema = zodSchema;
					zodSchema = zodSchema.check((payload) => {
						if (!isPlainObject(payload.value)) return;
						const unrecognized = [];
						for (const key of Object.keys(payload.value)) {
							if (propertyKeys.includes(key)) continue;
							if (patterns.some((regex) => regex.test(key))) continue;
							unrecognized.push(key);
						}
						if (unrecognized.length) payload.issues.push({
							code: "unrecognized_keys",
							keys: unrecognized,
							input: payload.value,
							inst: basePatternSchema
						});
					});
				}
			} else {
				const objectSchema = z.object(shape);
				if (schema.additionalProperties === false) zodSchema = objectSchema.strict();
				else if (additionalSchema) zodSchema = objectSchema.catchall(additionalSchema);
				else zodSchema = objectSchema.passthrough();
			}
			const hasKeyGuard = schema.propertyNames !== void 0 && schema.propertyNames !== true;
			const minProperties = typeof schema.minProperties === "number" ? schema.minProperties : void 0;
			const maxProperties = typeof schema.maxProperties === "number" ? schema.maxProperties : void 0;
			if (hasKeyGuard || minProperties !== void 0 || maxProperties !== void 0) {
				let keySchema;
				if (hasKeyGuard) keySchema = convertSchema(typeof schema.propertyNames === "object" && schema.propertyNames.type === void 0 ? {
					type: "string",
					...schema.propertyNames
				} : schema.propertyNames, ctx);
				zodSchema = checkObjectGuards(zodSchema, {
					keySchema,
					minProperties,
					maxProperties
				});
			}
			break;
		}
		case "array": {
			const prefixItems = schema.prefixItems;
			const items = schema.items;
			if (prefixItems && Array.isArray(prefixItems)) {
				const minItems = typeof schema.minItems === "number" ? schema.minItems : 0;
				const positionalItems = applyMinItems(prefixItems.map((item) => convertSchema(item, ctx)), minItems);
				const rest = !Array.isArray(items) ? getTupleRest(items, ctx) : void 0;
				const tupleSchema = z.tuple(positionalItems);
				zodSchema = rest ? tupleSchema.rest(rest) : tupleSchema;
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (Array.isArray(items)) {
				const minItems = typeof schema.minItems === "number" ? schema.minItems : 0;
				const positionalItems = applyMinItems(items.map((item) => convertSchema(item, ctx)), minItems);
				const rest = getTupleRest(schema.additionalItems, ctx);
				const tupleSchema = z.tuple(positionalItems);
				zodSchema = rest ? tupleSchema.rest(rest) : tupleSchema;
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (items !== void 0) {
				const element = convertSchema(items, ctx);
				let arraySchema = z.array(element);
				if (typeof schema.minItems === "number") arraySchema = arraySchema.min(schema.minItems);
				if (typeof schema.maxItems === "number") arraySchema = arraySchema.max(schema.maxItems);
				zodSchema = arraySchema;
			} else zodSchema = z.array(z.any());
			if (schema.uniqueItems === true || schema.contains !== void 0) zodSchema = checkArrayGuards(zodSchema, {
				uniqueItems: schema.uniqueItems === true,
				containsSchema: schema.contains !== void 0 ? convertSchema(schema.contains, ctx) : void 0,
				minContains: typeof schema.minContains === "number" ? schema.minContains : void 0,
				maxContains: typeof schema.maxContains === "number" ? schema.maxContains : void 0
			});
			break;
		}
		default: throw new Error(`Unsupported type: ${type}`);
	}
	return zodSchema;
}
function convertSchema(schema, ctx) {
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	let baseSchema = convertBaseSchema(schema, ctx);
	const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const options = schema.anyOf.map((s) => convertSchema(s, ctx));
		const anyOfUnion = z.union(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
	}
	if (schema.oneOf && Array.isArray(schema.oneOf)) {
		const options = schema.oneOf.map((s) => convertSchema(s, ctx));
		const oneOfUnion = z.xor(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
	}
	if (schema.allOf && Array.isArray(schema.allOf)) {
		if (schema.allOf.length === 0) baseSchema = hasExplicitType ? baseSchema : z.any();
		else {
			let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
			const startIdx = hasExplicitType ? 0 : 1;
			for (let i = startIdx; i < schema.allOf.length; i++) result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
			baseSchema = result;
		}
	}
	if (schema.nullable === true && ctx.version === "openapi-3.0") baseSchema = z.nullable(baseSchema);
	if (schema.readOnly === true) baseSchema = z.readonly(baseSchema);
	if (schema.default !== void 0) baseSchema = baseSchema.default(schema.default);
	const extraMeta = {};
	for (const key of [
		"$id",
		"id",
		"$comment",
		"$anchor",
		"$vocabulary",
		"$dynamicRef",
		"$dynamicAnchor"
	]) if (key in schema) extraMeta[key] = schema[key];
	for (const key of [
		"contentEncoding",
		"contentMediaType",
		"contentSchema"
	]) if (key in schema) extraMeta[key] = schema[key];
	if (schema.type === "object" && schema.$ref === void 0) {
		if (schema.propertyNames !== void 0 && !containsRef(schema.propertyNames)) extraMeta.propertyNames = schema.propertyNames;
		for (const key of ["minProperties", "maxProperties"]) if (schema[key] !== void 0) extraMeta[key] = schema[key];
	}
	if (schema.type === "array" && schema.$ref === void 0) {
		if (schema.contains !== void 0 && !containsRef(schema.contains)) extraMeta.contains = schema.contains;
		for (const key of [
			"uniqueItems",
			"minContains",
			"maxContains"
		]) if (schema[key] !== void 0) extraMeta[key] = schema[key];
	}
	for (const key of Object.keys(schema)) if (!RECOGNIZED_KEYS.has(key)) assignProp(extraMeta, key, schema[key]);
	if (Object.keys(extraMeta).length > 0) ctx.registry.add(baseSchema, extraMeta);
	if (schema.description) baseSchema = baseSchema.describe(schema.description);
	return baseSchema;
}
/**
* Converts a JSON Schema to a Zod schema. This function should be considered semi-experimental. It's behavior is liable to change. */
function fromJSONSchema(schema, params) {
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	let normalized;
	try {
		normalized = JSON.parse(JSON.stringify(schema));
	} catch {
		throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
	}
	const ctx = {
		version: detectVersion(normalized, params?.defaultTarget),
		defs: normalized.$defs || normalized.definitions || {},
		refs: /* @__PURE__ */ new Map(),
		processing: /* @__PURE__ */ new Set(),
		rootSchema: normalized,
		registry: params?.registry ?? globalRegistry
	};
	return convertSchema(normalized, ctx);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/visit.js
const RESOLVING = Symbol("z.visit/resolving");
function visit(schema, fnOrHandlers) {
	const fn = typeof fnOrHandlers === "function" ? fnOrHandlers : (node, rewritten) => {
		const h = fnOrHandlers[node._zod.def.type];
		return h ? h(node, rewritten) : node;
	};
	const cache = /* @__PURE__ */ new Map();
	function run(s) {
		const cached = cache.get(s);
		if (cached === RESOLVING) return new $ZodLazy({
			type: "lazy",
			getter: () => cache.get(s)
		});
		if (cached !== void 0) return cached;
		cache.set(s, RESOLVING);
		const inner = mapInner(s);
		const mapped = fn(inner, inner !== s);
		cache.set(s, mapped);
		return mapped;
	}
	function mapInner(s) {
		const def = s._zod.def;
		switch (def.type) {
			case "object": {
				const oldShape = def.shape;
				const keys = Object.keys(oldShape);
				let changed = false;
				const newShape = {};
				for (const k of keys) {
					const mapped = run(oldShape[k]);
					if (mapped !== oldShape[k]) changed = true;
					newShape[k] = mapped;
				}
				let newCatchall = def.catchall;
				if (def.catchall) {
					newCatchall = run(def.catchall);
					if (newCatchall !== def.catchall) changed = true;
				}
				return changed ? clone(s, {
					...def,
					shape: newShape,
					catchall: newCatchall
				}) : s;
			}
			case "array": {
				const mapped = run(def.element);
				return mapped === def.element ? s : clone(s, {
					...def,
					element: mapped
				});
			}
			case "tuple": {
				const oldItems = def.items;
				let changed = false;
				const newItems = [];
				for (const item of oldItems) {
					const mapped = run(item);
					if (mapped !== item) changed = true;
					newItems.push(mapped);
				}
				let newRest = def.rest;
				if (def.rest) {
					newRest = run(def.rest);
					if (newRest !== def.rest) changed = true;
				}
				return changed ? clone(s, {
					...def,
					items: newItems,
					rest: newRest
				}) : s;
			}
			case "record":
			case "map": {
				const newKey = run(def.keyType);
				const newVal = run(def.valueType);
				return newKey === def.keyType && newVal === def.valueType ? s : clone(s, {
					...def,
					keyType: newKey,
					valueType: newVal
				});
			}
			case "set": {
				const newVal = run(def.valueType);
				return newVal === def.valueType ? s : clone(s, {
					...def,
					valueType: newVal
				});
			}
			case "union": {
				const oldOptions = def.options;
				let changed = false;
				const newOptions = [];
				for (const opt of oldOptions) {
					const mapped = run(opt);
					if (mapped !== opt) changed = true;
					newOptions.push(mapped);
				}
				return changed ? clone(s, {
					...def,
					options: newOptions
				}) : s;
			}
			case "intersection": {
				const newLeft = run(def.left);
				const newRight = run(def.right);
				return newLeft === def.left && newRight === def.right ? s : clone(s, {
					...def,
					left: newLeft,
					right: newRight
				});
			}
			case "optional":
			case "nullable":
			case "default":
			case "prefault":
			case "catch":
			case "readonly":
			case "nonoptional":
			case "promise":
			case "success": {
				const newInner = run(def.innerType);
				return newInner === def.innerType ? s : clone(s, {
					...def,
					innerType: newInner
				});
			}
			case "pipe": {
				const newIn = run(def.in);
				const newOut = run(def.out);
				return newIn === def.in && newOut === def.out ? s : clone(s, {
					...def,
					in: newIn,
					out: newOut
				});
			}
			case "function": {
				const newInput = run(def.input);
				const newOutput = run(def.output);
				return newInput === def.input && newOutput === def.output ? s : clone(s, {
					...def,
					input: newInput,
					output: newOutput
				});
			}
			case "lazy": {
				const original = def.getter;
				const { _cachedInner, ...rest } = def;
				return clone(s, {
					...rest,
					getter: () => run(original())
				});
			}
			case "template_literal":
			case "string":
			case "number":
			case "int":
			case "boolean":
			case "bigint":
			case "symbol":
			case "undefined":
			case "null":
			case "void":
			case "never":
			case "any":
			case "unknown":
			case "date":
			case "nan":
			case "enum":
			case "literal":
			case "file":
			case "transform":
			case "custom": return s;
			default: return s;
		}
	}
	return run(schema);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/deep-partial.js
/** Returns a copy of the schema with every nested object's properties made optional. */
function deepPartial(schema) {
	return visit(schema, {
		object: (s) => s.partial(),
		union: (s) => {
			const def = s._zod.def;
			return def.discriminator === void 0 ? s : union(def.options);
		}
	});
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/in-out.js
/** Appends a pipe's own checks to the side that replaces it, mirroring how `.check()` clones. */
function withChecks(side, checks) {
	if (!checks?.length) return side;
	const def = side._zod.def;
	return clone(side, mergeDefs(def, { checks: [...def.checks ?? [], ...checks] }), { parent: true });
}
/** The out side, carrying the pipe's own checks: those run against the decoded value, which is what `out` produces. */
function outSide(def) {
	return withChecks(def.out, def.checks);
}
/** The in side. `z.preprocess` pipes a transform into a schema, and a bare transform validates nothing, so the schema it feeds is the real input side — the resolution `toJSONSchema` already makes for this case. */
function inSide(def) {
	return def.in._zod.traits.has("$ZodTransform") ? outSide(def) : def.in;
}
/** Returns a copy of the schema with every pipe replaced by its input side. A codec's checks are dropped: they constrain the decoded value the input side never produces. */
function input(schema) {
	return visit(schema, {
		pipe: (s) => inSide(s._zod.def),
		default: (s, rewritten) => rewritten ? optional(s._zod.def.innerType) : s,
		catch: (s, rewritten) => rewritten ? s._zod.def.innerType : s
	});
}
/** Returns a copy of the schema with every pipe replaced by its output side, carrying over the pipe's own checks. */
function output(schema) {
	return visit(schema, {
		pipe: (s) => outSide(s._zod.def),
		prefault: (s, rewritten) => rewritten ? s._zod.def.innerType : s
	});
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/external.js
var external_exports = /* @__PURE__ */ __exportAll({
	$brand: () => $brand,
	$input: () => $input,
	$output: () => $output,
	INVALID: () => INVALID,
	NEVER: () => NEVER,
	TimePrecision: () => TimePrecision,
	ZodAny: () => ZodAny,
	ZodArray: () => ZodArray,
	ZodBase64: () => ZodBase64,
	ZodBase64URL: () => ZodBase64URL,
	ZodBigInt: () => ZodBigInt,
	ZodBigIntFormat: () => ZodBigIntFormat,
	ZodBoolean: () => ZodBoolean,
	ZodCIDRv4: () => ZodCIDRv4,
	ZodCIDRv6: () => ZodCIDRv6,
	ZodCUID: () => ZodCUID,
	ZodCUID2: () => ZodCUID2,
	ZodCatch: () => ZodCatch,
	ZodCodec: () => ZodCodec,
	ZodCompileAsyncError: () => ZodCompileAsyncError,
	ZodCompileUnsupportedError: () => ZodCompileUnsupportedError,
	ZodCreditCard: () => ZodCreditCard,
	ZodCustom: () => ZodCustom,
	ZodCustomStringFormat: () => ZodCustomStringFormat,
	ZodDate: () => ZodDate,
	ZodDefault: () => ZodDefault,
	ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
	ZodE164: () => ZodE164,
	ZodEmail: () => ZodEmail,
	ZodEmoji: () => ZodEmoji,
	ZodEnum: () => ZodEnum,
	ZodError: () => ZodError,
	ZodExactOptional: () => ZodExactOptional,
	ZodFile: () => ZodFile,
	ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
	ZodFunction: () => ZodFunction,
	ZodGUID: () => ZodGUID,
	ZodIBAN: () => ZodIBAN,
	ZodIPv4: () => ZodIPv4,
	ZodIPv6: () => ZodIPv6,
	ZodISODate: () => ZodISODate,
	ZodISODateTime: () => ZodISODateTime,
	ZodISODuration: () => ZodISODuration,
	ZodISOTime: () => ZodISOTime,
	ZodInstanceOf: () => ZodInstanceOf,
	ZodIntersection: () => ZodIntersection,
	ZodIssueCode: () => ZodIssueCode,
	ZodJWT: () => ZodJWT,
	ZodKSUID: () => ZodKSUID,
	ZodLazy: () => ZodLazy,
	ZodLiteral: () => ZodLiteral,
	ZodMAC: () => ZodMAC,
	ZodMap: () => ZodMap,
	ZodNaN: () => ZodNaN,
	ZodNanoID: () => ZodNanoID,
	ZodNever: () => ZodNever,
	ZodNonOptional: () => ZodNonOptional,
	ZodNull: () => ZodNull,
	ZodNullable: () => ZodNullable,
	ZodNumber: () => ZodNumber,
	ZodNumberFormat: () => ZodNumberFormat,
	ZodObject: () => ZodObject,
	ZodOptional: () => ZodOptional,
	ZodPipe: () => ZodPipe,
	ZodPrefault: () => ZodPrefault,
	ZodPreprocess: () => ZodPreprocess,
	ZodPromise: () => ZodPromise,
	ZodReadonly: () => ZodReadonly,
	ZodRealError: () => ZodRealError,
	ZodRecord: () => ZodRecord,
	ZodSet: () => ZodSet,
	ZodString: () => ZodString,
	ZodStringFormat: () => ZodStringFormat,
	ZodSuccess: () => ZodSuccess,
	ZodSymbol: () => ZodSymbol,
	ZodTemplateLiteral: () => ZodTemplateLiteral,
	ZodTransform: () => ZodTransform,
	ZodTuple: () => ZodTuple,
	ZodType: () => ZodType,
	ZodULID: () => ZodULID,
	ZodURL: () => ZodURL,
	ZodUUID: () => ZodUUID,
	ZodUndefined: () => ZodUndefined,
	ZodUnion: () => ZodUnion,
	ZodUnknown: () => ZodUnknown,
	ZodVoid: () => ZodVoid,
	ZodXID: () => ZodXID,
	ZodXor: () => ZodXor,
	_ZodString: () => _ZodString,
	_default: () => _default$1,
	_function: () => _function,
	any: () => any,
	array: () => array,
	base64: () => base64,
	base64url: () => base64url,
	bigint: () => bigint,
	boolean: () => boolean,
	catch: () => _catch$1,
	check: () => check,
	cidrv4: () => cidrv4,
	cidrv6: () => cidrv6,
	clone: () => clone,
	codec: () => codec,
	coerce: () => coerce_exports,
	compile: () => compile,
	config: () => config,
	core: () => core_exports,
	creditCard: () => creditCard,
	cuid: () => cuid,
	cuid2: () => cuid2,
	currencyCode: () => currencyCode,
	custom: () => custom,
	date: () => date$1,
	decode: () => decode$1,
	decodeAsync: () => decodeAsync$1,
	deepPartial: () => deepPartial,
	describe: () => describe$1,
	discriminatedUnion: () => discriminatedUnion,
	e164: () => e164,
	email: () => email,
	emoji: () => emoji,
	encode: () => encode$1,
	encodeAsync: () => encodeAsync$1,
	endsWith: () => _endsWith,
	enum: () => _enum$1,
	exactOptional: () => exactOptional,
	file: () => file,
	flattenError: () => flattenError,
	float32: () => float32,
	float64: () => float64,
	formatError: () => formatError,
	fromJSONSchema: () => fromJSONSchema,
	function: () => _function,
	getDiscriminatedOption: () => getDiscriminatedOption,
	getErrorMap: () => getErrorMap,
	globalRegistry: () => globalRegistry,
	gt: () => _gt,
	gte: () => _gte,
	guid: () => guid,
	hash: () => hash,
	hex: () => hex,
	hostname: () => hostname,
	httpUrl: () => httpUrl,
	iban: () => iban,
	includes: () => _includes,
	input: () => input,
	instanceof: () => _instanceof,
	int: () => int,
	int32: () => int32,
	int64: () => int64,
	intersection: () => intersection,
	invertCodec: () => invertCodec,
	ipv4: () => ipv4,
	ipv6: () => ipv6,
	iso: () => iso_exports,
	json: () => json,
	jwt: () => jwt,
	keyof: () => keyof,
	ksuid: () => ksuid,
	lazy: () => lazy,
	length: () => _length,
	literal: () => literal,
	locales: () => locales_exports,
	looseObject: () => looseObject,
	looseRecord: () => looseRecord,
	lowercase: () => _lowercase,
	lt: () => _lt,
	lte: () => _lte,
	mac: () => mac,
	map: () => map,
	maxLength: () => _maxLength,
	maxSize: () => _maxSize,
	memoizer: () => memoizer,
	meta: () => meta$1,
	mime: () => _mime,
	minLength: () => _minLength,
	minSize: () => _minSize,
	multipleOf: () => _multipleOf,
	nan: () => nan,
	nanoid: () => nanoid,
	nativeEnum: () => nativeEnum,
	negative: () => _negative,
	never: () => never,
	nonnegative: () => _nonnegative,
	nonoptional: () => nonoptional,
	nonpositive: () => _nonpositive,
	normalize: () => _normalize,
	null: () => _null$1,
	nullable: () => nullable,
	nullish: () => nullish,
	number: () => number,
	object: () => object,
	optional: () => optional,
	output: () => output,
	overwrite: () => _overwrite,
	parse: () => parse$1,
	parseAsync: () => parseAsync$1,
	partialRecord: () => partialRecord,
	pipe: () => pipe,
	positive: () => _positive,
	prefault: () => prefault,
	preprocess: () => preprocess,
	prettifyError: () => prettifyError,
	promise: () => promise,
	properties: () => _properties,
	property: () => _property,
	readonly: () => readonly,
	record: () => record,
	refine: () => refine,
	regex: () => _regex,
	regexes: () => regexes_exports,
	registry: () => registry,
	safeDecode: () => safeDecode$1,
	safeDecodeAsync: () => safeDecodeAsync$1,
	safeEncode: () => safeEncode$1,
	safeEncodeAsync: () => safeEncodeAsync$1,
	safeParse: () => safeParse$1,
	safeParseAsync: () => safeParseAsync$1,
	set: () => set,
	setErrorMap: () => setErrorMap,
	size: () => _size,
	slugify: () => _slugify,
	startsWith: () => _startsWith,
	strictObject: () => strictObject,
	string: () => string,
	stringFormat: () => stringFormat,
	stringbool: () => stringbool,
	success: () => success,
	superRefine: () => superRefine,
	symbol: () => symbol,
	templateLiteral: () => templateLiteral,
	toJSONSchema: () => toJSONSchema,
	toLowerCase: () => _toLowerCase,
	toUpperCase: () => _toUpperCase,
	toZod: () => toZod,
	transform: () => transform,
	treeifyError: () => treeifyError,
	trim: () => _trim,
	tuple: () => tuple,
	uint32: () => uint32,
	uint64: () => uint64,
	ulid: () => ulid,
	undefined: () => _undefined$1,
	union: () => union,
	unknown: () => unknown,
	uppercase: () => _uppercase,
	url: () => url,
	util: () => util_exports,
	uuid: () => uuid,
	uuidv4: () => uuidv4,
	uuidv6: () => uuidv6,
	uuidv7: () => uuidv7,
	validate: () => validate,
	validateAsync: () => validateAsync,
	void: () => _void$1,
	withParser: () => withParser,
	xid: () => xid,
	xor: () => xor
});
//#endregion
export { external_exports as t };
