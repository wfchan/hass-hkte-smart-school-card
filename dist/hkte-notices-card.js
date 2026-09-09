var It = Object.defineProperty;
var Mt = (n, t, e) => t in n ? It(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var y = (n, t, e) => Mt(n, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Z = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), st = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ut = (n) => new bt(typeof n == "string" ? n : n + "", void 0, G), X = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new bt(e, n, G);
}, zt = (n, t) => {
  if (Z) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = H.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, it = Z ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ut(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pt, defineProperty: Ot, getOwnPropertyDescriptor: Rt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Dt, getPrototypeOf: jt } = Object, _ = globalThis, nt = _.trustedTypes, Lt = nt ? nt.emptyScript : "", L = _.reactiveElementPolyfillSupport, M = (n, t) => n, F = { toAttribute(n, t) {
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
} }, vt = (n, t) => !Pt(n, t), rt = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: vt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Ot(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = Rt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: i, set(a) {
      const l = i == null ? void 0 : i.call(this);
      r == null || r.call(this, a), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const e = this.properties, s = [...Ht(e), ...Dt(e)];
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
      for (const i of s) e.unshift(it(i));
    } else t !== void 0 && e.push(it(t));
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
    return zt(t, this.constructor.elementStyles), t;
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
      const a = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : F).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, a;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : F;
      this._$Em = i;
      const u = o.fromAttribute(e, l.type);
      this[i] = u ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (r = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? vt)(r, e) || s.useDefault && s.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, a] of i) {
        const { wrapped: l } = a, o = this[r];
        l !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, a, o);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[M("elementProperties")] = /* @__PURE__ */ new Map(), C[M("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: C }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, at = (n) => n, D = U.trustedTypes, ot = D ? D.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, xt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + $, Bt = `<${At}>`, S = document, z = () => S.createComment(""), P = (n) => n === null || typeof n != "object" && typeof n != "function", Q = Array.isArray, Wt = (n) => Q(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, ct = />/g, v = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, dt = /"/g, wt = /^(?:script|style|textarea|title)$/i, Kt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), d = Kt(1), N = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), x = S.createTreeWalker(S, 129);
function Et(n, t) {
  if (!Q(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Ft = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = I;
  for (let l = 0; l < e; l++) {
    const o = n[l];
    let u, p, h = -1, m = 0;
    for (; m < o.length && (a.lastIndex = m, p = a.exec(o), p !== null); ) m = a.lastIndex, a === I ? p[1] === "!--" ? a = lt : p[1] !== void 0 ? a = ct : p[2] !== void 0 ? (wt.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = v) : p[3] !== void 0 && (a = v) : a === v ? p[0] === ">" ? (a = i ?? I, h = -1) : p[1] === void 0 ? h = -2 : (h = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? v : p[3] === '"' ? dt : ht) : a === dt || a === ht ? a = v : a === lt || a === ct ? a = I : (a = v, i = void 0);
    const f = a === v && n[l + 1].startsWith("/>") ? " " : "";
    r += a === I ? o + Bt : h >= 0 ? (s.push(u), o.slice(0, h) + xt + o.slice(h) + $ + f) : o + $ + (h === -2 ? l : f);
  }
  return [Et(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const l = t.length - 1, o = this.parts, [u, p] = Ft(t, e);
    if (this.el = O.createElement(u, s), x.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = x.nextNode()) !== null && o.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(xt)) {
          const m = p[a++], f = i.getAttribute(h).split($), b = /([.?@])?(.*)/.exec(m);
          o.push({ type: 1, index: r, name: b[2], strings: f, ctor: b[1] === "." ? Vt : b[1] === "?" ? Yt : b[1] === "@" ? Jt : j }), i.removeAttribute(h);
        } else h.startsWith($) && (o.push({ type: 6, index: r }), i.removeAttribute(h));
        if (wt.test(i.tagName)) {
          const h = i.textContent.split($), m = h.length - 1;
          if (m > 0) {
            i.textContent = D ? D.emptyScript : "";
            for (let f = 0; f < m; f++) i.append(h[f], z()), x.nextNode(), o.push({ type: 2, index: ++r });
            i.append(h[m], z());
          }
        }
      } else if (i.nodeType === 8) if (i.data === At) o.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf($, h + 1)) !== -1; ) o.push({ type: 7, index: r }), h += $.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(n, t, e = n, s) {
  var a, l;
  if (t === N) return t;
  let i = s !== void 0 ? (a = e._$Co) == null ? void 0 : a[s] : e._$Cl;
  const r = P(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = T(n, i._$AS(n, t.values), i, s)), t;
}
class qt {
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    x.currentNode = i;
    let r = x.nextNode(), a = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let u;
        o.type === 2 ? u = new R(r, r.nextSibling, this, t) : o.type === 1 ? u = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (u = new Zt(r, this, t)), this._$AV.push(u), o = s[++l];
      }
      a !== (o == null ? void 0 : o.index) && (r = x.nextNode(), a++);
    }
    return x.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = T(this, t, e), P(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(Et(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(e);
    else {
      const a = new qt(i, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = ut.get(t.strings);
    return e === void 0 && ut.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new R(this.O(z()), this.O(z()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = at(t).nextSibling;
      at(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = T(this, t, e, 0), a = !P(t) || t !== this._$AH && t !== N, a && (this._$AH = t);
    else {
      const l = t;
      let o, u;
      for (t = r[0], o = 0; o < r.length - 1; o++) u = T(this, l[s + o], e, o), u === N && (u = this._$AH[o]), a || (a = !P(u) || u !== this._$AH[o]), u === c ? t = c : t !== c && (t += (u ?? "") + r[o + 1]), this._$AH[o] = u;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Vt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Yt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Jt extends j {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? c) === N) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== c && (s === c || i);
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
    T(this, t);
  }
}
const W = U.litHtmlPolyfillSupport;
W == null || W(O, R), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const Gt = (n, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new R(t.insertBefore(z(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class w extends C {
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
    return N;
  }
}
var _t;
w._$litElement$ = !0, w.finalized = !0, (_t = A.litElementHydrateSupport) == null || _t.call(A, { LitElement: w });
const K = A.litElementPolyfillSupport;
K == null || K({ LitElement: w });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
const Xt = {
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
  account_busy: [
    "正在分析另一份通告，請稍後重試。",
    "Another notice is being analyzed. Try later."
  ],
  analysis_timeout: ["分析逾時，請重試。", "Analysis timed out. Try again."],
  cancelled: ["分析已中止，請重試。", "Analysis was interrupted. Try again."],
  unavailable: ["暫時無法連接通告服務。", "Notice service is unavailable."]
};
class q extends w {
  constructor() {
    super();
    y(this, "signature", "");
    y(this, "timer");
    y(this, "generation", 0);
    this.error = "", this.downloads = /* @__PURE__ */ new Set(), this.submitting = !1;
  }
  get zh() {
    var e, s, i, r;
    return (((s = (e = this.hass) == null ? void 0 : e.locale) == null ? void 0 : s.language) ?? ((r = (i = this.hass) == null ? void 0 : i.config) == null ? void 0 : r.language) ?? "en").startsWith("zh");
  }
  text(e, s) {
    return this.zh ? e : s;
  }
  message(e) {
    var s;
    return ((s = Xt[e]) == null ? void 0 : s[this.zh ? 0 : 1]) ?? this.text("分析失敗，請重試。", "Analysis failed. Try again.");
  }
  get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }
  updated(e) {
    var i;
    if (!((i = this.hass) != null && i.fetchWithAuth) || !this.notice || !this.entityId) return;
    const s = JSON.stringify([this.entityId, this.notice]);
    s !== this.signature && (this.signature = s, this.generation++, clearTimeout(this.timer), this.state = void 0, this.error = "", this.load());
  }
  connectedCallback() {
    super.connectedCallback(), this.signature = "", this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this.timer), this.generation++;
  }
  async request(e, s) {
    var r;
    if (!((r = this.hass) != null && r.fetchWithAuth)) throw new Error("unavailable");
    const i = await this.hass.fetchWithAuth(e, s);
    if (!i.ok) {
      const a = await i.json().catch(() => ({}));
      throw new Error(
        typeof a.error == "string" ? a.error : "unavailable"
      );
    }
    return i;
  }
  async load() {
    const e = this.generation;
    try {
      const s = await (await this.request(`${this.path}/analysis`)).json();
      if (!this.isConnected || e !== this.generation) return;
      this.state = s, this.error = "", s.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch {
      e === this.generation && (this.error = "unavailable");
    }
  }
  async start() {
    var s;
    const e = this.generation;
    this.submitting = !0, this.error = "", clearTimeout(this.timer);
    try {
      const i = await (await this.request(`${this.path}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: !!((s = this.state) != null && s.summary) })
      })).json();
      if (e !== this.generation) return;
      this.state = i, i.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch (i) {
      e === this.generation && (this.error = i instanceof Error ? i.message : "unavailable");
    } finally {
      this.submitting = !1;
    }
  }
  async download(e) {
    this.downloads = /* @__PURE__ */ new Set([...this.downloads, e.id]), this.error = "";
    try {
      const i = await (await this.request(
        `${this.path}/attachment/${encodeURIComponent(e.id)}`
      )).blob();
      if (i.size === 0) throw new Error("empty_file");
      const r = URL.createObjectURL(i), a = document.createElement("a");
      a.href = r, a.download = e.filename.replace(/[/\\\x00-\x1f]/g, "_"), a.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
    } catch (s) {
      this.error = s instanceof Error ? s.message : "download_failed";
    } finally {
      this.downloads = new Set(
        [...this.downloads].filter((s) => s !== e.id)
      );
    }
  }
  reference(e) {
    var i, r;
    const s = (r = (i = this.state) == null ? void 0 : i.sources) == null ? void 0 : r.find(
      (a) => a.attachment_id === e.attachment_id && a.page === e.page
    );
    return s ? e.page === 0 ? this.text("通告正文", "Notice text") : `${s.filename} · ${this.text("第", "p. ")}${e.page}${this.text("頁", "")}` : "";
  }
  render() {
    var a;
    if (!this.notice) return c;
    const e = this.state, s = (e == null ? void 0 : e.status) === "running" || this.submitting, i = [
      ["highlights", "內容重點", "Highlights"],
      ["dates", "重要日期", "Important dates"],
      ["costs", "費用", "Costs"],
      ["actions", "家長待辦", "Parent actions"],
      ["questions", "需確認事項", "To confirm"]
    ], r = (e == null ? void 0 : e.stage) === "analyzing" ? this.text("AI 分析中", "Analyzing") : (e == null ? void 0 : e.stage) === "rendering" ? this.text("處理附件頁面", "Rendering pages") : this.text("取得附件", "Fetching attachments");
    return d`
      ${this.showAttachments ? d`<div class="files">
              ${this.notice.attachments.map(
      (l) => {
        var o;
        return d`<div class="file">
                    <div class="name">
                      ${l.filename}
                      <div class="metadata">
                        ${l.mime_type}${l.size !== null ? ` · ${Math.round(l.size / 1024)} KB` : ""}
                      </div>
                    </div>
                    <button
                      class="icon"
                      title=${this.text("下載附件", "Download attachment")}
                      aria-label=${this.text("下載附件", "Download attachment")}
                      ?disabled=${!l.id || !((o = this.hass) != null && o.fetchWithAuth) || this.downloads.has(l.id)}
                      @click=${() => this.download(l)}
                    >
                      <ha-icon icon="mdi:download"></ha-icon>
                    </button>
                  </div>`;
      }
    )}
            </div>` : c}
      <button ?disabled=${s || !(e != null && e.enabled)} @click=${() => this.start()}>
        <ha-icon icon="mdi:text-box-search-outline"></ha-icon
        >${e != null && e.summary ? this.text("重新分析", "Analyze again") : this.text("AI 整理重點", "AI summary")}
      </button>
      ${e && !e.enabled ? d`<p class="progress">${this.message("ai_not_configured")}</p>` : c}
      ${s ? d`<p class="progress" role="status">${r} (${(e == null ? void 0 : e.processed) ?? 0}/${this.notice.attachments.length})</p>` : c}
      ${this.error || e != null && e.error ? d`<p class="error" role="alert">
                ${this.message(this.error || (e == null ? void 0 : e.error) || "")}
              </p>
              ${this.error ? d`<button @click=${() => this.load()}>${this.text("重試連線", "Retry connection")}</button>` : c}` : c}
      ${e != null && e.stale ? d`<p class="warning">${this.text("通告或模型設定已更新，請重新分析。", "Notice or model settings changed. Analyze again.")}</p>` : c}
      ${(e == null ? void 0 : e.status) === "partial" ? d`<p class="warning">${this.text("部分完成", "Partially completed")}</p>` : c}
      ${(a = e == null ? void 0 : e.missing) == null ? void 0 : a.map((l) => d`<p class="warning">${l.filename}: ${this.message(l.error)}</p>`)}
      ${e != null && e.summary ? d`<div class="summary">
              ${i.map(
      ([l, o, u]) => {
        var p, h;
        return d`<h4>${this.text(o, u)}</h4>
                    <ul>
                      ${(h = (p = e.summary) == null ? void 0 : p[l]) == null ? void 0 : h.map(
          (m) => d`<li>
                            <span class="summary-text">${m.text}</span>
                            <div class="sources">
                              ${m.sources.map((f) => this.reference(f)).join("; ")}
                            </div>
                          </li>`
        )}
                    </ul>`;
      }
    )}
            </div>` : c}
    `;
  }
}
y(q, "properties", {
  hass: { attribute: !1 },
  entityId: { attribute: !1 },
  notice: { attribute: !1 },
  showAttachments: { attribute: !1 },
  state: { state: !0 },
  error: { state: !0 },
  downloads: { state: !0 },
  submitting: { state: !0 }
}), y(q, "styles", X`
    :host {
      display: block;
      font-size: 14px;
    }
    .files {
      margin: 10px 0;
    }
    .file {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding: 8px 0;
    }
    .name {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .metadata,
    .sources,
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
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    h4 {
      margin: 12px 0 4px;
      font-size: 14px;
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
  `);
customElements.define("hkte-notice-actions", q);
const St = 20, Qt = 5, te = 30;
function E(n, t = "") {
  return typeof n == "string" ? n : t;
}
function pt(n) {
  return typeof n == "string" && n.length > 0 ? n : null;
}
function mt(n) {
  return typeof n == "boolean" ? n : null;
}
function ee(n) {
  if (!n || typeof n != "object") return null;
  const t = n, e = E(t.filename);
  return e ? {
    id: E(t.id),
    filename: e,
    mime_type: E(t.mime_type, "application/octet-stream"),
    size: typeof t.size == "number" && t.size >= 0 ? t.size : null
  } : null;
}
function se(n, t) {
  if (!n || typeof n != "object") return null;
  const e = n, s = E(e.title, "Untitled notice");
  return {
    id: E(e.id, `notice-${t}`),
    title: s,
    content: E(e.content),
    issued_at: pt(e.issued_at),
    deadline: pt(e.deadline),
    unread: mt(e.unread),
    replied: mt(e.replied),
    content_truncated: e.content_truncated === !0,
    attachments: Array.isArray(e.attachments) ? e.attachments.map(ee).filter((i) => i !== null) : []
  };
}
function ft(n) {
  if (!n) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(n);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function ie(n, t) {
  const e = t.attributes.notices;
  if (!Array.isArray(e)) return null;
  const i = [
    ...e.map(se).filter((r) => r !== null).sort((r, a) => ft(a.issued_at) - ft(r.issued_at)).reduce((r, a) => (r.has(a.id) || r.set(a.id, a), r), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: n,
    name: E(t.attributes.friendly_name, n),
    state: t.state,
    notices: i,
    hasMore: t.attributes.has_more === !0
  };
}
function ne(n, t) {
  return (t != null && t.length ? t : Object.keys(n.states)).map((s) => {
    const i = n.states[s];
    return i ? ie(s, i) : null;
  }).filter((s) => s !== null).sort((s, i) => s.name.localeCompare(i.name));
}
function gt(n, t, e, s = 0, i = Date.now()) {
  const r = Math.min(St, Math.max(1, Math.round(e))), a = Ct(s), l = i - a * 24 * 60 * 60 * 1e3;
  return n.notices.filter((o) => t === "all" || o.unread === !0).filter((o) => {
    if (a === 0 || !o.issued_at) return !0;
    const u = Date.parse(o.issued_at);
    return Number.isNaN(u) || u >= l;
  }).slice(0, r);
}
function re(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : Qt;
  return Math.min(St, Math.max(1, Math.round(t)));
}
function Ct(n) {
  const t = typeof n == "number" && Number.isFinite(n) ? n : 0;
  return Math.min(te, Math.max(0, Math.round(t)));
}
const yt = {
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
function V(n) {
  var e, s;
  return (((e = n == null ? void 0 : n.locale) == null ? void 0 : e.language) ?? ((s = n == null ? void 0 : n.config) == null ? void 0 : s.language) ?? "en").toLowerCase().startsWith("zh") ? yt.zh : yt.en;
}
function ae(n, t) {
  return n.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || t;
}
function oe(n) {
  if (!n || typeof n != "object" || Array.isArray(n))
    return;
  const t = Object.entries(n).reduce((e, [s, i]) => (typeof i == "string" && i.trim() && (e[s] = i.trim()), e), {});
  return Object.keys(t).length ? t : void 0;
}
function $t(n, t) {
  var i;
  const e = V(t);
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
function le(n) {
  return n === null ? "" : n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
}
function ce() {
  return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}
function he() {
  return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}
class Y extends w {
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
      entity_names: oe(t.entity_names),
      filter: t.filter === "unread" ? "unread" : "all",
      limit: re(t.limit),
      days: Ct(t.days),
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
    return ne(this.hass ?? { states: {} }, (t = this.config) == null ? void 0 : t.entities);
  }
  _notice(t, e, s, i) {
    var l, o, u, p;
    const r = V(this.hass), a = s === "all" || s === "latest" && e === 0;
    return d`<details
      class=${t.unread === !0 ? "unread-notice" : ""}
      ?open=${a}
    >
      <summary>
        <span class="title-content">
          <span class="title">${t.title}</span>
          <span class="issued-title"
            >${$t(t.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${t.unread === !0 ? d`<span class="unread">${r.unread}</span>` : c}
          ${t.unread === !1 ? d`<span
                  class="status-icon read-status"
                  title=${r.read}
                  aria-label=${r.read}
                  role="img"
                  >${ce()}</span
                >` : c}
          ${t.replied === !0 ? d`<span
                  class="status-icon replied-status"
                  title=${r.replied}
                  aria-label=${r.replied}
                  role="img"
                  >${he()}</span
                >` : c}
        </span>
      </summary>
      <div class="meta">
        <span>${r.deadline}: ${$t(t.deadline, this.hass)}</span>
      </div>
      <div class="body">${t.content || r.noBody}</div>
      ${(l = this.hass) != null && l.fetchWithAuth ? d`<hkte-notice-actions .hass=${this.hass} .entityId=${i} .notice=${t} .showAttachments=${((o = this.config) == null ? void 0 : o.show_attachments) !== !1}></hkte-notice-actions>` : c}
      ${t.content_truncated ? d`<div class="hint">${r.truncated}</div>` : c}${!((u = this.hass) != null && u.fetchWithAuth) && ((p = this.config) != null && p.show_attachments) && t.attachments.length ? d`<div class="attachment-label meta">
                <span>${r.attachments}</span>
              </div>
              ${t.attachments.map((h) => d`<div class="attachment"><span class="attachment-name">${h.filename}</span><span>${h.mime_type}</span>${h.size !== null ? d`<span>${le(h.size)}</span>` : c}</div>`)}` : c}
    </details>`;
  }
  render() {
    var u, p, h, m, f, b;
    const t = V(this.hass), e = this._feeds(), s = ((u = this.config) == null ? void 0 : u.initially_expanded) ?? "latest", i = ((p = this.config) == null ? void 0 : p.limit) ?? 5, r = ((h = this.config) == null ? void 0 : h.days) ?? 0, a = ((m = this.config) == null ? void 0 : m.filter) ?? "all", l = ((f = this.config) == null ? void 0 : f.show_student_name) !== !1, o = e.reduce(
      (g, k) => g + gt(k, a, i, r).length,
      0
    );
    return d`<ha-card
      ><div class="header">
        <h1>${((b = this.config) == null ? void 0 : b.title) ?? "HKTE Notices"}</h1>
        <span class="count">${o}</span>
      </div>
      <div class="content">
        ${this.hass ? e.length === 0 ? d`<div class="empty">${t.noEntities}</div>` : e.map((g) => {
      var tt, et;
      const k = gt(g, a, i, r), Nt = g.state === "unavailable" || g.state === "unknown";
      return d`<section class="student">
                    ${l ? d`<h2 class="student-title">
                            ${((et = (tt = this.config) == null ? void 0 : tt.entity_names) == null ? void 0 : et[g.entityId]) ?? ae(g.name, g.entityId)}
                          </h2>` : c}
                    ${Nt ? d`<div class="hint error">${t.unavailable}</div>` : k.length ? k.map((Tt, kt) => this._notice(Tt, kt, s, g.entityId)) : d`<div class="empty">${t.noNotices}</div>`}${g.hasMore && k.length ? d`<div class="hint">${t.more}</div>` : c}
                  </section>`;
    }) : d`<div class="hint">${t.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
y(Y, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), y(Y, "styles", X`
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
class J extends w {
  constructor() {
    super(), this.config = { type: "custom:hkte-notices-card" };
  }
  setConfig(t) {
    this.config = t;
  }
  render() {
    return d`<ha-form
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
    return t.length === 0 ? c : d`<section class="entity-names">
      <h3>Entity display names</h3>
      ${t.map(
      (e, s) => {
        var i;
        return d`<label class="entity-name-field" for=${`entity-name-${s}`}>
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
y(J, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), y(J, "styles", X`
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
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", J);
window.customCards = window.customCards ?? [];
window.customCards.some((n) => n.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  Y as HkteNoticesCard,
  J as HkteNoticesCardEditor
};
