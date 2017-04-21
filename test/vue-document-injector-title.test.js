const tap = require('tap')

const updateTitle = require('../umd/vue-document-injector-title')
const injector = (metadata, document) =>
  updateTitle.call({$root: {$document: metadata}}, document)

const domino = require('domino')
const dom = domino.createDOMImplementation()
const document = dom.createHTMLDocument()

injector({
  head: {
    title: 'custom title'
  }
}, document)
injector({}, document) // should not fail
injector({head: {}}, document) // should not fail

tap.equal(
  document.innerHTML,
  '<!DOCTYPE html>' +
  '<html><head><title>custom title</title></head><body></body></html>'
)
