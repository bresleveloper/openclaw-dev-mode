/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$7 = globalThis;
const e$12 = t$7.ShadowRoot && (void 0 === t$7.ShadyCSS || t$7.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
const s$9 = Symbol();
const o$11 = /* @__PURE__ */ new WeakMap();
var n$11 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$9) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$12 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$11.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$11.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
const r$9 = (t) => new n$11("string" == typeof t ? t : t + "", void 0, s$9);
const i$9 = (t, ...e) => {
	return new n$11(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1], t[0]), t, s$9);
};
const S$2 = (s, o) => {
	if (e$12) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
	else for (const e of o) {
		const o = document.createElement("style"), n = t$7.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
};
const c$8 = e$12 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$9(e);
})(t) : t;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const { is: i$8, defineProperty: e$11, getOwnPropertyDescriptor: h$4, getOwnPropertyNames: r$8, getOwnPropertySymbols: o$10, getPrototypeOf: n$10 } = Object, a$3 = globalThis, c$7 = a$3.trustedTypes, l$4 = c$7 ? c$7.emptyScript : "", p$3 = a$3.reactiveElementPolyfillSupport, d$3 = (t, s) => t, u$5 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$4 : null;
				break;
			case Object:
			case Array: t = null == t ? t : JSON.stringify(t);
		}
		return t;
	},
	fromAttribute(t, s) {
		let i = t;
		switch (s) {
			case Boolean:
				i = null !== t;
				break;
			case Number:
				i = null === t ? null : Number(t);
				break;
			case Object:
			case Array: try {
				i = JSON.parse(t);
			} catch (t) {
				i = null;
			}
		}
		return i;
	}
}, f$4 = (t, s) => !i$8(t, s), b$2 = {
	attribute: !0,
	type: String,
	converter: u$5,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$4
};
Symbol.metadata ??= Symbol("metadata"), a$3.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y$2 = class extends HTMLElement {
	static addInitializer(t) {
		this._$Ei(), (this.l ??= []).push(t);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(t, s = b$2) {
		if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
			const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
			void 0 !== h && e$11(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		const { get: e, set: r } = h$4(this.prototype, t) ?? {
			get() {
				return this[s];
			},
			set(t) {
				this[s] = t;
			}
		};
		return {
			get: e,
			set(s) {
				const h = e?.call(this);
				r?.call(this, s), this.requestUpdate(t, h, i);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(t) {
		return this.elementProperties.get(t) ?? b$2;
	}
	static _$Ei() {
		if (this.hasOwnProperty(d$3("elementProperties"))) return;
		const t = n$10(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$3("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$3("properties"))) {
			const t = this.properties, s = [...r$8(t), ...o$10(t)];
			for (const i of s) this.createProperty(i, t[i]);
		}
		const t = this[Symbol.metadata];
		if (null !== t) {
			const s = litPropertyMetadata.get(t);
			if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (const [t, s] of this.elementProperties) {
			const i = this._$Eu(t, s);
			void 0 !== i && this._$Eh.set(i, t);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(s) {
		const i = [];
		if (Array.isArray(s)) {
			const e = new Set(s.flat(1 / 0).reverse());
			for (const s of e) i.unshift(c$8(s));
		} else void 0 !== s && i.push(c$8(s));
		return i;
	}
	static _$Eu(t, s) {
		const i = s.attribute;
		return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
	}
	addController(t) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
	}
	removeController(t) {
		this._$EO?.delete(t);
	}
	_$E_() {
		const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
		for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
		t.size > 0 && (this._$Ep = t);
	}
	createRenderRoot() {
		const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return S$2(t, this.constructor.elementStyles), t;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
	}
	enableUpdating(t) {}
	disconnectedCallback() {
		this._$EO?.forEach((t) => t.hostDisconnected?.());
	}
	attributeChangedCallback(t, s, i) {
		this._$AK(t, i);
	}
	_$ET(t, s) {
		const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
		if (void 0 !== e && !0 === i.reflect) {
			const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$5).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$5;
			this._$Em = e;
			const r = h.fromAttribute(s, t.type);
			this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
		}
	}
	requestUpdate(t, s, i, e = !1, h) {
		if (void 0 !== t) {
			const r = this.constructor;
			if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? f$4)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
			this.C(t, s, i);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
		i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (t) {
			Promise.reject(t);
		}
		const t = this.scheduleUpdate();
		return null != t && await t, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (const [t, s] of this._$Ep) this[t] = s;
				this._$Ep = void 0;
			}
			const t = this.constructor.elementProperties;
			if (t.size > 0) for (const [s, i] of t) {
				const { wrapped: t } = i, e = this[s];
				!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
			}
		}
		let t = !1;
		const s = this._$AL;
		try {
			t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(s)) : this._$EM();
		} catch (s) {
			throw t = !1, this._$EM(), s;
		}
		t && this._$AE(s);
	}
	willUpdate(t) {}
	_$AE(t) {
		this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(t) {
		return !0;
	}
	update(t) {
		this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
	}
	updated(t) {}
	firstUpdated(t) {}
};
y$2.elementStyles = [], y$2.shadowRootOptions = { mode: "open" }, y$2[d$3("elementProperties")] = /* @__PURE__ */ new Map(), y$2[d$3("finalized")] = /* @__PURE__ */ new Map(), p$3?.({ ReactiveElement: y$2 }), (a$3.reactiveElementVersions ??= []).push("2.1.2");
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$6 = globalThis;
const i$7 = (t) => t;
const s$8 = t$6.trustedTypes;
const e$10 = s$8 ? s$8.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
const h$3 = "$lit$";
const o$9 = `lit$${Math.random().toFixed(9).slice(2)}$`;
const n$9 = "?" + o$9;
const r$7 = `<${n$9}>`;
const l$3 = document;
const c$6 = () => l$3.createComment("");
const a$2 = (t) => null === t || "object" != typeof t && "function" != typeof t;
const u$4 = Array.isArray;
const d$2 = (t) => u$4(t) || "function" == typeof t?.[Symbol.iterator];
const f$3 = "[ 	\n\f\r]";
const v$2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const _$1 = /-->/g;
const m$2 = />/g;
const p$2 = RegExp(`>|${f$3}(?:([^\\s"'>=/]+)(${f$3}*=${f$3}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
const g$1 = /'/g;
const $$1 = /"/g;
const y$1 = /^(?:script|style|textarea|title)$/i;
const x$1 = (t) => (i, ...s) => ({
	_$litType$: t,
	strings: i,
	values: s
});
const b$1 = x$1(1);
const E$1 = Symbol.for("lit-noChange");
const A = Symbol.for("lit-nothing");
const C$1 = /* @__PURE__ */ new WeakMap();
const P = l$3.createTreeWalker(l$3, 129);
function V(t, i) {
	if (!u$4(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== e$10 ? e$10.createHTML(i) : i;
}
const N = (t, i) => {
	const s = t.length - 1, e = [];
	let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v$2;
	for (let i = 0; i < s; i++) {
		const s = t[i];
		let a, u, d = -1, f = 0;
		for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v$2 ? "!--" === u[1] ? c = _$1 : void 0 !== u[1] ? c = m$2 : void 0 !== u[2] ? (y$1.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p$2) : void 0 !== u[3] && (c = p$2) : c === p$2 ? ">" === u[0] ? (c = n ?? v$2, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p$2 : "\"" === u[3] ? $$1 : g$1) : c === $$1 || c === g$1 ? c = p$2 : c === _$1 || c === m$2 ? c = v$2 : (c = p$2, n = void 0);
		const x = c === p$2 && t[i + 1].startsWith("/>") ? " " : "";
		l += c === v$2 ? s + r$7 : d >= 0 ? (e.push(a), s.slice(0, d) + h$3 + s.slice(d) + o$9 + x) : s + o$9 + (-2 === d ? i : x);
	}
	return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
};
var S$1 = class S$1 {
	constructor({ strings: t, _$litType$: i }, e) {
		let r;
		this.parts = [];
		let l = 0, a = 0;
		const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
		if (this.el = S$1.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
			const t = this.el.content.firstChild;
			t.replaceWith(...t.childNodes);
		}
		for (; null !== (r = P.nextNode()) && d.length < u;) {
			if (1 === r.nodeType) {
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h$3)) {
					const i = v[a++], s = r.getAttribute(t).split(o$9), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: l,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
					}), r.removeAttribute(t);
				} else t.startsWith(o$9) && (d.push({
					type: 6,
					index: l
				}), r.removeAttribute(t));
				if (y$1.test(r.tagName)) {
					const t = r.textContent.split(o$9), i = t.length - 1;
					if (i > 0) {
						r.textContent = s$8 ? s$8.emptyScript : "";
						for (let s = 0; s < i; s++) r.append(t[s], c$6()), P.nextNode(), d.push({
							type: 2,
							index: ++l
						});
						r.append(t[i], c$6());
					}
				}
			} else if (8 === r.nodeType) if (r.data === n$9) d.push({
				type: 2,
				index: l
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(o$9, t + 1));) d.push({
					type: 7,
					index: l
				}), t += o$9.length - 1;
			}
			l++;
		}
	}
	static createElement(t, i) {
		const s = l$3.createElement("template");
		return s.innerHTML = t, s;
	}
};
function M$1(t, i, s = t, e) {
	if (i === E$1) return i;
	let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
	const o = a$2(i) ? void 0 : i._$litDirective$;
	return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = M$1(t, h._$AS(t, i.values), h, e)), i;
}
var R = class {
	constructor(t, i) {
		this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(t) {
		const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l$3).importNode(i, !0);
		P.currentNode = e;
		let h = P.nextNode(), o = 0, n = 0, r = s[0];
		for (; void 0 !== r;) {
			if (o === r.index) {
				let i;
				2 === r.type ? i = new k$1(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
			}
			o !== r?.index && (h = P.nextNode(), o++);
		}
		return P.currentNode = l$3, e;
	}
	p(t) {
		let i = 0;
		for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
	}
};
var k$1 = class k$1 {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(t, i, s, e) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
	}
	get parentNode() {
		let t = this._$AA.parentNode;
		const i = this._$AM;
		return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(t, i = this) {
		t = M$1(this, t, i), a$2(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E$1 && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d$2(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== A && a$2(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l$3.createTextNode(t)), this._$AH = t;
	}
	$(t) {
		const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S$1.createElement(V(s.h, s.h[0]), this.options)), s);
		if (this._$AH?._$AD === e) this._$AH.p(i);
		else {
			const t = new R(e, this), s = t.u(this.options);
			t.p(i), this.T(s), this._$AH = t;
		}
	}
	_$AC(t) {
		let i = C$1.get(t.strings);
		return void 0 === i && C$1.set(t.strings, i = new S$1(t)), i;
	}
	k(t) {
		u$4(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new k$1(this.O(c$6()), this.O(c$6()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, s) {
		for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
			const s = i$7(t).nextSibling;
			i$7(t).remove(), t = s;
		}
	}
	setConnected(t) {
		void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
	}
};
var H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(t, i, s, e, h) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
	}
	_$AI(t, i = this, s, e) {
		const h = this.strings;
		let o = !1;
		if (void 0 === h) t = M$1(this, t, i, 0), o = !a$2(t) || t !== this._$AH && t !== E$1, o && (this._$AH = t);
		else {
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = M$1(this, e[s + n], i, n), r === E$1 && (r = this._$AH[n]), o ||= !a$2(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
		}
		o && !e && this.j(t);
	}
	j(t) {
		t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
	}
};
var I = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(t) {
		this.element[this.name] = t === A ? void 0 : t;
	}
};
var L = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(t) {
		this.element.toggleAttribute(this.name, !!t && t !== A);
	}
};
var z = class extends H {
	constructor(t, i, s, e, h) {
		super(t, i, s, e, h), this.type = 5;
	}
	_$AI(t, i = this) {
		if ((t = M$1(this, t, i, 0) ?? A) === E$1) return;
		const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
		e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
	}
	handleEvent(t) {
		"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
	}
};
var Z = class {
	constructor(t, i, s) {
		this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(t) {
		M$1(this, t);
	}
};
const j$2 = {
	M: h$3,
	P: o$9,
	A: n$9,
	C: 1,
	L: N,
	R,
	D: d$2,
	V: M$1,
	I: k$1,
	H,
	N: L,
	U: z,
	B: I,
	F: Z
};
const B = t$6.litHtmlPolyfillSupport;
B?.(S$1, k$1), (t$6.litHtmlVersions ??= []).push("3.3.3");
const D = (t, i, s) => {
	const e = s?.renderBefore ?? i;
	let h = e._$litPart$;
	if (void 0 === h) {
		const t = s?.renderBefore ?? null;
		e._$litPart$ = h = new k$1(i.insertBefore(c$6(), t), t, void 0, s ?? {});
	}
	return h._$AI(t), h;
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const s$7 = globalThis;
var i$6 = class extends y$2 {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		const t = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= t.firstChild, t;
	}
	update(t) {
		const r = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E$1;
	}
};
i$6._$litElement$ = !0, i$6["finalized"] = !0, s$7.litElementHydrateSupport?.({ LitElement: i$6 });
const o$8 = s$7.litElementPolyfillSupport;
o$8?.({ LitElement: i$6 });
(s$7.litElementVersions ??= []).push("4.2.2");
/**
* @license
* Copyright 2022 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$5 = (t) => (e, o) => {
	void 0 !== o ? o.addInitializer(() => {
		customElements.define(t, e);
	}) : customElements.define(t, e);
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const o$6 = {
	attribute: !0,
	type: String,
	converter: u$5,
	reflect: !1,
	hasChanged: f$4
};
const r$6 = (t = o$6, e, r) => {
	const { kind: n, metadata: i } = r;
	let s = globalThis.litPropertyMetadata.get(i);
	if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
		const { name: o } = r;
		return {
			set(r) {
				const n = e.get.call(this);
				e.set.call(this, r), this.requestUpdate(o, n, t, !0, r);
			},
			init(e) {
				return void 0 !== e && this.C(o, void 0, t, e), e;
			}
		};
	}
	if ("setter" === n) {
		const { name: o } = r;
		return function(r) {
			const n = this[o];
			e.call(this, r), this.requestUpdate(o, n, t, !0, r);
		};
	}
	throw Error("Unsupported decorator location: " + n);
};
function n$7(t) {
	return (e, o) => "object" == typeof o ? r$6(t, e, o) : ((t, e, o) => {
		const r = e.hasOwnProperty(o);
		return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
	})(t, e, o);
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function r$5(r) {
	return n$7({
		...r,
		state: !0,
		attribute: !1
	});
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var util;
(function(util) {
	util.assertEqual = (_) => {};
	function assertIs(_arg) {}
	util.assertIs = assertIs;
	function assertNever(_x) {
		throw new Error();
	}
	util.assertNever = assertNever;
	util.arrayToEnum = (items) => {
		const obj = {};
		for (const item of items) obj[item] = item;
		return obj;
	};
	util.getValidEnumValues = (obj) => {
		const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
		const filtered = {};
		for (const k of validKeys) filtered[k] = obj[k];
		return util.objectValues(filtered);
	};
	util.objectValues = (obj) => {
		return util.objectKeys(obj).map(function(e) {
			return obj[e];
		});
	};
	util.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
		const keys = [];
		for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
		return keys;
	};
	util.find = (arr, checker) => {
		for (const item of arr) if (checker(item)) return item;
	};
	util.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
	function joinValues(array, separator = " | ") {
		return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
	}
	util.joinValues = joinValues;
	util.jsonStringifyReplacer = (_, value) => {
		if (typeof value === "bigint") return value.toString();
		return value;
	};
})(util || (util = {}));
var objectUtil;
(function(objectUtil) {
	objectUtil.mergeShapes = (first, second) => {
		return {
			...first,
			...second
		};
	};
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]);
const getParsedType = (data) => {
	switch (typeof data) {
		case "undefined": return ZodParsedType.undefined;
		case "string": return ZodParsedType.string;
		case "number": return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
		case "boolean": return ZodParsedType.boolean;
		case "function": return ZodParsedType.function;
		case "bigint": return ZodParsedType.bigint;
		case "symbol": return ZodParsedType.symbol;
		case "object":
			if (Array.isArray(data)) return ZodParsedType.array;
			if (data === null) return ZodParsedType.null;
			if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return ZodParsedType.promise;
			if (typeof Map !== "undefined" && data instanceof Map) return ZodParsedType.map;
			if (typeof Set !== "undefined" && data instanceof Set) return ZodParsedType.set;
			if (typeof Date !== "undefined" && data instanceof Date) return ZodParsedType.date;
			return ZodParsedType.object;
		default: return ZodParsedType.unknown;
	}
};
const ZodIssueCode = util.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]);
var ZodError = class ZodError extends Error {
	get errors() {
		return this.issues;
	}
	constructor(issues) {
		super();
		this.issues = [];
		this.addIssue = (sub) => {
			this.issues = [...this.issues, sub];
		};
		this.addIssues = (subs = []) => {
			this.issues = [...this.issues, ...subs];
		};
		const actualProto = new.target.prototype;
		if (Object.setPrototypeOf) Object.setPrototypeOf(this, actualProto);
		else this.__proto__ = actualProto;
		this.name = "ZodError";
		this.issues = issues;
	}
	format(_mapper) {
		const mapper = _mapper || function(issue) {
			return issue.message;
		};
		const fieldErrors = { _errors: [] };
		const processError = (error) => {
			for (const issue of error.issues) if (issue.code === "invalid_union") issue.unionErrors.map(processError);
			else if (issue.code === "invalid_return_type") processError(issue.returnTypeError);
			else if (issue.code === "invalid_arguments") processError(issue.argumentsError);
			else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < issue.path.length) {
					const el = issue.path[i];
					if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		};
		processError(this);
		return fieldErrors;
	}
	static assert(value) {
		if (!(value instanceof ZodError)) throw new Error(`Not a ZodError: ${value}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(mapper = (issue) => issue.message) {
		const fieldErrors = {};
		const formErrors = [];
		for (const sub of this.issues) if (sub.path.length > 0) {
			const firstEl = sub.path[0];
			fieldErrors[firstEl] = fieldErrors[firstEl] || [];
			fieldErrors[firstEl].push(mapper(sub));
		} else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
ZodError.create = (issues) => {
	return new ZodError(issues);
};
const errorMap = (issue, _ctx) => {
	let message;
	switch (issue.code) {
		case ZodIssueCode.invalid_type:
			if (issue.received === ZodParsedType.undefined) message = "Required";
			else message = `Expected ${issue.expected}, received ${issue.received}`;
			break;
		case ZodIssueCode.invalid_literal:
			message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
			break;
		case ZodIssueCode.unrecognized_keys:
			message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
			break;
		case ZodIssueCode.invalid_union:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_union_discriminator:
			message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
			break;
		case ZodIssueCode.invalid_enum_value:
			message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
			break;
		case ZodIssueCode.invalid_arguments:
			message = `Invalid function arguments`;
			break;
		case ZodIssueCode.invalid_return_type:
			message = `Invalid function return type`;
			break;
		case ZodIssueCode.invalid_date:
			message = `Invalid date`;
			break;
		case ZodIssueCode.invalid_string:
			if (typeof issue.validation === "object") {
				if ("includes" in issue.validation) {
					message = `Invalid input: must include "${issue.validation.includes}"`;
					if (typeof issue.validation.position === "number") message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
				} else if ("startsWith" in issue.validation) message = `Invalid input: must start with "${issue.validation.startsWith}"`;
				else if ("endsWith" in issue.validation) message = `Invalid input: must end with "${issue.validation.endsWith}"`;
				else util.assertNever(issue.validation);
			} else if (issue.validation !== "regex") message = `Invalid ${issue.validation}`;
			else message = "Invalid";
			break;
		case ZodIssueCode.too_small:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "bigint") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.too_big:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.custom:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_intersection_types:
			message = `Intersection results could not be merged`;
			break;
		case ZodIssueCode.not_multiple_of:
			message = `Number must be a multiple of ${issue.multipleOf}`;
			break;
		case ZodIssueCode.not_finite:
			message = "Number must be finite";
			break;
		default:
			message = _ctx.defaultError;
			util.assertNever(issue);
	}
	return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
	return overrideErrorMap;
}
const makeIssue = (params) => {
	const { data, path, errorMaps, issueData } = params;
	const fullPath = [...path, ...issueData.path || []];
	const fullIssue = {
		...issueData,
		path: fullPath
	};
	if (issueData.message !== void 0) return {
		...issueData,
		path: fullPath,
		message: issueData.message
	};
	let errorMessage = "";
	const maps = errorMaps.filter((m) => !!m).slice().reverse();
	for (const map of maps) errorMessage = map(fullIssue, {
		data,
		defaultError: errorMessage
	}).message;
	return {
		...issueData,
		path: fullPath,
		message: errorMessage
	};
};
function addIssueToContext(ctx, issueData) {
	const overrideMap = getErrorMap();
	const issue = makeIssue({
		issueData,
		data: ctx.data,
		path: ctx.path,
		errorMaps: [
			ctx.common.contextualErrorMap,
			ctx.schemaErrorMap,
			overrideMap,
			overrideMap === errorMap ? void 0 : errorMap
		].filter((x) => !!x)
	});
	ctx.common.issues.push(issue);
}
var ParseStatus = class ParseStatus {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		if (this.value === "valid") this.value = "dirty";
	}
	abort() {
		if (this.value !== "aborted") this.value = "aborted";
	}
	static mergeArray(status, results) {
		const arrayValue = [];
		for (const s of results) {
			if (s.status === "aborted") return INVALID;
			if (s.status === "dirty") status.dirty();
			arrayValue.push(s.value);
		}
		return {
			status: status.value,
			value: arrayValue
		};
	}
	static async mergeObjectAsync(status, pairs) {
		const syncPairs = [];
		for (const pair of pairs) {
			const key = await pair.key;
			const value = await pair.value;
			syncPairs.push({
				key,
				value
			});
		}
		return ParseStatus.mergeObjectSync(status, syncPairs);
	}
	static mergeObjectSync(status, pairs) {
		const finalObject = {};
		for (const pair of pairs) {
			const { key, value } = pair;
			if (key.status === "aborted") return INVALID;
			if (value.status === "aborted") return INVALID;
			if (key.status === "dirty") status.dirty();
			if (value.status === "dirty") status.dirty();
			if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) finalObject[key.value] = value.value;
		}
		return {
			status: status.value,
			value: finalObject
		};
	}
};
const INVALID = Object.freeze({ status: "aborted" });
const DIRTY = (value) => ({
	status: "dirty",
	value
});
const OK = (value) => ({
	status: "valid",
	value
});
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid$1 = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil) {
	errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = class {
	constructor(parent, value, path, key) {
		this._cachedPath = [];
		this.parent = parent;
		this.data = value;
		this._path = path;
		this._key = key;
	}
	get path() {
		if (!this._cachedPath.length) {
			if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
			else this._cachedPath.push(...this._path, this._key);
		}
		return this._cachedPath;
	}
};
const handleResult = (ctx, result) => {
	if (isValid$1(result)) return {
		success: true,
		data: result.value
	};
	else {
		if (!ctx.common.issues.length) throw new Error("Validation failed but no issues detected.");
		return {
			success: false,
			get error() {
				if (this._error) return this._error;
				const error = new ZodError(ctx.common.issues);
				this._error = error;
				return this._error;
			}
		};
	}
};
function processCreateParams(params) {
	if (!params) return {};
	const { errorMap, invalid_type_error, required_error, description } = params;
	if (errorMap && (invalid_type_error || required_error)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	if (errorMap) return {
		errorMap,
		description
	};
	const customMap = (iss, ctx) => {
		const { message } = params;
		if (iss.code === "invalid_enum_value") return { message: message ?? ctx.defaultError };
		if (typeof ctx.data === "undefined") return { message: message ?? required_error ?? ctx.defaultError };
		if (iss.code !== "invalid_type") return { message: ctx.defaultError };
		return { message: message ?? invalid_type_error ?? ctx.defaultError };
	};
	return {
		errorMap: customMap,
		description
	};
}
var ZodType = class {
	get description() {
		return this._def.description;
	}
	_getType(input) {
		return getParsedType(input.data);
	}
	_getOrReturnCtx(input, ctx) {
		return ctx || {
			common: input.parent.common,
			data: input.data,
			parsedType: getParsedType(input.data),
			schemaErrorMap: this._def.errorMap,
			path: input.path,
			parent: input.parent
		};
	}
	_processInputParams(input) {
		return {
			status: new ParseStatus(),
			ctx: {
				common: input.parent.common,
				data: input.data,
				parsedType: getParsedType(input.data),
				schemaErrorMap: this._def.errorMap,
				path: input.path,
				parent: input.parent
			}
		};
	}
	_parseSync(input) {
		const result = this._parse(input);
		if (isAsync(result)) throw new Error("Synchronous parse encountered promise.");
		return result;
	}
	_parseAsync(input) {
		const result = this._parse(input);
		return Promise.resolve(result);
	}
	parse(data, params) {
		const result = this.safeParse(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	safeParse(data, params) {
		const ctx = {
			common: {
				issues: [],
				async: params?.async ?? false,
				contextualErrorMap: params?.errorMap
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const result = this._parseSync({
			data,
			path: ctx.path,
			parent: ctx
		});
		return handleResult(ctx, result);
	}
	"~validate"(data) {
		const ctx = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		if (!this["~standard"].async) try {
			const result = this._parseSync({
				data,
				path: [],
				parent: ctx
			});
			return isValid$1(result) ? { value: result.value } : { issues: ctx.common.issues };
		} catch (err) {
			if (err?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = true;
			ctx.common = {
				issues: [],
				async: true
			};
		}
		return this._parseAsync({
			data,
			path: [],
			parent: ctx
		}).then((result) => isValid$1(result) ? { value: result.value } : { issues: ctx.common.issues });
	}
	async parseAsync(data, params) {
		const result = await this.safeParseAsync(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	async safeParseAsync(data, params) {
		const ctx = {
			common: {
				issues: [],
				contextualErrorMap: params?.errorMap,
				async: true
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const maybeAsyncResult = this._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
		const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
		return handleResult(ctx, result);
	}
	refine(check, message) {
		const getIssueProperties = (val) => {
			if (typeof message === "string" || typeof message === "undefined") return { message };
			else if (typeof message === "function") return message(val);
			else return message;
		};
		return this._refinement((val, ctx) => {
			const result = check(val);
			const setError = () => ctx.addIssue({
				code: ZodIssueCode.custom,
				...getIssueProperties(val)
			});
			if (typeof Promise !== "undefined" && result instanceof Promise) return result.then((data) => {
				if (!data) {
					setError();
					return false;
				} else return true;
			});
			if (!result) {
				setError();
				return false;
			} else return true;
		});
	}
	refinement(check, refinementData) {
		return this._refinement((val, ctx) => {
			if (!check(val)) {
				ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
				return false;
			} else return true;
		});
	}
	_refinement(refinement) {
		return new ZodEffects({
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "refinement",
				refinement
			}
		});
	}
	superRefine(refinement) {
		return this._refinement(refinement);
	}
	constructor(def) {
		/** Alias of safeParseAsync */
		this.spa = this.safeParseAsync;
		this._def = def;
		this.parse = this.parse.bind(this);
		this.safeParse = this.safeParse.bind(this);
		this.parseAsync = this.parseAsync.bind(this);
		this.safeParseAsync = this.safeParseAsync.bind(this);
		this.spa = this.spa.bind(this);
		this.refine = this.refine.bind(this);
		this.refinement = this.refinement.bind(this);
		this.superRefine = this.superRefine.bind(this);
		this.optional = this.optional.bind(this);
		this.nullable = this.nullable.bind(this);
		this.nullish = this.nullish.bind(this);
		this.array = this.array.bind(this);
		this.promise = this.promise.bind(this);
		this.or = this.or.bind(this);
		this.and = this.and.bind(this);
		this.transform = this.transform.bind(this);
		this.brand = this.brand.bind(this);
		this.default = this.default.bind(this);
		this.catch = this.catch.bind(this);
		this.describe = this.describe.bind(this);
		this.pipe = this.pipe.bind(this);
		this.readonly = this.readonly.bind(this);
		this.isNullable = this.isNullable.bind(this);
		this.isOptional = this.isOptional.bind(this);
		this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (data) => this["~validate"](data)
		};
	}
	optional() {
		return ZodOptional.create(this, this._def);
	}
	nullable() {
		return ZodNullable.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return ZodArray.create(this);
	}
	promise() {
		return ZodPromise.create(this, this._def);
	}
	or(option) {
		return ZodUnion.create([this, option], this._def);
	}
	and(incoming) {
		return ZodIntersection.create(this, incoming, this._def);
	}
	transform(transform) {
		return new ZodEffects({
			...processCreateParams(this._def),
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "transform",
				transform
			}
		});
	}
	default(def) {
		const defaultValueFunc = typeof def === "function" ? def : () => def;
		return new ZodDefault({
			...processCreateParams(this._def),
			innerType: this,
			defaultValue: defaultValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodDefault
		});
	}
	brand() {
		return new ZodBranded({
			typeName: ZodFirstPartyTypeKind.ZodBranded,
			type: this,
			...processCreateParams(this._def)
		});
	}
	catch(def) {
		const catchValueFunc = typeof def === "function" ? def : () => def;
		return new ZodCatch({
			...processCreateParams(this._def),
			innerType: this,
			catchValue: catchValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodCatch
		});
	}
	describe(description) {
		const This = this.constructor;
		return new This({
			...this._def,
			description
		});
	}
	pipe(target) {
		return ZodPipeline.create(this, target);
	}
	readonly() {
		return ZodReadonly.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
};
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex$1;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex$1 = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
	let secondsRegexSource = `[0-5]\\d`;
	if (args.precision) secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
	else if (args.precision == null) secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
	const secondsQuantifier = args.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex$1(args) {
	return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
	let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
	const opts = [];
	opts.push(args.local ? `Z?` : `Z`);
	if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
	regex = `${regex}(${opts.join("|")})`;
	return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
	if ((version === "v4" || !version) && ipv4Regex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6Regex.test(ip)) return true;
	return false;
}
function isValidJWT(jwt, alg) {
	if (!jwtRegex.test(jwt)) return false;
	try {
		const [header] = jwt.split(".");
		if (!header) return false;
		const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
		const decoded = JSON.parse(atob(base64));
		if (typeof decoded !== "object" || decoded === null) return false;
		if ("typ" in decoded && decoded?.typ !== "JWT") return false;
		if (!decoded.alg) return false;
		if (alg && decoded.alg !== alg) return false;
		return true;
	} catch {
		return false;
	}
}
function isValidCidr(ip, version) {
	if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) return true;
	return false;
}
var ZodString = class ZodString extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = String(input.data);
		if (this._getType(input) !== ZodParsedType.string) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.string,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.length < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.length > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "length") {
			const tooBig = input.data.length > check.value;
			const tooSmall = input.data.length < check.value;
			if (tooBig || tooSmall) {
				ctx = this._getOrReturnCtx(input, ctx);
				if (tooBig) addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				else if (tooSmall) addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "email") {
			if (!emailRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "email",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "emoji") {
			if (!emojiRegex$1) emojiRegex$1 = new RegExp(_emojiRegex, "u");
			if (!emojiRegex$1.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "emoji",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "uuid") {
			if (!uuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "uuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "nanoid") {
			if (!nanoidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "nanoid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid") {
			if (!cuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid2") {
			if (!cuid2Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid2",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ulid") {
			if (!ulidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ulid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "url") try {
			new URL(input.data);
		} catch {
			ctx = this._getOrReturnCtx(input, ctx);
			addIssueToContext(ctx, {
				validation: "url",
				code: ZodIssueCode.invalid_string,
				message: check.message
			});
			status.dirty();
		}
		else if (check.kind === "regex") {
			check.regex.lastIndex = 0;
			if (!check.regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "regex",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "trim") input.data = input.data.trim();
		else if (check.kind === "includes") {
			if (!input.data.includes(check.value, check.position)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: {
						includes: check.value,
						position: check.position
					},
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "toLowerCase") input.data = input.data.toLowerCase();
		else if (check.kind === "toUpperCase") input.data = input.data.toUpperCase();
		else if (check.kind === "startsWith") {
			if (!input.data.startsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { startsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "endsWith") {
			if (!input.data.endsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { endsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "datetime") {
			if (!datetimeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "datetime",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "date") {
			if (!dateRegex$1.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "date",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "time") {
			if (!timeRegex$1(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "time",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "duration") {
			if (!durationRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "duration",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ip") {
			if (!isValidIP(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ip",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "jwt") {
			if (!isValidJWT(input.data, check.alg)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "jwt",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cidr") {
			if (!isValidCidr(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cidr",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64") {
			if (!base64Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64url") {
			if (!base64urlRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64url",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_regex(regex, validation, message) {
		return this.refinement((data) => regex.test(data), {
			validation,
			code: ZodIssueCode.invalid_string,
			...errorUtil.errToObj(message)
		});
	}
	_addCheck(check) {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	email(message) {
		return this._addCheck({
			kind: "email",
			...errorUtil.errToObj(message)
		});
	}
	url(message) {
		return this._addCheck({
			kind: "url",
			...errorUtil.errToObj(message)
		});
	}
	emoji(message) {
		return this._addCheck({
			kind: "emoji",
			...errorUtil.errToObj(message)
		});
	}
	uuid(message) {
		return this._addCheck({
			kind: "uuid",
			...errorUtil.errToObj(message)
		});
	}
	nanoid(message) {
		return this._addCheck({
			kind: "nanoid",
			...errorUtil.errToObj(message)
		});
	}
	cuid(message) {
		return this._addCheck({
			kind: "cuid",
			...errorUtil.errToObj(message)
		});
	}
	cuid2(message) {
		return this._addCheck({
			kind: "cuid2",
			...errorUtil.errToObj(message)
		});
	}
	ulid(message) {
		return this._addCheck({
			kind: "ulid",
			...errorUtil.errToObj(message)
		});
	}
	base64(message) {
		return this._addCheck({
			kind: "base64",
			...errorUtil.errToObj(message)
		});
	}
	base64url(message) {
		return this._addCheck({
			kind: "base64url",
			...errorUtil.errToObj(message)
		});
	}
	jwt(options) {
		return this._addCheck({
			kind: "jwt",
			...errorUtil.errToObj(options)
		});
	}
	ip(options) {
		return this._addCheck({
			kind: "ip",
			...errorUtil.errToObj(options)
		});
	}
	cidr(options) {
		return this._addCheck({
			kind: "cidr",
			...errorUtil.errToObj(options)
		});
	}
	datetime(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "datetime",
			precision: null,
			offset: false,
			local: false,
			message: options
		});
		return this._addCheck({
			kind: "datetime",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			offset: options?.offset ?? false,
			local: options?.local ?? false,
			...errorUtil.errToObj(options?.message)
		});
	}
	date(message) {
		return this._addCheck({
			kind: "date",
			message
		});
	}
	time(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "time",
			precision: null,
			message: options
		});
		return this._addCheck({
			kind: "time",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			...errorUtil.errToObj(options?.message)
		});
	}
	duration(message) {
		return this._addCheck({
			kind: "duration",
			...errorUtil.errToObj(message)
		});
	}
	regex(regex, message) {
		return this._addCheck({
			kind: "regex",
			regex,
			...errorUtil.errToObj(message)
		});
	}
	includes(value, options) {
		return this._addCheck({
			kind: "includes",
			value,
			position: options?.position,
			...errorUtil.errToObj(options?.message)
		});
	}
	startsWith(value, message) {
		return this._addCheck({
			kind: "startsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	endsWith(value, message) {
		return this._addCheck({
			kind: "endsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	min(minLength, message) {
		return this._addCheck({
			kind: "min",
			value: minLength,
			...errorUtil.errToObj(message)
		});
	}
	max(maxLength, message) {
		return this._addCheck({
			kind: "max",
			value: maxLength,
			...errorUtil.errToObj(message)
		});
	}
	length(len, message) {
		return this._addCheck({
			kind: "length",
			value: len,
			...errorUtil.errToObj(message)
		});
	}
	/**
	* Equivalent to `.min(1)`
	*/
	nonempty(message) {
		return this.min(1, errorUtil.errToObj(message));
	}
	trim() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((ch) => ch.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((ch) => ch.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((ch) => ch.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((ch) => ch.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((ch) => ch.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((ch) => ch.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((ch) => ch.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((ch) => ch.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((ch) => ch.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((ch) => ch.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((ch) => ch.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((ch) => ch.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((ch) => ch.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((ch) => ch.kind === "base64url");
	}
	get minLength() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxLength() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodString.create = (params) => {
	return new ZodString({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodString,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepDecCount = (step.toString().split(".")[1] || "").length;
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
var ZodNumber = class ZodNumber extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
		this.step = this.multipleOf;
	}
	_parse(input) {
		if (this._def.coerce) input.data = Number(input.data);
		if (this._getType(input) !== ZodParsedType.number) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.number,
				received: ctx.parsedType
			});
			return INVALID;
		}
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "int") {
			if (!util.isInteger(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_type,
					expected: "integer",
					received: "float",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (floatSafeRemainder(input.data, check.value) !== 0) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "finite") {
			if (!Number.isFinite(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_finite,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	int(message) {
		return this._addCheck({
			kind: "int",
			message: errorUtil.toString(message)
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	finite(message) {
		return this._addCheck({
			kind: "finite",
			message: errorUtil.toString(message)
		});
	}
	safe(message) {
		return this._addCheck({
			kind: "min",
			inclusive: true,
			value: Number.MIN_SAFE_INTEGER,
			message: errorUtil.toString(message)
		})._addCheck({
			kind: "max",
			inclusive: true,
			value: Number.MAX_SAFE_INTEGER,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
	get isInt() {
		return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
	}
	get isFinite() {
		let max = null;
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") return true;
		else if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		} else if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return Number.isFinite(min) && Number.isFinite(max);
	}
};
ZodNumber.create = (params) => {
	return new ZodNumber({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodNumber,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodBigInt = class ZodBigInt extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
	}
	_parse(input) {
		if (this._def.coerce) try {
			input.data = BigInt(input.data);
		} catch {
			return this._getInvalidInput(input);
		}
		if (this._getType(input) !== ZodParsedType.bigint) return this._getInvalidInput(input);
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					type: "bigint",
					minimum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					type: "bigint",
					maximum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (input.data % check.value !== BigInt(0)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_getInvalidInput(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.bigint,
			received: ctx.parsedType
		});
		return INVALID;
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodBigInt.create = (params) => {
	return new ZodBigInt({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodBigInt,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
var ZodBoolean = class extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = Boolean(input.data);
		if (this._getType(input) !== ZodParsedType.boolean) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.boolean,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodBoolean.create = (params) => {
	return new ZodBoolean({
		typeName: ZodFirstPartyTypeKind.ZodBoolean,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodDate = class ZodDate extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = new Date(input.data);
		if (this._getType(input) !== ZodParsedType.date) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.date,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (Number.isNaN(input.data.getTime())) {
			addIssueToContext(this._getOrReturnCtx(input), { code: ZodIssueCode.invalid_date });
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.getTime() < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					message: check.message,
					inclusive: true,
					exact: false,
					minimum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.getTime() > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					message: check.message,
					inclusive: true,
					exact: false,
					maximum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: new Date(input.data.getTime())
		};
	}
	_addCheck(check) {
		return new ZodDate({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	min(minDate, message) {
		return this._addCheck({
			kind: "min",
			value: minDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	max(maxDate, message) {
		return this._addCheck({
			kind: "max",
			value: maxDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	get minDate() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min != null ? new Date(min) : null;
	}
	get maxDate() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max != null ? new Date(max) : null;
	}
};
ZodDate.create = (params) => {
	return new ZodDate({
		checks: [],
		coerce: params?.coerce || false,
		typeName: ZodFirstPartyTypeKind.ZodDate,
		...processCreateParams(params)
	});
};
var ZodSymbol = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.symbol) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.symbol,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodSymbol.create = (params) => {
	return new ZodSymbol({
		typeName: ZodFirstPartyTypeKind.ZodSymbol,
		...processCreateParams(params)
	});
};
var ZodUndefined = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.undefined,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodUndefined.create = (params) => {
	return new ZodUndefined({
		typeName: ZodFirstPartyTypeKind.ZodUndefined,
		...processCreateParams(params)
	});
};
var ZodNull = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.null) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.null,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodNull.create = (params) => {
	return new ZodNull({
		typeName: ZodFirstPartyTypeKind.ZodNull,
		...processCreateParams(params)
	});
};
var ZodAny = class extends ZodType {
	constructor() {
		super(...arguments);
		this._any = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodAny.create = (params) => {
	return new ZodAny({
		typeName: ZodFirstPartyTypeKind.ZodAny,
		...processCreateParams(params)
	});
};
var ZodUnknown = class extends ZodType {
	constructor() {
		super(...arguments);
		this._unknown = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodUnknown.create = (params) => {
	return new ZodUnknown({
		typeName: ZodFirstPartyTypeKind.ZodUnknown,
		...processCreateParams(params)
	});
};
var ZodNever = class extends ZodType {
	_parse(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.never,
			received: ctx.parsedType
		});
		return INVALID;
	}
};
ZodNever.create = (params) => {
	return new ZodNever({
		typeName: ZodFirstPartyTypeKind.ZodNever,
		...processCreateParams(params)
	});
};
var ZodVoid = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.void,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodVoid.create = (params) => {
	return new ZodVoid({
		typeName: ZodFirstPartyTypeKind.ZodVoid,
		...processCreateParams(params)
	});
};
var ZodArray = class ZodArray extends ZodType {
	_parse(input) {
		const { ctx, status } = this._processInputParams(input);
		const def = this._def;
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (def.exactLength !== null) {
			const tooBig = ctx.data.length > def.exactLength.value;
			const tooSmall = ctx.data.length < def.exactLength.value;
			if (tooBig || tooSmall) {
				addIssueToContext(ctx, {
					code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
					minimum: tooSmall ? def.exactLength.value : void 0,
					maximum: tooBig ? def.exactLength.value : void 0,
					type: "array",
					inclusive: true,
					exact: true,
					message: def.exactLength.message
				});
				status.dirty();
			}
		}
		if (def.minLength !== null) {
			if (ctx.data.length < def.minLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.minLength.message
				});
				status.dirty();
			}
		}
		if (def.maxLength !== null) {
			if (ctx.data.length > def.maxLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.maxLength.message
				});
				status.dirty();
			}
		}
		if (ctx.common.async) return Promise.all([...ctx.data].map((item, i) => {
			return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		})).then((result) => {
			return ParseStatus.mergeArray(status, result);
		});
		const result = [...ctx.data].map((item, i) => {
			return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		});
		return ParseStatus.mergeArray(status, result);
	}
	get element() {
		return this._def.type;
	}
	min(minLength, message) {
		return new ZodArray({
			...this._def,
			minLength: {
				value: minLength,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxLength, message) {
		return new ZodArray({
			...this._def,
			maxLength: {
				value: maxLength,
				message: errorUtil.toString(message)
			}
		});
	}
	length(len, message) {
		return new ZodArray({
			...this._def,
			exactLength: {
				value: len,
				message: errorUtil.toString(message)
			}
		});
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodArray.create = (schema, params) => {
	return new ZodArray({
		type: schema,
		minLength: null,
		maxLength: null,
		exactLength: null,
		typeName: ZodFirstPartyTypeKind.ZodArray,
		...processCreateParams(params)
	});
};
function deepPartialify(schema) {
	if (schema instanceof ZodObject) {
		const newShape = {};
		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key];
			newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
		}
		return new ZodObject({
			...schema._def,
			shape: () => newShape
		});
	} else if (schema instanceof ZodArray) return new ZodArray({
		...schema._def,
		type: deepPartialify(schema.element)
	});
	else if (schema instanceof ZodOptional) return ZodOptional.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodNullable) return ZodNullable.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodTuple) return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	else return schema;
}
var ZodObject = class ZodObject extends ZodType {
	constructor() {
		super(...arguments);
		this._cached = null;
		/**
		* @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
		* If you want to pass through unknown properties, use `.passthrough()` instead.
		*/
		this.nonstrict = this.passthrough;
		/**
		* @deprecated Use `.extend` instead
		*  */
		this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		const shape = this._def.shape();
		const keys = util.objectKeys(shape);
		this._cached = {
			shape,
			keys
		};
		return this._cached;
	}
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.object) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const { status, ctx } = this._processInputParams(input);
		const { shape, keys: shapeKeys } = this._getCached();
		const extraKeys = [];
		if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
			for (const key in ctx.data) if (!shapeKeys.includes(key)) extraKeys.push(key);
		}
		const pairs = [];
		for (const key of shapeKeys) {
			const keyValidator = shape[key];
			const value = ctx.data[key];
			pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
				alwaysSet: key in ctx.data
			});
		}
		if (this._def.catchall instanceof ZodNever) {
			const unknownKeys = this._def.unknownKeys;
			if (unknownKeys === "passthrough") for (const key of extraKeys) pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: {
					status: "valid",
					value: ctx.data[key]
				}
			});
			else if (unknownKeys === "strict") {
				if (extraKeys.length > 0) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.unrecognized_keys,
						keys: extraKeys
					});
					status.dirty();
				}
			} else if (unknownKeys === "strip") {} else throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
		} else {
			const catchall = this._def.catchall;
			for (const key of extraKeys) {
				const value = ctx.data[key];
				pairs.push({
					key: {
						status: "valid",
						value: key
					},
					value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
					alwaysSet: key in ctx.data
				});
			}
		}
		if (ctx.common.async) return Promise.resolve().then(async () => {
			const syncPairs = [];
			for (const pair of pairs) {
				const key = await pair.key;
				const value = await pair.value;
				syncPairs.push({
					key,
					value,
					alwaysSet: pair.alwaysSet
				});
			}
			return syncPairs;
		}).then((syncPairs) => {
			return ParseStatus.mergeObjectSync(status, syncPairs);
		});
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get shape() {
		return this._def.shape();
	}
	strict(message) {
		errorUtil.errToObj;
		return new ZodObject({
			...this._def,
			unknownKeys: "strict",
			...message !== void 0 ? { errorMap: (issue, ctx) => {
				const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
				if (issue.code === "unrecognized_keys") return { message: errorUtil.errToObj(message).message ?? defaultError };
				return { message: defaultError };
			} } : {}
		});
	}
	strip() {
		return new ZodObject({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new ZodObject({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(augmentation) {
		return new ZodObject({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...augmentation
			})
		});
	}
	/**
	* Prior to zod@1.0.12 there was a bug in the
	* inferred type of merged objects. Please
	* upgrade if you are experiencing issues.
	*/
	merge(merging) {
		return new ZodObject({
			unknownKeys: merging._def.unknownKeys,
			catchall: merging._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...merging._def.shape()
			}),
			typeName: ZodFirstPartyTypeKind.ZodObject
		});
	}
	setKey(key, schema) {
		return this.augment({ [key]: schema });
	}
	catchall(index) {
		return new ZodObject({
			...this._def,
			catchall: index
		});
	}
	pick(mask) {
		const shape = {};
		for (const key of util.objectKeys(mask)) if (mask[key] && this.shape[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	omit(mask) {
		const shape = {};
		for (const key of util.objectKeys(this.shape)) if (!mask[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	/**
	* @deprecated
	*/
	deepPartial() {
		return deepPartialify(this);
	}
	partial(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) {
			const fieldSchema = this.shape[key];
			if (mask && !mask[key]) newShape[key] = fieldSchema;
			else newShape[key] = fieldSchema.optional();
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	required(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) if (mask && !mask[key]) newShape[key] = this.shape[key];
		else {
			let newField = this.shape[key];
			while (newField instanceof ZodOptional) newField = newField._def.innerType;
			newShape[key] = newField;
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	keyof() {
		return createZodEnum(util.objectKeys(this.shape));
	}
};
ZodObject.create = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.strictCreate = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strict",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate = (shape, params) => {
	return new ZodObject({
		shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
var ZodUnion = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const options = this._def.options;
		function handleResults(results) {
			for (const result of results) if (result.result.status === "valid") return result.result;
			for (const result of results) if (result.result.status === "dirty") {
				ctx.common.issues.push(...result.ctx.common.issues);
				return result.result;
			}
			const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
		if (ctx.common.async) return Promise.all(options.map(async (option) => {
			const childCtx = {
				...ctx,
				common: {
					...ctx.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await option._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				}),
				ctx: childCtx
			};
		})).then(handleResults);
		else {
			let dirty = void 0;
			const issues = [];
			for (const option of options) {
				const childCtx = {
					...ctx,
					common: {
						...ctx.common,
						issues: []
					},
					parent: null
				};
				const result = option._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				});
				if (result.status === "valid") return result;
				else if (result.status === "dirty" && !dirty) dirty = {
					result,
					ctx: childCtx
				};
				if (childCtx.common.issues.length) issues.push(childCtx.common.issues);
			}
			if (dirty) {
				ctx.common.issues.push(...dirty.ctx.common.issues);
				return dirty.result;
			}
			const unionErrors = issues.map((issues) => new ZodError(issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
	}
	get options() {
		return this._def.options;
	}
};
ZodUnion.create = (types, params) => {
	return new ZodUnion({
		options: types,
		typeName: ZodFirstPartyTypeKind.ZodUnion,
		...processCreateParams(params)
	});
};
const getDiscriminator = (type) => {
	if (type instanceof ZodLazy) return getDiscriminator(type.schema);
	else if (type instanceof ZodEffects) return getDiscriminator(type.innerType());
	else if (type instanceof ZodLiteral) return [type.value];
	else if (type instanceof ZodEnum) return type.options;
	else if (type instanceof ZodNativeEnum) return util.objectValues(type.enum);
	else if (type instanceof ZodDefault) return getDiscriminator(type._def.innerType);
	else if (type instanceof ZodUndefined) return [void 0];
	else if (type instanceof ZodNull) return [null];
	else if (type instanceof ZodOptional) return [void 0, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodNullable) return [null, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodBranded) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodReadonly) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodCatch) return getDiscriminator(type._def.innerType);
	else return [];
};
var ZodDiscriminatedUnion = class ZodDiscriminatedUnion extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const discriminator = this.discriminator;
		const discriminatorValue = ctx.data[discriminator];
		const option = this.optionsMap.get(discriminatorValue);
		if (!option) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union_discriminator,
				options: Array.from(this.optionsMap.keys()),
				path: [discriminator]
			});
			return INVALID;
		}
		if (ctx.common.async) return option._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
		else return option._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	/**
	* The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	* However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	* have a different value for each object in the union.
	* @param discriminator the name of the discriminator property
	* @param types an array of object schemas
	* @param params
	*/
	static create(discriminator, options, params) {
		const optionsMap = /* @__PURE__ */ new Map();
		for (const type of options) {
			const discriminatorValues = getDiscriminator(type.shape[discriminator]);
			if (!discriminatorValues.length) throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
			for (const value of discriminatorValues) {
				if (optionsMap.has(value)) throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
				optionsMap.set(value, type);
			}
		}
		return new ZodDiscriminatedUnion({
			typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
			discriminator,
			options,
			optionsMap,
			...processCreateParams(params)
		});
	}
};
function mergeValues(a, b) {
	const aType = getParsedType(a);
	const bType = getParsedType(b);
	if (a === b) return {
		valid: true,
		data: a
	};
	else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
		const bKeys = util.objectKeys(b);
		const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return { valid: false };
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	} else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
		if (a.length !== b.length) return { valid: false };
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return { valid: false };
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	} else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) return {
		valid: true,
		data: a
	};
	else return { valid: false };
}
var ZodIntersection = class extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const handleParsed = (parsedLeft, parsedRight) => {
			if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID;
			const merged = mergeValues(parsedLeft.value, parsedRight.value);
			if (!merged.valid) {
				addIssueToContext(ctx, { code: ZodIssueCode.invalid_intersection_types });
				return INVALID;
			}
			if (isDirty(parsedLeft) || isDirty(parsedRight)) status.dirty();
			return {
				status: status.value,
				value: merged.data
			};
		};
		if (ctx.common.async) return Promise.all([this._def.left._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		})]).then(([left, right]) => handleParsed(left, right));
		else return handleParsed(this._def.left._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}));
	}
};
ZodIntersection.create = (left, right, params) => {
	return new ZodIntersection({
		left,
		right,
		typeName: ZodFirstPartyTypeKind.ZodIntersection,
		...processCreateParams(params)
	});
};
var ZodTuple = class ZodTuple extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (ctx.data.length < this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_small,
				minimum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			return INVALID;
		}
		if (!this._def.rest && ctx.data.length > this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_big,
				maximum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			status.dirty();
		}
		const items = [...ctx.data].map((item, itemIndex) => {
			const schema = this._def.items[itemIndex] || this._def.rest;
			if (!schema) return null;
			return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
		}).filter((x) => !!x);
		if (ctx.common.async) return Promise.all(items).then((results) => {
			return ParseStatus.mergeArray(status, results);
		});
		else return ParseStatus.mergeArray(status, items);
	}
	get items() {
		return this._def.items;
	}
	rest(rest) {
		return new ZodTuple({
			...this._def,
			rest
		});
	}
};
ZodTuple.create = (schemas, params) => {
	if (!Array.isArray(schemas)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new ZodTuple({
		items: schemas,
		typeName: ZodFirstPartyTypeKind.ZodTuple,
		rest: null,
		...processCreateParams(params)
	});
};
var ZodRecord = class ZodRecord extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const pairs = [];
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		for (const key in ctx.data) pairs.push({
			key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
			value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
			alwaysSet: key in ctx.data
		});
		if (ctx.common.async) return ParseStatus.mergeObjectAsync(status, pairs);
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get element() {
		return this._def.valueType;
	}
	static create(first, second, third) {
		if (second instanceof ZodType) return new ZodRecord({
			keyType: first,
			valueType: second,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(third)
		});
		return new ZodRecord({
			keyType: ZodString.create(),
			valueType: first,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(second)
		});
	}
};
var ZodMap = class extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.map) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.map,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		const pairs = [...ctx.data.entries()].map(([key, value], index) => {
			return {
				key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
				value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
			};
		});
		if (ctx.common.async) {
			const finalMap = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (const pair of pairs) {
					const key = await pair.key;
					const value = await pair.value;
					if (key.status === "aborted" || value.status === "aborted") return INVALID;
					if (key.status === "dirty" || value.status === "dirty") status.dirty();
					finalMap.set(key.value, value.value);
				}
				return {
					status: status.value,
					value: finalMap
				};
			});
		} else {
			const finalMap = /* @__PURE__ */ new Map();
			for (const pair of pairs) {
				const key = pair.key;
				const value = pair.value;
				if (key.status === "aborted" || value.status === "aborted") return INVALID;
				if (key.status === "dirty" || value.status === "dirty") status.dirty();
				finalMap.set(key.value, value.value);
			}
			return {
				status: status.value,
				value: finalMap
			};
		}
	}
};
ZodMap.create = (keyType, valueType, params) => {
	return new ZodMap({
		valueType,
		keyType,
		typeName: ZodFirstPartyTypeKind.ZodMap,
		...processCreateParams(params)
	});
};
var ZodSet = class ZodSet extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.set) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.set,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const def = this._def;
		if (def.minSize !== null) {
			if (ctx.data.size < def.minSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.minSize.message
				});
				status.dirty();
			}
		}
		if (def.maxSize !== null) {
			if (ctx.data.size > def.maxSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.maxSize.message
				});
				status.dirty();
			}
		}
		const valueType = this._def.valueType;
		function finalizeSet(elements) {
			const parsedSet = /* @__PURE__ */ new Set();
			for (const element of elements) {
				if (element.status === "aborted") return INVALID;
				if (element.status === "dirty") status.dirty();
				parsedSet.add(element.value);
			}
			return {
				status: status.value,
				value: parsedSet
			};
		}
		const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
		if (ctx.common.async) return Promise.all(elements).then((elements) => finalizeSet(elements));
		else return finalizeSet(elements);
	}
	min(minSize, message) {
		return new ZodSet({
			...this._def,
			minSize: {
				value: minSize,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxSize, message) {
		return new ZodSet({
			...this._def,
			maxSize: {
				value: maxSize,
				message: errorUtil.toString(message)
			}
		});
	}
	size(size, message) {
		return this.min(size, message).max(size, message);
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodSet.create = (valueType, params) => {
	return new ZodSet({
		valueType,
		minSize: null,
		maxSize: null,
		typeName: ZodFirstPartyTypeKind.ZodSet,
		...processCreateParams(params)
	});
};
var ZodFunction = class ZodFunction extends ZodType {
	constructor() {
		super(...arguments);
		this.validate = this.implement;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.function) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.function,
				received: ctx.parsedType
			});
			return INVALID;
		}
		function makeArgsIssue(args, error) {
			return makeIssue({
				data: args,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_arguments,
					argumentsError: error
				}
			});
		}
		function makeReturnsIssue(returns, error) {
			return makeIssue({
				data: returns,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_return_type,
					returnTypeError: error
				}
			});
		}
		const params = { errorMap: ctx.common.contextualErrorMap };
		const fn = ctx.data;
		if (this._def.returns instanceof ZodPromise) {
			const me = this;
			return OK(async function(...args) {
				const error = new ZodError([]);
				const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
					error.addIssue(makeArgsIssue(args, e));
					throw error;
				});
				const result = await Reflect.apply(fn, this, parsedArgs);
				return await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
					error.addIssue(makeReturnsIssue(result, e));
					throw error;
				});
			});
		} else {
			const me = this;
			return OK(function(...args) {
				const parsedArgs = me._def.args.safeParse(args, params);
				if (!parsedArgs.success) throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
				const result = Reflect.apply(fn, this, parsedArgs.data);
				const parsedReturns = me._def.returns.safeParse(result, params);
				if (!parsedReturns.success) throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
				return parsedReturns.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...items) {
		return new ZodFunction({
			...this._def,
			args: ZodTuple.create(items).rest(ZodUnknown.create())
		});
	}
	returns(returnType) {
		return new ZodFunction({
			...this._def,
			returns: returnType
		});
	}
	implement(func) {
		return this.parse(func);
	}
	strictImplement(func) {
		return this.parse(func);
	}
	static create(args, returns, params) {
		return new ZodFunction({
			args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
			returns: returns || ZodUnknown.create(),
			typeName: ZodFirstPartyTypeKind.ZodFunction,
			...processCreateParams(params)
		});
	}
};
var ZodLazy = class extends ZodType {
	get schema() {
		return this._def.getter();
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		return this._def.getter()._parse({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
};
ZodLazy.create = (getter, params) => {
	return new ZodLazy({
		getter,
		typeName: ZodFirstPartyTypeKind.ZodLazy,
		...processCreateParams(params)
	});
};
var ZodLiteral = class extends ZodType {
	_parse(input) {
		if (input.data !== this._def.value) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_literal,
				expected: this._def.value
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
	get value() {
		return this._def.value;
	}
};
ZodLiteral.create = (value, params) => {
	return new ZodLiteral({
		value,
		typeName: ZodFirstPartyTypeKind.ZodLiteral,
		...processCreateParams(params)
	});
};
function createZodEnum(values, params) {
	return new ZodEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodEnum,
		...processCreateParams(params)
	});
}
var ZodEnum = class ZodEnum extends ZodType {
	_parse(input) {
		if (typeof input.data !== "string") {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(this._def.values);
		if (!this._cache.has(input.data)) {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Values() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	extract(values, newDef = this._def) {
		return ZodEnum.create(values, {
			...this._def,
			...newDef
		});
	}
	exclude(values, newDef = this._def) {
		return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
			...this._def,
			...newDef
		});
	}
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
	_parse(input) {
		const nativeEnumValues = util.getValidEnumValues(this._def.values);
		const ctx = this._getOrReturnCtx(input);
		if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(util.getValidEnumValues(this._def.values));
		if (!this._cache.has(input.data)) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get enum() {
		return this._def.values;
	}
};
ZodNativeEnum.create = (values, params) => {
	return new ZodNativeEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
		...processCreateParams(params)
	});
};
var ZodPromise = class extends ZodType {
	unwrap() {
		return this._def.type;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.promise,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
		return OK(promisified.then((data) => {
			return this._def.type.parseAsync(data, {
				path: ctx.path,
				errorMap: ctx.common.contextualErrorMap
			});
		}));
	}
};
ZodPromise.create = (schema, params) => {
	return new ZodPromise({
		type: schema,
		typeName: ZodFirstPartyTypeKind.ZodPromise,
		...processCreateParams(params)
	});
};
var ZodEffects = class extends ZodType {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const effect = this._def.effect || null;
		const checkCtx = {
			addIssue: (arg) => {
				addIssueToContext(ctx, arg);
				if (arg.fatal) status.abort();
				else status.dirty();
			},
			get path() {
				return ctx.path;
			}
		};
		checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
		if (effect.type === "preprocess") {
			const processed = effect.transform(ctx.data, checkCtx);
			if (ctx.common.async) return Promise.resolve(processed).then(async (processed) => {
				if (status.value === "aborted") return INVALID;
				const result = await this._def.schema._parseAsync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			});
			else {
				if (status.value === "aborted") return INVALID;
				const result = this._def.schema._parseSync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			}
		}
		if (effect.type === "refinement") {
			const executeRefinement = (acc) => {
				const result = effect.refinement(acc, checkCtx);
				if (ctx.common.async) return Promise.resolve(result);
				if (result instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return acc;
			};
			if (ctx.common.async === false) {
				const inner = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				executeRefinement(inner.value);
				return {
					status: status.value,
					value: inner.value
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((inner) => {
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				return executeRefinement(inner.value).then(() => {
					return {
						status: status.value,
						value: inner.value
					};
				});
			});
		}
		if (effect.type === "transform") {
			if (ctx.common.async === false) {
				const base = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (!isValid$1(base)) return INVALID;
				const result = effect.transform(base.value, checkCtx);
				if (result instanceof Promise) throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
				return {
					status: status.value,
					value: result
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((base) => {
				if (!isValid$1(base)) return INVALID;
				return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
					status: status.value,
					value: result
				}));
			});
		}
		util.assertNever(effect);
	}
};
ZodEffects.create = (schema, effect, params) => {
	return new ZodEffects({
		schema,
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		effect,
		...processCreateParams(params)
	});
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	return new ZodEffects({
		schema,
		effect: {
			type: "preprocess",
			transform: preprocess
		},
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		...processCreateParams(params)
	});
};
var ZodOptional = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.undefined) return OK(void 0);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodOptional.create = (type, params) => {
	return new ZodOptional({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodOptional,
		...processCreateParams(params)
	});
};
var ZodNullable = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.null) return OK(null);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodNullable.create = (type, params) => {
	return new ZodNullable({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodNullable,
		...processCreateParams(params)
	});
};
var ZodDefault = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		let data = ctx.data;
		if (ctx.parsedType === ZodParsedType.undefined) data = this._def.defaultValue();
		return this._def.innerType._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
ZodDefault.create = (type, params) => {
	return new ZodDefault({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodDefault,
		defaultValue: typeof params.default === "function" ? params.default : () => params.default,
		...processCreateParams(params)
	});
};
var ZodCatch = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const newCtx = {
			...ctx,
			common: {
				...ctx.common,
				issues: []
			}
		};
		const result = this._def.innerType._parse({
			data: newCtx.data,
			path: newCtx.path,
			parent: { ...newCtx }
		});
		if (isAsync(result)) return result.then((result) => {
			return {
				status: "valid",
				value: result.status === "valid" ? result.value : this._def.catchValue({
					get error() {
						return new ZodError(newCtx.common.issues);
					},
					input: newCtx.data
				})
			};
		});
		else return {
			status: "valid",
			value: result.status === "valid" ? result.value : this._def.catchValue({
				get error() {
					return new ZodError(newCtx.common.issues);
				},
				input: newCtx.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
ZodCatch.create = (type, params) => {
	return new ZodCatch({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodCatch,
		catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
		...processCreateParams(params)
	});
};
var ZodNaN = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.nan) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.nan,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
};
ZodNaN.create = (params) => {
	return new ZodNaN({
		typeName: ZodFirstPartyTypeKind.ZodNaN,
		...processCreateParams(params)
	});
};
var ZodBranded = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const data = ctx.data;
		return this._def.type._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	unwrap() {
		return this._def.type;
	}
};
var ZodPipeline = class ZodPipeline extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.common.async) {
			const handleAsync = async () => {
				const inResult = await this._def.in._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inResult.status === "aborted") return INVALID;
				if (inResult.status === "dirty") {
					status.dirty();
					return DIRTY(inResult.value);
				} else return this._def.out._parseAsync({
					data: inResult.value,
					path: ctx.path,
					parent: ctx
				});
			};
			return handleAsync();
		} else {
			const inResult = this._def.in._parseSync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			});
			if (inResult.status === "aborted") return INVALID;
			if (inResult.status === "dirty") {
				status.dirty();
				return {
					status: "dirty",
					value: inResult.value
				};
			} else return this._def.out._parseSync({
				data: inResult.value,
				path: ctx.path,
				parent: ctx
			});
		}
	}
	static create(a, b) {
		return new ZodPipeline({
			in: a,
			out: b,
			typeName: ZodFirstPartyTypeKind.ZodPipeline
		});
	}
};
var ZodReadonly = class extends ZodType {
	_parse(input) {
		const result = this._def.innerType._parse(input);
		const freeze = (data) => {
			if (isValid$1(data)) data.value = Object.freeze(data.value);
			return data;
		};
		return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodReadonly.create = (type, params) => {
	return new ZodReadonly({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodReadonly,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate;
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {
	ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
const numberType = ZodNumber.create;
ZodNaN.create;
ZodBigInt.create;
const booleanType = ZodBoolean.create;
ZodDate.create;
ZodSymbol.create;
ZodUndefined.create;
ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
ZodNever.create;
ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
ZodObject.strictCreate;
const unionType = ZodUnion.create;
ZodDiscriminatedUnion.create;
ZodIntersection.create;
ZodTuple.create;
const recordType = ZodRecord.create;
ZodMap.create;
ZodSet.create;
ZodFunction.create;
ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
ZodNativeEnum.create;
ZodPromise.create;
ZodEffects.create;
ZodOptional.create;
ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
ZodPipeline.create;
const coerce = {
	string: ((arg) => ZodString.create({
		...arg,
		coerce: true
	})),
	number: ((arg) => ZodNumber.create({
		...arg,
		coerce: true
	})),
	boolean: ((arg) => ZodBoolean.create({
		...arg,
		coerce: true
	})),
	bigint: ((arg) => ZodBigInt.create({
		...arg,
		coerce: true
	})),
	date: ((arg) => ZodDate.create({
		...arg,
		coerce: true
	}))
};
/**
* Base class for all A2UI specific errors.
*
* Includes a machine-readable `code` for categorical handling and ensures
* proper stack trace capturing.
*/
var A2uiError = class extends Error {
	constructor(message, code = "UNKNOWN_ERROR") {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	}
};
/**
* Thrown when JSON validation fails or schemas are mismatched.
*/
var A2uiValidationError = class extends A2uiError {
	constructor(message, details) {
		super(message, "VALIDATION_ERROR");
		this.details = details;
	}
};
/**
* Thrown during DataModel mutations (invalid paths, type mismatches).
*/
var A2uiDataError = class extends A2uiError {
	constructor(message, path) {
		super(message, "DATA_ERROR");
		this.path = path;
	}
};
/**
* Thrown during string interpolation and function evaluation.
*/
var A2uiExpressionError = class extends A2uiError {
	constructor(message, expression, details) {
		super(message, "EXPRESSION_ERROR");
		this.expression = expression;
		this.details = details;
	}
};
/**
* Thrown for structural issues in the UI tree (missing surfaces, duplicate components).
*/
var A2uiStateError = class extends A2uiError {
	constructor(message) {
		super(message, "STATE_ERROR");
	}
};
const DataBindingSchema = objectType({ "path": stringType().describe("A JSON Pointer path to a value in the data model.") }).describe("REF:common_types.json#/$defs/DataBinding|A JSON Pointer path to a value in the data model.");
const FunctionCallSchema = objectType({
	"call": stringType().describe("The name of the function to call."),
	"args": recordType(anyType()).describe("Arguments passed to the function."),
	"returnType": enumType([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).default("boolean")
}).describe("REF:common_types.json#/$defs/FunctionCall|Invokes a named function on the client.");
const DynamicBooleanSchema = unionType([
	booleanType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:common_types.json#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean.");
const DynamicStringSchema = unionType([
	stringType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:common_types.json#/$defs/DynamicString|Represents a string");
const DynamicNumberSchema = unionType([
	numberType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:common_types.json#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.");
const DynamicStringListSchema = unionType([
	arrayType(stringType()),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:common_types.json#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.");
const DynamicValueSchema = unionType([
	stringType(),
	numberType(),
	booleanType(),
	arrayType(anyType()),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.");
const ComponentIdSchema = markChildRef(stringType().describe("REF:common_types.json#/$defs/ComponentId|The unique identifier for a component."), "component-id");
/**
* Stamps the child-reference kind into the schema's zod metadata. Methods
* like `.describe()` and `.optional()` rebuild schemas from `_def`, so the
* flag survives them; the `REF:` description remains the wire-facing pointer
* the capabilities generator resolves into a `$ref`.
*/
function markChildRef(schema, ref) {
	schema._def.a2uiChildRef = ref;
	return schema;
}
function childRefKindOf(schema) {
	return schema._def.a2uiChildRef;
}
function componentId(options = {}) {
	if (options.description === void 0) return ComponentIdSchema;
	return ComponentIdSchema.describe(`REF:common_types.json#/$defs/ComponentId|${options.description}`);
}
/**
* Describes a child-list property without losing its `REF:` pointer; the
* same hazard {@link componentId} exists for.
*/
function childList(options = {}) {
	if (options.description === void 0) return ChildListSchema;
	return ChildListSchema.describe(`REF:common_types.json#/$defs/ChildList|${options.description}`);
}
const ChildListSchema = markChildRef(unionType([arrayType(ComponentIdSchema).describe("A static list of child component IDs."), objectType({
	"componentId": ComponentIdSchema,
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).describe("A template for generating a dynamic list of children.")]).describe("REF:common_types.json#/$defs/ChildList"), "child-list");
const ActionSchema = unionType([objectType({ "event": objectType({
	"name": stringType(),
	"context": recordType(DynamicValueSchema).optional()
}) }).describe("Triggers a server-side event."), objectType({ "functionCall": FunctionCallSchema }).describe("Executes a local client-side function.")]).describe("REF:common_types.json#/$defs/Action");
const CheckRuleSchema = objectType({
	"condition": DynamicBooleanSchema,
	"message": stringType().describe("The error message to display if the check fails.")
}).describe("REF:common_types.json#/$defs/CheckRule|A check rule consisting of a condition and an error message.");
const CheckableSchema = objectType({
	"checks": arrayType(CheckRuleSchema).optional().describe("A list of checks to perform."),
	"isValid": booleanType().optional().describe("Whether the checks currently pass."),
	"validationErrors": arrayType(stringType()).optional().describe("Current validation error messages.")
}).describe("REF:common_types.json#/$defs/Checkable|Properties for components that support client-side checks.");
const AccessibilityAttributesSchema = objectType({
	"label": DynamicStringSchema.optional().describe("REF:common_types.json#/$defs/DynamicString|A short string used by assistive technologies to convey the purpose of an element."),
	"description": DynamicStringSchema.optional().describe("REF:common_types.json#/$defs/DynamicString|Additional information provided by assistive technologies about an element.")
}).describe("REF:common_types.json#/$defs/AccessibilityAttributes|Attributes to enhance accessibility.");
const AnyComponentSchema = objectType({
	"component": stringType().describe("The type name of the component."),
	"id": ComponentIdSchema.optional(),
	"weight": numberType().optional()
}).passthrough().describe("A generic A2UI component definition.");
const COMMON_TYPE_SCHEMAS = {
	DynamicString: DynamicStringSchema,
	DynamicNumber: DynamicNumberSchema,
	DynamicBoolean: DynamicBooleanSchema,
	DynamicStringList: DynamicStringListSchema,
	DynamicValue: DynamicValueSchema,
	ComponentId: ComponentIdSchema,
	ChildList: ChildListSchema,
	Action: ActionSchema,
	CheckRule: CheckRuleSchema,
	Checkable: CheckableSchema,
	AccessibilityAttributes: AccessibilityAttributesSchema
};
/**
* Resolves a JSON Pointer within a root JSON document.
* Follows RFC 6901 pointer unescaping (~1 -> /, ~0 -> ~).
*/
function resolveJsonPointer(rootDoc, pointer) {
	if (!pointer.startsWith("#/")) return void 0;
	const segments = pointer.slice(2).split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
	let curr = rootDoc;
	for (const seg of segments) if (curr && typeof curr === "object" && seg in curr) curr = curr[seg];
	else return;
	return typeof curr === "object" && curr !== null ? curr : void 0;
}
function resolveProtocolRef(ref) {
	const defName = ref.split(/#\/(?:\$defs|definitions)\//)[1];
	return defName ? COMMON_TYPE_SCHEMAS[defName] : void 0;
}
function convertEnumToZod(values) {
	if (values.length === 0) return unknownType();
	if (values.every((v) => typeof v === "string")) return enumType(values);
	if (values.length === 1) return literalType(values[0]);
	return unionType(values.map((v) => literalType(v)));
}
function convertPropertyToZod(propSchema, rootDoc, visitedPointers = /* @__PURE__ */ new Set()) {
	if (!propSchema || typeof propSchema !== "object") return unknownType();
	if (propSchema.$ref && typeof propSchema.$ref === "string") {
		const ref = propSchema.$ref;
		const resolvedProtocol = resolveProtocolRef(ref);
		if (resolvedProtocol) {
			const defName = ref.split(/#\/(?:\$defs|definitions)\//)[1];
			const desc = propSchema.description ? `REF:common_types.json#/$defs/${defName}|${propSchema.description}` : resolvedProtocol.description;
			return desc ? resolvedProtocol.describe(desc) : resolvedProtocol;
		}
		if (rootDoc && ref.startsWith("#/") && !visitedPointers.has(ref)) {
			visitedPointers.add(ref);
			const localTarget = resolveJsonPointer(rootDoc, ref);
			if (localTarget) {
				let zodType = convertPropertyToZod(localTarget, rootDoc, visitedPointers);
				if (propSchema.description) zodType = zodType.describe(propSchema.description);
				return zodType;
			}
		}
	}
	if (Array.isArray(propSchema.oneOf) || Array.isArray(propSchema.anyOf)) {
		const branches = propSchema.oneOf || propSchema.anyOf;
		const enumBranch = branches.find((b) => Array.isArray(b.enum));
		const hasBinding = branches.some((b) => typeof b.$ref === "string" && b.$ref.includes("DataBinding"));
		if (enumBranch) {
			let enumZod = convertEnumToZod(enumBranch.enum);
			if (propSchema.default !== void 0) enumZod = enumZod.default(propSchema.default);
			const desc = propSchema.description || (hasBinding ? "REF:common_types.json#/$defs/DynamicString" : void 0);
			if (desc) enumZod = enumZod.describe(desc);
			return enumZod;
		}
	}
	if (Array.isArray(propSchema.enum) && propSchema.enum.length > 0) {
		let enumZod = convertEnumToZod(propSchema.enum);
		if (propSchema.default !== void 0) enumZod = enumZod.default(propSchema.default);
		if (propSchema.description) enumZod = enumZod.describe(propSchema.description);
		return enumZod;
	}
	if (propSchema.type === "array") {
		const itemSchema = propSchema.items ? convertPropertyToZod(propSchema.items, rootDoc, visitedPointers) : anyType();
		let arr = arrayType(itemSchema);
		if (propSchema.description) arr = arr.describe(propSchema.description);
		return arr;
	}
	switch (propSchema.type) {
		case "string": {
			let s = stringType();
			if (propSchema.default !== void 0) s = s.default(propSchema.default);
			if (propSchema.description) s = s.describe(propSchema.description);
			return s;
		}
		case "integer": {
			let n = numberType().int();
			if (propSchema.default !== void 0) n = n.default(propSchema.default);
			if (propSchema.description) n = n.describe(propSchema.description);
			return n;
		}
		case "number": {
			let n = numberType();
			if (propSchema.default !== void 0) n = n.default(propSchema.default);
			if (propSchema.description) n = n.describe(propSchema.description);
			return n;
		}
		case "boolean": {
			let b = booleanType();
			if (propSchema.default !== void 0) b = b.default(propSchema.default);
			if (propSchema.description) b = b.describe(propSchema.description);
			return b;
		}
		case "object": {
			let obj = recordType(anyType());
			if (propSchema.description) obj = obj.describe(propSchema.description);
			return obj;
		}
		default: {
			let anyZ = anyType();
			if (propSchema.description) anyZ = anyZ.describe(propSchema.description);
			return anyZ;
		}
	}
}
function convertPropertiesToShape(properties, requiredSet, omitEnvelopeFields = false, rootDoc) {
	const shape = {};
	for (const [propName, propSchema] of Object.entries(properties)) {
		if (omitEnvelopeFields && (propName === "component" || propName === "id")) continue;
		const zodField = convertPropertyToZod(propSchema, rootDoc);
		shape[propName] = requiredSet.has(propName) ? zodField : zodField.optional();
	}
	return shape;
}
/**
* Collects all property definitions and constraints from a component schema,
* resolving local document $defs and canonical protocol ComponentCommon references.
*/
function collectComponentSubSchemas(schema, rootDoc, visitedPointers = /* @__PURE__ */ new Set()) {
	const result = [];
	if (!schema || typeof schema !== "object") return result;
	if (Array.isArray(schema.allOf)) for (const sub of schema.allOf) {
		if (!sub || typeof sub !== "object") continue;
		if (typeof sub.$ref === "string") {
			const ref = sub.$ref;
			if (ref.includes("common_types.json") && ref.includes("ComponentCommon")) result.push({ properties: { accessibility: AccessibilityAttributesSchema.optional() } });
			else if (ref.startsWith("#/")) {
				if (!visitedPointers.has(ref)) {
					visitedPointers.add(ref);
					const target = resolveJsonPointer(rootDoc, ref);
					if (target) result.push(...collectComponentSubSchemas(target, rootDoc, visitedPointers));
				}
			}
		} else result.push(...collectComponentSubSchemas(sub, rootDoc, visitedPointers));
	}
	if (schema.properties) result.push(schema);
	return result;
}
function convertComponentJsonSchemaToZod(rawSchema, rootDoc) {
	const shape = {};
	const schemasToMerge = collectComponentSubSchemas(rawSchema, rootDoc);
	const requiredSet = /* @__PURE__ */ new Set();
	for (const s of schemasToMerge) if (Array.isArray(s.required)) s.required.forEach((r) => requiredSet.add(r));
	for (const s of schemasToMerge) {
		const propShape = convertPropertiesToShape(s.properties || {}, requiredSet, true, rootDoc);
		Object.assign(shape, propShape);
	}
	return objectType(shape).strict();
}
function convertFunctionArgsJsonSchemaToZod(rawSchema, rootDoc) {
	const requiredSet = new Set(Array.isArray(rawSchema.required) ? rawSchema.required : []);
	const shape = convertPropertiesToShape(rawSchema.properties || {}, requiredSet, false, rootDoc);
	return objectType(shape).strict();
}
function parseFunctionDefinitions(rawFunctions, rootDoc) {
	const result = [];
	if (!rawFunctions) return result;
	if (Array.isArray(rawFunctions)) {
		for (const fn of rawFunctions) if (fn && typeof fn.name === "string") {
			const paramSchema = fn.parameters && typeof fn.parameters === "object" ? convertFunctionArgsJsonSchemaToZod(fn.parameters, rootDoc) : recordType(anyType());
			result.push({
				name: fn.name,
				description: fn.description,
				returnType: fn.returnType ?? "any",
				schema: paramSchema
			});
		}
		return result;
	}
	if (typeof rawFunctions === "object") for (const [name, defn] of Object.entries(rawFunctions)) {
		const d = defn;
		const argsSchema = d.properties?.args ?? d.args ?? d.parameters;
		const paramSchema = argsSchema && typeof argsSchema === "object" ? convertFunctionArgsJsonSchemaToZod(argsSchema, rootDoc) : recordType(anyType());
		result.push({
			name,
			description: d.description,
			returnType: d.returnType ?? d.properties?.returnType?.const ?? "any",
			schema: paramSchema
		});
	}
	return result;
}
/**
* Loads raw A2UI catalog schema directly into a typed Catalog instance.
*
* @param catalogSchema Raw catalog schema or capabilities definition object.
*/
function loadCatalogFromSchema(catalogSchema) {
	const catalogId = catalogSchema.catalogId ?? catalogSchema.$id ?? catalogSchema.id;
	if (!catalogId || typeof catalogId !== "string") throw new Error("Catalog ID must be specified via catalog metadata ('catalogId' or '$id').");
	const permittedNames = /* @__PURE__ */ new Set();
	const oneOf = catalogSchema.$defs?.anyComponent?.oneOf;
	if (Array.isArray(oneOf)) {
		for (const item of oneOf) if (typeof item?.$ref === "string" && item.$ref.startsWith("#/components/")) permittedNames.add(item.$ref.split("/").pop());
	}
	const components = [];
	const componentsMap = catalogSchema.components ?? {};
	for (const [name, rawCompSchema] of Object.entries(componentsMap)) if (permittedNames.size === 0 || permittedNames.has(name)) {
		const zodSchema = convertComponentJsonSchemaToZod(rawCompSchema, catalogSchema);
		components.push({
			name,
			schema: zodSchema
		});
	}
	return new Catalog(catalogId, components, parseFunctionDefinitions(catalogSchema.functions, catalogSchema));
}
function createFunctionImplementation(api, execute) {
	return {
		name: api.name,
		returnType: api.returnType,
		schema: api.schema,
		execute
	};
}
/**
* A collection of available components and functions.
*
* The `F` parameter distinguishes catalogs that carry executable function
* implementations (`FunctionImplementation`, the default and the only kind a
* renderer should hold) from schema-only catalogs (`FunctionApi`), whose
* functions are signatures loaded from catalog JSON with no code attached.
* Consumers that need to execute functions, such as `NodeResolver`, constrain
* `F` to `FunctionImplementation` so a schema-only catalog is rejected at
* compile time rather than resolving values to `undefined` at runtime.
*/
var Catalog = class {
	constructor(id, components, functions = [], themeSchema) {
		this.id = id;
		const compMap = /* @__PURE__ */ new Map();
		for (const comp of components) compMap.set(comp.name, comp);
		this.components = compMap;
		const funcMap = /* @__PURE__ */ new Map();
		for (const fn of functions) funcMap.set(fn.name, fn);
		this.functions = funcMap;
		this.themeSchema = themeSchema;
		this.invoker = (name, rawArgs, ctx, abortSignal) => {
			const fn = this.functions.get(name);
			if (!fn) throw new A2uiExpressionError(`Function not found in catalog '${this.id}': ${name}`, name);
			const execute = fn.execute;
			if (typeof execute !== "function") throw new A2uiExpressionError(`Function '${name}' in catalog '${this.id}' is schema-only and has no implementation.`, name);
			try {
				const safeArgs = fn.schema.parse(rawArgs);
				return execute.call(fn, safeArgs, ctx, abortSignal);
			} catch (e) {
				if (e?.name === "ZodError" || e instanceof ZodError) throw new A2uiExpressionError(`Validation failed for function '${name}': ${e.message}`, name, e.errors ?? e.issues);
				throw e;
			}
		};
	}
	/**
	* Constructs a fully-typed schema-only Catalog directly from raw A2UI catalog schema.
	*
	* @param catalogSchema Raw catalog schema or client capabilities payload object.
	*/
	static fromSchema(catalogSchema) {
		return loadCatalogFromSchema(catalogSchema);
	}
};
/**
* Traverses a Zod schema tree to build a `BehaviorNode` map.
*
* This allows the Generic Binder to know *how* to handle a piece of raw JSON
* data without needing hardcoded logic for every specific component type.
* It identifies core A2UI primitives (Dynamic values, Actions, ChildLists) by
* inspecting the shape of ZodUnion objects defined in `common-types.ts`.
*/
function scrapeSchemaBehavior(schema) {
	return getFieldBehavior(schema);
}
const ACTION_REF = "REF:common_types.json#/$defs/Action";
const DATA_BINDING_REF = "REF:common_types.json#/$defs/DataBinding";
const DYNAMIC_REF_PREFIX = "#/$defs/Dynamic";
function getFieldBehavior(type, propertyName) {
	let current = type;
	let description = current._def?.description || "";
	while (current._def.typeName === "ZodOptional" || current._def.typeName === "ZodNullable" || current._def.typeName === "ZodDefault") {
		if (!description && current._def.description) description = current._def.description;
		current = current._def.innerType;
	}
	if (!description && current._def.description) description = current._def.description;
	if (propertyName === "checks") return { type: "CHECKABLE" };
	if (description.startsWith(ACTION_REF)) return { type: "ACTION" };
	if (childRefKindOf(current) === "child-list" || description.includes("#/$defs/ChildList")) return { type: "STRUCTURAL" };
	if ((description.startsWith(DATA_BINDING_REF) || description.includes(DYNAMIC_REF_PREFIX)) && current._def.typeName !== "ZodObject" && current._def.typeName !== "ZodArray") return { type: "DYNAMIC" };
	if (current._def.typeName === "ZodUnion") {
		const options = current._def.options;
		if (options.some((o) => o._def.typeName === "ZodObject" && o._def.shape().event)) return { type: "ACTION" };
		if (options.some((o) => o._def.typeName === "ZodObject" && o._def.shape().path && !o._def.shape().componentId)) return { type: "DYNAMIC" };
		if (options.some((o) => o._def.typeName === "ZodObject" && o._def.shape().componentId && o._def.shape().path)) return { type: "STRUCTURAL" };
	} else if (current._def.typeName === "ZodString") {}
	if (current._def.typeName === "ZodArray") return {
		type: "ARRAY",
		element: getFieldBehavior(current._def.type)
	};
	if (current._def.typeName === "ZodObject") {
		const shape = {};
		const objShape = current._def.shape();
		for (const [key, value] of Object.entries(objShape)) shape[key] = getFieldBehavior(value, key);
		return {
			type: "OBJECT",
			shape
		};
	}
	return { type: "STATIC" };
}
/**
* The Generic Binder is a framework-agnostic engine that transforms raw A2UI JSON payload
* configurations into a single, cohesive reactive stream of strongly-typed `ResolvedProps`.
*
* It solves the problem of manual state management: developers do not need to write
* boilerplate code to subscribe to data paths, evaluate logic expressions, or tear down
* listeners when components unmount.
*
* Usage Flow:
* 1. Takes a `ComponentContext` (the raw JSON config) and a `Zod Schema` (the API definition).
* 2. Uses `scrapeSchemaBehavior` to analyze the schema.
* 3. Deeply iterates over the raw JSON properties, applying rules based on the scraped behavior.
* 4. Subscribes to the `DataContext` for all `DYNAMIC` and `CHECKABLE` paths.
* 5. Bundles the final resolved primitives, structural arrays, and executable Actions into `currentProps`.
* 6. Exposes a `subscribe()` interface for framework-specific adapters (React, Angular) to listen to state changes.
*/
var GenericBinder = class {
	constructor(context, schema) {
		this.dataListeners = [];
		this.propsListeners = [];
		this.currentProps = {};
		this.isConnected = false;
		this.actionClosures = /* @__PURE__ */ new Map();
		this.context = context;
		this.behaviorTree = scrapeSchemaBehavior(schema);
		if (this.behaviorTree.type !== "OBJECT") this.behaviorTree = {
			type: "OBJECT",
			shape: {}
		};
		this.resolveInitialProps();
	}
	resolveInitialProps() {
		const props = this.context.componentModel.properties;
		const resolved = this.resolveAndBind(props, this.behaviorTree, [], true);
		this.currentProps = {
			...this.currentProps,
			...resolved
		};
	}
	connect() {
		if (this.isConnected) return;
		this.isConnected = true;
		const sub = this.context.componentModel.onUpdated.subscribe(() => {
			this.rebuildAllBindings();
		});
		this.compUnsub = () => sub.unsubscribe();
		this.rebuildAllBindings();
	}
	rebuildAllBindings() {
		this.dataListeners.forEach((l) => l());
		this.dataListeners = [];
		const props = this.context.componentModel.properties;
		const resolved = this.resolveAndBind(props, this.behaviorTree, [], false);
		this.currentProps = {
			...this.currentProps,
			...resolved
		};
		this.notify();
	}
	bindDynamicValue(value, path, isSync) {
		const bound = this.context.dataContext.subscribeDynamicValue(value, (newVal) => {
			this.updateDeepValue(path, newVal);
			this.notify();
		});
		if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
		else bound.unsubscribe();
		return bound.value;
	}
	bindAction(value, path) {
		const cacheKey = path.join("/");
		const cached = this.actionClosures.get(cacheKey);
		if (cached && jsonEquals(cached.raw, value)) return cached.closure;
		const closure = () => {
			const resolveDeepSync = (val) => {
				if (typeof val !== "object" || val === null) return val;
				if ("path" in val || "call" in val) return this.context.dataContext.resolveDynamicValue(val);
				if (Array.isArray(val)) return val.map(resolveDeepSync);
				const res = {};
				for (const [k, v] of Object.entries(val)) res[k] = resolveDeepSync(v);
				return res;
			};
			this.context.dispatchAction(resolveDeepSync(value));
		};
		this.actionClosures.set(cacheKey, {
			raw: value,
			closure
		});
		return closure;
	}
	bindStructuralTemplate(value, path, isSync) {
		if (value && typeof value === "object" && !Array.isArray(value)) {
			const templatePath = value.path;
			const templateComponentId = value.componentId;
			if (templatePath && templateComponentId) {
				const bound = this.context.dataContext.subscribeDynamicValue({ path: templatePath }, (newVal) => {
					const arr = Array.isArray(newVal) ? newVal : [];
					const listContext = this.context.dataContext.nested(templatePath);
					const resolvedChildren = arr.map((_, i) => ({
						id: templateComponentId,
						basePath: listContext.nested(String(i)).path
					}));
					this.updateDeepValue(path, resolvedChildren);
					this.notify();
				});
				if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
				else bound.unsubscribe();
				const currentArr = Array.isArray(bound.value) ? bound.value : [];
				const listContext = this.context.dataContext.nested(templatePath);
				return currentArr.map((_, i) => ({
					id: templateComponentId,
					basePath: listContext.nested(String(i)).path
				}));
			}
		}
		return value;
	}
	resolveAndBind(value, behavior, path, isSync) {
		if (value === void 0 || value === null) return value;
		switch (behavior.type) {
			case "DYNAMIC": return this.bindDynamicValue(value, path, isSync);
			case "ACTION": return this.bindAction(value, path);
			case "STRUCTURAL": return this.bindStructuralTemplate(value, path, isSync);
			case "CHECKABLE": {
				const rules = Array.isArray(value) ? value : [];
				const ruleResults = rules.map(() => ({
					valid: true,
					message: ""
				}));
				const parentPath = path.slice(0, -1);
				const updateValidationState = () => {
					const errors = ruleResults.filter((r) => !r.valid).map((r) => r.message);
					this.updateDeepValue([...parentPath, "isValid"], errors.length === 0);
					this.updateDeepValue([...parentPath, "validationErrors"], errors);
					this.notify();
				};
				rules.forEach((rule, index) => {
					const condition = rule.condition || rule;
					const message = rule.message || "Validation failed";
					ruleResults[index].message = message;
					const bound = this.context.dataContext.subscribeDynamicValue(condition, (newVal) => {
						ruleResults[index].valid = !!newVal;
						updateValidationState();
					});
					if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
					else bound.unsubscribe();
					ruleResults[index].valid = !!bound.value;
				});
				const initialErrors = ruleResults.filter((r) => !r.valid).map((r) => r.message);
				this.updateDeepValue([...parentPath, "isValid"], initialErrors.length === 0);
				this.updateDeepValue([...parentPath, "validationErrors"], initialErrors);
				return value;
			}
			case "STATIC": return value;
			case "ARRAY":
				if (!Array.isArray(value)) return value;
				return value.map((item, index) => this.resolveAndBind(item, behavior.element, [...path, index.toString()], isSync));
			case "OBJECT": {
				if (typeof value !== "object") return value;
				const result = {};
				for (const [k, v] of Object.entries(value)) {
					const childBehavior = behavior.shape[k] || { type: "STATIC" };
					result[k] = this.resolveAndBind(v, childBehavior, [...path, k], isSync);
				}
				for (const [k, childBehavior] of Object.entries(behavior.shape)) if (childBehavior.type === "DYNAMIC") {
					const setterName = `set${k.charAt(0).toUpperCase() + k.slice(1)}`;
					const rawPropValue = value[k];
					result[setterName] = (newValue) => {
						if (rawPropValue && typeof rawPropValue === "object" && "path" in rawPropValue) this.context.dataContext.set(rawPropValue.path, newValue);
					};
				}
				return result;
			}
		}
	}
	updateDeepValue(path, newValue) {
		this.currentProps = this.cloneAndUpdate(this.currentProps, path, newValue);
	}
	cloneAndUpdate(obj, path, newValue) {
		if (path.length === 0) return newValue;
		const [key, ...rest] = path;
		if (Array.isArray(obj)) {
			const newArr = [...obj];
			newArr[Number(key)] = this.cloneAndUpdate(newArr[Number(key)], rest, newValue);
			return newArr;
		} else return {
			...obj || {},
			[key]: this.cloneAndUpdate((obj || {})[key], rest, newValue)
		};
	}
	dispose() {
		if (!this.isConnected) return;
		this.isConnected = false;
		this.dataListeners.forEach((l) => l());
		this.dataListeners = [];
		if (this.compUnsub) {
			this.compUnsub();
			this.compUnsub = void 0;
		}
	}
	notify() {
		this.propsListeners.forEach((l) => l(this.currentProps));
	}
	subscribe(listener) {
		if (this.propsListeners.length === 0) this.connect();
		this.propsListeners.push(listener);
		return { unsubscribe: () => {
			this.propsListeners = this.propsListeners.filter((l) => l !== listener);
			if (this.propsListeners.length === 0) this.dispose();
		} };
	}
	get snapshot() {
		return this.currentProps;
	}
};
/** Structural equality over JSON-shaped values (objects, arrays, primitives). */
function jsonEquals(a, b) {
	if (Object.is(a, b)) return true;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((item, index) => jsonEquals(item, b[index]));
	}
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	return aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && jsonEquals(a[key], b[key]));
}
/**
* A Lit ReactiveController that binds an A2UI component context to its API schema.
*
* This controller manages the subscription to the GenericBinder, updating the
* component props and requesting a host update whenever the underlying layer data changes.
*
* @template Api The specific A2UI component API interface this controller is bound to.
* @internal
*/
var A2uiController = class {
	/**
	* Initializes the controller, binding it to the given Lit element and API schema.
	*
	* @param host The A2uiLitElement acting as the component host.
	* @param api The A2UI component API defining the schema for this element.
	*/
	constructor(host, api) {
		this.host = host;
		this.binder = new GenericBinder(this.host.context, api.schema);
		this.props = this.binder.snapshot;
		this.host.addController(this);
		if (this.host.isConnected) this.hostConnected();
	}
	/**
	* Subscribes to the GenericBinder updates when the host connects.
	*
	* Triggers a request update on the host element when new props are received.
	*/
	hostConnected() {
		if (!this.subscription) this.subscription = this.binder.subscribe((newProps) => {
			this.props = newProps;
			this.host.requestUpdate();
		});
		if (!this.componentsSubscription) this.componentsSubscription = this.host.context.dataContext.surface.componentsModel?.onCreated.subscribe(() => {
			this.host.requestUpdate();
		});
	}
	/**
	* Unsubscribes from the GenericBinder updates when the host disconnects.
	*/
	hostDisconnected() {
		this.subscription?.unsubscribe();
		this.subscription = void 0;
		this.componentsSubscription?.unsubscribe();
		this.componentsSubscription = void 0;
	}
	/**
	* Disposes the underlying GenericBinder to clean up resources from the context.
	*/
	dispose() {
		this.binder.dispose();
	}
};
var i$5 = Symbol.for("preact-signals");
function t$3() {
	if (!(v$1 > 1)) {
		var i, t = !1;
		(function() {
			var i = c$5;
			c$5 = void 0;
			while (void 0 !== i) {
				var t = i.S;
				if (t.v === i.v) {
					for (var n = t.t; void 0 !== n; n = n.x) if (n.i === i.i) n.i = t.i;
				}
				i = i.o;
			}
		})();
		while (void 0 !== h$2) {
			var n = h$2;
			h$2 = void 0;
			s$6++;
			while (void 0 !== n) {
				var r = n.u;
				n.u = void 0;
				n.f &= -3;
				if (!(8 & n.f) && w(n)) try {
					n.c();
				} catch (n) {
					if (!t) {
						i = n;
						t = !0;
					}
				}
				n = r;
			}
		}
		s$6 = 0;
		v$1--;
		if (t) throw i;
	} else v$1--;
}
function n$5(i) {
	if (v$1 > 0) return i();
	e$6 = ++u$3;
	v$1++;
	try {
		return i();
	} finally {
		t$3();
	}
}
var r$2;
var o$4 = void 0;
function f$2(i) {
	var t = o$4, n = r$2;
	o$4 = void 0;
	r$2 = void 0;
	try {
		return i();
	} finally {
		o$4 = t;
		r$2 = n;
	}
}
var h$2 = void 0;
var v$1 = 0;
var s$6 = 0;
var u$3 = 0;
var e$6 = 0;
var c$5 = void 0;
var d$1 = 0;
function a$1(i) {
	if (void 0 !== o$4) {
		var t = i.n;
		if (void 0 === t || t.t !== o$4) {
			t = {
				i: 0,
				S: i,
				p: o$4.s,
				n: void 0,
				t: o$4,
				e: void 0,
				x: void 0,
				r: t
			};
			if (void 0 !== o$4.s) o$4.s.n = t;
			o$4.s = t;
			i.n = t;
			if (32 & o$4.f) i.S(t);
			return t;
		} else if (-1 === t.i) {
			t.i = 0;
			if (void 0 !== t.n) {
				t.n.p = t.p;
				if (void 0 !== t.p) t.p.n = t.n;
				t.p = o$4.s;
				t.n = void 0;
				o$4.s.n = t;
				o$4.s = t;
			}
			return t;
		}
	}
}
function l$2(i, t) {
	this.v = i;
	this.i = 0;
	this.n = void 0;
	this.t = void 0;
	this.l = 0;
	this.W = null == t ? void 0 : t.watched;
	this.Z = null == t ? void 0 : t.unwatched;
	this.name = null == t ? void 0 : t.name;
}
l$2.prototype.brand = i$5;
l$2.prototype.h = function() {
	return !0;
};
l$2.prototype.S = function(i) {
	var t = this, n = this.t;
	if (n !== i && void 0 === i.e) {
		i.x = n;
		this.t = i;
		if (void 0 !== n) n.e = i;
		else f$2(function() {
			var i;
			null == (i = t.W) || i.call(t);
		});
	}
};
l$2.prototype.U = function(i) {
	var t = this;
	if (void 0 !== this.t) {
		var n = i.e, r = i.x;
		if (void 0 !== n) {
			n.x = r;
			i.e = void 0;
		}
		if (void 0 !== r) {
			r.e = n;
			i.x = void 0;
		}
		if (i === this.t) {
			this.t = r;
			if (void 0 === r) f$2(function() {
				var i;
				null == (i = t.Z) || i.call(t);
			});
		}
	}
};
l$2.prototype.subscribe = function(i) {
	var t = this;
	return j$1(function() {
		var n = t.value;
		f$2(function() {
			return i(n);
		});
	}, { name: "sub" });
};
l$2.prototype.valueOf = function() {
	return this.value;
};
l$2.prototype.toString = function() {
	return this.value + "";
};
l$2.prototype.toJSON = function() {
	return this.value;
};
l$2.prototype.peek = function() {
	var i = this;
	return f$2(function() {
		return i.value;
	});
};
Object.defineProperty(l$2.prototype, "value", {
	get: function() {
		var i = a$1(this);
		if (void 0 !== i) i.i = this.i;
		return this.v;
	},
	set: function(i) {
		if (i !== this.v) {
			if (s$6 > 100) throw new Error("Cycle detected");
			(function(i) {
				if (0 !== v$1 && 0 === s$6) {
					if (i.l !== e$6) {
						i.l = e$6;
						c$5 = {
							S: i,
							v: i.v,
							i: i.i,
							o: c$5
						};
					}
				}
			})(this);
			this.v = i;
			this.i++;
			d$1++;
			v$1++;
			try {
				for (var n = this.t; void 0 !== n; n = n.x) n.t.N();
			} finally {
				t$3();
			}
		}
	}
});
function y(i, t) {
	return new l$2(i, t);
}
function w(i) {
	for (var t = i.s; void 0 !== t; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function _(i) {
	for (var t = i.s; void 0 !== t; t = t.n) {
		var n = t.S.n;
		if (void 0 !== n) t.r = n;
		t.S.n = t;
		t.i = -1;
		if (void 0 === t.n) {
			i.s = t;
			break;
		}
	}
}
function b(i) {
	var t = i.s, n = void 0;
	while (void 0 !== t) {
		var r = t.p;
		if (-1 === t.i) {
			t.S.U(t);
			if (void 0 !== r) r.n = t.n;
			if (void 0 !== t.n) t.n.p = r;
		} else n = t;
		t.S.n = t.r;
		if (void 0 !== t.r) t.r = void 0;
		t = r;
	}
	i.s = n;
}
function p$1(i, t) {
	l$2.call(this, void 0, t);
	this.x = i;
	this.s = void 0;
	this.g = d$1 - 1;
	this.f = 4;
}
p$1.prototype = new l$2();
p$1.prototype.h = function() {
	this.f &= -3;
	if (1 & this.f) return !1;
	if (32 == (36 & this.f)) return !0;
	this.f &= -5;
	if (this.g === d$1) return !0;
	this.g = d$1;
	this.f |= 1;
	if (this.i > 0 && !w(this)) {
		this.f &= -2;
		return !0;
	}
	var i = o$4;
	try {
		_(this);
		o$4 = this;
		var t = this.x();
		if (16 & this.f || this.v !== t || 0 === this.i) {
			this.v = t;
			this.f &= -17;
			this.i++;
		}
	} catch (i) {
		this.v = i;
		this.f |= 16;
		this.i++;
	}
	o$4 = i;
	b(this);
	this.f &= -2;
	return !0;
};
p$1.prototype.S = function(i) {
	if (void 0 === this.t) {
		this.f |= 36;
		for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
	}
	l$2.prototype.S.call(this, i);
};
p$1.prototype.U = function(i) {
	if (void 0 !== this.t) {
		l$2.prototype.U.call(this, i);
		if (void 0 === this.t) {
			this.f &= -33;
			for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
		}
	}
};
p$1.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
	}
};
Object.defineProperty(p$1.prototype, "value", { get: function() {
	if (1 & this.f) throw new Error("Cycle detected");
	var i = a$1(this);
	this.h();
	if (void 0 !== i) i.i = this.i;
	if (16 & this.f) throw this.v;
	return this.v;
} });
function g(i, t) {
	return new p$1(i, t);
}
function S(i) {
	var n = i.m;
	i.m = void 0;
	if ("function" == typeof n) {
		v$1++;
		var r = o$4;
		o$4 = void 0;
		try {
			n();
		} catch (t) {
			i.f &= -2;
			i.f |= 8;
			m$1(i);
			throw t;
		} finally {
			o$4 = r;
			t$3();
		}
	}
}
function m$1(i) {
	for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
	i.x = void 0;
	i.s = void 0;
	S(i);
}
function x(i) {
	if (o$4 !== this) throw new Error("Out-of-order effect");
	b(this);
	o$4 = i;
	this.f &= -2;
	if (8 & this.f) m$1(this);
	t$3();
}
function E(i, t) {
	this.x = i;
	this.m = void 0;
	this.s = void 0;
	this.u = void 0;
	this.f = 32;
	this.name = null == t ? void 0 : t.name;
	if (r$2) r$2.push(this);
}
E.prototype.c = function() {
	var i = this.S();
	try {
		if (8 & this.f) return;
		if (void 0 === this.x) return;
		var t = this.x();
		if ("function" == typeof t) this.m = t;
	} finally {
		i();
	}
};
E.prototype.S = function() {
	if (1 & this.f) throw new Error("Cycle detected");
	this.f |= 1;
	this.f &= -9;
	S(this);
	_(this);
	v$1++;
	var i = o$4;
	o$4 = this;
	return x.bind(this, i);
};
E.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 2;
		this.u = h$2;
		h$2 = this;
	}
};
E.prototype.d = function() {
	this.f |= 8;
	if (!(1 & this.f)) m$1(this);
};
E.prototype.dispose = function() {
	this.d();
};
function j$1(i, t) {
	var n = new E(i, t);
	try {
		n.c();
	} catch (i) {
		n.d();
		throw i;
	}
	var r = n.d.bind(n);
	r[Symbol.dispose] = r;
	return r;
}
let signalImpl;
let computedImpl;
let effectImpl;
let batchWriteImpl;
let isSignalImpl;
let getValueImpl;
let setValueImpl;
let peekValueImpl;
setSignalImplementation({
	signal: y,
	computed: g,
	effect: j$1,
	batchWrite: n$5,
	isSignal: (val) => !!val && typeof val === "object" && "value" in val && "peek" in val,
	getValue: (signal) => signal.value,
	setValue: (signal, value) => {
		if (!(signal instanceof p$1)) signal.value = value;
	},
	peekValue: (signal) => signal.peek()
});
/**
* Sets the implementations of the various signal-related functions.
* This allows for signal libraries to be swapped out.
*/
function setSignalImplementation(impl) {
	signalImpl = impl.signal;
	computedImpl = impl.computed;
	effectImpl = impl.effect;
	batchWriteImpl = impl.batchWrite;
	isSignalImpl = impl.isSignal;
	getValueImpl = impl.getValue;
	setValueImpl = impl.setValue;
	peekValueImpl = impl.peekValue;
}
function signal(initialValue) {
	return signalImpl(initialValue);
}
function computed(computeFn) {
	return computedImpl(computeFn);
}
function effect(effectFn) {
	return effectImpl(effectFn);
}
function batchWrite(batchFn) {
	return batchWriteImpl(batchFn);
}
function isSignal(val) {
	return isSignalImpl(val);
}
function getValue(signal) {
	return getValueImpl(signal);
}
function setValue(signal, value) {
	setValueImpl(signal, value);
}
function peekValue(signal) {
	return peekValueImpl(signal);
}
/**
* A contextual view of the main DataModel, serving as the unified interface for resolving
* DynamicValues (literals, data paths, function calls) within a specific scope.
*
* Components use `DataContext` instead of interacting with the `DataModel` directly.
* It automatically handles resolving relative paths against the component's current scope
* and provides tools for evaluating complex, reactive expressions.
*/
var DataContext = class DataContext {
	/**
	* Initializes a new DataContext.
	*
	* @param surface The surface model this context belongs to.
	* @param path The absolute path in the DataModel that this context is scoped to (its "current working directory").
	*/
	constructor(surface, path) {
		this.surface = surface;
		this.path = path;
		this.dataModel = surface.dataModel;
		this.functionInvoker = surface.catalog.invoker;
	}
	/**
	* Mutates the underlying DataModel at the specified path.
	*
	* This is the primary method for components to push state changes (e.g. user input)
	* back up to the global model.
	*
	* @param path A JSON pointer path. If relative, it is resolved against this context's `path`.
	* @param value The new value to store in the DataModel.
	*/
	set(path, value) {
		const absolutePath = this.resolvePath(path);
		this.dataModel.set(absolutePath, value);
	}
	/**
	* Checks whether a value (typically an array element) contains any dynamic parts
	* (path bindings or function calls) that require resolution.
	*/
	static containsDynamicValue(value) {
		if (value === null || typeof value !== "object") return false;
		if (Array.isArray(value)) return value.some((item) => DataContext.containsDynamicValue(item));
		return "path" in value || "call" in value;
	}
	/**
	* Synchronously evaluates a `DynamicValue` (a literal, a path binding, or a function call)
	* into its concrete runtime value.
	*
	* **Note:** This method evaluates the value *once* at the current moment in time.
	* It does not create any reactive subscriptions. If the underlying data changes later,
	* this result will not automatically update. Use `subscribeDynamicValue` for reactive updates.
	*
	* @param value The DynamicValue object from the A2UI JSON payload.
	* @returns The synchronously resolved value.
	*/
	resolveDynamicValue(value) {
		if (value === null || typeof value !== "object") return value;
		if (Array.isArray(value)) {
			if (!DataContext.containsDynamicValue(value)) return value;
			return value.map((item) => this.resolveDynamicValue(item));
		}
		if ("path" in value) {
			const absolutePath = this.resolvePath(value.path);
			return this.dataModel.get(absolutePath);
		}
		if ("call" in value) {
			const call = value;
			const args = {};
			for (const [key, argVal] of Object.entries(call.args)) args[key] = this.resolveDynamicValue(argVal);
			const abortController = new AbortController();
			const result = this.evaluateFunctionReactive(call.call, args, abortController.signal);
			if (result === void 0) return;
			return isSignal(result) ? peekValue(result) : result;
		}
		return value;
	}
	/**
	* Reactively listens to changes in a `DynamicValue`.
	*
	* This is the core reactive binding mechanism. Whenever the underlying data changes
	* (or if a function call's dependencies change), the `onChange` callback will be fired
	* with the freshly evaluated result.
	*
	* @template V The expected type of the resolved value.
	* @param value The DynamicValue to evaluate and observe.
	* @param onChange A callback fired whenever the evaluated result changes.
	* @returns A `DataSubscription` containing the initial synchronously-resolved value, along with an `unsubscribe` method to clean up the listener.
	*/
	subscribeDynamicValue(value, onChange) {
		const sig = this.resolveSignal(value);
		let isSync = true;
		let currentValue = peekValue(sig);
		const dispose = effect(() => {
			const val = getValue(sig);
			currentValue = val;
			if (!isSync) onChange(val);
		});
		isSync = false;
		return {
			get value() {
				return currentValue;
			},
			unsubscribe: () => {
				dispose();
				sig.unsubscribe?.();
			}
		};
	}
	/**
	* Returns a Preact Signal representing the reactive dynamic value.
	*
	* This method recursively resolves any nested path bindings or function calls into a
	* single, reactive `Signal`. Any changes to the underlying data or function dependencies
	* will cause this signal's value to update.
	*
	* @param value The DynamicValue to evaluate and observe.
	* @returns A Preact Signal containing the reactive result of the evaluation.
	*/
	resolveSignal(value) {
		if (typeof value !== "object" || value === null) return signal(value);
		if (Array.isArray(value)) {
			if (!DataContext.containsDynamicValue(value)) return signal(value);
			const itemSignals = value.map((item) => this.resolveSignal(item));
			const resultSig = computed(() => itemSignals.map((s) => getValue(s)));
			resultSig.unsubscribe = () => {
				for (const s of itemSignals) s.unsubscribe?.();
			};
			return resultSig;
		}
		if ("path" in value) {
			const absolutePath = this.resolvePath(value.path);
			return this.dataModel.getSignal(absolutePath);
		}
		if ("call" in value) {
			const call = value;
			const argSignals = {};
			for (const [key, argVal] of Object.entries(call.args)) argSignals[key] = this.resolveSignal(argVal);
			if (Object.keys(argSignals).length === 0) {
				const abortController = new AbortController();
				const result = this.evaluateFunctionReactive(call.call, {}, abortController.signal);
				const sig = isSignal(result) ? result : signal(result);
				sig.unsubscribe = () => abortController.abort();
				return sig;
			}
			const keys = Object.keys(argSignals);
			const resultSig = signal(void 0);
			let abortController;
			let innerUnsubscribe;
			const argsSig = computed(() => {
				const argsRecord = {};
				for (let i = 0; i < keys.length; i++) argsRecord[keys[i]] = getValue(argSignals[keys[i]]);
				return argsRecord;
			});
			const stopper = effect(() => {
				try {
					const args = getValue(argsSig);
					if (abortController) abortController.abort();
					if (innerUnsubscribe) {
						innerUnsubscribe();
						innerUnsubscribe = void 0;
					}
					abortController = new AbortController();
					const res = this.evaluateFunctionReactive(call.call, args, abortController.signal);
					if (isSignal(res)) innerUnsubscribe = effect(() => {
						setValue(resultSig, getValue(res));
					});
					else setValue(resultSig, res);
				} catch (e) {
					this.dispatchExpressionError(e, call.call);
					setValue(resultSig, void 0);
				}
			});
			resultSig.unsubscribe = () => {
				stopper();
				if (innerUnsubscribe) innerUnsubscribe();
				if (abortController) abortController.abort();
				for (let i = 0; i < keys.length; i++) argSignals[keys[i]].unsubscribe?.();
			};
			return resultSig;
		}
		return signal(value);
	}
	/**
	* Resolves an action by evaluating its top-level dynamic values.
	*
	* For event actions, it resolves each value in the context map.
	* For function call actions, it evaluates the call.
	*
	* This is non-recursive: it only resolves one level deep for the context record,
	* in accordance with the schema specification that requires values to be single
	* DynamicValue types and prevents arbitrary nesting.
	*/
	resolveAction(action) {
		if ("event" in action) {
			const resolvedContext = {};
			if (action.event.context) for (const [key, value] of Object.entries(action.event.context)) resolvedContext[key] = this.resolveDynamicValue(value);
			return { event: {
				...action.event,
				context: resolvedContext
			} };
		}
		if ("functionCall" in action) return this.resolveDynamicValue(action.functionCall);
		return action;
	}
	evaluateFunctionReactive(name, args, abortSignal) {
		try {
			return this.functionInvoker(name, args, this, abortSignal);
		} catch (e) {
			this.dispatchExpressionError(e, name);
			return;
		}
	}
	dispatchExpressionError(e, name) {
		if (e?.name === "ZodError" || e instanceof ZodError) {
			const err = new A2uiExpressionError(`Validation failed for function '${name}': ${e.message}`, name, e.errors ?? e.issues);
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: err.message,
				expression: name,
				details: err.details
			});
		} else if (e instanceof A2uiExpressionError) this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message,
			expression: e.expression,
			details: e.details
		});
		else this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message ?? `An unexpected error occurred in function ${name}.`,
			expression: name,
			details: { stack: e.stack }
		});
	}
	/**
	* Creates a new, child `DataContext` scoped to a deeper path.
	*
	* This is used when a component (like a List or a Card) wants to provide a targeted
	* data scope for its children, so children can use relative paths like `./title`.
	*
	* @param relativePath The path relative to the *current* context's path.
	* @returns A new `DataContext` instance pointing to the resolved absolute path.
	*/
	nested(relativePath) {
		const newPath = this.resolvePath(relativePath);
		return new DataContext(this.surface, newPath);
	}
	resolvePath(path) {
		if (path.startsWith("/")) return path;
		if (path === "" || path === ".") return this.path;
		let base = this.path;
		if (base.endsWith("/") && base.length > 1) base = base.slice(0, -1);
		if (base === "/") base = "";
		return `${base}/${path}`;
	}
};
/**
* Context provided to components during rendering.
* It provides access to the component's model, the data context, and a way to dispatch actions.
*/
var ComponentContext = class {
	/**
	* Creates a new component context.
	*
	* @param surface The surface model the component belongs to.
	* @param componentId The ID of the component.
	* @param dataModelBasePath The base path for data model access (default: '/').
	*/
	constructor(surface, componentId, dataModelBasePath = "/") {
		const model = surface.componentsModel.get(componentId);
		if (!model) throw new A2uiStateError(`Component not found: ${componentId}`);
		this.componentModel = model;
		this.surfaceComponents = surface.componentsModel;
		this.theme = surface.theme;
		this.dataContext = new DataContext(surface, dataModelBasePath);
		this._actionDispatcher = (action) => surface.dispatchAction(action, this.componentModel.id);
	}
	/**
	* Dispatches an action from the component.
	*
	* @param action The action to dispatch.
	*/
	dispatchAction(action) {
		return this._actionDispatcher(action);
	}
};
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const a = Symbol.for("");
const o$3 = (t) => {
	if (t?.r === a) return t?._$litStatic$;
};
const s$5 = (t) => ({
	_$litStatic$: t,
	r: a
});
const l$1 = /* @__PURE__ */ new Map();
const n$4 = (t) => (r, ...e) => {
	const a = e.length;
	let s, i;
	const n = [], u = [];
	let c, $ = 0, f = !1;
	for (; $ < a;) {
		for (c = r[$]; $ < a && void 0 !== (i = e[$], s = o$3(i));) c += s + r[++$], f = !0;
		$ !== a && u.push(i), n.push(c), $++;
	}
	if ($ === a && n.push(r[a]), f) {
		const t = n.join("$$lit$$");
		void 0 === (r = l$1.get(t)) && (n.raw = n, l$1.set(t, r = n)), e = u;
	}
	return t(r, ...e);
};
const u$2 = n$4(b$1);
/**
* Pure function that acts as a generic container for A2UI components.
*
* It dynamically resolves and renders the specific Lit component implementation
* based on the component type provided in the context, returning a TemplateResult directly
* to avoid duplicate DOM node wrapping.
*
* @param context The component context defining the data model and type to render.
* @param catalog The catalog of component implementations.
* @returns A Lit TemplateResult representing the resolved component, or `nothing` if the component is invalid or unresolvable.
*/
function renderA2uiNode$1(context, catalog) {
	const type = context.componentModel.type;
	const implementation = catalog.components.get(type);
	if (!implementation || !implementation.tagName) {
		console.warn(`Component implementation not found or missing tagName for type: ${type}`);
		return A;
	}
	const tag = s$5(implementation.tagName);
	return u$2`<${tag} .context=${context}></${tag}>`;
}
var __decorate$18 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
* A base class for A2UI Lit elements that manages the A2uiController lifecycle
* and provides Light DOM style adoption and scoping.
*
* By default, elements render into the Light DOM (direct children) to enable
* universal CSS cascade, styling, and cross-framework composition. To opt into
* Shadow DOM encapsulation, subclasses can override `createRenderRoot()` to return
* `super.createRenderRoot()`.
*
* @template Api The specific A2UI component API defining the schema for this element.
* @experimental This class is experimental and subject to change as A2UI transitions
* to the unified Node Layer resolution pipeline.
*/
var A2uiLitElement = class extends i$6 {
	/**
	* The reactive controller instance managing property bindings and state subscriptions.
	*/
	get controller() {
		return this._controller;
	}
	/**
	* Adopts and scopes component CSS rules into the containing document or host shadow root.
	*
	* In Light DOM (the default for A2uiLitElement), the element has no shadow root of its own,
	* so this method locates the nearest enclosing Document or ShadowRoot and adopts the
	* stylesheet once per root, scoping `:host` and descendant selectors to the element's tagName.
	*/
	adoptLightDomStyles() {
		if (typeof document === "undefined") return;
		const root = this.getRootNode();
		const constructor = this.constructor;
		const styles = constructor.styles;
		if (!styles) return;
		const tagName = this.tagName.toLowerCase();
		if (!constructor._processedSheet && constructor._processedCss === void 0) {
			const baseCss = (Array.isArray(styles) ? styles : [styles]).map((s) => s && typeof s === "object" && "cssText" in s ? String(s.cssText) : String(s)).join("\n").replace(/:where\(:host\)/g, `:where(${tagName})`).replace(/:host\(([^)]+)\)/g, `${tagName}$1`).replace(/:host/g, tagName);
			let processedCss = baseCss;
			try {
				const sheet = new CSSStyleSheet();
				sheet.replaceSync(baseCss);
				const scopeRule = (rule) => {
					if (typeof CSSStyleRule !== "undefined" && rule instanceof CSSStyleRule) return `${rule.selectorText.split(",").map((sel) => {
						sel = sel.trim();
						if (sel === tagName || sel.startsWith(tagName + " ") || sel.startsWith(tagName + ".") || sel.startsWith(tagName + ":") || sel.startsWith(tagName + "[") || sel.startsWith(`:where(${tagName}`) || sel.startsWith(`:is(${tagName}`)) return sel;
						return `${tagName} ${sel}`;
					}).join(", ")} { ${rule.style.cssText} }`;
					else if (typeof CSSMediaRule !== "undefined" && rule instanceof CSSMediaRule) {
						const inner = Array.from(rule.cssRules).map(scopeRule).join("\n");
						return `@media ${rule.conditionText} {\n${inner}\n}`;
					}
					return rule.cssText;
				};
				processedCss = Array.from(sheet.cssRules).map(scopeRule).join("\n");
				const scopedSheet = new CSSStyleSheet();
				scopedSheet.replaceSync(processedCss);
				constructor._processedSheet = scopedSheet;
			} catch {}
			constructor._processedCss = processedCss;
			constructor._processedStyle = i$9([processedCss]);
			constructor._adoptedRoots = /* @__PURE__ */ new WeakSet();
		}
		const target = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : document;
		if (target) {
			if (!constructor._adoptedRoots) constructor._adoptedRoots = /* @__PURE__ */ new WeakSet();
			if (!constructor._adoptedRoots.has(target)) {
				constructor._adoptedRoots.add(target);
				if (constructor._processedSheet && target.adoptedStyleSheets) target.adoptedStyleSheets = [...target.adoptedStyleSheets, constructor._processedSheet];
			}
		}
	}
	/**
	* Lifecycle hook invoked when the element is connected to the DOM.
	* Scopes and adopts component styles into the document or host shadow root.
	*/
	connectedCallback() {
		super.connectedCallback();
		this.adoptLightDomStyles();
	}
	/**
	* Instantiates the controller for this element's specific bound API.
	*
	* By default, this creates an `A2uiController` using the instance `api` property.
	* Subclasses can override this method if custom controller initialization is required.
	*
	* @returns A new instance of `A2uiController` matching the component API.
	*/
	createController() {
		if (!this.api) throw new Error(`[A2uiLitElement] Either define 'protected readonly api = ...' on ${this.constructor.name} or override 'createController()'.`);
		return new A2uiController(this, this.api);
	}
	/**
	* Helper method to render a child A2UI node.
	* Abstracts away the need to manually create a ComponentContext.
	*
	* @param childRef The reference to the child component to render. Either a string ID
	*                 or a reference object containing `{id, basePath}`.
	* @param customPath An explicit data model path to bind the child to. If provided,
	*                   this overrides any path defined in the `childRef` object. If omitted,
	*                   falls back to the `childRef`'s `basePath`, or the current component's path.
	*
	* @returns A Lit template result containing the rendered child component, or `nothing` if the reference is empty.
	*/
	renderNode(childRef, customPath) {
		if (!childRef) return A;
		const { surface, path: parentPath } = this.context.dataContext;
		if (!!!surface.componentsModel?.get(this.context.componentModel.id)) return A;
		let componentId;
		let path = customPath;
		if (typeof childRef === "object") {
			componentId = childRef.id || childRef.componentId;
			path = path ?? childRef.basePath ?? childRef.path;
		} else componentId = childRef;
		if (!componentId || !surface.componentsModel?.get(componentId)) return A;
		path = path ?? parentPath;
		return renderA2uiNode$1(new ComponentContext(surface, componentId, path), surface.catalog);
	}
	/**
	* Reacts to changes in the component's properties.
	*
	* Specifically, when the `context` property changes or is initialized, this method
	* cleans up any existing controller and invokes `createController()` to bind to
	* the new context.
	*
	* @param changedProperties Map of changed properties with their previous values.
	*/
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has("context") && this.context) {
			if (this._controller) {
				this.removeController(this._controller);
				this._controller.dispose();
			}
			this._controller = this.createController();
		}
	}
	update(changedProperties) {
		if (!this._controller) return;
		super.update(changedProperties);
	}
};
__decorate$18([n$7({ type: Object })], A2uiLitElement.prototype, "context", void 0);
/**
* Internal implementation used by the model.
* Implements EventSource but also provides the 'emit' method.
*/
var EventEmitter = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
	}
	/**
	* Subscribes to the event.
	*
	* @param listener The listener function to call when the event is emitted.
	* @returns A subscription object that can be used to unsubscribe.
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return { unsubscribe: () => this.listeners.delete(listener) };
	}
	/**
	* Emits an event to all subscribers.
	*
	* @param data The data to pass to subscribers.
	*/
	async emit(data) {
		for (const listener of this.listeners) try {
			await listener(data);
		} catch (e) {
			console.error("EventEmitter error:", e);
		}
	}
	/**
	* Removes all listeners.
	*/
	dispose() {
		this.listeners.clear();
	}
};
function isNumeric(value) {
	return /^(0|[1-9]\d*)$/.test(value);
}
/**
* Keys forbidden in path resolution to prevent prototype pollution
* vulnerabilities. Accessing or mutating these keys via object paths can allow
* attackers to modify Object.prototype or Function.prototype.
*/
const FORBIDDEN_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
/**
* A standalone, observable data store representing the client-side state.
* It handles JSON Pointer path resolution and subscription management.
*/
var DataModel = class {
	/**
	* Creates a new data model.
	*
	* @param initialData The initial data for the model. Defaults to an empty
	*     object.
	*/
	constructor(initialData = {}) {
		this.data = {};
		this.signals = /* @__PURE__ */ new Map();
		this.subscriptions = /* @__PURE__ */ new Set();
		this.data = initialData;
	}
	/**
	* Retrieves a Preact Signal for a specific data path.
	*
	* This provides a reactive way to access a value. If the value at the path
	* changes via `set()`, the signal will automatically be updated.
	*
	* @param path The JSON pointer path to create or retrieve a signal for.
	* @returns A Preact Signal representing the value at the specified path.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	getSignal(path) {
		const normalizedPath = this.normalizePath(path);
		if (!this.signals.has(normalizedPath)) this.signals.set(normalizedPath, signal(this.get(normalizedPath)));
		return this.signals.get(normalizedPath);
	}
	/**
	* Updates the model at the specific path and notifies all relevant signals.
	* If path is '/' or empty, replaces the entire root.
	*
	* Note on `undefined` values:
	* - For objects: Setting a property to `undefined` removes the key from the
	* object.
	* - For arrays: Setting an index to `undefined` sets that index to
	* `undefined` but preserves the array length (sparse array).
	*
	* @param path The JSON pointer path to set value for.
	* @param value The value to set at the specified path.
	* @returns This `DataModel` instance for chaining.
	* @throws {A2uiDataError} If path is null, undefined, invalid for
	*     arrays/primitives, or contains forbidden segments (`__proto__`,
	*     `constructor`, `prototype`).
	*/
	set(path, value) {
		if (path === null || path === void 0) throw new A2uiDataError("Path cannot be null or undefined.");
		if (path === "/" || path === "") {
			this.data = value;
			this.notifyAllSignals();
			return this;
		}
		const segments = this.parsePath(path);
		const lastSegment = segments.pop();
		if (this.data === void 0 || this.data === null) this.data = {};
		else if (typeof this.data !== "object") throw new A2uiDataError(`Cannot set path '${path}': the data model root is a primitive value.`, path);
		let current = this.data;
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (Array.isArray(current)) {
				if (!isNumeric(segment)) throw new A2uiDataError(`Cannot use non-numeric segment '${segment}' on an array in path '${path}'.`, path);
				const index = parseInt(segment, 10);
				const val = current[index];
				if (val !== void 0 && val !== null && typeof val !== "object") throw new A2uiDataError(`Cannot set path '${path}': segment '${segment}' is a primitive value.`, path);
				if (val === void 0 || val === null) {
					const nextSegment = i < segments.length - 1 ? segments[i + 1] : lastSegment;
					current[index] = isNumeric(nextSegment) ? [] : {};
				}
			} else {
				const hasOwnProp = Object.prototype.hasOwnProperty.call(current, segment);
				if (hasOwnProp) {
					const propVal = current[segment];
					if (propVal !== void 0 && propVal !== null && typeof propVal !== "object") throw new A2uiDataError(`Cannot set path '${path}': segment '${segment}' is a primitive value.`, path);
				}
				if (!hasOwnProp || current[segment] === void 0 || current[segment] === null) {
					const nextSegment = i < segments.length - 1 ? segments[i + 1] : lastSegment;
					current[segment] = isNumeric(nextSegment) ? [] : {};
				}
			}
			current = current[segment];
		}
		if (Array.isArray(current) && !isNumeric(lastSegment)) throw new A2uiDataError(`Cannot use non-numeric segment '${lastSegment}' on an array in path '${path}'.`, path);
		if (value === void 0) {
			if (Array.isArray(current)) current[parseInt(lastSegment, 10)] = void 0;
			else delete current[lastSegment];
		} else current[lastSegment] = value;
		this.notifySignals(path);
		return this;
	}
	/**
	* Retrieves data at a specific JSON pointer path.
	*
	* @param path The JSON pointer path to read from.
	* @returns The value at the specified path, or undefined if not found.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	get(path) {
		if (path === null || path === void 0) throw new A2uiDataError("Path cannot be null or undefined.");
		if (path === "/" || path === "") return this.data;
		const segments = this.parsePath(path);
		let current = this.data;
		for (const segment of segments) {
			if (current === void 0 || current === null || typeof current !== "object") return;
			if (Array.isArray(current)) {
				if (!isNumeric(segment)) return;
				const index = parseInt(segment, 10);
				if (index < 0 || index >= current.length) return;
				current = current[index];
			} else {
				if (!Object.prototype.hasOwnProperty.call(current, segment)) return;
				current = current[segment];
			}
		}
		return current;
	}
	/**
	* Subscribes to changes at the specified data path.
	*
	* This is a backwards-compatible layer using Preact Signals internally. It
	* allows listeners to be notified whenever the value at the specified path
	* (or any of its ancestors/descendants) changes.
	*
	* @param path The JSON pointer path to observe.
	* @param onChange A callback fired whenever the value changes.
	* @returns A `DataSubscription` containing the initial value and an
	*     `unsubscribe` method.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	subscribe(path, onChange) {
		const sig = this.getSignal(path);
		let isSync = true;
		let currentValue = peekValue(sig);
		const dispose = effect(() => {
			const val = getValue(sig);
			currentValue = val;
			if (!isSync) onChange(val);
		});
		isSync = false;
		this.subscriptions.add(dispose);
		return {
			get value() {
				return currentValue;
			},
			unsubscribe: () => {
				dispose();
				this.subscriptions.delete(dispose);
			}
		};
	}
	/**
	* Clears all internal subscriptions.
	*/
	dispose() {
		for (const dispose of this.subscriptions) dispose();
		this.subscriptions.clear();
		this.signals.clear();
	}
	normalizePath(path) {
		if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
		return path || "/";
	}
	parsePath(path) {
		return path.split("/").filter((p) => p.length > 0).map((rawSegment) => {
			const segment = rawSegment.replace(/~([01])/g, (_, g) => g === "1" ? "/" : "~");
			if (FORBIDDEN_KEYS.has(segment)) throw new A2uiDataError(`Forbidden path segment '${segment}' in path '${path}'.`, path);
			return segment;
		});
	}
	notifySignals(path) {
		const normalizedPath = this.normalizePath(path);
		batchWrite(() => {
			this.updateSignal(normalizedPath);
			let parentPath = normalizedPath;
			while (parentPath !== "/" && parentPath !== "") {
				parentPath = parentPath.substring(0, parentPath.lastIndexOf("/")) || "/";
				this.updateSignal(parentPath);
			}
			for (const subPath of this.signals.keys()) if (this.isDescendant(subPath, normalizedPath)) this.updateSignal(subPath);
		});
	}
	updateSignal(path) {
		const sig = this.signals.get(path);
		if (sig) {
			const val = this.get(path);
			if (Array.isArray(val)) setValue(sig, [...val]);
			else if (typeof val === "object" && val !== null) setValue(sig, { ...val });
			else setValue(sig, val);
		}
	}
	notifyAllSignals() {
		batchWrite(() => {
			for (const path of this.signals.keys()) this.updateSignal(path);
		});
	}
	isDescendant(childPath, parentPath) {
		if (parentPath === "/" || parentPath === "") return childPath !== "/";
		return childPath.startsWith(parentPath + "/");
	}
};
/**
* Manages the collection of components for a specific surface.
*/
var SurfaceComponentsModel = class {
	constructor() {
		this.components = /* @__PURE__ */ new Map();
		this._onCreated = new EventEmitter();
		this._onDeleted = new EventEmitter();
		/** Fires when a new component is added to the model. */
		this.onCreated = this._onCreated;
		/** Fires when a component is removed, providing the ID of the deleted component. */
		this.onDeleted = this._onDeleted;
	}
	/**
	* Retrieves a component by its ID.
	*
	*
	* @param id The ID of the component to retrieve.
	* @returns The component model, or undefined if not found.
	*/
	get(id) {
		return this.components.get(id);
	}
	/**
	* Returns an iterator over the components in the model.
	*/
	get entries() {
		return this.components.entries();
	}
	/**
	* Adds a component to the model.
	* Throws an error if a component with the same ID already exists.
	*
	* @param component The component to add.
	*/
	addComponent(component) {
		if (this.components.has(component.id)) throw new A2uiStateError(`Component with id '${component.id}' already exists.`);
		this.components.set(component.id, component);
		this._onCreated.emit(component);
	}
	/**
	* Removes a component from the model by its ID.
	* Disposes of the component upon removal.
	*
	* @param id The ID of the component to remove.
	*/
	removeComponent(id) {
		const component = this.components.get(id);
		if (component) {
			this.components.delete(id);
			component.dispose();
			this._onDeleted.emit(id);
		}
	}
	/**
	* Disposes of the model and all its components.
	*/
	dispose() {
		for (const component of this.components.values()) component.dispose();
		this.components.clear();
		this._onCreated.dispose();
		this._onDeleted.dispose();
	}
};
/**
* Reports a user-initiated action from a component.
* Matches 'action' in specification/v0_9/json/client_to_server.json.
*/
const A2uiClientActionSchema = objectType({
	name: stringType().describe("The name of the action, taken from the component's action.event.name property."),
	surfaceId: stringType().describe("The id of the surface where the event originated."),
	sourceComponentId: stringType().describe("The id of the component that triggered the event."),
	timestamp: stringType().datetime().describe("An ISO 8601 timestamp of when the event occurred."),
	context: recordType(anyType()).describe("A JSON object containing the key-value pairs from the component's action.event.context, after resolving all data bindings.")
}).strict();
/**
* Reports a client-side error.
* Matches 'error' in specification/v0_9/json/client_to_server.json.
*/
const A2uiClientErrorSchema = unionType([objectType({
	code: literalType("VALIDATION_FAILED"),
	surfaceId: stringType().describe("The id of the surface where the error occurred."),
	path: stringType().describe("The JSON pointer to the field that failed validation (e.g. '/components/0/text')."),
	message: stringType().describe("A short one or two sentence description of why validation failed.")
}).strict(), objectType({
	code: stringType().refine((c) => c !== "VALIDATION_FAILED"),
	message: stringType().describe("A short one or two sentence description of why the error occurred."),
	surfaceId: stringType().describe("The id of the surface where the error occurred.")
}).passthrough()]);
/**
* A message sent from the A2UI client to the server.
* Matches specification/v0_9/json/client_to_server.json.
*/
const A2uiClientMessageSchema = objectType({ version: enumType(["v0.9", "v0.9.1"]) }).and(unionType([objectType({ action: A2uiClientActionSchema }), objectType({ error: A2uiClientErrorSchema })]));
objectType({
	version: enumType(["v0.9", "v0.9.1"]),
	surfaces: recordType(objectType({}).passthrough()).describe("A map of surface IDs to their current data models.")
}).strict();
objectType({ messages: arrayType(A2uiClientMessageSchema).describe("A list of client messages.") }).strict().describe("An object wrapping a list of client messages.");
/**
* The state model for a single UI surface.
*
* A surface is the root container for a set of components and their associated data.
* It coordinates data binding, component state, and action dispatching.
*
* @template T The concrete type of the ComponentApi from the catalog.
* @template F The catalog's function kind. Every state and messaging
*   capability of the surface works with a schema-only catalog
*   (`SurfaceModel<T, FunctionApi>`); only node-tree resolution needs
*   implementations.
*/
var SurfaceModel = class {
	/**
	* Creates a new surface model.
	*
	* @param id The unique identifier for this surface.
	* @param catalog The component catalog used by this surface.
	* @param theme The theme to apply to this surface.
	* @param sendDataModel If true, the client will send the full data model.
	*/
	constructor(id, catalog, theme = {}, sendDataModel = false) {
		this.id = id;
		this.catalog = catalog;
		this.theme = theme;
		this.sendDataModel = sendDataModel;
		this._onAction = new EventEmitter();
		this._onError = new EventEmitter();
		/** Fires whenever an action is dispatched from this surface. */
		this.onAction = this._onAction;
		/** Fires whenever an error occurs on this surface. */
		this.onError = this._onError;
		this.dataModel = new DataModel({});
		this.componentsModel = new SurfaceComponentsModel();
	}
	/**
	* Dispatches an action from this surface to listeners.
	*
	* @param payload The action payload (name and context) to dispatch.
	* @param sourceComponentId The ID of the component that triggered the action.
	*/
	async dispatchAction(payload, sourceComponentId) {
		if (payload && typeof payload === "object" && "event" in payload && payload.event) {
			const actionToValidate = {
				name: payload.event.name,
				surfaceId: this.id,
				sourceComponentId,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				context: payload.event.context || {}
			};
			const validationResult = A2uiClientActionSchema.safeParse(actionToValidate);
			if (validationResult.success) await this._onAction.emit(validationResult.data);
			else console.error("A2UI: Invalid action payload dispatched.", validationResult.error.format());
		}
	}
	/**
	* Dispatches an error from this surface to listeners.
	*
	* @param error The error object to dispatch, conforming to client_to_server schema.
	*/
	async dispatchError(error) {
		await this._onError.emit({
			...error,
			surfaceId: this.id
		});
	}
	/**
	* Disposes of the surface and its resources.
	*/
	dispose() {
		this.dataModel.dispose();
		this.componentsModel.dispose();
		this._onAction.dispose();
		this._onError.dispose();
	}
};
/**
* The root state model for the A2UI system.
* Manages the collection of active surfaces.
*/
var SurfaceGroupModel = class {
	constructor() {
		this.surfaces = /* @__PURE__ */ new Map();
		this.surfaceUnsubscribers = /* @__PURE__ */ new Map();
		this._onSurfaceCreated = new EventEmitter();
		this._onSurfaceDeleted = new EventEmitter();
		this._onAction = new EventEmitter();
		/** Fires when a new surface is added. */
		this.onSurfaceCreated = this._onSurfaceCreated;
		/** Fires when a surface is removed. */
		this.onSurfaceDeleted = this._onSurfaceDeleted;
		/** Fires when an action is dispatched from ANY surface in the group. */
		this.onAction = this._onAction;
	}
	/**
	* Adds a surface to the group.
	* Ignores if a surface with the same ID already exists.
	*
	* @param surface The surface model to add.
	*/
	addSurface(surface) {
		if (this.surfaces.has(surface.id)) {
			console.warn(`Surface ${surface.id} already exists. Ignoring.`);
			return;
		}
		this.surfaces.set(surface.id, surface);
		const sub = surface.onAction.subscribe((action) => this._onAction.emit(action));
		this.surfaceUnsubscribers.set(surface.id, sub);
		this._onSurfaceCreated.emit(surface);
	}
	/**
	* Removes a surface from the group by its ID.
	* Disposes of the surface upon removal.
	*
	* @param id The ID of the surface to remove.
	*/
	deleteSurface(id) {
		const surface = this.surfaces.get(id);
		if (surface) {
			const sub = this.surfaceUnsubscribers.get(id);
			if (sub) {
				sub.unsubscribe();
				this.surfaceUnsubscribers.delete(id);
			}
			this.surfaces.delete(id);
			surface.dispose();
			this._onSurfaceDeleted.emit(id);
		}
	}
	/**
	* Retrieves a surface by its ID.
	*
	*
	* @param id The ID of the surface to retrieve.
	* @returns The surface model, or undefined if not found.
	*/
	getSurface(id) {
		return this.surfaces.get(id);
	}
	/**
	* Returns a readonly map of all active surfaces.
	*/
	get surfacesMap() {
		return this.surfaces;
	}
	/**
	* Disposes of the group and all its surfaces.
	*/
	dispose() {
		for (const id of Array.from(this.surfaces.keys())) this.deleteSurface(id);
		this._onSurfaceCreated.dispose();
		this._onSurfaceDeleted.dispose();
		this._onAction.dispose();
	}
};
/**
* Represents the state model for an individual UI component.
*/
var ComponentModel = class {
	/**
	* Creates a new component model.
	*
	* @param id The unique identifier for this component.
	* @param type The component type name.
	* @param initialProperties The initial properties for the component.
	*/
	constructor(id, type, initialProperties) {
		this.id = id;
		this.type = type;
		this._onUpdated = new EventEmitter();
		/**
		* Fires whenever the component's properties are updated.
		*/
		this.onUpdated = this._onUpdated;
		this._properties = initialProperties;
	}
	/**
	* The current properties of the component.
	*/
	get properties() {
		return this._properties;
	}
	set properties(newProperties) {
		this._properties = newProperties;
		this._onUpdated.emit(this);
	}
	/**
	* Disposes of the component and its resources.
	*/
	dispose() {
		this._onUpdated.dispose();
	}
	/**
	* Returns a JSON representation of the component tree.
	*/
	get componentTree() {
		return {
			id: this.id,
			type: this.type,
			...this._properties
		};
	}
};
const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions$1 = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: true,
	rejectedAdditionalProperties: false,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: false,
	definitions: {},
	errorMessages: false,
	markdownDescription: false,
	patternStrategy: "escape",
	applyRegexFlags: false,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
};
const getDefaultOptions$2 = (options) => typeof options === "string" ? {
	...defaultOptions$1,
	name: options
} : {
	...defaultOptions$1,
	...options
};
const getRefs = (options) => {
	const _options = getDefaultOptions$2(options);
	const currentPath = _options.name !== void 0 ? [
		..._options.basePath,
		_options.definitionPath,
		_options.name
	] : _options.basePath;
	return {
		..._options,
		flags: { hasReferencedOpenAiAnyType: false },
		currentPath,
		propertyPath: void 0,
		seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [def._def, {
			def: def._def,
			path: [
				..._options.basePath,
				_options.definitionPath,
				name
			],
			jsonSchema: void 0
		}]))
	};
};
function addErrorMessage(res, key, errorMessage, refs) {
	if (!refs?.errorMessages) return;
	if (errorMessage) res.errorMessage = {
		...res.errorMessage,
		[key]: errorMessage
	};
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
	res[key] = value;
	addErrorMessage(res, key, errorMessage, refs);
}
const getRelativePath = (pathA, pathB) => {
	let i = 0;
	for (; i < pathA.length && i < pathB.length; i++) if (pathA[i] !== pathB[i]) break;
	return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
function parseAnyDef(refs) {
	if (refs.target !== "openAi") return {};
	const anyDefinitionPath = [
		...refs.basePath,
		refs.definitionPath,
		refs.openAiAnyTypeName
	];
	refs.flags.hasReferencedOpenAiAnyType = true;
	return { $ref: refs.$refStrategy === "relative" ? getRelativePath(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/") };
}
function parseArrayDef(def, refs) {
	const res = { type: "array" };
	if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) res.items = parseDef(def.type._def, {
		...refs,
		currentPath: [...refs.currentPath, "items"]
	});
	if (def.minLength) setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
	if (def.maxLength) setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
	if (def.exactLength) {
		setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
		setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
	}
	return res;
}
function parseBigintDef(def, refs) {
	const res = {
		type: "integer",
		format: "int64"
	};
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
function parseBooleanDef() {
	return { type: "boolean" };
}
function parseBrandedDef(_def, refs) {
	return parseDef(_def.type._def, refs);
}
const parseCatchDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
function parseDateDef(def, refs, overrideDateStrategy) {
	const strategy = overrideDateStrategy ?? refs.dateStrategy;
	if (Array.isArray(strategy)) return { anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)) };
	switch (strategy) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return integerDateParser(def, refs);
	}
}
const integerDateParser = (def, refs) => {
	const res = {
		type: "integer",
		format: "unix-time"
	};
	if (refs.target === "openApi3") return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			break;
		case "max": setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
	}
	return res;
};
function parseDefaultDef(_def, refs) {
	return {
		...parseDef(_def.innerType._def, refs),
		default: _def.defaultValue()
	};
}
function parseEffectsDef(_def, refs) {
	return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef(refs);
}
function parseEnumDef(def) {
	return {
		type: "string",
		enum: Array.from(def.values)
	};
}
const isJsonSchema7AllOfType = (type) => {
	if ("type" in type && type.type === "string") return false;
	return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
	const allOf = [parseDef(def.left._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	}), parseDef(def.right._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"1"
		]
	})].filter((x) => !!x);
	let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
	const mergedAllOf = [];
	allOf.forEach((schema) => {
		if (isJsonSchema7AllOfType(schema)) {
			mergedAllOf.push(...schema.allOf);
			if (schema.unevaluatedProperties === void 0) unevaluatedProperties = void 0;
		} else {
			let nestedSchema = schema;
			if ("additionalProperties" in schema && schema.additionalProperties === false) {
				const { additionalProperties, ...rest } = schema;
				nestedSchema = rest;
			} else unevaluatedProperties = void 0;
			mergedAllOf.push(nestedSchema);
		}
	});
	return mergedAllOf.length ? {
		allOf: mergedAllOf,
		...unevaluatedProperties
	} : void 0;
}
function parseLiteralDef(def, refs) {
	const parsedType = typeof def.value;
	if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") return { type: Array.isArray(def.value) ? "array" : "object" };
	if (refs.target === "openApi3") return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		enum: [def.value]
	};
	return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		const: def.value
	};
}
let emojiRegex = void 0;
/**
* Generated from the regular expressions found here as of 2024-05-22:
* https://github.com/colinhacks/zod/blob/master/src/types.ts.
*
* Expressions with /i flag have been changed accordingly.
*/
const zodPatterns = {
	/**
	* `c` was changed to `[cC]` to replicate /i flag
	*/
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	/**
	* `a-z` was added to replicate /i flag
	*/
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	/**
	* Constructed a valid Unicode RegExp
	*
	* Lazily instantiate since this type of regex isn't supported
	* in all envs (e.g. React Native).
	*
	* See:
	* https://github.com/colinhacks/zod/issues/2433
	* Fix in Zod:
	* https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
	*/
	emoji: () => {
		if (emojiRegex === void 0) emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
		return emojiRegex;
	},
	/**
	* Unused
	*/
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	/**
	* Unused
	*/
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	/**
	* Unused
	*/
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
	const res = { type: "string" };
	if (def.checks) for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			break;
		case "max":
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "email":
			switch (refs.emailStrategy) {
				case "format:email":
					addFormat(res, "email", check.message, refs);
					break;
				case "format:idn-email":
					addFormat(res, "idn-email", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.email, check.message, refs);
			}
			break;
		case "url":
			addFormat(res, "uri", check.message, refs);
			break;
		case "uuid":
			addFormat(res, "uuid", check.message, refs);
			break;
		case "regex":
			addPattern(res, check.regex, check.message, refs);
			break;
		case "cuid":
			addPattern(res, zodPatterns.cuid, check.message, refs);
			break;
		case "cuid2":
			addPattern(res, zodPatterns.cuid2, check.message, refs);
			break;
		case "startsWith":
			addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
			break;
		case "endsWith":
			addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
			break;
		case "datetime":
			addFormat(res, "date-time", check.message, refs);
			break;
		case "date":
			addFormat(res, "date", check.message, refs);
			break;
		case "time":
			addFormat(res, "time", check.message, refs);
			break;
		case "duration":
			addFormat(res, "duration", check.message, refs);
			break;
		case "length":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "includes":
			addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
			break;
		case "ip":
			if (check.version !== "v6") addFormat(res, "ipv4", check.message, refs);
			if (check.version !== "v4") addFormat(res, "ipv6", check.message, refs);
			break;
		case "base64url":
			addPattern(res, zodPatterns.base64url, check.message, refs);
			break;
		case "jwt":
			addPattern(res, zodPatterns.jwt, check.message, refs);
			break;
		case "cidr":
			if (check.version !== "v6") addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
			if (check.version !== "v4") addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
			break;
		case "emoji":
			addPattern(res, zodPatterns.emoji(), check.message, refs);
			break;
		case "ulid":
			addPattern(res, zodPatterns.ulid, check.message, refs);
			break;
		case "base64":
			switch (refs.base64Strategy) {
				case "format:binary":
					addFormat(res, "binary", check.message, refs);
					break;
				case "contentEncoding:base64":
					setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.base64, check.message, refs);
			}
			break;
		case "nanoid": addPattern(res, zodPatterns.nanoid, check.message, refs);
	}
	return res;
}
function escapeLiteralCheckValue(literal, refs) {
	return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
const ALPHA_NUMERIC = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
	let result = "";
	for (let i = 0; i < source.length; i++) {
		if (!ALPHA_NUMERIC.has(source[i])) result += "\\";
		result += source[i];
	}
	return result;
}
function addFormat(schema, value, message, refs) {
	if (schema.format || schema.anyOf?.some((x) => x.format)) {
		if (!schema.anyOf) schema.anyOf = [];
		if (schema.format) {
			schema.anyOf.push({
				format: schema.format,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { format: schema.errorMessage.format } }
			});
			delete schema.format;
			if (schema.errorMessage) {
				delete schema.errorMessage.format;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.anyOf.push({
			format: value,
			...message && refs.errorMessages && { errorMessage: { format: message } }
		});
	} else setResponseValueAndErrors(schema, "format", value, message, refs);
}
function addPattern(schema, regex, message, refs) {
	if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
		if (!schema.allOf) schema.allOf = [];
		if (schema.pattern) {
			schema.allOf.push({
				pattern: schema.pattern,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { pattern: schema.errorMessage.pattern } }
			});
			delete schema.pattern;
			if (schema.errorMessage) {
				delete schema.errorMessage.pattern;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.allOf.push({
			pattern: stringifyRegExpWithFlags(regex, refs),
			...message && refs.errorMessages && { errorMessage: { pattern: message } }
		});
	} else setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
}
function stringifyRegExpWithFlags(regex, refs) {
	if (!refs.applyRegexFlags || !regex.flags) return regex.source;
	const flags = {
		i: regex.flags.includes("i"),
		m: regex.flags.includes("m"),
		s: regex.flags.includes("s")
	};
	const source = flags.i ? regex.source.toLowerCase() : regex.source;
	let pattern = "";
	let isEscaped = false;
	let inCharGroup = false;
	let inCharRange = false;
	for (let i = 0; i < source.length; i++) {
		if (isEscaped) {
			pattern += source[i];
			isEscaped = false;
			continue;
		}
		if (flags.i) {
			if (inCharGroup) {
				if (source[i].match(/[a-z]/)) {
					if (inCharRange) {
						pattern += source[i];
						pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
						inCharRange = false;
					} else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
						pattern += source[i];
						inCharRange = true;
					} else pattern += `${source[i]}${source[i].toUpperCase()}`;
					continue;
				}
			} else if (source[i].match(/[a-z]/)) {
				pattern += `[${source[i]}${source[i].toUpperCase()}]`;
				continue;
			}
		}
		if (flags.m) {
			if (source[i] === "^") {
				pattern += `(^|(?<=[\r\n]))`;
				continue;
			} else if (source[i] === "$") {
				pattern += `($|(?=[\r\n]))`;
				continue;
			}
		}
		if (flags.s && source[i] === ".") {
			pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
			continue;
		}
		pattern += source[i];
		if (source[i] === "\\") isEscaped = true;
		else if (inCharGroup && source[i] === "]") inCharGroup = false;
		else if (!inCharGroup && source[i] === "[") inCharGroup = true;
	}
	try {
		new RegExp(pattern);
	} catch {
		console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
		return regex.source;
	}
	return pattern;
}
function parseRecordDef(def, refs) {
	if (refs.target === "openAi") console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
	if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		type: "object",
		required: def.keyType._def.values,
		properties: def.keyType._def.values.reduce((acc, key) => ({
			...acc,
			[key]: parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"properties",
					key
				]
			}) ?? parseAnyDef(refs)
		}), {}),
		additionalProperties: refs.rejectedAdditionalProperties
	};
	const schema = {
		type: "object",
		additionalProperties: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalProperties"]
		}) ?? refs.allowedAdditionalProperties
	};
	if (refs.target === "openApi3") return schema;
	if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
		const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	} else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		...schema,
		propertyNames: { enum: def.keyType._def.values }
	};
	else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
		const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	}
	return schema;
}
function parseMapDef(def, refs) {
	if (refs.mapStrategy === "record") return parseRecordDef(def, refs);
	return {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [parseDef(def.keyType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"0"
				]
			}) || parseAnyDef(refs), parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"1"
				]
			}) || parseAnyDef(refs)],
			minItems: 2,
			maxItems: 2
		}
	};
}
function parseNativeEnumDef(def) {
	const object = def.values;
	const actualValues = Object.keys(def.values).filter((key) => {
		return typeof object[object[key]] !== "number";
	}).map((key) => object[key]);
	const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
	return {
		type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: actualValues
	};
}
function parseNeverDef(refs) {
	return refs.target === "openAi" ? void 0 : { not: parseAnyDef({
		...refs,
		currentPath: [...refs.currentPath, "not"]
	}) };
}
function parseNullDef(refs) {
	return refs.target === "openApi3" ? {
		enum: ["null"],
		nullable: true
	} : { type: "null" };
}
const primitiveMappings = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function parseUnionDef(def, refs) {
	if (refs.target === "openApi3") return asAnyOf(def, refs);
	const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
	if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
		const types = options.reduce((types, x) => {
			const type = primitiveMappings[x._def.typeName];
			return type && !types.includes(type) ? [...types, type] : types;
		}, []);
		return { type: types.length > 1 ? types : types[0] };
	} else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
		const types = options.reduce((acc, x) => {
			const type = typeof x._def.value;
			switch (type) {
				case "string":
				case "number":
				case "boolean": return [...acc, type];
				case "bigint": return [...acc, "integer"];
				case "object": if (x._def.value === null) return [...acc, "null"];
				default: return acc;
			}
		}, []);
		if (types.length === options.length) {
			const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
			return {
				type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
				enum: options.reduce((acc, x) => {
					return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
				}, [])
			};
		}
	} else if (options.every((x) => x._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: options.reduce((acc, x) => [...acc, ...x._def.values.filter((x) => !acc.includes(x))], [])
	};
	return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
	const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			`${i}`
		]
	})).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
	return anyOf.length ? { anyOf } : void 0;
};
function parseNullableDef(def, refs) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
		if (refs.target === "openApi3") return {
			type: primitiveMappings[def.innerType._def.typeName],
			nullable: true
		};
		return { type: [primitiveMappings[def.innerType._def.typeName], "null"] };
	}
	if (refs.target === "openApi3") {
		const base = parseDef(def.innerType._def, {
			...refs,
			currentPath: [...refs.currentPath]
		});
		if (base && "$ref" in base) return {
			allOf: [base],
			nullable: true
		};
		return base && {
			...base,
			nullable: true
		};
	}
	const base = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"0"
		]
	});
	return base && { anyOf: [base, { type: "null" }] };
}
function parseNumberDef(def, refs) {
	const res = { type: "number" };
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "int":
			res.type = "integer";
			addErrorMessage(res, "type", check.message, refs);
			break;
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
function parseObjectDef(def, refs) {
	const forceOptionalIntoNullable = refs.target === "openAi";
	const result = {
		type: "object",
		properties: {}
	};
	const required = [];
	const shape = def.shape();
	for (const propName in shape) {
		let propDef = shape[propName];
		if (propDef === void 0 || propDef._def === void 0) continue;
		let propOptional = safeIsOptional(propDef);
		if (propOptional && forceOptionalIntoNullable) {
			if (propDef._def.typeName === "ZodOptional") propDef = propDef._def.innerType;
			if (!propDef.isNullable()) propDef = propDef.nullable();
			propOptional = false;
		}
		const parsedDef = parseDef(propDef._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"properties",
				propName
			],
			propertyPath: [
				...refs.currentPath,
				"properties",
				propName
			]
		});
		if (parsedDef === void 0) continue;
		result.properties[propName] = parsedDef;
		if (!propOptional) required.push(propName);
	}
	if (required.length) result.required = required;
	const additionalProperties = decideAdditionalProperties(def, refs);
	if (additionalProperties !== void 0) result.additionalProperties = additionalProperties;
	return result;
}
function decideAdditionalProperties(def, refs) {
	if (def.catchall._def.typeName !== "ZodNever") return parseDef(def.catchall._def, {
		...refs,
		currentPath: [...refs.currentPath, "additionalProperties"]
	});
	switch (def.unknownKeys) {
		case "passthrough": return refs.allowedAdditionalProperties;
		case "strict": return refs.rejectedAdditionalProperties;
		case "strip": return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
	}
}
function safeIsOptional(schema) {
	try {
		return schema.isOptional();
	} catch {
		return true;
	}
}
const parseOptionalDef = (def, refs) => {
	if (refs.currentPath.toString() === refs.propertyPath?.toString()) return parseDef(def.innerType._def, refs);
	const innerSchema = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"1"
		]
	});
	return innerSchema ? { anyOf: [{ not: parseAnyDef(refs) }, innerSchema] } : parseAnyDef(refs);
};
const parsePipelineDef = (def, refs) => {
	if (refs.pipeStrategy === "input") return parseDef(def.in._def, refs);
	else if (refs.pipeStrategy === "output") return parseDef(def.out._def, refs);
	const a = parseDef(def.in._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [a, parseDef(def.out._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			a ? "1" : "0"
		]
	})].filter((x) => x !== void 0) };
};
function parsePromiseDef(def, refs) {
	return parseDef(def.type._def, refs);
}
function parseSetDef(def, refs) {
	const schema = {
		type: "array",
		uniqueItems: true,
		items: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "items"]
		})
	};
	if (def.minSize) setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
	if (def.maxSize) setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
	return schema;
}
function parseTupleDef(def, refs) {
	if (def.rest) return {
		type: "array",
		minItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
		additionalItems: parseDef(def.rest._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalItems"]
		})
	};
	else return {
		type: "array",
		minItems: def.items.length,
		maxItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
	};
}
function parseUndefinedDef(refs) {
	return { not: parseAnyDef(refs) };
}
function parseUnknownDef(refs) {
	return parseAnyDef(refs);
}
const parseReadonlyDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
const selectParser = (def, typeName, refs) => {
	switch (typeName) {
		case ZodFirstPartyTypeKind.ZodString: return parseStringDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNumber: return parseNumberDef(def, refs);
		case ZodFirstPartyTypeKind.ZodObject: return parseObjectDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBigInt: return parseBigintDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBoolean: return parseBooleanDef();
		case ZodFirstPartyTypeKind.ZodDate: return parseDateDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUndefined: return parseUndefinedDef(refs);
		case ZodFirstPartyTypeKind.ZodNull: return parseNullDef(refs);
		case ZodFirstPartyTypeKind.ZodArray: return parseArrayDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUnion:
		case ZodFirstPartyTypeKind.ZodDiscriminatedUnion: return parseUnionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodIntersection: return parseIntersectionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodTuple: return parseTupleDef(def, refs);
		case ZodFirstPartyTypeKind.ZodRecord: return parseRecordDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLiteral: return parseLiteralDef(def, refs);
		case ZodFirstPartyTypeKind.ZodEnum: return parseEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNativeEnum: return parseNativeEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNullable: return parseNullableDef(def, refs);
		case ZodFirstPartyTypeKind.ZodOptional: return parseOptionalDef(def, refs);
		case ZodFirstPartyTypeKind.ZodMap: return parseMapDef(def, refs);
		case ZodFirstPartyTypeKind.ZodSet: return parseSetDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLazy: return () => def.getter()._def;
		case ZodFirstPartyTypeKind.ZodPromise: return parsePromiseDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNaN:
		case ZodFirstPartyTypeKind.ZodNever: return parseNeverDef(refs);
		case ZodFirstPartyTypeKind.ZodEffects: return parseEffectsDef(def, refs);
		case ZodFirstPartyTypeKind.ZodAny: return parseAnyDef(refs);
		case ZodFirstPartyTypeKind.ZodUnknown: return parseUnknownDef(refs);
		case ZodFirstPartyTypeKind.ZodDefault: return parseDefaultDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBranded: return parseBrandedDef(def, refs);
		case ZodFirstPartyTypeKind.ZodReadonly: return parseReadonlyDef(def, refs);
		case ZodFirstPartyTypeKind.ZodCatch: return parseCatchDef(def, refs);
		case ZodFirstPartyTypeKind.ZodPipeline: return parsePipelineDef(def, refs);
		case ZodFirstPartyTypeKind.ZodFunction:
		case ZodFirstPartyTypeKind.ZodVoid:
		case ZodFirstPartyTypeKind.ZodSymbol: return;
		default: return ((_) => void 0)(typeName);
	}
};
function parseDef(def, refs, forceResolution = false) {
	const seenItem = refs.seen.get(def);
	if (refs.override) {
		const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
		if (overrideResult !== ignoreOverride) return overrideResult;
	}
	if (seenItem && !forceResolution) {
		const seenSchema = get$ref(seenItem, refs);
		if (seenSchema !== void 0) return seenSchema;
	}
	const newItem = {
		def,
		path: refs.currentPath,
		jsonSchema: void 0
	};
	refs.seen.set(def, newItem);
	const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
	const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
	if (jsonSchema) addMeta(def, refs, jsonSchema);
	if (refs.postProcess) {
		const postProcessResult = refs.postProcess(jsonSchema, def, refs);
		newItem.jsonSchema = jsonSchema;
		return postProcessResult;
	}
	newItem.jsonSchema = jsonSchema;
	return jsonSchema;
}
const get$ref = (item, refs) => {
	switch (refs.$refStrategy) {
		case "root": return { $ref: item.path.join("/") };
		case "relative": return { $ref: getRelativePath(refs.currentPath, item.path) };
		case "none":
		case "seen":
			if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
				console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
				return parseAnyDef(refs);
			}
			return refs.$refStrategy === "seen" ? parseAnyDef(refs) : void 0;
	}
};
const addMeta = (def, refs, jsonSchema) => {
	if (def.description) {
		jsonSchema.description = def.description;
		if (refs.markdownDescription) jsonSchema.markdownDescription = def.description;
	}
	return jsonSchema;
};
const zodToJsonSchema = (schema, options) => {
	const refs = getRefs(options);
	let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
		...acc,
		[name]: parseDef(schema._def, {
			...refs,
			currentPath: [
				...refs.basePath,
				refs.definitionPath,
				name
			]
		}, true) ?? parseAnyDef(refs)
	}), {}) : void 0;
	const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
	const main = parseDef(schema._def, name === void 0 ? refs : {
		...refs,
		currentPath: [
			...refs.basePath,
			refs.definitionPath,
			name
		]
	}, false) ?? parseAnyDef(refs);
	const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
	if (title !== void 0) main.title = title;
	if (refs.flags.hasReferencedOpenAiAnyType) {
		if (!definitions) definitions = {};
		if (!definitions[refs.openAiAnyTypeName]) definitions[refs.openAiAnyTypeName] = {
			type: [
				"string",
				"number",
				"integer",
				"boolean",
				"array",
				"null"
			],
			items: { $ref: refs.$refStrategy === "relative" ? "1" : [
				...refs.basePath,
				refs.definitionPath,
				refs.openAiAnyTypeName
			].join("/") }
		};
	}
	const combined = name === void 0 ? definitions ? {
		...main,
		[refs.definitionPath]: definitions
	} : main : {
		$ref: [
			...refs.$refStrategy === "relative" ? [] : refs.basePath,
			refs.definitionPath,
			name
		].join("/"),
		[refs.definitionPath]: {
			...definitions,
			[name]: main
		}
	};
	if (refs.target === "jsonSchema7") combined.$schema = "http://json-schema.org/draft-07/schema#";
	else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
	if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
	return combined;
};
/**
* Formats a Zod validation issue into a descriptive, human-readable string.
*
* Direct attribute extraction is used so that issue details (such as unrecognized
* property keys or invalid enum options) are preserved even when running in
* optimized/minified production builds where Zod's internal error map messages
* may degrade into generic strings (e.g. "Expected undefined, received undefined").
*/
function formatZodIssue(err) {
	const path = err.path.join(".") || "root";
	if ("keys" in err && Array.isArray(err.keys) && err.keys.length > 0) return `${path}: Unrecognized key(s) in object: ${err.keys.map((k) => `'${k}'`).join(", ")}`;
	if (err.code === "invalid_enum_value" && Array.isArray(err.options)) return `${path}: Invalid enum value. Expected ${err.options.join(" | ")}, received '${err.received}'`;
	if (err.message && !err.message.includes("Expected undefined, received undefined")) return `${path}: ${err.message}`;
	if ("expected" in err && err.expected !== void 0 && err.received !== void 0) return path + ": Expected " + err.expected + ", received " + err.received;
	return `${path}: Validation error (${err.code || "invalid"})`;
}
/**
* The central processor for A2UI messages.
* @template T The concrete type of the ComponentApi.
*/
var MessageProcessor = class {
	/**
	* Creates a new message processor.
	*
	* @param catalogs A list of available catalogs.
	* @param actionHandler A global handler for actions from all surfaces.
	* @param options Configuration options for the processor.
	*/
	constructor(catalogs, actionHandler, options) {
		this.catalogs = catalogs;
		this.actionHandler = actionHandler;
		this.model = new SurfaceGroupModel();
		this.version = options?.version ?? "v0.9";
		if (this.actionHandler) this.model.onAction.subscribe(this.actionHandler);
	}
	/**
	* Generates the a2uiClientCapabilities object for the current processor.
	*
	* @param options Configuration for capability generation.
	* @returns The capabilities object.
	*/
	getClientCapabilities(options) {
		const version = options?.version ?? this.version;
		const versionCaps = { supportedCatalogIds: this.catalogs.map((c) => c.id) };
		if (options?.includeInlineCatalogs) versionCaps.inlineCatalogs = this.catalogs.map((c) => this.generateInlineCatalog(c));
		return { [version]: versionCaps };
	}
	generateInlineCatalog(catalog) {
		const components = {};
		for (const [name, api] of catalog.components.entries()) {
			const zodSchema = zodToJsonSchema(api.schema, { target: "jsonSchema2019-09" });
			this.processRefs(zodSchema);
			components[name] = { allOf: [{ $ref: "common_types.json#/$defs/ComponentCommon" }, {
				properties: {
					component: { const: name },
					...zodSchema.properties
				},
				required: ["component", ...zodSchema.required || []]
			}] };
		}
		const functions = [];
		for (const api of catalog.functions.values()) {
			const zodSchema = zodToJsonSchema(api.schema, { target: "jsonSchema2019-09" });
			this.processRefs(zodSchema);
			functions.push({
				name: api.name,
				description: api.schema.description,
				returnType: api.returnType,
				parameters: zodSchema
			});
		}
		let theme;
		if (catalog.themeSchema) {
			const zodSchema = zodToJsonSchema(catalog.themeSchema, { target: "jsonSchema2019-09" });
			this.processRefs(zodSchema);
			theme = zodSchema.properties;
		}
		return {
			catalogId: catalog.id,
			components,
			functions: functions.length > 0 ? functions : void 0,
			theme
		};
	}
	processRefs(node) {
		if (typeof node !== "object" || node === null) return;
		if (typeof node.description === "string" && node.description.startsWith("REF:")) {
			const parts = node.description.substring(4).split("|");
			const ref = parts[0];
			const desc = parts[1] || "";
			for (const k of Object.keys(node)) delete node[k];
			node["$ref"] = ref;
			if (desc) node["description"] = desc;
			return;
		}
		if (Array.isArray(node)) for (const item of node) this.processRefs(item);
		else for (const key of Object.keys(node)) this.processRefs(node[key]);
	}
	/**
	* Returns the aggregated data model for all surfaces that have 'sendDataModel' enabled.
	*/
	getClientDataModel(version = this.version) {
		const surfaces = {};
		for (const surface of this.model.surfacesMap.values()) if (surface.sendDataModel) surfaces[surface.id] = surface.dataModel.get("/");
		if (Object.keys(surfaces).length === 0) return;
		return {
			version,
			surfaces
		};
	}
	/**
	* Subscribes to surface creation events.
	*/
	onSurfaceCreated(handler) {
		return this.model.onSurfaceCreated.subscribe(handler);
	}
	/**
	* Subscribes to surface deletion events.
	*/
	onSurfaceDeleted(handler) {
		return this.model.onSurfaceDeleted.subscribe(handler);
	}
	/**
	* Processes a list of messages or a messages wrapper.
	*
	* @param messages The messages or messages wrapper to process.
	*/
	processMessages(messages) {
		const messageList = Array.isArray(messages) ? messages : messages.messages;
		for (const message of messageList) this.processMessage(message);
	}
	processMessage(message) {
		const updateTypes = [
			"createSurface",
			"updateComponents",
			"updateDataModel",
			"deleteSurface"
		].filter((k) => k in message);
		if (updateTypes.length > 1) throw new A2uiValidationError(`Message contains multiple update types: ${updateTypes.join(", ")}.`);
		if ("createSurface" in message) {
			this.processCreateSurfaceMessage(message);
			return;
		}
		if ("deleteSurface" in message) {
			this.processDeleteSurfaceMessage(message);
			return;
		}
		if ("updateComponents" in message) {
			this.processUpdateComponentsMessage(message);
			return;
		}
		if ("updateDataModel" in message) {
			this.processUpdateDataModelMessage(message);
			return;
		}
	}
	processCreateSurfaceMessage(message) {
		const { surfaceId, catalogId, theme, sendDataModel } = message.createSurface;
		const catalog = this.catalogs.find((c) => c.id === catalogId);
		if (!catalog) throw new A2uiStateError(`Catalog not found: ${catalogId}`);
		if (this.model.getSurface(surfaceId)) throw new A2uiStateError(`Surface ${surfaceId} already exists.`);
		const surface = new SurfaceModel(surfaceId, catalog, theme, sendDataModel ?? false);
		this.model.addSurface(surface);
	}
	processDeleteSurfaceMessage(message) {
		const payload = message.deleteSurface;
		if (!payload.surfaceId) return;
		this.model.deleteSurface(payload.surfaceId);
	}
	processUpdateComponentsMessage(message) {
		const payload = message.updateComponents;
		if (!payload.surfaceId) return;
		const surface = this.model.getSurface(payload.surfaceId);
		if (!surface) throw new A2uiStateError(`Surface not found for message: ${payload.surfaceId}`);
		for (const comp of payload.components) {
			const { id, component, ...properties } = comp;
			if (!id) throw new A2uiValidationError(`Component '${component}' is missing an 'id'.`);
			const existing = surface.componentsModel.get(id);
			const componentType = component || existing?.type;
			if (componentType) {
				const componentApi = surface.catalog.components.get(componentType);
				if (componentApi) {
					const validationResult = componentApi.schema.safeParse(properties);
					if (!validationResult.success) {
						const formattedErrors = validationResult.error.errors.map(formatZodIssue).join(", ");
						console.error("[A2UI Validation Error] Component '" + componentType + "' (" + id + "):", {
							propertyKeys: Object.keys(properties),
							issues: validationResult.error.issues
						});
						throw new A2uiValidationError(`Validation failed for component '${componentType}' (${id}): ${formattedErrors}`, validationResult.error.issues);
					}
				}
			}
		}
		for (const comp of payload.components) {
			const { id, component, ...properties } = comp;
			const existing = surface.componentsModel.get(id);
			if (existing) {
				if (component && component !== existing.type) {
					surface.componentsModel.removeComponent(id);
					const newComponent = new ComponentModel(id, component, properties);
					surface.componentsModel.addComponent(newComponent);
				} else existing.properties = properties;
			} else {
				if (!component) throw new A2uiValidationError(`Cannot create component ${id} without a type.`);
				const newComponent = new ComponentModel(id, component, properties);
				surface.componentsModel.addComponent(newComponent);
			}
		}
	}
	processUpdateDataModelMessage(message) {
		const payload = message.updateDataModel;
		if (!payload.surfaceId) return;
		const surface = this.model.getSurface(payload.surfaceId);
		if (!surface) throw new A2uiStateError(`Surface not found for message: ${payload.surfaceId}`);
		const path = payload.path || "/";
		const value = payload.value;
		surface.dataModel.set(path, value);
	}
	/**
	* Resolves a relative path against a context path.
	*
	* @param path The path to resolve.
	* @param contextPath The base path (optional).
	*/
	resolvePath(path, contextPath) {
		if (path.startsWith("/")) return path;
		if (contextPath) return `${contextPath.endsWith("/") ? contextPath : `${contextPath}/`}${path}`;
		return `/${path}`;
	}
};
/**
* A resolved dynamic value in a node's props: a snapshot of the current
* value, pinned at emission. A new binding arrives through the node's props
* whenever the underlying value changes.
*
* Literal and function-call values resolve to a read-only `ResolvedBinding`,
* so a write without narrowing to {@link WritableBinding} is a type error
* rather than a silent no-op.
*
* Named `ResolvedBinding` because `DataBinding` is the exported wire model
* of the `{"path": ...}` payload this resolves from; the two names stay
* visibly distinct.
*/
var ResolvedBinding = class {
	constructor(value) {
		this.value = value;
	}
};
/** Narrows an unknown prop value to a {@link ComponentNode}. */
function isComponentNode(value) {
	return value instanceof MutableComponentNode;
}
/**
* The write side and only implementation of {@link ComponentNode}. Not
* exported from the package barrel: the resolver constructs, updates, and
* disposes nodes; application code sees the read-only interface.
*/
var MutableComponentNode = class {
	constructor(instanceId, componentId, type, dataPath, initialProps, impl, state = "resolved") {
		this._onDestroyed = new EventEmitter();
		this.onDestroyed = this._onDestroyed;
		this.cleanups = [];
		this._disposed = false;
		this.instanceId = instanceId;
		this.componentId = componentId;
		this.type = type;
		this.dataPath = dataPath;
		this.props = signal(initialProps);
		this.impl = impl;
		this.state = state;
	}
	get disposed() {
		return this._disposed;
	}
	get isPlaceholder() {
		return this.state !== "resolved";
	}
	addCleanup(cleanup) {
		this.cleanups.push(cleanup);
	}
	toJSON() {
		if (this.isPlaceholder) return {
			id: this.componentId,
			type: this.type,
			state: this.state
		};
		const serialized = {
			id: this.componentId,
			type: this.type
		};
		const props = peekValue(this.props);
		for (const [key, value] of Object.entries(props)) serialized[key] = serializeValue(value);
		return serialized;
	}
	/**
	* Replaces the resolved props, emitting only if a shallow comparison shows
	* a change. Callers must keep unchanged values reference-identical; the
	* shallow comparison is exact only under that invariant.
	*/
	setProps(next) {
		if (this._disposed) return;
		if (!shallowEqual(peekValue(this.props), next)) setValue(this.props, next);
	}
	/**
	* Tears down this node: runs registered cleanups, then fires `onDestroyed`.
	* Idempotent.
	*/
	dispose() {
		if (this._disposed) return;
		this._disposed = true;
		for (const cleanup of this.cleanups) try {
			cleanup();
		} catch (e) {
			console.error(`ComponentNode cleanup error (${this.instanceId}):`, e);
		}
		this.cleanups = [];
		this._onDestroyed.emit();
		this._onDestroyed.dispose();
	}
};
function serializeValue(value) {
	if (isComponentNode(value)) return value.toJSON();
	if (value instanceof ResolvedBinding) return serializeValue(value.value);
	if (typeof value === "function") return "<Action>";
	if (Array.isArray(value)) return value.map(serializeValue);
	if (value && typeof value === "object") {
		const result = {};
		for (const [key, inner] of Object.entries(value)) result[key] = serializeValue(inner);
		return result;
	}
	return value;
}
function shallowEqual(a, b) {
	if (Object.is(a, b)) return true;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	for (const key of aKeys) if (!Object.is(a[key], b[key])) return false;
	return true;
}
objectType({ messages: arrayType(unionType([
	objectType({
		version: enumType(["v0.9", "v0.9.1"]),
		createSurface: objectType({
			surfaceId: stringType().describe("The unique identifier for the UI surface to be rendered."),
			catalogId: stringType().describe("A string that uniquely identifies this catalog."),
			theme: anyType().optional().describe("Theme parameters for the surface."),
			sendDataModel: booleanType().optional().describe("If true, the client will send the full data model.")
		}).strict()
	}).strict(),
	objectType({
		version: enumType(["v0.9", "v0.9.1"]),
		updateComponents: objectType({
			surfaceId: stringType().describe("The unique identifier for the UI surface to be updated."),
			components: arrayType(AnyComponentSchema).min(1).describe("A list containing all UI components for the surface.")
		}).strict()
	}).strict(),
	objectType({
		version: enumType(["v0.9", "v0.9.1"]),
		updateDataModel: objectType({
			surfaceId: stringType().describe("The unique identifier for the UI surface this data model update applies to."),
			path: stringType().optional().describe("An optional path to a location within the data model."),
			value: anyType().optional().describe("The data to be updated in the data model.")
		}).strict()
	}).strict(),
	objectType({
		version: enumType(["v0.9", "v0.9.1"]),
		deleteSurface: objectType({ surfaceId: stringType().describe("The unique identifier for the UI surface to be deleted.") }).strict()
	}).strict()
])).describe("A list of messages.") }).strict().describe("An object wrapping a list of messages.");
/**
* A parser for A2UI expressions, supporting string interpolation and functional calls.
*
* The parser converts strings with `${...}` placeholders into arrays of `DynamicValue`s.
* It supports literals (strings, numbers, booleans), path-based data bindings, and
* nested function calls with named arguments.
*/
/**
* Digits, an optional decimal point, and optional further digits.
*
* Every client implementation accepts a trailing point (`1.`) today and none
* accepts a second point (`1.2.3`), so the grammar is written to keep that.
*/
const NUMBER_LITERAL = /^\d+\.?\d*$/;
var ExpressionParser = class ExpressionParser {
	/**
	* Parses an input string into an array of DynamicValues.
	* If the input contains no interpolation, it returns the raw string as a single literal.
	*/
	parse(input, depth = 0) {
		if (depth > ExpressionParser.MAX_DEPTH) throw new A2uiExpressionError("Max recursion depth reached in parse");
		if (!input || !input.includes("${")) return [input];
		const parts = [];
		const scanner = new Scanner(input);
		while (!scanner.isAtEnd()) if (scanner.matches("${")) {
			scanner.advance(2);
			const content = this.extractInterpolationContent(scanner);
			const parsed = this.parseExpression(content, depth + 1);
			if (parsed !== null) parts.push(parsed);
		} else if (scanner.peek() === "\\" && scanner.peek(1) === "$" && scanner.peek(2) === "{") {
			scanner.advance();
			parts.push("${");
			scanner.advance(2);
		} else {
			const start = scanner.pos;
			while (!scanner.isAtEnd()) {
				if (scanner.matches("${")) break;
				if (scanner.peek() === "\\" && scanner.peek(1) === "$" && scanner.peek(2) === "{") break;
				scanner.advance();
			}
			parts.push(scanner.input.substring(start, scanner.pos));
		}
		return parts.filter((p) => p !== null && p !== "");
	}
	extractInterpolationContent(scanner) {
		const start = scanner.pos;
		let braceBalance = 1;
		while (!scanner.isAtEnd() && braceBalance > 0) {
			const char = scanner.advance();
			if (char === "{") braceBalance++;
			else if (char === "}") braceBalance--;
			else if (char === "'" || char === "\"") {
				const quote = char;
				while (!scanner.isAtEnd()) {
					const c = scanner.advance();
					if (c === "\\") scanner.advance();
					else if (c === quote) break;
				}
			}
		}
		if (braceBalance > 0) throw new A2uiExpressionError("Unclosed interpolation: missing '}'");
		return scanner.input.substring(start, scanner.pos - 1);
	}
	/**
	* Parses a single expression string into a DynamicValue.
	*
	* Unlike `parse()`, which handles mixed literal text and interpolations,
	* this assumes the entire string is a single expression (e.g., as found inside `${...}`).
	*
	* @param expr The expression string to parse.
	* @param depth The current recursion depth.
	* @returns The resolved DynamicValue.
	*/
	parseExpression(expr, depth = 0) {
		expr = expr.trim();
		if (!expr) return "";
		const scanner = new Scanner(expr);
		const result = this.parseExpressionInternal(scanner, depth);
		if (!scanner.isAtEnd()) throw new A2uiExpressionError(`Unexpected characters at end of expression: '${scanner.input.substring(scanner.pos)}'`);
		return result;
	}
	parseExpressionInternal(scanner, depth) {
		if (depth > ExpressionParser.MAX_DEPTH) throw new A2uiExpressionError("Max recursion depth reached in parse");
		scanner.skipWhitespace();
		if (scanner.isAtEnd()) return "";
		if (scanner.matches("${")) {
			scanner.advance(2);
			const content = this.extractInterpolationContent(scanner);
			return this.parseExpression(content, depth + 1);
		}
		if (scanner.matchesString("'") || scanner.matchesString("\"")) return this.parseStringLiteral(scanner);
		if (this.isDigit(scanner.peek())) return this.parseNumberLiteral(scanner);
		if (scanner.matchesKeyword("true")) return true;
		if (scanner.matchesKeyword("false")) return false;
		if (scanner.matchesKeyword("null")) return "";
		const token = this.scanPathOrIdentifier(scanner);
		scanner.skipWhitespace();
		if (scanner.peek() === "(") return this.parseFunctionCall(token, scanner, depth);
		else {
			if (!token) return "";
			return { path: token };
		}
	}
	scanPathOrIdentifier(scanner) {
		const start = scanner.pos;
		while (!scanner.isAtEnd()) {
			const c = scanner.peek();
			if (this.isAlnum(c) || c === "/" || c === "." || c === "_" || c === "-") scanner.advance();
			else break;
		}
		return scanner.input.substring(start, scanner.pos);
	}
	parseFunctionCall(funcName, scanner, depth) {
		scanner.match("(");
		scanner.skipWhitespace();
		const args = {};
		while (!scanner.isAtEnd() && scanner.peek() !== ")") {
			const argName = this.scanIdentifier(scanner);
			scanner.skipWhitespace();
			if (!scanner.match(":")) throw new A2uiExpressionError(`Expected ':' after argument name '${argName}' in function '${funcName}'`);
			scanner.skipWhitespace();
			args[argName] = this.parseExpressionInternal(scanner, depth + 1);
			scanner.skipWhitespace();
			if (scanner.peek() === ",") {
				scanner.advance();
				scanner.skipWhitespace();
			}
		}
		if (!scanner.match(")")) throw new A2uiExpressionError(`Expected ')' after function arguments for '${funcName}'`);
		return {
			call: funcName,
			args,
			returnType: "any"
		};
	}
	scanIdentifier(scanner) {
		const start = scanner.pos;
		while (!scanner.isAtEnd() && (this.isAlnum(scanner.peek()) || scanner.peek() === "_")) scanner.advance();
		return scanner.input.substring(start, scanner.pos);
	}
	parseStringLiteral(scanner) {
		const quote = scanner.advance();
		let result = "";
		while (!scanner.isAtEnd()) {
			const c = scanner.advance();
			if (c === "\\") {
				const next = scanner.advance();
				if (next === "n") result += "\n";
				else if (next === "t") result += "	";
				else if (next === "r") result += "\r";
				else result += next;
			} else if (c === quote) break;
			else result += c;
		}
		return result;
	}
	parseNumberLiteral(scanner) {
		const start = scanner.pos;
		while (!scanner.isAtEnd() && (this.isDigit(scanner.peek()) || scanner.peek() === ".")) scanner.advance();
		const text = scanner.input.substring(start, scanner.pos);
		if (!NUMBER_LITERAL.test(text)) throw new A2uiExpressionError(`Invalid number literal: '${text}'`);
		return Number(text);
	}
	isAlnum(c) {
		return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9";
	}
	isDigit(c) {
		return c >= "0" && c <= "9";
	}
};
/** The maximum allowed recursion depth for nested expressions to prevent stack overflows. */
ExpressionParser.MAX_DEPTH = 100;
var Scanner = class {
	constructor(input) {
		this.input = input;
		this.pos = 0;
	}
	isAtEnd() {
		return this.pos >= this.input.length;
	}
	peek(offset = 0) {
		if (this.pos + offset >= this.input.length) return "\0";
		return this.input[this.pos + offset];
	}
	advance(count = 1) {
		const char = this.input.substring(this.pos, this.pos + count);
		this.pos += count;
		return char;
	}
	match(expected) {
		if (this.peek() === expected) {
			this.advance();
			return true;
		}
		return false;
	}
	matches(expected) {
		if (this.input.startsWith(expected, this.pos)) return true;
		return false;
	}
	matchesString(expected) {
		return this.peek() === expected;
	}
	matchesKeyword(keyword) {
		if (this.input.startsWith(keyword, this.pos)) {
			const next = this.peek(keyword.length);
			if (!/[a-zA-Z0-9_]/.test(next)) {
				this.advance(keyword.length);
				return true;
			}
		}
		return false;
	}
	skipWhitespace() {
		while (!this.isAtEnd() && /\s/.test(this.peek())) this.advance();
	}
};
-(Math.pow(10, 8) * 24 * 60 * 60 * 1e3);
/**
* @constant
* @name millisecondsInWeek
* @summary Milliseconds in 1 week.
*/
const millisecondsInWeek = 6048e5;
/**
* @constant
* @name millisecondsInDay
* @summary Milliseconds in 1 day.
*/
const millisecondsInDay = 864e5;
/**
* @constant
* @name millisecondsInMinute
* @summary Milliseconds in 1 minute
*/
const millisecondsInMinute = 6e4;
/**
* @constant
* @name millisecondsInHour
* @summary Milliseconds in 1 hour
*/
const millisecondsInHour = 36e5;
/**
* @constant
* @name millisecondsInSecond
* @summary Milliseconds in 1 second
*/
const millisecondsInSecond = 1e3;
/**
* @constant
* @name constructFromSymbol
* @summary Symbol enabling Date extensions to inherit properties from the reference date.
*
* The symbol is used to enable the `constructFrom` function to construct a date
* using a reference date and a value. It allows to transfer extra properties
* from the reference date to the new date. It's useful for extensions like
* [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
* a constructor argument.
*/
const constructFromSymbol = Symbol.for("constructDateFrom");
/**
* @name constructFrom
* @category Generic Helpers
* @summary Constructs a date using the reference date and the value
*
* @description
* The function constructs a new date using the constructor from the reference
* date and the given value. It helps to build generic functions that accept
* date extensions.
*
* It defaults to `Date` if the passed reference date is a number or a string.
*
* Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
* enabling to transfer extra properties from the reference date to the new date.
* It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
* that accept a time zone as a constructor argument.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
*
* @param date - The reference date to take constructor from
* @param value - The value to create the date
*
* @returns Date initialized using the given date and value
*
* @example
* import { constructFrom } from "./constructFrom/date-fns";
*
* // A function that clones a date preserving the original type
* function cloneDate<DateType extends Date>(date: DateType): DateType {
*   return constructFrom(
*     date, // Use constructor from the given date
*     date.getTime() // Use the date value to create a new date
*   );
* }
*/
function constructFrom(date, value) {
	if (typeof date === "function") return date(value);
	if (date && typeof date === "object" && constructFromSymbol in date) return date[constructFromSymbol](value);
	if (date instanceof Date) return new date.constructor(value);
	return new Date(value);
}
/**
* @name toDate
* @category Common Helpers
* @summary Convert the given argument to an instance of Date.
*
* @description
* Convert the given argument to an instance of Date.
*
* If the argument is an instance of Date, the function returns its clone.
*
* If the argument is a number, it is treated as a timestamp.
*
* If the argument is none of the above, the function returns Invalid Date.
*
* Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
* enabling to transfer extra properties from the reference date to the new date.
* It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
* that accept a time zone as a constructor argument.
*
* **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param argument - The value to convert
*
* @returns The parsed date in the local time zone
*
* @example
* // Clone the date:
* const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
* //=> Tue Feb 11 2014 11:30:30
*
* @example
* // Convert the timestamp to date:
* const result = toDate(1392098430000)
* //=> Tue Feb 11 2014 11:30:30
*/
function toDate(argument, context) {
	return constructFrom(context || argument, argument);
}
/**
* The {@link addDays} function options.
*/
/**
* @name addDays
* @category Day Helpers
* @summary Add the specified number of days to the given date.
*
* @description
* Add the specified number of days to the given date.
*
* **You don't need date-fns\***:
*
* Temporal has a built-in `add` method on all its classes:
*
* - [`Temporal.Instant.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/add)
* - [`Temporal.PlainDate.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/add)
* - [`Temporal.PlainDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/add)
* - [`Temporal.PlainTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainTime/add)
* - [`Temporal.PlainYearMonth.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainYearMonth/add)
* - [`Temporal.ZonedDateTime.prototype.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/add)
*
* \* **Not really**, see: https://date-fns.org/you-dont-need-date-fns
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param amount - The amount of days to be added.
* @param options - An object with options
*
* @returns The new date with the days added
*
* @example
* // Add 10 days to 1 September 2014:
* const result = addDays(new Date(2014, 8, 1), 10)
* //=> Thu Sep 11 2014 00:00:00
*
* @example
* // Using Temporal:
* // Add 10 days to 1 September 2014:
* Temporal.PlainDate.from("2014-09-01").add({ days: 10 }).toString();
* //=> "2014-09-11"
*/
function addDays(date, amount, options) {
	const _date = toDate(date, options?.in);
	if (isNaN(amount)) return constructFrom(options?.in || date, NaN);
	if (!amount) return _date;
	_date.setDate(_date.getDate() + amount);
	return _date;
}
let defaultOptions = {};
function getDefaultOptions$1() {
	return defaultOptions;
}
/**
* The {@link startOfWeek} function options.
*/
/**
* @name startOfWeek
* @category Week Helpers
* @summary Return the start of a week for the given date.
*
* @description
* Return the start of a week for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a week
*
* @example
* // The start of a week for 2 September 2014 11:55:00:
* const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
* //=> Sun Aug 31 2014 00:00:00
*
* @example
* // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
* const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
* //=> Mon Sep 01 2014 00:00:00
*/
function startOfWeek(date, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const _date = toDate(date, options?.in);
	const day = _date.getDay();
	const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
	_date.setDate(_date.getDate() - diff);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
/**
* The {@link startOfISOWeek} function options.
*/
/**
* @name startOfISOWeek
* @category ISO Week Helpers
* @summary Return the start of an ISO week for the given date.
*
* @description
* Return the start of an ISO week for the given date.
* The result will be in the local timezone.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of an ISO week
*
* @example
* // The start of an ISO week for 2 September 2014 11:55:00:
* const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
* //=> Mon Sep 01 2014 00:00:00
*/
function startOfISOWeek(date, options) {
	return startOfWeek(date, {
		...options,
		weekStartsOn: 1
	});
}
/**
* The {@link getISOWeekYear} function options.
*/
/**
* @name getISOWeekYear
* @category ISO Week-Numbering Year Helpers
* @summary Get the ISO week-numbering year of the given date.
*
* @description
* Get the ISO week-numbering year of the given date,
* which always starts 3 days before the year's first Thursday.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
*
* @returns The ISO week-numbering year
*
* @example
* // Which ISO-week numbering year is 2 January 2005?
* const result = getISOWeekYear(new Date(2005, 0, 2))
* //=> 2004
*/
function getISOWeekYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
	fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
	fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
	const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
	const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
	fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
	fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
	const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
	if (_date.getTime() >= startOfNextYear.getTime()) return year + 1;
	else if (_date.getTime() >= startOfThisYear.getTime()) return year;
	else return year - 1;
}
/**
* Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
* They usually appear for dates that denote time before the timezones were introduced
* (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
* and GMT+01:00:00 after that date)
*
* Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
* which would lead to incorrect calculations.
*
* This function returns the timezone offset in milliseconds that takes seconds in account.
*/
function getTimezoneOffsetInMilliseconds(date) {
	const _date = toDate(date);
	const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
	utcDate.setUTCFullYear(_date.getFullYear());
	return +date - +utcDate;
}
function normalizeDates(context, ...dates) {
	const normalize = constructFrom.bind(null, context || dates.find((date) => typeof date === "object"));
	return dates.map(normalize);
}
/**
* The {@link startOfDay} function options.
*/
/**
* @name startOfDay
* @category Day Helpers
* @summary Return the start of a day for the given date.
*
* @description
* Return the start of a day for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a day
*
* @example
* // The start of a day for 2 September 2014 11:55:00:
* const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
* //=> Tue Sep 02 2014 00:00:00
*/
function startOfDay(date, options) {
	const _date = toDate(date, options?.in);
	_date.setHours(0, 0, 0, 0);
	return _date;
}
/**
* The {@link differenceInCalendarDays} function options.
*/
/**
* @name differenceInCalendarDays
* @category Day Helpers
* @summary Get the number of calendar days between the given dates.
*
* @description
* Get the number of calendar days between the given dates. This means that the times are removed
* from the dates and then the difference in days is calculated.
*
* @param laterDate - The later date
* @param earlierDate - The earlier date
* @param options - The options object
*
* @returns The number of calendar days
*
* @example
* // How many calendar days are between
* // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
* const result = differenceInCalendarDays(
*   new Date(2012, 6, 2, 0, 0),
*   new Date(2011, 6, 2, 23, 0)
* )
* //=> 366
* // How many calendar days are between
* // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
* const result = differenceInCalendarDays(
*   new Date(2011, 6, 3, 0, 1),
*   new Date(2011, 6, 2, 23, 59)
* )
* //=> 1
*/
function differenceInCalendarDays(laterDate, earlierDate, options) {
	const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
	const laterStartOfDay = startOfDay(laterDate_);
	const earlierStartOfDay = startOfDay(earlierDate_);
	const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
	const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
	return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}
/**
* The {@link startOfISOWeekYear} function options.
*/
/**
* @name startOfISOWeekYear
* @category ISO Week-Numbering Year Helpers
* @summary Return the start of an ISO week-numbering year for the given date.
*
* @description
* Return the start of an ISO week-numbering year,
* which always starts 3 days before the year's first Thursday.
* The result will be in the local timezone.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of an ISO week-numbering year
*
* @example
* // The start of an ISO week-numbering year for 2 July 2005:
* const result = startOfISOWeekYear(new Date(2005, 6, 2))
* //=> Mon Jan 03 2005 00:00:00
*/
function startOfISOWeekYear(date, options) {
	const year = getISOWeekYear(date, options);
	const fourthOfJanuary = constructFrom(options?.in || date, 0);
	fourthOfJanuary.setFullYear(year, 0, 4);
	fourthOfJanuary.setHours(0, 0, 0, 0);
	return startOfISOWeek(fourthOfJanuary);
}
/**
* @name isDate
* @category Common Helpers
* @summary Is the given value a date?
*
* @description
* Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
*
* @param value - The value to check
*
* @returns True if the given value is a date
*
* @example
* // For a valid date:
* const result = isDate(new Date())
* //=> true
*
* @example
* // For an invalid date:
* const result = isDate(new Date(NaN))
* //=> true
*
* @example
* // For some value:
* const result = isDate('2014-02-31')
* //=> false
*
* @example
* // For an object:
* const result = isDate({})
* //=> false
*/
function isDate(value) {
	return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
/**
* @name isValid
* @category Common Helpers
* @summary Is the given date valid?
*
* @description
* Returns false if argument is Invalid Date and true otherwise.
* Argument is converted to Date using `toDate`. See [toDate](https://date-fns.org/docs/toDate)
* Invalid Date is a Date, whose time value is NaN.
*
* Time value of Date: http://es5.github.io/#x15.9.1.1
*
* @param date - The date to check
*
* @returns The date is valid
*
* @example
* // For the valid date:
* const result = isValid(new Date(2014, 1, 31))
* //=> true
*
* @example
* // For the value, convertible into a date:
* const result = isValid(1393804800000)
* //=> true
*
* @example
* // For the invalid date:
* const result = isValid(new Date(''))
* //=> false
*/
function isValid(date) {
	return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}
/**
* The {@link startOfYear} function options.
*/
/**
* @name startOfYear
* @category Year Helpers
* @summary Return the start of a year for the given date.
*
* @description
* Return the start of a year for the given date.
* The result will be in the local timezone.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The original date
* @param options - The options
*
* @returns The start of a year
*
* @example
* // The start of a year for 2 September 2014 11:55:00:
* const result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
* //=> Wed Jan 01 2014 00:00:00
*/
function startOfYear(date, options) {
	const date_ = toDate(date, options?.in);
	date_.setFullYear(date_.getFullYear(), 0, 1);
	date_.setHours(0, 0, 0, 0);
	return date_;
}
const formatDistanceLocale = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
};
const formatDistance$1 = (token, count, options) => {
	let result;
	const tokenValue = formatDistanceLocale[token];
	if (typeof tokenValue === "string") result = tokenValue;
	else if (count === 1) result = tokenValue.one;
	else result = tokenValue.other.replace("{{count}}", count.toString());
	if (options?.addSuffix) {
		if (options.comparison && options.comparison > 0) return "in " + result;
		else return result + " ago";
	}
	return result;
};
function buildFormatLongFn(args) {
	return (options = {}) => {
		const width = options.width ? String(options.width) : args.defaultWidth;
		return args.formats[width] || args.formats[args.defaultWidth];
	};
}
const formatLong = {
	date: buildFormatLongFn({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: buildFormatLongFn({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: buildFormatLongFn({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
};
const formatRelativeLocale = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
};
const formatRelative$1 = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
/**
* The localize function argument callback which allows to convert raw value to
* the actual type.
*
* @param value - The value to convert
*
* @returns The converted value
*/
/**
* The map of localized values for each width.
*/
/**
* The index type of the locale unit value. It types conversion of units of
* values that don't start at 0 (i.e. quarters).
*/
/**
* Converts the unit value to the tuple of values.
*/
/**
* The tuple of localized era values. The first element represents BC,
* the second element represents AD.
*/
/**
* The tuple of localized quarter values. The first element represents Q1.
*/
/**
* The tuple of localized day values. The first element represents Sunday.
*/
/**
* The tuple of localized month values. The first element represents January.
*/
function buildLocalizeFn(args) {
	return (value, options) => {
		const context = options?.context ? String(options.context) : "standalone";
		let valuesArray;
		if (context === "formatting" && args.formattingValues) {
			const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
			const width = options?.width ? String(options.width) : defaultWidth;
			valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
		} else {
			const defaultWidth = args.defaultWidth;
			const width = options?.width ? String(options.width) : args.defaultWidth;
			valuesArray = args.values[width] || args.values[defaultWidth];
		}
		const index = args.argumentCallback ? args.argumentCallback(value) : value;
		return valuesArray[index];
	};
}
const eraValues = {
	narrow: ["B", "A"],
	abbreviated: ["BC", "AD"],
	wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
	narrow: [
		"1",
		"2",
		"3",
		"4"
	],
	abbreviated: [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	wide: [
		"1st quarter",
		"2nd quarter",
		"3rd quarter",
		"4th quarter"
	]
};
const monthValues = {
	narrow: [
		"J",
		"F",
		"M",
		"A",
		"M",
		"J",
		"J",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	abbreviated: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	],
	wide: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]
};
const dayValues = {
	narrow: [
		"S",
		"M",
		"T",
		"W",
		"T",
		"F",
		"S"
	],
	short: [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	],
	abbreviated: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	wide: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	]
};
const dayPeriodValues = {
	narrow: {
		am: "a",
		pm: "p",
		midnight: "mi",
		noon: "n",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	},
	abbreviated: {
		am: "AM",
		pm: "PM",
		midnight: "midnight",
		noon: "noon",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	},
	wide: {
		am: "a.m.",
		pm: "p.m.",
		midnight: "midnight",
		noon: "noon",
		morning: "morning",
		afternoon: "afternoon",
		evening: "evening",
		night: "night"
	}
};
const formattingDayPeriodValues = {
	narrow: {
		am: "a",
		pm: "p",
		midnight: "mi",
		noon: "n",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	},
	abbreviated: {
		am: "AM",
		pm: "PM",
		midnight: "midnight",
		noon: "noon",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	},
	wide: {
		am: "a.m.",
		pm: "p.m.",
		midnight: "midnight",
		noon: "noon",
		morning: "in the morning",
		afternoon: "in the afternoon",
		evening: "in the evening",
		night: "at night"
	}
};
const ordinalNumber = (dirtyNumber, _options) => {
	const number = Number(dirtyNumber);
	const rem100 = number % 100;
	if (rem100 > 20 || rem100 < 10) switch (rem100 % 10) {
		case 1: return number + "st";
		case 2: return number + "nd";
		case 3: return number + "rd";
	}
	return number + "th";
};
const localize = {
	ordinalNumber,
	era: buildLocalizeFn({
		values: eraValues,
		defaultWidth: "wide"
	}),
	quarter: buildLocalizeFn({
		values: quarterValues,
		defaultWidth: "wide",
		argumentCallback: (quarter) => quarter - 1
	}),
	month: buildLocalizeFn({
		values: monthValues,
		defaultWidth: "wide"
	}),
	day: buildLocalizeFn({
		values: dayValues,
		defaultWidth: "wide"
	}),
	dayPeriod: buildLocalizeFn({
		values: dayPeriodValues,
		defaultWidth: "wide",
		formattingValues: formattingDayPeriodValues,
		defaultFormattingWidth: "wide"
	})
};
function buildMatchFn(args) {
	return (string, options = {}) => {
		const width = options.width;
		const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
		const matchResult = string.match(matchPattern);
		if (!matchResult) return null;
		const matchedString = matchResult[0];
		const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
		const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : findKey(parsePatterns, (pattern) => pattern.test(matchedString));
		let value;
		value = args.valueCallback ? args.valueCallback(key) : key;
		value = options.valueCallback ? options.valueCallback(value) : value;
		const rest = string.slice(matchedString.length);
		return {
			value,
			rest
		};
	};
}
function findKey(object, predicate) {
	for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) return key;
}
function findIndex(array, predicate) {
	for (let key = 0; key < array.length; key++) if (predicate(array[key])) return key;
}
function buildMatchPatternFn(args) {
	return (string, options = {}) => {
		const matchResult = string.match(args.matchPattern);
		if (!matchResult) return null;
		const matchedString = matchResult[0];
		const parseResult = string.match(args.parsePattern);
		if (!parseResult) return null;
		let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
		value = options.valueCallback ? options.valueCallback(value) : value;
		const rest = string.slice(matchedString.length);
		return {
			value,
			rest
		};
	};
}
/**
* @category Locales
* @summary English locale (United States).
* @language English
* @iso-639-2 eng
* @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
* @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
*/
const enUS = {
	code: "en-US",
	formatDistance: formatDistance$1,
	formatLong,
	formatRelative: formatRelative$1,
	localize,
	match: {
		ordinalNumber: buildMatchPatternFn({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (value) => parseInt(value, 10)
		}),
		era: buildMatchFn({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: buildMatchFn({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (index) => index + 1
		}),
		month: buildMatchFn({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: buildMatchFn({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: buildMatchFn({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
/**
* The {@link getDayOfYear} function options.
*/
/**
* @name getDayOfYear
* @category Day Helpers
* @summary Get the day of the year of the given date.
*
* @description
* Get the day of the year of the given date.
*
* @param date - The given date
* @param options - The options
*
* @returns The day of year
*
* @example
* // Which day of the year is 2 July 2014?
* const result = getDayOfYear(new Date(2014, 6, 2))
* //=> 183
*/
function getDayOfYear(date, options) {
	const _date = toDate(date, options?.in);
	return differenceInCalendarDays(_date, startOfYear(_date)) + 1;
}
/**
* The {@link getISOWeek} function options.
*/
/**
* @name getISOWeek
* @category ISO Week Helpers
* @summary Get the ISO week of the given date.
*
* @description
* Get the ISO week of the given date.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
* @param options - The options
*
* @returns The ISO week
*
* @example
* // Which week of the ISO-week numbering year is 2 January 2005?
* const result = getISOWeek(new Date(2005, 0, 2))
* //=> 53
*/
function getISOWeek(date, options) {
	const _date = toDate(date, options?.in);
	const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
	return Math.round(diff / millisecondsInWeek) + 1;
}
/**
* The {@link getWeekYear} function options.
*/
/**
* @name getWeekYear
* @category Week-Numbering Year Helpers
* @summary Get the local week-numbering year of the given date.
*
* @description
* Get the local week-numbering year of the given date.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @param date - The given date
* @param options - An object with options.
*
* @returns The local week-numbering year
*
* @example
* // Which week numbering year is 26 December 2004 with the default settings?
* const result = getWeekYear(new Date(2004, 11, 26))
* //=> 2005
*
* @example
* // Which week numbering year is 26 December 2004 if week starts on Saturday?
* const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
* //=> 2004
*
* @example
* // Which week numbering year is 26 December 2004 if the first week contains 4 January?
* const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
* //=> 2004
*/
function getWeekYear(date, options) {
	const _date = toDate(date, options?.in);
	const year = _date.getFullYear();
	const defaultOptions = getDefaultOptions$1();
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
	firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
	firstWeekOfNextYear.setHours(0, 0, 0, 0);
	const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
	const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
	firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
	firstWeekOfThisYear.setHours(0, 0, 0, 0);
	const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
	if (+_date >= +startOfNextYear) return year + 1;
	else if (+_date >= +startOfThisYear) return year;
	else return year - 1;
}
/**
* The {@link startOfWeekYear} function options.
*/
/**
* @name startOfWeekYear
* @category Week-Numbering Year Helpers
* @summary Return the start of a local week-numbering year for the given date.
*
* @description
* Return the start of a local week-numbering year.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type.
*
* @param date - The original date
* @param options - An object with options
*
* @returns The start of a week-numbering year
*
* @example
* // The start of an a week-numbering year for 2 July 2005 with default settings:
* const result = startOfWeekYear(new Date(2005, 6, 2))
* //=> Sun Dec 26 2004 00:00:00
*
* @example
* // The start of a week-numbering year for 2 July 2005
* // if Monday is the first day of week
* // and 4 January is always in the first week of the year:
* const result = startOfWeekYear(new Date(2005, 6, 2), {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> Mon Jan 03 2005 00:00:00
*/
function startOfWeekYear(date, options) {
	const defaultOptions = getDefaultOptions$1();
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const year = getWeekYear(date, options);
	const firstWeek = constructFrom(options?.in || date, 0);
	firstWeek.setFullYear(year, 0, firstWeekContainsDate);
	firstWeek.setHours(0, 0, 0, 0);
	return startOfWeek(firstWeek, options);
}
/**
* The {@link getWeek} function options.
*/
/**
* @name getWeek
* @category Week Helpers
* @summary Get the local week index of the given date.
*
* @description
* Get the local week index of the given date.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @param date - The given date
* @param options - An object with options
*
* @returns The week
*
* @example
* // Which week of the local week numbering year is 2 January 2005 with default options?
* const result = getWeek(new Date(2005, 0, 2))
* //=> 2
*
* @example
* // Which week of the local week numbering year is 2 January 2005,
* // if Monday is the first day of the week,
* // and the first week of the year always contains 4 January?
* const result = getWeek(new Date(2005, 0, 2), {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> 53
*/
function getWeek(date, options) {
	const _date = toDate(date, options?.in);
	const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
	return Math.round(diff / millisecondsInWeek) + 1;
}
function addLeadingZeros(number, targetLength) {
	return (number < 0 ? "-" : "") + Math.abs(number).toString().padStart(targetLength, "0");
}
const lightFormatters = {
	y(date, token) {
		const signedYear = date.getFullYear();
		const year = signedYear > 0 ? signedYear : 1 - signedYear;
		return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
	},
	M(date, token) {
		const month = date.getMonth();
		return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
	},
	d(date, token) {
		return addLeadingZeros(date.getDate(), token.length);
	},
	a(date, token) {
		const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "a":
			case "aa": return dayPeriodEnumValue.toUpperCase();
			case "aaa": return dayPeriodEnumValue;
			case "aaaaa": return dayPeriodEnumValue[0];
			default: return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
		}
	},
	h(date, token) {
		return addLeadingZeros(date.getHours() % 12 || 12, token.length);
	},
	H(date, token) {
		return addLeadingZeros(date.getHours(), token.length);
	},
	m(date, token) {
		return addLeadingZeros(date.getMinutes(), token.length);
	},
	s(date, token) {
		return addLeadingZeros(date.getSeconds(), token.length);
	},
	S(date, token) {
		const numberOfDigits = token.length;
		const milliseconds = date.getMilliseconds();
		return addLeadingZeros(Math.trunc(milliseconds * Math.pow(10, numberOfDigits - 3)), token.length);
	}
};
const dayPeriodEnum = {
	am: "am",
	pm: "pm",
	midnight: "midnight",
	noon: "noon",
	morning: "morning",
	afternoon: "afternoon",
	evening: "evening",
	night: "night"
};
const formatters = {
	G: function(date, token, localize) {
		const era = date.getFullYear() > 0 ? 1 : 0;
		switch (token) {
			case "G":
			case "GG":
			case "GGG": return localize.era(era, { width: "abbreviated" });
			case "GGGGG": return localize.era(era, { width: "narrow" });
			default: return localize.era(era, { width: "wide" });
		}
	},
	y: function(date, token, localize) {
		if (token === "yo") {
			const signedYear = date.getFullYear();
			const year = signedYear > 0 ? signedYear : 1 - signedYear;
			return localize.ordinalNumber(year, { unit: "year" });
		}
		return lightFormatters.y(date, token);
	},
	Y: function(date, token, localize, options) {
		const signedWeekYear = getWeekYear(date, options);
		const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
		if (token === "YY") return addLeadingZeros(weekYear % 100, 2);
		if (token === "Yo") return localize.ordinalNumber(weekYear, { unit: "year" });
		return addLeadingZeros(weekYear, token.length);
	},
	R: function(date, token) {
		return addLeadingZeros(getISOWeekYear(date), token.length);
	},
	u: function(date, token) {
		return addLeadingZeros(date.getFullYear(), token.length);
	},
	Q: function(date, token, localize) {
		const quarter = Math.ceil((date.getMonth() + 1) / 3);
		switch (token) {
			case "Q": return String(quarter);
			case "QQ": return addLeadingZeros(quarter, 2);
			case "Qo": return localize.ordinalNumber(quarter, { unit: "quarter" });
			case "QQQ": return localize.quarter(quarter, {
				width: "abbreviated",
				context: "formatting"
			});
			case "QQQQQ": return localize.quarter(quarter, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.quarter(quarter, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	q: function(date, token, localize) {
		const quarter = Math.ceil((date.getMonth() + 1) / 3);
		switch (token) {
			case "q": return String(quarter);
			case "qq": return addLeadingZeros(quarter, 2);
			case "qo": return localize.ordinalNumber(quarter, { unit: "quarter" });
			case "qqq": return localize.quarter(quarter, {
				width: "abbreviated",
				context: "standalone"
			});
			case "qqqqq": return localize.quarter(quarter, {
				width: "narrow",
				context: "standalone"
			});
			default: return localize.quarter(quarter, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	M: function(date, token, localize) {
		const month = date.getMonth();
		switch (token) {
			case "M":
			case "MM": return lightFormatters.M(date, token);
			case "Mo": return localize.ordinalNumber(month + 1, { unit: "month" });
			case "MMM": return localize.month(month, {
				width: "abbreviated",
				context: "formatting"
			});
			case "MMMMM": return localize.month(month, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.month(month, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	L: function(date, token, localize) {
		const month = date.getMonth();
		switch (token) {
			case "L": return String(month + 1);
			case "LL": return addLeadingZeros(month + 1, 2);
			case "Lo": return localize.ordinalNumber(month + 1, { unit: "month" });
			case "LLL": return localize.month(month, {
				width: "abbreviated",
				context: "standalone"
			});
			case "LLLLL": return localize.month(month, {
				width: "narrow",
				context: "standalone"
			});
			default: return localize.month(month, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	w: function(date, token, localize, options) {
		const week = getWeek(date, options);
		if (token === "wo") return localize.ordinalNumber(week, { unit: "week" });
		return addLeadingZeros(week, token.length);
	},
	I: function(date, token, localize) {
		const isoWeek = getISOWeek(date);
		if (token === "Io") return localize.ordinalNumber(isoWeek, { unit: "week" });
		return addLeadingZeros(isoWeek, token.length);
	},
	d: function(date, token, localize) {
		if (token === "do") return localize.ordinalNumber(date.getDate(), { unit: "date" });
		return lightFormatters.d(date, token);
	},
	D: function(date, token, localize) {
		const dayOfYear = getDayOfYear(date);
		if (token === "Do") return localize.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
		return addLeadingZeros(dayOfYear, token.length);
	},
	E: function(date, token, localize) {
		const dayOfWeek = date.getDay();
		switch (token) {
			case "E":
			case "EE":
			case "EEE": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "EEEEE": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	e: function(date, token, localize, options) {
		const dayOfWeek = date.getDay();
		const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
		switch (token) {
			case "e": return String(localDayOfWeek);
			case "ee": return addLeadingZeros(localDayOfWeek, 2);
			case "eo": return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
			case "eee": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "eeeee": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	c: function(date, token, localize, options) {
		const dayOfWeek = date.getDay();
		const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
		switch (token) {
			case "c": return String(localDayOfWeek);
			case "cc": return addLeadingZeros(localDayOfWeek, token.length);
			case "co": return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
			case "ccc": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "standalone"
			});
			case "ccccc": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return localize.day(dayOfWeek, {
				width: "short",
				context: "standalone"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	i: function(date, token, localize) {
		const dayOfWeek = date.getDay();
		const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
		switch (token) {
			case "i": return String(isoDayOfWeek);
			case "ii": return addLeadingZeros(isoDayOfWeek, token.length);
			case "io": return localize.ordinalNumber(isoDayOfWeek, { unit: "day" });
			case "iii": return localize.day(dayOfWeek, {
				width: "abbreviated",
				context: "formatting"
			});
			case "iiiii": return localize.day(dayOfWeek, {
				width: "narrow",
				context: "formatting"
			});
			case "iiiiii": return localize.day(dayOfWeek, {
				width: "short",
				context: "formatting"
			});
			default: return localize.day(dayOfWeek, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	a: function(date, token, localize) {
		const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "a":
			case "aa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "aaa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "aaaaa": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	b: function(date, token, localize) {
		const hours = date.getHours();
		let dayPeriodEnumValue;
		if (hours === 12) dayPeriodEnumValue = dayPeriodEnum.noon;
		else if (hours === 0) dayPeriodEnumValue = dayPeriodEnum.midnight;
		else dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
		switch (token) {
			case "b":
			case "bb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "bbb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "bbbbb": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	B: function(date, token, localize) {
		const hours = date.getHours();
		let dayPeriodEnumValue;
		if (hours >= 17) dayPeriodEnumValue = dayPeriodEnum.evening;
		else if (hours >= 12) dayPeriodEnumValue = dayPeriodEnum.afternoon;
		else if (hours >= 4) dayPeriodEnumValue = dayPeriodEnum.morning;
		else dayPeriodEnumValue = dayPeriodEnum.night;
		switch (token) {
			case "B":
			case "BB":
			case "BBB": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "abbreviated",
				context: "formatting"
			});
			case "BBBBB": return localize.dayPeriod(dayPeriodEnumValue, {
				width: "narrow",
				context: "formatting"
			});
			default: return localize.dayPeriod(dayPeriodEnumValue, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	h: function(date, token, localize) {
		if (token === "ho") {
			let hours = date.getHours() % 12;
			if (hours === 0) hours = 12;
			return localize.ordinalNumber(hours, { unit: "hour" });
		}
		return lightFormatters.h(date, token);
	},
	H: function(date, token, localize) {
		if (token === "Ho") return localize.ordinalNumber(date.getHours(), { unit: "hour" });
		return lightFormatters.H(date, token);
	},
	K: function(date, token, localize) {
		const hours = date.getHours() % 12;
		if (token === "Ko") return localize.ordinalNumber(hours, { unit: "hour" });
		return addLeadingZeros(hours, token.length);
	},
	k: function(date, token, localize) {
		let hours = date.getHours();
		if (hours === 0) hours = 24;
		if (token === "ko") return localize.ordinalNumber(hours, { unit: "hour" });
		return addLeadingZeros(hours, token.length);
	},
	m: function(date, token, localize) {
		if (token === "mo") return localize.ordinalNumber(date.getMinutes(), { unit: "minute" });
		return lightFormatters.m(date, token);
	},
	s: function(date, token, localize) {
		if (token === "so") return localize.ordinalNumber(date.getSeconds(), { unit: "second" });
		return lightFormatters.s(date, token);
	},
	S: function(date, token) {
		return lightFormatters.S(date, token);
	},
	X: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		if (timezoneOffset === 0) return "Z";
		switch (token) {
			case "X": return formatTimezoneWithOptionalMinutes(timezoneOffset);
			case "XXXX":
			case "XX": return formatTimezone(timezoneOffset);
			default: return formatTimezone(timezoneOffset, ":");
		}
	},
	x: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "x": return formatTimezoneWithOptionalMinutes(timezoneOffset);
			case "xxxx":
			case "xx": return formatTimezone(timezoneOffset);
			default: return formatTimezone(timezoneOffset, ":");
		}
	},
	O: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "O":
			case "OO":
			case "OOO": return "GMT" + formatTimezoneShort(timezoneOffset, ":");
			default: return "GMT" + formatTimezone(timezoneOffset, ":");
		}
	},
	z: function(date, token, _localize) {
		const timezoneOffset = date.getTimezoneOffset();
		switch (token) {
			case "z":
			case "zz":
			case "zzz": return "GMT" + formatTimezoneShort(timezoneOffset, ":");
			default: return "GMT" + formatTimezone(timezoneOffset, ":");
		}
	},
	t: function(date, token, _localize) {
		return addLeadingZeros(Math.trunc(+date / 1e3), token.length);
	},
	T: function(date, token, _localize) {
		return addLeadingZeros(+date, token.length);
	}
};
function formatTimezoneShort(offset, delimiter = "") {
	const sign = offset > 0 ? "-" : "+";
	const absOffset = Math.abs(offset);
	const hours = Math.trunc(absOffset / 60);
	const minutes = absOffset % 60;
	if (minutes === 0) return sign + String(hours);
	return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
	if (offset % 60 === 0) return (offset > 0 ? "-" : "+") + addLeadingZeros(Math.abs(offset) / 60, 2);
	return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
	const sign = offset > 0 ? "-" : "+";
	const absOffset = Math.abs(offset);
	const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
	const minutes = addLeadingZeros(absOffset % 60, 2);
	return sign + hours + delimiter + minutes;
}
const dateLongFormatter = (pattern, formatLong) => {
	switch (pattern) {
		case "P": return formatLong.date({ width: "short" });
		case "PP": return formatLong.date({ width: "medium" });
		case "PPP": return formatLong.date({ width: "long" });
		default: return formatLong.date({ width: "full" });
	}
};
const timeLongFormatter = (pattern, formatLong) => {
	switch (pattern) {
		case "p": return formatLong.time({ width: "short" });
		case "pp": return formatLong.time({ width: "medium" });
		case "ppp": return formatLong.time({ width: "long" });
		default: return formatLong.time({ width: "full" });
	}
};
const dateTimeLongFormatter = (pattern, formatLong) => {
	const matchResult = pattern.match(/(P+)(p+)?/) || [];
	const datePattern = matchResult[1];
	const timePattern = matchResult[2];
	if (!timePattern) return dateLongFormatter(pattern, formatLong);
	let dateTimeFormat;
	switch (datePattern) {
		case "P":
			dateTimeFormat = formatLong.dateTime({ width: "short" });
			break;
		case "PP":
			dateTimeFormat = formatLong.dateTime({ width: "medium" });
			break;
		case "PPP":
			dateTimeFormat = formatLong.dateTime({ width: "long" });
			break;
		default: dateTimeFormat = formatLong.dateTime({ width: "full" });
	}
	return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong)).replace("{{time}}", timeLongFormatter(timePattern, formatLong));
};
const longFormatters = {
	p: timeLongFormatter,
	P: dateTimeLongFormatter
};
const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;
const throwTokens = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function isProtectedDayOfYearToken(token) {
	return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
	return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format, input) {
	const _message = message(token, format, input);
	console.warn(_message);
	if (throwTokens.includes(token)) throw new RangeError(_message);
}
function message(token, format, input) {
	const subject = token[0] === "Y" ? "years" : "days of the month";
	return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const formattingTokensRegExp$2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
const longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
const escapedStringRegExp$2 = /^'([^]*?)'?$/;
const doubleQuoteRegExp$2 = /''/g;
const unescapedLatinCharacterRegExp$2 = /[a-zA-Z]/;
/**
* The {@link format} function options.
*/
/**
* @name format
* @alias formatDate
* @category Common Helpers
* @summary Format the date.
*
* @description
* Return the formatted date string in the given format. The result may vary by locale.
*
* > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
* > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* The characters wrapped between two single quotes characters (') are escaped.
* Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
* (see the last example)
*
* Format of the string is based on Unicode Technical Standard #35:
* https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
* with a few additions (see note 7 below the table).
*
* Accepted patterns:
* | Unit                            | Pattern | Result examples                   | Notes |
* |---------------------------------|---------|-----------------------------------|-------|
* | Era                             | G..GGG  | AD, BC                            |       |
* |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
* |                                 | GGGGG   | A, B                              |       |
* | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
* |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
* |                                 | yy      | 44, 01, 00, 17                    | 5     |
* |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
* |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
* |                                 | yyyyy   | ...                               | 3,5   |
* | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
* |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
* |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
* |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
* |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
* |                                 | YYYYY   | ...                               | 3,5   |
* | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
* |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
* |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
* |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
* |                                 | RRRRR   | ...                               | 3,5,7 |
* | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
* |                                 | uu      | -43, 01, 1900, 2017               | 5     |
* |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
* |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
* |                                 | uuuuu   | ...                               | 3,5   |
* | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
* |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
* |                                 | QQ      | 01, 02, 03, 04                    |       |
* |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
* |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
* | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
* |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
* |                                 | qq      | 01, 02, 03, 04                    |       |
* |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
* |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
* |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
* | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
* |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
* |                                 | MM      | 01, 02, ..., 12                   |       |
* |                                 | MMM     | Jan, Feb, ..., Dec                |       |
* |                                 | MMMM    | January, February, ..., December  | 2     |
* |                                 | MMMMM   | J, F, ..., D                      |       |
* | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
* |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
* |                                 | LL      | 01, 02, ..., 12                   |       |
* |                                 | LLL     | Jan, Feb, ..., Dec                |       |
* |                                 | LLLL    | January, February, ..., December  | 2     |
* |                                 | LLLLL   | J, F, ..., D                      |       |
* | Local week of year              | w       | 1, 2, ..., 53                     |       |
* |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
* |                                 | ww      | 01, 02, ..., 53                   |       |
* | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
* |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
* |                                 | II      | 01, 02, ..., 53                   | 7     |
* | Day of month                    | d       | 1, 2, ..., 31                     |       |
* |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
* |                                 | dd      | 01, 02, ..., 31                   |       |
* | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
* |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
* |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
* |                                 | DDD     | 001, 002, ..., 365, 366           |       |
* |                                 | DDDD    | ...                               | 3     |
* | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
* |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
* |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
* |                                 | ii      | 01, 02, ..., 07                   | 7     |
* |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
* |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
* |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
* |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
* | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
* |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
* |                                 | ee      | 02, 03, ..., 01                   |       |
* |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | eeeee   | M, T, W, T, F, S, S               |       |
* |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
* |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
* |                                 | cc      | 02, 03, ..., 01                   |       |
* |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
* |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
* |                                 | ccccc   | M, T, W, T, F, S, S               |       |
* |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
* | AM, PM                          | a..aa   | AM, PM                            |       |
* |                                 | aaa     | am, pm                            |       |
* |                                 | aaaa    | a.m., p.m.                        | 2     |
* |                                 | aaaaa   | a, p                              |       |
* | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
* |                                 | bbb     | am, pm, noon, midnight            |       |
* |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
* |                                 | bbbbb   | a, p, n, mi                       |       |
* | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
* |                                 | BBBB    | at night, in the morning, ...     | 2     |
* |                                 | BBBBB   | at night, in the morning, ...     |       |
* | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
* |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
* |                                 | hh      | 01, 02, ..., 11, 12               |       |
* | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
* |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
* |                                 | HH      | 00, 01, 02, ..., 23               |       |
* | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
* |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
* |                                 | KK      | 01, 02, ..., 11, 00               |       |
* | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
* |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
* |                                 | kk      | 24, 01, 02, ..., 23               |       |
* | Minute                          | m       | 0, 1, ..., 59                     |       |
* |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
* |                                 | mm      | 00, 01, ..., 59                   |       |
* | Second                          | s       | 0, 1, ..., 59                     |       |
* |                                 | so      | 0th, 1st, ..., 59th               | 7     |
* |                                 | ss      | 00, 01, ..., 59                   |       |
* | Fraction of second              | S       | 0, 1, ..., 9                      |       |
* |                                 | SS      | 00, 01, ..., 99                   |       |
* |                                 | SSS     | 000, 001, ..., 999                |       |
* |                                 | SSSS    | ...                               | 3     |
* | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
* |                                 | XX      | -0800, +0530, Z                   |       |
* |                                 | XXX     | -08:00, +05:30, Z                 |       |
* |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
* |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
* | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
* |                                 | xx      | -0800, +0530, +0000               |       |
* |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
* |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
* |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
* | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
* |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
* | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
* |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
* | Seconds timestamp               | t       | 512969520                         | 7     |
* |                                 | tt      | ...                               | 3,7   |
* | Milliseconds timestamp          | T       | 512969520900                      | 7     |
* |                                 | TT      | ...                               | 3,7   |
* | Long localized date             | P       | 04/29/1453                        | 7     |
* |                                 | PP      | Apr 29, 1453                      | 7     |
* |                                 | PPP     | April 29th, 1453                  | 7     |
* |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
* | Long localized time             | p       | 12:00 AM                          | 7     |
* |                                 | pp      | 12:00:00 AM                       | 7     |
* |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
* |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
* | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
* |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
* |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
* |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
* Notes:
* 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
*    are the same as "stand-alone" units, but are different in some languages.
*    "Formatting" units are declined according to the rules of the language
*    in the context of a date. "Stand-alone" units are always nominative singular:
*
*    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
*
*    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
*
* 2. Any sequence of the identical letters is a pattern, unless it is escaped by
*    the single quote characters (see below).
*    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
*    the output will be the same as default pattern for this unit, usually
*    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
*    are marked with "2" in the last column of the table.
*
*    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
*
*    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
*
*    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
*
*    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
*
*    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
*
* 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
*    The output will be padded with zeros to match the length of the pattern.
*
*    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
*
* 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
*    These tokens represent the shortest form of the quarter.
*
* 5. The main difference between `y` and `u` patterns are B.C. years:
*
*    | Year | `y` | `u` |
*    |------|-----|-----|
*    | AC 1 |   1 |   1 |
*    | BC 1 |   1 |   0 |
*    | BC 2 |   2 |  -1 |
*
*    Also `yy` always returns the last two digits of a year,
*    while `uu` pads single digit years to 2 characters and returns other years unchanged:
*
*    | Year | `yy` | `uu` |
*    |------|------|------|
*    | 1    |   01 |   01 |
*    | 14   |   14 |   14 |
*    | 376  |   76 |  376 |
*    | 1453 |   53 | 1453 |
*
*    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
*    except local week-numbering years are dependent on `options.weekStartsOn`
*    and `options.firstWeekContainsDate` (compare [getISOWeekYear](https://date-fns.org/docs/getISOWeekYear)
*    and [getWeekYear](https://date-fns.org/docs/getWeekYear)).
*
* 6. Specific non-location timezones are currently unavailable in `date-fns`,
*    so right now these tokens fall back to GMT timezones.
*
* 7. These patterns are not in the Unicode Technical Standard #35:
*    - `i`: ISO day of week
*    - `I`: ISO week of year
*    - `R`: ISO week-numbering year
*    - `t`: seconds timestamp
*    - `T`: milliseconds timestamp
*    - `o`: ordinal number modifier
*    - `P`: long localized date
*    - `p`: long localized time
*
* 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
*    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
*    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
*
* @param date - The original date
* @param format - The string of tokens
* @param options - An object with options
*
* @returns The formatted date string
*
* @throws `date` must not be Invalid Date
* @throws `options.locale` must contain `localize` property
* @throws `options.locale` must contain `formatLong` property
* @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
* @throws format string contains an unescaped latin alphabet character
*
* @example
* // Represent 11 February 2014 in middle-endian format:
* const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
* //=> '02/11/2014'
*
* @example
* // Represent 2 July 2014 in Esperanto:
* import { eoLocale } from 'date-fns/locale/eo'
* const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
*   locale: eoLocale
* })
* //=> '2-a de julio 2014'
*
* @example
* // Escape string by single quote characters:
* const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
* //=> "3 o'clock"
*/
function format(date, formatStr, options) {
	const defaultOptions = getDefaultOptions$1();
	const locale = options?.locale ?? defaultOptions.locale ?? enUS;
	const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions.firstWeekContainsDate ?? defaultOptions.locale?.options?.firstWeekContainsDate ?? 1;
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const originalDate = toDate(date, options?.in);
	if (!isValid(originalDate)) throw new RangeError("Invalid time value");
	let parts = formatStr.match(longFormattingTokensRegExp$1).map((substring) => {
		const firstCharacter = substring[0];
		if (firstCharacter === "p" || firstCharacter === "P") {
			const longFormatter = longFormatters[firstCharacter];
			return longFormatter(substring, locale.formatLong);
		}
		return substring;
	}).join("").match(formattingTokensRegExp$2).map((substring) => {
		if (substring === "''") return {
			isToken: false,
			value: "'"
		};
		const firstCharacter = substring[0];
		if (firstCharacter === "'") return {
			isToken: false,
			value: cleanEscapedString$2(substring)
		};
		if (formatters[firstCharacter]) return {
			isToken: true,
			value: substring
		};
		if (firstCharacter.match(unescapedLatinCharacterRegExp$2)) throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
		return {
			isToken: false,
			value: substring
		};
	});
	if (locale.localize.preprocessor) parts = locale.localize.preprocessor(originalDate, parts);
	const formatterOptions = {
		firstWeekContainsDate,
		weekStartsOn,
		locale
	};
	return parts.map((part) => {
		if (!part.isToken) return part.value;
		const token = part.value;
		if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) warnOrThrowProtectedError(token, formatStr, String(date));
		const formatter = formatters[token[0]];
		return formatter(originalDate, token, locale.localize, formatterOptions);
	}).join("");
}
function cleanEscapedString$2(input) {
	const matched = input.match(escapedStringRegExp$2);
	if (!matched) return input;
	return matched[1].replace(doubleQuoteRegExp$2, "'");
}
/**
* The {@link getISODay} function options.
*/
/**
* @name getISODay
* @category Weekday Helpers
* @summary Get the day of the ISO week of the given date.
*
* @description
* Get the day of the ISO week of the given date,
* which is 7 for Sunday, 1 for Monday etc.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @param date - The given date
* @param options - An object with options
*
* @returns The day of ISO week
*
* @example
* // Which day of the ISO week is 26 February 2012?
* const result = getISODay(new Date(2012, 1, 26))
* //=> 7
*/
function getISODay(date, options) {
	const day = toDate(date, options?.in).getDay();
	return day === 0 ? 7 : day;
}
var Setter = class {
	subPriority = 0;
	validate(_utcDate, _options) {
		return true;
	}
};
var ValueSetter = class extends Setter {
	constructor(value, validateValue, setValue, priority, subPriority) {
		super();
		this.value = value;
		this.validateValue = validateValue;
		this.setValue = setValue;
		this.priority = priority;
		if (subPriority) this.subPriority = subPriority;
	}
	validate(date, options) {
		return this.validateValue(date, this.value, options);
	}
	set(date, flags, options) {
		return this.setValue(date, flags, this.value, options);
	}
};
var Parser = class {
	run(dateString, token, match, options) {
		const result = this.parse(dateString, token, match, options);
		if (!result) return null;
		return {
			setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
			rest: result.rest
		};
	}
	validate(_utcDate, _value, _options) {
		return true;
	}
};
var EraParser = class extends Parser {
	priority = 140;
	parse(dateString, token, match) {
		switch (token) {
			case "G":
			case "GG":
			case "GGG": return match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
			case "GGGGG": return match.era(dateString, { width: "narrow" });
			default: return match.era(dateString, { width: "wide" }) || match.era(dateString, { width: "abbreviated" }) || match.era(dateString, { width: "narrow" });
		}
	}
	set(date, flags, value) {
		flags.era = value;
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"R",
		"u",
		"t",
		"T"
	];
};
const numericPatterns = {
	month: /^(1[0-2]|0?\d)/,
	date: /^(3[0-1]|[0-2]?\d)/,
	dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
	week: /^(5[0-3]|[0-4]?\d)/,
	hour23h: /^(2[0-3]|[0-1]?\d)/,
	hour24h: /^(2[0-4]|[0-1]?\d)/,
	hour11h: /^(1[0-1]|0?\d)/,
	hour12h: /^(1[0-2]|0?\d)/,
	minute: /^[0-5]?\d/,
	second: /^[0-5]?\d/,
	singleDigit: /^\d/,
	twoDigits: /^\d{1,2}/,
	threeDigits: /^\d{1,3}/,
	fourDigits: /^\d{1,4}/,
	anyDigitsSigned: /^-?\d+/,
	singleDigitSigned: /^-?\d/,
	twoDigitsSigned: /^-?\d{1,2}/,
	threeDigitsSigned: /^-?\d{1,3}/,
	fourDigitsSigned: /^-?\d{1,4}/
};
const timezonePatterns = {
	basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
	basic: /^([+-])(\d{2})(\d{2})|Z/,
	basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
	extended: /^([+-])(\d{2}):(\d{2})|Z/,
	extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function mapValue(parseFnResult, mapFn) {
	if (!parseFnResult) return parseFnResult;
	return {
		value: mapFn(parseFnResult.value),
		rest: parseFnResult.rest
	};
}
function parseNumericPattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	return {
		value: parseInt(matchResult[0], 10),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseTimezonePattern(pattern, dateString) {
	const matchResult = dateString.match(pattern);
	if (!matchResult) return null;
	if (matchResult[0] === "Z") return {
		value: 0,
		rest: dateString.slice(1)
	};
	const sign = matchResult[1] === "+" ? 1 : -1;
	const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
	const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
	const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
	return {
		value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
		rest: dateString.slice(matchResult[0].length)
	};
}
function parseAnyDigitsSigned(dateString) {
	return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigit, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigits, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigits, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigits, dateString);
		default: return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
	}
}
function parseNDigitsSigned(n, dateString) {
	switch (n) {
		case 1: return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
		case 2: return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
		case 3: return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
		case 4: return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
		default: return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
	}
}
function dayPeriodEnumToHours(dayPeriod) {
	switch (dayPeriod) {
		case "morning": return 4;
		case "evening": return 17;
		case "pm":
		case "noon":
		case "afternoon": return 12;
		default: return 0;
	}
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
	const isCommonEra = currentYear > 0;
	const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
	let result;
	if (absCurrentYear <= 50) result = twoDigitYear || 100;
	else {
		const rangeEnd = absCurrentYear + 50;
		const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
		const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
		result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
	}
	return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex$1(year) {
	return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
var YearParser = class extends Parser {
	priority = 130;
	incompatibleTokens = [
		"Y",
		"R",
		"u",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "yy"
		});
		switch (token) {
			case "y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value) {
		const currentYear = date.getFullYear();
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, 1);
			date.setHours(0, 0, 0, 0);
			return date;
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
var LocalWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token, match) {
		const valueCallback = (year) => ({
			year,
			isTwoDigitYear: token === "YY"
		});
		switch (token) {
			case "Y": return mapValue(parseNDigits(4, dateString), valueCallback);
			case "Yo": return mapValue(match.ordinalNumber(dateString, { unit: "year" }), valueCallback);
			default: return mapValue(parseNDigits(token.length, dateString), valueCallback);
		}
	}
	validate(_date, value) {
		return value.isTwoDigitYear || value.year > 0;
	}
	set(date, flags, value, options) {
		const currentYear = getWeekYear(date, options);
		if (value.isTwoDigitYear) {
			const normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
			date.setFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
			date.setHours(0, 0, 0, 0);
			return startOfWeek(date, options);
		}
		const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
		date.setFullYear(year, 0, options.firstWeekContainsDate);
		date.setHours(0, 0, 0, 0);
		return startOfWeek(date, options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
var ISOWeekYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "R") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		const firstWeekOfYear = constructFrom(date, 0);
		firstWeekOfYear.setFullYear(value, 0, 4);
		firstWeekOfYear.setHours(0, 0, 0, 0);
		return startOfISOWeek(firstWeekOfYear);
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"u",
		"Q",
		"q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
var ExtendedYearParser = class extends Parser {
	priority = 130;
	parse(dateString, token) {
		if (token === "u") return parseNDigitsSigned(4, dateString);
		return parseNDigitsSigned(token.length, dateString);
	}
	set(date, _flags, value) {
		date.setFullYear(value, 0, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"G",
		"y",
		"Y",
		"R",
		"w",
		"I",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var QuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "Q":
			case "QQ": return parseNDigits(token.length, dateString);
			case "Qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "QQQ": return match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "QQQQQ": return match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.quarter(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var StandAloneQuarterParser = class extends Parser {
	priority = 120;
	parse(dateString, token, match) {
		switch (token) {
			case "q":
			case "qq": return parseNDigits(token.length, dateString);
			case "qo": return match.ordinalNumber(dateString, { unit: "quarter" });
			case "qqq": return match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "qqqqq": return match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.quarter(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.quarter(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 4;
	}
	set(date, _flags, value) {
		date.setMonth((value - 1) * 3, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var MonthParser = class extends Parser {
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"L",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "M": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "MM": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Mo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "MMM": return match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "MMMMM": return match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.month(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.month(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
};
var StandAloneMonthParser = class extends Parser {
	priority = 110;
	parse(dateString, token, match) {
		const valueCallback = (value) => value - 1;
		switch (token) {
			case "L": return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback);
			case "LL": return mapValue(parseNDigits(2, dateString), valueCallback);
			case "Lo": return mapValue(match.ordinalNumber(dateString, { unit: "month" }), valueCallback);
			case "LLL": return match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "LLLLL": return match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.month(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.month(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.month(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		date.setMonth(value, 1);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
/**
* The {@link setWeek} function options.
*/
/**
* @name setWeek
* @category Week Helpers
* @summary Set the local week to the given date.
*
* @description
* Set the local week to the given date, saving the weekday number.
* The exact calculation depends on the values of
* `options.weekStartsOn` (which is the index of the first day of the week)
* and `options.firstWeekContainsDate` (which is the day of January, which is always in
* the first week of the week-numbering year)
*
* Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param week - The week of the new date
* @param options - An object with options
*
* @returns The new date with the local week set
*
* @example
* // Set the 1st week to 2 January 2005 with default options:
* const result = setWeek(new Date(2005, 0, 2), 1)
* //=> Sun Dec 26 2004 00:00:00
*
* @example
* // Set the 1st week to 2 January 2005,
* // if Monday is the first day of the week,
* // and the first week of the year always contains 4 January:
* const result = setWeek(new Date(2005, 0, 2), 1, {
*   weekStartsOn: 1,
*   firstWeekContainsDate: 4
* })
* //=> Sun Jan 4 2004 00:00:00
*/
function setWeek(date, week, options) {
	const date_ = toDate(date, options?.in);
	const diff = getWeek(date_, options) - week;
	date_.setDate(date_.getDate() - diff * 7);
	return toDate(date_, options?.in);
}
var LocalWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "w": return parseNumericPattern(numericPatterns.week, dateString);
			case "wo": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value, options) {
		return startOfWeek(setWeek(date, value, options), options);
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"i",
		"t",
		"T"
	];
};
/**
* The {@link setISOWeek} function options.
*/
/**
* @name setISOWeek
* @category ISO Week Helpers
* @summary Set the ISO week to the given date.
*
* @description
* Set the ISO week to the given date, saving the weekday number.
*
* ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The `Date` type of the context function.
*
* @param date - The date to be changed
* @param week - The ISO week of the new date
* @param options - An object with options
*
* @returns The new date with the ISO week set
*
* @example
* // Set the 53rd ISO week to 7 August 2004:
* const result = setISOWeek(new Date(2004, 7, 7), 53)
* //=> Sat Jan 01 2005 00:00:00
*/
function setISOWeek(date, week, options) {
	const _date = toDate(date, options?.in);
	const diff = getISOWeek(_date, options) - week;
	_date.setDate(_date.getDate() - diff * 7);
	return _date;
}
var ISOWeekParser = class extends Parser {
	priority = 100;
	parse(dateString, token, match) {
		switch (token) {
			case "I": return parseNumericPattern(numericPatterns.week, dateString);
			case "Io": return match.ordinalNumber(dateString, { unit: "week" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 53;
	}
	set(date, _flags, value) {
		return startOfISOWeek(setISOWeek(date, value));
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"e",
		"c",
		"t",
		"T"
	];
};
const DAYS_IN_MONTH = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
const DAYS_IN_MONTH_LEAP_YEAR = [
	31,
	29,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var DateParser = class extends Parser {
	priority = 90;
	subPriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "d": return parseNumericPattern(numericPatterns.date, dateString);
			case "do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		const isLeapYear = isLeapYearIndex$1(date.getFullYear());
		const month = date.getMonth();
		if (isLeapYear) return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
		else return value >= 1 && value <= DAYS_IN_MONTH[month];
	}
	set(date, _flags, value) {
		date.setDate(value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"w",
		"I",
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var DayOfYearParser = class extends Parser {
	priority = 90;
	subpriority = 1;
	parse(dateString, token, match) {
		switch (token) {
			case "D":
			case "DD": return parseNumericPattern(numericPatterns.dayOfYear, dateString);
			case "Do": return match.ordinalNumber(dateString, { unit: "date" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(date, value) {
		if (isLeapYearIndex$1(date.getFullYear())) return value >= 1 && value <= 366;
		else return value >= 1 && value <= 365;
	}
	set(date, _flags, value) {
		date.setMonth(0, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"Y",
		"R",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"I",
		"d",
		"E",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
/**
* The {@link setDay} function options.
*/
/**
* @name setDay
* @category Weekday Helpers
* @summary Set the day of the week to the given date.
*
* @description
* Set the day of the week to the given date.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param day - The day of the week of the new date
* @param options - An object with options.
*
* @returns The new date with the day of the week set
*
* @example
* // Set week day to Sunday, with the default weekStartsOn of Sunday:
* const result = setDay(new Date(2014, 8, 1), 0)
* //=> Sun Aug 31 2014 00:00:00
*
* @example
* // Set week day to Sunday, with a weekStartsOn of Monday:
* const result = setDay(new Date(2014, 8, 1), 0, { weekStartsOn: 1 })
* //=> Sun Sep 07 2014 00:00:00
*/
function setDay(date, day, options) {
	const defaultOptions = getDefaultOptions$1();
	const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
	const date_ = toDate(date, options?.in);
	const currentDay = date_.getDay();
	const dayIndex = (day % 7 + 7) % 7;
	const delta = 7 - weekStartsOn;
	return addDays(date_, day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7, options);
}
var DayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		switch (token) {
			case "E":
			case "EE":
			case "EEE": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEE": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"D",
		"i",
		"e",
		"c",
		"t",
		"T"
	];
};
var LocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "e":
			case "ee": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "eo": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "eee": return match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeee": return match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"c",
		"t",
		"T"
	];
};
var StandAloneLocalDayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match, options) {
		const valueCallback = (value) => {
			const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
			return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
		};
		switch (token) {
			case "c":
			case "cc": return mapValue(parseNDigits(token.length, dateString), valueCallback);
			case "co": return mapValue(match.ordinalNumber(dateString, { unit: "day" }), valueCallback);
			case "ccc": return match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "ccccc": return match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
			default: return match.day(dateString, {
				width: "wide",
				context: "standalone"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "standalone"
			}) || match.day(dateString, {
				width: "short",
				context: "standalone"
			}) || match.day(dateString, {
				width: "narrow",
				context: "standalone"
			});
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 6;
	}
	set(date, _flags, value, options) {
		date = setDay(date, value, options);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"R",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"I",
		"d",
		"D",
		"E",
		"i",
		"e",
		"t",
		"T"
	];
};
/**
* The {@link setISODay} function options.
*/
/**
* @name setISODay
* @category Weekday Helpers
* @summary Set the day of the ISO week to the given date.
*
* @description
* Set the day of the ISO week to the given date.
* ISO week starts with Monday.
* 7 is the index of Sunday, 1 is the index of Monday, etc.
*
* @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
* @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
*
* @param date - The date to be changed
* @param day - The day of the ISO week of the new date
* @param options - An object with options
*
* @returns The new date with the day of the ISO week set
*
* @example
* // Set Sunday to 1 September 2014:
* const result = setISODay(new Date(2014, 8, 1), 7)
* //=> Sun Sep 07 2014 00:00:00
*/
function setISODay(date, day, options) {
	const date_ = toDate(date, options?.in);
	return addDays(date_, day - getISODay(date_, options), options);
}
var ISODayParser = class extends Parser {
	priority = 90;
	parse(dateString, token, match) {
		const valueCallback = (value) => {
			if (value === 0) return 7;
			return value;
		};
		switch (token) {
			case "i":
			case "ii": return parseNDigits(token.length, dateString);
			case "io": return match.ordinalNumber(dateString, { unit: "day" });
			case "iii": return mapValue(match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiii": return mapValue(match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			case "iiiiii": return mapValue(match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
			default: return mapValue(match.day(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.day(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.day(dateString, {
				width: "short",
				context: "formatting"
			}) || match.day(dateString, {
				width: "narrow",
				context: "formatting"
			}), valueCallback);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 7;
	}
	set(date, _flags, value) {
		date = setISODay(date, value);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"y",
		"Y",
		"u",
		"q",
		"Q",
		"M",
		"L",
		"w",
		"d",
		"D",
		"E",
		"e",
		"c",
		"t",
		"T"
	];
};
var AMPMParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "a":
			case "aa":
			case "aaa": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "aaaaa": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"b",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
var AMPMMidnightParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "b":
			case "bb":
			case "bbb": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "bbbbb": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"B",
		"H",
		"k",
		"t",
		"T"
	];
};
var DayPeriodParser = class extends Parser {
	priority = 80;
	parse(dateString, token, match) {
		switch (token) {
			case "B":
			case "BB":
			case "BBB": return match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			case "BBBBB": return match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
			default: return match.dayPeriod(dateString, {
				width: "wide",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "abbreviated",
				context: "formatting"
			}) || match.dayPeriod(dateString, {
				width: "narrow",
				context: "formatting"
			});
		}
	}
	set(date, _flags, value) {
		date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"t",
		"T"
	];
};
var Hour1to12Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "h": return parseNumericPattern(numericPatterns.hour12h, dateString);
			case "ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 12;
	}
	set(date, _flags, value) {
		const isPM = date.getHours() >= 12;
		if (isPM && value < 12) date.setHours(value + 12, 0, 0, 0);
		else if (!isPM && value === 12) date.setHours(0, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"H",
		"K",
		"k",
		"t",
		"T"
	];
};
var Hour0to23Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "H": return parseNumericPattern(numericPatterns.hour23h, dateString);
			case "Ho": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 23;
	}
	set(date, _flags, value) {
		date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"K",
		"k",
		"t",
		"T"
	];
};
var Hour0To11Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "K": return parseNumericPattern(numericPatterns.hour11h, dateString);
			case "Ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 11;
	}
	set(date, _flags, value) {
		if (date.getHours() >= 12 && value < 12) date.setHours(value + 12, 0, 0, 0);
		else date.setHours(value, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"h",
		"H",
		"k",
		"t",
		"T"
	];
};
var Hour1To24Parser = class extends Parser {
	priority = 70;
	parse(dateString, token, match) {
		switch (token) {
			case "k": return parseNumericPattern(numericPatterns.hour24h, dateString);
			case "ko": return match.ordinalNumber(dateString, { unit: "hour" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 1 && value <= 24;
	}
	set(date, _flags, value) {
		const hours = value <= 24 ? value % 24 : value;
		date.setHours(hours, 0, 0, 0);
		return date;
	}
	incompatibleTokens = [
		"a",
		"b",
		"h",
		"H",
		"K",
		"t",
		"T"
	];
};
var MinuteParser = class extends Parser {
	priority = 60;
	parse(dateString, token, match) {
		switch (token) {
			case "m": return parseNumericPattern(numericPatterns.minute, dateString);
			case "mo": return match.ordinalNumber(dateString, { unit: "minute" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setMinutes(value, 0, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var SecondParser = class extends Parser {
	priority = 50;
	parse(dateString, token, match) {
		switch (token) {
			case "s": return parseNumericPattern(numericPatterns.second, dateString);
			case "so": return match.ordinalNumber(dateString, { unit: "second" });
			default: return parseNDigits(token.length, dateString);
		}
	}
	validate(_date, value) {
		return value >= 0 && value <= 59;
	}
	set(date, _flags, value) {
		date.setSeconds(value, 0);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var FractionOfSecondParser = class extends Parser {
	priority = 30;
	parse(dateString, token) {
		const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
		return mapValue(parseNDigits(token.length, dateString), valueCallback);
	}
	set(date, _flags, value) {
		date.setMilliseconds(value);
		return date;
	}
	incompatibleTokens = ["t", "T"];
};
var ISOTimezoneWithZParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "X": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "XX": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "XXXX": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "XXXXX": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"x"
	];
};
var ISOTimezoneParser = class extends Parser {
	priority = 10;
	parse(dateString, token) {
		switch (token) {
			case "x": return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
			case "xx": return parseTimezonePattern(timezonePatterns.basic, dateString);
			case "xxxx": return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
			case "xxxxx": return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
			default: return parseTimezonePattern(timezonePatterns.extended, dateString);
		}
	}
	set(date, flags, value) {
		if (flags.timestampIsSet) return date;
		return constructFrom(date, date.getTime() - getTimezoneOffsetInMilliseconds(date) - value);
	}
	incompatibleTokens = [
		"t",
		"T",
		"X"
	];
};
var TimestampSecondsParser = class extends Parser {
	priority = 40;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
var TimestampMillisecondsParser = class extends Parser {
	priority = 20;
	parse(dateString) {
		return parseAnyDigitsSigned(dateString);
	}
	set(date, _flags, value) {
		return [constructFrom(date, value), { timestampIsSet: true }];
	}
	incompatibleTokens = "*";
};
new EraParser(), new YearParser(), new LocalWeekYearParser(), new ISOWeekYearParser(), new ExtendedYearParser(), new QuarterParser(), new StandAloneQuarterParser(), new MonthParser(), new StandAloneMonthParser(), new LocalWeekParser(), new ISOWeekParser(), new DateParser(), new DayOfYearParser(), new DayParser(), new LocalDayParser(), new StandAloneLocalDayParser(), new ISODayParser(), new AMPMParser(), new AMPMMidnightParser(), new DayPeriodParser(), new Hour1to12Parser(), new Hour0to23Parser(), new Hour0To11Parser(), new Hour1To24Parser(), new MinuteParser(), new SecondParser(), new FractionOfSecondParser(), new ISOTimezoneWithZParser(), new ISOTimezoneParser(), new TimestampSecondsParser(), new TimestampMillisecondsParser();
/**
* Adds two numbers.
*
* Arguments:
* - `a`: The first number.
* - `b`: The second number.
*/
const AddApi = {
	name: "add",
	returnType: "number",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Subtracts one number from another.
*
* Arguments:
* - `a`: The number to subtract from.
* - `b`: The number to subtract.
*/
const SubtractApi = {
	name: "subtract",
	returnType: "number",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Multiplies two numbers.
*
* Arguments:
* - `a`: The first number.
* - `b`: The second number.
*/
const MultiplyApi = {
	name: "multiply",
	returnType: "number",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Divides one number by another.
*
* Arguments:
* - `a`: The dividend.
* - `b`: The divisor.
*/
const DivideApi = {
	name: "divide",
	returnType: "number",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Checks if two values are equal.
*
* Arguments:
* - `a`: The first value.
* - `b`: The second value.
*/
const EqualsApi = {
	name: "equals",
	returnType: "boolean",
	schema: objectType({
		"a": anyType().refine((v) => v !== void 0, "Required"),
		"b": anyType().refine((v) => v !== void 0, "Required")
	})
};
/**
* Checks if two values are not equal.
*
* Arguments:
* - `a`: The first value.
* - `b`: The second value.
*/
const NotEqualsApi = {
	name: "not_equals",
	returnType: "boolean",
	schema: objectType({
		"a": anyType().refine((v) => v !== void 0, "Required"),
		"b": anyType().refine((v) => v !== void 0, "Required")
	})
};
/**
* Checks if the first number is greater than the second.
*
* Arguments:
* - `a`: The number to compare.
* - `b`: The threshold number.
*/
const GreaterThanApi = {
	name: "greater_than",
	returnType: "boolean",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Checks if the first number is less than the second.
*
* Arguments:
* - `a`: The number to compare.
* - `b`: The threshold number.
*/
const LessThanApi = {
	name: "less_than",
	returnType: "boolean",
	schema: objectType({
		"a": preprocessType((v) => v === null ? void 0 : v, coerce.number()),
		"b": preprocessType((v) => v === null ? void 0 : v, coerce.number())
	})
};
/**
* Performs a logical AND operation on a list of boolean values.
*
* Arguments:
* - `values`: List of items to evaluate (minimum 2).
*/
const AndApi = {
	name: "and",
	returnType: "boolean",
	schema: objectType({ "values": arrayType(anyType()).min(2) })
};
/**
* Performs a logical OR operation on a list of boolean values.
*
* Arguments:
* - `values`: List of items to evaluate (minimum 2).
*/
const OrApi = {
	name: "or",
	returnType: "boolean",
	schema: objectType({ "values": arrayType(anyType()).min(2) })
};
/**
* Performs a logical NOT operation on a boolean value.
*
* Arguments:
* - `value`: The value to negate.
*/
const NotApi = {
	name: "not",
	returnType: "boolean",
	schema: objectType({ "value": anyType().refine((v) => v !== void 0, "Required") })
};
/**
* Checks if a string contains a substring.
*
* Arguments:
* - `string`: The source string.
* - `substring`: The substring to search for.
*/
const ContainsApi = {
	name: "contains",
	returnType: "boolean",
	schema: objectType({
		"string": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()),
		"substring": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType())
	})
};
/**
* Checks if a string starts with a prefix.
*
* Arguments:
* - `string`: The source string.
* - `prefix`: The prefix to search for.
*/
const StartsWithApi = {
	name: "starts_with",
	returnType: "boolean",
	schema: objectType({
		"string": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()),
		"prefix": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType())
	})
};
/**
* Checks if a string ends with a suffix.
*
* Arguments:
* - `string`: The source string.
* - `suffix`: The suffix to search for.
*/
const EndsWithApi = {
	name: "ends_with",
	returnType: "boolean",
	schema: objectType({
		"string": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()),
		"suffix": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType())
	})
};
/**
* Checks that the value is not null, undefined, or empty.
*
* Arguments:
* - `value`: The value to check.
*/
const RequiredApi = {
	name: "required",
	returnType: "boolean",
	schema: objectType({ "value": anyType().refine((v) => v !== void 0, "Required") })
};
/**
* Checks that the value matches a regular expression string.
*
* Arguments:
* - `value`: The string to test.
* - `pattern`: The regex pattern string.
*/
const RegexApi = {
	name: "regex",
	returnType: "boolean",
	schema: objectType({
		"value": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()),
		"pattern": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType())
	})
};
/**
* Checks string length constraints.
*
* Arguments:
* - `value`: The value to inspect.
* - `min`: Optional minimum length.
* - `max`: Optional maximum length.
*/
const LengthApi = {
	name: "length",
	returnType: "boolean",
	schema: objectType({
		"value": anyType().refine((v) => v !== void 0, "Required"),
		"min": coerce.number().optional(),
		"max": coerce.number().optional()
	}).refine((data) => data.min !== void 0 || data.max !== void 0, { message: "Must provide either 'min' or 'max'" })
};
/**
* Checks numeric range constraints.
*
* Arguments:
* - `value`: The value to inspect.
* - `min`: Optional minimum value.
* - `max`: Optional maximum value.
*/
const NumericApi = {
	name: "numeric",
	returnType: "boolean",
	schema: objectType({
		"value": coerce.number(),
		"min": coerce.number().optional(),
		"max": coerce.number().optional()
	}).refine((data) => data.min !== void 0 || data.max !== void 0, { message: "Must provide either 'min' or 'max'" })
};
/**
* Checks that the value is a valid email address.
*
* Arguments:
* - `value`: The string to inspect.
*/
const EmailApi = {
	name: "email",
	returnType: "boolean",
	schema: objectType({ "value": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()) })
};
/**
* Performs string interpolation on a value, resolving model paths and functions.
*
* Interpolation uses the `${expression}` syntax. Supported expressions include:
* - **JSON Pointer paths**: `${/absolute/path}` or `${relative/path}` to access data model values.
* - **Function calls**: `${now()}` or with named arguments like `${formatDate(value:${/currentDate}, format:'MM-dd')}`.
*
* To include a literal `${` sequence, escape it as `\\${`.
*
* @example
* "Hello ${/user/name}"
* "Total: ${formatCurrency(value:${/total}, currency:'USD')}"
*
* Arguments:
* - `value`: The string template to interpolate.
*/
const FormatStringApi = {
	name: "formatString",
	returnType: "any",
	schema: objectType({ "value": coerce.string() })
};
/**
* Formats a number with the specified grouping and decimal precision.
*
* Arguments:
* - `value`: The number to format.
* - `decimals`: Optional number of decimal places.
* - `grouping`: Whether to use thousands separators, defaults to true.
*/
const FormatNumberApi = {
	name: "formatNumber",
	returnType: "string",
	schema: objectType({
		"value": coerce.number(),
		"decimals": coerce.number().optional(),
		"grouping": booleanType().default(true)
	})
};
/**
* Formats a number as a currency string.
*
* Arguments:
* - `value`: The number to format.
* - `currency`: Currency code (e.g. "USD"), defaults to "USD".
* - `decimals`: Optional number of decimal places.
* - `grouping`: Whether to use thousands separators, defaults to true.
*/
const FormatCurrencyApi = {
	name: "formatCurrency",
	returnType: "string",
	schema: objectType({
		"value": coerce.number(),
		"currency": coerce.string(),
		"decimals": coerce.number().optional(),
		"grouping": booleanType().default(true)
	})
};
/**
* Formats a timestamp into a string using a pattern.
*
* Token Reference:
* - Year: 'yy' (26), 'yyyy' (2026)
* - Month: 'M' (1), 'MM' (01), 'MMM' (Jan), 'MMMM' (January)
* - Day: 'd' (1), 'dd' (01), 'E' (Tue), 'EEEE' (Tuesday)
* - Hour (12h): 'h' (1-12), 'hh' (01-12) - requires 'a' for AM/PM
* - Hour (24h): 'H' (0-23), 'HH' (00-23) - Military Time
* - Minute: 'mm' (00-59), Second: 'ss' (00-59)
* - Period: 'a' (AM/PM)
*
* Arguments:
* - `value`: The date to format.
* - `format`: A Unicode TR35 date pattern string.
*/
const FormatDateApi = {
	name: "formatDate",
	returnType: "string",
	schema: objectType({
		"value": anyType().refine((v) => v !== void 0, "Required"),
		"format": coerce.string()
	})
};
/**
* Returns a localized string based on the Common Locale Data Repository (CLDR) plural category of the count.
*
* Requires an 'other' fallback. For English, just use 'one' and 'other'.
*
* Arguments:
* - `value`: Count to evaluate.
* - `zero`: Optional text for count 0.
* - `one`: Optional text for count 1.
* - `two`: Optional text for count 2.
* - `few`: Optional text for few items.
* - `many`: Optional text for many items.
* - `other`: Default text fallback.
*/
const PluralizeApi = {
	name: "pluralize",
	returnType: "string",
	schema: objectType({
		"value": coerce.number(),
		"zero": coerce.string().optional(),
		"one": coerce.string().optional(),
		"two": coerce.string().optional(),
		"few": coerce.string().optional(),
		"many": coerce.string().optional(),
		"other": coerce.string()
	})
};
/**
* Opens the specified URL in a browser or handler. This function has no return value.
*
* Arguments:
* - `url`: The address URL string.
*/
const OpenUrlApi = {
	name: "openUrl",
	returnType: "void",
	schema: objectType({ "url": preprocessType((v) => v === void 0 ? void 0 : String(v), stringType()) })
};
/**
* Implementation of the addition function.
* Adds two numbers 'a' and 'b'.
*/
const AddImplementation = createFunctionImplementation(AddApi, (args) => args.a + args.b);
/**
* Implementation of the subtraction function.
* Subtracts 'b' from 'a'.
*/
const SubtractImplementation = createFunctionImplementation(SubtractApi, (args) => args.a - args.b);
/**
* Implementation of the multiplication function.
* Multiplies 'a' and 'b'.
*/
const MultiplyImplementation = createFunctionImplementation(MultiplyApi, (args) => args.a * args.b);
/**
* Implementation of the division function.
* Divides 'a' by 'b'. Returns NaN if inputs are invalid, and Infinity if dividing by zero.
*/
const DivideImplementation = createFunctionImplementation(DivideApi, (args) => {
	const a = args.a;
	const b = args.b;
	if (a === void 0 || a === null || b === void 0 || b === null) return NaN;
	const numA = Number(a);
	const numB = Number(b);
	if (Number.isNaN(numA) || Number.isNaN(numB)) return NaN;
	if (numB === 0) return Infinity;
	return numA / numB;
});
/**
* Implementation of the equality comparison.
* Checks if 'a' is strictly equal to 'b'.
*/
const EqualsImplementation = createFunctionImplementation(EqualsApi, (args) => args.a === args.b);
/**
* Implementation of the inequality comparison.
* Checks if 'a' is not strictly equal to 'b'.
*/
const NotEqualsImplementation = createFunctionImplementation(NotEqualsApi, (args) => args.a !== args.b);
/**
* Implementation of the greater-than comparison.
* Checks if 'a' is greater than 'b'.
*/
const GreaterThanImplementation = createFunctionImplementation(GreaterThanApi, (args) => args.a > args.b);
/**
* Implementation of the less-than comparison.
* Checks if 'a' is less than 'b'.
*/
const LessThanImplementation = createFunctionImplementation(LessThanApi, (args) => args.a < args.b);
/**
* Implementation of the logical AND function.
* Returns true if all values in the array are truthy.
*/
const AndImplementation = createFunctionImplementation(AndApi, (args) => {
	return args.values.every((v) => !!v);
});
/**
* Implementation of the logical OR function.
* Returns true if at least one value in the array is truthy.
*/
const OrImplementation = createFunctionImplementation(OrApi, (args) => {
	return args.values.some((v) => !!v);
});
/**
* Implementation of the logical NOT function.
* Returns the negation of the value.
*/
const NotImplementation = createFunctionImplementation(NotApi, (args) => !args.value);
/**
* Implementation of the string contains function.
* Checks if 'string' contains 'substring'.
*/
const ContainsImplementation = createFunctionImplementation(ContainsApi, (args) => args.string.includes(args.substring));
/**
* Implementation of the string starts-with function.
* Checks if 'string' starts with 'prefix'.
*/
const StartsWithImplementation = createFunctionImplementation(StartsWithApi, (args) => args.string.startsWith(args.prefix));
/**
* Implementation of the string ends-with function.
* Checks if 'string' ends with 'suffix'.
*/
const EndsWithImplementation = createFunctionImplementation(EndsWithApi, (args) => args.string.endsWith(args.suffix));
/**
* Implementation of the required validation function.
* Checks if the value is not null, undefined, empty string, or empty array.
*/
const RequiredImplementation = createFunctionImplementation(RequiredApi, (args) => {
	const val = args.value;
	if (val === null || val === void 0) return false;
	if (typeof val === "string" && val === "") return false;
	if (Array.isArray(val) && val.length === 0) return false;
	return true;
});
/**
* Implementation of the regex validation function.
* Checks if the value matches the regular expression pattern.
* Throws A2uiExpressionError if the pattern is invalid.
*/
const RegexImplementation = createFunctionImplementation(RegexApi, (args) => {
	try {
		return new RegExp(args.pattern).test(args.value);
	} catch (e) {
		throw new A2uiExpressionError(`Invalid regex pattern: ${args.pattern}`, "regex", e);
	}
});
/**
* Implementation of the length validation function.
* Checks if the length of the string or array is within [min, max] range.
*/
const LengthImplementation = createFunctionImplementation(LengthApi, (args) => {
	const val = args.value;
	let len = 0;
	if (typeof val === "string" || Array.isArray(val)) len = val.length;
	if (args.min !== void 0 && !isNaN(args.min) && len < args.min) return false;
	if (args.max !== void 0 && !isNaN(args.max) && len > args.max) return false;
	return true;
});
/**
* Implementation of the numeric validation function.
* Checks if the value is a number and within [min, max] range.
*/
const NumericImplementation = createFunctionImplementation(NumericApi, (args) => {
	if (isNaN(args.value)) return false;
	if (args.min !== void 0 && !isNaN(args.min) && args.value < args.min) return false;
	if (args.max !== void 0 && !isNaN(args.max) && args.value > args.max) return false;
	return true;
});
/**
* Implementation of the email validation function.
* Uses a simple regex to check if the value looks like an email address.
* Note: This is a basic check and not fully compliant with all email standards.
*/
const EmailImplementation = createFunctionImplementation(EmailApi, (args) => {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(args.value);
});
/**
* Coerces a value to a string following the a2ui_protocol.md §"Type conversion" rules:
* - Numbers/Booleans: Standard string representation.
* - null/undefined: An empty string "".
* - Objects/Arrays: Stringified as JSON.
*/
function coerceToString(value) {
	if (value === null || value === void 0) return "";
	if (typeof value === "object") try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
	return String(value);
}
/**
* Implementation of the string formatting function.
* Parses a template string and resolves any embedded expressions using the provided context.
* Returns a computed signal that updates when referenced signals change.
*/
const FormatStringImplementation = createFunctionImplementation(FormatStringApi, (args, context) => {
	const template = args.value;
	const parts = new ExpressionParser().parse(template);
	if (parts.length === 0) return "";
	const dynamicParts = parts.map((part) => {
		if (typeof part !== "object" || part === null || Array.isArray(part)) return part;
		return context.resolveSignal(part);
	});
	return computed(() => {
		return dynamicParts.map((p) => {
			return coerceToString(isSignal(p) ? getValue(p) : p);
		}).join("");
	});
});
const numberFormatCache = /* @__PURE__ */ new Map();
function getNumberFormat(locale, decimals, grouping) {
	const key = `${locale ?? "default"}:${decimals ?? "undef"}:${grouping ?? "true"}`;
	let formatter = numberFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: grouping
		});
		numberFormatCache.set(key, formatter);
	}
	return formatter;
}
/**
* Creates the number formatting function implementation.
*/
function createFormatNumberImplementation(locale) {
	return createFunctionImplementation(FormatNumberApi, (args) => {
		if (isNaN(args.value)) return "";
		try {
			return getNumberFormat(locale, args.decimals, args.grouping).format(args.value);
		} catch (e) {
			console.warn("Error formatting number:", e);
			return args.decimals !== void 0 ? args.value.toFixed(args.decimals) : String(args.value);
		}
	});
}
createFormatNumberImplementation();
const currencyFormatCache = /* @__PURE__ */ new Map();
function getCurrencyFormat(locale, currency, decimals, grouping) {
	const key = `${locale ?? "default"}:${currency}:${decimals ?? "undef"}:${grouping ?? "true"}`;
	let formatter = currencyFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: grouping
		});
		currencyFormatCache.set(key, formatter);
	}
	return formatter;
}
/**
* Creates the currency formatting function implementation.
*/
function createFormatCurrencyImplementation(locale) {
	return createFunctionImplementation(FormatCurrencyApi, (args) => {
		if (isNaN(args.value)) return "";
		try {
			return getCurrencyFormat(locale, args.currency, args.decimals, args.grouping).format(args.value);
		} catch (e) {
			console.warn("Error formatting currency:", e);
			return args.value.toFixed(args.decimals ?? 2);
		}
	});
}
createFormatCurrencyImplementation();
/**
* Implementation of the date formatting function.
* Formats a date using date-fns or returns ISO string.
*/
const FormatDateImplementation = createFunctionImplementation(FormatDateApi, (args) => {
	if (!args.value) return "";
	const date = new Date(args.value);
	if (isNaN(date.getTime())) return "";
	try {
		if (args.format === "ISO") return date.toISOString();
		return format(date, args.format);
	} catch (e) {
		console.warn("Error formatting date:", e);
		return date.toISOString();
	}
});
const pluralRulesCache = /* @__PURE__ */ new Map();
function getPluralRules(locale) {
	const key = locale ?? "default";
	let rules = pluralRulesCache.get(key);
	if (!rules) {
		rules = new Intl.PluralRules(locale);
		pluralRulesCache.set(key, rules);
	}
	return rules;
}
/**
* Creates the pluralization function implementation.
*/
function createPluralizeImplementation(locale) {
	return createFunctionImplementation(PluralizeApi, (args) => {
		try {
			const rule = getPluralRules(locale).select(args.value);
			return String(args[rule] ?? args.other ?? "");
		} catch (e) {
			console.warn("Error in pluralize:", e);
			return String(args.other ?? "");
		}
	});
}
createPluralizeImplementation();
/**
* Implementation of the open URL action.
* Opens the specified URL in a new window/tab.
*/
const OpenUrlImplementation = createFunctionImplementation(OpenUrlApi, (args) => {
	if (args.url && typeof window !== "undefined" && window.open) {
		const baseHref = typeof window.location !== "undefined" && window.location.href ? window.location.href : void 0;
		let url;
		try {
			url = baseHref ? new URL(args.url, baseHref) : new URL(args.url);
		} catch (e) {
			throw new A2uiExpressionError(`Invalid URL specified: ${args.url}`, "openUrl", e);
		}
		if (url.protocol !== "https:" && url.protocol !== "http:") throw new A2uiExpressionError(`Unsupported URL scheme: ${url.protocol}`, "openUrl");
		window.open(url.href, "_blank", "noopener,noreferrer");
	}
});
/**
* Creates standard function implementations for the Basic Catalog.
*
* @param options Configuration options.
* @param options.locale Optional locale to close-over.
*/
function createBasicCatalogFunctions(options) {
	const locale = options?.locale;
	return [
		AddImplementation,
		SubtractImplementation,
		MultiplyImplementation,
		DivideImplementation,
		EqualsImplementation,
		NotEqualsImplementation,
		GreaterThanImplementation,
		LessThanImplementation,
		AndImplementation,
		OrImplementation,
		NotImplementation,
		ContainsImplementation,
		StartsWithImplementation,
		EndsWithImplementation,
		RequiredImplementation,
		RegexImplementation,
		LengthImplementation,
		NumericImplementation,
		EmailImplementation,
		FormatStringImplementation,
		createFormatNumberImplementation(locale),
		createFormatCurrencyImplementation(locale),
		FormatDateImplementation,
		createPluralizeImplementation(locale),
		OpenUrlImplementation
	];
}
/**
* Standard function implementations for the Basic Catalog.
* These functions cover arithmetic, comparison, logic, string manipulation, validation, and formatting.
*/
const BASIC_FUNCTIONS = createBasicCatalogFunctions();
const CommonProps = {
	"accessibility": AccessibilityAttributesSchema.optional(),
	"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional()
};
const TextApi = {
	name: "Text",
	schema: objectType({
		...CommonProps,
		"text": DynamicStringSchema.describe("The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."),
		"variant": enumType([
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"caption",
			"body"
		]).default("body").describe("A hint for the base text style.").optional()
	}).strict()
};
const ImageApi = {
	name: "Image",
	schema: objectType({
		...CommonProps,
		"url": DynamicStringSchema.describe("The URL of the image to display."),
		"description": DynamicStringSchema.describe("The accessibility description of the image.").optional(),
		"fit": enumType([
			"contain",
			"cover",
			"fill",
			"none",
			"scaleDown"
		]).default("fill").describe("Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.").optional(),
		"variant": enumType([
			"icon",
			"avatar",
			"smallFeature",
			"mediumFeature",
			"largeFeature",
			"header"
		]).default("mediumFeature").describe("A hint for the image size and style.").optional()
	}).strict()
};
const ICON_NAMES = [
	"accountCircle",
	"add",
	"arrowBack",
	"arrowForward",
	"attachFile",
	"calendarToday",
	"call",
	"camera",
	"check",
	"close",
	"delete",
	"download",
	"edit",
	"event",
	"error",
	"fastForward",
	"favorite",
	"favoriteOff",
	"folder",
	"help",
	"home",
	"info",
	"locationOn",
	"lock",
	"lockOpen",
	"mail",
	"menu",
	"moreVert",
	"moreHoriz",
	"notificationsOff",
	"notifications",
	"pause",
	"payment",
	"person",
	"phone",
	"photo",
	"play",
	"print",
	"refresh",
	"rewind",
	"search",
	"send",
	"settings",
	"share",
	"shoppingCart",
	"skipNext",
	"skipPrevious",
	"star",
	"starHalf",
	"starOff",
	"stop",
	"upload",
	"visibility",
	"visibilityOff",
	"volumeDown",
	"volumeMute",
	"volumeOff",
	"volumeUp",
	"warning"
];
const IconApi = {
	name: "Icon",
	schema: objectType({
		...CommonProps,
		name: unionType([
			enumType(ICON_NAMES),
			objectType({ svgPath: stringType().describe("Custom SVG path data") }).strict(),
			objectType({ path: stringType() }).strict()
		]).describe("The name of the icon to display.")
	}).strict()
};
const VideoApi = {
	name: "Video",
	schema: objectType({
		...CommonProps,
		url: DynamicStringSchema.describe("The URL of the video to display.")
	}).strict()
};
const AudioPlayerApi = {
	name: "AudioPlayer",
	schema: objectType({
		...CommonProps,
		url: DynamicStringSchema.describe("The URL of the audio to be played."),
		description: DynamicStringSchema.describe("A description of the audio, such as a title or summary.").optional()
	}).strict()
};
const RowApi = {
	name: "Row",
	schema: objectType({
		...CommonProps,
		"children": childList({ description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID." }),
		"justify": enumType([
			"center",
			"end",
			"spaceAround",
			"spaceBetween",
			"spaceEvenly",
			"start",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.").optional(),
		"align": enumType([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').").optional()
	}).strict().describe("A layout component that arranges its children horizontally. To create a grid layout, nest Columns within this Row.")
};
const ColumnApi = {
	name: "Column",
	schema: objectType({
		...CommonProps,
		"children": childList({ description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID." }),
		"justify": enumType([
			"start",
			"center",
			"end",
			"spaceBetween",
			"spaceAround",
			"spaceEvenly",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.").optional(),
		"align": enumType([
			"center",
			"end",
			"start",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.").optional()
	}).strict().describe("A layout component that arranges its children vertically. To create a grid layout, nest Rows within this Column.")
};
const ListApi = {
	name: "List",
	schema: objectType({
		...CommonProps,
		"children": childList({ description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list." }),
		"direction": enumType(["vertical", "horizontal"]).default("vertical").describe("The direction in which the list items are laid out.").optional(),
		"align": enumType([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis.").optional(),
		"listStyle": enumType([
			"ordered",
			"unordered",
			"none"
		]).describe("The style of the list (ordered, unordered, or none).").optional()
	}).strict()
};
const CardApi = {
	name: "Card",
	schema: objectType({
		...CommonProps,
		"child": componentId({ description: "The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID. Do NOT define the child component inline." })
	}).strict()
};
const TabsApi = {
	name: "Tabs",
	schema: objectType({
		...CommonProps,
		"tabs": arrayType(objectType({
			"title": DynamicStringSchema.describe("The tab title."),
			"child": componentId({ description: "The ID of the child component. Do NOT define the component inline." })
		}).strict()).min(1).describe("An array of objects, where each object defines a tab with a title and a child component.")
	}).strict()
};
const ModalApi = {
	name: "Modal",
	schema: objectType({
		...CommonProps,
		"trigger": componentId({ description: "The ID of the component that opens the modal when interacted with (e.g., a button). Do NOT define the component inline." }),
		"content": componentId({ description: "The ID of the component to be displayed inside the modal. Do NOT define the component inline." })
	}).strict()
};
const DividerApi = {
	name: "Divider",
	schema: objectType({
		...CommonProps,
		"axis": enumType(["horizontal", "vertical"]).default("horizontal").describe("The orientation of the divider.").optional()
	}).strict()
};
const ButtonApi = {
	name: "Button",
	schema: objectType({
		...CommonProps,
		"child": componentId({ description: "The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline." }),
		"variant": enumType([
			"default",
			"primary",
			"borderless"
		]).default("default").describe("A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.").optional(),
		"action": ActionSchema.optional(),
		...CheckableSchema.shape
	}).strict()
};
const TextFieldApi = {
	name: "TextField",
	schema: objectType({
		...CommonProps,
		"label": DynamicStringSchema.describe("The text label for the input field."),
		"value": DynamicStringSchema.describe("The value of the text field.").optional(),
		"variant": enumType([
			"longText",
			"number",
			"shortText",
			"obscured"
		]).default("shortText").describe("The type of input field to display.").optional(),
		"validationRegexp": stringType().describe("A regular expression used for client-side validation of the input.").optional(),
		...CheckableSchema.shape
	}).strict()
};
const CheckBoxApi = {
	name: "CheckBox",
	schema: objectType({
		...CommonProps,
		"label": DynamicStringSchema.describe("The text to display next to the checkbox."),
		"value": DynamicBooleanSchema.describe("The current state of the checkbox (true for checked, false for unchecked)."),
		...CheckableSchema.shape
	}).strict()
};
const ChoicePickerApi = {
	name: "ChoicePicker",
	schema: objectType({
		...CommonProps,
		"label": DynamicStringSchema.describe("The label for the group of options.").optional(),
		"variant": enumType(["multipleSelection", "mutuallyExclusive"]).default("mutuallyExclusive").describe("A hint for how the choice picker should be displayed and behave.").optional(),
		"options": arrayType(objectType({
			"label": DynamicStringSchema.describe("The text to display for this option."),
			"value": stringType().describe("The stable value associated with this option.")
		}).strict()).describe("The list of available options to choose from."),
		"value": DynamicStringListSchema.describe("The list of currently selected values. This should be bound to a string array in the data model."),
		"displayStyle": enumType(["checkbox", "chips"]).default("checkbox").describe("The display style of the component.").optional(),
		"filterable": booleanType().default(false).describe("If true, displays a search input to filter the options.").optional(),
		...CheckableSchema.shape
	}).strict().describe("A component that allows selecting one or more options from a list.")
};
const SliderApi = {
	name: "Slider",
	schema: objectType({
		...CommonProps,
		"label": DynamicStringSchema.describe("The label for the slider.").optional(),
		"min": numberType().default(0).describe("The minimum value of the slider.").optional(),
		"max": numberType().describe("The maximum value of the slider."),
		"value": DynamicNumberSchema.describe("The current value of the slider."),
		...CheckableSchema.shape
	}).strict()
};
const DateTimeInputApi = {
	name: "DateTimeInput",
	schema: objectType({
		...CommonProps,
		"value": DynamicStringSchema.describe("The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string."),
		"enableDate": booleanType().default(false).describe("If true, allows the user to select a date.").optional(),
		"enableTime": booleanType().default(false).describe("If true, allows the user to select a time.").optional(),
		"min": unionType([
			DynamicStringSchema,
			stringType().date(),
			stringType().time(),
			stringType().datetime()
		]).describe("The minimum allowed date/time in ISO 8601 format.").optional(),
		"max": unionType([
			DynamicStringSchema,
			stringType().date(),
			stringType().time(),
			stringType().datetime()
		]).describe("The maximum allowed date/time in ISO 8601 format.").optional(),
		"label": DynamicStringSchema.describe("The text label for the input field.").optional(),
		...CheckableSchema.shape
	}).strict()
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var s$4 = class extends Event {
	constructor(s, t, e, o) {
		super("context-request", {
			bubbles: !0,
			composed: !0
		}), this.context = s, this.contextTarget = t, this.callback = e, this.subscribe = o ?? !1;
	}
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function n$3(n) {
	return n;
}
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s$3 = class {
	constructor(t, s, i, h) {
		if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (t, s) => {
			this.unsubscribe && (this.unsubscribe !== s && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(t, s)), this.unsubscribe = s;
		}, this.host = t, void 0 !== s.context) {
			const t = s;
			this.context = t.context, this.callback = t.callback, this.subscribe = t.subscribe ?? !1;
		} else this.context = s, this.callback = i, this.subscribe = h ?? !1;
		this.host.addController(this);
	}
	hostConnected() {
		this.dispatchRequest();
	}
	hostDisconnected() {
		this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
	}
	dispatchRequest() {
		this.host.dispatchEvent(new s$4(this.context, this.host, this.t, this.subscribe));
	}
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2022 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function c$3({ context: c, subscribe: e }) {
	return (o, n) => {
		"object" == typeof n ? n.addInitializer((function() {
			new s$3(this, {
				context: c,
				callback: (t) => {
					o.set.call(this, t);
				},
				subscribe: e
			});
		})) : o.constructor.addInitializer(((o) => {
			new s$3(o, {
				context: c,
				callback: (t) => {
					o[n] = t;
				},
				subscribe: e
			});
		}));
	};
}
/**
* Contexts used to inject dependencies into the Lit renderer.
*/
const Context$1 = { markdown: n$3(Symbol.for("A2UIMarkdown")) };
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$1 = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
const e$3 = (t) => (...e) => ({
	_$litDirective$: t,
	values: e
});
var i$2 = class {
	constructor(t) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(t, e, i) {
		this._$Ct = t, this._$AM = e, this._$Ci = i;
	}
	_$AS(t, e) {
		return this.update(t, e);
	}
	update(t, e) {
		return this.render(...e);
	}
};
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const { I: t } = j$2, i$1 = (o) => o, r$1 = (o) => void 0 === o.strings, s$1 = () => document.createComment(""), v = (o, n, e) => {
	const l = o._$AA.parentNode, d = void 0 === n ? o._$AB : n._$AA;
	if (void 0 === e) {
		const i = l.insertBefore(s$1(), d), n = l.insertBefore(s$1(), d);
		e = new t(i, n, o, o.options);
	} else {
		const t = e._$AB.nextSibling, n = e._$AM, c = n !== o;
		if (c) {
			let t;
			e._$AQ?.(o), e._$AM = o, void 0 !== e._$AP && (t = o._$AU) !== n._$AU && e._$AP(t);
		}
		if (t !== d || c) {
			let o = e._$AA;
			for (; o !== t;) {
				const t = i$1(o).nextSibling;
				i$1(l).insertBefore(o, d), o = t;
			}
		}
	}
	return e;
}, u$1 = (o, t, i = o) => (o._$AI(t, i), o), m = {}, p = (o, t = m) => o._$AH = t, M = (o) => o._$AH, h$1 = (o) => {
	o._$AR(), o._$AA.remove();
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const s = (i, t) => {
	const e = i._$AN;
	if (void 0 === e) return !1;
	for (const i of e) i._$AO?.(t, !1), s(i, t);
	return !0;
};
const o$2 = (i) => {
	let t, e;
	do {
		if (void 0 === (t = i._$AM)) break;
		e = t._$AN, e.delete(i), i = t;
	} while (0 === e?.size);
};
const r = (i) => {
	for (let t; t = i._$AM; i = t) {
		let e = t._$AN;
		if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
		else if (e.has(i)) break;
		e.add(i), c$1(t);
	}
};
function h(i) {
	void 0 !== this._$AN ? (o$2(this), this._$AM = i, r(this)) : this._$AM = i;
}
function n$1(i, t = !1, e = 0) {
	const r = this._$AH, h = this._$AN;
	if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s(r[i], !1), o$2(r[i]);
	else null != r && (s(r, !1), o$2(r));
	else s(this, i);
}
const c$1 = (i) => {
	i.type == t$1.CHILD && (i._$AP ??= n$1, i._$AQ ??= h);
};
var f = class extends i$2 {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(i, t, e) {
		super._$AT(i, t, e), r(this), this.isConnected = i._$AU;
	}
	_$AO(i, t = !0) {
		i !== this.isConnected && (this.isConnected = i, i ? this.reconnected?.() : this.disconnected?.()), t && (s(this, i), o$2(this));
	}
	setValue(t) {
		if (r$1(this._$Ct)) this._$Ct._$AI(t, this);
		else {
			const i = [...this._$Ct._$AH];
			i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var e$1 = class extends i$2 {
	constructor(i) {
		if (super(i), this.it = A, i.type !== t$1.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(r) {
		if (r === A || null == r) return this._t = void 0, this.it = r;
		if (r === E$1) return r;
		if ("string" != typeof r) throw Error(this.constructor.directiveName + "() called with a non-string value");
		if (r === this.it) return this._t;
		this.it = r;
		const s = [r];
		return s.raw = s, this._t = {
			_$litType$: this.constructor.resultType,
			strings: s,
			values: []
		};
	}
};
e$1.directiveName = "unsafeHTML", e$1.resultType = 1;
const o$1 = e$3(e$1);
var MarkdownDirective = class MarkdownDirective extends f {
	constructor() {
		super(...arguments);
		this.lastValue = null;
		this.lastRenderer = void 0;
		this.lastTagClassMap = null;
	}
	update(_part, [value, markdownRenderer, markdownOptions]) {
		const jsonTagClassMap = JSON.stringify(markdownOptions?.tagClassMap);
		if (this.lastValue === value && this.lastRenderer === markdownRenderer && jsonTagClassMap === this.lastTagClassMap) return E$1;
		this.lastValue = value;
		this.lastRenderer = markdownRenderer;
		this.lastTagClassMap = jsonTagClassMap;
		return this.render(value, markdownRenderer, markdownOptions);
	}
	render(value, markdownRenderer, markdownOptions) {
		if (markdownRenderer) {
			const renderFn = typeof markdownRenderer === "function" ? markdownRenderer : markdownRenderer?.["render"]?.bind(markdownRenderer);
			if (renderFn) {
				Promise.resolve(renderFn(value, markdownOptions)).then((renderedStr) => {
					if (this.isConnected) this.setValue(o$1(renderedStr));
				});
				return b$1`<span class="no-markdown-renderer">${value}</span>`;
			}
		}
		if (!MarkdownDirective.defaultMarkdownWarningLogged) {
			console.warn("[MarkdownDirective]", "can't render markdown because no markdown renderer is configured.\n", "Use `@a2ui/markdown-it`, or your own markdown renderer.");
			MarkdownDirective.defaultMarkdownWarningLogged = true;
		}
		return b$1`<span class="no-markdown-renderer">${value}</span>`;
	}
};
MarkdownDirective.defaultMarkdownWarningLogged = false;
const markdown$1 = e$3(MarkdownDirective);
/**
* The actual CSS markup of the default A2UI theme.
*
* This should be only variable definitions, so they can pierce into the
* shadow DOM of components.
*
* It uses `:where()` to ensure zero specificity, allowing page styles to
* override these defaults as needed without having to deal with specificity.
*
* By default, the theme follows the user's `color-scheme` preference, but
* developers can force either the light/dark variants using the `a2ui-light`
* or `a2ui-dark` classes on the root element of their app.
*/
const DEFAULT_CSS = `
  :where(:root) {
    color-scheme: light dark;
  }

  :where(.a2ui-dark) {
    color-scheme: dark;
  }

  :where(.a2ui-light) {
    color-scheme: light;
  }

  :where(:root), :where(.a2ui-dark), :where(.a2ui-light) {
    --a2ui-color-background: light-dark(#eee, #111);
    --a2ui-color-on-background: light-dark(#333, #eee);

    --a2ui-color-surface: light-dark(
      color-mix(in oklab, var(--a2ui-color-background) 85%, white),
      color-mix(in oklab, var(--a2ui-color-background) 95%, white)
    );
    --a2ui-color-on-surface: light-dark(#333, #eee);

    --a2ui-color-primary: #17e;
    --a2ui-color-primary-light: ${computeColorVariant("light", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-dark: ${computeColorVariant("dark", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-hover: ${computeColorVariant("hover", {
	darkVar: "--a2ui-color-primary-dark",
	lightVar: "--a2ui-color-primary-light"
})};
    --a2ui-color-on-primary: #fff;

    --a2ui-color-secondary: light-dark(#ddd, #333);
    --a2ui-color-secondary-light: ${computeColorVariant("light", { colorVar: "--a2ui-color-secondary" })};
    --a2ui-color-secondary-dark: ${computeColorVariant("dark", {
	colorVar: "--a2ui-color-secondary",
	percentage: 95
})};
    --a2ui-color-secondary-hover: ${computeColorVariant("hover", {
	darkVar: "--a2ui-color-secondary-dark",
	lightVar: "--a2ui-color-secondary-light"
})};
    --a2ui-color-on-secondary: light-dark(#333, #eee);

    --a2ui-border-radius: 0.25rem;
    --a2ui-color-border: light-dark(#ccc, #444);
    --a2ui-border-width: 1px;
    --a2ui-border: 1px solid var(--a2ui-color-border, #ccc);

    --a2ui-font-family-title: inherit;
    --a2ui-font-family-monospace: monospace;
    --a2ui-color-input: light-dark(#fff, #2a2a2a);
    --a2ui-color-on-input: light-dark(#333, #eee);

    --a2ui-grid-base: 0.5rem;
    --a2ui-spacing-xs: calc(var(--a2ui-spacing-s) / 2);
    --a2ui-spacing-s: calc(var(--a2ui-spacing-m) / 2);
    --a2ui-spacing-m: var(--a2ui-grid-base);
    --a2ui-spacing-l: calc(var(--a2ui-spacing-m) * 2);
    --a2ui-spacing-xl: calc(var(--a2ui-spacing-l) * 2);

    --a2ui-font-size: 1rem;
    --a2ui-font-scale: 1.2;
    --a2ui-font-size-xs: calc(var(--a2ui-font-size-s) / var(--a2ui-font-scale));
    --a2ui-font-size-s: calc(var(--a2ui-font-size-m) / var(--a2ui-font-scale));
    --a2ui-font-size-m: var(--a2ui-font-size);
    --a2ui-font-size-l: calc(var(--a2ui-font-size-m) * var(--a2ui-font-scale));
    --a2ui-font-size-xl: calc(var(--a2ui-font-size-l) * var(--a2ui-font-scale));
    --a2ui-font-size-2xl: calc(var(--a2ui-font-size-xl) * var(--a2ui-font-scale));

    --a2ui-line-height-headings: 1.2;
    --a2ui-line-height-body: 1.5;
  }
`;
/**
* Caches the default stylesheet so it is only created once.
*/
let defaultStyleSheet;
/**
* Retrieves the default CSSStyleSheet for A2UI components.
*
* If the stylesheet doesn't exist, it creates and initializes one with default
* theme variables from the DEFAULT_CSS string.
*
* @returns The default CSSStyleSheet used by A2UI.
*/
function getDefaultStyleSheet() {
	if (!defaultStyleSheet) {
		defaultStyleSheet = new CSSStyleSheet();
		defaultStyleSheet.replaceSync(DEFAULT_CSS);
	}
	return defaultStyleSheet;
}
/**
* Injects CSS variables for the A2UI basic catalog into the document.
*
* This method is used by the A2UI-provided basic catalogs of each renderer
* so design token values can be shared across all of them.
*
* It is only meant to be used by the basic catalog implementations provided
* by `@a2ui/lit`, `@a2ui/angular` and `@a2ui/react`, and should not be
* considered as part of the A2UI spec. This package is just a convenient
* location for it.
*
* Users may redefine the values of the CSS variables exposed in the default
* stylesheet above (and the specific ones exposed by each basic catalog
* package) to customize the appearance of the items of the basic catalog.
*/
function injectBasicCatalogStyles(targetRoot) {
	if (typeof document === "undefined") return;
	const sheet = getDefaultStyleSheet();
	const docSheets = typeof document !== "undefined" ? document.adoptedStyleSheets : null;
	if (docSheets && typeof docSheets.includes === "function" && !docSheets.includes(sheet)) try {
		document.adoptedStyleSheets = [...docSheets, sheet];
	} catch {}
	if (targetRoot && targetRoot !== document) {
		const targetSheets = targetRoot.adoptedStyleSheets;
		if (targetSheets && typeof targetSheets.includes === "function" && !targetSheets.includes(sheet)) try {
			targetRoot.adoptedStyleSheets = [...targetSheets, sheet];
		} catch {}
	}
}
/**
* Computes the formula for light, dark, or hover variants of a color.
* By default, light variants are mixed with white and dark variants with black.
* @param type The type of variant to compute ('light', 'dark', 'hover').
* @param options Options containing variable names, percentages, and optional mix color.
* @returns The CSS formula string.
*/
function computeColorVariant(type, options) {
	switch (type) {
		case "light": {
			const opt = options;
			return `color-mix(in oklab, var(${opt.colorVar}) ${opt.percentage ?? 85}%, ${opt.mixColor ?? "white"})`;
		}
		case "dark": {
			const opt = options;
			return `color-mix(in oklab, var(${opt.colorVar}) ${opt.percentage ?? 85}%, ${opt.mixColor ?? "black"})`;
		}
		case "hover": {
			const opt = options;
			return `light-dark(var(${opt.darkVar}), var(${opt.lightVar}))`;
		}
	}
}
/**
* Pure function that acts as a generic container for A2UI components in Lit.
*
* @param context The component context defining the data model and type to render.
* @param catalog The catalog of component implementations.
* @returns A Lit TemplateResult representing the resolved component, or `nothing`.
*/
function renderA2uiNode(context, catalog) {
	const type = context.componentModel.type;
	const implementation = catalog.components.get(type);
	if (!implementation) {
		console.warn(`Component implementation not found for type: ${type}`);
		return A;
	}
	const tagName = implementation.tagName;
	if (tagName) {
		const tag = s$5(tagName);
		return u$2`<${tag} .context=${context}></${tag}>`;
	}
	return A;
}
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-surface")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = i$6;
	let _surface_decorators;
	let _surface_initializers = [];
	let _surface_extraInitializers = [];
	let __hasRoot_decorators;
	let __hasRoot_initializers = [];
	let __hasRoot_extraInitializers = [];
	var A2uiSurface = class extends _classSuper {
		static {
			_classThis = this;
		}
		constructor() {
			super(...arguments);
			this.#surface_accessor_storage = __runInitializers(this, _surface_initializers, void 0);
			this.#_hasRoot_accessor_storage = (__runInitializers(this, _surface_extraInitializers), __runInitializers(this, __hasRoot_initializers, false));
			/**
			* Subscription cleanup function.
			* @internal
			*/
			this.unsubscribe = __runInitializers(this, __hasRoot_extraInitializers);
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_surface_decorators = [n$7({ type: Object })];
			__hasRoot_decorators = [r$5()];
			__esDecorate(this, null, _surface_decorators, {
				kind: "accessor",
				name: "surface",
				static: false,
				private: false,
				access: {
					has: (obj) => "surface" in obj,
					get: (obj) => obj.surface,
					set: (obj, value) => {
						obj.surface = value;
					}
				},
				metadata: _metadata
			}, _surface_initializers, _surface_extraInitializers);
			__esDecorate(this, null, __hasRoot_decorators, {
				kind: "accessor",
				name: "_hasRoot",
				static: false,
				private: false,
				access: {
					has: (obj) => "_hasRoot" in obj,
					get: (obj) => obj._hasRoot,
					set: (obj, value) => {
						obj._hasRoot = value;
					}
				},
				metadata: _metadata
			}, __hasRoot_initializers, __hasRoot_extraInitializers);
			__esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			A2uiSurface = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
			__runInitializers(_classThis, _classExtraInitializers);
		}
		#surface_accessor_storage;
		/**
		* The surface model containing the component tree and catalog.
		*/
		get surface() {
			return this.#surface_accessor_storage;
		}
		set surface(value) {
			this.#surface_accessor_storage = value;
		}
		#_hasRoot_accessor_storage;
		/**
		* Internal state indicating whether the root component exists.
		* @internal
		*/
		get _hasRoot() {
			return this.#_hasRoot_accessor_storage;
		}
		set _hasRoot(value) {
			this.#_hasRoot_accessor_storage = value;
		}
		/**
		* Handles lifecycle updates, specifically when the `surface` property changes.
		*
		* It manages subscriptions to the components model to detect when the 'root'
		* component is created.
		*
		* @param changedProperties Map of changed properties.
		*/
		willUpdate(changedProperties) {
			if (changedProperties.has("surface")) {
				if (this.unsubscribe) {
					this.unsubscribe();
					this.unsubscribe = void 0;
				}
				this._hasRoot = !!this.surface?.componentsModel.get("root");
				if (this.surface && !this._hasRoot) {
					const sub = this.surface.componentsModel.onCreated.subscribe((comp) => {
						if (comp.id === "root") {
							this._hasRoot = true;
							this.requestUpdate();
							this.unsubscribe?.();
							this.unsubscribe = void 0;
						}
					});
					this.unsubscribe = () => sub.unsubscribe();
				}
			}
		}
		/**
		* Cleans up subscriptions.
		*/
		disconnectedCallback() {
			super.disconnectedCallback();
			if (this.unsubscribe) {
				this.unsubscribe();
				this.unsubscribe = void 0;
			}
		}
		/**
		* Renders the surface.
		*
		* If `surface` is not set, returns `nothing`.
		* If the root component is not yet available, renders a loading state.
		* Otherwise, renders the root component using `renderA2uiNode`.
		*/
		render() {
			if (!this.surface) return A;
			if (!this._hasRoot) return b$1`<slot name="loading"><div>Loading surface...</div></slot>`;
			try {
				const rootContext = new ComponentContext(this.surface, "root", "/");
				return b$1`${renderA2uiNode(rootContext, this.surface.catalog)}`;
			} catch (e) {
				console.error("Error creating root context:", e);
				return b$1`<div>Error rendering surface</div>`;
			}
		}
	};
	return _classThis;
})();
/**
* Internal base class for the built-in Basic Catalog components.
*
* Extends `A2uiLitElement` to inject global basic catalog CSS, map `props.weight` to flex,
* and calculate `--a2ui-color-primary` CSS variables from the surface theme.
*
* @internal
*/
var BasicCatalogA2uiLitElement = class extends A2uiLitElement {
	/**
	* Renders into the element's direct children (Light DOM) instead of a ShadowRoot.
	*/
	createRenderRoot() {
		return this;
	}
	/**
	* Lifecycle hook invoked when the element is connected to the DOM.
	* Injects global basic catalog CSS.
	*/
	connectedCallback() {
		super.connectedCallback();
		injectBasicCatalogStyles();
	}
	/**
	* Lifecycle hook invoked before rendering.
	* Resolves the component flex weight and calculates theme color CSS variables.
	*
	* @param changedProperties Map of changed properties with their previous values.
	*/
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		const props = this.controller?.props;
		if (props && props.weight !== void 0) this.style.flex = String(props.weight);
		else this.style.removeProperty("flex");
		const primaryColor = this.context?.theme?.primaryColor;
		if (primaryColor) {
			this.style.setProperty("--a2ui-color-primary", primaryColor);
			this.style.setProperty("--a2ui-color-primary-light", computeColorVariant("light", { colorVar: "--a2ui-color-primary" }));
			this.style.setProperty("--a2ui-color-primary-dark", computeColorVariant("dark", { colorVar: "--a2ui-color-primary" }));
			this.style.setProperty("--a2ui-color-primary-hover", computeColorVariant("hover", {
				darkVar: "--a2ui-color-primary-dark",
				lightVar: "--a2ui-color-primary-light"
			}));
		} else {
			this.style.removeProperty("--a2ui-color-primary");
			this.style.removeProperty("--a2ui-color-primary-light");
			this.style.removeProperty("--a2ui-color-primary-dark");
			this.style.removeProperty("--a2ui-color-primary-hover");
		}
	}
};
var __decorate$17 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const NON_MARKDOWN_VARIANTS = /* @__PURE__ */ new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"caption"
]);
let A2uiBasicTextElement = class A2uiBasicTextElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TextApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const variant = props.variant || "body";
		const text = typeof props.text === "string" ? props.text : String(props.text ?? "");
		const flexStyle = typeof props.weight === "number" ? `flex: ${props.weight};` : A;
		if (NON_MARKDOWN_VARIANTS.has(variant)) {
			let content = b$1`${text}`;
			switch (variant) {
				case "h1":
					content = b$1`<h1>${text}</h1>`;
					break;
				case "h2":
					content = b$1`<h2>${text}</h2>`;
					break;
				case "h3":
					content = b$1`<h3>${text}</h3>`;
					break;
				case "h4":
					content = b$1`<h4>${text}</h4>`;
					break;
				case "h5":
					content = b$1`<h5>${text}</h5>`;
					break;
				case "caption": content = b$1`<em>${text}</em>`;
			}
			return b$1`<span class="a2ui-text ${variant}" style=${flexStyle}>${content}</span>`;
		}
		const renderedMarkdown = markdown$1(text, this.markdownRenderer);
		return b$1`<span class="a2ui-text ${variant}" style=${flexStyle}>${renderedMarkdown}</span>`;
	}
};
/**
* The styles of the text component can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-text-color-text`: The color of the text. Defaults to `--a2ui-color-on-background`.
* - `--a2ui-text-caption-color`: The color for caption text. Defaults to `light-dark(#666, #aaa)`.
*/
A2uiBasicTextElement.styles = i$9`
    :host {
      display: contents;
    }
    .a2ui-text p,
    .a2ui-text h1,
    .a2ui-text h2,
    .a2ui-text h3,
    .a2ui-text h4,
    .a2ui-text h5,
    .a2ui-text h6,
    .a2ui-text ol,
    .a2ui-text ul,
    .a2ui-text li,
    .a2ui-text blockquote,
    .a2ui-text pre {
      margin: var(--_a2ui-text-margin, 0);
    }
    .a2ui-text {
      color: var(--_a2ui-text-color, var(--a2ui-text-color-text, var(--a2ui-color-on-background)));
    }
    .a2ui-text h1,
    .a2ui-text h2,
    .a2ui-text h3,
    .a2ui-text h4,
    .a2ui-text h5,
    .a2ui-text h6 {
      font-family: var(--a2ui-font-family-title, inherit);
      line-height: var(--a2ui-line-height-headings, 1.2);
    }
    .a2ui-text h1 {
      font-size: var(--a2ui-font-size-2xl);
    }
    .a2ui-text h2 {
      font-size: var(--a2ui-font-size-xl);
    }
    .a2ui-text h3 {
      font-size: var(--a2ui-font-size-l);
    }
    .a2ui-text p,
    .a2ui-text h4 {
      font-size: var(--a2ui-font-size-m);
    }
    .a2ui-text h5 {
      font-size: var(--a2ui-font-size-s);
    }
    .a2ui-text p {
      line-height: var(--a2ui-line-height-body, 1.5);
    }
    .a2ui-text.caption,
    .a2ui-caption {
      font-size: var(--a2ui-font-size-xs);
      color: var(--a2ui-text-caption-color, light-dark(#666, #aaa));
    }
    .a2ui-text a {
      color: var(--a2ui-text-a-color, inherit);
      font-weight: var(--a2ui-text-a-font-weight, inherit);
    }
  `;
__decorate$17([c$3({
	context: Context$1.markdown,
	subscribe: true
})], A2uiBasicTextElement.prototype, "markdownRenderer", void 0);
A2uiBasicTextElement = __decorate$17([t$5("a2ui-basic-text")], A2uiBasicTextElement);
const A2uiText = {
	...TextApi,
	tagName: "a2ui-basic-text"
};
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const e = e$3(class extends i$2 {
	constructor(t) {
		if (super(t), t.type !== t$1.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return " " + Object.keys(t).filter((s) => t[s]).join(" ") + " ";
	}
	update(s, [i]) {
		if (void 0 === this.st) {
			this.st = /* @__PURE__ */ new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t) => "" !== t)));
			for (const t in i) i[t] && !this.nt?.has(t) && this.st.add(t);
			return this.render(i);
		}
		const r = s.element.classList;
		for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
		for (const t in i) {
			const s = !!i[t];
			s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
		}
		return E$1;
	}
});
var __decorate$16 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
* A button component that can be used to trigger an action.
*/
let A2uiBasicButtonElement = class A2uiBasicButtonElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ButtonApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isDisabled = props.isValid === false;
		const variant = props.variant ?? "default";
		const classes = {
			"a2ui-button": true,
			[variant]: true,
			["a2ui-button-" + variant]: true
		};
		return b$1`
      <button
        type="button"
        class=${e(classes)}
        @click=${() => {
			if (isDisabled) return;
			props.action?.();
		}}
        ?disabled=${isDisabled}
      >
        ${props.child ? b$1`${this.renderNode(props.child)}` : A}
      </button>
    `;
	}
};
/**
* The styles of the button can be customized by redefining the following
* CSS variables:
*
* - Primary variant:
*   - `--a2ui-color-primary`: The color for the primary variant.
*   - `--a2ui-color-on-primary`: The color of the text on the primary variant.
* - Standard/default variant:
*   - `--a2ui-color-secondary`: The color for the default variant.
*   - `--a2ui-color-on-secondary`: The color of the text on the default variant.
* - `--a2ui-button-border`: The styling for the button border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-button-border-radius`: The border radius of the button. Defaults to `--a2ui-border-radius`.
* - `--a2ui-button-padding`: The padding of the button. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-button-margin`: The outer margin of the button. Defaults to `--a2ui-spacing-m`.
*/
A2uiBasicButtonElement.styles = i$9`
    .a2ui-button {
      padding: var(
        --a2ui-button-padding,
        var(--a2ui-spacing-m, 0.5rem) var(--a2ui-spacing-l, 1rem)
      );
      border-radius: var(--a2ui-button-border-radius, var(--a2ui-spacing-s, 0.25rem));
      border: var(
        --a2ui-button-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      cursor: pointer;
      margin: var(--a2ui-button-margin, var(--a2ui-spacing-m, 0.5rem));
      background: var(--a2ui-button-background, var(--a2ui-color-surface, #fff));
      box-shadow: var(--a2ui-button-box-shadow, none);
      font-weight: var(--a2ui-button-font-weight, normal);
      --_a2ui-text-margin: 0;
      --_a2ui-text-color: var(--a2ui-color-on-secondary, #333);
      color: var(--_a2ui-text-color);
    }
    .a2ui-button:hover {
      background-color: var(--a2ui-color-secondary-hover, #ddd);
    }
    .a2ui-button.primary {
      background: var(--a2ui-color-primary, #17e);
      --_a2ui-text-color: var(--a2ui-color-on-primary, #fff);
      color: var(--_a2ui-text-color);
      border: none;
    }
    .a2ui-button.primary:hover {
      background-color: var(--a2ui-color-primary-hover, #fbd);
    }
    .a2ui-button.borderless {
      background: none;
      border: none;
      padding: 0;
      color: var(--a2ui-color-primary, #17e);
    }
    .a2ui-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;
A2uiBasicButtonElement = __decorate$16([t$5("a2ui-basic-button")], A2uiBasicButtonElement);
const A2uiButton = {
	...ButtonApi,
	tagName: "a2ui-basic-button"
};
var __decorate$15 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiBasicTextFieldElement = class A2uiBasicTextFieldElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TextFieldApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isInvalid = props.isValid === false;
		const onInput = (e) => props.setValue?.(e.target.value);
		let type = "text";
		if (props.variant === "number") type = "number";
		if (props.variant === "obscured") type = "password";
		const classes = {
			"a2ui-textfield": true,
			invalid: isInvalid
		};
		return b$1`
      ${props.label ? b$1`<label>${props.label}</label>` : A}
      ${props.variant === "longText" ? b$1`<textarea
            class=${e(classes)}
            .value=${props.value || ""}
            @input=${onInput}
          ></textarea>` : b$1`<input
            type=${type}
            class=${e(classes)}
            .value=${props.value || ""}
            @input=${onInput}
          />`}
      ${isInvalid && props.validationErrors?.length ? props.validationErrors.map((err) => b$1`<div class="error">${err}</div>`) : A}
    `;
	}
};
/**
* The styles of the text field can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-textfield-width`: Width of the component. Defaults to `100%`.
* - `--a2ui-textfield-border`: The styling for the text field border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-textfield-border-radius`: The border radius of the text field. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-textfield-padding`: The padding of the text field. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-textfield-color-border-focus`: The border color on focus. Defaults to `--a2ui-color-primary`.
* - `--a2ui-textfield-color-error`: The color for both invalid border and error text. Defaults to red.
* - `--a2ui-textfield-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-textfield-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*
* It also inherits global input variables:
* - `--a2ui-color-input`: Background color.
* - `--a2ui-color-on-input`: Text color.
*/
A2uiBasicTextFieldElement.styles = i$9`
    :host,
    a2ui-basic-textfield {
      display: flex;
      flex-direction: column;
      width: var(--a2ui-textfield-width, 100%);
      gap: var(--a2ui-spacing-xs, 0.25rem);
    }
    .a2ui-textfield {
      box-sizing: border-box;
      width: 100%;
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(--a2ui-textfield-border, var(--a2ui-border));
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m));
      padding: var(--a2ui-textfield-padding, var(--a2ui-spacing-m));
      font-family: inherit;
    }
    .a2ui-textfield:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .a2ui-textfield.invalid {
      border-color: var(--a2ui-textfield-color-error, red);
    }
    label {
      font-size: var(
        --a2ui-textfield-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-textfield-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .error {
      color: var(--a2ui-textfield-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
    }
  `;
A2uiBasicTextFieldElement = __decorate$15([t$5("a2ui-basic-textfield")], A2uiBasicTextFieldElement);
const A2uiTextField = {
	...TextFieldApi,
	tagName: "a2ui-basic-textfield"
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const u = (e, s, t) => {
	const r = /* @__PURE__ */ new Map();
	for (let l = s; l <= t; l++) r.set(e[l], l);
	return r;
};
const c = e$3(class extends i$2 {
	constructor(e) {
		if (super(e), e.type !== t$1.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, s, t) {
		let r;
		void 0 === t ? t = s : void 0 !== s && (r = s);
		const l = [], o = [];
		let i = 0;
		for (const s of e) l[i] = r ? r(s, i) : i, o[i] = t(s, i), i++;
		return {
			values: o,
			keys: l
		};
	}
	render(e, s, t) {
		return this.dt(e, s, t).values;
	}
	update(s, [t, r, c]) {
		const d = M(s), { values: p$4, keys: a } = this.dt(t, r, c);
		if (!Array.isArray(d)) return this.ut = a, p$4;
		const h = this.ut ??= [], v$3 = [];
		let m, y, x = 0, j = d.length - 1, k = 0, w = p$4.length - 1;
		for (; x <= j && k <= w;) if (null === d[x]) x++;
		else if (null === d[j]) j--;
		else if (h[x] === a[k]) v$3[k] = u$1(d[x], p$4[k]), x++, k++;
		else if (h[j] === a[w]) v$3[w] = u$1(d[j], p$4[w]), j--, w--;
		else if (h[x] === a[w]) v$3[w] = u$1(d[x], p$4[w]), v(s, v$3[w + 1], d[x]), x++, w--;
		else if (h[j] === a[k]) v$3[k] = u$1(d[j], p$4[k]), v(s, d[x], d[j]), j--, k++;
		else if (void 0 === m && (m = u(a, k, w), y = u(h, x, j)), m.has(h[x])) if (m.has(h[j])) {
			const e = y.get(a[k]), t = void 0 !== e ? d[e] : null;
			if (null === t) {
				const e = v(s, d[x]);
				u$1(e, p$4[k]), v$3[k] = e;
			} else v$3[k] = u$1(t, p$4[k]), v(s, d[x], t), d[e] = null;
			k++;
		} else h$1(d[j]), j--;
		else h$1(d[x]), x++;
		for (; k <= w;) {
			const e = v(s, v$3[w + 1]);
			u$1(e, p$4[k]), v$3[k++] = e;
		}
		for (; x <= j;) {
			const e = d[x++];
			null !== e && h$1(e);
		}
		return this.ut = a, p(s, v$3), E$1;
	}
});
var __decorate$14 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const JUSTIFY_MAP$1 = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
};
const ALIGN_MAP$1 = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch",
	baseline: "baseline"
};
function getChildKey$2(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
let A2uiBasicRowElement = class A2uiBasicRowElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = RowApi;
	}
	updated(changedProperties) {
		super.updated(changedProperties);
		const props = this.controller.props;
		if (props) {
			if (props.justify) this.style.justifyContent = JUSTIFY_MAP$1[props.justify] ?? "flex-start";
			else this.style.removeProperty("justify-content");
			if (props.align) this.style.alignItems = ALIGN_MAP$1[props.align] ?? "stretch";
			else this.style.removeProperty("align-items");
		}
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		return b$1` ${c(children, getChildKey$2, (child) => b$1`${this.renderNode(child)}`)} `;
	}
};
/**
* The styles of the row can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-row-gap`: The gap between items in the row. Defaults to `--a2ui-spacing-m`.
*/
A2uiBasicRowElement.styles = i$9`
    :host,
    a2ui-basic-row {
      display: flex;
      flex-direction: row;
      gap: var(--a2ui-row-gap, var(--a2ui-spacing-m));
    }
  `;
A2uiBasicRowElement = __decorate$14([t$5("a2ui-basic-row")], A2uiBasicRowElement);
const A2uiRow = {
	...RowApi,
	tagName: "a2ui-basic-row"
};
var __decorate$13 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const JUSTIFY_MAP = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
};
const ALIGN_MAP = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch",
	baseline: "baseline"
};
function getChildKey$1(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
let A2uiBasicColumnElement = class A2uiBasicColumnElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ColumnApi;
	}
	updated(changedProperties) {
		super.updated(changedProperties);
		const props = this.controller.props;
		if (props) {
			if (props.justify) this.style.justifyContent = JUSTIFY_MAP[props.justify] ?? "flex-start";
			else this.style.removeProperty("justify-content");
			if (props.align) this.style.alignItems = ALIGN_MAP[props.align] ?? "stretch";
			else this.style.removeProperty("align-items");
		}
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		return b$1` ${c(children, getChildKey$1, (child) => b$1`${this.renderNode(child)}`)} `;
	}
};
/**
* The styles of the column can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-column-gap`: The gap between items in the column. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-column-width`: The width of the column. Defaults to `100%`.
*/
A2uiBasicColumnElement.styles = i$9`
    :host,
    a2ui-basic-column {
      display: flex;
      flex-direction: column;
      width: var(--a2ui-column-width, 100%);
      gap: var(--a2ui-column-gap, var(--a2ui-spacing-m));
    }
  `;
A2uiBasicColumnElement = __decorate$13([t$5("a2ui-basic-column")], A2uiBasicColumnElement);
const A2uiColumn = {
	...ColumnApi,
	tagName: "a2ui-basic-column"
};
var __decorate$12 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function getChildKey(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
let A2uiListElement = class A2uiListElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ListApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		const listStyle = props.listStyle;
		const direction = props.direction || "vertical";
		if (listStyle === "ordered") return b$1`
        <ol class="a2ui-list ${direction}">
          ${c(children, getChildKey, (child) => b$1`<li>${this.renderNode(child)}</li>`)}
        </ol>
      `;
		if (listStyle === "unordered") return b$1`
        <ul class="a2ui-list ${direction}">
          ${c(children, getChildKey, (child) => b$1`<li>${this.renderNode(child)}</li>`)}
        </ul>
      `;
		return b$1`
      <div class="a2ui-list ${direction}">
        ${c(children, getChildKey, (child) => b$1`<div class="a2ui-list-item-none">${this.renderNode(child)}</div>`)}
      </div>
    `;
	}
};
A2uiListElement.styles = i$9`
    .a2ui-list {
      display: flex;
      padding-inline-start: var(--a2ui-list-padding, var(--a2ui-spacing-l, 24px));
      margin: 0;
    }
    .a2ui-list.vertical {
      flex-direction: column;
      gap: var(--a2ui-list-gap, var(--a2ui-spacing-s, 8px));
    }
    .a2ui-list.horizontal {
      flex-direction: row;
      gap: var(--a2ui-list-gap, var(--a2ui-spacing-m, 16px));
      list-style-position: inside;
    }
    .a2ui-list-item-none {
      display: block;
    }
    .horizontal .a2ui-list-item-none {
      display: inline-block;
    }
  `;
A2uiListElement = __decorate$12([t$5("a2ui-list")], A2uiListElement);
const A2uiList = {
	...ListApi,
	tagName: "a2ui-list"
};
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const n = "important";
const i = " !" + n;
const o = e$3(class extends i$2 {
	constructor(t) {
		if (super(t), t.type !== t$1.ATTRIBUTE || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return Object.keys(t).reduce((e, r) => {
			const s = t[r];
			return null == s ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
		}, "");
	}
	update(e, [r]) {
		const { style: s } = e.element;
		if (void 0 === this.ft) return this.ft = new Set(Object.keys(r)), this.render(r);
		for (const t of this.ft) null == r[t] && (this.ft.delete(t), t.includes("-") ? s.removeProperty(t) : s[t] = null);
		for (const t in r) {
			const e = r[t];
			if (null != e) {
				this.ft.add(t);
				const r = "string" == typeof e && e.endsWith(i);
				t.includes("-") || r ? s.setProperty(t, r ? e.slice(0, -11) : e, r ? n : "") : s[t] = e;
			}
		}
		return E$1;
	}
});
var __decorate$11 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiImageElement = class A2uiImageElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ImageApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const variant = props.variant || "default";
		const fit = props.fit || "cover";
		return b$1`<img
      src=${props.url}
      alt=${props.description || ""}
      style=${o({ objectFit: fit })}
      class="a2ui-image ${variant}"
    />`;
	}
};
/**
* The styles of the image can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-image-border-radius`: Controls the rounded corners of the image. Defaults to `0`.
* - `--a2ui-image-icon-size`: Controls the size of the `icon` variant. Defaults to `24px`.
* - `--a2ui-image-avatar-size`: Controls the size of the `avatar` variant. Defaults to `40px`.
* - `--a2ui-image-small-feature-size`: Controls the max-width of the `smallFeature` variant. Defaults to `100px`.
* - `--a2ui-image-large-feature-size`: Controls the max-height of the `largeFeature` variant. Defaults to `400px`.
* - `--a2ui-image-header-size`: Controls the height of the `header` variant. Defaults to `200px`.
*/
A2uiImageElement.styles = i$9`
    .a2ui-image {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: var(--a2ui-image-border-radius, 0);
    }
    .a2ui-image.icon {
      width: var(--a2ui-image-icon-size, 24px);
      height: var(--a2ui-image-icon-size, 24px);
    }
    .a2ui-image.avatar {
      width: var(--a2ui-image-avatar-size, 40px);
      height: var(--a2ui-image-avatar-size, 40px);
      border-radius: 50%;
    }
    .a2ui-image.smallFeature {
      max-width: var(--a2ui-image-small-feature-size, 100px);
    }
    .a2ui-image.largeFeature {
      max-height: var(--a2ui-image-large-feature-size, 400px);
    }
    .a2ui-image.header {
      height: var(--a2ui-image-header-size, 200px);
    }
  `;
A2uiImageElement = __decorate$11([t$5("a2ui-image")], A2uiImageElement);
const A2uiImage = {
	...ImageApi,
	tagName: "a2ui-image"
};
var __decorate$10 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ICON_NAME_OVERRIDES = {
	play: "play_arrow",
	rewind: "fast_rewind",
	favoriteOff: "favorite_border",
	starOff: "star_border"
};
function toMaterialIconName(name) {
	if (ICON_NAME_OVERRIDES[name]) return ICON_NAME_OVERRIDES[name];
	return name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
let A2uiIconElement = class A2uiIconElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = IconApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const name = props.name;
		if (typeof name === "object" && name !== null && "svgPath" in name) {
			const svgPath = name.svgPath;
			return b$1`
        <svg class="a2ui-icon svg" viewBox="0 0 24 24">
          <path d=${svgPath}></path>
        </svg>
      `;
		}
		const iconName = typeof name === "string" ? toMaterialIconName(name) : "";
		return b$1`<i class="material-icons a2ui-icon">${iconName}</i>`;
	}
};
/**
* The icon component can be customized with the following CSS variables:
*
* - `--a2ui-icon-size`: Dimensions of the icon.
* - `--a2ui-icon-color`: Color tint applied to the icon.
* - `--a2ui-icon-font-family`: Override the font family for icons. Defaults to 'Material Icons', 'Material Symbols Outlined'.
* - `--a2ui-icon-font-variation-settings`: Complete override for font-variation-settings.
*/
A2uiIconElement.styles = i$9`
    .a2ui-icon {
      display: inline-block;
      width: var(--a2ui-icon-size, 24px);
      height: var(--a2ui-icon-size, 24px);
      font-size: var(--a2ui-icon-size, 24px);
      font-style: normal;
      font-weight: normal;
      font-family: var(--a2ui-icon-font-family, 'Material Icons', 'Material Symbols Outlined');
      color: var(
        --a2ui-icon-color,
        var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333))
      );
      font-variation-settings: var(--a2ui-icon-font-variation-settings, 'FILL' 1);
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: 'liga';
      vertical-align: middle;
    }
    .a2ui-icon.svg {
      fill: currentColor;
    }
  `;
A2uiIconElement = __decorate$10([t$5("a2ui-icon")], A2uiIconElement);
const A2uiIcon = {
	...IconApi,
	tagName: "a2ui-icon"
};
var __decorate$9 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiVideoElement = class A2uiVideoElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = VideoApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b$1`
      <div class="a2ui-video-container">
        <video src=${props.url || A} controls class="a2ui-video">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
	}
};
/**
* The styles of the video can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-video-border-radius`: Controls the rounded corners of the video. Defaults to `0`.
*/
A2uiVideoElement.styles = i$9`
    .a2ui-video-container {
      width: 100%;
      max-width: 100%;
    }
    .a2ui-video {
      width: 100%;
      height: auto;
      display: block;
      border-radius: var(--a2ui-video-border-radius, 0);
    }
  `;
A2uiVideoElement = __decorate$9([t$5("a2ui-video")], A2uiVideoElement);
const A2uiVideo = {
	...VideoApi,
	tagName: "a2ui-video"
};
var __decorate$8 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiAudioPlayerElement = class A2uiAudioPlayerElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = AudioPlayerApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b$1`
      <div class="a2ui-audio-player">
        ${props.description ? b$1`<div class="a2ui-audio-description">${props.description}</div>` : A}
        <audio src=${props.url || A} controls class="a2ui-audio">
          Your browser does not support the audio tag.
        </audio>
      </div>
    `;
	}
};
A2uiAudioPlayerElement.styles = i$9`
    .a2ui-audio-player {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
      background: var(--a2ui-audioplayer-background, transparent);
      border-radius: var(--a2ui-audioplayer-border-radius, 0);
      padding: var(--a2ui-audioplayer-padding, 0);
      width: 100%;
    }
    .a2ui-audio-description {
      font-size: var(--a2ui-font-size-s, 0.875rem);
      color: var(
        --a2ui-audioplayer-description-color,
        var(--a2ui-text-caption-color, light-dark(#666, #aaa))
      );
    }
    .a2ui-audio {
      width: 100%;
    }
  `;
A2uiAudioPlayerElement = __decorate$8([t$5("a2ui-audioplayer")], A2uiAudioPlayerElement);
const A2uiAudioPlayer = {
	...AudioPlayerApi,
	tagName: "a2ui-audioplayer"
};
var __decorate$7 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiCardElement = class A2uiCardElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = CardApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b$1`
      <div class="a2ui-card">${props.child ? this.renderNode(props.child) : A}</div>
    `;
	}
};
/**
* The styles of the card can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-card-border`: The styling for the card border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-card-border-radius`: The border radius of the card. Defaults to `--a2ui-border-radius`.
* - `--a2ui-card-padding`: The padding of the card. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-card-box-shadow`: The box shadow of the card. Defaults to `0 2px 4px rgba(0,0,0,0.1)`.
* - `--a2ui-card-margin`: The outer margin of the card. Defaults to `--a2ui-spacing-m`.
*/
A2uiCardElement.styles = i$9`
    .a2ui-card {
      padding: var(--a2ui-card-padding, var(--a2ui-spacing-m, 16px));
      border-radius: var(--a2ui-card-border-radius, var(--a2ui-border-radius, 8px));
      box-shadow: var(--a2ui-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      background: var(--a2ui-card-background, var(--a2ui-color-surface, #fff));
      color: var(--a2ui-color-on-surface, #333);
      border: var(
        --a2ui-card-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      margin: var(--a2ui-card-margin, var(--a2ui-spacing-m, 16px));
    }
  `;
A2uiCardElement = __decorate$7([t$5("a2ui-card")], A2uiCardElement);
const A2uiCard = {
	...CardApi,
	tagName: "a2ui-card"
};
var __decorate$6 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiDividerElement = class A2uiDividerElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = DividerApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const axis = props.axis ?? "horizontal";
		return b$1`<hr class=${e({
			"a2ui-divider": true,
			horizontal: axis === "horizontal",
			vertical: axis === "vertical"
		})} />`;
	}
};
/**
* The styles of the divider can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-divider-border`: The styling for the divider border. Defaults to `--a2ui-border-width` solid `--a2ui-color-border`.
* - `--a2ui-divider-spacing`: The spacing around the divider. Defaults to `--a2ui-spacing-m`.
*/
A2uiDividerElement.styles = i$9`
    .a2ui-divider {
      border: 0;
      border-top: var(
        --a2ui-divider-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      margin: var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 16px)) 0;
      width: 100%;
    }
    .a2ui-divider.vertical {
      width: var(--a2ui-border-width, 1px);
      height: 100%;
      margin: 0 var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 16px));
      border-top: 0;
      border-left: var(
        --a2ui-divider-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
    }
  `;
A2uiDividerElement = __decorate$6([t$5("a2ui-divider")], A2uiDividerElement);
const A2uiDivider = {
	...DividerApi,
	tagName: "a2ui-divider"
};
var __decorate$5 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiCheckBoxElement = class A2uiCheckBoxElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = CheckBoxApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isInvalid = props.isValid === false;
		const labelClasses = {
			"a2ui-checkbox": true,
			invalid: isInvalid
		};
		const inputClasses = { invalid: isInvalid };
		return b$1`
      <div class="container">
        <label class=${e(labelClasses)}>
          <input
            type="checkbox"
            class=${e(inputClasses)}
            .checked=${props.value || false}
            @change=${(e) => props.setValue?.(e.target.checked)}
          />
          <span class="a2ui-check-box-text">${props.label}</span>
        </label>
        ${isInvalid && props.validationErrors?.length ? props.validationErrors.map((msg) => b$1`<div class="error a2ui-error-message">${msg}</div>`) : A}
      </div>
    `;
	}
};
/**
* The styles of the checkbox can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-checkbox-size`: Size of the box. Defaults to `1rem`.
* - `--a2ui-checkbox-border-radius`: Default corner rounding of the box.
* - `--a2ui-checkbox-gap`: Spacing between the checkbox and its label. Defaults to `8px`.
* - `--a2ui-checkbox-margin`: Outer margin of the component. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-checkbox-color-error`: Color for invalid state. Defaults to `red`.
* - `--a2ui-checkbox-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-checkbox-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiCheckBoxElement.styles = i$9`
    :host,
    a2ui-checkbox {
      display: block;
    }
    .container {
      display: flex;
      flex-direction: column;
      margin: var(--a2ui-checkbox-margin, var(--a2ui-spacing-m));
    }
    label.a2ui-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--a2ui-checkbox-gap, var(--a2ui-spacing-s, 0.5rem));
      font-size: var(
        --a2ui-checkbox-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-checkbox-label-font-weight, var(--a2ui-label-font-weight, bold));
      cursor: pointer;
    }
    label.invalid {
      color: var(--a2ui-checkbox-color-error, red);
    }
    input {
      width: var(--a2ui-checkbox-size, 1rem);
      height: var(--a2ui-checkbox-size, 1rem);
      background: var(--a2ui-checkbox-background, inherit);
      border: var(--a2ui-checkbox-border, var(--a2ui-border));
      border-radius: var(--a2ui-checkbox-border-radius, 4px);
    }
    input.invalid {
      outline: 1px solid var(--a2ui-checkbox-color-error, red);
    }
    .error,
    .a2ui-error-message {
      color: var(--a2ui-checkbox-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
      margin-top: 4px;
    }
  `;
A2uiCheckBoxElement = __decorate$5([t$5("a2ui-checkbox")], A2uiCheckBoxElement);
const A2uiCheckBox = {
	...CheckBoxApi,
	tagName: "a2ui-checkbox"
};
var __decorate$4 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiSliderElement = class A2uiSliderElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = SliderApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b$1`
      <div class="a2ui-slider-container">
        <div class="a2ui-slider-header">
          <span class="a2ui-slider-label">${props.label}</span>
          <span class="a2ui-slider-value">${props.value}</span>
        </div>
        <input
          type="range"
          min=${props.min ?? 0}
          max=${props.max ?? 100}
          .value=${props.value?.toString() || "0"}
          @input=${(e) => props.setValue?.(Number(e.target.value))}
          class="a2ui-slider"
        />
      </div>
    `;
	}
};
/**
* The slider can be customized with the following CSS variables:
*
* - `--a2ui-slider-track-color`: Color of the slider track. Defaults to `--a2ui-color-secondary`.
* - `--a2ui-slider-thumb-color`: Color of the slider thumb. Defaults to `--a2ui-color-primary`.
* - `--a2ui-slider-margin`: Outer margin of the component. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-slider-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-slider-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiSliderElement.styles = i$9`
    .a2ui-slider-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 4px);
      margin: var(--a2ui-slider-margin, var(--a2ui-spacing-m, 16px));
    }
    .a2ui-slider-header {
      display: flex;
      justify-content: space-between;
      font-size: var(
        --a2ui-slider-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s, 14px))
      );
      font-weight: var(--a2ui-slider-label-font-weight, bold);
      color: var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333));
    }
    .a2ui-slider {
      width: 100%;
      cursor: pointer;
      accent-color: var(--a2ui-slider-thumb-color, var(--a2ui-color-primary, #007bff));
      background: var(--a2ui-slider-track-color, var(--a2ui-color-secondary, #e9ecef));
    }
  `;
A2uiSliderElement = __decorate$4([t$5("a2ui-slider")], A2uiSliderElement);
const A2uiSlider = {
	...SliderApi,
	tagName: "a2ui-slider"
};
var __decorate$3 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
* Returns the current date formatted as YYYY-MM-DD in the user's local timezone.
*/
function getLocalIsoDate() {
	const now = /* @__PURE__ */ new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
/**
* Normalizes an incoming ISO or partial date/time value into a format accepted by HTML5 inputs.
*
* HTML5 input elements (like type="date", type="time", and type="datetime-local") strictly reject
* timezone indicators (like "Z" or "+00:00") and trailing seconds/milliseconds in their .value property.
* If these are present, the browser will reset the input to an empty string. This function strips
* those specifiers using string splitting and substring manipulation without shifting timezones.
*/
function normalizeDateTimeValue(value, type) {
	if (!value) return "";
	if (value.includes("T")) {
		const [datePart, timePart] = value.split("T");
		switch (type) {
			case "date": return datePart?.substring(0, 10) ?? "";
			case "time": return timePart?.substring(0, 5) ?? "";
			case "datetime-local": return `${datePart?.substring(0, 10) ?? ""}T${timePart?.substring(0, 5) ?? ""}`;
		}
	}
	if (type === "date") return value.includes("-") ? value.substring(0, 10) : "";
	if (type === "time") return value.includes(":") ? value.substring(0, 5) : "";
	return "";
}
let A2uiDateTimeInputElement = class A2uiDateTimeInputElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = DateTimeInputApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const enableDate = props.enableDate ?? true;
		const enableTime = props.enableTime ?? false;
		const rawValue = typeof props.value === "string" ? props.value : props.value ? String(props.value) : "";
		const dateValue = normalizeDateTimeValue(rawValue, "date");
		const timeValue = normalizeDateTimeValue(rawValue, "time");
		const handleDateChange = (event) => {
			const date = event.target.value;
			if (enableTime) {
				const time = rawValue.includes("T") ? rawValue.split("T")[1] : rawValue.includes(":") ? rawValue : "00:00:00";
				props.setValue?.(`${date}T${time}`);
			} else props.setValue?.(date);
		};
		const handleTimeChange = (event) => {
			const time = event.target.value;
			if (enableDate) {
				const date = rawValue.includes("T") ? rawValue.split("T")[0] : rawValue.includes("-") ? rawValue : getLocalIsoDate();
				props.setValue?.(`${date}T${time}:00`);
			} else props.setValue?.(time);
		};
		return b$1`
      <div class="a2ui-date-time-container">
        ${props.label ? b$1`<label class="a2ui-date-time-label">${props.label}</label>` : A}
        <div class="a2ui-date-time-inputs">
          ${enableDate ? b$1`
                <input
                  type="date"
                  .value=${dateValue}
                  @change=${handleDateChange}
                  class="a2ui-date-time-input"
                />
              ` : A}
          ${enableTime ? b$1`
                <input
                  type="time"
                  .value=${timeValue}
                  @change=${handleTimeChange}
                  class="a2ui-date-time-input"
                />
              ` : A}
        </div>
      </div>
    `;
	}
};
/**
* The styles of the datetime input can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-datetimeinput-width`: Width of the component. Defaults to `100%`.
* - `--a2ui-datetimeinput-background`: Controls the background of inputs.
* - `--a2ui-datetimeinput-color`: Controls the text color of inputs.
* - `--a2ui-datetimeinput-border`: Controls the border of inputs.
* - `--a2ui-datetimeinput-border-radius`: Controls the border radius of inputs.
* - `--a2ui-datetimeinput-padding`: Controls the padding of inputs.
* - `--a2ui-datetimeinput-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-datetimeinput-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiDateTimeInputElement.styles = i$9`
    .a2ui-date-time-container {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 4px);
      width: var(--a2ui-datetimeinput-width, 100%);
    }
    input {
      box-sizing: border-box;
      width: 100%;
    }
    .a2ui-date-time-label {
      font-size: var(
        --a2ui-datetimeinput-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s, 14px))
      );
      font-weight: var(--a2ui-datetimeinput-label-font-weight, bold);
      color: var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333));
    }
    .a2ui-date-time-inputs {
      display: flex;
      gap: var(--a2ui-spacing-s, 8px);
      width: 100%;
    }
    .a2ui-date-time-input {
      padding: var(--a2ui-datetimeinput-padding, 8px);
      border-radius: var(--a2ui-datetimeinput-border-radius, 4px);
      border: var(--a2ui-datetimeinput-border, 1px solid var(--a2ui-color-border, #ccc));
      background-color: var(--a2ui-datetimeinput-background, var(--a2ui-color-input, #fff));
      color: var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333));
      font-family: inherit;
      flex: 1;
    }
    .a2ui-date-time-input::-webkit-datetime-edit,
    .a2ui-date-time-input::-webkit-datetime-edit-fields-wrapper {
      color: var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333));
    }
  `;
A2uiDateTimeInputElement = __decorate$3([t$5("a2ui-datetimeinput")], A2uiDateTimeInputElement);
const A2uiDateTimeInput = {
	...DateTimeInputApi,
	tagName: "a2ui-datetimeinput"
};
var __decorate$2 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiChoicePickerElement = class A2uiChoicePickerElement extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.filter = "";
		this.api = ChoicePickerApi;
	}
	render() {
		const props = this.controller?.props;
		if (!props) return A;
		const rawVal = props.value;
		const selected = Array.isArray(rawVal) ? rawVal : typeof rawVal === "string" ? [rawVal] : [];
		const isMulti = props.variant === "multipleSelection";
		const isChips = props.displayStyle === "chips";
		const toggle = (val) => {
			const setter = props.setValue;
			if (typeof setter !== "function") return;
			if (isMulti) {
				if (selected.includes(val)) setter(selected.filter((v) => v !== val));
				else setter([...selected, val]);
			} else setter([val]);
		};
		const options = (props.options || []).filter((opt) => !props.filterable || this.filter === "" || String(opt.label).toLowerCase().includes(this.filter.toLowerCase()));
		const groupName = `a2ui-choice-${this.context?.dataContext?.surface?.id || "default"}-${this.context?.componentModel?.id || "choice-picker"}-${(this.context?.dataContext?.path || "/").replace(/[^a-zA-Z0-9-]/g, "_")}`;
		return b$1`
      ${props.label ? b$1`<label>${props.label}</label>` : A}
      ${props.filterable ? b$1`
            <input
              type="text"
              class="filter-input"
              placeholder="Filter options..."
              aria-label="Filter options"
              .value=${this.filter}
              @input=${(e) => this.filter = e.target.value}
            />
          ` : A}
      <div
        class=${e({
			"a2ui-choice-picker": true,
			options: true,
			"a2ui-options-group": !isChips,
			chips: isChips,
			"a2ui-chips-group": isChips
		})}
      >
        ${options.map((opt) => isChips ? b$1`
                <button
                  type="button"
                  class=${e({
			"a2ui-chip": true,
			chip: true,
			active: selected.includes(opt.value),
			selected: selected.includes(opt.value)
		})}
                  aria-pressed=${selected.includes(opt.value)}
                  @click=${() => toggle(opt.value)}
                >
                  ${opt.label}
                </button>
              ` : b$1`
                <label class="a2ui-option-label">
                  <input
                    type=${isMulti ? "checkbox" : "radio"}
                    name=${isMulti ? A : groupName}
                    value=${opt.value}
                    .checked=${selected.includes(opt.value)}
                    @change=${() => toggle(opt.value)}
                    class="a2ui-option-input"
                  />
                  <span class="a2ui-option-text">${opt.label}</span>
                </label>
              `)}
      </div>
    `;
	}
};
/**
* The styles of the choice picker can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-choicepicker-label-color`: Color of all labels.
* - `--a2ui-choicepicker-label-font-size`: Font size of all labels. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s` for the main label.
* - `--a2ui-choicepicker-label-font-weight`: Font weight of the main label. Defaults to `--a2ui-label-font-weight` then `bold`.
* - `--a2ui-choicepicker-gap`: Spacing between options.
* - `--a2ui-choicepicker-filter-padding`: Padding for the filter input. Defaults to `--a2ui-spacing-xs` and `--a2ui-spacing-s` (4px 8px).
* - `--a2ui-choicepicker-chip-padding`: Padding for chips. Defaults to `--a2ui-spacing-s` and `--a2ui-spacing-m` (4px 8px).
* - `--a2ui-choicepicker-chip-border-radius`: Border radius for chips. Defaults to `999px`.
*/
A2uiChoicePickerElement.styles = i$9`
    :host,
    .a2ui-choice-picker {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
      padding: var(--a2ui-choicepicker-padding, 0);
    }
    .options,
    .a2ui-options-group {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    label,
    .a2ui-option-label {
      display: flex;
      align-items: center;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
      cursor: pointer;
      color: var(--a2ui-text-color-text, var(--a2ui-choicepicker-label-color, inherit));
      font-size: var(--a2ui-choicepicker-label-font-size, inherit);
    }
    :host,
    a2ui-choicepicker > label {
      font-size: var(
        --a2ui-choicepicker-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-choicepicker-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .filter-input {
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(
        --a2ui-textfield-border,
        var(--a2ui-border, 1px solid var(--a2ui-color-border, #ccc))
      );
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m, 4px));
      padding: var(
        --a2ui-choicepicker-filter-padding,
        var(--a2ui-spacing-xs, 4px) var(--a2ui-spacing-s, 8px)
      );
      margin-bottom: var(--a2ui-choicepicker-filter-margin-bottom, var(--a2ui-spacing-s, 0.25rem));
      font-family: inherit;
    }
    .filter-input:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .a2ui-option-input {
      width: var(--a2ui-choicepicker-checkbox-size, 1rem);
      height: var(--a2ui-choicepicker-checkbox-size, 1rem);
    }
    .chips,
    .a2ui-chips-group {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    .chip,
    .a2ui-chip {
      padding: var(
        --a2ui-choicepicker-chip-padding,
        var(--a2ui-spacing-s, 4px) var(--a2ui-spacing-m, 8px)
      );
      border-radius: var(--a2ui-choicepicker-chip-border-radius, 999px);
      border: var(--a2ui-choicepicker-chip-border, 1px solid var(--a2ui-color-border, #ccc));
      background-color: var(--a2ui-choicepicker-chip-background, var(--a2ui-color-surface, #fff));
      color: var(--a2ui-color-on-surface, inherit);
      cursor: pointer;
      font-size: var(--a2ui-choicepicker-chip-font-size, var(--a2ui-font-size-xs, 0.75rem));
      font-family: inherit;
      font-weight: var(--a2ui-choicepicker-chip-font-weight, normal);
      transition: all 0.2s;
    }
    .chip.selected,
    .chip.active,
    .a2ui-chip.selected,
    .a2ui-chip.active {
      background-color: var(
        --a2ui-choicepicker-chip-background-selected,
        var(--a2ui-color-primary, #007bff)
      );
      color: var(--a2ui-color-on-primary, #fff);
      border-color: var(
        --a2ui-choicepicker-chip-background-selected,
        var(--a2ui-color-primary, #007bff)
      );
    }
  `;
__decorate$2([r$5()], A2uiChoicePickerElement.prototype, "filter", void 0);
A2uiChoicePickerElement = __decorate$2([t$5("a2ui-choicepicker")], A2uiChoicePickerElement);
const A2uiChoicePicker = {
	...ChoicePickerApi,
	tagName: "a2ui-choicepicker"
};
var __decorate$1 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiLitTabs = class A2uiLitTabs extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TabsApi;
		this.activeIndex = 0;
	}
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		const props = this.controller.props;
		if (props?.tabs && this.activeIndex >= props.tabs.length) this.activeIndex = 0;
	}
	render() {
		const props = this.controller.props;
		if (!props || !props.tabs) return A;
		return b$1`
      <div class="a2ui-tabs">
        <div class="a2ui-tab-bar">
          ${props.tabs.map((tab, i) => b$1`
              <button
                class=${e({
			"a2ui-tab-button": true,
			active: i === this.activeIndex
		})}
                @click=${() => this.activeIndex = i}
              >
                ${tab.title}
              </button>
            `)}
        </div>
        <div class="a2ui-tab-content">
          ${props.tabs[this.activeIndex] ? b$1`${this.renderNode(props.tabs[this.activeIndex].child)}` : A}
        </div>
      </div>
    `;
	}
};
/**
* The styles of the tabs can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-tabs-border`: Controls the border of the tab bar. Defaults to `2px solid var(--a2ui-color-border, #eee)`.
* - `--a2ui-tabs-header-background`: Controls the background of tab buttons. Defaults to `transparent`.
* - `--a2ui-tabs-header-color`: Controls the text color of tab buttons. Defaults to `var(--a2ui-text-caption-color, #666)`.
* - `--a2ui-tabs-header-background-active`: Controls the background of the active tab button. Defaults to `transparent`.
* - `--a2ui-tabs-header-color-active`: Controls the text color of the active tab button. Defaults to `var(--a2ui-color-primary, #007bff)`.
* - `--a2ui-tabs-content-padding`: Controls the padding of the tab content. Defaults to `var(--a2ui-spacing-m, 16px) 0`.
*/
A2uiLitTabs.styles = i$9`
    .a2ui-tabs {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .a2ui-tab-bar {
      display: flex;
      border-bottom: var(--a2ui-tabs-border, 2px solid var(--a2ui-color-border, #eee));
      gap: var(--a2ui-spacing-m, 16px);
    }
    .a2ui-tab-button {
      padding: var(--a2ui-spacing-s, 8px) var(--a2ui-spacing-m, 16px);
      border: none;
      background: var(--a2ui-tabs-header-background, transparent);
      cursor: pointer;
      font-weight: 500;
      color: var(--a2ui-tabs-header-color, var(--a2ui-text-caption-color, #666));
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }
    .a2ui-tab-button.active {
      background: var(--a2ui-tabs-header-background-active, transparent);
      color: var(--a2ui-tabs-header-color-active, var(--a2ui-color-primary, #007bff));
      border-bottom: 2px solid var(--a2ui-color-primary, #007bff);
    }
    .a2ui-tab-content {
      padding: var(--a2ui-tabs-content-padding, var(--a2ui-spacing-m, 16px) 0);
    }
  `;
__decorate$1([r$5()], A2uiLitTabs.prototype, "activeIndex", void 0);
A2uiLitTabs = __decorate$1([t$5("a2ui-tabs")], A2uiLitTabs);
const A2uiTabs = {
	...TabsApi,
	tagName: "a2ui-tabs"
};
var __decorate = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let A2uiLitModal = class A2uiLitModal extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.isOpen = false;
		this.api = ModalApi;
	}
	openModal() {
		this.isOpen = true;
	}
	closeModal() {
		this.isOpen = false;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b$1`
      <div class="a2ui-modal-wrapper">
        <div @click=${() => this.openModal()} class="a2ui-modal-trigger">
          ${props.trigger ? b$1`${this.renderNode(props.trigger)}` : A}
        </div>
        ${this.isOpen ? b$1`
              <div class="a2ui-modal-overlay" @click=${() => this.closeModal()}>
                <div
                  class="a2ui-modal-content"
                  role="dialog"
                  aria-modal="true"
                  @click=${(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    class="a2ui-modal-close"
                    aria-label="Close"
                    @click=${() => this.closeModal()}
                  >
                    &times;
                  </button>
                  ${props.content ? b$1`${this.renderNode(props.content)}` : A}
                </div>
              </div>
            ` : A}
      </div>
    `;
	}
};
/**
* The styles of the modal can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-modal-background`: Controls the background of the modal content.
* - `--a2ui-modal-padding`: Controls the padding of the modal content.
* - `--a2ui-modal-border-radius`: Controls the border radius of the modal content.
* - `--a2ui-modal-box-shadow`: Controls the box shadow of the modal content.
* - `--a2ui-modal-backdrop-bg`: Controls the background of the backdrop.
*/
A2uiLitModal.styles = i$9`
    :host,
    a2ui-modal {
      display: inline-block;
    }
    .a2ui-modal-wrapper {
      display: inline-block;
    }
    .a2ui-modal-trigger {
      cursor: pointer;
    }
    .a2ui-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--a2ui-modal-backdrop-bg, rgba(0, 0, 0, 0.5));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .a2ui-modal-content {
      background: var(--a2ui-modal-background, var(--a2ui-color-surface, #fff));
      padding: var(--a2ui-modal-padding, var(--a2ui-spacing-xl, 32px));
      border-radius: var(--a2ui-modal-border-radius, var(--a2ui-border-radius, 8px));
      position: relative;
      min-width: 300px;
      max-width: 80%;
      max-height: 80%;
      overflow-y: auto;
      box-shadow: var(--a2ui-modal-box-shadow, 0 10px 25px rgba(0, 0, 0, 0.2));
    }
    .a2ui-modal-close {
      position: absolute;
      top: 10px;
      right: 15px;
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--a2ui-text-caption-color, #999);
    }
    .a2ui-modal-close:hover {
      color: var(--a2ui-text-color, #333);
    }
  `;
__decorate([r$5()], A2uiLitModal.prototype, "isOpen", void 0);
A2uiLitModal = __decorate([t$5("a2ui-modal")], A2uiLitModal);
const A2uiModal = {
	...ModalApi,
	tagName: "a2ui-modal"
};
new Catalog("https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", [
	A2uiText,
	A2uiButton,
	A2uiTextField,
	A2uiRow,
	A2uiColumn,
	A2uiList,
	A2uiImage,
	A2uiIcon,
	A2uiVideo,
	A2uiAudioPlayer,
	A2uiCard,
	A2uiDivider,
	A2uiCheckBox,
	A2uiSlider,
	A2uiDateTimeInput,
	A2uiChoicePicker,
	A2uiTabs,
	A2uiModal
], BASIC_FUNCTIONS);
/**
* The basic catalog for A2UI components in Lit.
*
* This catalog includes a wide range of components such as text, button,
* text field, row, column, list, image, icon, video, audio player, card,
* divider, checkbox, slider, date-time input, choice picker, tabs, and modal.
* It also includes the basic functions.
*/
const basicCatalog = new Catalog("https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", [
	A2uiAudioPlayer,
	A2uiButton,
	A2uiCard,
	A2uiCheckBox,
	A2uiChoicePicker,
	A2uiColumn,
	A2uiDateTimeInput,
	A2uiDivider,
	A2uiIcon,
	A2uiImage,
	A2uiList,
	A2uiModal,
	A2uiRow,
	A2uiSlider,
	A2uiTabs,
	A2uiText,
	A2uiTextField,
	A2uiVideo
], BASIC_FUNCTIONS);
/** A2UI v0.9 Lit host used by sandboxed board documents. */
const actionText = (action) => {
	const context = action?.context && Object.keys(action.context).length ? action.context : void 0;
	return context ? `A2UI action ${action.name}: ${JSON.stringify(context)}` : `A2UI action ${action?.name ?? "selected"}`;
};
const routeBoardAction = async (action) => {
	const api = globalThis.openclaw;
	if (!api?.state?.emit) return false;
	if (globalThis.openclawA2UIBoot?.actionTier === "prompt" && api.prompt?.send) await api.prompt.send(actionText(action));
	else await api.state.emit({
		eventType: "a2ui.action",
		action
	});
	return true;
};
var OpenClawA2UIV09Host = class extends i$6 {
	static properties = {
		surfaces: { state: true },
		error: { state: true }
	};
	static styles = i$9`
    :host {
      display: block;
      min-height: 100%;
      color: var(--text);
      background: transparent;
    }
    #surfaces {
      display: grid;
      gap: 12px;
      min-height: 100%;
    }
    .error {
      color: var(--danger);
      padding: 12px;
    }
  `;
	#processor;
	#subscriptions = [];
	constructor() {
		super();
		this.surfaces = [];
		this.error = "";
		this.#processor = this.#createProcessor();
	}
	#createProcessor() {
		const processor = new MessageProcessor([basicCatalog], async (action) => {
			try {
				await routeBoardAction(action);
			} catch (error) {
				this.error = String(error?.message ?? error);
			}
		});
		this.#subscriptions = [processor.onSurfaceCreated(() => this.#syncSurfaces()), processor.onSurfaceDeleted(() => this.#syncSurfaces())];
		return processor;
	}
	connectedCallback() {
		super.connectedCallback();
		globalThis.openclawA2UI = {
			applyMessages: (messages) => this.applyMessages(messages),
			reset: () => this.reset(),
			getSurfaces: () => this.surfaces.map(([id]) => id)
		};
		const bootMessages = globalThis.openclawA2UIBoot?.messages;
		if (Array.isArray(bootMessages)) this.applyMessages(bootMessages);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		for (const subscription of this.#subscriptions) subscription.unsubscribe();
		this.#subscriptions = [];
	}
	applyMessages(messages) {
		if (!Array.isArray(messages)) throw new Error("A2UI: expected messages array");
		this.#processor.processMessages(messages);
		this.#syncSurfaces();
		return {
			ok: true,
			surfaces: this.surfaces.map(([id]) => id)
		};
	}
	reset() {
		this.#processor.model.dispose();
		for (const subscription of this.#subscriptions) subscription.unsubscribe();
		this.#processor = this.#createProcessor();
		this.surfaces = [];
		this.error = "";
		return { ok: true };
	}
	#syncSurfaces() {
		this.surfaces = Array.from(this.#processor.model.surfacesMap.entries());
	}
	render() {
		return b$1`${this.error ? b$1`<div class="error" role="alert">${this.error}</div>` : ""}
      <section id="surfaces">
        ${c(this.surfaces, ([surfaceId]) => surfaceId, ([, surface]) => b$1`<a2ui-surface .surface=${surface}></a2ui-surface>`)}
      </section>`;
	}
};
if (!customElements.get("openclaw-a2ui-host")) customElements.define("openclaw-a2ui-host", OpenClawA2UIV09Host);
