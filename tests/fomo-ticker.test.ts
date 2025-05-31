import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const fomoTickerScript = readFileSync(resolve('./assets/fomo-ticker.js'), 'utf-8')
eval(fomoTickerScript)

describe('FomoTicker Custom Element', () => {
  let ticker: HTMLElement

  beforeEach(() => {
    ticker = document.createElement('fomo-ticker')
    document.body.appendChild(ticker)
  })

  afterEach(() => {
    if (ticker && ticker.parentNode) {
      ticker.parentNode.removeChild(ticker)
    }
  })

  describe('Element Creation and Initialization', () => {
    it('should create fomo-ticker element', () => {
      expect(ticker).toBeDefined()
      expect(ticker.tagName.toLowerCase()).toBe('fomo-ticker')
    })

    it('should render required DOM structure when connected', async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const content = ticker.querySelector('.fomo-ticker__content')
      const loading = ticker.querySelector('.fomo-ticker__loading')
      const error = ticker.querySelector('.fomo-ticker__error')
      
      expect(content).toBeDefined()
      expect(loading).toBeDefined()
      expect(error).toBeDefined()
    })
  })

  describe('Styling and Configuration', () => {
    it('should apply default styles when no data attributes provided', async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(ticker.style.backgroundColor).toBe('rgb(255, 107, 53)') // #ff6b35
      expect(ticker.style.borderColor).toBe('rgb(229, 90, 43)') // #e55a2b
      expect(ticker.style.height).toBe('48px')
      expect(ticker.style.color).toBe('rgb(255, 255, 255)') // #ffffff
      expect(ticker.style.fontSize).toBe('14px')
    })

    it('should apply custom styles from data attributes', async () => {
      ticker.setAttribute('data-text-color', '#000000')
      ticker.setAttribute('data-background-color', '#00ff00')
      ticker.setAttribute('data-border-color', '#0000ff')
      ticker.setAttribute('data-text-size', '16px')
      ticker.setAttribute('data-height', '60px')
      
      ;(ticker as any).applyStyles()
      
      expect(ticker.style.color).toBe('rgb(0, 0, 0)')
      expect(ticker.style.backgroundColor).toBe('rgb(0, 255, 0)')
      expect(ticker.style.borderColor).toBe('rgb(0, 0, 255)')
      expect(ticker.style.fontSize).toBe('16px')
      expect(ticker.style.height).toBe('60px')
    })

    it('should set animation duration based on speed setting', async () => {
      ticker.setAttribute('data-speed', '80')
      ;(ticker as any).applyStyles()
      
      const content = ticker.querySelector('.fomo-ticker__content') as HTMLElement
      expect(content?.style.animationDuration).toBe('20s') // 100 - 80 = 20
    })

    it('should enforce minimum animation duration', async () => {
      ticker.setAttribute('data-speed', '95')
      ;(ticker as any).applyStyles()
      
      const content = ticker.querySelector('.fomo-ticker__content') as HTMLElement
      expect(content?.style.animationDuration).toBe('10s') // Math.max(10, 100 - 95)
    })
  })

  describe('Positioning', () => {
    it('should apply header positioning by default', () => {
      expect(ticker.getAttribute('data-position')).toBe(null)
    })

    it('should apply footer positioning when specified', () => {
      ticker.setAttribute('data-position', 'footer')
      expect(ticker.getAttribute('data-position')).toBe('footer')
    })
  })

  describe('Notification Loading and Display', () => {
    it('should start in loading state', async () => {
      const newTicker = document.createElement('fomo-ticker')
      document.body.appendChild(newTicker)
      
      ;(newTicker as any).setState('loading')
      expect(newTicker.getAttribute('data-state')).toBe('loading')
      
      newTicker.remove()
    })

    it('should display mock notifications after loading', async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(ticker.getAttribute('data-state')).toBe('loaded')
      
      const content = ticker.querySelector('.fomo-ticker__content')
      expect(content?.textContent).toContain('Sarah from New York')
      expect(content?.textContent).toContain('Limited time: 30% off')
      expect(content?.textContent).toContain('Mike from California')
      expect(content?.textContent).toContain('Free shipping')
    })

    it('should duplicate notifications for continuous scroll', async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const content = ticker.querySelector('.fomo-ticker__content')
      const text = content?.textContent || ''
      
      const firstOccurrence = text.indexOf('Sarah from New York')
      const secondOccurrence = text.indexOf('Sarah from New York', firstOccurrence + 1)
      
      expect(firstOccurrence).toBeGreaterThan(-1)
      expect(secondOccurrence).toBeGreaterThan(-1)
    })
  })

  describe('State Management', () => {
    it('should handle loading state correctly', () => {
      ;(ticker as any).setState('loading')
      expect(ticker.getAttribute('data-state')).toBe('loading')
    })

    it('should handle error state correctly', () => {
      ;(ticker as any).setState('error')
      expect(ticker.getAttribute('data-state')).toBe('error')
    })

    it('should handle loaded state correctly', () => {
      ;(ticker as any).setState('loaded')
      expect(ticker.getAttribute('data-state')).toBe('loaded')
    })
  })

  describe('Lifecycle Management', () => {
    it('should start refresh interval when connected', async () => {
      const spy = vi.spyOn(window, 'setInterval')
      
      const newTicker = document.createElement('fomo-ticker')
      document.body.appendChild(newTicker)
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(spy).toHaveBeenCalledWith(expect.any(Function), 30000)
      
      spy.mockRestore()
      newTicker.remove()
    })

    it('should clear refresh interval when disconnected', async () => {
      const spy = vi.spyOn(window, 'clearInterval')
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      ticker.remove()
      
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      
      const script = `
        class TestFomoTicker extends HTMLElement {
          constructor() {
            super();
            this.notifications = [];
          }
          
          connectedCallback() {
            this.render();
            this.fetchNotifications();
          }
          
          render() {
            this.innerHTML = \`
              <div class="fomo-ticker__content"></div>
              <div class="fomo-ticker__loading">Loading notifications...</div>
              <div class="fomo-ticker__error">Failed to load notifications</div>
            \`;
          }
          
          async fetchNotifications() {
            this.setState('loading');
            try {
              const response = await fetch('/api/notifications');
              const data = await response.json();
              this.notifications = data.notifications;
              this.setState('loaded');
            } catch (error) {
              this.setState('error');
            }
          }
          
          setState(state) {
            this.dataset.state = state;
          }
        }
        customElements.define('test-fomo-ticker', TestFomoTicker);
      `;
      eval(script);
      
      const newTicker = document.createElement('test-fomo-ticker')
      document.body.appendChild(newTicker)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(newTicker.getAttribute('data-state')).toBe('error')
      
      global.fetch = originalFetch
      newTicker.remove()
    })
  })
})
