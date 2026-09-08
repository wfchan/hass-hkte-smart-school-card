var wt = Object.defineProperty;
var Et = (n, t, e) => t in n ? wt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var N = (n, t, e) => Et(n, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, q = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), J = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const St = (n) => new ft(typeof n == "string" ? n : n + "", void 0, Z), $t = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new ft(e, n, Z);
}, Ct = (n, t) => {
  if (q) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = R.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, X = q ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return St(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Nt, defineProperty: Mt, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Pt, getOwnPropertySymbols: Tt, getPrototypeOf: Ut } = Object, y = globalThis, Q = y.trustedTypes, Ht = Q ? Q.emptyScript : "", I = y.reactiveElementPolyfillSupport, k = (n, t) => n, K = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Ht : null;
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
} }, yt = (n, t) => !Nt(n, t), tt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: yt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
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
      i !== void 0 && Mt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = kt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i == null ? void 0 : i.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
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
    return Ct(t, this.constructor.elementStyles), t;
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
    var r;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : K).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : K;
      this._$Em = i;
      const d = a.fromAttribute(e, l.type);
      this[i] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (r = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? yt)(r, e) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: l } = o, a = this[r];
        l !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[k("elementProperties")] = /* @__PURE__ */ new Map(), A[k("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: A }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, et = (n) => n, z = P.trustedTypes, st = z ? z.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, _t = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + $, Ot = `<${gt}>`, b = document, T = () => b.createComment(""), U = (n) => n === null || typeof n != "object" && typeof n != "function", G = Array.isArray, Rt = (n) => G(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, nt = />/g, _ = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, ot = /"/g, vt = /^(?:script|style|textarea|title)$/i, zt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), u = zt(1), S = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), g = b.createTreeWalker(b, 129);
function bt(n, t) {
  if (!G(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Dt = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let d, p, c = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, p = o.exec(a), p !== null); ) m = o.lastIndex, o === M ? p[1] === "!--" ? o = it : p[1] !== void 0 ? o = nt : p[2] !== void 0 ? (vt.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = _) : p[3] !== void 0 && (o = _) : o === _ ? p[0] === ">" ? (o = i ?? M, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? _ : p[3] === '"' ? ot : rt) : o === ot || o === rt ? o = _ : o === it || o === nt ? o = M : (o = _, i = void 0);
    const f = o === _ && n[l + 1].startsWith("/>") ? " " : "";
    r += o === M ? a + Ot : c >= 0 ? (s.push(d), a.slice(0, c) + _t + a.slice(c) + $ + f) : a + $ + (c === -2 ? l : f);
  }
  return [bt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, p] = Dt(t, e);
    if (this.el = H.createElement(d, s), g.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = g.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(_t)) {
          const m = p[o++], f = i.getAttribute(c).split($), x = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: x[2], strings: f, ctor: x[1] === "." ? Lt : x[1] === "?" ? Bt : x[1] === "@" ? jt : D }), i.removeAttribute(c);
        } else c.startsWith($) && (a.push({ type: 6, index: r }), i.removeAttribute(c));
        if (vt.test(i.tagName)) {
          const c = i.textContent.split($), m = c.length - 1;
          if (m > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let f = 0; f < m; f++) i.append(c[f], T()), g.nextNode(), a.push({ type: 2, index: ++r });
            i.append(c[m], T());
          }
        }
      } else if (i.nodeType === 8) if (i.data === gt) a.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) a.push({ type: 7, index: r }), c += $.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(n, t, e = n, s) {
  var o, l;
  if (t === S) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const r = U(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = C(n, i._$AS(n, t.values), i, s)), t;
}
class It {
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
    g.currentNode = i;
    let r = g.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new O(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Kt(r, this, t)), this._$AV.push(d), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (r = g.nextNode(), o++);
    }
    return g.currentNode = b, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class O {
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
    t = C(this, t, e), U(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
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
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(bt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const o = new It(i, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new O(this.O(T()), this.O(T()), this, this.options)) : s = e[i], s._$AI(r), i++;
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
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = C(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = C(this, l[s + a], e, a), d === S && (d = this._$AH[a]), o || (o = !U(d) || d !== this._$AH[a]), d === h ? t = h : t !== h && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Lt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Bt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class jt extends D {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? h) === S) return;
    const s = this._$AH, i = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Kt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const B = P.litHtmlPolyfillSupport;
B == null || B(H, O), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.3");
const Vt = (n, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new O(t.insertBefore(T(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class w extends A {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vt(e, this.renderRoot, this.renderOptions);
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
    return S;
  }
}
var mt;
w._$litElement$ = !0, w.finalized = !0, (mt = v.litElementHydrateSupport) == null || mt.call(v, { LitElement: w });
const j = v.litElementPolyfillSupport;
j == null || j({ LitElement: w });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
const V = 20, Ft = 30;
function E(n, t = "") {
  return typeof n == "string" ? n : t;
}
function lt(n) {
  return typeof n == "string" && n.length > 0 ? n : null;
}
function ct(n) {
  return typeof n == "boolean" ? n : null;
}
function Wt(n) {
  if (!n || typeof n != "object") return null;
  const t = n, e = E(t.filename);
  return e ? {
    filename: e,
    mime_type: E(t.mime_type, "application/octet-stream"),
    size: typeof t.size == "number" && t.size >= 0 ? t.size : null
  } : null;
}
function Yt(n, t) {
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
    attachments: Array.isArray(e.attachments) ? e.attachments.map(Wt).filter((i) => i !== null) : []
  };
}
function dt(n) {
  if (!n) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(n);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function qt(n, t) {
  const e = t.attributes.notices;
  if (!Array.isArray(e)) return null;
  const i = [
    ...e.map(Yt).filter((r) => r !== null).sort((r, o) => dt(o.issued_at) - dt(r.issued_at)).reduce((r, o) => (r.has(o.id) || r.set(o.id, o), r), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: n,
    name: E(t.attributes.friendly_name, n),
    state: t.state,
    notices: i,
    hasMore: t.attributes.has_more === !0
  };
}
function Zt(n, t) {
  return (t != null && t.length ? t : Object.keys(n.states)).map((s) => {
    const i = n.states[s];
    return i ? qt(s, i) : null;
  }).filter((s) => s !== null).sort((s, i) => s.name.localeCompare(i.name));
}
function ht(n, t, e, s = 0, i = Date.now()) {
  const r = Math.min(V, Math.max(1, Math.round(e))), o = xt(s), l = i - o * 24 * 60 * 60 * 1e3;
  return n.notices.filter((a) => t === "all" || a.unread === !0).filter((a) => {
    if (o === 0 || !a.issued_at) return !0;
    const d = Date.parse(a.issued_at);
    return Number.isNaN(d) || d >= l;
  }).slice(0, r);
}
function Gt(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : V;
  return Math.min(V, Math.max(1, Math.round(t)));
}
function xt(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : 0;
  return Math.min(Ft, Math.max(0, Math.round(t)));
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
function F(n) {
  var e, s;
  return (((e = n == null ? void 0 : n.locale) == null ? void 0 : e.language) ?? ((s = n == null ? void 0 : n.config) == null ? void 0 : s.language) ?? "en").toLowerCase().startsWith("zh") ? pt.zh : pt.en;
}
function Jt(n, t) {
  return n.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || t;
}
function ut(n, t) {
  var i;
  const e = F(t);
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
function Xt(n) {
  return n === null ? "" : n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
}
function Qt() {
  return u`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}
function te() {
  return u`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}
class W extends w {
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
      days: 0,
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
      limit: Gt(t.limit),
      days: xt(t.days),
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
    return Zt(this.hass ?? { states: {} }, (t = this.config) == null ? void 0 : t.entities);
  }
  _notice(t, e, s) {
    var o;
    const i = F(this.hass), r = s === "all" || s === "latest" && e === 0;
    return u`<details
      class=${t.unread === !0 ? "unread-notice" : ""}
      ?open=${r}
    >
      <summary>
        <span class="title-content">
          <span class="title">${t.title}</span>
          <span class="issued-title"
            >${ut(t.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${t.unread === !0 ? u`<span class="unread">${i.unread}</span>` : h}
          ${t.unread === !1 ? u`<span
                  class="status-icon read-status"
                  title=${i.read}
                  aria-label=${i.read}
                  role="img"
                  >${Qt()}</span
                >` : h}
          ${t.replied === !0 ? u`<span
                  class="status-icon replied-status"
                  title=${i.replied}
                  aria-label=${i.replied}
                  role="img"
                  >${te()}</span
                >` : h}
        </span>
      </summary>
      <div class="meta">
        <span>${i.deadline}: ${ut(t.deadline, this.hass)}</span>
      </div>
      <div class="body">${t.content || i.noBody}</div>
      ${t.content_truncated ? u`<div class="hint">${i.truncated}</div>` : h}${(o = this.config) != null && o.show_attachments && t.attachments.length ? u`<div class="attachment-label meta">
                <span>${i.attachments}</span>
              </div>
              ${t.attachments.map((l) => u`<div class="attachment"><span class="attachment-name">${l.filename}</span><span>${l.mime_type}</span>${l.size !== null ? u`<span>${Xt(l.size)}</span>` : h}</div>`)}` : h}
    </details>`;
  }
  render() {
    var l, a, d, p;
    const t = F(this.hass), e = this._feeds(), s = ((l = this.config) == null ? void 0 : l.initially_expanded) ?? "latest", i = ((a = this.config) == null ? void 0 : a.limit) ?? 20, r = ((d = this.config) == null ? void 0 : d.days) ?? 0, o = e.reduce(
      (c, m) => c + ht(m, this._filter, i, r).length,
      0
    );
    return u`<ha-card
      ><div class="header">
        <h1>${((p = this.config) == null ? void 0 : p.title) ?? "HKTE Notices"}</h1>
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
      const m = ht(
        c,
        this._filter,
        i,
        r
      ), f = c.state === "unavailable" || c.state === "unknown";
      return u`<section class="student">
                    <h2 class="student-title">
                      ${Jt(c.name, c.entityId)}
                    </h2>
                    ${f ? u`<div class="hint error">${t.unavailable}</div>` : m.length ? m.map((x, At) => this._notice(x, At, s)) : u`<div class="empty">${t.noNotices}</div>`}${c.hasMore && m.length ? u`<div class="hint">${t.more}</div>` : h}
                  </section>`;
    }) : u`<div class="hint">${t.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
N(W, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _filter: { state: !0 }
}), N(W, "styles", $t`
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
      align-items: flex-start;
      gap: 8px;
      min-width: 0;
      padding: 13px 0;
      cursor: pointer;
      list-style: none;
    }
    .unread-notice summary {
      border-inline-start: 3px solid var(--warning-color, #d89b00);
      padding-inline-start: 10px;
      background: color-mix(
        in srgb,
        var(--warning-color, #d89b00) 9%,
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
      font-weight: 550;
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
class Y extends w {
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
N(Y, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), N(Y, "styles", $t`
    :host {
      display: block;
    }
  `);
customElements.get("hkte-notices-card") || customElements.define("hkte-notices-card", W);
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", Y);
window.customCards = window.customCards ?? [];
window.customCards.some((n) => n.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  W as HkteNoticesCard,
  Y as HkteNoticesCardEditor
};
