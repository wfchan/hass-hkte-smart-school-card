var Mt = Object.defineProperty;
var Pt = (n, t, e) => t in n ? Mt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var M = (n, t, e) => Pt(n, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, Z = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), tt = /* @__PURE__ */ new WeakMap();
let gt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (n) => new gt(typeof n == "string" ? n : n + "", void 0, G), _t = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new gt(e, n, G);
}, Ut = (n, t) => {
  if (Z) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, et = Z ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return kt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ot, defineProperty: Ht, getOwnPropertyDescriptor: Rt, getOwnPropertyNames: zt, getOwnPropertySymbols: Dt, getPrototypeOf: It } = Object, g = globalThis, st = g.trustedTypes, Lt = st ? st.emptyScript : "", j = g.reactiveElementPolyfillSupport, k = (n, t) => n, V = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Lt : null;
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
} }, vt = (n, t) => !Ot(n, t), it = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: vt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ht(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = Rt(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, s = [...zt(e), ...Dt(e)];
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
      for (const i of s) e.unshift(et(i));
    } else t !== void 0 && e.push(et(t));
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
    return Ut(t, this.constructor.elementStyles), t;
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
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : V).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = i;
      const c = a.fromAttribute(e, l.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (r = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? vt)(r, e) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[k("elementProperties")] = /* @__PURE__ */ new Map(), w[k("finalized")] = /* @__PURE__ */ new Map(), j == null || j({ ReactiveElement: w }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, nt = (n) => n, I = U.trustedTypes, rt = I ? I.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, bt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, xt = "?" + y, jt = `<${xt}>`, A = document, O = () => A.createComment(""), H = (n) => n === null || typeof n != "object" && typeof n != "function", J = Array.isArray, Bt = (n) => J(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, v = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, ct = /"/g, At = /^(?:script|style|textarea|title)$/i, Ft = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), p = Ft(1), C = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function wt(n, t) {
  if (!J(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Kt = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let c, u, d = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, u = o.exec(a), u !== null); ) m = o.lastIndex, o === P ? u[1] === "!--" ? o = ot : u[1] !== void 0 ? o = at : u[2] !== void 0 ? (At.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = v) : u[3] !== void 0 && (o = v) : o === v ? u[0] === ">" ? (o = i ?? P, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, c = u[1], o = u[3] === void 0 ? v : u[3] === '"' ? ct : lt) : o === ct || o === lt ? o = v : o === ot || o === at ? o = P : (o = v, i = void 0);
    const f = o === v && n[l + 1].startsWith("/>") ? " " : "";
    r += o === P ? a + jt : d >= 0 ? (s.push(c), a.slice(0, d) + bt + a.slice(d) + y + f) : a + y + (d === -2 ? l : f);
  }
  return [wt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, u] = Kt(t, e);
    if (this.el = R.createElement(c, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = b.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(bt)) {
          const m = u[o++], f = i.getAttribute(d).split(y), _ = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: _[2], strings: f, ctor: _[1] === "." ? Wt : _[1] === "?" ? Yt : _[1] === "@" ? qt : L }), i.removeAttribute(d);
        } else d.startsWith(y) && (a.push({ type: 6, index: r }), i.removeAttribute(d));
        if (At.test(i.tagName)) {
          const d = i.textContent.split(y), m = d.length - 1;
          if (m > 0) {
            i.textContent = I ? I.emptyScript : "";
            for (let f = 0; f < m; f++) i.append(d[f], O()), b.nextNode(), a.push({ type: 2, index: ++r });
            i.append(d[m], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === xt) a.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(y, d + 1)) !== -1; ) a.push({ type: 7, index: r }), d += y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function N(n, t, e = n, s) {
  var o, l;
  if (t === C) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const r = H(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = N(n, i._$AS(n, t.values), i, s)), t;
}
class Vt {
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    b.currentNode = i;
    let r = b.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new z(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new Zt(r, this, t)), this._$AV.push(c), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (r = b.nextNode(), o++);
    }
    return b.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class z {
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
    t = N(this, t, e), H(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Bt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(wt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const o = new Vt(i, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = dt.get(t.strings);
    return e === void 0 && dt.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new z(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = nt(t).nextSibling;
      nt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class L {
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
    if (r === void 0) t = N(this, t, e, 0), o = !H(t) || t !== this._$AH && t !== C, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = N(this, l[s + a], e, a), c === C && (c = this._$AH[a]), o || (o = !H(c) || c !== this._$AH[a]), c === h ? t = h : t !== h && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Yt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class qt extends L {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = N(this, t, e, 0) ?? h) === C) return;
    const s = this._$AH, i = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const F = U.litHtmlPolyfillSupport;
F == null || F(R, z), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const Gt = (n, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new z(t.insertBefore(O(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class E extends w {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Gt(e, this.renderRoot, this.renderOptions);
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
    return C;
  }
}
var yt;
E._$litElement$ = !0, E.finalized = !0, (yt = x.litElementHydrateSupport) == null || yt.call(x, { LitElement: E });
const K = x.litElementPolyfillSupport;
K == null || K({ LitElement: E });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
const Et = 20, Jt = 5, Xt = 30;
function S(n, t = "") {
  return typeof n == "string" ? n : t;
}
function ht(n) {
  return typeof n == "string" && n.length > 0 ? n : null;
}
function pt(n) {
  return typeof n == "boolean" ? n : null;
}
function Qt(n) {
  if (!n || typeof n != "object") return null;
  const t = n, e = S(t.filename);
  return e ? {
    filename: e,
    mime_type: S(t.mime_type, "application/octet-stream"),
    size: typeof t.size == "number" && t.size >= 0 ? t.size : null
  } : null;
}
function te(n, t) {
  if (!n || typeof n != "object") return null;
  const e = n, s = S(e.title, "Untitled notice");
  return {
    id: S(e.id, `notice-${t}`),
    title: s,
    content: S(e.content),
    issued_at: ht(e.issued_at),
    deadline: ht(e.deadline),
    unread: pt(e.unread),
    replied: pt(e.replied),
    content_truncated: e.content_truncated === !0,
    attachments: Array.isArray(e.attachments) ? e.attachments.map(Qt).filter((i) => i !== null) : []
  };
}
function ut(n) {
  if (!n) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(n);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function ee(n, t) {
  const e = t.attributes.notices;
  if (!Array.isArray(e)) return null;
  const i = [
    ...e.map(te).filter((r) => r !== null).sort((r, o) => ut(o.issued_at) - ut(r.issued_at)).reduce((r, o) => (r.has(o.id) || r.set(o.id, o), r), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: n,
    name: S(t.attributes.friendly_name, n),
    state: t.state,
    notices: i,
    hasMore: t.attributes.has_more === !0
  };
}
function se(n, t) {
  return (t != null && t.length ? t : Object.keys(n.states)).map((s) => {
    const i = n.states[s];
    return i ? ee(s, i) : null;
  }).filter((s) => s !== null).sort((s, i) => s.name.localeCompare(i.name));
}
function mt(n, t, e, s = 0, i = Date.now()) {
  const r = Math.min(Et, Math.max(1, Math.round(e))), o = St(s), l = i - o * 24 * 60 * 60 * 1e3;
  return n.notices.filter((a) => t === "all" || a.unread === !0).filter((a) => {
    if (o === 0 || !a.issued_at) return !0;
    const c = Date.parse(a.issued_at);
    return Number.isNaN(c) || c >= l;
  }).slice(0, r);
}
function ie(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : Jt;
  return Math.min(Et, Math.max(1, Math.round(t)));
}
function St(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : 0;
  return Math.min(Xt, Math.max(0, Math.round(t)));
}
const ft = {
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
  return (((e = n == null ? void 0 : n.locale) == null ? void 0 : e.language) ?? ((s = n == null ? void 0 : n.config) == null ? void 0 : s.language) ?? "en").toLowerCase().startsWith("zh") ? ft.zh : ft.en;
}
function ne(n, t) {
  return n.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || t;
}
function re(n) {
  if (!n || typeof n != "object" || Array.isArray(n))
    return;
  const t = Object.entries(n).reduce((e, [s, i]) => (typeof i == "string" && i.trim() && (e[s] = i.trim()), e), {});
  return Object.keys(t).length ? t : void 0;
}
function $t(n, t) {
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
function oe(n) {
  return n === null ? "" : n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
}
function ae() {
  return p`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}
function le() {
  return p`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}
class Y extends E {
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
      entity_names: re(t.entity_names),
      filter: t.filter === "unread" ? "unread" : "all",
      limit: ie(t.limit),
      days: St(t.days),
      initially_expanded: e,
      show_student_name: t.show_student_name !== !1,
      show_attachments: t.show_attachments !== !1
    };
  }
  getCardSize() {
    return 4;
  }
  _feeds() {
    var t;
    return se(this.hass ?? { states: {} }, (t = this.config) == null ? void 0 : t.entities);
  }
  _notice(t, e, s) {
    var o;
    const i = W(this.hass), r = s === "all" || s === "latest" && e === 0;
    return p`<details
      class=${t.unread === !0 ? "unread-notice" : ""}
      ?open=${r}
    >
      <summary>
        <span class="title-content">
          <span class="title">${t.title}</span>
          <span class="issued-title"
            >${$t(t.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${t.unread === !0 ? p`<span class="unread">${i.unread}</span>` : h}
          ${t.unread === !1 ? p`<span
                  class="status-icon read-status"
                  title=${i.read}
                  aria-label=${i.read}
                  role="img"
                  >${ae()}</span
                >` : h}
          ${t.replied === !0 ? p`<span
                  class="status-icon replied-status"
                  title=${i.replied}
                  aria-label=${i.replied}
                  role="img"
                  >${le()}</span
                >` : h}
        </span>
      </summary>
      <div class="meta">
        <span>${i.deadline}: ${$t(t.deadline, this.hass)}</span>
      </div>
      <div class="body">${t.content || i.noBody}</div>
      ${t.content_truncated ? p`<div class="hint">${i.truncated}</div>` : h}${(o = this.config) != null && o.show_attachments && t.attachments.length ? p`<div class="attachment-label meta">
                <span>${i.attachments}</span>
              </div>
              ${t.attachments.map((l) => p`<div class="attachment"><span class="attachment-name">${l.filename}</span><span>${l.mime_type}</span>${l.size !== null ? p`<span>${oe(l.size)}</span>` : h}</div>`)}` : h}
    </details>`;
  }
  render() {
    var c, u, d, m, f, _;
    const t = W(this.hass), e = this._feeds(), s = ((c = this.config) == null ? void 0 : c.initially_expanded) ?? "latest", i = ((u = this.config) == null ? void 0 : u.limit) ?? 5, r = ((d = this.config) == null ? void 0 : d.days) ?? 0, o = ((m = this.config) == null ? void 0 : m.filter) ?? "all", l = ((f = this.config) == null ? void 0 : f.show_student_name) !== !1, a = e.reduce(
      ($, T) => $ + mt(T, o, i, r).length,
      0
    );
    return p`<ha-card
      ><div class="header">
        <h1>${((_ = this.config) == null ? void 0 : _.title) ?? "HKTE Notices"}</h1>
        <span class="count">${a}</span>
      </div>
      <div class="content">
        ${this.hass ? e.length === 0 ? p`<div class="empty">${t.noEntities}</div>` : e.map(($) => {
      var X, Q;
      const T = mt($, o, i, r), Ct = $.state === "unavailable" || $.state === "unknown";
      return p`<section class="student">
                    ${l ? p`<h2 class="student-title">
                            ${((Q = (X = this.config) == null ? void 0 : X.entity_names) == null ? void 0 : Q[$.entityId]) ?? ne($.name, $.entityId)}
                          </h2>` : h}
                    ${Ct ? p`<div class="hint error">${t.unavailable}</div>` : T.length ? T.map((Nt, Tt) => this._notice(Nt, Tt, s)) : p`<div class="empty">${t.noNotices}</div>`}${$.hasMore && T.length ? p`<div class="hint">${t.more}</div>` : h}
                  </section>`;
    }) : p`<div class="hint">${t.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
M(Y, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), M(Y, "styles", _t`
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
      border-bottom: 1px solid var(--divider-color);
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
      .content {
        padding-left: 14px;
        padding-right: 14px;
      }
      .header {
        align-items: flex-start;
        flex-direction: column;
        gap: 3px;
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
class q extends E {
  constructor() {
    super(), this.config = { type: "custom:hkte-notices-card" };
  }
  setConfig(t) {
    this.config = t;
  }
  render() {
    return p`<ha-form
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
    const t = this.config.entities ?? [];
    return t.length === 0 ? h : p`<section class="entity-names">
      <h3>Entity display names</h3>
      ${t.map(
      (e, s) => {
        var i;
        return p`<label class="entity-name-field" for=${`entity-name-${s}`}>
            <span class="entity-name-label">${e}</span>
            <input
              id=${`entity-name-${s}`}
              class="entity-name-input"
              type="text"
              .value=${((i = this.config.entity_names) == null ? void 0 : i[e]) ?? ""}
              @change=${(r) => this._entityNameChanged(e, r)}
            />
          </label>`;
      }
    )}
    </section>`;
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
  _entityNameChanged(t, e) {
    const s = e.target.value.trim(), i = { ...this.config.entity_names ?? {} };
    s ? i[t] = s : delete i[t], this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: {
          config: {
            ...this.config,
            entity_names: Object.keys(i).length ? i : void 0
          }
        }
      })
    );
  }
}
M(q, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), M(q, "styles", _t`
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
customElements.get("hkte-notices-card") || customElements.define("hkte-notices-card", Y);
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", q);
window.customCards = window.customCards ?? [];
window.customCards.some((n) => n.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  Y as HkteNoticesCard,
  q as HkteNoticesCardEditor
};
