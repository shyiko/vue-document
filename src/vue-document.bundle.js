/**
 * NOTE: This script is not intended to be used in ES2015+ env. It's sole purpose
 * is to act as an entrypoint for rollup when generating UMD bundle.
 */
import VueDocument from './vue-document'
import titleInjector from './vue-document-injector-title'
import metaInjector from './vue-document-injector-meta'

VueDocument.titleInjector = titleInjector
VueDocument.metaInjector = metaInjector

export default VueDocument
