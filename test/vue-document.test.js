const tap = require('tap')
tap.plan(1)

const Vue = require('vue')
const VueDocument = require('../umd/vue-document')

global.window = require('domino')
  .createWindow('<!doctype html><title>*</title>')

Vue.use(VueDocument)

const vm = new Vue({
  document: {
    base: 'http://example.com',
    title: 'parent title',
    link: [
      {rel: 'canonical', href: 'http://example.com'}
    ],
    html: {
      lang: 'en'
    }
  },
  components: {
    child: {
      document () {
        return {
          title: 'child title #' + this.count,
          description: 'child description',
          link: [
            {rel: 'apple-touch-icon', href: 'http://example.com/icon.png'}
          ],
          html: {
            amp: true
          }
        }
      },
      render (h) {
        return h('p', this.count)
      },
      data () {
        return {count: 0}
      }
    }
  },
  render: function (h) {
    return h('div', [
      h('child')
    ])
  }
})

const renderer = require('vue-server-renderer').createRenderer()
renderer.renderToString(vm, (err) => {
  if (err) {
    throw err
  }
  tap.deepEqual(vm.$document, {
    base: 'http://example.com',
    title: 'child title #0',
    link: [{rel: 'canonical', href: 'http://example.com'},
      {rel: 'apple-touch-icon', href: 'http://example.com/icon.png'}],
    html: {lang: 'en', amp: true},
    description: 'child description'
  })
})
