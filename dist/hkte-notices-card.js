var Pt = Object.defineProperty;
var Ot = (i, t, e) => t in i ? Pt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var y = (i, t, e) => Ot(i, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, X = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (X && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (i) => new wt(typeof i == "string" ? i : i + "", void 0, Q), tt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new wt(e, i, Q);
}, Ht = (i, t) => {
  if (X) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = D.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, rt = X ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Rt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: jt, defineProperty: Dt, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: Lt, getOwnPropertySymbols: Wt, getPrototypeOf: Kt } = Object, _ = globalThis, at = _.trustedTypes, Ft = at ? at.emptyScript : "", W = _.reactiveElementPolyfillSupport, U = (i, t) => i, V = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ft : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Et = (i, t) => !jt(i, t), ot = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: Et };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ot) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Dt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = Bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: n, set(a) {
      const l = n == null ? void 0 : n.call(this);
      r == null || r.call(this, a), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = Kt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, s = [...Lt(e), ...Wt(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(rt(n));
    } else t !== void 0 && e.push(rt(t));
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
    return Ht(t, this.constructor.elementStyles), t;
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
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const a = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : V).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, a;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const l = s.getPropertyOptions(n), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = n;
      const h = o.fromAttribute(e, l.type);
      this[n] = h ?? ((a = this._$Ej) == null ? void 0 : a.get(n)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? Et)(r, e) || s.useDefault && s.reflect && r === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, a] of n) {
        const { wrapped: l } = a, o = this[r];
        l !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, a, o);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[U("elementProperties")] = /* @__PURE__ */ new Map(), k[U("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: k }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, lt = (i) => i, B = P.trustedTypes, ct = B ? B.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, St = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ct = "?" + $, qt = `<${Ct}>`, S = document, O = () => S.createComment(""), R = (i) => i === null || typeof i != "object" && typeof i != "function", et = Array.isArray, Vt = (i) => et(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", K = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, ht = />/g, x = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, Nt = /^(?:script|style|textarea|title)$/i, Yt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), d = Yt(1), T = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), mt = /* @__PURE__ */ new WeakMap(), v = S.createTreeWalker(S, 129);
function kt(i, t) {
  if (!et(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Jt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = M;
  for (let l = 0; l < e; l++) {
    const o = i[l];
    let h, u, p = -1, m = 0;
    for (; m < o.length && (a.lastIndex = m, u = a.exec(o), u !== null); ) m = a.lastIndex, a === M ? u[1] === "!--" ? a = dt : u[1] !== void 0 ? a = ht : u[2] !== void 0 ? (Nt.test(u[2]) && (n = RegExp("</" + u[2], "g")), a = x) : u[3] !== void 0 && (a = x) : a === x ? u[0] === ">" ? (a = n ?? M, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, h = u[1], a = u[3] === void 0 ? x : u[3] === '"' ? ut : pt) : a === ut || a === pt ? a = x : a === dt || a === ht ? a = M : (a = x, n = void 0);
    const f = a === x && i[l + 1].startsWith("/>") ? " " : "";
    r += a === M ? o + qt : p >= 0 ? (s.push(h), o.slice(0, p) + St + o.slice(p) + $ + f) : o + $ + (p === -2 ? l : f);
  }
  return [kt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const l = t.length - 1, o = this.parts, [h, u] = Jt(t, e);
    if (this.el = H.createElement(h, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = v.nextNode()) !== null && o.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(St)) {
          const m = u[a++], f = n.getAttribute(p).split($), b = /([.?@])?(.*)/.exec(m);
          o.push({ type: 1, index: r, name: b[2], strings: f, ctor: b[1] === "." ? Gt : b[1] === "?" ? Xt : b[1] === "@" ? Qt : L }), n.removeAttribute(p);
        } else p.startsWith($) && (o.push({ type: 6, index: r }), n.removeAttribute(p));
        if (Nt.test(n.tagName)) {
          const p = n.textContent.split($), m = p.length - 1;
          if (m > 0) {
            n.textContent = B ? B.emptyScript : "";
            for (let f = 0; f < m; f++) n.append(p[f], O()), v.nextNode(), o.push({ type: 2, index: ++r });
            n.append(p[m], O());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ct) o.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf($, p + 1)) !== -1; ) o.push({ type: 7, index: r }), p += $.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function I(i, t, e = i, s) {
  var a, l;
  if (t === T) return t;
  let n = s !== void 0 ? (a = e._$Co) == null ? void 0 : a[s] : e._$Cl;
  const r = R(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((l = n == null ? void 0 : n._$AO) == null || l.call(n, !1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = I(i, n._$AS(i, t.values), n, s)), t;
}
class Zt {
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
    const { el: { content: e }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    v.currentNode = n;
    let r = v.nextNode(), a = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let h;
        o.type === 2 ? h = new j(r, r.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (h = new te(r, this, t)), this._$AV.push(h), o = s[++l];
      }
      a !== (o == null ? void 0 : o.index) && (r = v.nextNode(), a++);
    }
    return v.currentNode = S, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class j {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = I(this, t, e), R(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Vt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(kt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(e);
    else {
      const a = new Zt(n, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = mt.get(t.strings);
    return e === void 0 && mt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new j(this.O(O()), this.O(O()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = lt(t).nextSibling;
      lt(t).remove(), t = n;
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
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = I(this, t, e, 0), a = !R(t) || t !== this._$AH && t !== T, a && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = r[0], o = 0; o < r.length - 1; o++) h = I(this, l[s + o], e, o), h === T && (h = this._$AH[o]), a || (a = !R(h) || h !== this._$AH[o]), h === c ? t = c : t !== c && (t += (h ?? "") + r[o + 1]), this._$AH[o] = h;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Gt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Xt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Qt extends L {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = I(this, t, e, 0) ?? c) === T) return;
    const s = this._$AH, n = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== c && (s === c || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class te {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    I(this, t);
  }
}
const F = P.litHtmlPolyfillSupport;
F == null || F(H, j), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.3");
const ee = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = n = new j(t.insertBefore(O(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class w extends k {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ee(e, this.renderRoot, this.renderOptions);
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
    return T;
  }
}
var At;
w._$litElement$ = !0, w.finalized = !0, (At = A.litElementHydrateSupport) == null || At.call(A, { LitElement: w });
const q = A.litElementPolyfillSupport;
q == null || q({ LitElement: w });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
const ft = [
  "highlights",
  "dates",
  "costs",
  "actions",
  "questions"
], C = (i) => i !== null && typeof i == "object" && !Array.isArray(i), N = (i, t) => typeof i == "string" && i.length <= t;
function se(i) {
  if (!C(i) || typeof i.enabled != "boolean" || !["idle", "running", "completed", "partial", "failed"].includes(
    String(i.status)
  ) || i.stage !== void 0 && !["downloading", "rendering", "analyzing"].includes(String(i.stage)))
    return !1;
  for (const s of ["stage", "error"])
    if (i[s] !== void 0 && !N(i[s], 100)) return !1;
  if (i.stale !== void 0 && typeof i.stale != "boolean" || i.processed !== void 0 && (!Number.isInteger(i.processed) || Number(i.processed) < 0 || Number(i.processed) > 10) || i.missing !== void 0 && (!Array.isArray(i.missing) || i.missing.length > 10 || !i.missing.every(
    (s) => C(s) && N(s.filename, 4096) && N(s.error, 100)
  )) || i.sources !== void 0 && (!Array.isArray(i.sources) || i.sources.length > 21 || !i.sources.every(
    (s) => C(s) && N(s.attachment_id, 4096) && N(s.filename, 4096) && Number.isInteger(s.page) && Number(s.page) >= 0 && Number(s.page) <= 20
  )))
    return !1;
  if (i.summary === void 0)
    return !["completed", "partial"].includes(String(i.status));
  if (!C(i.summary) || Object.keys(i.summary).length !== ft.length || !Array.isArray(i.sources))
    return !1;
  const t = i.sources;
  let e = 0;
  for (const s of ft) {
    const n = i.summary[s];
    if (!Array.isArray(n) || n.length > 20) return !1;
    for (const r of n)
      if (!C(r) || Object.keys(r).length !== 2 || !N(r.text, 2e3) || !r.text.trim() || !Array.isArray(r.sources) || r.sources.length > 20 || (e += r.text.length, !r.sources.every(
        (a) => C(a) && Object.keys(a).length === 2 && typeof a.attachment_id == "string" && Number.isInteger(a.page) && t.some(
          (l) => l.attachment_id === a.attachment_id && l.page === a.page
        )
      )))
        return !1;
  }
  return e > 0 && e <= 16e3;
}
function gt(i) {
  if (!se(i)) throw new Error("invalid_ai_response");
  return i;
}
const ie = {
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
class Y extends w {
  constructor() {
    super();
    y(this, "signature", "");
    y(this, "timer");
    y(this, "generation", 0);
    this.error = "", this.downloads = /* @__PURE__ */ new Set(), this.submitting = !1;
  }
  get zh() {
    var e, s, n, r;
    return (((s = (e = this.hass) == null ? void 0 : e.locale) == null ? void 0 : s.language) ?? ((r = (n = this.hass) == null ? void 0 : n.config) == null ? void 0 : r.language) ?? "en").startsWith("zh");
  }
  text(e, s) {
    return this.zh ? e : s;
  }
  message(e) {
    var s;
    return ((s = ie[e]) == null ? void 0 : s[this.zh ? 0 : 1]) ?? this.text("分析失敗，請重試。", "Analysis failed. Try again.");
  }
  get path() {
    return `/api/hkte_smart_school/notice/${encodeURIComponent(this.entityId)}/${encodeURIComponent(this.notice.id)}`;
  }
  updated(e) {
    var n;
    if (!((n = this.hass) != null && n.fetchWithAuth) || !this.notice || !this.entityId) return;
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
    const n = await this.hass.fetchWithAuth(e, s);
    if (!n.ok) {
      const a = await n.json().catch(() => ({}));
      throw new Error(
        typeof a.error == "string" ? a.error : "unavailable"
      );
    }
    return n;
  }
  async load() {
    const e = this.generation;
    try {
      const s = gt(
        await (await this.request(`${this.path}/analysis`)).json()
      );
      if (!this.isConnected || e !== this.generation) return;
      this.state = s, this.error = "", s.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch (s) {
      e === this.generation && (this.error = s instanceof Error && s.message === "invalid_ai_response" ? s.message : "unavailable");
    }
  }
  async start() {
    var s;
    const e = this.generation;
    this.submitting = !0, this.error = "", clearTimeout(this.timer);
    try {
      const n = gt(
        await (await this.request(`${this.path}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ force: !!((s = this.state) != null && s.summary) })
        })).json()
      );
      if (e !== this.generation) return;
      this.state = n, n.status === "running" && (this.timer = setTimeout(() => void this.load(), 2e3));
    } catch (n) {
      e === this.generation && (this.error = n instanceof Error ? n.message : "unavailable");
    } finally {
      this.submitting = !1;
    }
  }
  async download(e) {
    this.downloads = /* @__PURE__ */ new Set([...this.downloads, e.id]), this.error = "";
    try {
      const n = await (await this.request(
        `${this.path}/attachment/${encodeURIComponent(e.id)}`
      )).blob();
      if (n.size === 0) throw new Error("empty_file");
      const r = URL.createObjectURL(n), a = document.createElement("a");
      a.href = r, a.download = e.filename.replace(/[/\\\x00-\x1f]/g, "_"), a.click(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
    } catch (s) {
      this.error = s instanceof Error ? s.message : "download_failed";
    } finally {
      this.downloads = new Set(
        [...this.downloads].filter((s) => s !== e.id)
      );
    }
  }
  render() {
    var a;
    if (!this.notice) return c;
    const e = this.state, s = (e == null ? void 0 : e.status) === "running" || this.submitting, n = [
      ["highlights", "內容重點", "Highlights"],
      ["dates", "重要日期", "Important dates"],
      ["costs", "費用", "Costs"],
      ["actions", "家長待辦", "Parent actions"],
      ["questions", "需確認事項", "To confirm"]
    ], r = (e == null ? void 0 : e.stage) === "analyzing" ? this.text("AI 分析中", "Analyzing") : (e == null ? void 0 : e.stage) === "rendering" ? this.text("處理附件頁面", "Rendering pages") : this.text("取得附件", "Fetching attachments");
    return d`
      ${this.showAttachments ? d`<div class="files">
              ${this.notice.attachments.map(
      (l, o) => {
        var h;
        return d`<div class="file">
                    <div class="name">
                      ${l.filename}
                      <div class="metadata">
                        ${l.size !== null ? `${Math.round(l.size / 1024)} KB` : c}
                      </div>
                    </div>
                    <div class="file-actions">
                      ${o === 0 ? this.analyzeButton(e, s) : c}
                      <button
                        class="icon"
                        title=${this.text("下載附件", "Download attachment")}
                        aria-label=${this.text("下載附件", "Download attachment")}
                        ?disabled=${!l.id || !((h = this.hass) != null && h.fetchWithAuth) || this.downloads.has(l.id)}
                        @click=${() => this.download(l)}
                      >
                        <ha-icon icon="mdi:download"></ha-icon>
                      </button>
                    </div>
                  </div>`;
      }
    )}
            </div>` : c}
      ${this.notice.attachments.length === 0 ? this.analyzeButton(e, s) : c}
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
              ${n.map(
      ([l, o, h]) => {
        var u, p;
        return d`<h4>${this.text(o, h)}</h4>
                    <ul>
                      ${(p = (u = e.summary) == null ? void 0 : u[l]) != null && p.length ? e.summary[l].map(
          (m) => d`<li>
                                  <span class="summary-text">${m.text}</span>
                                </li>`
        ) : d`<li class="metadata">
                              ${this.text("未提供", "Not provided")}
                            </li>`}
                    </ul>`;
      }
    )}
            </div>` : c}
    `;
  }
  analyzeButton(e, s) {
    const n = e != null && e.summary ? this.text("重新分析", "Analyze again") : this.text("AI 整理重點", "AI summary");
    return d`<button
      class="icon"
      title=${n}
      aria-label=${n}
      ?disabled=${s || !(e != null && e.enabled)}
      @click=${() => this.start()}
    >
      <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
    </button>`;
  }
}
y(Y, "properties", {
  hass: { attribute: !1 },
  entityId: { attribute: !1 },
  notice: { attribute: !1 },
  showAttachments: { attribute: !1 },
  state: { state: !0 },
  error: { state: !0 },
  downloads: { state: !0 },
  submitting: { state: !0 }
}), y(Y, "styles", tt`
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
  `);
customElements.define("hkte-notice-actions", Y);
const Tt = 20, ne = 5, re = 30;
function E(i, t = "") {
  return typeof i == "string" ? i : t;
}
function yt(i) {
  return typeof i == "string" && i.length > 0 ? i : null;
}
function $t(i) {
  return typeof i == "boolean" ? i : null;
}
function ae(i) {
  if (!i || typeof i != "object") return null;
  const t = i, e = E(t.filename);
  return e ? {
    id: E(t.id),
    filename: e,
    mime_type: E(t.mime_type, "application/octet-stream"),
    size: typeof t.size == "number" && t.size >= 0 ? t.size : null
  } : null;
}
function oe(i, t) {
  if (!i || typeof i != "object") return null;
  const e = i, s = E(e.title, "Untitled notice");
  return {
    id: E(e.id, `notice-${t}`),
    title: s,
    content: E(e.content),
    issued_at: yt(e.issued_at),
    deadline: yt(e.deadline),
    unread: $t(e.unread),
    replied: $t(e.replied),
    content_truncated: e.content_truncated === !0,
    attachments: Array.isArray(e.attachments) ? e.attachments.map(ae).filter((n) => n !== null) : []
  };
}
function _t(i) {
  if (!i) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(i);
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}
function le(i, t) {
  const e = t.attributes.notices;
  if (!Array.isArray(e)) return null;
  const n = [
    ...e.map(oe).filter((r) => r !== null).sort((r, a) => _t(a.issued_at) - _t(r.issued_at)).reduce((r, a) => (r.has(a.id) || r.set(a.id, a), r), /* @__PURE__ */ new Map()).values()
  ];
  return {
    entityId: i,
    name: E(t.attributes.friendly_name, i),
    state: t.state,
    notices: n,
    hasMore: t.attributes.has_more === !0
  };
}
function ce(i, t) {
  return (t != null && t.length ? t : Object.keys(i.states)).map((s) => {
    const n = i.states[s];
    return n ? le(s, n) : null;
  }).filter((s) => s !== null).sort((s, n) => s.name.localeCompare(n.name));
}
function bt(i, t, e, s = 0, n = Date.now()) {
  const r = Math.min(Tt, Math.max(1, Math.round(e))), a = It(s), l = n - a * 24 * 60 * 60 * 1e3;
  return i.notices.filter((o) => t === "all" || o.unread === !0).filter((o) => {
    if (a === 0 || !o.issued_at) return !0;
    const h = Date.parse(o.issued_at);
    return Number.isNaN(h) || h >= l;
  }).slice(0, r);
}
function de(i) {
  const t = typeof i == "number" && Number.isFinite(i) ? i : ne;
  return Math.min(Tt, Math.max(1, Math.round(t)));
}
function It(i) {
  const t = typeof i == "number" && Number.isFinite(i) ? i : 0;
  return Math.min(re, Math.max(0, Math.round(t)));
}
const xt = {
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
function J(i) {
  var e, s;
  return (((e = i == null ? void 0 : i.locale) == null ? void 0 : e.language) ?? ((s = i == null ? void 0 : i.config) == null ? void 0 : s.language) ?? "en").toLowerCase().startsWith("zh") ? xt.zh : xt.en;
}
function he(i, t) {
  return i.replace(/\s+(?:Notice content|通告內容)$/i, "").trim() || t;
}
function pe(i) {
  if (!i || typeof i != "object" || Array.isArray(i))
    return;
  const t = Object.entries(i).reduce((e, [s, n]) => (typeof n == "string" && n.trim() && (e[s] = n.trim()), e), {});
  return Object.keys(t).length ? t : void 0;
}
function vt(i, t) {
  var n;
  const e = J(t);
  if (!i) return e.noDate;
  const s = new Date(i);
  if (Number.isNaN(s.getTime())) return i;
  try {
    return new Intl.DateTimeFormat(((n = t == null ? void 0 : t.locale) == null ? void 0 : n.language) || void 0, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(s);
  } catch {
    return i;
  }
}
function ue(i) {
  return i === null ? "" : i < 1024 ? `${i} B` : i < 1048576 ? `${Math.round(i / 1024)} KB` : `${(i / 1048576).toFixed(1)} MB`;
}
function me() {
  return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>`;
}
function fe() {
  return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>`;
}
class Z extends w {
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
      entity_names: pe(t.entity_names),
      filter: t.filter === "unread" ? "unread" : "all",
      limit: de(t.limit),
      days: It(t.days),
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
    return ce(this.hass ?? { states: {} }, (t = this.config) == null ? void 0 : t.entities);
  }
  _notice(t, e, s, n) {
    var l, o, h, u;
    const r = J(this.hass), a = s === "all" || s === "latest" && e === 0;
    return d`<details
      class=${t.unread === !0 ? "unread-notice" : ""}
      ?open=${a}
    >
      <summary>
        <span class="title-content">
          <span class="title">${t.title}</span>
          <span class="issued-title"
            >${vt(t.issued_at, this.hass)}</span
          > </span
        ><span class="status-icons">
          ${t.unread === !0 ? d`<span class="unread">${r.unread}</span>` : c}
          ${t.unread === !1 ? d`<span
                  class="status-icon read-status"
                  title=${r.read}
                  aria-label=${r.read}
                  role="img"
                  >${me()}</span
                >` : c}
          ${t.replied === !0 ? d`<span
                  class="status-icon replied-status"
                  title=${r.replied}
                  aria-label=${r.replied}
                  role="img"
                  >${fe()}</span
                >` : c}
        </span>
      </summary>
      <div class="meta">
        <span class="deadline">
          <ha-icon
            class="deadline-icon"
            icon="mdi:calendar-clock"
            aria-hidden="true"
          ></ha-icon>
          <span class="deadline-label">${r.deadline}</span>
          <span class="deadline-value"
            >${vt(t.deadline, this.hass)}</span
          >
        </span>
      </div>
      <div class="body">${t.content || r.noBody}</div>
      ${(l = this.hass) != null && l.fetchWithAuth ? d`<hkte-notice-actions .hass=${this.hass} .entityId=${n} .notice=${t} .showAttachments=${((o = this.config) == null ? void 0 : o.show_attachments) !== !1}></hkte-notice-actions>` : c}
      ${t.content_truncated ? d`<div class="hint">${r.truncated}</div>` : c}${!((h = this.hass) != null && h.fetchWithAuth) && ((u = this.config) != null && u.show_attachments) && t.attachments.length ? d`<div class="attachment-label meta">
                <span>${r.attachments}</span>
              </div>
              ${t.attachments.map((p) => d`<div class="attachment"><span class="attachment-name">${p.filename}</span><span>${p.mime_type}</span>${p.size !== null ? d`<span>${ue(p.size)}</span>` : c}</div>`)}` : c}
    </details>`;
  }
  render() {
    var h, u, p, m, f, b;
    const t = J(this.hass), e = this._feeds(), s = ((h = this.config) == null ? void 0 : h.initially_expanded) ?? "latest", n = ((u = this.config) == null ? void 0 : u.limit) ?? 5, r = ((p = this.config) == null ? void 0 : p.days) ?? 0, a = ((m = this.config) == null ? void 0 : m.filter) ?? "all", l = ((f = this.config) == null ? void 0 : f.show_student_name) !== !1, o = e.reduce(
      (g, z) => g + bt(z, a, n, r).length,
      0
    );
    return d`<ha-card
      ><div class="header">
        <h1>${((b = this.config) == null ? void 0 : b.title) ?? "HKTE Notices"}</h1>
        <span class="count">${o}</span>
      </div>
      <div class="content">
        ${this.hass ? e.length === 0 ? d`<div class="empty">${t.noEntities}</div>` : e.map((g) => {
      var st, it;
      const z = bt(g, a, n, r), zt = g.state === "unavailable" || g.state === "unknown";
      return d`<section class="student">
                    ${l ? d`<h2 class="student-title">
                            ${((it = (st = this.config) == null ? void 0 : st.entity_names) == null ? void 0 : it[g.entityId]) ?? he(g.name, g.entityId)}
                          </h2>` : c}
                    ${zt ? d`<div class="hint error">${t.unavailable}</div>` : z.length ? z.map((Mt, Ut) => this._notice(Mt, Ut, s, g.entityId)) : d`<div class="empty">${t.noNotices}</div>`}${g.hasMore && z.length ? d`<div class="hint">${t.more}</div>` : c}
                  </section>`;
    }) : d`<div class="hint">${t.unavailable}</div>`}
      </div></ha-card
    >`;
  }
}
y(Z, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), y(Z, "styles", tt`
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
      --mdc-icon-size: 24px;
      color: var(--primary-color);
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
class G extends w {
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
        var n;
        return d`<label class="entity-name-field" for=${`entity-name-${s}`}>
            <span class="entity-name-label">${e}</span>
            <input
              id=${`entity-name-${s}`}
              class="entity-name-input"
              type="text"
              .value=${((n = this.config.entity_names) == null ? void 0 : n[e]) ?? ""}
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
    const s = e.target.value.trim(), n = { ...this.config.entity_names ?? {} };
    s ? n[t] = s : delete n[t], this.dispatchEvent(
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
y(G, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), y(G, "styles", tt`
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
customElements.get("hkte-notices-card") || customElements.define("hkte-notices-card", Z);
customElements.get("hkte-notices-card-editor") || customElements.define("hkte-notices-card-editor", G);
window.customCards = window.customCards ?? [];
window.customCards.some((i) => i.type === "hkte-notices-card") || window.customCards.push({
  type: "hkte-notices-card",
  name: "HKTE Notices Card",
  description: "Read-only HKTE Smart School notices"
});
export {
  Z as HkteNoticesCard,
  G as HkteNoticesCardEditor
};
