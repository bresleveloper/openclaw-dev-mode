import{n as serveWorkerTasks}from"../../../../worker-task-server-BDP9evHw.mjs";import"../../../../worker-task-server-Dml1JEyi.mjs";import{i as QuickJS,n as JSException,r as MAX_STACK_SIZE}from"../../../../dist-CkfuJRiT.mjs";
//!extensions/telegram/src/widgets/widget-check-shim-dom.ts
const TELEGRAM_WIDGET_CHECK_SHIM_DOM=String.raw`// ---------- nodes ----------
var VOID = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
var RAW = new Set(["script", "style", "textarea", "title"]);
var ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", middot: "\u00b7", times: "\u00d7", hellip: "\u2026", mdash: "\u2014", ndash: "\u2013", rarr: "\u2192", larr: "\u2190", uarr: "\u2191", darr: "\u2193", bull: "\u2022", copy: "\u00a9", deg: "\u00b0", check: "\u2713", rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201d", ldquo: "\u201c", minus: "\u2212", plusmn: "\u00b1", le: "\u2264", ge: "\u2265", ne: "\u2260", euro: "\u20ac", pound: "\u00a3", yen: "\u00a5", rupee: "\u20b9", star: "\u2606" };
function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, function (m, e) {
    if (e[0] === "#") { var n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return String.fromCodePoint(n); } catch (x) { return m; } }
    var v = ENT[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}
function esc(s, attr) {
  s = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return attr ? s.replace(/"/g, "&quot;") : s;
}

function Node(type) { this.nodeType = type; this.childNodes = []; this.parentNode = null; }
Node.prototype = {
  get ownerDocument() { return document; },
  get children() { return this.childNodes.filter(function (n) { return n.nodeType === 1; }); },
  get childElementCount() { return this.children.length; },
  get firstChild() { return this.childNodes[0] || null; },
  get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; },
  get firstElementChild() { return this.children[0] || null; },
  get lastElementChild() { var c = this.children; return c[c.length - 1] || null; },
  get parentElement() { var p = this.parentNode; return p && p.nodeType === 1 ? p : null; },
  get nextSibling() { var p = this.parentNode; if (!p) return null; return p.childNodes[p.childNodes.indexOf(this) + 1] || null; },
  get previousSibling() { var p = this.parentNode; if (!p) return null; return p.childNodes[p.childNodes.indexOf(this) - 1] || null; },
  get nextElementSibling() { for (var n = this.nextSibling; n; n = n.nextSibling) if (n.nodeType === 1) return n; return null; },
  get previousElementSibling() { for (var n = this.previousSibling; n; n = n.previousSibling) if (n.nodeType === 1) return n; return null; },
  get isConnected() { for (var n = this; n; n = n.parentNode) if (n === document) return true; return false; },
  hasChildNodes: function () { return this.childNodes.length > 0; },
  appendChild: function (n) { return this.insertBefore(n, null); },
  insertBefore: function (n, ref) {
    if (!n || typeof n.nodeType !== "number") throw new TypeError("Failed to execute 'insertBefore' on 'Node': parameter 1 is not of type 'Node'.");
    if (n.nodeType === 11) { var kids = n.childNodes.slice(); for (var i = 0; i < kids.length; i++) this.insertBefore(kids[i], ref); return n; }
    if (n.contains && n.contains(this)) throw new Error("HierarchyRequestError: the new child contains the parent");
    if (n.parentNode) n.parentNode.removeChild(n);
    var at = ref ? this.childNodes.indexOf(ref) : -1;
    if (ref && at < 0) throw new Error("NotFoundError: the reference node is not a child of this node");
    n.parentNode = this;
    if (at < 0) this.childNodes.push(n); else this.childNodes.splice(at, 0, n);
    return n;
  },
  removeChild: function (n) {
    var i = this.childNodes.indexOf(n);
    if (i < 0) throw new Error("NotFoundError: the node to be removed is not a child of this node");
    this.childNodes.splice(i, 1); n.parentNode = null; return n;
  },
  replaceChild: function (n, old) { this.insertBefore(n, old); return this.removeChild(old); },
  append: function () { for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; this.appendChild(typeof a === "object" && a !== null ? a : document.createTextNode(String(a))); } },
  prepend: function () { var first = this.firstChild; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; this.insertBefore(typeof a === "object" && a !== null ? a : document.createTextNode(String(a)), first); } },
  replaceChildren: function () { var old = this.childNodes; for (var i = 0; i < old.length; i++) old[i].parentNode = null; this.childNodes = []; this.append.apply(this, arguments); },
  remove: function () { if (this.parentNode) this.parentNode.removeChild(this); },
  before: function () { var p = this.parentNode; if (!p) return; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; p.insertBefore(typeof a === "object" ? a : document.createTextNode(String(a)), this); } },
  after: function () { var p = this.parentNode; if (!p) return; var next = this.nextSibling; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; p.insertBefore(typeof a === "object" ? a : document.createTextNode(String(a)), next); } },
  replaceWith: function () { var p = this.parentNode; if (!p) return; this.before.apply(this, arguments); p.removeChild(this); },
  contains: function (n) { for (; n; n = n.parentNode) if (n === this) return true; return false; },
  get textContent() {
    if (this.nodeType === 3) return this.data;
    if (this.nodeType === 8) return "";
    return this.childNodes.map(function (c) { return c.textContent; }).join("");
  },
  set textContent(v) {
    if (this.nodeType === 3 || this.nodeType === 8) { this.data = String(v); return; }
    this.replaceChildren();
    if (v !== null && v !== undefined && v !== "") this.appendChild(document.createTextNode(String(v)));
  },
  get nodeValue() { return this.nodeType === 3 || this.nodeType === 8 ? this.data : null; },
  set nodeValue(v) { if (this.nodeType === 3 || this.nodeType === 8) this.data = String(v); },
  cloneNode: function (deep) {
    var c;
    if (this.nodeType === 3) return document.createTextNode(this.data);
    if (this.nodeType === 8) return document.createComment(this.data);
    if (this.nodeType === 11) c = document.createDocumentFragment();
    else { c = document.createElement(this.localName); var self = this; this._attrs.forEach(function (v, k) { c.setAttribute(k, k === "style" ? self.style.cssText : v); }); }
    if (deep) for (var i = 0; i < this.childNodes.length; i++) c.appendChild(this.childNodes[i].cloneNode(true));
    return c;
  },
  addEventListener: function (type, fn, opts) {
    if (typeof fn !== "function" && !(fn && typeof fn.handleEvent === "function")) return;
    var l = this._l || (this._l = {}); var list = l[type] || (l[type] = []);
    if (list.some(function (x) { return x.fn === fn; })) return;
    list.push({ fn: fn, once: !!(opts && typeof opts === "object" && opts.once) });
  },
  removeEventListener: function (type, fn) { var list = this._l && this._l[type]; if (!list) return; var i = list.findIndex(function (x) { return x.fn === fn; }); if (i >= 0) list.splice(i, 1); },
  dispatchEvent: function (e) { dispatch(this, e); return !e.defaultPrevented; },
};
function Text(d) { Node.call(this, 3); this.data = String(d); }
Text.prototype = Object.create(Node.prototype, { nodeName: { value: "#text" } });
function Comment(d) { Node.call(this, 8); this.data = String(d); }
Comment.prototype = Object.create(Node.prototype, { nodeName: { value: "#comment" } });
function Fragment() { Node.call(this, 11); }
Fragment.prototype = Object.create(Node.prototype, { nodeName: { value: "#document-fragment" } });

function camelToKebab(p) { return p.startsWith("--") ? p : p.replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); }).replace(/^(webkit|moz|ms)-/, "-$1-"); }
function makeStyle(el) {
  var map = new Map();
  var api = {
    get cssText() { var out = []; map.forEach(function (v, k) { out.push(k + ": " + v + ";"); }); return out.join(" "); },
    set cssText(v) { map.clear(); parseDecls(String(v)).forEach(function (val, k) { setProp(k, val); }); },
    setProperty: function (k, v) { setProp(String(k).toLowerCase(), v); },
    getPropertyValue: function (k) { return map.get(String(k).toLowerCase()) || ""; },
    removeProperty: function (k) { var v = map.get(k) || ""; map.delete(k); return v; },
    get length() { return map.size; },
    _map: map,
  };
  function setProp(k, v) {
    if (v === null || v === undefined || v === "") { map.delete(k); return; }
    v = String(v).replace(/\s*!important\s*$/i, "");
    map.set(k, v);
    checkCssValue(k, v);
  }
  return new Proxy(api, {
    get: function (t, k) { if (typeof k !== "string" || k in t) return t[k]; return map.get(camelToKebab(k)) || ""; },
    set: function (t, k, v) { if (k === "cssText") { t.cssText = v; return true; } if (typeof k === "string") setProp(camelToKebab(k), v); return true; },
  });
}

function ClassList(el) { this.el = el; }
ClassList.prototype = {
  _get: function () { return (this.el.getAttribute("class") || "").split(/\s+/).filter(Boolean); },
  _set: function (l) { this.el.setAttribute("class", l.join(" ")); },
  contains: function (c) { return this._get().indexOf(String(c)) >= 0; },
  add: function () { var l = this._get(); for (var i = 0; i < arguments.length; i++) if (l.indexOf(String(arguments[i])) < 0) l.push(String(arguments[i])); this._set(l); },
  remove: function () { var a = Array.prototype.map.call(arguments, String); this._set(this._get().filter(function (c) { return a.indexOf(c) < 0; })); },
  toggle: function (c, force) { var has = this.contains(c); var want = force === undefined ? !has : !!force; if (want && !has) this.add(c); if (!want && has) this.remove(c); return want; },
  replace: function (a, b) { if (!this.contains(a)) return false; this._set(this._get().map(function (c) { return c === a ? String(b) : c; })); return true; },
  get length() { return this._get().length; },
  item: function (i) { return this._get()[i] || null; },
  forEach: function (fn) { this._get().forEach(fn); },
  toString: function () { return this._get().join(" "); },
};

var EVENTS = ["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "input", "change", "keydown", "keyup", "load", "transitionend", "animationend", "focus", "blur", "dblclick", "contextmenu"];
function Element(name) {
  Node.call(this, 1);
  this.localName = name;
  this._attrs = new Map();
  this._on = {};
  this.style = makeStyle(this);
}
Element.prototype = Object.create(Node.prototype);
Object.assign(Element.prototype, {
  getAttribute: function (n) { n = String(n).toLowerCase(); if (n === "style") return this.style.length ? this.style.cssText : (this._attrs.has("style") ? "" : null); return this._attrs.has(n) ? this._attrs.get(n) : null; },
  setAttribute: function (n, v) { n = String(n).toLowerCase(); v = String(v); this._attrs.set(n, v); if (n === "style") this.style.cssText = v; if (n === "src" || n === "href") checkUrlAttr(this, n, v); },
  hasAttribute: function (n) { return this._attrs.has(String(n).toLowerCase()); },
  removeAttribute: function (n) { n = String(n).toLowerCase(); this._attrs.delete(n); if (n === "style") this.style.cssText = ""; },
  toggleAttribute: function (n, f) { var has = this.hasAttribute(n); var want = f === undefined ? !has : !!f; if (want) this.setAttribute(n, ""); else this.removeAttribute(n); return want; },
  getAttributeNames: function () { return Array.from(this._attrs.keys()); },
  setAttributeNS: function (ns, n, v) { this.setAttribute(n, v); },
  getAttributeNS: function (ns, n) { return this.getAttribute(n); },
  querySelector: function (s) { return querySelectorAll(this, s)[0] || null; },
  querySelectorAll: function (s) { return querySelectorAll(this, s); },
  getElementsByClassName: function (c) { return querySelectorAll(this, String(c).trim().split(/\s+/).map(function (x) { return "." + x; }).join("")); },
  getElementsByTagName: function (t) { return querySelectorAll(this, t === "*" ? "*" : String(t)); },
  matches: function (s) { return matchesSelector(this, s); },
  closest: function (s) { for (var n = this; n && n.nodeType === 1; n = n.parentNode) if (matchesSelector(n, s)) return n; return null; },
  click: function () { fireTap(this); },
  focus: function () { document.activeElement = this; },
  blur: function () {},
  scrollIntoView: function () {}, scrollTo: function () {}, scrollBy: function () {},
  animate: function () { return { finished: Promise.resolve(), cancel: function () {}, play: function () {}, pause: function () {}, onfinish: null }; },
  getBoundingClientRect: function () { return { x: 0, y: 0, top: 0, left: 0, width: 320, height: 24, right: 320, bottom: 24 }; },
  getClientRects: function () { return [this.getBoundingClientRect()]; },
  insertAdjacentHTML: function (pos, html) {
    var f = document.createDocumentFragment(); parseHTML(String(html), f, false);
    insertAdjacent(this, pos, f);
  },
  insertAdjacentElement: function (pos, el) { insertAdjacent(this, pos, el); return el; },
  insertAdjacentText: function (pos, t) { insertAdjacent(this, pos, document.createTextNode(String(t))); },
  getContext: function (kind) { return this.localName === "canvas" && kind === "2d" ? canvasContext(this) : null; },
  toDataURL: function () { return "data:image/png;base64,"; },
});
function insertAdjacent(el, pos, node) {
  pos = String(pos).toLowerCase();
  if (pos === "beforebegin") el.parentNode && el.parentNode.insertBefore(node, el);
  else if (pos === "afterbegin") el.insertBefore(node, el.firstChild);
  else if (pos === "beforeend") el.appendChild(node);
  else if (pos === "afterend") el.parentNode && el.parentNode.insertBefore(node, el.nextSibling);
  else throw new SyntaxError("insertAdjacent: invalid position " + pos);
}
function attrProp(name, attr, kind) {
  Object.defineProperty(Element.prototype, name, {
    get: function () { var v = this.getAttribute(attr); if (kind === "bool") return v !== null; if (kind === "num") return v === null ? 0 : Number(v); return v === null ? "" : v; },
    set: function (v) { if (kind === "bool") { if (v) this.setAttribute(attr, ""); else this.removeAttribute(attr); } else this.setAttribute(attr, v); },
  });
}
[["id", "id"], ["className", "class"], ["title", "title"], ["href", "href"], ["src", "src"], ["alt", "alt"], ["type", "type"], ["name", "name"], ["role", "role"], ["lang", "lang"], ["dir", "dir"]].forEach(function (p) { attrProp(p[0], p[1]); });
[["hidden", "hidden"], ["disabled", "disabled"], ["checked", "checked"], ["open", "open"], ["selected", "selected"]].forEach(function (p) { attrProp(p[0], p[1], "bool"); });
[["width", "width"], ["height", "height"], ["tabIndex", "tabindex"]].forEach(function (p) { attrProp(p[0], p[1], "num"); });
Object.defineProperties(Element.prototype, {
  tagName: { get: function () { return this.localName.toUpperCase(); } },
  nodeName: { get: function () { return this.localName.toUpperCase(); } },
  classList: { get: function () { return new ClassList(this); } },
  value: { get: function () { var v = this.getAttribute("value"); return v === null ? "" : v; }, set: function (v) { this.setAttribute("value", v); } },
  dataset: { get: function () {
    var el = this;
    return new Proxy({}, {
      get: function (t, k) { if (typeof k !== "string") return undefined; var v = el.getAttribute("data-" + camelToKebab(k)); return v === null ? undefined : v; },
      set: function (t, k, v) { el.setAttribute("data-" + camelToKebab(String(k)), v); return true; },
      has: function (t, k) { return el.hasAttribute("data-" + camelToKebab(String(k))); },
      deleteProperty: function (t, k) { el.removeAttribute("data-" + camelToKebab(String(k))); return true; },
      ownKeys: function () { return el.getAttributeNames().filter(function (n) { return n.startsWith("data-"); }).map(function (n) { return n.slice(5).replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }); },
      getOwnPropertyDescriptor: function (t, k) { var v = el.getAttribute("data-" + camelToKebab(String(k))); return v === null ? undefined : { value: v, enumerable: true, configurable: true, writable: true }; },
    });
  } },
  innerHTML: {
    get: function () { return this.childNodes.map(serialize).join(""); },
    set: function (v) { this.replaceChildren(); parseHTML(String(v), this, false); },
  },
  outerHTML: { get: function () { return serialize(this); } },
  innerText: { get: function () { return this.textContent; }, set: function (v) { this.textContent = v; } },
  outerText: { get: function () { return this.textContent; } },
  offsetWidth: { get: function () { return 320; } }, offsetHeight: { get: function () { return 24; } },
  clientWidth: { get: function () { return 320; } }, clientHeight: { get: function () { return 24; } },
  scrollWidth: { get: function () { return 320; } }, scrollHeight: { get: function () { return 24; } },
  offsetLeft: { get: function () { return 0; } }, offsetTop: { get: function () { return 0; } },
  scrollTop: { get: function () { return 0; }, set: function () {} }, scrollLeft: { get: function () { return 0; }, set: function () {} },
  offsetParent: { get: function () { return this.parentElement; } },
});
EVENTS.forEach(function (type) {
  Object.defineProperty(Element.prototype, "on" + type, {
    get: function () { return this._on[type] || null; },
    set: function (fn) { this._on[type] = typeof fn === "function" ? fn : null; },
  });
});
function serialize(n) {
  if (n.nodeType === 3) return n.parentNode && (n.parentNode.localName === "script" || n.parentNode.localName === "style") ? n.data : esc(n.data);
  if (n.nodeType === 8) return "<!--" + n.data + "-->";
  if (n.nodeType === 11) return n.childNodes.map(serialize).join("");
  var a = "";
  n._attrs.forEach(function (v, k) { a += " " + k + '="' + esc(k === "style" ? n.style.cssText : v, true) + '"'; });
  if (VOID.has(n.localName)) return "<" + n.localName + a + ">";
  return "<" + n.localName + a + ">" + n.childNodes.map(serialize).join("") + "</" + n.localName + ">";
}

// ---------- document ----------
var document = new Node(9);
var docEl = new Element("html"), head = new Element("head"), body = new Element("body");
Node.prototype.appendChild.call(document, docEl); docEl.appendChild(head); docEl.appendChild(body);
Object.assign(document, {
  documentElement: docEl, head: head, body: body, readyState: "loading", activeElement: null, title: "", cookie: "",
  nodeName: "#document",
  get defaultView() { return G; },
  createElement: function (n) { return new Element(String(n).toLowerCase()); },
  createElementNS: function (ns, n) { return new Element(String(n).toLowerCase()); },
  createTextNode: function (t) { return new Text(t); },
  createComment: function (t) { return new Comment(t); },
  createDocumentFragment: function () { return new Fragment(); },
  getElementById: function (id) { id = String(id); return walkFind(docEl, function (e) { return e._attrs.get("id") === id; }); },
  querySelector: function (s) { return querySelectorAll(docEl, s, true)[0] || null; },
  querySelectorAll: function (s) { return querySelectorAll(docEl, s, true); },
  getElementsByClassName: function (c) { return docEl.getElementsByClassName(c); },
  getElementsByTagName: function (t) { return querySelectorAll(docEl, t, true); },
  createEvent: function () { return new Event(""); },
  hasFocus: function () { return true; },
  elementFromPoint: function () { return null; },
  execCommand: function () { return false; },
});
function walkFind(root, pred) {
  for (var i = 0; i < root.childNodes.length; i++) { var c = root.childNodes[i]; if (c.nodeType !== 1) continue; if (pred(c)) return c; var r = walkFind(c, pred); if (r) return r; }
  return null;
}
function eachElement(root, fn) {
  for (var i = 0; i < root.childNodes.length; i++) { var c = root.childNodes[i]; if (c.nodeType !== 1) continue; if (fn(c) !== false) eachElement(c, fn); }
}

// ---------- HTML parsing ----------
var pending = null;
function parseHTML(html, parent, isDocument) {
  var stack = [parent];
  var i = 0;
  function top() { return stack[stack.length - 1]; }
  function text(t) { if (t) top().appendChild(document.createTextNode(decode(t))); }
  function closeTo(names) { for (var k = stack.length - 1; k > 0; k--) { var n = stack[k].localName; if (names.indexOf(n) >= 0) { stack.length = k; return; } if (["ul", "ol", "table", "tbody", "thead", "tr", "div", "section", "body"].indexOf(n) >= 0) return; } }
  function step() {
    while (i < html.length) {
      var lt = html.indexOf("<", i);
      if (lt < 0) { text(html.slice(i)); i = html.length; break; }
      if (lt > i) text(html.slice(i, lt));
      if (html.startsWith("<!--", lt)) { var e = html.indexOf("-->", lt + 4); i = e < 0 ? html.length : e + 3; continue; }
      if (html[lt + 1] === "!" || html[lt + 1] === "?") { var e2 = html.indexOf(">", lt); i = e2 < 0 ? html.length : e2 + 1; continue; }
      var rest = html.slice(lt);
      if (html[lt + 1] === "/") {
        var c = /^<\/([a-zA-Z][\w:-]*)\s*>/.exec(rest);
        if (!c) { text("<"); i = lt + 1; continue; }
        var cn = c[1].toLowerCase();
        for (var k = stack.length - 1; k > 0; k--) if (stack[k].localName === cn) { stack.length = k; break; }
        i = lt + c[0].length; continue;
      }
      var m = /^<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>\x60]+))?)*)\s*(\/?)>/.exec(rest);
      if (!m) { text("<"); i = lt + 1; continue; }
      var name = m[1].toLowerCase();
      i = lt + m[0].length;
      if (isDocument && (name === "html" || name === "head" || name === "body")) { stack.push(name === "html" ? docEl : name === "head" ? head : body); continue; }
      if (name === "li") closeTo(["li"]);
      else if (name === "tr") closeTo(["tr"]);
      else if (name === "td" || name === "th") closeTo(["td", "th"]);
      else if (name === "option") closeTo(["option"]);
      else if (name === "p" || /^(div|ul|ol|table|h[1-6]|section)$/.test(name)) closeTo(["p"]);
      var el = document.createElement(name);
      var re = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g, a;
      while ((a = re.exec(m[2]))) el.setAttribute(a[1].toLowerCase(), decode(a[2] !== undefined ? a[2] : a[3] !== undefined ? a[3] : a[4] !== undefined ? a[4] : ""));
      top().appendChild(el);
      if (RAW.has(name)) {
        var close = new RegExp("</" + name + "\\s*>", "i");
        var after = html.slice(i); var cm = close.exec(after);
        var bodyText = cm ? after.slice(0, cm.index) : after;
        el.appendChild(document.createTextNode(name === "script" || name === "style" ? bodyText : decode(bodyText)));
        i += cm ? cm.index + cm[0].length : after.length;
        if (name === "script" && isDocument) return el;
        continue;
      }
      if (!VOID.has(name) && !m[3]) stack.push(el);
    }
    return null;
  }
  if (isDocument) return step;
  while (step()) {}
  return null;
}

// ---------- selectors ----------
var selectorCache = new Map();
function splitTop(s, sep) {
  var out = [], depth = 0, q = null, cur = "";
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === sep && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
function parseSelector(text) {
  var cached = selectorCache.get(text);
  if (cached) return cached;
  var out = [];
  splitTop(String(text), ",").forEach(function (part) {
    var s = part.trim(), steps = [], comb = " ", i = 0;
    while (i < s.length) {
      var ws = false;
      while (i < s.length && /\s/.test(s[i])) { i++; ws = true; }
      if (s[i] === ">" || s[i] === "+" || s[i] === "~") { comb = s[i]; i++; while (i < s.length && /\s/.test(s[i])) i++; }
      else if (ws && steps.length) comb = " ";
      var c = { tag: null, id: null, classes: [], attrs: [], pseudos: [], pseudoEl: null }, start = i;
      while (i < s.length && !/[\s>+~]/.test(s[i])) {
        var ch = s[i], rest = s.slice(i), m;
        if (ch === "*") { i++; continue; }
        if (ch === "#" || ch === ".") { m = /^[\w-]+/.exec(s.slice(i + 1)); var v = m ? m[0] : ""; i += 1 + v.length; if (ch === "#") c.id = v; else c.classes.push(v); continue; }
        if (ch === "[") {
          var end = s.indexOf("]", i), bodyT = s.slice(i + 1, end < 0 ? s.length : end); i = end < 0 ? s.length : end + 1;
          m = /^\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]*)))?/.exec(bodyT);
          if (m) c.attrs.push({ name: m[1].toLowerCase(), op: m[2] || null, value: m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5] || "" });
          continue;
        }
        if (ch === ":") {
          m = /^::?([\w-]+)(\((?:[^()]|\([^()]*\))*\))?/.exec(rest);
          if (!m) { i++; continue; }
          i += m[0].length;
          var pn = m[1].toLowerCase();
          if (rest[1] === ":" || pn === "before" || pn === "after") c.pseudoEl = pn; else c.pseudos.push({ name: pn, arg: m[2] ? m[2].slice(1, -1) : null });
          continue;
        }
        m = /^[\w-]+/.exec(rest);
        if (m) { c.tag = m[0].toLowerCase(); i += m[0].length; continue; }
        i++;
      }
      if (i > start) { steps.push({ comb: steps.length ? comb : null, c: c }); comb = " "; }
    }
    if (steps.length) out.push(steps);
  });
  selectorCache.set(text, out);
  return out;
}
var DYNAMIC = new Set(["hover", "active", "focus", "focus-visible", "focus-within", "visited", "target", "link"]);
function siblingsOf(el) { return el.parentNode ? el.parentNode.childNodes.filter(function (n) { return n.nodeType === 1; }) : [el]; }
function nth(arg, index) {
  arg = String(arg || "").replace(/\s+/g, "").toLowerCase();
  if (arg === "odd") return index % 2 === 1;
  if (arg === "even") return index % 2 === 0;
  var m = /^([+-]?\d*)n([+-]\d+)?$/.exec(arg);
  if (!m) return index === Number(arg);
  var a = m[1] === "" || m[1] === "+" ? 1 : m[1] === "-" ? -1 : Number(m[1]), b = Number(m[2] || 0);
  return a === 0 ? index === b : (index - b) / a >= 0 && (index - b) % a === 0;
}
function matchCompound(el, c, live) {
  if (el.nodeType !== 1) return false;
  if (c.tag && c.tag !== el.localName) return false;
  if (c.id !== null && el._attrs.get("id") !== c.id) return false;
  if (c.classes.length) { var cls = (el._attrs.get("class") || "").split(/\s+/); for (var i = 0; i < c.classes.length; i++) if (cls.indexOf(c.classes[i]) < 0) return false; }
  for (var j = 0; j < c.attrs.length; j++) {
    var at = c.attrs[j], v = el.getAttribute(at.name);
    if (v === null) return false;
    if (at.op === "=" && v !== at.value) return false;
    if (at.op === "~=" && v.split(/\s+/).indexOf(at.value) < 0) return false;
    if (at.op === "^=" && !v.startsWith(at.value)) return false;
    if (at.op === "$=" && !v.endsWith(at.value)) return false;
    if (at.op === "*=" && v.indexOf(at.value) < 0) return false;
    if (at.op === "|=" && v !== at.value && !v.startsWith(at.value + "-")) return false;
  }
  for (var k = 0; k < c.pseudos.length; k++) {
    var p = c.pseudos[k], sib, idx;
    // Nothing is hovered, focused or pressed in a trial run.
    if (DYNAMIC.has(p.name)) return false;
    switch (p.name) {
      case "first-child": if (siblingsOf(el)[0] !== el) return false; break;
      case "last-child": sib = siblingsOf(el); if (sib[sib.length - 1] !== el) return false; break;
      case "only-child": if (siblingsOf(el).length !== 1) return false; break;
      case "nth-child": if (!nth(p.arg, siblingsOf(el).indexOf(el) + 1)) return false; break;
      case "nth-last-child": sib = siblingsOf(el); if (!nth(p.arg, sib.length - sib.indexOf(el))) return false; break;
      case "first-of-type": if (siblingsOf(el).filter(function (s) { return s.localName === el.localName; })[0] !== el) return false; break;
      case "last-of-type": sib = siblingsOf(el).filter(function (s) { return s.localName === el.localName; }); if (sib[sib.length - 1] !== el) return false; break;
      case "nth-of-type": idx = siblingsOf(el).filter(function (s) { return s.localName === el.localName; }).indexOf(el) + 1; if (!nth(p.arg, idx)) return false; break;
      case "not": if (matchesSelector(el, p.arg, live)) return false; break;
      case "is": case "where": if (!matchesSelector(el, p.arg, live)) return false; break;
      case "has": if (!querySelectorAll(el, p.arg).length) return false; break;
      case "empty": if (el.childNodes.some(function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.data); })) return false; break;
      case "checked": case "disabled": case "open": if (!el.hasAttribute(p.name)) return false; break;
      case "enabled": if (el.hasAttribute("disabled")) return false; break;
      case "root": if (el !== docEl) return false; break;
      default: return false;
    }
  }
  return true;
}
function matchSteps(el, steps, k, live) {
  if (!matchCompound(el, steps[k].c, live)) return false;
  if (k === 0) return true;
  var comb = steps[k].comb, p;
  if (comb === ">") { p = el.parentNode; return !!p && p.nodeType === 1 && matchSteps(p, steps, k - 1, live); }
  if (comb === "+") { p = el.previousElementSibling; return !!p && matchSteps(p, steps, k - 1, live); }
  if (comb === "~") { for (p = el.previousElementSibling; p; p = p.previousElementSibling) if (matchSteps(p, steps, k - 1, live)) return true; return false; }
  for (p = el.parentNode; p && p.nodeType === 1; p = p.parentNode) if (matchSteps(p, steps, k - 1, live)) return true;
  return false;
}
function matchesSelector(el, sel, live) {
  var list = parseSelector(sel);
  for (var i = 0; i < list.length; i++) if (matchSteps(el, list[i], list[i].length - 1, live !== false)) return true;
  return false;
}
function querySelectorAll(root, sel, includeRoot) {
  var out = [];
  if (includeRoot && root.nodeType === 1 && matchesSelector(root, sel)) out.push(root);
  eachElement(root, function (e) { if (matchesSelector(e, sel)) out.push(e); });
  return out;
}
`;
//!extensions/telegram/src/widgets/widget-check-shim.ts
const SHIM_HEAD=String.raw`(function () {
"use strict";
var G = globalThis;
var SOURCE = G.__widgetSource;
var STRING_LITERAL = /(["'\x60])(?:\\.|(?!\1)[^\\])*\1/g;
var LITERAL_TEXT = SOURCE
  .replace(/<script\b[\s\S]*?<\/script>/gi, function (m) { return " " + (m.match(STRING_LITERAL) || []).join(" ") + " "; })
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
var STATE = G.__widgetState;
var errors = [];
var seen = new Set();
var context = "while loading";
var gesture = false;
var maxHeavy = 0, maxBackdrop = 0, maxNodes = 0, maxRules = 0;
// The host drains promise jobs between driver calls; QuickJS cannot run them re-entrantly.
G.__drainJobs = function () {};
G.queueMicrotask = G.queueMicrotask || function (f) { Promise.resolve().then(f); };
// Approximate checks (CSS paint projection, visible undefined/NaN) warn but never block.
var warnings = [];
function warn(msg) {
  if (seen.has(msg) || warnings.length >= 6) return;
  seen.add(msg);
  warnings.push(msg);
}
function fail(msg) {
  if (seen.has(msg) || errors.length >= 12) return;
  seen.add(msg);
  errors.push(msg);
}
function describe(e) {
  if (e === null || typeof e !== "object") return "Uncaught " + String(e);
  var stack = String(e.stack || "");
  var m = /(script-(\d+)|inline-handler)\.js:(\d+)/.exec(stack);
  var at = m ? (m[2] ? " (script " + m[2] + ", line " + m[3] + ")" : " (in an inline on* handler)") : "";
  return (e.name || "Error") + ": " + e.message + at;
}
function guard(label, fn) {
  try { return fn(); } catch (e) {
    if (e && e.message === "interrupted") throw e;
    fail(describe(e) + " " + label);
  }
}
`;const SHIM_REST=String.raw`// ---------- CSS ----------
function splitDecls(body) { return splitTop(body, ";"); }
function parseDecls(body) {
  var map = new Map();
  splitDecls(body).forEach(function (d) {
    var c = d.indexOf(":"); if (c < 0) return;
    var k = d.slice(0, c).trim().toLowerCase(), v = d.slice(c + 1).trim().replace(/\s*!important\s*$/i, "");
    if (k && v) map.set(k, v);
  });
  return map;
}
function checkCssValue(prop, value) {
  var v = String(value), where = prop + ": " + v;
  if (/(^|[^\w.-])-?(\d+\.?\d*|\.\d+)(d|s|l)?vh\b/i.test(v)) fail("CSS \"" + short(where) + "\": vh units do not work in a widget (there is no viewport height). Use px or %.");
  if (/^overflow(-[xy])?$/.test(prop) && /\b(auto|scroll|overlay)\b/i.test(v)) fail("CSS \"" + short(where) + "\": widgets cannot scroll; Telegram turns this into overflow: hidden and cuts the rest off. Show fewer items, or split them with tabs or <details>.");
  if (prop === "position" && /sticky/i.test(v)) fail("CSS \"" + short(where) + "\": position: sticky is not supported in widgets.");
  if (/(^|[^\w-])(color-mix|oklch|oklab)\(/i.test(v)) fail("CSS \"" + short(where) + "\": color-mix(), oklch() and oklab() are not supported. Use theme variables or hex colors.");
  if (/url\(\s*['"]?(?!data:|#)/i.test(v)) fail("CSS \"" + short(where) + "\": widgets have no network, so external url() resources never load. Inline a data: URL or drop it.");
  if (/\b(undefined|NaN)\b/.test(v)) warn("CSS \"" + short(where) + "\" " + context + ": a computed style value is undefined or NaN, so that element renders wrong. Check the data the code reads.");
}
var sheetCache = new Map();
function parseSheet(text) {
  var cached = sheetCache.get(text);
  if (cached) return cached;
  var out = { rules: [], count: 0 };
  (function walk(t, conditional) {
    t = t.replace(/\/\*[\s\S]*?\*\//g, "");
    var i = 0;
    while (i < t.length) {
      var open = t.indexOf("{", i); if (open < 0) break;
      var prelude = t.slice(i, open).replace(/^[\s;]+/, "").trim();
      var depth = 1, j = open + 1;
      while (j < t.length && depth) { if (t[j] === "{") depth++; else if (t[j] === "}") depth--; j++; }
      var bodyT = t.slice(open + 1, j - 1); i = j;
      var atm = /^@(?:-webkit-)?([\w-]+)/.exec(prelude);
      if (atm) {
        var at = atm[1].toLowerCase();
        // Conditional rules may never apply in the bubble; they are linted but not counted for paint.
        if (at === "media" || at === "supports" || at === "container") walk(bodyT, true);
        else if (at === "layer") walk(bodyT, conditional);
        else if (at === "font-face") fail("CSS @font-face: widgets cannot load fonts. Use a generic family such as sans-serif, serif or monospace.");
        continue;
      }
      if (bodyT.indexOf("{") >= 0) fail("CSS rule \"" + short(prelude) + "\" uses nesting, which widgets do not support. Write each selector as its own rule.");
      out.count++;
      var decls = parseDecls(bodyT.replace(/[^;{}]*\{[^}]*\}/g, ""));
      decls.forEach(function (v, k) { checkCssValue(k, v); });
      if (!conditional) out.rules.push({ selector: prelude, decls: decls, order: out.rules.length });
    }
    if (/@import\b/i.test(t)) fail("CSS @import: widgets have no network. Put all styles inline.");
  })(text, false);
  sheetCache.set(text, out);
  return out;
}
function short(s) { s = String(s).replace(/\s+/g, " ").trim(); return s.length > 60 ? s.slice(0, 57) + "..." : s; }

// ---------- rendering checks ----------
var REMOVED = { input: "inputs are removed (there is no keyboard); use buttons", select: "selects are removed; use buttons", textarea: "text areas are removed (there is no keyboard)", form: "forms are removed; handle taps in click handlers", iframe: "iframes are removed", frame: "frames are removed", audio: "audio is removed", video: "video is removed", object: "embedded objects are removed", embed: "embedded objects are removed", link: "link elements are removed (no network); inline styles in <style>", base: "base elements are removed" };
var SVG_DROPPED = { clippath: "clipPath", mask: "mask", filter: "filter", foreignobject: "foreignObject", animate: "SMIL animation", animatetransform: "SMIL animation", animatemotion: "SMIL animation", set: "SMIL animation" };
function checkUrlAttr(el, attr, v) {
  if (el.localName === "img" && attr === "src" && !/^data:image\/(png|jpe?g|webp|gif);/i.test(v)) fail("<img src=\"" + short(v) + "\">: widgets have no network; images must be data: PNG, JPEG, WebP or GIF.");
  if (el.localName === "script" && attr === "src") fail("<script src=\"" + short(v) + "\">: widgets have no network or CDN. Put the code inline.");
}
function isHidden(el, decl) { return el.hasAttribute("hidden") || (decl && decl.display === "none"); }
function heavyOf(d, isButton) {
  var none = function (v) { return v === undefined || /^\s*none\s*$/i.test(v); };
  var backdrop = !none(d["backdrop-filter"]) || !none(d["-webkit-backdrop-filter"]);
  var op = d.opacity, opacity = false;
  if (op !== undefined && !isButton) { var n = /%\s*$/.test(op) ? parseFloat(op) / 100 : parseFloat(op); opacity = Number.isFinite(n) && n < 1; }
  var shadow = false;
  if (!none(d["box-shadow"])) splitTop(d["box-shadow"], ",").forEach(function (s) {
    var lens = s.replace(/rgba?\([^)]*\)|hsla?\([^)]*\)|var\([^)]*\)/g, " ").split(/\s+/).filter(function (t) { return /^-?(\d+\.?\d*|\.\d+)(px|em|rem)?$/.test(t); });
    if (lens.length >= 3 && parseFloat(lens[2]) > 0) shadow = true;
  });
  return { heavy: backdrop || !none(d.filter) || opacity || shadow, backdrop: backdrop };
}
function specificity(steps) {
  var ids = 0, classes = 0, tags = 0, extra = 0;
  steps.forEach(function (s) {
    var c = s.c;
    if (c.id !== null) ids++;
    c.pseudos.forEach(function (p) {
      // :where() adds nothing; :is(), :not() and :has() take their most specific argument.
      if (p.name === "where") return;
      if (p.name === "is" || p.name === "not" || p.name === "has") {
        extra += parseSelector(p.arg || "").reduce(function (max, inner) { return Math.max(max, specificity(inner)); }, 0);
        return;
      }
      classes++;
    });
    classes += c.classes.length + c.attrs.length;
    if (c.tag) tags++;
    if (c.pseudoEl) tags++;
  });
  return ids * 10000 + classes * 100 + tags + extra;
}
function measure() {
  var sheets = [];
  eachElement(docEl, function (e) { if (e.localName === "style") sheets.push(parseSheet(e.textContent)); });
  var rules = [], ruleCount = 0;
  sheets.forEach(function (s) { ruleCount += s.count; s.rules.forEach(function (r) {
    parseSelector(r.selector).forEach(function (steps) {
      var last = steps[steps.length - 1].c;
      rules.push({ steps: steps, pseudoEl: last.pseudoEl, decls: r.decls, spec: specificity(steps), order: rules.length });
    });
  }); });
  // Cascade order: lower specificity first, then source order, so later writes win like CSS.
  rules.sort(function (a, b) { return a.spec - b.spec || a.order - b.order; });
  var heavy = 0, backdrop = 0, nodes = 0;
  (function walk(root) {
    for (var i = 0; i < root.childNodes.length; i++) {
      var el = root.childNodes[i];
      if (el.nodeType !== 1) continue;
      nodes++;
      if (REMOVED[el.localName]) fail("<" + el.localName + ">: " + REMOVED[el.localName] + ".");
      if (SVG_DROPPED[el.localName]) fail("SVG <" + el.localName + ">: " + SVG_DROPPED[el.localName] + " is dropped in widgets; draw it with plain shapes.");
      if (el.localName === "script" || el.localName === "style" || el.localName === "head") continue;
      var d = {}, before = null, after = null;
      for (var r = 0; r < rules.length; r++) {
        var rule = rules[r];
        if (!matchSteps(el, rule.steps, rule.steps.length - 1, false)) continue;
        var target = rule.pseudoEl === "before" ? (before = before || {}) : rule.pseudoEl === "after" ? (after = after || {}) : rule.pseudoEl ? null : d;
        if (target) rule.decls.forEach(function (v, k) { target[k] = v; });
      }
      el.style._map.forEach(function (v, k) { d[k] = v; });
      if (isHidden(el, d)) continue;
      var h = heavyOf(d, el.localName === "button");
      if (h.heavy) heavy++; if (h.backdrop) backdrop++;
      [before, after].forEach(function (p) { if (p && p.content !== undefined && !/^\s*none\s*$/i.test(p.content)) { var ph = heavyOf(p, false); if (ph.heavy) heavy++; if (ph.backdrop) backdrop++; } });
      walk(el);
    }
  })(docEl);
  maxHeavy = Math.max(maxHeavy, heavy); maxBackdrop = Math.max(maxBackdrop, backdrop);
  maxNodes = Math.max(maxNodes, nodes); maxRules = Math.max(maxRules, ruleCount);
  var shown = visibleText(body);
  var bad = /\b(undefined|NaN|\[object Object\])\b/.exec(shown);
  // Words the author wrote as text or string literals are content, not missing data.
  if (bad && LITERAL_TEXT.indexOf(bad[1]) < 0) {
    var at = Math.max(0, bad.index - 30);
    warn("The widget shows \"" + bad[1] + "\" " + context + " (\"..." + short(shown.slice(at, bad.index + 30)) + "...\"). The code reads data that is not there; check the state shape and the variables it uses.");
  }
}
function visibleText(root) {
  var out = "";
  for (var i = 0; i < root.childNodes.length; i++) {
    var n = root.childNodes[i];
    if (n.nodeType === 3) out += n.data + " ";
    else if (n.nodeType === 1 && n.localName !== "script" && n.localName !== "style" && !n.hasAttribute("hidden") && n.style._map.get("display") !== "none") out += visibleText(n);
  }
  return out;
}

// ---------- events ----------
function Event(type, init) {
  this.type = String(type); init = init || {};
  this.bubbles = !!init.bubbles; this.cancelable = !!init.cancelable; this.composed = !!init.composed;
  this.defaultPrevented = false; this.target = null; this.currentTarget = null; this.timeStamp = Date.now();
  this.isTrusted = false; this._stop = false; this._stopNow = false; this.detail = init.detail;
  this.clientX = init.clientX || 0; this.clientY = init.clientY || 0; this.button = 0; this.pointerType = "touch";
  this.key = init.key || ""; this.touches = []; this.changedTouches = [];
}
Event.prototype = {
  preventDefault: function () { if (this.cancelable) this.defaultPrevented = true; },
  stopPropagation: function () { this._stop = true; },
  stopImmediatePropagation: function () { this._stop = true; this._stopNow = true; },
  composedPath: function () { var p = []; for (var n = this.target; n; n = n.parentNode) p.push(n); p.push(G); return p; },
};
function CustomEvent(type, init) { Event.call(this, type, init); }
CustomEvent.prototype = Object.create(Event.prototype);
var compiled = new Map();
function inlineHandler(node, type) {
  if (node._on && node._on[type]) return node._on[type];
  if (node.nodeType !== 1) return null;
  var code = node.getAttribute("on" + type);
  if (code === null) return null;
  if (!compiled.has(code)) {
    // Sloppy-mode Function like a browser inline handler: element, then document, then globals.
    try { compiled.set(code, new Function("event", "with(document){with(this){" + code + "\n}}")); }
    catch (e) { fail(describe(e) + " in the inline on" + type + " handler"); compiled.set(code, null); }
  }
  return compiled.get(code);
}
function dispatch(target, e) {
  e.target = target;
  var path = [];
  for (var n = target; n; n = n.parentNode) path.push(n);
  path.push(G);
  for (var i = 0; i < path.length; i++) {
    var node = path[i];
    if (i > 0 && !e.bubbles) break;
    e.currentTarget = node;
    var h = node === G ? G["on" + e.type] : inlineHandler(node, e.type);
    if (typeof h === "function") {
      var r = h.call(node, e);
      if (r === false) e.preventDefault();
    }
    var list = node._l && node._l[e.type];
    if (list) {
      list = list.slice();
      for (var k = 0; k < list.length && !e._stopNow; k++) {
        if (list[k].once) node.removeEventListener(e.type, list[k].fn);
        if (typeof list[k].fn === "function") list[k].fn.call(node, e); else list[k].fn.handleEvent(e);
      }
    }
    if (e._stop) break;
  }
  e.currentTarget = null;
}
G.addEventListener = function (t, f, o) { Node.prototype.addEventListener.call(G, t, f, o); };
G.removeEventListener = function (t, f) { Node.prototype.removeEventListener.call(G, t, f); };
G.dispatchEvent = function (e) { e.target = G; e.currentTarget = G; var list = G._l && G._l[e.type]; if (list) list.slice().forEach(function (x) { x.fn.call(G, e); }); return true; };
function fireTap(el) {
  for (var n = el; n && n.nodeType === 1; n = n.parentNode) if (n.hasAttribute("disabled")) return;
  var prev = gesture; gesture = true;
  try {
    ["pointerdown", "touchstart", "mousedown", "pointerup", "touchend", "mouseup", "click"].forEach(function (t) {
      dispatch(el, new Event(t, { bubbles: true, cancelable: true }));
    });
  } finally { gesture = prev; }
}

// ---------- timers ----------
var now = 0, timerSeq = 0, timers = new Map();
function addTimer(fn, ms, args, repeat) {
  if (typeof fn !== "function") { if (typeof fn === "string") fail("setTimeout/setInterval with a code string is not allowed; pass a function."); return 0; }
  var id = ++timerSeq, delay = Math.max(repeat ? 1 : 0, Number(ms) || 0);
  timers.set(id, { fn: fn, at: now + delay, delay: delay, args: args, repeat: repeat });
  return id;
}
G.setTimeout = function (fn, ms) { return addTimer(fn, ms, Array.prototype.slice.call(arguments, 2), false); };
G.setInterval = function (fn, ms) { return addTimer(fn, ms, Array.prototype.slice.call(arguments, 2), true); };
G.clearTimeout = G.clearInterval = function (id) { timers.delete(id); };
G.requestAnimationFrame = function (fn) { return addTimer(function () { fn(now); }, 16, [], false); };
G.cancelAnimationFrame = function (id) { timers.delete(id); };
function settle(ms) {
  var until = now + ms, runs = 0;
  for (;;) {
    var next = null;
    timers.forEach(function (t, id) { if (t.at <= until && (!next || t.at < next.t.at)) next = { id: id, t: t }; });
    if (!next || runs++ > 300) break;
    now = next.t.at;
    if (next.t.repeat) next.t.at = now + next.t.delay; else timers.delete(next.id);
    var t = next.t;
    guard("in a timer callback " + context, function () { t.fn.apply(G, t.args); });
    G.__drainJobs();
  }
  now = until;
}

// ---------- environment ----------
function storage() {
  var map = new Map();
  var api = {
    getItem: function (k) { k = String(k); return map.has(k) ? map.get(k) : null; },
    setItem: function (k, v) { map.set(String(k), String(v)); },
    removeItem: function (k) { map.delete(String(k)); },
    clear: function () { map.clear(); },
    key: function (i) { return Array.from(map.keys())[i] || null; },
    get length() { return map.size; },
  };
  return new Proxy(api, {
    get: function (t, k) { if (typeof k !== "string" || k in t) return t[k]; return map.has(k) ? map.get(k) : undefined; },
    set: function (t, k, v) { map.set(String(k), String(v)); return true; },
    has: function (t, k) { return k in t || map.has(String(k)); },
    deleteProperty: function (t, k) { map.delete(String(k)); return true; },
    ownKeys: function () { return Array.from(map.keys()); },
    getOwnPropertyDescriptor: function (t, k) { return map.has(k) ? { value: map.get(k), enumerable: true, configurable: true, writable: true } : undefined; },
  });
}
function canvasContext(canvas) {
  var state = { canvas: canvas, fillStyle: "#000", strokeStyle: "#000", lineWidth: 1, font: "10px sans-serif", textAlign: "start", textBaseline: "alphabetic", globalAlpha: 1, lineCap: "butt", lineJoin: "miter" };
  return new Proxy(state, {
    get: function (t, k) {
      if (k in t) return t[k];
      if (k === "measureText") return function (s) { return { width: String(s).length * 6, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }; };
      if (k === "createLinearGradient" || k === "createRadialGradient" || k === "createConicGradient") return function () { return { addColorStop: function () {} }; };
      if (k === "getImageData" || k === "createImageData") return function (x, y, w, h) { return { width: w || 1, height: h || 1, data: new Uint8ClampedArray(4 * (w || 1) * (h || 1)) }; };
      if (k === "getLineDash") return function () { return []; };
      if (k === "getTransform") return function () { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; };
      if (k === "isPointInPath" || k === "isPointInStroke") return function () { return false; };
      return function () {};
    },
    set: function (t, k, v) { t[k] = v; if (typeof v === "string" && /\b(undefined|NaN)\b/.test(v)) warn("Canvas " + String(k) + " = \"" + short(v) + "\" " + context + ": a computed value is undefined or NaN."); return true; },
  });
}
function noopObserver() { return function () { this.observe = function () {}; this.unobserve = function () {}; this.disconnect = function () {}; this.takeRecords = function () { return []; }; }; }
function intl(kind, locale, opts, value) {
  var r = JSON.parse(G.__intl(JSON.stringify({ kind: kind, locale: locale, opts: opts, value: value })));
  if (r.error) throw new RangeError(r.error);
  return r.value;
}
var IntlShim = {
  NumberFormat: function (l, o) { return { format: function (v) { return intl("number", l, o, Number(v)); }, resolvedOptions: function () { return Object.assign({ locale: l || "en-US" }, o); }, formatToParts: function (v) { return [{ type: "literal", value: intl("number", l, o, Number(v)) }]; } }; },
  DateTimeFormat: function (l, o) { return { format: function (v) { return intl("date", l, o, v === undefined ? Date.now() : +new Date(v)); }, resolvedOptions: function () { return Object.assign({ locale: l || "en-US", timeZone: "UTC" }, o); }, formatToParts: function (v) { return [{ type: "literal", value: intl("date", l, o, v === undefined ? Date.now() : +new Date(v)) }]; } }; },
  PluralRules: function (l, o) { return { select: function (v) { return intl("plural", l, o, Number(v)); } }; },
  RelativeTimeFormat: function (l, o) { return { format: function (v, u) { return intl("relative", l, o, [Number(v), String(u)]); } }; },
  ListFormat: function (l, o) { return { format: function (v) { return intl("list", l, o, Array.from(v, String)); } }; },
  Collator: function () { return { compare: function (a, b) { return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0; } }; },
  getCanonicalLocales: function (l) { return [].concat(l === undefined ? [] : l); },
};
G.Intl = IntlShim;
Number.prototype.toLocaleString = function (l, o) { return intl("number", l, o, Number(this)); };
["toLocaleString", "toLocaleDateString", "toLocaleTimeString"].forEach(function (method) {
  Date.prototype[method] = function (l, o) { return intl("date-method", l, o, [method, +this]); };
});

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
Object.assign(G, {
  window: G, self: G, document: document, top: G,
  Node: Node, Element: Element, HTMLElement: Element, SVGElement: Element, Text: Text, Comment: Comment, DocumentFragment: Fragment,
  Event: Event, CustomEvent: CustomEvent, MouseEvent: Event, PointerEvent: Event, KeyboardEvent: Event, TouchEvent: Event, UIEvent: Event,
  localStorage: storage(), sessionStorage: storage(),
  navigator: { language: "en-US", languages: ["en-US"], userAgent: "TelegramWidget", platform: "", maxTouchPoints: 5, vibrate: function () { return false; }, clipboard: undefined },
  location: { href: "about:blank", protocol: "about:", host: "", hostname: "", pathname: "blank", search: "", hash: "", origin: "null", reload: function () {}, assign: function () {}, replace: function () {} },
  history: { length: 1, state: null, pushState: function () {}, replaceState: function () {}, back: function () {} },
  screen: { width: 390, height: 844, availWidth: 390, availHeight: 844 },
  innerWidth: 320, innerHeight: 600, outerWidth: 320, outerHeight: 600, devicePixelRatio: 2, scrollX: 0, scrollY: 0, pageXOffset: 0, pageYOffset: 0,
  performance: { now: function () { return now; }, mark: function () {}, measure: function () {} },
  console: { log: function () {}, info: function () {}, warn: function () {}, error: function () {}, debug: function () {}, table: function () {}, group: function () {}, groupEnd: function () {}, time: function () {}, timeEnd: function () {}, assert: function () {} },
  getComputedStyle: function (el) { return el && el.style ? el.style : makeStyle(new Element("div")); },
  matchMedia: function (q) { return { matches: /prefers-reduced-motion|hover:\s*none|pointer:\s*coarse/.test(String(q)), media: String(q), addEventListener: function () {}, removeEventListener: function () {}, addListener: function () {}, removeListener: function () {} }; },
  ResizeObserver: noopObserver(), MutationObserver: noopObserver(), IntersectionObserver: noopObserver(),
  scrollTo: function () {}, scrollBy: function () {}, focus: function () {}, blur: function () {}, print: function () {},
  alert: function () { fail("alert()/confirm()/prompt() do not exist in widgets; show the message in the widget."); },
  confirm: function () { fail("alert()/confirm()/prompt() do not exist in widgets; show the message in the widget."); return false; },
  prompt: function () { fail("alert()/confirm()/prompt() do not exist in widgets; show the message in the widget."); return null; },
  fetch: function () { fail("fetch(): widgets have no network. Put the data in the code or in the widget state."); return Promise.reject(new TypeError("Network access is not available in widgets")); },
  XMLHttpRequest: function () { fail("XMLHttpRequest: widgets have no network. Put the data in the code or in the widget state."); this.open = this.send = this.setRequestHeader = function () {}; },
  WebSocket: function () { fail("WebSocket: widgets have no network."); throw new TypeError("Network access is not available in widgets"); },
  EventSource: function () { fail("EventSource: widgets have no network."); throw new TypeError("Network access is not available in widgets"); },
  Image: function () { return document.createElement("img"); },
  structuredClone: function (v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); },
  btoa: function (s) { s = String(s); var o = ""; for (var i = 0; i < s.length; i += 3) { var a = s.charCodeAt(i), b = s.charCodeAt(i + 1), c = s.charCodeAt(i + 2); if (a > 255 || b > 255 || c > 255) throw new Error("InvalidCharacterError: btoa"); o += b64[a >> 2] + b64[((a & 3) << 4) | (b >> 4 || 0)] + (i + 1 < s.length ? b64[((b & 15) << 2) | (c >> 6 || 0)] : "=") + (i + 2 < s.length ? b64[c & 63] : "="); } return o; },
  atob: function (s) { s = String(s).replace(/[\s=]/g, ""); var o = "", bits = 0, acc = 0; for (var i = 0; i < s.length; i++) { var v = b64.indexOf(s[i]); if (v < 0) throw new Error("InvalidCharacterError: atob"); acc = (acc << 6) | v; bits += 6; if (bits >= 8) { bits -= 8; o += String.fromCharCode((acc >> bits) & 255); } } return o; },
});

// ---------- TelegramWidget (https://core.telegram.org/bots/widgets) ----------
var WIDGET_EVENTS = ["themeChanged", "activated", "deactivated", "chatDataChanged", "publicDataChanged", "contentSafeAreaChanged"];
var widgetHandlers = new Map(WIDGET_EVENTS.map(function (e) { return [e, []]; }));
var requests = 0;
function utf8Length(s) { var n = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); n += c < 0x80 ? 1 : c < 0x800 ? 2 : c >= 0xd800 && c <= 0xdbff ? (i++, 4) : 3; } return n; }
function needsTap(name) { if (!gesture) fail("TelegramWidget." + name + "() ran " + context + ", outside a tap. Telegram only allows it inside a click handler."); }
// Dark-theme palette and a private-chat viewer, the values Telegram supplies to query-enabled widgets.
var THEME_PARAMS = Object.freeze({ bg_color: "#212121", text_color: "#ffffff", hint_color: "#aaaaaa", link_color: "#8774e1", button_color: "#8774e1", button_text_color: "#ffffff", secondary_bg_color: "#181818", header_bg_color: "#212121", accent_text_color: "#8774e1", section_bg_color: "#212121", section_header_text_color: "#8774e1", subtitle_text_color: "#aaaaaa", destructive_text_color: "#e53935", bottom_bar_bg_color: "#212121" });
var VIEWER = Object.freeze({ id: 1, first_name: "Test", last_name: "User", username: "test_user", language_code: "en", is_premium: false });
// Web APIs the trial run does not model: touching one means the check cannot judge the widget.
var unsupported = null;
["URL", "URLSearchParams", "Blob", "File", "FileReader", "crypto", "AbortController", "DOMParser", "Worker", "BroadcastChannel", "IndexedDB", "indexedDB", "caches", "Response", "Request", "Headers", "FormData", "ReadableStream", "WebAssembly", "OffscreenCanvas", "createImageBitmap"].forEach(function (name) {
  if (name in G) return;
  Object.defineProperty(G, name, { configurable: true, get: function () { if (!unsupported) unsupported = name; throw new ReferenceError(name + " is not available in the widget trial run"); } });
});
G.TextEncoder = function () {};
G.TextEncoder.prototype.encoding = "utf-8";
G.TextEncoder.prototype.encode = function (str) {
  var u = unescape(encodeURIComponent(String(str === undefined ? "" : str))), out = new Uint8Array(u.length);
  for (var i = 0; i < u.length; i++) out[i] = u.charCodeAt(i);
  return out;
};
G.TextDecoder = function () {};
G.TextDecoder.prototype.encoding = "utf-8";
G.TextDecoder.prototype.decode = function (bytes) {
  if (!bytes) return "";
  var arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes.buffer || bytes), s = "";
  for (var i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  try { return decodeURIComponent(escape(s)); } catch (e) { return s; }
};
var HapticFeedback = { impactOccurred: function () {}, notificationOccurred: function () {}, selectionChanged: function () {} };
G.TelegramWidget = Object.freeze({
  get profile() { return 1; },
  isProfileAtLeast: function (n) { return typeof n === "number" && 1 >= n; },
  get colorScheme() { return "dark"; },
  get themeParams() { return THEME_PARAMS; },
  get isActive() { return true; },
  get contentSafeAreaInset() { return Object.freeze({ top: 0, bottom: 0, left: 0, right: 0, cornerLeft: 0, cornerRight: 0 }); },
  onEvent: function (type, handler) { var l = widgetHandlers.get(String(type)); if (l && typeof handler === "function" && l.indexOf(handler) < 0 && l.length < 16) l.push(handler); },
  offEvent: function (type, handler) { var l = widgetHandlers.get(String(type)); var i = l ? l.indexOf(handler) : -1; if (i >= 0) l.splice(i, 1); },
  openLink: function (url) { needsTap("openLink"); if (typeof url !== "string" || !/^https:\/\/[^\s@\/]+/.test(url)) fail("TelegramWidget.openLink(" + short(JSON.stringify(url)) + "): the link must be an https:// URL."); },
  openTelegramLink: function (url) { needsTap("openTelegramLink"); if (typeof url !== "string" || !/^https:\/\/t\.me\//.test(url)) fail("TelegramWidget.openTelegramLink(" + short(JSON.stringify(url)) + "): the link must start with https://t.me/."); },
  HapticFeedback: HapticFeedback,
  ready: function () {},
  setResizeAnchor: function () {},
  watchPublicData: function () {}, unwatchPublicData: function () {},
  get chatData() { return STATE; },
  get publicData() { return null; },
  get isForward() { return false; },
  get isPreview() { return false; },
  get chatType() { return "private"; },
  get viewer() { return VIEWER; },
  get wallet() { return null; },
  request: function (data) {
    if (typeof data !== "string" || data.length === 0 || utf8Length(data) > 64) {
      fail("TelegramWidget.request(" + short(JSON.stringify(data)) + ") " + context + ": the data must be a string of 1 to 64 bytes.");
      throw new TypeError("request: data must be a string of 1 to 64 bytes (UTF-8), without lone surrogates");
    }
    needsTap("request");
    requests++;
    // Telegram resolves an acknowledged request with { result }; an empty answer is null.
    return Promise.resolve({ result: null });
  },
  copyText: function (text) {
    needsTap("copyText");
    if (typeof text !== "string" || text.length === 0 || text.length > 256) { fail("TelegramWidget.copyText(): the text must be 1 to 256 characters."); throw new TypeError("copyText: text must be a string of 1 to 256 characters (UTF-16), without lone surrogates"); }
  },
});

// ---------- driver (called by the host between script evaluations) ----------
var nextScript = parseHTML(SOURCE, body, true);
var scriptIndex = 0;
function isClassicScript(el) { var t = (el.getAttribute("type") || "").trim().toLowerCase(); return !t || t === "text/javascript" || t === "application/javascript" || t === "module"; }
function clickTargets() {
  var out = [];
  eachElement(body, function (el) {
    if (el.hasAttribute("hidden") || el.style._map.get("display") === "none") return false;
    // A disabled control cannot be tapped in Telegram.
    if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return false;
    var handled = (el._on && el._on.click) || el.hasAttribute("onclick") || (el._l && (el._l.click || el._l.pointerdown || el._l.pointerup || el._l.touchstart || el._l.mousedown));
    var hasElementKids = el.children.length > 0;
    if (el.localName === "button" || el.getAttribute("role") === "button" || (handled && !hasElementKids)) out.push(el);
    else if (handled && hasElementKids) el.children.forEach(function (c) { out.push(c); });
  });
  return out;
}
G.__widgetCheck = {
  // Returns the next inline script's code ("" for one to skip), or null when the document is parsed.
  nextScript: function () {
    for (;;) {
      var el = nextScript();
      if (!el) return null;
      scriptIndex++;
      if (el.hasAttribute("src")) continue;
      if (!isClassicScript(el)) continue;
      return el.textContent;
    }
  },
  scriptNumber: function () { return scriptIndex; },
  recordError: function (e) { fail(describe(e) + " " + context); },
  loaded: function () {
    document.readyState = "interactive";
    guard("in a DOMContentLoaded handler", function () { dispatch(document, new Event("DOMContentLoaded", { bubbles: true })); });
    document.readyState = "complete";
    guard("in a load handler", function () { G.dispatchEvent(new Event("load")); if (typeof G.onload === "function") G.onload(new Event("load")); });
    G.__drainJobs();
    settle(3000);
    measure();
  },
  tapAll: function () {
    var labels = [], k = 0;
    for (; k < 24; k++) {
      var targets = clickTargets();
      if (k >= targets.length) break;
      var el = targets[k];
      var label = short(el.textContent).slice(0, 30) || el.localName;
      context = "after tapping \"" + label + "\"";
      guard(context, function () { fireTap(el); });
      G.__drainJobs();
      settle(800);
      measure();
      labels.push(label);
    }
    return labels.length;
  },
  dataChanged: function (state) {
    STATE = state;
    context = "after the state update";
    (widgetHandlers.get("chatDataChanged") || []).forEach(function (h) { guard(context, function () { h.call(G.TelegramWidget); }); });
    G.__drainJobs();
    measure();
  },
  report: function () {
    if (maxHeavy > 16) warn(maxHeavy + " elements use opacity below 1, filter or a blurred box-shadow. Telegram stops widgets with more than 16, so it would show \"Widget stopped\". Use solid theme colors for tints and fills instead of opacity.");
    if (maxBackdrop > 2) warn(maxBackdrop + " elements use backdrop-filter. Telegram stops widgets with more than 2.");
    if (maxNodes > 2000) fail("The widget has " + maxNodes + " elements. Telegram stops widgets with more than 2000.");
    if (maxRules > 400) fail("The widget has " + maxRules + " CSS rules. Telegram stops widgets with more than 400.");
    return JSON.stringify({ errors: errors, warnings: warnings, unsupported: unsupported, requests: requests, heavy: maxHeavy, nodes: maxNodes, rules: maxRules });
  },
};
})();`;const TELEGRAM_WIDGET_CHECK_SHIM=`${SHIM_HEAD}\n${TELEGRAM_WIDGET_CHECK_SHIM_DOM}\n${SHIM_REST}`;
//!extensions/telegram/src/widgets/widget-check-run.ts
const CHECK_TIME_LIMIT_MS=1500;const CHECK_MEMORY_LIMIT_BYTES=67108864;function runIntl(e){try{const{kind:t,locale:n,opts:r,value:i}=JSON.parse(e);const a=r&&typeof r===`object`?r:void 0;let o;if(t===`number`)o=new Intl.NumberFormat(n,a).format(Number(i));else if(t===`date`)o=new Intl.DateTimeFormat(n,a).format(Number(i));else if(t===`date-method`&&Array.isArray(i)){const[e,t]=i;const r=new Date(t);o=e===`toLocaleDateString`?r.toLocaleDateString(n,a):e===`toLocaleTimeString`?r.toLocaleTimeString(n,a):r.toLocaleString(n,a)}else if(t===`plural`)o=new Intl.PluralRules(n,a).select(Number(i));else if(t===`relative`&&Array.isArray(i))o=new Intl.RelativeTimeFormat(n,a).format(Number(i[0]),String(i[1]));else if(t===`list`&&Array.isArray(i))o=new Intl.ListFormat(n,a).format(i.map(String));else return JSON.stringify({error:`Unsupported Intl request ${t}`});return JSON.stringify({value:o})}catch(e){return JSON.stringify({error:e instanceof Error?e.message:String(e)})}}async function runTelegramWidgetCheck(e,t){let n=performance.now()+CHECK_TIME_LIMIT_MS;let r=false;let i=false;const a=[];const o=await QuickJS.create({wasm:t,memoryLimit:CHECK_MEMORY_LIMIT_BYTES,maxStackSize:MAX_STACK_SIZE,interruptHandler:()=>{i||=performance.now()>=n;return i},onUnhandledRejection:(e,t,n)=>{if(!n&&a.length<3){const e=o.dump(t);const n=e&&typeof e===`object`&&`message`in e?String(e.message):String(e);if(!n.includes(`not available in widgets`))a.push(`Unhandled promise rejection: ${n}`)}}});try{o.newFunction(`__intl`,e=>o.newString(runIntl(o.dump(e)))).consume(e=>o.global.setProp(`__intl`,e));o.newString(e.source).consume(e=>o.global.setProp(`__widgetSource`,e));(e.state===null?o.null:o.newString(e.state)).consume(e=>o.global.setProp(`__widgetState`,e));o.evalCode(TELEGRAM_WIDGET_CHECK_SHIM,`widget-check.js`).dispose();const t=o.global.getProp(`__widgetCheck`);const call=(e,...n)=>{const r=o.getProp(t,o.newString(e));try{const e=o.callFunction(r,t,...n);const i=o.dump(e);e.dispose();return i}finally{r.dispose()}};const recordError=e=>{if(e instanceof JSException){call(`recordError`,e.handle);e.handle.dispose();return}throw e};try{for(;;){const e=call(`nextScript`);if(e===null)break;if(typeof e!==`string`||!e.trim())continue;const t=call(`scriptNumber`);try{o.evalCode(e,`script-${String(t)}.js`).dispose()}catch(e){if(i)throw e;recordError(e)}o.executePendingJobs()}call(`loaded`);o.executePendingJobs();if(e.nextState!==void 0){(e.nextState===null?o.null:o.newString(e.nextState)).consume(e=>call(`dataChanged`,e));o.executePendingJobs()}if(e.tapAll){call(`tapAll`);o.executePendingJobs()}}catch(e){if(!i)throw e;r=true}i=false;n=performance.now()+250;const s=JSON.parse(String(call(`report`)));t.dispose();const c=[...s.errors,...a];if(r)c.push(`The widget code did not finish running within a second (an endless loop or very heavy work). Telegram would stop it.`);if(s.unsupported)return{errors:[],warnings:[],unavailable:`uses ${s.unsupported}`};return{errors:c,warnings:s.warnings}}catch(e){if(i)return{warnings:[],errors:[`The widget code did not finish running within a second (an endless loop or very heavy work). Telegram would stop it.`]};return{errors:[],warnings:[],unavailable:e instanceof Error?e.message:String(e)}}finally{o.dispose()}}
//!extensions/telegram/src/widgets/widget-check.worker.ts
serveWorkerTasks(async e=>{const{wasm:t,...n}=e;return await runTelegramWidgetCheck(n,t)});export{};