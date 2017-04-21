const tap = require('tap')

const updateMeta = require('../umd/vue-document-injector-meta')
const injector = (metadata, document) =>
  updateMeta.call({$root: {$document: metadata}}, document)

const domino = require('domino')
const dom = domino.createDOMImplementation()
const createDocument = () =>
  Object.assign(dom.createHTMLDocument(), {title: ''})
const appendMeta = (document, name, content) => {
  const el = document.createElement('meta')
  el.name = 'description'
  el.content = 'initial description'
  document.head.appendChild(el)
}

tap.test('empty meta', (expect) => {
  const document = createDocument()
  appendMeta(document, 'description', 'initial description')

  injector({}, document)
  injector({head: {}}, document)
  injector({head: {meta: []}}, document)

  expect.equal(
    document.innerHTML,
    '<!DOCTYPE html>' +
    '<html><head><title></title>' +
    '<meta name="description" content="initial description">' +
    '</head><body></body></html>'
  )
  expect.end()
})

tap.test('meta injection', (expect) => {
  const document = createDocument()

  injector({
    head: {
      meta: [
        {charset: 'utf-8'},
        {name: 'description', content: 'custom description'}
      ]
    }
  }, document)

  expect.equal(
    document.innerHTML,
    '<!DOCTYPE html>' +
    '<html><head><title></title>' +
    '<meta charset="utf-8">' +
    '<meta name="description" content="custom description">' +
    '</head><body></body></html>'
  )
  expect.end()
})

tap.test('meta override', (expect) => {
  const document = createDocument()
  appendMeta(document, 'description', 'initial description')

  injector({
    head: {
      meta: [
        {name: 'description', content: 'custom description'}
      ]
    }
  }, document)

  expect.equal(
    document.innerHTML,
    '<!DOCTYPE html>' +
    '<html><head><title></title>' +
    '<meta name="description" content="custom description">' +
    '</head><body></body></html>'
  )
  expect.end()
})
