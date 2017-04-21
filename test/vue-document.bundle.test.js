const tap = require('tap')

const VueDocument = require('../umd/vue-document.bundle')
const {titleInjector, metaInjector} = VueDocument

tap.equal(typeof titleInjector, 'function')
tap.equal(typeof metaInjector, 'function')
