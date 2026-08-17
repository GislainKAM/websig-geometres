/* @ds-bundle: {"format":4,"namespace":"WebsigDesignSystem_aebc7a","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"ProjectCard","sourcePath":"components/data/ProjectCard.jsx"},{"name":"StatBlock","sourcePath":"components/data/StatBlock.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"FeaturePopup","sourcePath":"components/map/FeaturePopup.jsx"},{"name":"LayerPanel","sourcePath":"components/map/LayerPanel.jsx"},{"name":"Legend","sourcePath":"components/map/Legend.jsx"},{"name":"MapFrame","sourcePath":"components/map/MapFrame.jsx"},{"name":"ScaleBar","sourcePath":"components/map/ScaleBar.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"cb68f1577808","components/core/Button.jsx":"bb1e2f85f1e6","components/core/Card.jsx":"c57bd5223be8","components/core/Icon.jsx":"0f01a561dabd","components/core/IconButton.jsx":"a500fa642523","components/core/Logo.jsx":"73948c7b2f0d","components/core/Tag.jsx":"78722ce33c1e","components/data/DataTable.jsx":"5a8c63337210","components/data/ProjectCard.jsx":"82492102c696","components/data/StatBlock.jsx":"f058b72718c7","components/feedback/Dialog.jsx":"a781a213c17a","components/feedback/EmptyState.jsx":"8cdad8477823","components/feedback/Tooltip.jsx":"fb944eb4d268","components/forms/Checkbox.jsx":"0abe44bbdf0e","components/forms/Input.jsx":"0b36b5423828","components/forms/Select.jsx":"0b72e9b5c014","components/forms/Switch.jsx":"9e79886c80e0","components/map/FeaturePopup.jsx":"268b1629907e","components/map/LayerPanel.jsx":"9ea1b2d0cc7d","components/map/Legend.jsx":"7b9a416ad90c","components/map/MapFrame.jsx":"94010c3c61b8","components/map/ScaleBar.jsx":"5a7b7f67e28b","components/navigation/SiteHeader.jsx":"646ca5338acc","components/navigation/Tabs.jsx":"ea27234e56be","ui_kits/repertoire/Home.jsx":"c814fd9eea27","ui_kits/repertoire/ProjectDetail.jsx":"83358bbcf54d","ui_kits/repertoire/data.js":"bd014e7b767a","ui_kits/webmap-annuaire/AnnuaireMap.jsx":"c308d9c22c70"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WebsigDesignSystem_aebc7a = window.WebsigDesignSystem_aebc7a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: ['var(--ink-100)', 'var(--ink-700)'],
  brand: ['var(--brand-indigo-100)', 'var(--brand-indigo-700)'],
  hydro: ['var(--hydro-100)', 'var(--hydro-700)'],
  terrain: ['var(--terrain-100)', 'var(--terrain-700)'],
  relief: ['var(--relief-100)', 'var(--relief-700)'],
  alert: ['var(--alert-100)', 'var(--alert-700)']
};
function Badge({
  tone = 'neutral',
  dot,
  mono,
  children,
  ...rest
}) {
  const [bg, fg] = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: bg,
      color: fg,
      borderRadius: 'var(--radius-pill)',
      padding: '3px 10px',
      fontSize: 'var(--text-2xs)',
      fontFamily: mono ? 'var(--font-data)' : 'var(--font-body)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: mono ? 0 : 'var(--tracking-wide)',
      textTransform: mono ? 'none' : 'uppercase',
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
      ...(rest.style || {})
    }
  }), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: fg
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  fontFamily: 'var(--font-body)',
  fontWeight: 'var(--weight-semibold)',
  lineHeight: 1,
  border: 'var(--border-w) solid transparent',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out)'
};
const sizes = {
  sm: {
    fontSize: 'var(--text-xs)',
    padding: '0 var(--space-3)',
    height: 30
  },
  md: {
    fontSize: 'var(--text-sm)',
    padding: '0 var(--space-4)',
    height: 38
  },
  lg: {
    fontSize: 'var(--text-base)',
    padding: '0 var(--space-6)',
    height: 46
  }
};
const variants = {
  primary: {
    background: 'var(--surface-brand)',
    color: 'var(--text-invert)',
    borderColor: 'var(--surface-brand)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    borderColor: 'var(--border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-brand)',
    borderColor: 'transparent'
  },
  danger: {
    background: 'var(--alert-600)',
    color: 'var(--text-invert)',
    borderColor: 'var(--alert-600)'
  }
};
const hovers = {
  primary: {
    background: 'var(--brand-indigo-700)',
    borderColor: 'var(--brand-indigo-700)'
  },
  secondary: {
    background: 'var(--ink-50)',
    borderColor: 'var(--border-strong)'
  },
  ghost: {
    background: 'var(--surface-brand-soft)'
  },
  danger: {
    background: 'var(--alert-700)',
    borderColor: 'var(--alert-700)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  block,
  disabled,
  icon,
  iconRight,
  children,
  as,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = as || 'button';
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    width: block ? '100%' : undefined,
    transform: press && !disabled ? 'translateY(1px)' : 'none',
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    ...(rest.style || {})
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    disabled: Tag === 'button' ? disabled : undefined,
    style: style,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  interactive,
  padding = 'var(--space-6)',
  accent,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      borderColor: interactive && hover ? 'var(--border-default)' : 'var(--border-subtle)',
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      overflow: 'hidden',
      position: 'relative',
      ...(rest.style || {})
    }
  }), accent ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      insetInlineStart: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: accent
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = 'https://unpkg.com/lucide-static@0.460.0/icons/';
const cache = {};
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  ...rest
}) {
  const [markup, setMarkup] = React.useState(cache[name] || null);
  React.useEffect(() => {
    let live = true;
    if (cache[name]) {
      setMarkup(cache[name]);
      return;
    }
    fetch(CDN + name + '.svg').then(r => r.ok ? r.text() : Promise.reject()).then(t => {
      cache[name] = t;
      if (live) setMarkup(t);
    }).catch(() => {});
    return () => {
      live = false;
    };
  }, [name]);
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    flex: '0 0 auto',
    color,
    ...(rest.style || {})
  };
  if (!markup) return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    "aria-hidden": "true",
    style: style
  }));
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    role: "img",
    "aria-hidden": "true",
    style: style,
    dangerouslySetInnerHTML: {
      __html: markup.replace('<svg', '<svg width="' + size + '" height="' + size + '" stroke="currentColor"')
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 28,
  md: 34,
  lg: 42
};
function IconButton({
  size = 'md',
  variant = 'secondary',
  label,
  active,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const d = sizes[size];
  const bg = variant === 'chrome' ? 'var(--surface-map-chrome)' : variant === 'ghost' ? 'transparent' : 'var(--surface-card)';
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d,
      height: d,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--ink-100)' : bg,
      color: active ? 'var(--text-brand)' : 'var(--text-body)',
      border: variant === 'ghost' ? '1px solid transparent' : '1px solid var(--border-subtle)',
      boxShadow: variant === 'chrome' ? 'var(--shadow-chrome)' : 'none',
      backdropFilter: variant === 'chrome' ? 'var(--blur-chrome)' : undefined,
      transition: 'background-color var(--dur-fast) var(--ease-out)',
      ...(rest.style || {})
    }
  }), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Logo({
  variant = 'lockup',
  size = 32,
  color = 'var(--brand-indigo-600)',
  wordColor = 'var(--text-strong)',
  ...rest
}) {
  const s = size;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: s * 0.34,
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 100 100",
    "aria-hidden": "true",
    style: {
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "88",
    height: "88",
    rx: "14",
    fill: "none",
    stroke: color,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "50",
    y1: "6",
    x2: "50",
    y2: "24",
    stroke: color,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "50",
    y1: "76",
    x2: "50",
    y2: "94",
    stroke: color,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "50",
    x2: "24",
    y2: "50",
    stroke: color,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "76",
    y1: "50",
    x2: "94",
    y2: "50",
    stroke: color,
    strokeWidth: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "62",
    cy: "38",
    r: "9",
    fill: color
  })), variant === 'lockup' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: s * 0.64,
      letterSpacing: 'var(--tracking-tight)',
      color: wordColor,
      lineHeight: 1
    }
  }, "websig") : null);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  active,
  onRemove,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: '1px solid ' + (active ? 'var(--border-brand)' : 'var(--border-subtle)'),
      background: active ? 'var(--surface-brand-soft)' : hover ? 'var(--ink-50)' : 'var(--surface-card)',
      color: active ? 'var(--text-brand)' : 'var(--text-body)',
      borderRadius: 'var(--radius-pill)',
      padding: '4px 12px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      cursor: rest.onClick ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...(rest.style || {})
    }
  }), children, onRemove ? /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Retirer",
    style: {
      border: 0,
      background: 'none',
      cursor: 'pointer',
      color: 'inherit',
      padding: 0,
      fontSize: 14,
      lineHeight: 1
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  selectedIndex,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--ink-50)',
      borderBottom: '1px solid var(--border-subtle)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-semibold)',
      whiteSpace: 'nowrap'
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onClick: () => onRowClick && onRowClick(r, i),
    style: {
      cursor: onRowClick ? 'pointer' : 'default',
      background: selectedIndex === i ? 'var(--surface-brand-soft)' : 'transparent'
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: 'var(--space-3) var(--space-4)',
      borderBottom: i < rows.length - 1 ? '1px solid var(--ink-100)' : 0,
      fontFamily: c.mono ? 'var(--font-data)' : 'inherit',
      fontVariantNumeric: 'tabular-nums',
      color: c.strong ? 'var(--text-strong)' : 'var(--text-body)',
      fontWeight: c.strong ? 'var(--weight-medium)' : 'var(--weight-regular)'
    }
  }, typeof c.render === 'function' ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProjectCard({
  title,
  summary,
  kind = 'websig',
  status,
  tags = [],
  year,
  thumb,
  href,
  ...rest
}) {
  const kindTone = kind === 'webmap' ? 'hydro' : 'brand';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    interactive: true,
    padding: "0"
  }, rest), /*#__PURE__*/React.createElement("a", {
    href: href || '#',
    style: {
      display: 'block',
      textDecoration: 'none',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 132,
      background: thumb ? `center/cover no-repeat url(${thumb})` : 'var(--ink-100)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: kindTone,
    dot: true
  }, kind === 'webmap' ? 'Webmap' : 'WebSIG'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      margin: 0,
      lineHeight: 1.25
    }
  }, title), year ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-data)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, year) : null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      margin: '6px 0 var(--space-4)',
      lineHeight: 'var(--leading-normal)'
    }
  }, summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-muted)',
      background: 'var(--ink-100)',
      padding: '2px 8px',
      borderRadius: 'var(--radius-pill)'
    }
  }, t)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-brand)'
    }
  }, "Ouvrir ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 14
  }))))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatBlock({
  value,
  label,
  unit,
  tone = 'var(--text-strong)',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-semibold)',
      color: tone,
      lineHeight: 1.05,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, value, unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.5em',
      fontFamily: 'var(--font-data)',
      color: 'var(--text-muted)',
      marginLeft: 4
    }
  }, unit) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: 6,
      fontWeight: 'var(--weight-semibold)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  description,
  onClose,
  footer,
  width = 460,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(2px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: 'var(--space-6)',
      animation: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      margin: '6px 0 0'
    }
  }, description) : null), onClose ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      border: 0,
      background: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 17
  })) : null), children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = 'map-pin-off',
  title,
  description,
  action,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-brand-soft)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 21,
    color: "var(--brand-indigo-600)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      margin: '6px auto 0',
      maxWidth: 380
    }
  }, description) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tooltip({
  label,
  placement = 'top',
  children,
  ...rest
}) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: '100%',
    marginTop: 6,
    left: '50%',
    transform: 'translateX(-50%)'
  } : {
    bottom: '100%',
    marginBottom: 6,
    left: '50%',
    transform: 'translateX(-50%)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...(rest.style || {})
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }), children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 40,
      whiteSpace: 'nowrap',
      background: 'var(--ink-900)',
      color: 'var(--white)',
      fontSize: 'var(--text-2xs)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  swatch,
  disabled,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      ...(rest.style || {})
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 17,
      height: 17,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid ' + (checked ? 'var(--brand-indigo-600)' : 'var(--border-strong)'),
      background: checked ? 'var(--brand-indigo-600)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, checked ? /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })) : null), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), swatch ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: swatch,
      flex: '0 0 auto'
    }
  }) : null, /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  icon,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      display: 'block'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      marginBottom: 6
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: 'var(--surface-card)',
      height: 38,
      padding: '0 var(--space-3)',
      border: '1px solid ' + (error ? 'var(--alert-600)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, icon, /*#__PURE__*/React.createElement("input", _extends({
    id: uid
  }, rest, {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      border: 0,
      outline: 0,
      background: 'none',
      flex: 1,
      minWidth: 0,
      font: 'inherit',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-strong)'
    }
  }))), hint || error ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--alert-600)' : 'var(--text-muted)',
      marginTop: 5
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  hint,
  id,
  ...rest
}) {
  const uid = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      display: 'block'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      marginBottom: 6
    }
  }, label) : null, /*#__PURE__*/React.createElement("select", _extends({
    id: uid
  }, rest, {
    style: {
      width: '100%',
      height: 38,
      padding: '0 var(--space-3)',
      font: 'inherit',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      ...(rest.style || {})
    }
  }), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      marginTop: 5
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  label,
  disabled,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 'var(--text-sm)',
      ...(rest.style || {})
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 38,
      height: 22,
      borderRadius: 999,
      padding: 2,
      flex: '0 0 auto',
      background: checked ? 'var(--brand-indigo-600)' : 'var(--ink-300)',
      transition: 'background-color var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 18,
      height: 18,
      borderRadius: 999,
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: checked ? 'translateX(16px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/map/FeaturePopup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FeaturePopup({
  title,
  subtitle,
  rows = [],
  onClose,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      width: 268,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-4) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-strong)',
      lineHeight: 1.25
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, subtitle) : null), onClose ? /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      border: 0,
      background: 'none',
      cursor: 'pointer',
      padding: 2,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 15
  })) : null), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '7px var(--space-4)',
      borderBottom: i < rows.length - 1 ? '1px solid var(--ink-100)' : 0
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, r.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-data)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-strong)',
      textAlign: 'right'
    }
  }, r.value)))));
}
Object.assign(__ds_scope, { FeaturePopup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/FeaturePopup.jsx", error: String((e && e.message) || e) }); }

// components/map/LayerPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function LayerPanel({
  title = 'Couches',
  layers = [],
  onToggle,
  collapsible = true,
  ...rest
}) {
  const [open, setOpen] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      width: 264,
      background: 'var(--surface-map-chrome)',
      backdropFilter: 'var(--blur-chrome)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-chrome)',
      overflow: 'hidden',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => collapsible && setOpen(o => !o),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-4)',
      background: 'none',
      border: 0,
      cursor: collapsible ? 'pointer' : 'default',
      font: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, title), collapsible ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'chevron-up' : 'chevron-down',
    size: 15,
    color: "var(--text-muted)"
  }) : null), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: '0 var(--space-4) var(--space-4)'
    }
  }, layers.map(l => /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    key: l.id,
    label: l.label,
    swatch: l.color,
    checked: l.visible,
    onChange: () => onToggle && onToggle(l.id)
  }))) : null);
}
Object.assign(__ds_scope, { LayerPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/LayerPanel.jsx", error: String((e && e.message) || e) }); }

// components/map/Legend.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Legend({
  title,
  items = [],
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      background: 'var(--surface-map-chrome)',
      backdropFilter: 'var(--blur-chrome)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-chrome)',
      padding: 'var(--space-3) var(--space-4)',
      minWidth: 170,
      ...(rest.style || {})
    }
  }), title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-3)'
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: it.shape === 'line' ? 3 : 12,
      flex: '0 0 auto',
      background: it.color,
      borderRadius: it.shape === 'point' ? 999 : it.shape === 'line' ? 2 : 3,
      ...(it.shape === 'point' ? {
        width: 12
      } : null)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, it.label), it.value != null ? /*#__PURE__*/React.createElement("span", {
    className: "ws-data",
    style: {
      fontFamily: 'var(--font-data)',
      color: 'var(--text-muted)'
    }
  }, it.value) : null))));
}
Object.assign(__ds_scope, { Legend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/Legend.jsx", error: String((e && e.message) || e) }); }

// components/map/MapFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Real OSM raster tiles — no map library needed for mocks. */
function tileX(lon, z) {
  return (lon + 180) / 360 * Math.pow(2, z);
}
function tileY(lat, z) {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z);
}
const CARTO = s => (z, x, y) => `https://a.basemaps.cartocdn.com/${s}/${z}/${x}/${y}.png`;
const CREDIT = '© OpenStreetMap · © CARTO';
const BASEMAPS = {
  osm: {
    url: CARTO('rastertiles/voyager'),
    credit: CREDIT,
    filter: 'saturate(.8) contrast(.98)'
  },
  light: {
    url: CARTO('light_all'),
    credit: CREDIT,
    filter: 'none'
  },
  dark: {
    url: CARTO('dark_all'),
    credit: CREDIT,
    filter: 'saturate(.7)'
  }
};
function MapFrame({
  center = [4.0511, 9.7679],
  zoom = 12,
  basemap = 'osm',
  height = 420,
  radius = 'var(--radius-lg)',
  children,
  ...rest
}) {
  const bm = BASEMAPS[basemap] || BASEMAPS.osm;
  const z = Math.round(zoom);
  const [lat, lon] = center;
  const cx = tileX(lon, z),
    cy = tileY(lat, z);
  const cols = 5,
    rows = 4,
    S = 256;
  const originX = Math.floor(cx) - Math.floor(cols / 2),
    originY = Math.floor(cy) - Math.floor(rows / 2);
  const offX = -(cx - originX) * S,
    offY = -(cy - originY) * S;
  const tiles = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    tiles.push(/*#__PURE__*/React.createElement("img", {
      key: i + '-' + j,
      alt: "",
      src: bm.url(z, originX + i, originY + j),
      width: S,
      height: S,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: offX + i * S,
        marginTop: offY + j * S,
        display: 'block'
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: 'relative',
      height,
      borderRadius: radius,
      overflow: 'hidden',
      background: 'var(--ink-200)',
      border: '1px solid var(--border-subtle)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      filter: bm.filter
    }
  }, tiles), children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 6,
      bottom: 5,
      zIndex: 5,
      fontSize: 'var(--text-2xs)',
      fontFamily: 'var(--font-body)',
      color: 'var(--ink-700)',
      background: 'rgba(255,255,255,.78)',
      padding: '1px 6px',
      borderRadius: 'var(--radius-sm)'
    }
  }, bm.credit));
}
Object.assign(__ds_scope, { MapFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/MapFrame.jsx", error: String((e && e.message) || e) }); }

// components/map/ScaleBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ScaleBar({
  label = '500 m',
  width = 88,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 3,
      background: 'var(--surface-map-chrome)',
      padding: '5px 8px',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-chrome)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-data)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-body)',
      lineHeight: 1
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      width,
      height: 5,
      borderLeft: '2px solid var(--ink-700)',
      borderRight: '2px solid var(--ink-700)',
      borderBottom: '2px solid var(--ink-700)'
    }
  }));
}
Object.assign(__ds_scope, { ScaleBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/ScaleBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SiteHeader({
  links = [],
  active,
  onNavigate,
  lang = 'FR',
  onLang,
  action,
  inverse,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      height: 'var(--header-h)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: '0 var(--space-8)',
      background: inverse ? 'var(--surface-inverse)' : 'var(--surface-card)',
      borderBottom: '1px solid ' + (inverse ? 'transparent' : 'var(--border-subtle)'),
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 26,
    color: inverse ? 'var(--white)' : 'var(--brand-indigo-600)',
    wordColor: inverse ? 'var(--white)' : 'var(--text-strong)'
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flex: 1
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.value,
    href: l.href || '#',
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(l.value);
    },
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      textDecoration: 'none',
      color: l.value === active ? inverse ? 'var(--white)' : 'var(--text-strong)' : inverse ? 'var(--ink-300)' : 'var(--text-muted)',
      borderBottom: '2px solid ' + (l.value === active ? 'var(--brand-indigo-500)' : 'transparent'),
      paddingBottom: 2
    }
  }, l.label))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onLang && onLang(lang === 'FR' ? 'EN' : 'FR'),
    style: {
      border: 0,
      background: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-data)',
      fontSize: 'var(--text-xs)',
      color: inverse ? 'var(--ink-300)' : 'var(--text-muted)',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, lang === 'FR' ? 'FR / en' : 'fr / EN'), action ? action : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: inverse ? 'primary' : 'secondary'
  }, "Me contacter"));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: '1px solid var(--border-subtle)',
      ...(rest.style || {})
    }
  }), items.map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(it.value),
      style: {
        border: 0,
        background: 'none',
        cursor: 'pointer',
        font: 'inherit',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-semibold)',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        padding: '0 0 var(--space-3)',
        marginBottom: -1,
        borderBottom: '2px solid ' + (active ? 'var(--brand-indigo-600)' : 'transparent'),
        transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
      }
    }, it.label, it.count != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-data)',
        color: 'var(--text-faint)',
        marginLeft: 6
      }
    }, it.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/repertoire/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SiteHeader,
  Button,
  Icon,
  Input,
  Tag,
  ProjectCard,
  StatBlock,
  EmptyState,
  Logo,
  MapFrame,
  Badge
} = window.WebsigDesignSystem_aebc7a;
function Hero({
  onExplore
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--ink-900)',
      color: 'var(--white)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: .22
    }
  }, /*#__PURE__*/React.createElement(MapFrame, {
    center: [4.6, 11.5],
    zoom: 7,
    basemap: "dark",
    height: "100%",
    radius: "0",
    style: {
      border: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, var(--ink-900) 28%, rgba(20,18,31,.35))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '88px var(--space-8) 96px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow",
    style: {
      color: 'var(--brand-indigo-300)'
    }
  }, "R\xE9pertoire de projets \xB7 Cameroun"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-3xl)',
      color: 'var(--white)',
      maxWidth: 720,
      margin: '18px 0 20px',
      lineHeight: 1.05
    }
  }, "Applications WebSIG et cartes rapides, h\xE9berg\xE9es au m\xEAme endroit."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--ink-300)',
      maxWidth: 560,
      marginBottom: 'var(--space-8)'
    }
  }, "Chaque projet vit sur son propre sous-domaine. Les WebSIG portent leur identit\xE9 ; les webmaps suivent ce syst\xE8me par d\xE9faut."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onExplore,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 17
    })
  }, "Explorer les projets"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    style: {
      color: 'var(--white)'
    },
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 17
    })
  }, "Me contacter")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      marginTop: 'var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "14",
    label: "Projets publi\xE9s",
    tone: "var(--white)"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "6",
    label: "Sous-domaines actifs",
    tone: "var(--white)"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "42,7",
    unit: "km\xB2",
    label: "Emprise cartographi\xE9e",
    tone: "var(--white)"
  }))));
}
function Directory({
  onOpen
}) {
  const all = window.WS_DATA.projects;
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('tous');
  const filters = [['tous', 'Tous'], ['websig', 'WebSIG'], ['webmap', 'Webmaps']];
  const rows = all.filter(p => (filter === 'tous' || p.kind === filter) && (p.title + p.summary + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: 'var(--space-16) var(--space-8) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-8)',
      marginBottom: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow"
  }, "Le r\xE9pertoire"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 8
    }
  }, "Tous les projets")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, filters.map(([v, l]) => /*#__PURE__*/React.createElement(Tag, {
    key: v,
    active: filter === v,
    onClick: () => setFilter(v)
  }, l)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Rechercher\u2026",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16,
      color: "var(--text-faint)"
    })
  })))), rows.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6)'
    }
  }, rows.map(p => /*#__PURE__*/React.createElement(ProjectCard, _extends({
    key: p.id
  }, p, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen(p.id);
    }
  })))) : /*#__PURE__*/React.createElement(EmptyState, {
    title: "Aucun projet ne correspond",
    description: "\xC9largis les filtres ou efface la recherche.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => {
        setQ('');
        setFilter('tous');
      }
    }, "R\xE9initialiser")
  }));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--ink-300)',
      padding: 'var(--space-12) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    size: 26,
    color: "var(--white)",
    wordColor: "var(--white)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      maxWidth: 340,
      marginTop: 'var(--space-4)'
    }
  }, "R\xE9pertoire personnel de projets de cartographie web. Donn\xE9es ouvertes, fonds OpenStreetMap.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-16)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow",
    style: {
      color: 'var(--ink-500)'
    }
  }, "Projets"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ink-300)'
    }
  }, "WebSIG"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ink-300)'
    }
  }, "Webmaps")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow",
    style: {
      color: 'var(--ink-500)'
    }
  }, "Contact"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ink-300)'
    }
  }, "Courriel"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ink-300)'
    }
  }, "GitHub")))));
}
Object.assign(window, {
  Hero,
  Directory,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/repertoire/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/repertoire/ProjectDetail.jsx
try { (() => {
const {
  Button,
  Icon,
  Badge,
  Tabs,
  Card,
  StatBlock,
  DataTable,
  MapFrame,
  LayerPanel,
  Legend,
  ScaleBar,
  IconButton,
  Dialog,
  Tooltip
} = window.WebsigDesignSystem_aebc7a;
function ProjectDetail({
  id,
  onBack
}) {
  const p = window.WS_DATA.projects.find(x => x.id === id) || window.WS_DATA.projects[0];
  const [tab, setTab] = React.useState('apercu');
  const [dl, setDl] = React.useState(false);
  const [layers, setLayers] = React.useState([{
    id: 'p',
    label: 'Parcelles',
    color: 'var(--layer-polygon)',
    visible: true
  }, {
    id: 'h',
    label: 'Réseau hydrographique',
    color: 'var(--layer-line)',
    visible: true
  }, {
    id: 'e',
    label: 'Équipements publics',
    color: 'var(--layer-point)',
    visible: false
  }, {
    id: 'o',
    label: 'Orthophoto 2024',
    color: 'var(--layer-raster)',
    visible: false
  }]);
  const toggle = lid => setLayers(l => l.map(x => x.id === lid ? {
    ...x,
    visible: !x.visible
  } : x));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-8) var(--space-24)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 0,
      background: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text-muted)',
      fontSize: 'var(--text-sm)',
      padding: 0,
      marginBottom: 'var(--space-6)',
      font: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 15
  }), " Tous les projets"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-8)',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.kind === 'webmap' ? 'hydro' : 'brand',
    dot: true
  }, p.kind === 'webmap' ? 'Webmap' : 'WebSIG'), /*#__PURE__*/React.createElement(Badge, {
    tone: p.status === 'Archivé' ? 'relief' : 'terrain'
  }, p.status), /*#__PURE__*/React.createElement(Badge, {
    mono: true
  }, "EPSG:32632")), /*#__PURE__*/React.createElement("h1", null, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--text-muted)',
      marginTop: 'var(--space-3)'
    }
  }, p.summary)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Partager la vue"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Partager"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 16
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 16
    }),
    onClick: () => setDl(true)
  }, "Donn\xE9es"), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "external-link",
      size: 16
    }),
    as: "a",
    href: "#"
  }, "Ouvrir l'application"))), /*#__PURE__*/React.createElement(MapFrame, {
    center: p.center,
    zoom: p.zoom,
    basemap: "light",
    height: 440
  }, /*#__PURE__*/React.createElement(LayerPanel, {
    layers: layers,
    onToggle: toggle,
    style: {
      position: 'absolute',
      top: 16,
      right: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom avant",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom arri\xE8re",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Recentrer",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "locate-fixed",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Mesurer",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ruler",
    size: 16
  }))), /*#__PURE__*/React.createElement(Legend, {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 60
    },
    title: "L\xE9gende",
    items: layers.filter(l => l.visible).map(l => ({
      label: l.label,
      color: l.color,
      shape: l.id === 'h' ? 'line' : l.id === 'e' ? 'point' : 'polygon'
    }))
  }), /*#__PURE__*/React.createElement(ScaleBar, {
    label: "500 m",
    style: {
      position: 'absolute',
      left: 16,
      bottom: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'apercu',
      label: 'Aperçu'
    }, {
      value: 'donnees',
      label: 'Jeux de données',
      count: 4
    }, {
      value: 'methode',
      label: 'Méthode'
    }]
  })), tab === 'apercu' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--reading-max)'
    }
  }, /*#__PURE__*/React.createElement("p", null, "Le projet couvre ", p.tags.join(', ').toLowerCase(), ". Les donn\xE9es ont \xE9t\xE9 collect\xE9es sur le terrain puis consolid\xE9es dans PostGIS, avant publication sous forme de tuiles vectorielles."), /*#__PURE__*/React.createElement("p", null, "L'interface publique reste volontairement sobre : la carte occupe l'essentiel de l'\xE9cran, les panneaux flottants restent translucides pour ne jamais masquer le territoire.")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow"
  }, "Fiche technique"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "1 284",
    unit: "entit\xE9s",
    label: "Volume de donn\xE9es"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "42,7",
    unit: "km\xB2",
    label: "Emprise"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: p.year,
    label: "Ann\xE9e de publication",
    tone: "var(--text-brand)"
  })))) : tab === 'donnees' ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: 'nom',
      label: 'Jeu de données',
      strong: true
    }, {
      key: 'type',
      label: 'Géométrie'
    }, {
      key: 'n',
      label: 'Entités',
      mono: true,
      align: 'right'
    }, {
      key: 'maj',
      label: 'Mise à jour',
      mono: true,
      align: 'right'
    }],
    rows: [{
      nom: 'Parcelles cadastrales',
      type: 'Polygone',
      n: '1 284',
      maj: '2025-04'
    }, {
      nom: 'Réseau hydrographique',
      type: 'Ligne',
      n: '312',
      maj: '2024-11'
    }, {
      nom: 'Équipements publics',
      type: 'Point',
      n: '87',
      maj: '2025-01'
    }, {
      nom: 'Orthophoto 2024',
      type: 'Raster',
      n: '—',
      maj: '2024-08'
    }]
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      maxWidth: 'var(--reading-max)'
    }
  }, /*#__PURE__*/React.createElement("p", null, "Relev\xE9 GNSS diff\xE9rentiel, contr\xF4le qualit\xE9 par \xE9chantillonnage, puis rattachement au syst\xE8me national. Le d\xE9tail m\xE9thodologique est disponible sur demande.")), /*#__PURE__*/React.createElement(Dialog, {
    open: dl,
    onClose: () => setDl(false),
    title: "T\xE9l\xE9charger les donn\xE9es",
    description: "Choisis un format. Les donn\xE9es sont publi\xE9es sous licence ouverte.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setDl(false)
    }, "Annuler"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setDl(false)
    }, "T\xE9l\xE9charger"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, ['GeoJSON — 4,2 Mo', 'Shapefile (zip) — 6,8 Mo', 'GeoPackage — 5,1 Mo'].map((f, i) => /*#__PURE__*/React.createElement("label", {
    key: f,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-sm)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "fmt",
    defaultChecked: i === 0
  }), " ", f)))));
}
Object.assign(window, {
  ProjectDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/repertoire/ProjectDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/repertoire/data.js
try { (() => {
window.WS_DATA = {
  projects: [{
    id: 'cadastre-douala',
    kind: 'websig',
    title: 'Cadastre participatif — Douala V',
    summary: "Application SIG complète de relevé parcellaire, avec saisie terrain et validation en ligne.",
    tags: ['Cadastre', 'Foncier', 'Douala'],
    year: '2025',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2158/2001.png',
    center: [4.0511, 9.7679],
    zoom: 13,
    status: 'En ligne'
  }, {
    id: 'ordre-geometres',
    kind: 'webmap',
    title: "Membres de l'Ordre des géomètres",
    summary: "Annuaire cartographié des géomètres agréés du Cameroun, filtrable par région et par année d'agrément.",
    tags: ['Annuaire', 'Cameroun', 'Ordre'],
    year: '2026',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/6/33/31.png',
    center: [5.6, 12.4],
    zoom: 6,
    status: 'En ligne'
  }, {
    id: 'hydro-wouri',
    kind: 'websig',
    title: 'Bassin versant du Wouri',
    summary: "Suivi hydrologique et modélisation des zones inondables sur l'estuaire du Wouri.",
    tags: ['Hydrologie', 'Risques'],
    year: '2024',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/11/1079/1000.png',
    center: [4.2, 9.6],
    zoom: 11,
    status: 'En ligne'
  }, {
    id: 'plu-yaounde',
    kind: 'webmap',
    title: "Plan d'occupation — Yaoundé VI",
    summary: "Carte rapide publiée pour accompagner une étude d'urbanisme communale.",
    tags: ['Urbanisme', 'Yaoundé'],
    year: '2025',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2178/2004.png',
    center: [3.848, 11.502],
    zoom: 13,
    status: 'Archivé'
  }, {
    id: 'reseau-ecoles',
    kind: 'webmap',
    title: 'Accessibilité des écoles — Région du Centre',
    summary: "Isochrones piétonnes autour des établissements primaires publics.",
    tags: ['Éducation', 'Accessibilité'],
    year: '2024',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/9/272/250.png',
    center: [4.2, 11.9],
    zoom: 9,
    status: 'En ligne'
  }, {
    id: 'ortho-limbe',
    kind: 'websig',
    title: 'Orthophotographie littorale — Limbé',
    summary: "Visualiseur d'orthophotos drone avec comparateur temporel avant/après.",
    tags: ['Drone', 'Littoral'],
    year: '2023',
    thumb: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/12/2148/2007.png',
    center: [4.02, 9.2],
    zoom: 12,
    status: 'En ligne'
  }],
  members: [{
    nom: 'Ariane Ngono',
    mat: 'GE-0412',
    ville: 'Yaoundé',
    region: 'Centre',
    an: '2014',
    coord: [3.868, 11.521]
  }, {
    nom: 'Paul Etoundi',
    mat: 'GE-0877',
    ville: 'Douala',
    region: 'Littoral',
    an: '2019',
    coord: [4.051, 9.768]
  }, {
    nom: 'Marthe Fotso',
    mat: 'GE-1102',
    ville: 'Bafoussam',
    region: 'Ouest',
    an: '2021',
    coord: [5.477, 10.417]
  }, {
    nom: 'Serge Mbarga',
    mat: 'GE-0233',
    ville: 'Garoua',
    region: 'Nord',
    an: '2009',
    coord: [9.301, 13.395]
  }, {
    nom: 'Clarisse Abena',
    mat: 'GE-1290',
    ville: 'Bertoua',
    region: 'Est',
    an: '2022',
    coord: [4.577, 13.685]
  }, {
    nom: 'Jean-Luc Njoya',
    mat: 'GE-0651',
    ville: 'Bamenda',
    region: 'Nord-Ouest',
    an: '2016',
    coord: [5.959, 10.146]
  }, {
    nom: 'Estelle Kouam',
    mat: 'GE-1044',
    ville: 'Douala',
    region: 'Littoral',
    an: '2020',
    coord: [4.075, 9.712]
  }, {
    nom: 'Hervé Tchoumi',
    mat: 'GE-0489',
    ville: 'Kribi',
    region: 'Sud',
    an: '2015',
    coord: [2.937, 9.910]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/repertoire/data.js", error: String((e && e.message) || e) }); }

// ui_kits/webmap-annuaire/AnnuaireMap.jsx
try { (() => {
const {
  SiteHeader,
  MapFrame,
  LayerPanel,
  Legend,
  ScaleBar,
  FeaturePopup,
  IconButton,
  Icon,
  Input,
  Select,
  Tag,
  DataTable,
  Badge,
  Button,
  StatBlock,
  Tabs,
  EmptyState,
  Switch
} = window.WebsigDesignSystem_aebc7a;
function AnnuaireApp() {
  const members = window.WS_DATA.members;
  const [q, setQ] = React.useState('');
  const [region, setRegion] = React.useState('Toutes');
  const [sel, setSel] = React.useState(1);
  const [tab, setTab] = React.useState('liste');
  const [labels, setLabels] = React.useState(true);
  const [lang, setLang] = React.useState('FR');
  const [layers, setLayers] = React.useState([{
    id: 'm',
    label: 'Géomètres agréés',
    color: 'var(--layer-point)',
    visible: true
  }, {
    id: 'r',
    label: 'Limites régionales',
    color: 'var(--layer-line)',
    visible: true
  }, {
    id: 'd',
    label: 'Densité par région',
    color: 'var(--layer-polygon)',
    visible: false
  }]);
  const toggle = id => setLayers(l => l.map(x => x.id === id ? {
    ...x,
    visible: !x.visible
  } : x));
  const regions = ['Toutes', ...Array.from(new Set(members.map(m => m.region)))];
  const rows = members.filter(m => (region === 'Toutes' || m.region === region) && (m.nom + m.ville + m.mat).toLowerCase().includes(q.toLowerCase()));
  const current = rows[sel] || rows[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    inverse: true,
    lang: lang,
    onLang: setLang,
    links: [{
      value: 'carte',
      label: 'Carte'
    }, {
      value: 'methodo',
      label: 'Méthodologie'
    }],
    active: "carte",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 15
      })
    }, "CSV")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-w) 1fr',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow"
  }, "Webmap \xB7 2026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-lg)',
      margin: '6px 0 4px'
    }
  }, "Membres de l'Ordre"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "G\xE9om\xE8tres-experts agr\xE9\xE9s du Cameroun, par r\xE9gion d'exercice."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: members.length,
    label: "Membres"
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: regions.length - 1,
    label: "R\xE9gions",
    tone: "var(--text-brand)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setSel(0);
    },
    placeholder: "Nom, ville, matricule\u2026",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16,
      color: "var(--text-faint)"
    })
  }), /*#__PURE__*/React.createElement(Select, {
    value: region,
    onChange: e => {
      setRegion(e.target.value);
      setSel(0);
    },
    label: "R\xE9gion",
    options: regions
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: labels,
    onChange: setLabels,
    label: "\xC9tiquettes sur la carte"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      minHeight: 0
    }
  }, rows.length ? rows.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m.mat,
    onClick: () => setSel(i),
    style: {
      width: '100%',
      textAlign: 'left',
      border: 0,
      borderBottom: '1px solid var(--ink-100)',
      cursor: 'pointer',
      background: i === sel ? 'var(--surface-brand-soft)' : 'transparent',
      padding: 'var(--space-4) var(--space-5)',
      font: 'inherit',
      borderLeft: '3px solid ' + (i === sel ? 'var(--brand-indigo-600)' : 'transparent')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-strong)',
      fontSize: 'var(--text-sm)'
    }
  }, m.nom), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-data)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, m.mat)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, m.ville, " \xB7 ", m.region, " \xB7 agr\xE9\xE9 ", m.an))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "search-x",
    title: "Aucun membre",
    description: "Modifie la recherche ou choisis une autre r\xE9gion."
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      position: 'relative',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(MapFrame, {
    center: current ? current.coord : [5.6, 12.4],
    zoom: current ? 11 : 6,
    basemap: "light",
    height: "100%",
    radius: "0",
    style: {
      border: 0,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(LayerPanel, {
    layers: layers,
    onToggle: toggle,
    style: {
      position: 'absolute',
      top: 16,
      right: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom avant",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Zoom arri\xE8re",
    variant: "chrome"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Vue nationale",
    variant: "chrome",
    onClick: () => setSel(-1)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16
  }))), current ? /*#__PURE__*/React.createElement(FeaturePopup, {
    style: {
      position: 'absolute',
      left: '50%',
      top: 84,
      transform: 'translateX(-50%)'
    },
    title: current.nom,
    subtitle: current.ville + ' · ' + current.region,
    onClose: () => setSel(-1),
    rows: [{
      label: 'Matricule',
      value: current.mat
    }, {
      label: 'Agréé en',
      value: current.an
    }, {
      label: 'Coordonnées',
      value: current.coord[0].toFixed(3) + ', ' + current.coord[1].toFixed(3)
    }]
  }) : null, /*#__PURE__*/React.createElement(Legend, {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 62
    },
    title: "L\xE9gende",
    items: [{
      label: 'Géomètre agréé',
      color: 'var(--layer-point)',
      shape: 'point',
      value: rows.length
    }, {
      label: 'Limite régionale',
      color: 'var(--layer-line)',
      shape: 'line'
    }]
  }), /*#__PURE__*/React.createElement(ScaleBar, {
    label: "20 km",
    style: {
      position: 'absolute',
      left: 16,
      bottom: 14
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 232,
      background: 'var(--surface-card)',
      padding: 'var(--space-4) var(--space-6)',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'liste',
      label: 'Table attributaire',
      count: rows.length
    }, {
      value: 'source',
      label: 'Source'
    }],
    style: {
      marginBottom: 'var(--space-4)'
    }
  }), tab === 'liste' ? /*#__PURE__*/React.createElement(DataTable, {
    selectedIndex: sel,
    onRowClick: (r, i) => setSel(i),
    columns: [{
      key: 'nom',
      label: 'Nom',
      strong: true
    }, {
      key: 'mat',
      label: 'Matricule',
      mono: true
    }, {
      key: 'ville',
      label: 'Ville'
    }, {
      key: 'region',
      label: 'Région'
    }, {
      key: 'an',
      label: 'Agréé',
      mono: true,
      align: 'right'
    }],
    rows: rows
  }) : /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--reading-max)'
    }
  }, "Donn\xE9es de d\xE9monstration. Fond de carte \xA9 OpenStreetMap. Cette carte suit le syst\xE8me par d\xE9faut websig \u2014 c'est le gabarit de toutes les cartes rapides.")))));
}
Object.assign(window, {
  AnnuaireApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/webmap-annuaire/AnnuaireMap.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.FeaturePopup = __ds_scope.FeaturePopup;

__ds_ns.LayerPanel = __ds_scope.LayerPanel;

__ds_ns.Legend = __ds_scope.Legend;

__ds_ns.MapFrame = __ds_scope.MapFrame;

__ds_ns.ScaleBar = __ds_scope.ScaleBar;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
