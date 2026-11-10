import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { a as normalizeBrowserRequestPath, t as registerBrowserRoutes } from "./routes-BpsKYDb5.mjs";
//#region extensions/browser/src/browser/routes/dispatcher.ts
/**
* Browser route dispatcher.
*
* Provides an in-process request/response adapter so Gateway nodes can invoke
* the same route handlers without opening an HTTP socket.
*/
function compileRoute(path) {
	const paramNames = [];
	const parts = path.split("/").map((part) => {
		if (part.startsWith(":")) {
			const name = part.slice(1);
			paramNames.push(name);
			return "([^/]+)";
		}
		return escapeRegExp(part);
	});
	return {
		regex: new RegExp(`^${parts.join("/")}$`),
		paramNames
	};
}
/** Create an in-process dispatcher for registered browser routes. */
function createBrowserRouteDispatcher(ctx) {
	const routes = [];
	const register = (method) => (path, handler) => {
		const { regex, paramNames } = compileRoute(path);
		routes.push({
			method,
			regex,
			paramNames,
			handler
		});
	};
	registerBrowserRoutes({
		get: register("GET"),
		post: register("POST"),
		delete: register("DELETE")
	}, ctx);
	return { dispatch: async (req) => {
		const path = normalizeBrowserRequestPath(req.path) || "/";
		const match = routes.find((route) => route.method === req.method && route.regex.test(path));
		if (!match) return {
			status: 404,
			body: { error: "Not Found" }
		};
		const exec = match.regex.exec(path);
		const params = {};
		if (exec) for (const [idx, name] of match.paramNames.entries()) {
			const value = exec[idx + 1];
			if (typeof value === "string") try {
				params[name] = decodeURIComponent(value);
			} catch {
				return {
					status: 400,
					body: { error: `invalid path parameter encoding: ${name}` }
				};
			}
		}
		let status = 200;
		let payload = void 0;
		const res = {
			status(code) {
				status = code;
				return res;
			},
			json(bodyValue) {
				payload = bodyValue;
			}
		};
		try {
			await match.handler({
				params,
				query: req.query ?? {},
				body: req.body,
				signal: req.signal,
				requester: req.requester,
				assertCurrent: req.assertCurrent,
				screencastAuthority: req.screencastAuthority
			}, res);
		} catch (err) {
			return {
				status: 500,
				body: { error: String(err) }
			};
		}
		return {
			status,
			body: payload
		};
	} };
}
//#endregion
export { createBrowserRouteDispatcher as t };
