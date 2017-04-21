/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title injector.
 *
 * @param document https://developer.mozilla.org/en-US/docs/Web/API/Document reference
 *
 * @example
 * <pre>
 * new Vue({
 *   document: {
 *     head: {
 *       title: 'custom title'
 *     }
 *   },
 *   ...
 * })
 * </pre>
 */
export default function (document) {
  var metadata = this.$root.$document
  var title = metadata.head && metadata.head.title
  title != null && (document.title = title)
}
