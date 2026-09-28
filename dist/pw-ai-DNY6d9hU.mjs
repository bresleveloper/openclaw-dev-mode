import { M as resolveNonNegativeIntegerOption, b as parseFiniteNumber, j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { d as isPrivateNetworkAllowedByPolicy } from "./ssrf-BQRtcdBp.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { o as getImageMetadata } from "./image-ops-CU4vxSlO.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./media-mime-D8SxWw0k.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import { _ as readBrowserDashboardTabs, t as assertBrowserDashboardTabCanClose } from "./session-tab-store-CyxH9Sdj.mjs";
import { d as DEFAULT_BROWSER_SNAPSHOT_TIMEOUT_MS, o as DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS } from "./constants-DKjTvIBP.mjs";
import { c as resolveActInteractionTimeoutMs, d as resolveBrowserNavigationTimeoutMs, l as resolveActWaitTimeoutMs, n as ACT_MAX_VIEWPORT_DIMENSION, r as ACT_MAX_WAIT_TIME_MS, t as ACT_MAX_CLICK_DELAY_MS } from "./act-policy-3Ku82pq-.mjs";
import { d as BrowserTabNotFoundError } from "./errors-CXz-2iKA.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import "./errors-DS4y5mrd.mjs";
import { C as buildRoleSnapshotFromAiSnapshot, F as assertBrowserNavigationResultAllowed, I as parseBrowserNavigationUrl, M as InvalidBrowserNavigationUrlError, N as assertBrowserNavigationAllowed, R as withBrowserNavigationPolicy, S as appendSnapshotUrls, _ as formatAriaSnapshot, w as finalizeRoleSnapshot, x as snapshotRoleViaCdpSession } from "./chrome-BYoc4jk9.mjs";
import { a as resolveStrictExistingUploadPaths, n as DEFAULT_TRACE_DIR } from "./paths-BD1L9gFZ.mjs";
import { v as getPlaywrightCore } from "./cdp.helpers-DHnECuD4.mjs";
import "./ssrf-policy-helpers-BmwvxBcL.mjs";
import { $ as getObservedBrowserStateForPage, A as readMainFrameDocumentIdentityForPage, B as connectBrowser, C as focusPageByTargetIdViaPlaywright, D as listPagesViaPlaywright, E as getObservedBrowserStateViaPlaywright, F as gotoPageWithNavigationGuard, G as retirePlaywrightBrowserConnectionExact, H as getPageForTargetId, I as isPolicyDenyNavigationError, J as beginActionDownloadCaptureOnPage, K as pageTargetInfo, L as quarantineBlockedNavigationTarget, M as withPageScopedCdpClient, N as assertPageNavigationCompletedSafely, O as refLocator, P as closeBlockedNavigationTarget, Q as ensurePageState, R as wasBrowserNavigationSourcePreservedAfterPolicyDenial, S as createPageViaPlaywright, T as getDocumentIdentitiesViaPlaywright, U as hasCachedPlaywrightBrowserConnection, V as ensureContextState, W as retirePlaywrightBrowserConnection, X as armObservedDialogResponseOnPage, Y as isDownloadStartingNavigationError, Z as createObservedDialogAbortSignalForPage, _ as requireRef, a as createAbortPromiseWithListener, at as isBrowserObservedDialogBlockedError, b as closePageByTargetIdViaPlaywright, c as interactionNavigationPolicy, ct as planAnnotations, d as runCancellablePageInteraction, dt as normalizeBrowserEvaluateFunctionSource, et as markObservedDialogsHandledRemotelyForPage, f as throwIfInteractionAborted, g as normalizeTimeoutMs, h as bumpUploadArmId, i as awaitNavigationGuardedInteraction, it as createDownloadCaptureForPage, j as withCdpSnapshotRoot, k as markBackendDomRefsOnPage, l as reconcileRemoteDialogAfterActionSettled, lt as scaleAnnotations, m as bumpDownloadArmId, n as assertInteractionCurrent, nt as restoreRoleRefsForTarget, o as getRestoredPageForTarget, ot as buildOverlayClearScript, p as toFriendlyInteractionError, q as closeRelayOperationConnection, r as awaitActionWithAbort, rt as storeRoleRefsForTarget, s as hasInteractionNavigationPolicy, st as buildOverlayInjectionScript, t as BrowserInteractionAuthorityError, tt as respondToObservedDialogOnPage, u as resolveBoundedDelayMs, ut as matchBrowserUrlPattern, v as requireRefOrSelector, w as forceDisconnectPlaywrightForTarget, x as closePlaywrightBrowserConnection, y as toAIFriendlyError, z as withPageNavigationRequestGuard } from "./pw-tools-core.interactions.navigation-C9zSccia.mjs";
import "./form-fields-PPIIbhqD.mjs";
import { t as writeExternalFileWithinOutputRoot } from "./output-files-Dg5F90BE.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/pw-tools-core.activity.ts
/**
* Page inspection helpers for visible text, observed errors, network requests,
* and console messages from Playwright page state.
*/
/** Returns visible page text without evaluating caller-provided JavaScript. */
async function getPageTextViaPlaywright(opts) {
	const maxChars = Math.min(opts.maxChars ?? 4e4, DEFAULT_AI_SNAPSHOT_MAX_CHARS);
	if (!Number.isSafeInteger(maxChars) || maxChars <= 0) throw new Error("maxChars must be a positive integer.");
	const timeout = DEFAULT_BROWSER_SNAPSHOT_TIMEOUT_MS;
	const deadline = Date.now() + timeout;
	const controller = new AbortController();
	const signal = opts.signal ? AbortSignal.any([opts.signal, controller.signal]) : controller.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal);
	const read = async () => {
		signal.throwIfAborted();
		const page = await getPageForTargetId(opts);
		signal.throwIfAborted();
		let locator = page.locator(opts.selector ?? "body").first();
		if (!opts.selector) for (const selector of ["article", "main"]) {
			const candidate = page.locator(selector).first();
			const count = await candidate.count();
			signal.throwIfAborted();
			if (count) {
				locator = candidate;
				break;
			}
		}
		return await locator.innerText({
			timeout: Math.max(1, deadline - Date.now()),
			signal
		});
	};
	try {
		const text = await withTimeout(awaitActionWithAbort(read(), abortPromise), timeout, { createError: () => {
			const error = /* @__PURE__ */ new Error(`Page text extraction timed out after ${timeout}ms`);
			controller.abort(error);
			return error;
		} });
		return {
			text: text.slice(0, maxChars),
			truncated: text.length > maxChars
		};
	} finally {
		cleanup();
	}
}
/** Returns captured page errors, optionally clearing the per-page buffer. */
async function getPageErrorsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const errors = [...state.errors];
	if (opts.clear) state.errors = [];
	return { errors };
}
/** Returns captured requests, optionally filtering URLs/resource types and clearing. */
async function getNetworkRequestsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const raw = [...state.requests.values()];
	const filter = typeof opts.filter === "string" ? opts.filter.trim() : "";
	const requests = filter ? raw.filter((r) => r.url.includes(filter) || r.resourceType?.includes(filter)) : raw;
	if (opts.clear) {
		state.requests.clear();
		state.requestIds = /* @__PURE__ */ new WeakMap();
	}
	return { requests };
}
function consolePriority(level) {
	switch (level) {
		case "error": return 3;
		case "warn":
		case "warning": return 2;
		case "info":
		case "log": return 1;
		case "debug": return 0;
		default: return 1;
	}
}
/** Returns captured console messages at or above the requested priority level. */
async function getConsoleMessagesViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	if (!opts.level) return [...state.console];
	const min = consolePriority(opts.level);
	return state.console.filter((msg) => consolePriority(msg.type) >= min);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.actions.ts
async function highlightViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const ref = requireRef(opts.ref);
	try {
		await refLocator(page, ref).highlight();
	} catch (err) {
		throw toFriendlyInteractionError(err, ref);
	}
}
async function clickViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = opts.resolvedPage ?? await getRestoredPageForTarget(opts);
	if (opts.resolvedPage) {
		ensurePageState(page);
		restoreRoleRefsForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			page
		});
	}
	const { label, locator } = resolveInteractionElement(page, resolved);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	await runCancellablePageInteraction(page, opts, async (signal) => {
		const delayMs = resolveBoundedDelayMs(opts.delayMs, "click delayMs", ACT_MAX_CLICK_DELAY_MS);
		if (delayMs > 0) {
			await locator.hover({
				timeout,
				signal
			});
			throwIfInteractionAborted(opts.signal);
			await sleepWithAbort(delayMs, opts.signal);
			if (opts.assertCurrent) await assertInteractionCurrent(opts);
			throwIfInteractionAborted(opts.signal);
		}
		const clickOptions = {
			timeout,
			signal,
			button: opts.button,
			modifiers: opts.modifiers
		};
		await (opts.doubleClick ? locator.dblclick(clickOptions) : locator.click(clickOptions));
	}, label);
}
async function clickCoordsViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	await runGuardedPageInteraction(page, opts, async () => {
		await page.mouse.click(opts.x, opts.y, {
			button: opts.button,
			clickCount: opts.doubleClick ? 2 : 1,
			delay: resolveBoundedDelayMs(opts.delayMs, "clickCoords delayMs", ACT_MAX_CLICK_DELAY_MS)
		});
	});
}
async function runGuardedPageInteraction(page, opts, action) {
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	try {
		return await awaitNavigationGuardedInteraction({
			action,
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId,
			assertCurrent: opts.assertCurrent
		}, abortPromise, opts.signal, () => reconcileRemoteDialogAfterActionSettled(page, opts.signal));
	} finally {
		cleanup();
	}
}
function resolveInteractionElement(page, resolved) {
	return {
		label: resolved.ref ?? resolved.selector,
		locator: resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector)
	};
}
async function hoverViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const { label, locator } = resolveInteractionElement(page, resolved);
	await runCancellablePageInteraction(page, opts, async (signal) => await locator.hover({
		timeout: resolveActInteractionTimeoutMs(opts.timeoutMs),
		signal
	}), label);
}
async function dragViaPlaywright(opts) {
	const resolvedStart = requireRefOrSelector(opts.startRef, opts.startSelector);
	const resolvedEnd = requireRefOrSelector(opts.endRef, opts.endSelector);
	const page = await getRestoredPageForTarget(opts);
	const { label: startLabel, locator: startLocator } = resolveInteractionElement(page, resolvedStart);
	const { label: endLabel, locator: endLocator } = resolveInteractionElement(page, resolvedEnd);
	await runCancellablePageInteraction(page, opts, async (signal) => await startLocator.dragTo(endLocator, {
		timeout: resolveActInteractionTimeoutMs(opts.timeoutMs),
		signal
	}), `${startLabel} -> ${endLabel}`);
}
async function selectOptionViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	if (!opts.values?.length) throw new Error("values are required");
	const page = await getRestoredPageForTarget(opts);
	const { label, locator } = resolveInteractionElement(page, resolved);
	await runCancellablePageInteraction(page, opts, async (signal) => {
		await locator.selectOption(opts.values, {
			timeout: resolveActInteractionTimeoutMs(opts.timeoutMs),
			signal
		});
	}, label);
}
async function pressKeyViaPlaywright(opts) {
	const key = normalizeOptionalString(opts.key) ?? "";
	if (!key) throw new Error("key is required");
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await runGuardedPageInteraction(page, opts, async () => {
		await page.keyboard.press(key, { delay: resolveNonNegativeIntegerOption(opts.delayMs, 0) });
	});
}
async function insertTextViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await runGuardedPageInteraction(page, opts, async () => {
		try {
			await page.keyboard.insertText(opts.text);
		} catch {
			throw new Error("Unable to paste text into the browser. Focus an editable field and try again.");
		}
	});
}
async function typeViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const text = opts.text ?? "";
	const page = await getRestoredPageForTarget(opts);
	const { label, locator } = resolveInteractionElement(page, resolved);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	await runCancellablePageInteraction(page, opts, async (signal) => {
		if (opts.slowly) {
			await locator.click({
				timeout,
				signal
			});
			if (opts.assertCurrent) await assertInteractionCurrent(opts);
			throwIfInteractionAborted(opts.signal);
			await locator.type(text, {
				timeout,
				signal,
				delay: 75
			});
		} else await locator.fill(text, {
			timeout,
			signal
		});
		if (opts.submit) {
			if (opts.assertCurrent) await assertInteractionCurrent(opts);
			throwIfInteractionAborted(opts.signal);
			await locator.press("Enter", {
				timeout,
				signal
			});
		}
	}, label);
}
async function fillFormViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const timeout = resolveActInteractionTimeoutMs(opts.timeoutMs);
	for (const field of opts.fields) {
		const ref = field.ref.trim();
		if (!ref) continue;
		const type = (field.type || "text").trim() || "text";
		const rawValue = field.value;
		const value = typeof rawValue === "string" ? rawValue : typeof rawValue === "number" || typeof rawValue === "boolean" ? String(rawValue) : "";
		const locator = refLocator(page, ref);
		await runCancellablePageInteraction(page, opts, async (signal) => {
			if (type === "checkbox" || type === "radio") {
				const checked = rawValue === true || rawValue === 1 || rawValue === "1" || rawValue === "true";
				await locator.setChecked(checked, {
					timeout,
					signal
				});
			} else await locator.fill(value, {
				timeout,
				signal
			});
		}, ref);
	}
}
async function evaluateViaPlaywright(opts) {
	const fnText = normalizeOptionalString(opts.fn) ?? "";
	if (!fnText) throw new Error("function is required");
	const fnSource = normalizeBrowserEvaluateFunctionSource(fnText, opts.ref ? { argumentName: "el" } : void 0);
	const page = await getRestoredPageForTarget(opts);
	const outerTimeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	let evaluateTimeout = Math.max(1e3, Math.min(12e4, outerTimeout - 500));
	evaluateTimeout = Math.min(evaluateTimeout, outerTimeout);
	const signal = opts.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal, (reason) => {
		if (isBrowserObservedDialogBlockedError(reason)) return;
		forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy
		}).catch(() => {});
	});
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	try {
		const navigationPolicy = interactionNavigationPolicy(opts);
		const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
		const evaluatorBody = `
        "use strict";
        var fnSource = args.fnSource, timeoutMs = args.timeoutMs;
        try {
          var candidate = eval("(" + fnSource + ")");
          if (typeof candidate !== "function") {
            throw new Error("evaluate source did not produce a function");
          }
          var result = candidate(${opts.ref ? "el" : ""});
          if (result && typeof result.then === "function") {
            return Promise.race([
              result,
              new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("evaluate timed out after " + timeoutMs + "ms")); }, timeoutMs);
              })
            ]);
          }
          return result;
        } catch (err) {
          throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));
        }
      `;
		const args = {
			fnSource,
			timeoutMs: evaluateTimeout
		};
		let action;
		if (opts.ref) {
			const locator = refLocator(page, opts.ref);
			const evaluate = new Function("el", "args", evaluatorBody);
			action = async () => await locator.evaluate(evaluate, args);
		} else {
			const evaluate = new Function("args", evaluatorBody);
			action = async () => await page.evaluate(evaluate, args);
		}
		return await awaitNavigationGuardedInteraction({
			action,
			cdpUrl: opts.cdpUrl,
			page,
			...navigationPolicy,
			targetId: opts.targetId,
			assertCurrent: opts.assertCurrent
		}, abortPromise, signal, reconcileRemoteDialog);
	} finally {
		cleanup();
	}
}
async function scrollIntoViewViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const { label, locator } = resolveInteractionElement(page, resolved);
	await runCancellablePageInteraction(page, opts, async (signal) => await locator.scrollIntoViewIfNeeded({
		timeout,
		signal
	}), label);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.state.ts
/**
* Browser context and emulation state helpers for Playwright-backed tools.
*/
function resolvePageEmulationState(state) {
	return state.emulation ??= {};
}
function resolvePageEmulationSession(page, state) {
	const emulation = resolvePageEmulationState(state);
	if (emulation.session) return emulation.session;
	const pending = page.context().newCDPSession(page);
	emulation.session = pending;
	pending.catch(() => {
		if (emulation.session === pending) delete emulation.session;
	});
	return pending;
}
async function withPageEmulationCdpClient(params) {
	const session = await resolvePageEmulationSession(params.page, params.state);
	return await params.run(session.send.bind(session), session);
}
async function setViewportSizeOnPage(page, state, viewport) {
	const emulation = state.emulation;
	if (emulation?.metricsOwner && (emulation.metricsOwner.viewport.width !== viewport.width || emulation.metricsOwner.viewport.height !== viewport.height)) {
		await emulation.metricsOwner.session.send("Emulation.clearDeviceMetricsOverride");
		delete emulation.metricsOwner;
	}
	await page.setViewportSize(viewport);
}
async function runPageEmulationTransition(params) {
	params.signal?.throwIfAborted();
	const emulation = resolvePageEmulationState(params.state);
	const interrupted = emulation.transitionAbort ??= new AbortController();
	interrupted.signal.throwIfAborted();
	const signal = params.signal ? AbortSignal.any([params.signal, interrupted.signal]) : interrupted.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal);
	const transition = (emulation.transitionTail ?? Promise.resolve()).catch(() => {}).then(async () => {
		signal.throwIfAborted();
		const interrupt = () => interrupted.abort(/* @__PURE__ */ new Error("A previous screenshot or emulation action was cancelled but is still running. Retry when it finishes; if it remains stuck, close and reopen this tab."));
		params.signal?.addEventListener("abort", interrupt, { once: true });
		try {
			return await params.run();
		} finally {
			params.signal?.removeEventListener("abort", interrupt);
		}
	});
	const tail = transition.then(() => {}, () => {}).finally(() => {
		if (emulation.transitionTail === tail) {
			delete emulation.transitionTail;
			delete emulation.transitionAbort;
		}
	});
	emulation.transitionTail = tail;
	try {
		return await awaitActionWithAbort(transition, abortPromise);
	} finally {
		cleanup();
	}
}
/** Toggles offline mode for the target page context. */
async function setOfflineViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.context().setOffline(opts.offline);
}
/** Replaces extra HTTP headers for the target page context. */
async function setExtraHTTPHeadersViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.context().setExtraHTTPHeaders(opts.headers);
}
/** Sets or clears HTTP basic-auth credentials for the target page context. */
async function setHttpCredentialsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	if (opts.clear) {
		await page.context().setHTTPCredentials(null);
		return;
	}
	const username = opts.username ?? "";
	const password = opts.password ?? "";
	if (!username) throw new Error("username is required (or set clear=true)");
	await page.context().setHTTPCredentials({
		username,
		password
	});
}
/** Sets or clears geolocation and grants page-origin geolocation permission. */
async function setGeolocationViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const context = page.context();
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	if (opts.clear) {
		await context.setGeolocation(null);
		await context.clearPermissions().catch(() => {});
		return;
	}
	if (typeof opts.latitude !== "number" || typeof opts.longitude !== "number") throw new Error("latitude and longitude are required (or set clear=true)");
	await context.setGeolocation({
		latitude: opts.latitude,
		longitude: opts.longitude,
		accuracy: typeof opts.accuracy === "number" ? opts.accuracy : void 0
	});
	const origin = normalizeOptionalString(opts.origin) || (() => {
		try {
			return new URL(page.url()).origin;
		} catch {
			return "";
		}
	})();
	if (origin) {
		if (opts.assertCurrent) await assertInteractionCurrent(opts);
		await context.grantPermissions(["geolocation"], { origin }).catch(() => {});
	}
}
/** Emulates the requested media color scheme on the target page. */
async function emulateMediaViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.emulateMedia({ colorScheme: opts.colorScheme });
}
/** Applies a locale override through page-scoped CDP. */
async function setLocaleViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const locale = normalizeOptionalString(opts.locale) ?? "";
	if (!locale) throw new Error("locale is required");
	await withPageEmulationCdpClient({
		page,
		state: pageState,
		run: async (send) => {
			if (opts.assertCurrent) await assertInteractionCurrent(opts);
			try {
				await send("Emulation.setLocaleOverride", { locale });
			} catch (err) {
				if (String(err).includes("Another locale override is already in effect")) return;
				throw err;
			}
		}
	});
}
/** Applies a timezone override through page-scoped CDP. */
async function setTimezoneViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const timezoneId = normalizeOptionalString(opts.timezoneId) ?? "";
	if (!timezoneId) throw new Error("timezoneId is required");
	await withPageEmulationCdpClient({
		page,
		state: pageState,
		run: async (send) => {
			if (opts.assertCurrent) await assertInteractionCurrent(opts);
			try {
				await send("Emulation.setTimezoneOverride", { timezoneId });
			} catch (err) {
				const msg = String(err);
				if (msg.includes("Timezone override is already in effect")) return;
				if (msg.includes("Invalid timezone")) throw new Error(`Invalid timezone ID: ${timezoneId}`, { cause: err });
				throw err;
			}
		}
	});
}
/** Applies a Playwright device descriptor to viewport, user agent, and touch state. */
async function setDeviceViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const pageState = ensurePageState(page);
	const name = normalizeOptionalString(opts.name) ?? "";
	if (!name) throw new Error("device name is required");
	const descriptor = getPlaywrightCore().devices[name];
	if (!descriptor) throw new Error(`Unknown device "${name}".`);
	await runPageEmulationTransition({
		state: pageState,
		signal: opts.signal,
		run: async () => {
			if (opts.assertCurrent) {
				await assertInteractionCurrent(opts);
				opts.signal?.throwIfAborted();
			}
			const screen = descriptor.screen ?? descriptor.viewport;
			const isLandscape = screen.width > screen.height;
			await setViewportSizeOnPage(page, pageState, { ...descriptor.viewport });
			await withPageEmulationCdpClient({
				page,
				state: pageState,
				run: async (send, session) => {
					await send("Emulation.setUserAgentOverride", { userAgent: descriptor.userAgent });
					await send("Emulation.setDeviceMetricsOverride", {
						mobile: descriptor.isMobile,
						width: descriptor.viewport.width,
						height: descriptor.viewport.height,
						deviceScaleFactor: descriptor.deviceScaleFactor,
						screenWidth: screen.width,
						screenHeight: screen.height,
						screenOrientation: descriptor.isMobile && !isLandscape ? {
							angle: 0,
							type: "portraitPrimary"
						} : {
							angle: descriptor.isMobile ? 90 : 0,
							type: "landscapePrimary"
						}
					});
					const emulation = resolvePageEmulationState(pageState);
					emulation.metricsOwner = {
						session,
						viewport: { ...descriptor.viewport }
					};
					await send("Emulation.setTouchEmulationEnabled", { enabled: descriptor.hasTouch });
					emulation.touch = {
						session,
						enabled: descriptor.hasTouch
					};
				}
			});
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.content.ts
const DEFAULT_UPLOAD_MIME_TYPE = "application/octet-stream";
const PLAYWRIGHT_FILE_PAYLOAD_SIZE_LIMIT_BYTES = 52428800;
async function toPlaywrightFilePayloads(paths) {
	const stats = await Promise.all(paths.map(async (filePath) => await fs.stat(filePath)));
	if (stats.reduce((size, stat) => size + stat.size, 0) >= PLAYWRIGHT_FILE_PAYLOAD_SIZE_LIMIT_BYTES) throw new Error("Cannot set buffer larger than 50Mb, please write it to a file and pass its path instead.");
	return await Promise.all(paths.map(async (filePath, index) => {
		const buffer = await fs.readFile(filePath);
		return {
			name: path.basename(filePath),
			mimeType: await detectMime({
				buffer,
				filePath
			}) ?? DEFAULT_UPLOAD_MIME_TYPE,
			buffer,
			lastModifiedMs: stats[index]?.mtimeMs
		};
	}));
}
function shouldUsePlaywrightFilePayloads(opts) {
	return Boolean(opts.ssrfPolicy) && opts.browserFilesystemLocal !== true;
}
async function resolvePlaywrightUploadFiles(opts) {
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	try {
		return await awaitActionWithAbort((async () => {
			const resolved = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
			if (!resolved.ok) throw new Error(resolved.error);
			return shouldUsePlaywrightFilePayloads(opts) ? await toPlaywrightFilePayloads(resolved.paths) : resolved.paths;
		})(), abortPromise);
	} finally {
		cleanup();
	}
}
function createBrowserWaitPredicate(source) {
	return new Function("state", `
      if (state.document !== this.document) throw "Wait predicate document changed";
      state.predicate ??= (${source});
      var settled = state.settled;
      if (settled) {
        delete state.settled;
        if (settled.kind === "error") throw settled.error;
        if (!!settled.value) return true;
      }
      if (state.pending) return false;
      var predicate = state.predicate;
      var value = predicate();
      if (!value || typeof value.then !== "function") return !!value;
      state.pending = true;
      value.then(
        function(resolved) {
          state.settled = { kind: "value", value: resolved };
          delete state.pending;
        },
        function(error) {
          state.settled = { error: error, kind: "error" };
          delete state.pending;
        }
      );
      return false;
    `);
}
async function waitForViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const timeout = resolveActWaitTimeoutMs(opts.timeoutMs);
	const fn = normalizeOptionalString(opts.fn) ?? "";
	const predicateSource = fn ? normalizeBrowserEvaluateFunctionSource(fn) : "";
	const predicate = fn ? createBrowserWaitPredicate(predicateSource) : void 0;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	const waitForStep = async (stepPromise) => {
		await awaitActionWithAbort(stepPromise, abortPromise, reconcileRemoteDialog);
	};
	const waitForSettledStep = async (stepPromise) => {
		await stepPromise;
		reconcileRemoteDialog();
		throwIfInteractionAborted(opts.signal);
	};
	const runWaitSequence = async (waitFor) => {
		if (typeof opts.timeMs === "number" && Number.isFinite(opts.timeMs)) await waitFor(page.waitForTimeout(resolveBoundedDelayMs(opts.timeMs, "wait timeMs", ACT_MAX_WAIT_TIME_MS)));
		if (opts.text) await waitFor(page.getByText(opts.text).first().waitFor({
			state: "visible",
			timeout
		}));
		if (opts.textGone) await waitFor(page.getByText(opts.textGone).first().waitFor({
			state: "hidden",
			timeout
		}));
		if (opts.selector) {
			const selector = normalizeOptionalString(opts.selector) ?? "";
			if (selector) await waitFor(page.locator(selector).first().waitFor({
				state: "visible",
				timeout
			}));
		}
		if (opts.url) {
			const url = normalizeOptionalString(opts.url) ?? "";
			if (url) await waitFor(page.waitForURL(url, { timeout }));
		}
		if (opts.loadState) await waitFor(page.waitForLoadState(opts.loadState, { timeout }));
		if (fn) {
			if (opts.assertCurrent) {
				await assertInteractionCurrent(opts);
				throwIfInteractionAborted(opts.signal);
			}
			const documentHandle = await page.evaluateHandle(() => globalThis.document);
			try {
				if (opts.assertCurrent) await assertInteractionCurrent(opts);
				throwIfInteractionAborted(opts.signal);
				await waitFor(page.waitForFunction(predicate, { document: documentHandle }, { timeout }));
			} finally {
				await documentHandle.dispose();
			}
		}
	};
	try {
		if (!fn) {
			await runWaitSequence(waitForStep);
			return;
		}
		await awaitNavigationGuardedInteraction({
			action: async () => await runWaitSequence(waitForSettledStep),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId,
			assertCurrent: opts.assertCurrent
		}, abortPromise, opts.signal, reconcileRemoteDialog);
	} finally {
		cleanup();
	}
}
async function runScreenshotOperation(page, opts, run) {
	const controller = new AbortController();
	const signal = opts.signal ? AbortSignal.any([opts.signal, controller.signal]) : controller.signal;
	const timeoutMs = opts.timeoutMs ?? 2e4;
	return await withTimeout(runPageEmulationTransition({
		state: ensurePageState(page),
		signal,
		run: () => run(signal)
	}), timeoutMs, { createError: () => {
		const error = /* @__PURE__ */ new Error(`Screenshot via Playwright timed out after ${timeoutMs}ms`);
		controller.abort(error);
		return error;
	} });
}
function screenshotLocator(page, ref, element) {
	return ref ? refLocator(page, ref) : element ? page.locator(element).first() : void 0;
}
async function capturePageScreenshot(page, opts, locator) {
	opts.signal?.throwIfAborted();
	if (locator && opts.fullPage) throw new Error("fullPage is not supported for element screenshots");
	const type = opts.type ?? "png";
	const emulation = ensurePageState(page).emulation;
	const owner = emulation?.metricsOwner;
	const preparation = {
		timeout: opts.timeoutMs ?? 2e4,
		signal: opts.signal
	};
	const element = await locator?.elementHandle({ timeout: preparation.timeout });
	try {
		await element?.scrollIntoViewIfNeeded(preparation);
		opts.signal?.throwIfAborted();
		if (!owner) return { buffer: await (element ? element.screenshot({
			type,
			timeout: 0
		}) : page.screenshot({
			type,
			fullPage: Boolean(opts.fullPage),
			timeout: 0
		})) };
		const box = element ? await element.boundingBox() : void 0;
		if (locator && (!box || !box.width || !box.height)) throw new Error("Cannot take a screenshot of an element that is not visible or has no size");
		const metrics = await owner.session.send("Page.getLayoutMetrics");
		const visual = metrics.cssVisualViewport;
		let clip = {
			...metrics.cssContentSize,
			scale: 1
		};
		if (box) {
			const x = Math.floor(box.x + visual.pageX);
			const y = Math.floor(box.y + visual.pageY);
			clip = {
				x,
				y,
				width: Math.ceil(box.x + visual.pageX + box.width) - x,
				height: Math.ceil(box.y + visual.pageY + box.height) - y,
				scale: 1
			};
		} else if (!opts.fullPage) clip = {
			x: visual.pageX,
			y: visual.pageY,
			width: Math.ceil(owner.viewport.width / visual.scale),
			height: Math.ceil(owner.viewport.height / visual.scale),
			scale: visual.scale
		};
		const captureBeyondViewport = Boolean((opts.fullPage || locator) && (clip.width > owner.viewport.width || clip.height > owner.viewport.height));
		opts.signal?.throwIfAborted();
		const result = await owner.session.send("Page.captureScreenshot", {
			format: type,
			clip,
			captureBeyondViewport
		});
		return {
			buffer: Buffer.from(result.data, "base64"),
			clip
		};
	} finally {
		try {
			if (emulation?.touch) await emulation.touch.session.send("Emulation.setTouchEmulationEnabled", { enabled: emulation.touch.enabled });
		} finally {
			await element?.dispose();
		}
	}
}
async function takeScreenshotViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	return await runScreenshotOperation(page, opts, async (signal) => {
		restoreRoleRefsForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			page
		});
		const { buffer } = await capturePageScreenshot(page, {
			...opts,
			signal
		}, screenshotLocator(page, opts.ref, opts.element));
		return { buffer };
	});
}
async function screenshotWithLabelsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	return await runScreenshotOperation(page, opts, (signal) => screenshotWithLabelsOnPage(page, {
		...opts,
		signal
	}));
}
async function screenshotWithLabelsOnPage(page, opts) {
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const maxLabels = typeof opts.maxLabels === "number" && Number.isFinite(opts.maxLabels) ? Math.max(1, Math.floor(opts.maxLabels)) : 150;
	const refKey = normalizeOptionalString(opts.ref) ?? void 0;
	const elementSelector = normalizeOptionalString(opts.element) ?? void 0;
	const locator = screenshotLocator(page, refKey, elementSelector);
	const space = opts.fullPage ? "fullpage" : refKey || elementSelector ? "element" : "viewport";
	const view = await page.evaluate((viewportWidth) => ({
		x: window.visualViewport.pageLeft,
		y: window.visualViewport.pageTop,
		width: window.visualViewport.width,
		height: window.visualViewport.height,
		nativeCaptureWidth: Math.floor((viewportWidth ?? window.innerWidth) / window.visualViewport.scale + .001),
		fullWidth: Math.max(document.body?.scrollWidth ?? 0, document.documentElement.scrollWidth, document.body?.offsetWidth ?? 0, document.documentElement.offsetWidth, document.body?.clientWidth ?? 0, document.documentElement.clientWidth)
	}), page.viewportSize()?.width);
	let elementRect;
	if (space === "element") {
		const box = await locator?.boundingBox().catch(() => null);
		if (!box) throw new Error(`screenshotWithLabelsViaPlaywright: element not found for ${refKey ? `ref="${refKey}"` : `selector="${elementSelector ?? ""}"`}`);
		elementRect = {
			x: box.x + view.x,
			y: box.y + view.y,
			width: box.width,
			height: box.height
		};
	}
	const refs = opts.refs ?? ensurePageState(page).roleRefs ?? {};
	const refKeys = Object.keys(refs);
	const inputs = [];
	let skippedRefs = 0;
	for (const ref of refKeys) {
		const refInfo = refs[ref];
		if (refInfo === void 0) continue;
		const target = refLocator(page, ref);
		if (space === "fullpage" && inputs.length >= maxLabels) {
			skippedRefs += 1;
			continue;
		}
		const box = await target.boundingBox().catch(() => null);
		if (!box) {
			skippedRefs += 1;
			continue;
		}
		inputs.push({
			ref,
			role: refInfo.role,
			name: refInfo.name,
			doc: {
				x: box.x + view.x,
				y: box.y + view.y,
				width: box.width,
				height: box.height
			}
		});
	}
	const origin = space === "element" ? elementRect : space === "viewport" ? view : {
		x: 0,
		y: 0
	};
	const plan = planAnnotations({
		inputs,
		space,
		scroll: origin,
		viewport: view,
		elementRect,
		maxLabels
	});
	try {
		opts.signal?.throwIfAborted();
		if (plan.overlayItems.length > 0) await page.evaluate(buildOverlayInjectionScript({
			items: plan.overlayItems,
			captureY: origin.y
		}));
		const capture = await capturePageScreenshot(page, opts, locator);
		const clip = capture.clip ?? (space === "viewport" ? {
			...view,
			width: view.nativeCaptureWidth
		} : {
			x: Math.floor(origin.x + .001),
			y: Math.floor(origin.y + .001),
			width: elementRect ? Math.ceil(elementRect.x + elementRect.width - .001) - Math.floor(origin.x + .001) : view.fullWidth
		});
		const image = await getImageMetadata(capture.buffer);
		if (!image) throw new Error("Cannot determine screenshot dimensions for label annotations");
		const scale = image.width / clip.width;
		return {
			buffer: capture.buffer,
			labels: plan.overlayItems.length,
			skipped: plan.skipped + skippedRefs,
			annotations: scaleAnnotations(plan.annotations, scale, scale, {
				x: clip.x - origin.x,
				y: clip.y - origin.y
			})
		};
	} finally {
		await page.evaluate(buildOverlayClearScript()).catch(() => {});
	}
}
async function setFileChooserFilesViaPlaywright(opts) {
	const resolvedFiles = await resolvePlaywrightUploadFiles(opts);
	await runCancellablePageInteraction(opts.page, opts, async (signal) => {
		await opts.fileChooser.setFiles(resolvedFiles, {
			timeout: opts.timeoutMs,
			signal
		});
	});
}
async function setInputFilesViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	if (!opts.paths.length) throw new Error("paths are required");
	const inputRef = normalizeOptionalString(opts.inputRef) ?? "";
	const element = normalizeOptionalString(opts.element) ?? "";
	if (inputRef && element) throw new Error("inputRef and element are mutually exclusive");
	if (!inputRef && !element) throw new Error("inputRef or element is required");
	const locator = inputRef ? refLocator(page, inputRef) : page.locator(element).first();
	const resolvedFiles = await resolvePlaywrightUploadFiles(opts);
	await runCancellablePageInteraction(page, opts, async (signal) => await locator.setInputFiles(resolvedFiles, {
		timeout: normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS),
		signal
	}), inputRef || element);
}
//#endregion
//#region extensions/browser/src/browser/pw-snapshot-page.ts
function resolveSnapshotTimeoutMs(timeoutMs) {
	return Math.max(500, Math.min(6e4, Math.floor(parseFiniteNumber(timeoutMs) ?? 5e3)));
}
async function collectSnapshotUrls(page) {
	const urls = await page.evaluate(() => {
		const seen = /* @__PURE__ */ new Set();
		const out = [];
		for (const anchor of document.querySelectorAll("a[href]")) {
			const href = anchor instanceof HTMLAnchorElement ? anchor.href : "";
			if (!href || seen.has(href)) continue;
			const text = (anchor.textContent || anchor.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 121) || href;
			seen.add(href);
			out.push({
				text,
				url: href
			});
			if (out.length >= 100) break;
		}
		return out;
	}).catch(() => []);
	return Array.isArray(urls) ? urls.map((entry) => {
		entry.text = truncateUtf16Safe(entry.text, 120) || entry.url;
		return entry;
	}) : [];
}
async function prepareSnapshotPageViaPlaywright(opts) {
	const page = await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	if (opts.ssrfPolicy) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	return page;
}
async function withSnapshotFrameGuard(opts) {
	let frameCurrent = true;
	const onFrameChanged = (frame) => {
		if (!opts.frame || frame === opts.frame) frameCurrent = false;
	};
	opts.page.on("framenavigated", onFrameChanged);
	opts.page.on("framedetached", onFrameChanged);
	const assertCurrent = () => {
		opts.signal?.throwIfAborted();
		opts.assertCurrent?.();
		if (!frameCurrent) throw new Error("Frame changed while its browser snapshot was being captured; retry.");
		if (opts.deadlineMs !== void 0 && performance.now() >= opts.deadlineMs) throw new Error("Browser snapshot capture timed out.");
	};
	try {
		assertCurrent();
		return await opts.run(assertCurrent);
	} finally {
		frameCurrent = false;
		opts.page.off("framenavigated", onFrameChanged);
		opts.page.off("framedetached", onFrameChanged);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-role-snapshot-capture.ts
async function finalizeRoleSnapshotViaPlaywright(params) {
	const snapshot = params.urls ? appendSnapshotUrls(params.built.snapshot, await collectSnapshotUrls(params.frame ?? params.page)) : params.built.snapshot;
	params.assertCurrent();
	const finalized = finalizeRoleSnapshot({
		snapshot,
		refs: params.built.refs,
		maxChars: params.maxChars,
		delta: params.delta
	});
	storeRoleRefsForTarget({
		page: params.page,
		cdpUrl: params.cdpUrl,
		targetId: params.targetId,
		refs: finalized.refs,
		...params.frameSelector ? { frameSelector: params.frameSelector } : {},
		...params.frame ? { frame: params.frame } : {},
		mode: params.mode
	});
	return finalized;
}
/** Captures a role-ref snapshot used by model-facing browser interaction tools. */
async function snapshotRoleViaPlaywright(opts) {
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaSnapshotTimeout = resolveSnapshotTimeoutMs(opts.timeoutMs);
	const captureDeadline = performance.now() + ariaSnapshotTimeout;
	if (opts.refsMode === "aria") {
		if (normalizeOptionalString(opts.selector) || normalizeOptionalString(opts.frameSelector)) throw new Error("refs=aria does not support selector/frame snapshots yet.");
		return await withSnapshotFrameGuard({
			page,
			signal: opts.signal,
			deadlineMs: captureDeadline,
			run: async (assertCurrent) => {
				const snapshot = await page.ariaSnapshot({
					mode: "ai",
					timeout: ariaSnapshotTimeout
				});
				const built = buildRoleSnapshotFromAiSnapshot(snapshot, opts.options);
				if (opts.options === void 0) built.snapshot = snapshot;
				return await finalizeRoleSnapshotViaPlaywright({
					page,
					cdpUrl: opts.cdpUrl,
					targetId: opts.targetId,
					assertCurrent,
					built,
					mode: "aria",
					urls: opts.urls,
					maxChars: opts.maxChars,
					delta: opts.delta
				});
			}
		});
	}
	const frameSelector = normalizeOptionalString(opts.frameSelector) ?? "";
	const selector = normalizeOptionalString(opts.selector) ?? "";
	const frameElement = frameSelector ? await page.locator(frameSelector).elementHandle({ timeout: ariaSnapshotTimeout }) : void 0;
	let frame;
	if (frameElement) try {
		frame = await frameElement.contentFrame() ?? void 0;
	} finally {
		await frameElement.dispose();
	}
	if (frameSelector && !frame) throw new Error("Frame was unavailable while its browser snapshot was being captured.");
	return await withSnapshotFrameGuard({
		page,
		frame: frame ?? page.mainFrame(),
		signal: opts.signal,
		deadlineMs: captureDeadline,
		run: async (assertCurrent) => {
			const snapshotScope = frame ?? page;
			const locator = snapshotScope.locator(selector || ":root");
			if (!(!selector || await withTimeout(locator.count(), ariaSnapshotTimeout, "Role snapshot selector") > 0)) return await finalizeRoleSnapshotViaPlaywright({
				...opts,
				page,
				frameSelector: frameSelector || void 0,
				frame,
				assertCurrent,
				built: {
					snapshot: opts.options?.interactive ? "(no interactive elements)" : "(empty)",
					refs: {}
				},
				mode: "role",
				urls: false
			});
			const remaining = () => {
				assertCurrent();
				return Math.max(1, Math.ceil(captureDeadline - performance.now()));
			};
			const root = await locator.elementHandle({ timeout: remaining() });
			if (!root) throw new Error("Snapshot root changed before native capture; retry.");
			let result;
			let captureOwnsRoot = false;
			try {
				result = await withPageScopedCdpClient({
					page,
					frame,
					timeoutMs: remaining(),
					fn: async (send) => {
						assertCurrent();
						captureOwnsRoot = true;
						try {
							return await withCdpSnapshotRoot({
								root,
								send,
								run: async (rootBackendNodeId) => {
									const captured = await snapshotRoleViaCdpSession({
										send,
										rootBackendNodeId,
										options: opts.options,
										urlEntries: opts.urls ? await collectSnapshotUrls(snapshotScope) : void 0,
										maxChars: opts.maxChars,
										delta: opts.delta,
										recurseIframes: false
									});
									remaining();
									const backendRefs = Object.entries(captured.refs).map(([ref, info]) => {
										if (!info.backendDOMNodeId) throw new Error("Snapshot control has no DOM identity; retry.");
										return {
											ref,
											backendDOMNodeId: info.backendDOMNodeId
										};
									});
									if ((await markBackendDomRefsOnPage({
										page,
										frame,
										send,
										rootBackendNodeId,
										refs: backendRefs,
										assertCurrent
									})).size !== backendRefs.length) throw new Error("Snapshot controls changed before refs were bound; retry.");
									remaining();
									const refs = Object.fromEntries(Object.entries(captured.refs).map(([ref, info]) => {
										const { backendDOMNodeId: _backend, ...metadata } = info;
										return [ref, {
											...metadata,
											domMarker: true
										}];
									}));
									return {
										...captured,
										refs
									};
								}
							});
						} finally {
							root.dispose().catch(() => {});
						}
					}
				});
			} finally {
				if (!captureOwnsRoot) root.dispose().catch(() => {});
			}
			remaining();
			storeRoleRefsForTarget({
				page,
				frame,
				frameSelector: frameSelector || void 0,
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				refs: result.refs,
				mode: "role"
			});
			return result;
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.snapshot.ts
/**
* Snapshot, navigation, viewport, close, and PDF helpers for Playwright-backed
* browser tools.
*/
function resolveViewportDimension(value, label) {
	const dimension = resolveIntegerOption(value, 1, { min: 1 });
	if (dimension > 8192) throw new Error(`viewport ${label} exceeds maximum of ${ACT_MAX_VIEWPORT_DIMENSION}`);
	return dimension;
}
function buildStoredAriaRefs(nodes) {
	const refs = {};
	const groups = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		const role = normalizeLowercaseStringOrEmpty(node.role) || "unknown";
		const name = node.name.trim();
		const key = `${role}:${name}`;
		const group = groups.get(key);
		const nth = group?.count ?? 0;
		if (group) group.count += 1;
		else groups.set(key, {
			count: 1,
			firstRef: node.ref
		});
		refs[node.ref] = {
			role,
			name,
			nth,
			...typeof node.backendDOMNodeId === "number" ? { backendDOMNodeId: node.backendDOMNodeId } : {}
		};
	}
	for (const { count, firstRef } of groups.values()) if (count === 1 && firstRef) delete refs[firstRef]?.nth;
	return refs;
}
/** Publish raw or finalized snapshot refs into the Playwright action cache. */
async function storeSnapshotRefsViaPlaywright(opts) {
	const sourceRefs = opts.refs ?? buildStoredAriaRefs(opts.nodes ?? []);
	const page = opts.page ?? await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	const backendRefs = [];
	for (const [ref, info] of Object.entries(sourceRefs)) if (typeof info.backendDOMNodeId === "number") backendRefs.push({
		ref,
		backendDOMNodeId: info.backendDOMNodeId
	});
	await withSnapshotFrameGuard({
		page,
		frame: page.mainFrame(),
		signal: opts.signal,
		deadlineMs: opts.deadlineMs,
		assertCurrent: opts.assertCurrent,
		run: async (assertCurrent) => {
			if (opts.expectedDocumentIdentity && await readMainFrameDocumentIdentityForPage(page) !== opts.expectedDocumentIdentity) throw new Error("Frame changed while its browser snapshot refs were being published; retry.");
			await markBackendDomRefsOnPage({
				page,
				refs: backendRefs,
				assertCurrent
			});
			assertCurrent();
			const refs = Object.fromEntries(Object.entries(sourceRefs).map(([ref, info]) => {
				const { backendDOMNodeId, ...storedInfo } = info;
				if (typeof backendDOMNodeId === "number") storedInfo.domMarker = true;
				return [ref, storedInfo];
			}));
			storeRoleRefsForTarget({
				page,
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				refs,
				mode: "role"
			});
		}
	});
}
/** Captures a raw accessibility tree snapshot and stores matching role refs. */
async function snapshotAriaViaPlaywright(opts) {
	const limit = resolveIntegerOption(opts.limit, 500, {
		min: 1,
		max: 2e3
	});
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaTimeoutMs = resolveSnapshotTimeoutMs(opts.timeoutMs);
	return await withSnapshotFrameGuard({
		page,
		frame: page.mainFrame(),
		signal: opts.signal,
		deadlineMs: performance.now() + ariaTimeoutMs,
		run: async (assertCurrent) => {
			const res = await withPageScopedCdpClient({
				page,
				timeoutMs: ariaTimeoutMs,
				fn: async (send) => {
					await send("Accessibility.enable").catch(() => {});
					return await send("Accessibility.getFullAXTree");
				}
			});
			assertCurrent();
			const nodes = Array.isArray(res?.nodes) ? res.nodes : [];
			const formatted = formatAriaSnapshot(nodes, limit);
			await storeSnapshotRefsViaPlaywright({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				nodes: formatted,
				page,
				signal: opts.signal,
				assertCurrent
			});
			return { nodes: formatted };
		}
	});
}
/** Navigates the target page while enforcing browser SSRF policy before and after load. */
async function navigateViaPlaywright(opts) {
	const isRetryableNavigateError = (err) => {
		const msg = typeof err === "string" ? err.toLowerCase() : err instanceof Error ? err.message.toLowerCase() : "";
		return msg.includes("frame has been detached") || msg.includes("target page, context or browser has been closed");
	};
	const url = normalizeOptionalString(opts.url) ?? "";
	if (!url) throw new Error("url is required");
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	await assertBrowserNavigationAllowed({
		url,
		...navigationPolicy
	});
	const timeout = resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	let currentTargetId = opts.targetId;
	let page = await getPageForTargetId(opts);
	let pageState = ensurePageState(page);
	const navigate = async () => await gotoPageWithNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page,
		url,
		timeoutMs: timeout,
		ssrfPolicy: opts.ssrfPolicy,
		browserProxyMode: opts.browserProxyMode,
		targetId: currentTargetId,
		...opts.resolveOperationTarget ? { assertPageCurrent: async () => {
			if (await opts.resolveOperationTarget?.() !== currentTargetId) throw new BrowserTabNotFoundError({ input: currentTargetId });
			if (opts.assertCurrent) await opts.assertCurrent();
		} } : opts.assertCurrent ? { assertPageCurrent: opts.assertCurrent } : {}
	});
	const navigateWithDownloadCapture = async () => {
		const downloadCapture = createDownloadCaptureForPage(page, pageState, timeout, {
			mode: "passive",
			timeoutMessage: "Timeout waiting for navigation download",
			beforeSave: async (download) => {
				await assertBrowserNavigationResultAllowed({
					url: download.url || url,
					...navigationPolicy
				});
			}
		});
		downloadCapture.promise.catch(() => {});
		try {
			const response = await navigate();
			downloadCapture.cancel();
			return { response };
		} catch (err) {
			if (!isDownloadStartingNavigationError(err, url) || !downloadCapture.armed) {
				downloadCapture.cancel();
				throw err;
			}
			try {
				return {
					response: null,
					download: await downloadCapture.promise
				};
			} catch (downloadErr) {
				if (downloadErr instanceof Error && downloadErr.message === "Timeout waiting for navigation download") throw err;
				if (isPolicyDenyNavigationError(downloadErr)) await closeBlockedNavigationTarget({
					cdpUrl: opts.cdpUrl,
					page,
					targetId: currentTargetId
				});
				throw downloadErr;
			}
		}
	};
	let navigationResult;
	try {
		navigationResult = await navigateWithDownloadCapture();
	} catch (err) {
		if (!isRetryableNavigateError(err)) throw err;
		if (opts.relayReference) await closeRelayOperationConnection(opts.relayReference);
		else await forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy
		}).catch(() => {});
		if (opts.resolveOperationTarget) {
			await connectBrowser(opts.cdpUrl, opts.ssrfPolicy, opts.relayReference);
			const replacementTargetId = await opts.resolveOperationTarget();
			if (!replacementTargetId) throw new BrowserTabNotFoundError({ input: currentTargetId });
			page = await getPageForTargetId({
				...opts,
				targetId: replacementTargetId
			});
			if (await opts.resolveOperationTarget() !== replacementTargetId) throw new BrowserTabNotFoundError({ input: currentTargetId });
			currentTargetId = replacementTargetId;
		} else page = await getPageForTargetId(opts);
		pageState = ensurePageState(page);
		navigationResult = await navigateWithDownloadCapture();
	}
	try {
		if (!navigationResult.download) await assertPageNavigationCompletedSafely({
			cdpUrl: opts.cdpUrl,
			page,
			response: navigationResult.response,
			ssrfPolicy: opts.ssrfPolicy,
			browserProxyMode: opts.browserProxyMode,
			targetId: currentTargetId
		});
	} catch (err) {
		if (isPolicyDenyNavigationError(err)) await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: currentTargetId
		});
		throw err;
	}
	const finalUrl = navigationResult.download?.url || page.url();
	const targetId = (await pageTargetInfo(page).catch(() => null))?.targetId;
	return {
		url: finalUrl,
		...targetId ? { targetId } : {},
		...navigationResult.download ? { download: navigationResult.download } : {}
	};
}
/** Resizes the target page viewport within the browser action policy bounds. */
async function resizeViewportViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const viewport = {
		width: resolveViewportDimension(opts.width, "width"),
		height: resolveViewportDimension(opts.height, "height")
	};
	await runPageEmulationTransition({
		state,
		signal: opts.signal,
		run: opts.assertCurrent ? async () => {
			await assertInteractionCurrent(opts);
			opts.signal?.throwIfAborted();
			await setViewportSizeOnPage(page, state, viewport);
		} : () => setViewportSizeOnPage(page, state, viewport)
	});
}
/** Closes the target Playwright page. */
async function closePageViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (readBrowserDashboardTabs().length > 0) {
		const targetId = (await pageTargetInfo(page))?.targetId;
		if (!targetId) throw new Error("Cannot verify that this page is not retained by a dashboard");
		assertBrowserDashboardTabCanClose(targetId);
	}
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.close();
}
/** Renders the target page to a PDF buffer. */
async function pdfViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { buffer: await page.pdf({ printBackground: true }) };
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.execution.ts
const ACT_DOWNLOAD_MAX_DRAIN_MS = 1e3;
async function executeSingleAction(action, cdpUrl, targetId, evaluateEnabled, navigationPolicy = {}, depth = 0, signal, assertCurrent) {
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	const effectiveTargetId = action.targetId ?? targetId;
	const interaction = {
		cdpUrl,
		targetId: effectiveTargetId,
		...navigationPolicy,
		signal,
		assertCurrent
	};
	if (assertCurrent) await assertInteractionCurrent(interaction);
	switch (action.kind) {
		case "click":
			await clickViaPlaywright({
				...interaction,
				ref: action.ref,
				selector: action.selector,
				doubleClick: action.doubleClick,
				button: action.button,
				modifiers: action.modifiers,
				delayMs: action.delayMs,
				timeoutMs: action.timeoutMs
			});
			break;
		case "clickCoords":
			await clickCoordsViaPlaywright({
				...interaction,
				x: action.x,
				y: action.y,
				doubleClick: action.doubleClick,
				button: action.button,
				delayMs: action.delayMs
			});
			break;
		case "type":
			await typeViaPlaywright({
				...interaction,
				ref: action.ref,
				selector: action.selector,
				text: action.text,
				submit: action.submit,
				slowly: action.slowly,
				timeoutMs: action.timeoutMs
			});
			break;
		case "insertText":
			await insertTextViaPlaywright({
				...interaction,
				text: action.text
			});
			break;
		case "press":
			await pressKeyViaPlaywright({
				...interaction,
				key: action.key,
				delayMs: action.delayMs
			});
			break;
		case "hover":
			await hoverViaPlaywright({
				...interaction,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs
			});
			break;
		case "scrollIntoView":
			await scrollIntoViewViaPlaywright({
				...interaction,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs
			});
			break;
		case "drag":
			await dragViaPlaywright({
				...interaction,
				startRef: action.startRef,
				startSelector: action.startSelector,
				endRef: action.endRef,
				endSelector: action.endSelector,
				timeoutMs: action.timeoutMs
			});
			break;
		case "select":
			await selectOptionViaPlaywright({
				...interaction,
				ref: action.ref,
				selector: action.selector,
				values: action.values,
				timeoutMs: action.timeoutMs
			});
			break;
		case "fill":
			await fillFormViaPlaywright({
				...interaction,
				fields: action.fields,
				timeoutMs: action.timeoutMs
			});
			break;
		case "resize":
			await resizeViewportViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				width: action.width,
				height: action.height,
				signal,
				assertCurrent
			});
			break;
		case "wait":
			if (action.fn && !evaluateEnabled) throw new Error("wait --fn is disabled by config (browser.evaluateEnabled=false)");
			await waitForViaPlaywright({
				...interaction,
				timeMs: action.timeMs,
				text: action.text,
				textGone: action.textGone,
				selector: action.selector,
				url: action.url,
				loadState: action.loadState,
				fn: action.fn,
				timeoutMs: action.timeoutMs
			});
			break;
		case "evaluate":
			if (!evaluateEnabled) throw new Error("act:evaluate is disabled by config (browser.evaluateEnabled=false)");
			return await evaluateViaPlaywright({
				...interaction,
				fn: action.fn,
				ref: action.ref,
				timeoutMs: action.timeoutMs
			});
		case "close":
			await closePageViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				assertCurrent
			});
			break;
		case "batch": {
			const failure = (await batchViaPlaywright({
				...interaction,
				actions: action.actions,
				stopOnError: action.stopOnError,
				evaluateEnabled,
				depth: depth + 1
			})).results.find((result) => !result.ok);
			if (failure) throw new Error(failure.error);
			break;
		}
		default: throw new Error(`Unsupported batch action kind: ${action.kind}`);
	}
}
function actionUsesNavigationRequestGuard(action) {
	if (action.kind === "batch") return action.actions.some(actionUsesNavigationRequestGuard);
	return action.kind === "wait" ? Boolean(action.fn) : action.kind !== "close" && action.kind !== "resize";
}
function actionNeedsStandaloneDownloadGrace(action, navigationPolicy) {
	return actionUsesNavigationRequestGuard(action) && !hasInteractionNavigationPolicy(navigationPolicy);
}
async function executeActViaPlaywright(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const page = await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const withOperationTarget = async (payload) => {
		const targetId = (await pageTargetInfo(page).catch(() => null))?.targetId;
		return {
			...payload,
			...targetId ? { targetId } : {}
		};
	};
	const downloadCapture = beginActionDownloadCaptureOnPage(page, { beforeSave: async (download) => {
		if (!download.url) throw new Error("Action download URL is unavailable");
		await assertBrowserNavigationResultAllowed({
			url: download.url,
			...navigationPolicy
		});
	} });
	const downloadGraceMs = actionNeedsStandaloneDownloadGrace(opts.action, navigationPolicy) ? 250 : 0;
	const drainDownloads = async (firstEventGraceMs = downloadGraceMs) => await downloadCapture.drain({
		firstEventGraceMs,
		maxWaitMs: ACT_DOWNLOAD_MAX_DRAIN_MS,
		quietMs: 250
	});
	const dialogAbort = createObservedDialogAbortSignalForPage({
		page,
		parentSignal: opts.signal
	});
	try {
		if (opts.action.kind === "batch") {
			const batch = await batchViaPlaywright({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				page,
				...navigationPolicy,
				actions: opts.action.actions,
				stopOnError: opts.action.stopOnError,
				evaluateEnabled: opts.evaluateEnabled,
				signal: dialogAbort.signal,
				assertCurrent: opts.assertCurrent
			});
			const newDownloads = await drainDownloads();
			return await withOperationTarget({
				results: batch.results,
				...batch.aborted ? { aborted: batch.aborted } : {},
				...newDownloads ? { downloads: newDownloads } : {}
			});
		}
		const result = await executeSingleAction(opts.action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, navigationPolicy, 0, dialogAbort.signal, opts.assertCurrent);
		const newDownloads = await drainDownloads();
		if (opts.action.kind === "evaluate") return await withOperationTarget({
			result,
			...newDownloads ? { downloads: newDownloads } : {}
		});
		return await withOperationTarget(newDownloads ? { downloads: newDownloads } : {});
	} catch (err) {
		let failure = err;
		try {
			await drainDownloads(dialogAbort.signal.aborted && actionUsesNavigationRequestGuard(opts.action) ? 250 : downloadGraceMs);
		} catch (downloadErr) {
			failure = downloadErr;
		}
		if (isBrowserObservedDialogBlockedError(failure)) return await withOperationTarget({
			blockedByDialog: true,
			browserState: failure.browserState
		});
		if (isPolicyDenyNavigationError(failure) && !wasBrowserNavigationSourcePreservedAfterPolicyDenial(failure)) await quarantineBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId
		});
		throw failure;
	} finally {
		downloadCapture.dispose();
		dialogAbort.cleanup();
	}
}
async function batchViaPlaywright(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const depth = opts.depth ?? 0;
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	if (opts.actions.length > 100) throw new Error(`Batch exceeds maximum of 100 actions`);
	const page = opts.page ?? await getPageForTargetId(opts);
	const results = [];
	const finishAborted = (reason, afterAction, url, skipped) => skipped === 0 ? { results } : {
		results,
		aborted: {
			reason,
			afterAction,
			url,
			skipped
		}
	};
	let mainFrameNavigations = 0;
	let navigationsAtLastDispatch = 0;
	const currentMainFrameUrl = () => page.mainFrame?.().url() ?? page.url();
	const onFrameNavigated = (frame) => {
		if (frame === page.mainFrame?.()) mainFrameNavigations += 1;
	};
	const finishNavigation = (afterAction, skipped) => {
		const url = currentMainFrameUrl();
		const lastResult = results.at(-1);
		if (lastResult) results[results.length - 1] = {
			...lastResult,
			navigated: true,
			url
		};
		return finishAborted("navigation", afterAction, url, skipped);
	};
	page.on?.("framenavigated", onFrameNavigated);
	try {
		for (const [index, action] of opts.actions.entries()) {
			if (opts.signal?.aborted) throw opts.signal.reason ?? /* @__PURE__ */ new Error("aborted");
			if (mainFrameNavigations > navigationsAtLastDispatch) return finishNavigation(index, opts.actions.length - index);
			if (page.isClosed?.()) return finishAborted("closed", index, currentMainFrameUrl(), opts.actions.length - index);
			navigationsAtLastDispatch = mainFrameNavigations;
			let result;
			try {
				await executeSingleAction(action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, navigationPolicy, depth, opts.signal, opts.assertCurrent);
				result = { ok: true };
			} catch (err) {
				if (isBrowserObservedDialogBlockedError(err) || err instanceof BrowserInteractionAuthorityError) throw err;
				if (isPolicyDenyNavigationError(err)) throw err;
				result = {
					ok: false,
					error: formatErrorMessage(err)
				};
			}
			results.push(result);
			if (page.isClosed?.()) return finishAborted("closed", index + 1, currentMainFrameUrl(), opts.actions.length - index - 1);
			if (mainFrameNavigations > navigationsAtLastDispatch) return finishNavigation(index + 1, opts.actions.length - index - 1);
			if (!result.ok && opts.stopOnError !== false) break;
		}
		return { results };
	} finally {
		page.off?.("framenavigated", onFrameNavigated);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.downloads.ts
/**
* File chooser, dialog, and download helpers for Playwright-backed browser
* tools.
*/
async function dismissFileChooser(page) {
	await page.keyboard.press("Escape").catch(() => {});
}
const activeUploads = /* @__PURE__ */ new WeakMap();
function createExplicitDownloadCapture(params) {
	params.state.armIdDownload = bumpDownloadArmId();
	const armId = params.state.armIdDownload;
	return createDownloadCaptureForPage(params.page, params.state, params.timeoutMs, {
		mode: "explicit",
		outputPath: params.outPath,
		outputRoot: params.rootDir,
		signal: params.signal,
		cancelOnBeforeSaveError: () => params.state.armIdDownload === armId,
		beforeSave: async (download) => {
			if (params.state.armIdDownload !== armId) throw new Error("Download was superseded by another waiter");
			if (params.ssrfPolicy !== void 0 || params.browserProxyMode !== void 0) await assertBrowserNavigationResultAllowed({
				url: download.url,
				ssrfPolicy: params.ssrfPolicy,
				browserProxyMode: params.browserProxyMode,
				signal: params.signal
			});
			await params.beforeSave?.(download);
			if (params.state.armIdDownload !== armId) throw new Error("Download was superseded by another waiter");
		}
	});
}
function resolveImplicitDownloadRoot() {
	return path.join(resolvePreferredOpenClawTmpDir(), "downloads");
}
async function runFileUpload(opts) {
	opts.signal?.throwIfAborted();
	const atomic = opts.ref !== void 0;
	const armId = bumpUploadArmId();
	const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
	const controller = new AbortController();
	const signal = opts.signal ? AbortSignal.any([opts.signal, controller.signal]) : controller.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal);
	const armed = createDeferred();
	let started = false;
	let deadline = 0;
	let timer;
	const startDeadline = () => {
		deadline = Date.now() + timeout;
		timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`Timeout ${timeout}ms exceeded while completing file upload`)), timeout);
	};
	if (atomic) startDeadline();
	const completion = (async () => {
		const page = await awaitActionWithAbort(getPageForTargetId(opts), abortPromise);
		signal.throwIfAborted();
		if (opts.assertCurrent) {
			await assertInteractionCurrent(opts);
			signal.throwIfAborted();
		}
		const state = ensurePageState(page);
		if (state.armIdUpload > armId) throw new Error("File upload was superseded by another waiter");
		state.armIdUpload = armId;
		const previous = activeUploads.get(page);
		const execution = Promise.resolve().then(async () => {
			await previous?.settled;
			signal.throwIfAborted();
			if (opts.assertCurrent) {
				await assertInteractionCurrent(opts);
				signal.throwIfAborted();
			}
			started = true;
			if (!atomic) startDeadline();
			const chooser = page.waitForEvent("filechooser", {
				timeout: 0,
				signal
			});
			chooser.catch(() => {});
			const completionOptions = atomic ? opts : {
				...opts,
				assertCurrent: void 0
			};
			armed.resolve();
			let chooserAcquired = false;
			try {
				if (atomic) await clickViaPlaywright({
					...opts,
					ref: opts.ref,
					timeoutMs: Math.max(1, deadline - Date.now()),
					resolvedPage: page,
					signal
				});
				const fileChooser = await chooser;
				chooserAcquired = true;
				signal.throwIfAborted();
				let paths = opts.paths ?? [];
				if (!atomic) {
					const resolved = await awaitActionWithAbort(resolveStrictExistingUploadPaths({ requestedPaths: paths }), abortPromise);
					signal.throwIfAborted();
					if (!paths.length || !resolved.ok) {
						await dismissFileChooser(page);
						return;
					}
					paths = resolved.paths;
				}
				await setFileChooserFilesViaPlaywright({
					...completionOptions,
					page,
					fileChooser,
					paths,
					timeoutMs: Math.max(1, deadline - Date.now()),
					signal
				});
				signal.throwIfAborted();
			} catch (error) {
				controller.abort(error);
				if (chooserAcquired && error instanceof BrowserInteractionAuthorityError) await dismissFileChooser(page);
				if (error instanceof Error && error.name === "AbortError" && error.cause === signal.reason) signal.throwIfAborted();
				throw error;
			} finally {
				await chooser.catch(() => {});
			}
		});
		const active = {
			controller,
			settled: execution.then(() => {}, () => {})
		};
		activeUploads.set(page, active);
		previous?.controller.abort(/* @__PURE__ */ new Error("File upload was superseded by another waiter"));
		try {
			await execution;
		} finally {
			if (activeUploads.get(page) === active) activeUploads.delete(page);
		}
	})().finally(() => {
		clearTimeout(timer);
		cleanup();
	});
	completion.catch(() => {});
	try {
		await awaitActionWithAbort(atomic ? completion : Promise.race([armed.promise, completion]), abortPromise);
	} catch (error) {
		if (atomic && started) await completion;
		throw error;
	}
}
/** Arms the next page file chooser and fills it with strict existing paths. */
async function armFileUploadViaPlaywright(opts) {
	await runFileUpload(opts);
}
/** Clicks a ref and completes its file chooser as one request-owned operation. */
async function uploadViaPlaywright(opts) {
	await runFileUpload(opts);
}
/** Accepts or dismisses a pending dialog, or arms the next matching dialog response. */
async function armDialogViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	try {
		await respondToObservedDialogOnPage({
			page,
			accept: opts.accept,
			closedBy: "agent",
			...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {},
			...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
		});
		return;
	} catch (err) {
		if (opts.dialogId || err instanceof Error && !err.message.includes("No dialog is pending")) throw err;
	}
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	armObservedDialogResponseOnPage({
		page,
		accept: opts.accept,
		timeoutMs: timeout,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	});
}
/** Waits for the next page download and writes it under the configured output root. */
async function waitForDownloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	const navigationPolicy = interactionNavigationPolicy(opts);
	const policyDenial = new AbortController();
	const signal = opts.signal ? AbortSignal.any([opts.signal, policyDenial.signal]) : policyDenial.signal;
	const waitForCapture = async () => {
		if (opts.assertCurrent) await assertInteractionCurrent(opts);
		return await createExplicitDownloadCapture({
			page,
			state,
			timeoutMs: timeout,
			outPath: opts.path,
			rootDir: opts.path?.trim() ? opts.rootDir : opts.rootDir ?? resolveImplicitDownloadRoot(),
			signal,
			...navigationPolicy
		}).promise;
	};
	if (!hasInteractionNavigationPolicy(navigationPolicy)) return await waitForCapture();
	return await withPageNavigationRequestGuard({
		page,
		...navigationPolicy,
		onPolicyDenied: (event) => {
			if (event.state === "detected") policyDenial.abort(event.error instanceof Error ? event.error : new Error("Browser navigation blocked by policy", { cause: event.error }));
		},
		action: waitForCapture
	});
}
/** Clicks an element ref and saves the download triggered by that click. */
async function downloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	const state = ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	const ref = requireRef(opts.ref);
	const outPath = opts.path?.trim() ?? "";
	if (!outPath) throw new Error("path is required");
	const capture = createExplicitDownloadCapture({
		page,
		state,
		timeoutMs: timeout,
		outPath,
		rootDir: opts.rootDir,
		signal: opts.signal,
		ssrfPolicy: opts.ssrfPolicy,
		browserProxyMode: opts.browserProxyMode
	});
	capture.promise.catch(() => {});
	try {
		const locator = refLocator(page, ref);
		await runCancellablePageInteraction(page, opts, async (signal) => await locator.click({
			timeout,
			signal
		}), ref);
	} catch (err) {
		capture.cancel();
		throw opts.signal?.aborted && opts.signal.reason instanceof Error ? opts.signal.reason : toAIFriendlyError(err, ref);
	}
	return await capture.promise;
}
/** Save the displayed document using its browser session without navigating its preview. */
async function downloadCurrentDocumentViaPlaywright(opts) {
	opts.signal?.throwIfAborted();
	const expectedUrl = opts.expectedUrl;
	const parsed = parseBrowserNavigationUrl(expectedUrl);
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new InvalidBrowserNavigationUrlError("Only HTTP(S) documents can be downloaded");
	const hasHostnameRestrictions = [...opts.ssrfPolicy?.hostnameAllowlist ?? [], ...opts.ssrfPolicy?.blockedHostnames ?? []].some((pattern) => {
		const normalized = normalizeHostname(pattern);
		return normalized.length > 0 && normalized !== "*";
	});
	if (!isPrivateNetworkAllowedByPolicy(opts.ssrfPolicy) || hasHostnameRestrictions) throw new InvalidBrowserNavigationUrlError("Current-document downloads are unavailable under this browser network policy because download redirects cannot be inspected");
	const operation = new AbortController();
	const signal = opts.signal ? AbortSignal.any([opts.signal, operation.signal]) : operation.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal);
	let page;
	const changedError = () => /* @__PURE__ */ new Error("The tab changed before its download completed. Try again.");
	const assertCurrentDocument = () => {
		signal.throwIfAborted();
		if (!page || page.isClosed() || page.url() !== expectedUrl) throw changedError();
	};
	const onClose = () => operation.abort(changedError());
	const onNavigation = (frame) => {
		if (frame === page?.mainFrame()) operation.abort(changedError());
	};
	try {
		page = await awaitActionWithAbort(getPageForTargetId(opts), abortPromise);
		page.on("close", onClose);
		page.on("framenavigated", onNavigation);
		assertCurrentDocument();
		await awaitActionWithAbort(assertBrowserNavigationAllowed({
			url: page.url(),
			ssrfPolicy: opts.ssrfPolicy,
			browserProxyMode: opts.browserProxyMode,
			signal
		}), abortPromise);
		assertCurrentDocument();
		if (opts.assertCurrent) {
			await assertInteractionCurrent(opts);
			assertCurrentDocument();
		}
		const timeout = normalizeTimeoutMs(opts.timeoutMs, DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS);
		const capture = createExplicitDownloadCapture({
			page,
			state: ensurePageState(page),
			timeoutMs: timeout,
			rootDir: opts.rootDir ?? resolveImplicitDownloadRoot(),
			signal,
			beforeSave: async (download) => {
				try {
					assertCurrentDocument();
					await assertBrowserNavigationAllowed({
						url: download.url,
						ssrfPolicy: opts.ssrfPolicy,
						browserProxyMode: opts.browserProxyMode,
						signal
					});
					assertCurrentDocument();
				} catch (error) {
					operation.abort(error);
					throw error;
				}
			}
		});
		capture.promise.catch(() => {});
		try {
			assertCurrentDocument();
			const trigger = page.evaluate(({ expectedUrl: documentUrl, deadline }) => {
				if (location.href !== documentUrl || Date.now() >= deadline) throw new Error("The tab changed before its download started. Try again.");
				const anchor = document.createElement("a");
				anchor.href = location.href;
				anchor.download = "";
				anchor.click();
			}, {
				expectedUrl,
				deadline: Date.now() + timeout
			});
			await Promise.race([trigger, capture.promise]);
			return await capture.promise;
		} catch (error) {
			operation.abort(error);
			throw error;
		}
	} finally {
		page?.off("close", onClose);
		page?.off("framenavigated", onNavigation);
		cleanup();
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.responses.ts
/**
* Response-body retrieval for Playwright-backed browser tools.
*/
/** Waits for a response URL pattern and returns a bounded text body. */
async function responseBodyViaPlaywright(opts) {
	const pattern = normalizeOptionalString(opts.url) ?? "";
	if (!pattern) throw new Error("url is required");
	const maxChars = typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars) ? Math.max(1, Math.min(5e6, Math.floor(opts.maxChars))) : 2e5;
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const maxBytes = maxChars * 4;
	opts.signal?.throwIfAborted();
	const page = await getPageForTargetId(opts);
	opts.signal?.throwIfAborted();
	ensurePageState(page);
	let cleanup;
	const promise = new Promise((resolve, reject) => {
		let matched = false;
		const handler = (response) => {
			if (matched || !matchBrowserUrlPattern(pattern, response.url())) return;
			matched = true;
			page.off("response", handler);
			response.body().then((buffer) => resolve({
				response,
				buffer
			}), (error) => reject(new Error(`Failed to read response body for "${response.url()}": ${String(error)}`, { cause: error })));
		};
		const onAbort = () => reject(toErrorObject(opts.signal?.reason, "Response request aborted."));
		const onClose = () => reject(/* @__PURE__ */ new Error("Page closed before response body was available."));
		const timer = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(matched ? `Response body timed out after ${timeout}ms for url pattern "${pattern}".` : `Response not found for url pattern "${pattern}". Run 'openclaw browser requests' to inspect recent network activity.`));
		}, timeout);
		cleanup = () => {
			clearTimeout(timer);
			page.off("response", handler);
			page.off("close", onClose);
			opts.signal?.removeEventListener("abort", onAbort);
		};
		page.on("response", handler);
		page.on("close", onClose);
		opts.signal?.addEventListener("abort", onAbort, { once: true });
	});
	try {
		const { response, buffer } = await promise;
		const bodyText = new TextDecoder("utf-8").decode(buffer.subarray(0, maxBytes));
		const body = bodyText.length > maxChars ? truncateUtf16Safe(bodyText, maxChars) : bodyText;
		return {
			url: response.url(),
			status: response.status(),
			headers: response.headers(),
			body,
			truncated: buffer.byteLength > maxBytes || bodyText.length > maxChars ? true : void 0
		};
	} finally {
		cleanup();
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.storage.ts
/**
* Cookie and Web Storage helpers for Playwright-backed browser tools.
*/
/** Returns cookies visible to the target browser context. */
async function cookiesGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { cookies: await page.context().cookies() };
}
/** Adds or replaces a cookie in the target browser context. */
async function cookiesSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const cookie = opts.cookie;
	if (!cookie.name || cookie.value === void 0) throw new Error("cookie name and value are required");
	const hasUrl = typeof cookie.url === "string" && cookie.url.trim();
	const hasDomainPath = typeof cookie.domain === "string" && cookie.domain.trim() && typeof cookie.path === "string" && cookie.path.trim();
	if (!hasUrl && !hasDomainPath) throw new Error("cookie requires url, or domain+path");
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.context().addCookies([cookie]);
}
/**
* Add cookies in bounded batches on one browser context. On a batch error, retry
* that batch cookie-by-cookie so one cookie Playwright rejects neither drops the
* whole batch nor aborts the import. Returns the count actually added so callers
* can report rejects instead of leaving an ambiguous partial write.
*/
async function cookiesSetManyViaPlaywright(opts) {
	opts.signal?.throwIfAborted();
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const context = page.context();
	let added = 0;
	for (let index = 0; index < opts.cookies.length; index += 500) {
		opts.signal?.throwIfAborted();
		const batch = opts.cookies.slice(index, index + 500);
		if (opts.assertCurrent) {
			await assertInteractionCurrent(opts);
			opts.signal?.throwIfAborted();
		}
		try {
			await context.addCookies(batch);
			added += batch.length;
		} catch {
			for (const cookie of batch) {
				opts.signal?.throwIfAborted();
				if (opts.assertCurrent) {
					await assertInteractionCurrent(opts);
					opts.signal?.throwIfAborted();
				}
				try {
					await context.addCookies([cookie]);
					added += 1;
				} catch {}
			}
		}
	}
	opts.signal?.throwIfAborted();
	return { added };
}
/** Clears cookies in the target browser context. */
async function cookiesClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.context().clearCookies();
}
/** Reads localStorage or sessionStorage values from the target page. */
async function storageGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const kind = opts.kind;
	const key = readStringValue(opts.key);
	const entries = await page.evaluate(({ kind: kind2, key: key2 }) => {
		const store = kind2 === "session" ? window.sessionStorage : window.localStorage;
		if (key2) {
			const value = store.getItem(key2);
			return value === null ? [] : [[key2, value]];
		}
		const out = [];
		for (let i = 0; i < store.length; i += 1) {
			const k = store.key(i);
			if (k === null) continue;
			const v = store.getItem(k);
			if (v !== null) out.push([k, v]);
		}
		return out;
	}, {
		kind,
		key
	});
	return { values: Object.fromEntries(entries) };
}
/** Writes one localStorage or sessionStorage value on the target page. */
async function storageSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const key = opts.key;
	if (!key) throw new Error("key is required");
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.evaluate(({ kind, key: k, value }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).setItem(k, value);
	}, {
		kind: opts.kind,
		key,
		value: opts.value
	});
}
/** Clears localStorage or sessionStorage on the target page. */
async function storageClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.assertCurrent) await assertInteractionCurrent(opts);
	await page.evaluate(({ kind }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).clear();
	}, { kind: opts.kind });
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.trace.ts
/**
* Playwright trace lifecycle helpers for Browser plugin diagnostics.
*/
/** Starts Playwright tracing for the target page context. */
async function traceStartViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (ctxState.traceActive) throw new Error("Trace already running. Stop the current trace before starting a new one.");
	await context.tracing.start({
		screenshots: opts.screenshots ?? true,
		snapshots: opts.snapshots ?? true,
		sources: opts.sources ?? false
	});
	ctxState.traceActive = true;
}
/** Stops Playwright tracing and returns the committed trace zip path. */
async function traceStopViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (!ctxState.traceActive) throw new Error("No active trace. Start a trace before stopping it.");
	return await writeExternalFileWithinOutputRoot({
		rootDir: DEFAULT_TRACE_DIR,
		path: opts.path,
		write: async (tempPath) => {
			await context.tracing.stop({ path: tempPath });
			ctxState.traceActive = false;
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-ai.ts
/** Playwright-backed browser helpers loaded as one optional runtime object. */
const pwAi = {
	downloadCurrentDocumentViaPlaywright,
	closePageByTargetIdViaPlaywright,
	closePlaywrightBrowserConnection,
	retirePlaywrightBrowserConnection,
	retirePlaywrightBrowserConnectionExact,
	createPageViaPlaywright,
	ensurePageState,
	forceDisconnectPlaywrightForTarget,
	focusPageByTargetIdViaPlaywright,
	createObservedDialogAbortSignalForPage,
	getObservedBrowserStateForPage,
	getObservedBrowserStateViaPlaywright,
	getDocumentIdentitiesViaPlaywright,
	getPageForTargetId,
	hasCachedPlaywrightBrowserConnection,
	isBrowserObservedDialogBlockedError,
	listPagesViaPlaywright,
	markObservedDialogsHandledRemotelyForPage,
	refLocator,
	respondToObservedDialogOnPage,
	armDialogViaPlaywright,
	armFileUploadViaPlaywright,
	batchViaPlaywright,
	clickViaPlaywright,
	closePageViaPlaywright,
	cookiesClearViaPlaywright,
	cookiesGetViaPlaywright,
	cookiesSetManyViaPlaywright,
	cookiesSetViaPlaywright,
	downloadViaPlaywright,
	dragViaPlaywright,
	emulateMediaViaPlaywright,
	evaluateViaPlaywright,
	executeActViaPlaywright,
	fillFormViaPlaywright,
	getConsoleMessagesViaPlaywright,
	getNetworkRequestsViaPlaywright,
	getPageErrorsViaPlaywright,
	getPageTextViaPlaywright,
	highlightViaPlaywright,
	hoverViaPlaywright,
	navigateViaPlaywright,
	pdfViaPlaywright,
	pressKeyViaPlaywright,
	resizeViewportViaPlaywright,
	responseBodyViaPlaywright,
	scrollIntoViewViaPlaywright,
	selectOptionViaPlaywright,
	setDeviceViaPlaywright,
	setExtraHTTPHeadersViaPlaywright,
	setGeolocationViaPlaywright,
	setHttpCredentialsViaPlaywright,
	setInputFilesViaPlaywright,
	setLocaleViaPlaywright,
	setOfflineViaPlaywright,
	setTimezoneViaPlaywright,
	snapshotAriaViaPlaywright,
	snapshotRoleViaPlaywright,
	storeSnapshotRefsViaPlaywright,
	screenshotWithLabelsViaPlaywright,
	storageClearViaPlaywright,
	storageGetViaPlaywright,
	storageSetViaPlaywright,
	takeScreenshotViaPlaywright,
	traceStartViaPlaywright,
	traceStopViaPlaywright,
	typeViaPlaywright,
	uploadViaPlaywright,
	waitForDownloadViaPlaywright,
	waitForViaPlaywright
};
//#endregion
export { pwAi };
