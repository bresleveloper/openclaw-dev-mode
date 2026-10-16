//#region extensions/browser/src/browser/errors.ts
const BROWSER_ENDPOINT_BLOCKED_MESSAGE = "browser endpoint blocked by policy";
const BROWSER_NAVIGATION_BLOCKED_MESSAGE = "browser navigation blocked by policy";
const BROWSER_ERROR_REASONS = {
	noDisplayForHeadedProfile: "no_display_for_headed_profile",
	navigationBlocked: "navigation_blocked"
};
const BROWSER_ACT_ERROR_CODES = {
	kindRequired: "ACT_KIND_REQUIRED",
	invalidRequest: "ACT_INVALID_REQUEST",
	selectorUnsupported: "ACT_SELECTOR_UNSUPPORTED",
	evaluateDisabled: "ACT_EVALUATE_DISABLED",
	unsupportedForExistingSession: "ACT_EXISTING_SESSION_UNSUPPORTED",
	targetIdMismatch: "ACT_TARGET_ID_MISMATCH",
	operationFailed: "ACT_OPERATION_FAILED"
};
const BROWSER_ACT_ERROR_CODE_VALUES = new Set(Object.values(BROWSER_ACT_ERROR_CODES));
function isBrowserActErrorCode(value) {
	return typeof value === "string" && BROWSER_ACT_ERROR_CODE_VALUES.has(value);
}
const NO_DISPLAY_HEADLESS_SOURCES = [
	"request",
	"env",
	"profile",
	"config",
	"default"
];
var BrowserError = class extends Error {
	constructor(message, status = 500, options) {
		super(message, options);
		this.name = new.target.name;
		this.status = status;
	}
};
/** A browser interaction failed without establishing a service outage. */
var BrowserActionError = class extends BrowserError {
	constructor(..._args) {
		super(..._args);
		this.code = BROWSER_ACT_ERROR_CODES.operationFailed;
	}
};
/**
* Raised when a browser CDP endpoint (the cdpUrl itself) fails the
* configured SSRF policy. Distinct from a blocked navigation target so
* callers see "fix your browser endpoint config" rather than "fix your
* navigation URL".
*/
var BrowserCdpEndpointBlockedError = class extends BrowserError {
	constructor(options) {
		super(BROWSER_ENDPOINT_BLOCKED_MESSAGE, 400, options);
	}
};
var BrowserValidationError = class extends BrowserError {
	constructor(message, options) {
		super(message, 400, options);
	}
};
var BrowserTargetAmbiguousError = class extends BrowserError {
	constructor(message = "ambiguous browser tab reference", options) {
		super(message, 409, options);
	}
};
var BrowserTabNotFoundError = class extends BrowserError {
	constructor(inputOrMessage, options) {
		const input = typeof inputOrMessage === "object" ? inputOrMessage.input?.trim() : inputOrMessage?.trim();
		const message = input ? /^\d+$/.test(input) ? `tab not found: browser tab "${input}" not found. Numeric values are not tab targets; use a stable tab id like "t1", a label, or a raw targetId. For positional selection, use "openclaw browser tab select ${input}".` : `tab not found: browser tab "${input}" not found. Use action=tabs and pass suggestedTargetId, tabId, label, or raw targetId.` : "tab not found";
		super(message, 404, options);
	}
};
var BrowserProfileNotFoundError = class extends BrowserError {
	constructor(message, options) {
		super(message, 404, options);
	}
};
var BrowserConflictError = class extends BrowserError {
	constructor(message, options) {
		super(message, 409, options);
	}
};
var BrowserResetUnsupportedError = class extends BrowserError {
	constructor(message, options) {
		super(message, 400, options);
	}
};
var BrowserProfileUnavailableError = class extends BrowserError {
	constructor(message, options) {
		super(message, 409, options);
		this.metadata = options?.metadata;
	}
};
var BrowserResourceExhaustedError = class extends BrowserError {
	constructor(message, options) {
		super(message, 507, options);
	}
};
function toBrowserErrorResponse(err) {
	if (err instanceof BrowserActionError) return {
		status: err.status,
		message: err.message,
		code: err.code
	};
	if (err instanceof BrowserProfileUnavailableError && err.metadata) return {
		status: err.status,
		message: err.message,
		...err.metadata
	};
	if (err instanceof BrowserError) return {
		status: err.status,
		message: err.message
	};
	if (err instanceof Error && err.name === "BlockedBrowserTargetError") return {
		status: 409,
		message: err.message,
		reason: BROWSER_ERROR_REASONS.navigationBlocked
	};
	if (err instanceof Error && err.name === "SsrFBlockedError") return {
		status: 400,
		message: BROWSER_NAVIGATION_BLOCKED_MESSAGE,
		reason: BROWSER_ERROR_REASONS.navigationBlocked
	};
	if (err instanceof Error && err.name === "InvalidBrowserNavigationUrlError") return {
		status: 400,
		message: err.message,
		reason: BROWSER_ERROR_REASONS.navigationBlocked
	};
	return null;
}
function parseNoDisplayDetails(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const details = value;
	if (typeof details.profile !== "string" || details.profile.length === 0 || details.requestedHeadless !== false || !NO_DISPLAY_HEADLESS_SOURCES.includes(details.headlessSource) || details.displayPresent !== false) return null;
	return {
		profile: details.profile,
		requestedHeadless: false,
		headlessSource: details.headlessSource,
		displayPresent: false
	};
}
/** Parse only the closed browser error metadata contract from a route payload. */
function parseBrowserErrorPayload(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const body = value;
	if (typeof body.error !== "string" || body.error.length === 0) return null;
	const code = isBrowserActErrorCode(body.code) ? body.code : void 0;
	const unrecognizedCode = body.unrecognizedCode === true || body.code !== void 0 && !code ? true : void 0;
	const actionCode = code ? { code } : unrecognizedCode ? { unrecognizedCode: true } : {};
	if (body.reason === BROWSER_ERROR_REASONS.navigationBlocked) return {
		error: body.error,
		...actionCode,
		reason: body.reason
	};
	if (body.reason === BROWSER_ERROR_REASONS.noDisplayForHeadedProfile) {
		const details = parseNoDisplayDetails(body.details);
		if (details) return {
			error: body.error,
			...actionCode,
			reason: body.reason,
			details
		};
	}
	return {
		error: body.error,
		...actionCode
	};
}
//#endregion
export { BrowserConflictError as a, BrowserProfileUnavailableError as c, BrowserTabNotFoundError as d, BrowserTargetAmbiguousError as f, toBrowserErrorResponse as h, BrowserCdpEndpointBlockedError as i, BrowserResetUnsupportedError as l, parseBrowserErrorPayload as m, BROWSER_ERROR_REASONS as n, BrowserError as o, BrowserValidationError as p, BrowserActionError as r, BrowserProfileNotFoundError as s, BROWSER_ACT_ERROR_CODES as t, BrowserResourceExhaustedError as u };
