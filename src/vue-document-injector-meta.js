var metaKeys = ['name', 'http-equiv', 'charset', 'itemprop']

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta injector.
 *
 * @param document https://developer.mozilla.org/en-US/docs/Web/API/Document reference
 *
 * @example
 * <pre>
 * new Vue({
 *   document: {
 *     head: {
 *       meta: [
 *        {charset: 'utf-8'},
 *        {name: 'description', content: 'custom description'}
 *       ]
 *     }
 *   },
 *   ...
 * })
 * </pre>
 */
export default function (document) {
  var metadata = this.$root.$document
  var meta = metadata.head && metadata.head.meta
  if (meta != null && Array.isArray(meta)) {
    meta.forEach(function (m) {
      var key
      if (metaKeys.some(function (k) { key = k; return m[k] })) {
        var el = document.querySelector('meta[' + key + '="' + m[key] + '"]')
        var append = !el
        if (append) { el = document.createElement('meta') }
        Object.keys(m).forEach(function (key) { el.setAttribute(key, m[key]) })
        if (append) { document.head.appendChild(el) }
      }
    })
  }
}
