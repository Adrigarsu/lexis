/*
 * Minimal runtime for the exported Lexis screens.
 * Renders the <template id="dc-template"> with the component class in
 * <script type="text/x-dc">, so each screen keeps its interactions
 * (open sheets, toggle options) when opened in a browser.
 * Supports what the screens use: {{ path }} bindings, <sc-if>, <sc-for>,
 * on* event handlers and boolean attributes.
 */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }

    setState(patch) {
      this.state = Object.assign({}, this.state, typeof patch === 'function' ? patch(this.state) : patch);
      render();
    }

    renderVals() {
      return {};
    }
  }

  const BOOLEAN_ATTRS = new Set(['checked', 'disabled', 'hidden', 'selected', 'open']);
  const EXPR = /\{\{\s*([^}]+?)\s*\}\}/g;
  let component;
  let template;
  let root;

  function evaluate(expr, scope) {
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    return expr.split('.').reduce((value, key) => (value == null ? undefined : value[key]), scope);
  }

  function interpolate(text, scope) {
    return text.replace(EXPR, (_, expr) => {
      const value = evaluate(expr, scope);
      return value == null ? '' : String(value);
    });
  }

  function single(text) {
    const match = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/.exec(text);
    return match ? match[1] : null;
  }

  function processChildren(source, target, scope) {
    source.childNodes.forEach((node) => processNode(node, target, scope));
  }

  function processNode(node, target, scope) {
    if (node.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(interpolate(node.textContent, scope)));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.localName;
    if (tag === 'sc-if') {
      if (evaluate(single(node.getAttribute('value')) || 'false', scope)) {
        processChildren(node, target, scope);
      }
      return;
    }
    if (tag === 'sc-for') {
      const list = evaluate(single(node.getAttribute('list')) || '', scope) || [];
      const name = node.getAttribute('as') || 'item';
      list.forEach((item, index) => {
        processChildren(node, target, Object.assign(Object.create(scope), { [name]: item, index }));
      });
      return;
    }
    const element = node.namespaceURI === 'http://www.w3.org/1999/xhtml'
      ? document.createElement(tag)
      : document.createElementNS(node.namespaceURI, node.tagName);
    for (const attr of Array.from(node.attributes)) {
      const expr = single(attr.value);
      const name = attr.name;
      if (name.startsWith('hint-')) continue;
      if (expr && name.startsWith('on')) {
        const handler = evaluate(expr, scope);
        if (typeof handler === 'function') {
          const event = name.slice(2).toLowerCase();
          element.addEventListener(event === 'change' ? 'change' : event, handler);
        }
        continue;
      }
      if (expr && BOOLEAN_ATTRS.has(name)) {
        const value = evaluate(expr, scope);
        if (value && value !== 'false') element.setAttribute(name, '');
        continue;
      }
      element.setAttribute(name, interpolate(attr.value, scope));
      if (name === 'value' && 'value' in element) element.value = element.getAttribute('value');
    }
    processChildren(node.content || node, element, scope);
    target.appendChild(element);
  }

  function render() {
    const scope = component.renderVals();
    const fragment = document.createDocumentFragment();
    processChildren(template.content, fragment, scope);
    root.replaceChildren(fragment);
  }

  function mount() {
    template = document.getElementById('dc-template');
    root = document.getElementById('dc-root');
    const script = document.querySelector('script[type="text/x-dc"]');
    const schema = JSON.parse(script.dataset.props || '{}');
    const props = {};
    Object.keys(schema).forEach((key) => {
      if (schema[key] && 'default' in schema[key]) props[key] = schema[key].default;
    });
    const params = new URLSearchParams(location.search);
    params.forEach((value, key) => { props[key] = value; });
    const Component = new Function('DCLogic', `${script.textContent}\nreturn Component;`)(DCLogic);
    component = new Component(props);
    render();
  }

  document.addEventListener('DOMContentLoaded', mount);
})();
