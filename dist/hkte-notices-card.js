var Ft = Object.defineProperty;
var Vt = (s, e, t) => e in s ? Ft(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var f = (s, e, t) => Vt(s, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, at = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), pt = /* @__PURE__ */ new WeakMap();
let zt = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (at && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = pt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && pt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zt = (s) => new zt(typeof s == "string" ? s : s + "", void 0, ot), L = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, r) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[r + 1], s[0]);
  return new zt(t, s, ot);
}, Jt = (s, e) => {
  if (at) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), n = W.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
  }
}, ut = at ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Zt(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Yt, defineProperty: qt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Xt, getOwnPropertySymbols: Qt, getPrototypeOf: te } = Object, w = globalThis, mt = w.trustedTypes, ee = mt ? mt.emptyScript : "", J = w.reactiveElementPolyfillSupport, H = (s, e) => s, X = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? ee : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ot = (s, e) => !Yt(s, e), gt = { attribute: !0, type: String, converter: X, reflect: !1, useDefault: !1, hasChanged: Ot };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let I = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = gt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && qt(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: n, set: r } = Gt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: n, set(a) {
      const c = n == null ? void 0 : n.call(this);
      r == null || r.call(this, a), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? gt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const e = te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const t = this.properties, i = [...Xt(t), ...Qt(t)];
      for (const n of i) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, n] of t) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const n = this._$Eu(t, i);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i) t.unshift(ut(n));
    } else e !== void 0 && t.push(ut(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Jt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var r;
    const i = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, i);
    if (n !== void 0 && i.reflect === !0) {
      const a = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : X).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, a;
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const c = i.getPropertyOptions(n), o = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((r = c.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? c.converter : X;
      this._$Em = n;
      const d = o.fromAttribute(t, c.type);
      this[n] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, n = !1, r) {
    var a;
    if (e !== void 0) {
      const c = this.constructor;
      if (n === !1 && (r = this[e]), i ?? (i = c.getPropertyOptions(e)), !((i.hasChanged ?? Ot)(r, t) || i.useDefault && i.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(c._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: n, wrapped: r }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, a] of n) {
        const { wrapped: c } = a, o = this[r];
        c !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, a, o);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(t)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[H("elementProperties")] = /* @__PURE__ */ new Map(), I[H("finalized")] = /* @__PURE__ */ new Map(), J == null || J({ ReactiveElement: I }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, ft = (s) => s, F = P.trustedTypes, yt = F ? F.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Rt = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + _, ie = `<${Ut}>`, T = document, j = () => T.createComment(""), D = (s) => s === null || typeof s != "object" && typeof s != "function", lt = Array.isArray, se = (s) => lt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, $t = />/g, A = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xt = /'/g, _t = /"/g, Ht = /^(?:script|style|textarea|title)$/i, ne = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), l = ne(1), M = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), wt = /* @__PURE__ */ new WeakMap(), E = T.createTreeWalker(T, 129);
function Pt(s, e) {
  if (!lt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(e) : e;
}
const re = (s, e) => {
  const t = s.length - 1, i = [];
  let n, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = R;
  for (let c = 0; c < t; c++) {
    const o = s[c];
    let d, p, u = -1, m = 0;
    for (; m < o.length && (a.lastIndex = m, p = a.exec(o), p !== null); ) m = a.lastIndex, a === R ? p[1] === "!--" ? a = bt : p[1] !== void 0 ? a = $t : p[2] !== void 0 ? (Ht.test(p[2]) && (n = RegExp("</" + p[2], "g")), a = A) : p[3] !== void 0 && (a = A) : a === A ? p[0] === ">" ? (a = n ?? R, u = -1) : p[1] === void 0 ? u = -2 : (u = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? A : p[3] === '"' ? _t : xt) : a === _t || a === xt ? a = A : a === bt || a === $t ? a = R : (a = A, n = void 0);
    const g = a === A && s[c + 1].startsWith("/>") ? " " : "";
    r += a === R ? o + ie : u >= 0 ? (i.push(d), o.slice(0, u) + Rt + o.slice(u) + _ + g) : o + _ + (u === -2 ? c : g);
  }
  return [Pt(s, r + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: e, _$litType$: t }, i) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const c = e.length - 1, o = this.parts, [d, p] = re(e, t);
    if (this.el = B.createElement(d, i), E.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = E.nextNode()) !== null && o.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(Rt)) {
          const m = p[a++], g = n.getAttribute(u).split(_), $ = /([.?@])?(.*)/.exec(m);
          o.push({ type: 1, index: r, name: $[2], strings: g, ctor: $[1] === "." ? oe : $[1] === "?" ? le : $[1] === "@" ? ce : Z }), n.removeAttribute(u);
        } else u.startsWith(_) && (o.push({ type: 6, index: r }), n.removeAttribute(u));
        if (Ht.test(n.tagName)) {
          const u = n.textContent.split(_), m = u.length - 1;
          if (m > 0) {
            n.textContent = F ? F.emptyScript : "";
            for (let g = 0; g < m; g++) n.append(u[g], j()), E.nextNode(), o.push({ type: 2, index: ++r });
            n.append(u[m], j());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ut) o.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(_, u + 1)) !== -1; ) o.push({ type: 7, index: r }), u += _.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const i = T.createElement("template");
    return i.innerHTML = e, i;
  }
}
function z(s, e, t = s, i) {
  var a, c;
  if (e === M) return e;
  let n = i !== void 0 ? (a = t._$Co) == null ? void 0 : a[i] : t._$Cl;
  const r = D(e) ? void 0 : e._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((c = n == null ? void 0 : n._$AO) == null || c.call(n, !1), r === void 0 ? n = void 0 : (n = new r(s), n._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = n : t._$Cl = n), n !== void 0 && (e = z(s, n._$AS(s, e.values), n, i)), e;
}
class ae {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, n = ((e == null ? void 0 : e.creationScope) ?? T).importNode(t, !0);
    E.currentNode = n;
    let r = E.nextNode(), a = 0, c = 0, o = i[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new K(r, r.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(r, o.name, o.strings, this, e) : o.type === 6 && (d = new de(r, this, e)), this._$AV.push(d), o = i[++c];
      }
      a !== (o == null ? void 0 : o.index) && (r = E.nextNode(), a++);
    }
    return E.currentNode = T, n;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class K {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, n) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = z(this, e, t), D(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== M && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : se(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = B.createElement(Pt(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(t);
    else {
      const a = new ae(n, this), c = a.u(this.options);
      a.p(t), this.T(c), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = wt.get(e.strings);
    return t === void 0 && wt.set(e.strings, t = new B(e)), t;
  }
  k(e) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, n = 0;
    for (const r of e) n === t.length ? t.push(i = new K(this.O(j()), this.O(j()), this, this.options)) : i = t[n], i._$AI(r), n++;
    n < t.length && (this._$AR(i && i._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const n = ft(e).nextSibling;
      ft(e).remove(), e = n;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, n, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, t = this, i, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = z(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== M, a && (this._$AH = e);
    else {
      const c = e;
      let o, d;
      for (e = r[0], o = 0; o < r.length - 1; o++) d = z(this, c[i + o], t, o), d === M && (d = this._$AH[o]), a || (a = !D(d) || d !== this._$AH[o]), d === h ? e = h : e !== h && (e += (d ?? "") + r[o + 1]), this._$AH[o] = d;
    }
    a && !n && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class oe extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class le extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class ce extends Z {
  constructor(e, t, i, n, r) {
    super(e, t, i, n, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = z(this, e, t, 0) ?? h) === M) return;
    const i = this._$AH, n = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== h && (i === h || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class de {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    z(this, e);
  }
}
const q = P.litHtmlPolyfillSupport;
q == null || q(B, K), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.3");
const he = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = n = new K(e.insertBefore(j(), r), r, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class v extends I {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = he(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return M;
  }
}
var Mt;
v._$litElement$ = !0, v.finalized = !0, (Mt = S.litElementHydrateSupport) == null || Mt.call(S, { LitElement: v });
const G = S.litElementPolyfillSupport;
G == null || G({ LitElement: v });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
const jt = L`
  .meta {
    padding: 0 0 14px;
  }
  .deadline {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    align-items: center;
    gap: 3px 10px;
    color: var(--primary-text-color);
  }
  .deadline-icon {
    grid-row: span 2;
    width: 24px;
    height: 24px;
    color: var(--primary-color);
  }
  .deadline-icon svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }
  .deadline-label {
    color: var(--secondary-text-color);
    font-size: 0.72rem;
    font-weight: 500;
  }
  .deadline-value {
    min-width: 0;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
`;
function ct(s, e) {
  var a, c;
  const t = ((a = e == null ? void 0 : e.locale) == null ? void 0 : a.language) ?? ((c = e == null ? void 0 : e.config) == null ? void 0 : c.language) ?? "en", i = t.startsWith("zh"), n = i ? "HKTE 系統回覆限期" : "HKTE reply deadline";
  let r = i ? "HKTE 未提供回覆限期" : "No HKTE reply deadline provided";
  if (s) {
    const o = /^\d{4}-\d{2}-\d{2}$/.test(s), d = new Date(o ? `${s}T00:00:00Z` : s);
    Number.isFinite(d.getTime()) && (r = new Intl.DateTimeFormat(t, {
      dateStyle: "medium",
      ...o ? {} : { timeStyle: "short" },
      timeZone: o ? "UTC" : "Asia/Hong_Kong"
    }).format(d));
  }
  return l`<div class="meta">
    <span class="deadline">
      <span class="deadline-icon" aria-hidden="true"
        ><svg viewBox="0 0 24 24" focusable="false">
          <rect x="3" y="4.5" width="13" height="16" rx="2" />
          <path d="M7 2.5v4M12 2.5v4M3 9h13" />
          <circle cx="17.5" cy="16.5" r="4" />
          <path d="M17.5 14.5v2.3l1.5 1" /></svg
      ></span>
      <span class="deadline-label">${n}</span
      ><span class="deadline-value">${r}</span>
    </span>
  </div>`;
}
const k = (s) => !!s && typeof s == "object" && !Array.isArray(s), b = (s, e = 2e4) => typeof s == "string" && s.length <= e, Q = (s) => Number.isInteger(s), U = () => {
  throw new Error("invalid_reply_form");
};
function tt(s) {
  return !k(s) || !["pending", "unknown", "succeeded", "rejected", "not_sent"].includes(
    String(s.status)
  ) || typeof s.replied != "boolean" || !Q(s.retry_after) || s.retry_after < 0 || s.status === "succeeded" && s.replied !== !0 || s.error != null && !b(s.error, 100) ? U() : s;
}
function pe(s) {
  if (k(s) && s.enabled === !1) return;
  if (!k(s) || s.enabled !== !0 || !b(s.title, 1e3) || !b(s.introduction) || !b(s.form_version, 64) || !/^[a-f0-9]{64}$/.test(s.form_version) || s.deadline !== null && !b(s.deadline, 100) || typeof s.can_sign != "boolean" || typeof s.supported != "boolean" || typeof s.replied != "boolean" || !Array.isArray(s.blocked_reasons) || s.blocked_reasons.length > 200 || !s.blocked_reasons.every((t) => b(t)) || !Array.isArray(s.questions) || s.questions.length > 200)
    return U();
  const e = /* @__PURE__ */ new Map();
  for (const t of s.questions) {
    if (!k(t) || !b(t.id, 200) || !t.id || e.has(t.id) || !b(t.label) || ![
      "acknowledgement",
      "single_choice",
      "multiple_choice",
      "text",
      "quantities",
      "unsupported"
    ].includes(String(t.type)) || typeof t.required != "boolean" || !Array.isArray(t.options) || t.options.length > 200 || !t.options.every(
      (i, n) => k(i) && i.value === n && b(i.label, 4e3)
    ) || !Array.isArray(t.ranges) || t.ranges.length > t.options.length || !t.ranges.every(
      (i) => i === null || k(i) && Object.keys(i).every((n) => ["min", "max"].includes(n)) && Object.values(i).every((n) => Q(n) && n >= -1 && n <= 1e5)
    ) || ["single_choice", "multiple_choice", "quantities"].includes(
      String(t.type)
    ) && !t.options.length)
      return U();
    if (t.when !== null) {
      if (!k(t.when) || !b(t.when.question_id, 200) || !Q(t.when.option_index) || t.when.option_index < 0)
        return U();
      const i = e.get(t.when.question_id);
      if (!i || !["single_choice", "multiple_choice", "quantities", "text"].includes(
        i.type
      ) || t.when.option_index >= (i.type === "text" ? 1 : i.options.length))
        return U();
    }
    e.set(t.id, t);
  }
  return s.operation !== void 0 && tt(s.operation), s;
}
function V(s, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of s.questions) {
    if (i.when) {
      const n = t.get(i.when.question_id);
      if (!n) continue;
      const r = e[n.id], a = i.when.option_index;
      if (!(n.type === "text" ? typeof r == "string" && !!r.trim() : Array.isArray(r) && (n.type === "quantities" ? r[a] > 0 : r.includes(a)))) continue;
    }
    t.set(i.id, i);
  }
  return [...t.values()];
}
function vt(s, e) {
  return Object.fromEntries(
    V(s, e).filter((t) => e[t.id] !== void 0).map((t) => [t.id, e[t.id]])
  );
}
function At(s, e) {
  return !s.can_sign || !s.supported || s.replied ? !1 : V(s, e).every((t) => {
    const i = e[t.id];
    return t.type === "unsupported" ? !1 : t.type === "acknowledgement" ? i === void 0 || i === "" : i === void 0 ? !t.required : t.type === "text" ? typeof i == "string" && i.length <= 1e4 && (!t.required || !!i.trim()) : !Array.isArray(i) || !i.every((n) => Number.isInteger(n) && n >= 0 && n <= 1e5) ? !1 : t.type === "quantities" ? i.length === t.options.length && (!t.required || i.some((n) => n > 0)) && i.every((n, r) => {
      const a = t.ranges[r];
      return (!a || a.min == null || a.min < 0 || n >= a.min) && (!a || a.max == null || a.max < 0 || n <= a.max);
    }) : (!t.required || i.length > 0) && (t.type !== "single_choice" || i.length <= 1) && new Set(i).size === i.length && i.every((n) => t.options.some((r) => r.value === n));
  });
}
function ue(s, e) {
  return typeof e == "string" ? e : e ? s.type === "quantities" ? s.options.map((t, i) => `${t.label}: ${e[i]}`).join(" / ") : s.options.filter((t) => e.includes(t.value)).map((t) => t.label).join(" / ") : "—";
}
class et extends v {
  constructor() {
    super();
    f(this, "signature", "");
    f(this, "generation", 0);
    this.answers = {}, this.comment = "", this.reviewing = !1, this.busy = !1, this.error = "";
  }
  t(t, i) {
    var n, r, a, c;
    return (((r = (n = this.hass) == null ? void 0 : n.locale) == null ? void 0 : r.language) ?? ((c = (a = this.hass) == null ? void 0 : a.config) == null ? void 0 : c.language) ?? "en").startsWith("zh") ? t : i;
  }
  get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }
  updated(t) {
    var n, r, a;
    const i = JSON.stringify([
      this.entityId,
      (n = this.notice) == null ? void 0 : n.id,
      (r = this.notice) == null ? void 0 : r.replied
    ]);
    this.notice && ((a = this.hass) != null && a.fetchWithAuth) && i !== this.signature && (this.signature = i, this.generation++, this.load());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.generation++;
  }
  async request(t, i) {
    const n = await this.hass.fetchWithAuth(
      this.path + t,
      i === void 0 ? void 0 : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(i)
      }
    ), r = await n.json();
    if (!n.ok)
      throw new Error(
        typeof r.error == "string" ? r.error : "hub_unavailable"
      );
    return r;
  }
  async load() {
    const t = this.generation;
    this.busy = !0;
    try {
      const i = pe(await this.request("/reply-form"));
      if (t !== this.generation) return;
      this.form = i, this.operation = i == null ? void 0 : i.operation, this.error = "";
    } catch {
      t === this.generation && (this.error = this.t(
        "未能取得回覆表格，請檢查 Message Hub 設定後重試。",
        "Could not load reply form. Check Message Hub settings and retry."
      ));
    } finally {
      t === this.generation && (this.busy = !1);
    }
  }
  async open() {
    var i;
    this.answers = {}, this.comment = "", this.reviewing = !1, await this.load(), await this.updateComplete;
    const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector("dialog");
    t && !t.open && t.showModal();
  }
  close() {
    var t, i;
    this.busy || (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("dialog")) == null || i.close();
  }
  setAnswer(t, i) {
    this.answers = { ...this.answers, [t.id]: i }, this.form && (this.answers = vt(this.form, this.answers));
  }
  question(t) {
    const i = this.answers[t.id];
    return l`<fieldset>
      <legend class="label">${t.label}${t.required ? " *" : h}</legend>
      ${t.type === "acknowledgement" ? l`<p class="hint">
              ${this.t("請閱讀後在確認步驟簽署知悉。", "Review this acknowledgement before confirming your signature.")}
            </p>` : t.type === "text" ? l`<textarea
                aria-label=${t.label}
                maxlength="10000"
                .value=${typeof i == "string" ? i : ""}
                @input=${(n) => this.setAnswer(t, n.target.value)}
              ></textarea>` : t.options.map(
      (n, r) => {
        var a, c;
        return l`<label class="option">
                    ${t.type === "quantities" ? l`<input
                            type="number"
                            aria-label=${n.label}
                            min=${Math.max(0, ((a = t.ranges[r]) == null ? void 0 : a.min) ?? 0)}
                            max=${((c = t.ranges[r]) == null ? void 0 : c.max) != null && t.ranges[r].max >= 0 ? t.ranges[r].max : 1e5}
                            step="1"
                            .value=${Array.isArray(i) ? String(i[r] ?? "") : ""}
                            @input=${(o) => {
          const d = o.target.valueAsNumber, p = Array.isArray(i) ? [...i] : t.options.map(() => 0);
          p[r] = d, this.setAnswer(t, p);
        }}
                          /> ` : l`<input
                            type=${t.type === "single_choice" ? "radio" : "checkbox"}
                            name=${t.id}
                            .checked=${Array.isArray(i) && i.includes(n.value)}
                            @change=${(o) => {
          const d = o.target.checked;
          this.setAnswer(
            t,
            t.type === "single_choice" ? [n.value] : d ? [...Array.isArray(i) ? i : [], n.value] : (Array.isArray(i) ? i : []).filter(
              (p) => p !== n.value
            )
          );
        }}
                          />`}
                    <span>${n.label}</span></label
                  >`;
      }
    )}
      ${t.type === "single_choice" && !t.required ? l`<button @click=${() => this.setAnswer(t, [])}>${this.t("清除選擇", "Clear selection")}</button>` : h}
    </fieldset>`;
  }
  async submit() {
    if (!(this.busy || !this.reviewing || !this.form || !At(this.form, this.answers))) {
      this.busy = !0, this.error = "";
      try {
        this.operation = tt(
          await this.request("/sign", {
            form_version: this.form.form_version,
            answers: vt(this.form, this.answers),
            comment: this.comment,
            confirmed: !0
          })
        ), this.reviewing = !1, this.operation.status === "not_sent" && (await this.load(), this.answers = {}, this.comment = "", this.error = this.t(
          "未有提交：表格或狀態可能已改變。請重新查看並確認答案。",
          "Not submitted: the form or state may have changed. Review the form and answers again."
        ));
      } catch (t) {
        t instanceof Error && [
          "form_changed",
          "invalid_answers",
          "cannot_sign",
          "signing_not_configured"
        ].includes(t.message) ? (await this.load(), this.answers = {}, this.comment = "", this.error = this.t(
          "未有提交，請重新查看表格及確認答案。",
          "Not submitted. Review the form and answers again."
        )) : this.operation = {
          status: "unknown",
          replied: !1,
          retry_after: 300
        }, this.reviewing = !1;
      } finally {
        this.busy = !1;
      }
    }
  }
  async check() {
    if (!this.busy) {
      this.busy = !0;
      try {
        this.operation = tt(await this.request("/sign-status", {})), this.error = "";
      } catch {
        this.error = this.t(
          "未能確認結果，請稍後檢查或使用官方 App。",
          "Could not confirm the result. Check later or use the official app."
        );
      } finally {
        this.busy = !1;
      }
    }
  }
  operationText() {
    var t;
    switch ((t = this.operation) == null ? void 0 : t.status) {
      case "succeeded":
        return this.t(
          "已由 HKTE 確認簽署成功。",
          "Signature confirmed by HKTE."
        );
      case "rejected":
        return this.t(
          "HKTE 拒絕此回覆，請在官方 App 查看。",
          "HKTE rejected this reply. Check the official app."
        );
      case "pending":
      case "unknown":
        return this.t(
          "簽署結果未確認，可能已提交。請至少等候 5 分鐘再檢查；不要重新簽署。",
          "Result unconfirmed; it may already be submitted. Wait at least 5 minutes before checking. Do not sign again."
        );
      default:
        return "";
    }
  }
  render() {
    var a, c, o, d;
    const t = this.form, i = ["pending", "unknown"].includes(
      ((a = this.operation) == null ? void 0 : a.status) ?? ""
    ), n = ["succeeded", "rejected"].includes(
      ((c = this.operation) == null ? void 0 : c.status) ?? ""
    ), r = (t == null ? void 0 : t.can_sign) && t.supported && !t.replied && !i && !n;
    return l` ${r ? l`<button
              class="sign"
              ?disabled=${this.busy}
              @click=${() => this.open()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 5H4v16h16v-9M10 14l1-4 8-8 3 3-8 8-4 1Z" /></svg
              >${this.t("簽署通告", "Sign notice")}
            </button>` : i ? l`<button @click=${() => this.open()}>
                ${this.t("查看簽署結果", "Check signature")}
              </button>` : t && !t.replied && !n ? l`<p class="hint">${t.blocked_reasons.join("；")}</p>` : h}
      ${((o = this.operation) == null ? void 0 : o.status) === "succeeded" ? l`<p role="status">${this.operationText()}</p>` : h}
      ${this.error ? l`<p class="error" role="alert">${this.error}</p>
              <button ?disabled=${this.busy} @click=${() => this.load()}>
                ${this.t("重新取得表格", "Reload reply form")}
              </button>` : h}
      <dialog
        aria-label=${this.t("簽署通告", "Sign notice")}
        @cancel=${(p) => {
      this.busy && p.preventDefault();
    }}
      >
        <h3>${(t == null ? void 0 : t.title) ?? ((d = this.notice) == null ? void 0 : d.title)}</h3>
        ${t ? ct(t.deadline, this.hass) : h}
        ${this.operationText() ? l`<p role="status">${this.operationText()}</p>` : h}
        ${this.error ? l`<p class="error" role="alert">${this.error}</p>` : h}
        ${r && t ? l`
                <p>${t.introduction}</p>
                ${this.reviewing ? l`<h4>
                          ${this.t("確認以下回覆", "Review your reply")}
                        </h4>
                        <dl>
                          ${V(t, this.answers).map(
      (p) => l`<dt>${p.label}</dt>
                                <dd>
                                  <span class="answer"
                                    >${p.type === "acknowledgement" ? this.t("確認知悉", "Acknowledged") : ue(p, this.answers[p.id])}</span
                                  >
                                </dd>`
    )}
                        </dl>
                        ${this.comment ? l`<p>${this.comment}</p>` : h}
                        <p>
                          ${this.t("確認後會簽署真實 HKTE 通告，無法在此撤銷或修改回覆。", "Confirming signs the real HKTE notice. Replies cannot be undone or edited here.")}
                        </p>` : l`${V(t, this.answers).map((p) => this.question(p))}<label
                          >${this.t("備註（可留空）", "Comment (optional)")}<textarea
                            maxlength="10000"
                            .value=${this.comment}
                            @input=${(p) => this.comment = p.target.value}
                          ></textarea>
                        </label>`}
              ` : h}
        <div class="footer">
          <button ?disabled=${this.busy} @click=${() => this.close()}>
            ${this.t("關閉", "Close")}
          </button>
          ${i ? l`<button ?disabled=${this.busy} @click=${() => this.check()}>${this.t("檢查結果", "Check result")}</button>` : h}
          ${r && t ? this.reviewing ? l`<button
                      ?disabled=${this.busy}
                      @click=${() => this.reviewing = !1}
                    >
                      ${this.t("返回修改", "Edit answers")}</button
                    ><button
                      class="primary"
                      ?disabled=${this.busy}
                      @click=${() => this.submit()}
                    >
                      ${this.busy ? this.t("提交中…", "Submitting…") : this.t("確認並簽署", "Confirm and sign")}
                    </button>` : l`<button
                    class="primary"
                    ?disabled=${this.busy || !At(t, this.answers)}
                    @click=${() => this.reviewing = !0}
                  >
                    ${this.t("檢查回覆", "Review reply")}
                  </button>` : h}
        </div>
      </dialog>`;
  }
}
f(et, "properties", {
  hass: { attribute: !1 },
  entityId: { attribute: !1 },
  notice: { attribute: !1 },
  form: { state: !0 },
  operation: { state: !0 },
  answers: { state: !0 },
  comment: { state: !0 },
  reviewing: { state: !0 },
  busy: { state: !0 },
  error: { state: !0 }
}), f(et, "styles", [
  jt,
  L`
      :host {
        display: block;
        margin: 0 0 14px;
      }
      button {
        font: inherit;
        cursor: pointer;
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        min-height: 40px;
        padding: 8px 12px;
      }
      button:disabled {
        opacity: 0.5;
        cursor: default;
      }
      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .sign {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        color: var(--primary-color);
      }
      .sign svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
      }
      dialog {
        box-sizing: border-box;
        width: min(560px, calc(100vw - 24px));
        max-height: 85dvh;
        overflow: auto;
        padding: 22px;
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        color: var(--primary-text-color);
        background: var(--card-background-color, #fff);
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.55);
      }
      h3 {
        margin: 0 0 10px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
      p,
      .label,
      dd {
        white-space: normal;
        overflow-wrap: anywhere;
        line-height: 1.6;
      }
      .answer {
        white-space: pre-wrap;
      }
      p,
      .hint {
        font-size: 0.85rem;
      }
      .hint {
        color: var(--secondary-text-color);
      }
      .error {
        color: var(--error-color, #db4437);
      }
      fieldset {
        border: 0;
        padding: 0;
        margin: 20px 0;
        min-width: 0;
      }
      legend {
        font-weight: 600;
        margin-bottom: 10px;
        padding: 0;
      }
      label.option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
      }
      input,
      textarea {
        box-sizing: border-box;
        font: inherit;
        color: inherit;
        background: var(--secondary-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      input[type="radio"],
      input[type="checkbox"] {
        accent-color: var(--primary-color);
        width: 20px;
        height: 20px;
        flex: none;
      }
      input[type="number"] {
        width: 95px;
        padding: 8px;
      }
      textarea {
        width: 100%;
        padding: 10px;
        min-height: 80px;
      }
      .footer {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 22px;
      }
      .primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      dt {
        font-weight: 600;
        margin-top: 15px;
      }
      dd {
        margin: 5px 0 0;
      }
    `
]);
customElements.define("hkte-sign-notice", et);
const kt = [
  "highlights",
  "dates",
  "costs",
  "actions",
  "questions"
], x = (s) => s !== null && typeof s == "object" && !Array.isArray(s), N = (s, e) => typeof s == "string" && s.length <= e;
function me(s) {
  if (!x(s) || typeof s.enabled != "boolean" || !["idle", "running", "completed", "partial", "failed"].includes(
    String(s.status)
  ) || s.stage !== void 0 && !["downloading", "rendering", "analyzing"].includes(String(s.stage)))
    return !1;
  for (const i of ["stage", "error"])
    if (s[i] !== void 0 && !N(s[i], 100)) return !1;
  if (s.stale !== void 0 && typeof s.stale != "boolean" || s.processed !== void 0 && (!Number.isInteger(s.processed) || Number(s.processed) < 0 || Number(s.processed) > 10) || s.missing !== void 0 && (!Array.isArray(s.missing) || s.missing.length > 10 || !s.missing.every(
    (i) => x(i) && N(i.filename, 4096) && N(i.error, 100)
  )) || s.sources !== void 0 && (!Array.isArray(s.sources) || s.sources.length > 21 || !s.sources.every(
    (i) => x(i) && N(i.attachment_id, 4096) && N(i.filename, 4096) && Number.isInteger(i.page) && Number(i.page) >= 0 && Number(i.page) <= 20
  )))
    return !1;
  if (s.summary === void 0)
    return s.primary_deadline == null && !["completed", "partial"].includes(String(s.status));
  if (!x(s.summary) || Object.keys(s.summary).length !== kt.length || !Array.isArray(s.sources))
    return !1;
  const e = s.sources;
  if (s.primary_deadline !== void 0 && s.primary_deadline !== null) {
    const i = s.primary_deadline;
    if (!x(i) || Object.keys(i).length !== 4 || typeof i.date != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(i.date) || !Number.isFinite(Date.parse(i.date)) || new Date(i.date).toISOString().slice(0, 10) !== i.date || i.time !== null && (typeof i.time != "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(i.time)) || !["reply", "submission"].includes(String(i.kind)) || !Array.isArray(i.sources) || i.sources.length === 0 || i.sources.length > 20 || !i.sources.every(
      (n) => x(n) && Object.keys(n).length === 2 && typeof n.attachment_id == "string" && Number.isInteger(n.page) && e.some(
        (r) => r.attachment_id === n.attachment_id && r.page === n.page
      )
    ))
      return !1;
  }
  let t = 0;
  for (const i of kt) {
    const n = s.summary[i];
    if (!Array.isArray(n) || n.length > 20) return !1;
    for (const r of n)
      if (!x(r) || Object.keys(r).length !== 2 || !N(r.text, 2e3) || !r.text.trim() || !Array.isArray(r.sources) || r.sources.length > 20 || (t += r.text.length, !r.sources.every(
        (a) => x(a) && Object.keys(a).length === 2 && typeof a.attachment_id == "string" && Number.isInteger(a.page) && e.some(
          (c) => c.attachment_id === a.attachment_id && c.page === a.page
        )
      )))
        return !1;
  }
  return t > 0 && t <= 16e3;
}
function Et(s) {
  if (!me(s)) throw new Error("invalid_ai_response");
  return s;
}
const ge = {
  notice_truncated: [
    "通告正文不完整，未進行分析。",
    "Notice text is truncated; analysis was not started."
  ],
  no_content: [
    "通告沒有可分析的內容。",
    "No notice content is available to analyze."
  ],
  download_failed: [
    "附件下載失敗，請重試。",
    "Attachment download failed. Try again."
  ],
  invalid_source: ["附件來源不受支援。", "Unsupported attachment source."],
  empty_file: [
    "HKTE 回傳空白附件，請稍後重試。",
    "HKTE returned an empty file. Try later."
  ],
  invalid_file: ["附件不是有效檔案。", "The attachment is not a valid file."],
  attachment_not_found: [
    "找不到附件，請更新通告。",
    "Attachment not found. Refresh the notice."
  ],
  invalid_session: ["HKTE 下載連線失效。", "HKTE download session expired."],
  file_too_large: ["附件超過 20 MiB 限制。", "Attachment exceeds 20 MiB."],
  too_many_attachments: [
    "每次最多分析 10 個附件。",
    "At most 10 attachments per analysis."
  ],
  too_many_pages: [
    "附件總頁數超過 20 頁限制。",
    "Attachments exceed the 20-page limit."
  ],
  analysis_too_large: [
    "附件總大小超過 40 MiB 限制。",
    "Attachments exceed 40 MiB in total."
  ],
  image_too_large: ["圖片尺寸過大。", "Image dimensions are too large."],
  unsupported_file: [
    "此格式不支援 AI 分析。",
    "This format cannot be analyzed."
  ],
  unreadable_file: [
    "檔案損壞、加密或無法讀取。",
    "File is damaged, encrypted or unreadable."
  ],
  all_attachments_failed: [
    "所有附件均無法分析，請檢查附件後重試。",
    "No attachments could be analyzed. Check the files and retry."
  ],
  ai_auth: [
    "AI 金鑰或存取權限無效，請檢查整合設定。",
    "Check the AI key and provider permissions."
  ],
  ai_rate_limit: [
    "AI 服務用量受限，請稍後重試。",
    "AI rate limit reached. Try later."
  ],
  ai_unsupported_input: [
    "AI 服務不接受此輸入，請確認模型支援圖片。",
    "AI rejected the input. Check vision model support."
  ],
  ai_not_configured: [
    "請先在整合選項設定 AI 服務。",
    "Configure AI in the integration options first."
  ],
  ai_timeout: ["AI 分析逾時，請重試。", "AI request timed out. Try again."],
  ai_connection: ["無法連接 AI 服務。", "Cannot connect to the AI provider."],
  ai_failed: ["AI 服務發生錯誤，請重試。", "AI provider error. Try again."],
  invalid_ai_response: [
    "AI 回應格式或來源引用無效，請重試。",
    "Invalid AI response or source references. Try again."
  ],
  ai_incomplete_response: [
    "AI 回應被截斷或拒絕處理，未產生新摘要。請重試或更換模型。",
    "AI response was truncated or refused. No new summary was saved. Retry or change model."
  ],
  account_busy: [
    "正在分析另一份通告，請稍後重試。",
    "Another notice is being analyzed. Try later."
  ],
  analysis_timeout: ["分析逾時，請重試。", "Analysis timed out. Try again."],
  cancelled: ["分析已中止，請重試。", "Analysis was interrupted. Try again."],
  unavailable: ["暫時無法連接通告服務。", "Notice service is unavailable."]
};
class it extends v {
  constructor() {
    super();
    f(this, "signature", "");
    f(this, "timer");
    f(this, "generation", 0);
    this.error = "", this.downloads = /* @__PURE__ */ new Set(), this.submitting = !1;
  }
  get zh() {
    var t, i, n, r;
    return (((i = (t = this.hass) == null ? void 0 : t.locale) == null ? void 0 : i.language) ?? ((r = (n = this.hass) == null ? void 0 : n.config) == null ? void 0 : r.language) ?? "en").startsWith("zh");
  }
  text(t, i) {
    return this.zh ? t : i;
  }
  message(t) {
    var i;
    return ((i = ge[t]) == null ? void 0 : i[this.zh ? 0 : 1]) ?? this.text("分析失敗，請重試。", "Analysis failed. Try again.");
  }
  get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }
  updated(t) {
    var n;
    if (!((n = this.hass) != null && n.fetchWithAuth) || !this.notice || !this.entityId) return;
    const i = JSON.stringify([this.entityId, this.notice]);
    i !== this.signature && (this.signature = i, this.generation++, clearTimeout(this.timer), this.state = void 0, this.error = "", this.load());
  }
  connectedCallback() {
    super.connectedCallback(), this.signature = "", this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this.timer), this.generation++;
  }
  async request(t, i) {
    var r;
    if (!((r = this.hass) != null && r.fetchWithAuth)) throw new Error("unavailable");
    const n = await this.hass.fetchWithAuth(t, i);
    if (!n.ok) {
      const a = await n.json().catch(() => ({}));
      throw new Error(
        typeof a.error == "string" ? a.error : "unavailable"
      );
    }
    return n;
  }
  async load() {
    const t = this.generation;
    try {
      const i = Et(
        await (await this.request(`${this.path}/analysis`)).json()
      );
      if (!this.isConnected || t !== this.generation) return;
      this.state = i, this.error = "", i.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch (i) {
      t === this.generation && (this.error = i instanceof Error && i.message === "invalid_ai_response" ? i.message : "unavailable");
    }
  }
  async start() {
    var i;
    const t = this.generation;
    this.submitting = !0, this.error = "", clearTimeout(this.timer);
    try {
      const n = Et(
        await (await this.request(`${this.path}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ force: !!((i = this.state) != null && i.summary) })
        })).json()
      );
      if (t !== this.generation) return;
      this.state = n, n.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch (n) {
      t === this.generation && (this.error = n instanceof Error ? n.message : "unavailable");
    } finally {
      this.submitting = !1;
    }
  }
  async download(t) {
    this.downloads = /* @__PURE__ */ new Set([...this.downloads, t.id]), this.error = "";
    try {
      const n = await (await this.request(
        `${this.path}/attachment/${encodeURIComponent(t.id)}`
      )).blob();
      if (n.size === 0) throw new Error("empty_file");
      const r = URL.createObjectURL(n), a = document.createElement("a");
      a.href = r, a.download = t.filename.replace(/[/\\\x00-\x1f]/g, "_"), a.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
    } catch (i) {
      this.error = i instanceof Error ? i.message : "download_failed";
    } finally {
      this.downloads = new Set(
        [...this.downloads].filter((i) => i !== t.id)
      );
    }
  }
  render() {
    var a, c, o;
    if (!this.notice) return h;
    const t = this.state, i = (t == null ? void 0 : t.status) === "running" || this.submitting, n = [
      ["highlights", "內容重點", "Highlights"],
      ["dates", "重要日期", "Important dates"],
      ["costs", "費用", "Costs"],
      ["actions", "家長待辦", "Parent actions"],
      ["questions", "需確認事項", "To confirm"]
    ], r = (t == null ? void 0 : t.stage) === "analyzing" ? this.text("AI 分析中", "Analyzing") : (t == null ? void 0 : t.stage) === "rendering" ? this.text("處理附件頁面", "Rendering pages") : this.text("取得附件", "Fetching attachments");
    return l`
      ${ct(this.notice.deadline, this.hass)}
      ${((c = (a = this.hass) == null ? void 0 : a.states[this.entityId]) == null ? void 0 : c.attributes.signing_enabled) === !0 ? l`<hkte-sign-notice .hass=${this.hass} .entityId=${this.entityId} .notice=${this.notice}></hkte-sign-notice>` : h}
      <div class="body-row">
        <slot name="body"></slot>
        ${!this.showAttachments || this.notice.attachments.length === 0 ? this.analyzeButton(t, i) : h}
      </div>
      ${this.showAttachments ? l`<div class="files">
              ${this.notice.attachments.map(
      (d, p) => {
        var u;
        return l`<div class="file">
                    <div class="name">
                      ${d.filename}
                      <div class="metadata">
                        ${d.size !== null ? `${Math.round(d.size / 1024)} KB` : h}
                      </div>
                    </div>
                    <div class="file-actions">
                      ${p === 0 ? this.analyzeButton(t, i) : h}
                      <button
                        class="icon"
                        title=${this.text("下載附件", "Download attachment")}
                        aria-label=${this.text("下載附件", "Download attachment")}
                        ?disabled=${!d.id || !((u = this.hass) != null && u.fetchWithAuth) || this.downloads.has(d.id)}
                        @click=${() => this.download(d)}
                      >
                        <ha-icon icon="mdi:download"></ha-icon>
                      </button>
                    </div>
                  </div>`;
      }
    )}
            </div>` : h}
      ${t && !t.enabled ? l`<p class="progress">${this.message("ai_not_configured")}</p>` : h}
      ${i ? l`<p class="progress" role="status">${r} (${(t == null ? void 0 : t.processed) ?? 0}/${this.notice.attachments.length})</p>` : h}
      ${this.error || t != null && t.error ? l`<p class="error" role="alert">
                ${this.message(this.error || (t == null ? void 0 : t.error) || "")}
              </p>
              ${this.error ? l`<button @click=${() => this.load()}>${this.text("重試連線", "Retry connection")}</button>` : h}` : h}
      ${t != null && t.stale ? l`<p class="warning">${this.text("通告或模型設定已更新，請重新分析。", "Notice or model settings changed. Analyze again.")}</p>` : h}
      ${(t == null ? void 0 : t.status) === "partial" ? l`<p class="warning">${this.text("部分完成", "Partially completed")}</p>` : h}
      ${(o = t == null ? void 0 : t.missing) == null ? void 0 : o.map((d) => l`<p class="warning">${d.filename}: ${this.message(d.error)}</p>`)}
      ${t != null && t.summary ? l`<div class="summary">
              ${n.map(
      ([d, p, u]) => {
        var m, g;
        return l`<h4>${this.text(p, u)}</h4>
                    <ul>
                      ${(g = (m = t.summary) == null ? void 0 : m[d]) != null && g.length ? t.summary[d].map(
          ($) => l`<li>
                                  <span class="summary-text">${$.text}</span>
                                </li>`
        ) : l`<li class="metadata">
                              ${this.text("未提供", "Not provided")}
                            </li>`}
                    </ul>`;
      }
    )}
            </div>` : h}
    `;
  }
  analyzeButton(t, i) {
    const n = t != null && t.summary ? this.text("重新分析", "Analyze again") : this.text("AI 整理重點", "AI summary");
    return l`<button
      class="icon"
      title=${n}
      aria-label=${n}
      ?disabled=${i || !(t != null && t.enabled)}
      @click=${() => this.start()}
    >
      <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
    </button>`;
  }
}
f(it, "properties", {
  hass: { attribute: !1 },
  entityId: { attribute: !1 },
  notice: { attribute: !1 },
  showAttachments: { attribute: !1 },
  state: { state: !0 },
  error: { state: !0 },
  downloads: { state: !0 },
  submitting: { state: !0 }
}), f(it, "styles", [
  jt,
  L`
      :host {
        display: block;
        margin: 0 14px 14px;
        padding-top: 12px;
        font-size: 14px;
      }
      .files {
        margin: 0 0 12px;
        padding: 10px 12px;
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 80%, transparent);
        border-radius: 6px;
        background: color-mix(
          in srgb,
          var(--secondary-background-color, transparent) 70%,
          transparent
        );
      }
      .body-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        gap: 12px;
        padding: 2px 0 16px;
      }
      slot[name="body"] {
        min-width: 0;
        align-self: center;
      }
      .action-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
      }
      .file-actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex: none;
      }
      .file {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
      }
      .name {
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .metadata,
      .progress {
        color: var(--secondary-text-color);
        font-size: 12px;
        overflow-wrap: anywhere;
      }
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 40px;
        font: inherit;
        color: var(--primary-color);
        background: transparent;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        cursor: pointer;
        padding: 6px 10px;
      }
      button.icon {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        padding: 8px;
      }
      button:disabled {
        opacity: 0.55;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      ha-icon {
        --mdc-icon-size: 20px;
      }
      .error {
        color: var(--error-color);
      }
      .summary {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid
          color-mix(in srgb, var(--primary-color) 22%, var(--divider-color));
        border-radius: 6px;
        background: color-mix(in srgb, var(--primary-color) 4%, transparent);
      }
      h4 {
        margin: 12px 0 5px;
        font-size: 14px;
        font-weight: 700;
      }
      ul {
        margin: 0;
        padding-inline-start: 20px;
      }
      li {
        margin: 6px 0;
        overflow-wrap: anywhere;
      }
      .summary-text {
        white-space: pre-wrap;
      }
      .warning {
        color: var(--warning-color, #a66800);
      }
    `
]);
customElements.define("hkte-notice-actions", it);
const Dt = 20, fe = 5, ye = 30;
function C(s, e = "") {
  return typeof s == "string" ? s : e;
}
function St(s) {
  return typeof s == "string" && s.length > 0 ? s : null;
}
function Ct(s) {
  return typeof s == "boolean" ? s : null;
}
function be(s) {
  if (!s || typeof s != "object") return null;
  const e = s, t = C(e.filename);
  return t ? {
    id: C(e.id),
    filename: t,
    mime_type: C(e.mime_type, "application/octet-stream"),
    size: typeof e.size == "number" && e.size >= 0 ? e.size : null
  } : null;
}
function $e(s, e) {
  if (!s || typeof s != "object") return null;
  const t = s, i = C(t.title, "Untitled notice");
  return {
    id: C(t.id, `notice-${e}`),
    title: i,
    content: C(t.content),
    issued_at: St(t.issued_at),
    deadline: St(t.deadline),
    unread: Ct(t.unread),
    replied: Ct(t.replied),
    content_truncated: t.content_truncated === !0,
    attachments: Array.isArray(t.attachments) ? t.attachments.map(be).filter((n) => n !== null) : []
  };
}
function Tt(s) {
  if (!s) return Number.NEGATIVE_INFINITY;
  const e = Date.parse(s);
  return Number.isNaN(e) ? Number.NEGATIVE_INFINITY : e;
}
function xe(s, e) {
  const t = e.attributes.notices;
  if (!Array.isArray(t)) return null;
  const n = [
    ...t.map($e).filter((r) => r !== null).sort((r, a) => Tt(a.issued_at) - Tt(r.issued_at)).reduce((r, a) => (r.has(a.id) || r.set(a.id, a), r), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: s,
    name: C(e.attributes.friendly_name, s),
    state: e.state,
    notices: n,
    hasMore: e.attributes.has_more === !0
  };
}
function _e(s, e) {
  return (e != null && e.length ? e : Object.keys(s.states)).map((i) => {
    const n = s.states[i];
    return n ? xe(i, n) : null;
  }).filter((i) => i !== null).sort((i, n) => i.name.localeCompare(n.name));
}
function Nt(s, e, t, i = 0, n = Date.now()) {
  const r = Math.min(Dt, Math.max(1, Math.round(t))), a = Bt(i), c = n - a * 24 * 60 * 60 * 1e3;
  return s.notices.filter((o) => e === "all" || o.unread === !0).filter((o) => {
    if (a === 0 || !o.issued_at) return !0;
    const d = Date.parse(o.issued_at);
    return Number.isNaN(d) || d >= c;
  }).slice(0, r);
}
function we(s) {
  const e = typeof s == "number" && Number.isFinite(s) ? s : fe;
  return Math.min(Dt, Math.max(1, Math.round(e)));
}
function Bt(s) {
  const e = typeof s == "number" && Number.isFinite(s) ? s : 0;
  return Math.min(ye, Math.max(0, Math.round(e)));
}
const It = {
  zh: {
    all: "全部",
    unread: "未讀",
    read: "已讀",
    issued: "發出",
    replied: "已回覆",
    noReply: "未回覆",
    noBody: "此通告未提供文字正文。",
    truncated: "正文超過顯示上限。",
    noNotices: "暫無通告。",
    unavailable: "通告資料暫時無法載入。",
    noEntities: "找不到 HKTE 通告 sensor。",
    more: "尚有其他通告",
    attachments: "附件",
    noDate: "未提供"
  },
  en: {
    all: "All",
    unread: "Unread",
    read: "Read",
    issued: "Issued",
    replied: "Replied",
    noReply: "Not replied",
    noBody: "This notice has no text content.",
    truncated: "The notice body is truncated.",
    noNotices: "No notices.",
    unavailable: "Notice data is temporarily unavailable.",
    noEntities: "No HKTE notice sensors found.",
    more: "More notices are available",
    attachments: "Attachments",
    noDate: "Not provided"
  }
};
function st(s) {
  var t, i;
  return (((t = s == null ? void 0 : s.locale) == null ? void 0 : t.language) ?? ((i = s == null ? void 0 : s.config) == null ? void 0 : i.language) ?? "en").toLowerCase().startsWith("zh") ? It.zh : It.en;
}
function ve(s, e) {
  return s.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || e;
}
function Ae(s) {
  if (!s || typeof s != "object" || Array.isArray(s))
    return;
  const e = Object.entries(s).reduce((t, [i, n]) => (typeof n == "string" && n.trim() && (t[i] = n.trim()), t), {});
  return Object.keys(e).length ? e : void 0;
}
function ke(s, e) {
  var n;
  const t = st(e);
  if (!s) return t.noDate;
  const i = new Date(s);
  if (Number.isNaN(i.getTime())) return s;
  try {
    return new Intl.DateTimeFormat(((n = e == null ? void 0 : e.locale) == null ? void 0 : n.language) || void 0, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(i);
  } catch {
    return s;
  }
}
function Ee(s) {
  return s === null ? "" : s < 1024 ? `${s} B` : s < 1048576 ? `${Math.round(s / 1024)} KB` : `${(s / 1048576).toFixed(1)} MB`;
}
function Se() {
  return l`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}
function Ce() {
  return l`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}
class nt extends v {
  static async getConfigElement() {
    return document.createElement("hkte-notices-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:hkte-notices-card",
      title: "HKTE Notices",
      filter: "all",
      limit: 5,
      days: 0,
      initially_expanded: "latest",
      show_student_name: !0,
      show_attachments: !0
    };
  }
  setConfig(e) {
    if (!e || e.type !== "custom:hkte-notices-card")
      throw new Error("Invalid HKTE notices card configuration");
    const t = ["latest", "none", "all"].includes(
      e.initially_expanded ?? "latest"
    ) ? e.initially_expanded ?? "latest" : "latest";
    this.config = {
      ...e,
      entities: Array.isArray(e.entities) ? e.entities.filter(
        (i) => typeof i == "string"
      ) : void 0,
      entity_names: Ae(e.entity_names),
      filter: e.filter === "unread" ? "unread" : "all",
      limit: we(e.limit),
      days: Bt(e.days),
      initially_expanded: t,
      show_student_name: e.show_student_name !== !1,
      show_attachments: e.show_attachments !== !1
    };
  }
  getCardSize() {
    return 4;
  }
  _feeds() {
    var e;
    return _e(this.hass ?? { states: {} }, (e = this.config) == null ? void 0 : e.entities);
  }
  _notice(e, t, i, n) {
    var c, o, d, p;
    const r = st(this.hass), a = i === "all" || i === "latest" && t === 0;
    return l`<details
      class=${e.unread === !0 ? "unread-notice" : ""}
      ?open=${a}
    >
      <summary>
        <span class="title-content">
          <span class="title">${e.title}</span>
          <span class="issued-title"
            >${ke(e.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${e.unread === !0 ? l`<span class="unread">${r.unread}</span>` : h}
          ${e.unread === !1 ? l`<span
                  class="status-icon read-status"
                  title=${r.read}
                  aria-label=${r.read}
                  role="img"
                  >${Se()}</span
                >` : h}
          ${e.replied === !0 ? l`<span
                  class="status-icon replied-status"
                  title=${r.replied}
                  aria-label=${r.replied}
                  role="img"
                  >${Ce()}</span
                >` : h}
        </span>
      </summary>
      ${(c = this.hass) != null && c.fetchWithAuth ? l`<hkte-notice-actions
              .hass=${this.hass}
              .entityId=${n}
              .notice=${e}
              .showAttachments=${((o = this.config) == null ? void 0 : o.show_attachments) !== !1}
              ><div class="body" slot="body">
                ${e.content || r.noBody}
              </div></hkte-notice-actions
            >` : l`${ct(e.deadline, this.hass)}
              <div class="body">${e.content || r.noBody}</div>`}
      ${e.content_truncated ? l`<div class="hint">${r.truncated}</div>` : h}${!((d = this.hass) != null && d.fetchWithAuth) && ((p = this.config) != null && p.show_attachments) && e.attachments.length ? l`<div class="attachment-label meta">
                <span>${r.attachments}</span>
              </div>
              ${e.attachments.map((u) => l`<div class="attachment"><span class="attachment-name">${u.filename}</span><span>${u.mime_type}</span>${u.size !== null ? l`<span>${Ee(u.size)}</span>` : h}</div>`)}` : h}
    </details>`;
  }
  render() {
    var d, p, u, m, g, $;
    const e = st(this.hass), t = this._feeds(), i = ((d = this.config) == null ? void 0 : d.initially_expanded) ?? "latest", n = ((p = this.config) == null ? void 0 : p.limit) ?? 5, r = ((u = this.config) == null ? void 0 : u.days) ?? 0, a = ((m = this.config) == null ? void 0 : m.filter) ?? "all", c = ((g = this.config) == null ? void 0 : g.show_student_name) !== !1, o = t.reduce(
      (y, O) => y + Nt(O, a, n, r).length,
      0
    );
    return l`<ha-card
      ><div class="header">
        <h1>${(($ = this.config) == null ? void 0 : $.title) ?? "HKTE Notices"}</h1>
        <span class="count">${o}</span>
      </div>
      <div class="content">
        ${this.hass ? t.length === 0 ? l`<div class="empty">${e.noEntities}</div>` : t.map((y) => {
      var dt, ht;
      const O = Nt(y, a, n, r), Lt = y.state === "unavailable" || y.state === "unknown";
      return l`<section class="student">
                    ${c ? l`<h2 class="student-title">
                            ${((ht = (dt = this.config) == null ? void 0 : dt.entity_names) == null ? void 0 : ht[y.entityId]) ?? ve(y.name, y.entityId)}
                          </h2>` : h}
                    ${Lt ? l`<div class="hint error">${e.unavailable}</div>` : O.length ? O.map((Kt, Wt) => this._notice(Kt, Wt, i, y.entityId)) : l`<div class="empty">${e.noNotices}</div>`}${y.hasMore && O.length ? l`<div class="hint">${e.more}</div>` : h}
                  </section>`;
    }) : l`<div class="hint">${e.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
f(nt, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(nt, "styles", L`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    ha-card {
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 20px 16px;
      padding-bottom: 12px;
    }
    h1 {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.3;
      font-weight: 600;
    }
    .count {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .content {
      padding: 8px 16px 20px;
    }
    .student {
      padding-top: 10px;
    }
    .student + .student {
      margin-top: 24px;
      padding-top: 0;
    }
    .student-title {
      margin: 0 4px 10px;
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    details {
      margin: 14px 0;
      overflow: hidden;
      border-radius: 8px;
      background: color-mix(
        in srgb,
        var(--card-background-color, var(--ha-card-background, transparent)) 96%,
        var(--primary-color) 4%
      );
      box-shadow: 0 2px 10px
        color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }
    details[open] {
      background: color-mix(
        in srgb,
        var(--card-background-color, var(--ha-card-background, transparent)) 94%,
        var(--primary-color) 6%
      );
    }
    summary {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      min-width: 0;
      padding: 15px 14px;
      cursor: pointer;
      list-style: none;
    }
    .unread-notice summary {
      background: color-mix(
        in srgb,
        var(--warning-color, #d89b00) 5%,
        transparent
      );
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary::before {
      content: "›";
      flex: none;
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      line-height: 1;
      transform: rotate(0deg);
    }
    details[open] summary::before {
      transform: rotate(90deg);
    }
    .title {
      display: block;
      min-width: 0;
      overflow-wrap: anywhere;
      font-size: 1rem;
      font-weight: 650;
      line-height: 1.35;
    }
    .title-content {
      display: block;
      flex: 1 1 auto;
      min-width: 0;
    }
    .issued-title {
      display: block;
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 400;
      line-height: 1.35;
    }
    .status-icons {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: none;
      margin-left: auto;
    }
    .unread {
      border-radius: 4px;
      padding: 2px 6px;
      color: var(--text-primary-color, var(--primary-text-color));
      background: var(--warning-color, #d89b00);
      font-size: 0.72rem;
      font-weight: 650;
    }
    .read-status {
      display: inline-flex;
      align-items: center;
      flex: none;
      color: var(--success-color, #2e9d68);
    }
    .replied-status {
      display: inline-flex;
      align-items: center;
      color: var(--primary-color);
    }
    .status-icon svg {
      display: block;
      width: 1.35rem;
      height: 1.35rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
    }
    .body {
      margin: 0 14px;
      padding: 14px 0 16px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.55;
    }
    .body[slot="body"] {
      margin: 0;
      padding: 0;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin: 0 14px;
      padding: 12px 0 0;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .deadline {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr);
      align-items: center;
      gap: 3px 10px;
      width: 100%;
      margin: 2px 0 4px;
      color: var(--primary-text-color);
    }
    .deadline-icon {
      grid-row: span 2;
      width: 24px;
      height: 24px;
      color: var(--primary-color);
    }
    .deadline-icon svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
    }
    .deadline-label {
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0;
    }
    .deadline-value {
      min-width: 0;
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .status {
      color: var(--primary-color);
    }
    .attachment {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      margin: 0 14px;
      padding: 4px 0;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .attachment-name {
      color: var(--primary-text-color);
      overflow-wrap: anywhere;
    }
    .hint,
    .empty {
      padding: 18px 0 4px;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    @media (max-width: 480px) {
      .header,
      .content {
        padding-left: 14px;
        padding-right: 14px;
      }
      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
      }
      .content {
        padding-left: 10px;
        padding-right: 10px;
      }
      summary {
        padding: 13px 11px;
      }
      .title {
        font-size: 0.94rem;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      .unread-notice .unread {
        animation: unread-pulse 2.2s ease-in-out 3;
      }
      summary::before {
        transition: transform 120ms ease;
      }
      @keyframes unread-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 transparent;
        }
        45% {
          box-shadow: 0 0 0 5px
            color-mix(in srgb, var(--warning-color, #d89b00) 18%, transparent);
        }
      }
      details[open] .body,
      details[open] .meta {
        animation: reveal 120ms ease-out;
      }
      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(-2px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  `);
class rt extends v {
  constructor() {
    super(), this.config = { type: "custom:hkte-notices-card" };
  }
  setConfig(e) {
    this.config = e;
  }
  render() {
    return l`<ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${[
      { name: "title", selector: { text: {} } },
      {
        name: "entities",
        selector: {
          entity: { multiple: !0, filter: { domain: "sensor" } }
        }
      },
      {
        name: "filter",
        selector: {
          select: {
            options: [
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" }
            ]
          }
        }
      },
      {
        name: "limit",
        selector: { number: { min: 1, max: 20, mode: "slider" } }
      },
      {
        name: "days",
        selector: {
          number: { min: 0, max: 30, mode: "box" }
        }
      },
      {
        name: "initially_expanded",
        selector: {
          select: {
            options: [
              { value: "latest", label: "Latest" },
              { value: "none", label: "Collapse latest" },
              { value: "all", label: "Expand all" }
            ]
          }
        }
      },
      { name: "show_student_name", selector: { boolean: {} } },
      { name: "show_attachments", selector: { boolean: {} } }
    ]}
        @value-changed=${this._valueChanged}
      ></ha-form
      >${this._entityNameFields()}`;
  }
  _entityNameFields() {
    const e = this.config.entities ?? [];
    return e.length === 0 ? h : l`<section class="entity-names">
      <h3>Entity display names</h3>
      ${e.map(
      (t, i) => {
        var n;
        return l`<label class="entity-name-field" for=${`entity-name-${i}`}>
            <span class="entity-name-label">${t}</span>
            <input
              id=${`entity-name-${i}`}
              class="entity-name-input"
              type="text"
              .value=${((n = this.config.entity_names) == null ? void 0 : n[t]) ?? ""}
              @change=${(r) => this._entityNameChanged(t, r)}
            />
          </label>`;
      }
    )}
    </section>`;
  }
  _valueChanged(e) {
    e.stopPropagation(), this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: { ...this.config, ...e.detail.value } }
      })
    );
  }
  _entityNameChanged(e, t) {
    const i = t.target.value.trim(), n = { ...this.config.entity_names ?? {} };
    i ? n[e] = i : delete n[e], this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: {
          config: {
            ...this.config,
            entity_names: Object.keys(n).length ? n : void 0
          }
        }
      })
    );
  }
}
f(rt, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(rt, "styles", L`
    :host {
      display: block;
    }
    .entity-names {
      margin-top: 20px;
    }
    .entity-names h3 {
      margin: 0 0 12px;
      font-size: 1rem;
      font-weight: 500;
    }
    .entity-name-field {
      display: grid;
      gap: 6px;
      margin-bottom: 12px;
    }
    .entity-name-label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      overflow-wrap: anywhere;
    }
    .entity-name-input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      outline: 0;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--ha-card-background));
      font: inherit;
    }
    .entity-name-input:focus-visible {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
  `);
customElements.get("hkte-notices-card") || customElements.define("hkte-notices-card", nt);
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", rt);
window.customCards = window.customCards ?? [];
window.customCards.some((s) => s.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  nt as HkteNoticesCard,
  rt as HkteNoticesCardEditor
};
