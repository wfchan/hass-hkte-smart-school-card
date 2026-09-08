var At = Object.defineProperty;
var xt = (n, t, e) => t in n ? At(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var C = (n, t, e) => xt(n, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, Y = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), J = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (n) => new ft(typeof n == "string" ? n : n + "", void 0, Z), $t = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[o + 1], n[0]);
  return new ft(e, n, Z);
}, wt = (n, t) => {
  if (Y) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = R.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, X = Y ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Et(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: St, defineProperty: Ct, getOwnPropertyDescriptor: Nt, getOwnPropertyNames: Pt, getOwnPropertySymbols: Tt, getPrototypeOf: Mt } = Object, _ = globalThis, Q = _.trustedTypes, Ut = Q ? Q.emptyScript : "", I = _.reactiveElementPolyfillSupport, P = (n, t) => n, K = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Ut : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, _t = (n, t) => !St(n, t), tt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: _t };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ct(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = Nt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Mt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...Pt(e), ...Tt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(X(i));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : K).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : K;
      this._$Em = i;
      const c = a.fromAttribute(e, l.type);
      this[i] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (o = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? _t)(o, e) || s.useDefault && s.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, r] of i) {
        const { wrapped: l } = r, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var o;
        return (o = i.hostUpdate) == null ? void 0 : o.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[P("elementProperties")] = /* @__PURE__ */ new Map(), A[P("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: A }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, et = (n) => n, z = T.trustedTypes, st = z ? z.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, gt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + $, kt = `<${yt}>`, b = document, M = () => b.createComment(""), U = (n) => n === null || typeof n != "object" && typeof n != "function", G = Array.isArray, Ht = (n) => G(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, nt = />/g, g = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, ot = /"/g, vt = /^(?:script|style|textarea|title)$/i, Ot = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), u = Ot(1), w = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function bt(n, t) {
  if (!G(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Rt = (n, t) => {
  const e = n.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = N;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let c, p, d = -1, m = 0;
    for (; m < a.length && (r.lastIndex = m, p = r.exec(a), p !== null); ) m = r.lastIndex, r === N ? p[1] === "!--" ? r = it : p[1] !== void 0 ? r = nt : p[2] !== void 0 ? (vt.test(p[2]) && (i = RegExp("</" + p[2], "g")), r = g) : p[3] !== void 0 && (r = g) : r === g ? p[0] === ">" ? (r = i ?? N, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, c = p[1], r = p[3] === void 0 ? g : p[3] === '"' ? ot : rt) : r === ot || r === rt ? r = g : r === it || r === nt ? r = N : (r = g, i = void 0);
    const f = r === g && n[l + 1].startsWith("/>") ? " " : "";
    o += r === N ? a + kt : d >= 0 ? (s.push(c), a.slice(0, d) + gt + a.slice(d) + $ + f) : a + $ + (d === -2 ? l : f);
  }
  return [bt(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [c, p] = Rt(t, e);
    if (this.el = k.createElement(c, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = y.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(gt)) {
          const m = p[r++], f = i.getAttribute(d).split($), O = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: O[2], strings: f, ctor: O[1] === "." ? Dt : O[1] === "?" ? It : O[1] === "@" ? Lt : D }), i.removeAttribute(d);
        } else d.startsWith($) && (a.push({ type: 6, index: o }), i.removeAttribute(d));
        if (vt.test(i.tagName)) {
          const d = i.textContent.split($), m = d.length - 1;
          if (m > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let f = 0; f < m; f++) i.append(d[f], M()), y.nextNode(), a.push({ type: 2, index: ++o });
            i.append(d[m], M());
          }
        }
      } else if (i.nodeType === 8) if (i.data === yt) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf($, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function S(n, t, e = n, s) {
  var r, l;
  if (t === w) return t;
  let i = s !== void 0 ? (r = e._$Co) == null ? void 0 : r[s] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== o && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), o === void 0 ? i = void 0 : (i = new o(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = S(n, i._$AS(n, t.values), i, s)), t;
}
class zt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? b).importNode(e, !0);
    y.currentNode = i;
    let o = y.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new H(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new Bt(o, this, t)), this._$AV.push(c), a = s[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = y.nextNode(), r++);
    }
    return y.currentNode = b, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = S(this, t, e), U(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ht(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(bt(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === i) this._$AH.p(e);
    else {
      const r = new zt(i, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new k(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new H(this.O(M()), this.O(M()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = et(t).nextSibling;
      et(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = S(this, t, e, 0), r = !U(t) || t !== this._$AH && t !== w, r && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = S(this, l[s + a], e, a), c === w && (c = this._$AH[a]), r || (r = !U(c) || c !== this._$AH[a]), c === h ? t = h : t !== h && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class It extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Lt extends D {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? h) === w) return;
    const s = this._$AH, i = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const B = T.litHtmlPolyfillSupport;
B == null || B(k, H), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.3");
const jt = (n, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new H(t.insertBefore(M(), o), o, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class x extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return w;
  }
}
var mt;
x._$litElement$ = !0, x.finalized = !0, (mt = v.litElementHydrateSupport) == null || mt.call(v, { LitElement: x });
const j = v.litElementPolyfillSupport;
j == null || j({ LitElement: x });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
const V = 20;
function E(n, t = "") {
  return typeof n == "string" ? n : t;
}
function lt(n) {
  return typeof n == "string" && n.length > 0 ? n : null;
}
function ct(n) {
  return typeof n == "boolean" ? n : null;
}
function Kt(n) {
  if (!n || typeof n != "object") return null;
  const t = n, e = E(t.filename);
  return e ? {
    filename: e,
    mime_type: E(t.mime_type, "application/octet-stream"),
    size: typeof t.size == "number" && t.size >= 0 ? t.size : null
  } : null;
}
function Vt(n, t) {
  if (!n || typeof n != "object") return null;
  const e = n, s = E(e.title, "Untitled notice");
  return {
    id: E(e.id, `notice-${t}`),
    title: s,
    content: E(e.content),
    issued_at: lt(e.issued_at),
    deadline: lt(e.deadline),
    unread: ct(e.unread),
    replied: ct(e.replied),
    content_truncated: e.content_truncated === !0,
    attachments: Array.isArray(e.attachments) ? e.attachments.map(Kt).filter((i) => i !== null) : []
  };
}
function dt(n) {
  if (!n) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(n);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function Wt(n, t) {
  const e = t.attributes.notices;
  if (!Array.isArray(e)) return null;
  const i = [
    ...e.map(Vt).filter((o) => o !== null).sort((o, r) => dt(r.issued_at) - dt(o.issued_at)).reduce((o, r) => (o.has(r.id) || o.set(r.id, r), o), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: n,
    name: E(t.attributes.friendly_name, n),
    state: t.state,
    notices: i,
    hasMore: t.attributes.has_more === !0
  };
}
function Ft(n, t) {
  return (t != null && t.length ? t : Object.keys(n.states)).map((s) => {
    const i = n.states[s];
    return i ? Wt(s, i) : null;
  }).filter((s) => s !== null).sort((s, i) => s.name.localeCompare(i.name));
}
function ht(n, t, e) {
  const s = Math.min(V, Math.max(1, Math.round(e)));
  return n.notices.filter((i) => t === "all" || i.unread === !0).slice(0, s);
}
function qt(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : V;
  return Math.min(V, Math.max(1, Math.round(t)));
}
const pt = {
  zh: {
    all: "全部",
    unread: "未讀",
    read: "已讀",
    issued: "發出",
    deadline: "截止",
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
    deadline: "Deadline",
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
function W(n) {
  var e, s;
  return (((e = n == null ? void 0 : n.locale) == null ? void 0 : e.language) ?? ((s = n == null ? void 0 : n.config) == null ? void 0 : s.language) ?? "en").toLowerCase().startsWith("zh") ? pt.zh : pt.en;
}
function Yt(n, t) {
  return n.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || t;
}
function ut(n, t) {
  var i;
  const e = W(t);
  if (!n) return e.noDate;
  const s = new Date(n);
  if (Number.isNaN(s.getTime())) return n;
  try {
    return new Intl.DateTimeFormat(((i = t == null ? void 0 : t.locale) == null ? void 0 : i.language) || void 0, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(s);
  } catch {
    return n;
  }
}
function Zt(n) {
  return n === null ? "" : n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
}
class F extends x {
  constructor() {
    super(), this._filter = "all";
  }
  static async getConfigElement() {
    return document.createElement("hkte-notices-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:hkte-notices-card",
      title: "HKTE Notices",
      filter: "all",
      limit: 20,
      initially_expanded: "latest",
      show_attachments: !0
    };
  }
  setConfig(t) {
    if (!t || t.type !== "custom:hkte-notices-card")
      throw new Error("Invalid HKTE notices card configuration");
    const e = ["latest", "none", "all"].includes(
      t.initially_expanded ?? "latest"
    ) ? t.initially_expanded ?? "latest" : "latest";
    this.config = {
      ...t,
      entities: Array.isArray(t.entities) ? t.entities.filter(
        (s) => typeof s == "string"
      ) : void 0,
      filter: t.filter === "unread" ? "unread" : "all",
      limit: qt(t.limit),
      initially_expanded: e,
      show_attachments: t.show_attachments !== !1
    }, this._filter = this.config.filter ?? "all";
  }
  getCardSize() {
    return 4;
  }
  updated(t) {
    var e;
    t.has("config") && ((e = this.config) != null && e.filter) && (this._filter = this.config.filter);
  }
  _feeds() {
    var t;
    return Ft(this.hass ?? { states: {} }, (t = this.config) == null ? void 0 : t.entities);
  }
  _notice(t, e, s) {
    var r;
    const i = W(this.hass);
    return u`<details ?open=${s === "all" || s === "latest" && e === 0}>
      <summary>
        <span class="title">${t.title}</span>${t.unread === !0 ? u`<span class="unread">${i.unread}</span>` : t.unread === !1 ? u`<span class="read-status" aria-label=${i.read}
                  ><span class="status-icon" aria-hidden="true">✓</span
                  >${i.read}</span
                >` : h}
      </summary>
      <div class="meta">
        <span>${i.issued}: ${ut(t.issued_at, this.hass)}</span
        ><span>${i.deadline}: ${ut(t.deadline, this.hass)}</span
        >${t.replied === !0 ? u`<span class="status">${i.replied}</span>` : t.replied === !1 ? u`<span>${i.noReply}</span>` : h}
      </div>
      <div class="body">${t.content || i.noBody}</div>
      ${t.content_truncated ? u`<div class="hint">${i.truncated}</div>` : h}${(r = this.config) != null && r.show_attachments && t.attachments.length ? u`<div class="attachment-label meta">
                <span>${i.attachments}</span>
              </div>
              ${t.attachments.map((l) => u`<div class="attachment"><span class="attachment-name">${l.filename}</span><span>${l.mime_type}</span>${l.size !== null ? u`<span>${Zt(l.size)}</span>` : h}</div>`)}` : h}
    </details>`;
  }
  render() {
    var r, l, a;
    const t = W(this.hass), e = this._feeds(), s = ((r = this.config) == null ? void 0 : r.initially_expanded) ?? "latest", i = ((l = this.config) == null ? void 0 : l.limit) ?? 20, o = e.reduce(
      (c, p) => c + ht(p, this._filter, i).length,
      0
    );
    return u`<ha-card
      ><div class="header">
        <h1>${((a = this.config) == null ? void 0 : a.title) ?? "HKTE Notices"}</h1>
        <span class="count">${o}</span>
      </div>
      <div class="toolbar" role="group" aria-label="Notice filter">
        <button
          aria-pressed=${this._filter === "all"}
          @click=${() => this._filter = "all"}
        >
          ${t.all}</button
        ><button
          aria-pressed=${this._filter === "unread"}
          @click=${() => this._filter = "unread"}
        >
          ${t.unread}
        </button>
      </div>
      <div class="content">
        ${this.hass ? e.length === 0 ? u`<div class="empty">${t.noEntities}</div>` : e.map((c) => {
      const p = ht(c, this._filter, i), d = c.state === "unavailable" || c.state === "unknown";
      return u`<section class="student">
                    <h2 class="student-title">
                      ${Yt(c.name, c.entityId)}
                    </h2>
                    ${d ? u`<div class="hint error">${t.unavailable}</div>` : p.length ? p.map((m, f) => this._notice(m, f, s)) : u`<div class="empty">${t.noNotices}</div>`}${c.hasMore && p.length ? u`<div class="hint">${t.more}</div>` : h}
                  </section>`;
    }) : u`<div class="hint">${t.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
C(F, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _filter: { state: !0 }
}), C(F, "styles", $t`
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
      padding: 18px 20px 12px;
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
    .toolbar {
      display: flex;
      gap: 6px;
      padding: 0 20px 14px;
      border-bottom: 1px solid var(--divider-color);
    }
    button {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 12px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    button:hover {
      background: var(--secondary-background-color);
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    button[aria-pressed="true"] {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .content {
      padding: 4px 20px 18px;
    }
    .student {
      padding-top: 14px;
    }
    .student + .student {
      border-top: 1px solid var(--divider-color);
      margin-top: 10px;
    }
    .student-title {
      margin: 0 0 8px;
      font-size: 0.98rem;
      font-weight: 600;
    }
    details {
      border-bottom: 1px solid var(--divider-color);
    }
    details:last-child {
      border-bottom: 0;
    }
    summary {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
      padding: 13px 0;
      cursor: pointer;
      list-style: none;
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
      min-width: 0;
      overflow-wrap: anywhere;
      font-weight: 550;
    }
    .unread {
      flex: none;
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
      gap: 4px;
      flex: none;
      border: 1px solid var(--success-color, #2e9d68);
      border-radius: 4px;
      padding: 2px 6px;
      color: var(--success-color, #2e9d68);
      background: color-mix(
        in srgb,
        var(--success-color, #2e9d68) 12%,
        transparent
      );
      font-size: 0.72rem;
      font-weight: 650;
    }
    .status-icon {
      display: inline-grid;
      width: 0.95em;
      height: 0.95em;
      place-items: center;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 0.78em;
      line-height: 1;
    }
    .body {
      padding: 0 0 14px 20px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.55;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      padding: 0 0 10px 20px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .status {
      color: var(--primary-color);
    }
    .attachment {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      padding: 4px 0 4px 20px;
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
      .toolbar,
      .content {
        padding-left: 14px;
        padding-right: 14px;
      }
      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
      }
      button {
        flex: 1;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      summary::before {
        transition: transform 120ms ease;
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
class q extends x {
  constructor() {
    super(), this.config = { type: "custom:hkte-notices-card" };
  }
  setConfig(t) {
    this.config = t;
  }
  render() {
    return u`<ha-form
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
        name: "initially_expanded",
        selector: {
          select: {
            options: [
              { value: "latest", label: "Latest" },
              { value: "none", label: "None" },
              { value: "all", label: "All" }
            ]
          }
        }
      },
      { name: "show_attachments", selector: { boolean: {} } }
    ]}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }
  _valueChanged(t) {
    t.stopPropagation(), this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: { ...this.config, ...t.detail.value } }
      })
    );
  }
}
C(q, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), C(q, "styles", $t`
    :host {
      display: block;
    }
  `);
customElements.get("hkte-notices-card") || customElements.define("hkte-notices-card", F);
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", q);
window.customCards = window.customCards ?? [];
window.customCards.some((n) => n.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  F as HkteNoticesCard,
  q as HkteNoticesCardEditor
};
