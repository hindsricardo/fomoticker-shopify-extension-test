class FomoTicker extends HTMLElement {
  constructor() {
    super();
    this.notifications = [];
    this.isLoading = false;
    this.refreshInterval = null;
  }

  connectedCallback() {
    this.render();
    this.applyStyles();
    this.fetchNotifications();
    this.startRefreshInterval();
  }

  disconnectedCallback() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  render() {
    this.innerHTML = `
      <div class="fomo-ticker__content"></div>
      <div class="fomo-ticker__loading">Loading notifications...</div>
      <div class="fomo-ticker__error">Failed to load notifications</div>
    `;
  }

  applyStyles() {
    const textColor = this.dataset.textColor || '#ffffff';
    const backgroundColor = this.dataset.backgroundColor || '#ff6b35';
    const borderColor = this.dataset.borderColor || '#e55a2b';
    const textSize = this.dataset.textSize || '14px';
    const height = this.dataset.height || '48px';
    const speed = parseInt(this.dataset.speed) || 50;

    this.style.backgroundColor = backgroundColor;
    this.style.borderColor = borderColor;
    this.style.height = height;
    this.style.color = textColor;
    this.style.fontSize = textSize;

    const content = this.querySelector('.fomo-ticker__content');
    if (content) {
      const duration = Math.max(10, 100 - speed);
      content.style.animationDuration = `${duration}s`;
    }
  }

  async fetchNotifications() {
    this.setState('loading');
    
    try {
      const mockNotifications = [
        {
          id: '1',
          message: '🎉 Sarah from New York just purchased the Premium Bundle!',
          timestamp: new Date().toISOString()
        },
        {
          id: '2', 
          message: '⚡ Limited time: 30% off all products - ends in 2 hours!',
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          message: '🔥 Mike from California just joined 847 others who bought today!',
          timestamp: new Date().toISOString()
        },
        {
          id: '4',
          message: '💫 Free shipping on orders over $50 - No code needed!',
          timestamp: new Date().toISOString()
        }
      ];

      this.notifications = mockNotifications;
      this.updateContent();
      this.setState('loaded');
    } catch (error) {
      console.error('Failed to fetch Fomo notifications:', error);
      this.setState('error');
    }
  }

  updateContent() {
    const content = this.querySelector('.fomo-ticker__content');
    if (content && this.notifications.length > 0) {
      const messages = this.notifications.map(n => n.message);
      const tickerText = messages.join(' • ');
      content.textContent = `${tickerText} • ${tickerText}`;
    }
  }

  setState(state) {
    this.dataset.state = state;
  }

  startRefreshInterval() {
    this.refreshInterval = setInterval(() => {
      this.fetchNotifications();
    }, 30000);
  }
}

customElements.define('fomo-ticker', FomoTicker);
