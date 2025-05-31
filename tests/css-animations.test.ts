import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('CSS Animations and Styling', () => {
  let styleSheet: CSSStyleSheet
  let ticker: HTMLElement

  beforeEach(async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const cssContent = readFileSync(resolve('./assets/fomo-ticker.css'), 'utf-8')
    
    const style = document.createElement('style')
    style.textContent = cssContent
    document.head.appendChild(style)
    
    ticker = document.createElement('fomo-ticker')
    ticker.setAttribute('data-position', 'header')
    document.body.appendChild(ticker)
  })

  afterEach(() => {
    document.head.querySelectorAll('style').forEach(style => style.remove())
    if (ticker && ticker.parentNode) {
      ticker.parentNode.removeChild(ticker)
    }
  })

  describe('Positioning Styles', () => {
    it('should apply fixed positioning to fomo-ticker', () => {
      const computedStyle = window.getComputedStyle(ticker)
      expect(computedStyle.position).toBe('fixed')
      expect(computedStyle.left).toBe('0px')
      expect(computedStyle.right).toBe('0px')
      expect(computedStyle.zIndex).toBe('1000')
    })

    it('should position header ticker at top', () => {
      ticker.setAttribute('data-position', 'header')
      const computedStyle = window.getComputedStyle(ticker)
      expect(computedStyle.top).toBe('0px')
    })

    it('should position footer ticker at bottom', () => {
      ticker.setAttribute('data-position', 'footer')
      const computedStyle = window.getComputedStyle(ticker)
      expect(computedStyle.bottom).toBe('0px')
    })
  })

  describe('Animation Styles', () => {
    it('should apply marquee animation to content', () => {
      const content = document.createElement('div')
      content.className = 'fomo-ticker__content'
      ticker.appendChild(content)
      
      document.body.offsetHeight
      
      const computedStyle = window.getComputedStyle(content)
      expect(content.className).toContain('fomo-ticker__content')
      
      const styleSheets = Array.from(document.styleSheets)
      const hasMarqueeRule = styleSheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || [])
          return rules.some(rule => 
            rule.cssText && rule.cssText.includes('marquee')
          )
        } catch (e) {
          return false
        }
      })
      expect(hasMarqueeRule).toBe(true)
    })

    it('should hide content in loading state', () => {
      ticker.setAttribute('data-state', 'loading')
      const content = document.createElement('div')
      content.className = 'fomo-ticker__content'
      ticker.appendChild(content)
      
      const computedStyle = window.getComputedStyle(content)
      expect(computedStyle.display).toBe('none')
    })

    it('should show loading indicator in loading state', () => {
      ticker.setAttribute('data-state', 'loading')
      const loading = document.createElement('div')
      loading.className = 'fomo-ticker__loading'
      ticker.appendChild(loading)
      
      const computedStyle = window.getComputedStyle(loading)
      expect(computedStyle.display).toBe('flex')
    })

    it('should show error message in error state', () => {
      ticker.setAttribute('data-state', 'error')
      const error = document.createElement('div')
      error.className = 'fomo-ticker__error'
      ticker.appendChild(error)
      
      const computedStyle = window.getComputedStyle(error)
      expect(computedStyle.display).toBe('flex')
    })
  })

  describe('Responsive Design', () => {
    it('should apply overflow hidden for scrolling effect', () => {
      const computedStyle = window.getComputedStyle(ticker)
      expect(computedStyle.overflow).toBe('hidden')
    })

    it('should apply border styles', () => {
      const computedStyle = window.getComputedStyle(ticker)
      expect(computedStyle.borderTopWidth).toBe('1px')
      expect(computedStyle.borderBottomWidth).toBe('1px')
      expect(computedStyle.borderTopStyle).toBe('solid')
      expect(computedStyle.borderBottomStyle).toBe('solid')
    })
  })
})
