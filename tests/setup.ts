import { beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  document.body.innerHTML = ''
  
  if (window.customElements && window.customElements.get('fomo-ticker')) {
  }
})

afterEach(() => {
  document.body.innerHTML = ''
})
