/**
 * A document manager for Vue.js.
 *
 * @param Vue
 * @param [o] {object}
 * @param [o.key] {string} name of the component property that is expected to
 *   contain document metadata ('document' by default).
 * @param [o.injector] {(metadata, document) => void|Array<(metadata, document) => void>}
 *   executed whenever there is a change in document metadata
 *
 * @example
 * <pre>
 * Vue.use(VueDocument, {
 *   injector(document) {
 *     const metadata = this.$root.$document
 *     document.title = metadata.head.title
 *   }
 * })
 * new Vue({
 *   document: {head: {title: 'Custom Title'}},
 *   ...
 * })
 * </pre>
 *
 * On server-side metadata can be accessed through `vm.$document` (there is
 * also convenience method `vm.$documentForceUpdate` which can be used to
 * inject metadata into arbitrary
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document">Document</a>
 * instance).
 */
export default function VueDocument (Vue, o) {
  o || (o = {})
  var key = o.key || 'document'
  var injector = (
    Array.isArray(o.injector)
      ? (function (injector) {
        return function (document) {
          injector.forEach(
              function (fn) { fn.call(this, document) }.bind(this)
            )
        }
      })(o.injector)
      : o.injector
  ) || function () {}
  var prop = '$$' + key
  // aggregates document metadata under "this" ("this" including)
  function eval$document () {
    return (function f (r, c) {
      return r.concat(c[prop] ? c[prop] : [])
        .concat(c.$children.reduce(f, []))
    })([], this.$root)
      // merge nested objects/arrays
      .reduce(function merge (l, r) {
        return Object.keys(r).reduce(function (_, k) {
          var v = r[k]
          _[k] = v != null
            ? (
              Array.isArray(v)
                ? [].concat(_[k] || []).concat(v)
                : typeof v === 'object' ? merge(_[k] || {}, v) : v
            )
            : v
          return _
        }, l)
      }, {})
  }
  // used to avoid needless component graph traversals
  var cache = '$document$cache'
  Object.defineProperty(Vue.prototype, '$document', {
    get: function () {
      if (this.$root === this) {
        this[cache] === undefined && (this[cache] = eval$document.call(this))
        return this[cache]
      }
      return eval$document.call(this)
    }
  })
  Vue.prototype.$documentForceUpdate = function (document) {
    injector.call(this, document || window.document)
  }
  Vue.mixin({
    beforeCreate: function () {
      var $o = this.$options
      // if 'document' value is a function, promote it to computed property
      if (typeof $o[key] === 'function') {
        ($o.computed || ($o.computed = {}))[prop] = $o[key]
      }
    },
    created: function () {
      var $o = this.$options
      if ($o[key]) {
        if (this[prop]) {
          this.$isServer ||
          this.$watch(prop, function () {
            this.$root[cache] = undefined
            injector.call(this, window.document)
          })
        } else {
          this[prop] = $o[key]
        }
      }
    },
    // not called on server-side
    beforeMount: function () {
      if (this[prop]) {
        this.$root[cache] = undefined
        injector.call(this, window.document)
      }
    },
    // not called on server-side
    destroyed: function () {
      if (this[prop]) {
        this.$root[cache] = undefined
        injector.call(this, window.document)
      }
    }
  })
}
