class FomoTicker extends HTMLElement {
  constructor() {
    super();
    this.notifications = [];
    this.isLoading = false;
    this.refreshInterval = null;
    this.hoverStylesAdded = false;
  }

  connectedCallback() {
    this.render();
    this.applyStyles();
    this.applyPositioning();
    this.fetchNotifications();
    this.startRefreshInterval();
    this.addHoverListeners();
  }

  disconnectedCallback() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.removeHoverListeners();
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
    const textSize = parseInt(this.dataset.textSize) || 14;
    const height = this.dataset.height || '48px';
    const speed = parseInt(this.dataset.speed) || 50;
    const fontFamily = this.dataset.fontFamily || 'inherit';
    const showImages = this.dataset.showImages !== 'false'; // Default to true
    const showSeparator = this.dataset.showSeparator !== 'false'; // Default to true
    const borderRadius = this.dataset.borderRadius || '6px';
    const imageScale = parseFloat(this.dataset.imageScale) || 1.0; // Default to 1.0 (no scaling)
    const gapScale = parseFloat(this.dataset.gapScale) || 1.0; // Default to 1.0 (no scaling)
    const maxItemWidth = this.dataset.maxItemWidth || ''; // Default to empty (auto width)

    // Calculate proportional sizes based on font size
    const baseImageSize = Math.round(textSize * 2); // Base images are 2x the font size
    const imageSize = Math.round(baseImageSize * imageScale); // Apply user scaling
    const contentGap = Math.round(textSize * 1 * gapScale); // Gap is 1x the font size, scaled by gapScale
    const linkGap = Math.round(textSize * 0.6 * gapScale); // Gap between image and text is 0.6x font size, scaled by gapScale

    this.style.backgroundColor = backgroundColor;
    this.style.borderColor = borderColor;
    this.style.height = height;
    this.style.color = textColor;
    this.style.fontSize = textSize + 'px';
    // Use custom font family if provided, otherwise inherit from parent website
    this.style.fontFamily = fontFamily;

    // Set CSS custom properties for dynamic sizing
    this.style.setProperty('--fomo-image-size', imageSize + 'px');
    this.style.setProperty('--fomo-content-gap', contentGap + 'px');
    this.style.setProperty('--fomo-link-gap', linkGap + 'px');
    this.style.setProperty('--fomo-border-radius', borderRadius);
    this.style.setProperty('--fomo-show-images', showImages ? 'inline-flex' : 'none');
    this.style.setProperty('--fomo-show-separator', showSeparator ? 'inline' : 'none');
    this.style.setProperty('--fomo-max-item-width', maxItemWidth || 'none');

    const content = this.querySelector('.fomo-ticker__content');
    if (content) {
      const duration = Math.max(10, 100 - speed);
      content.style.animationDuration = `${duration}s`;
      
      // Add CSS for hover pause functionality
      if (!this.hoverStylesAdded) {
        const style = document.createElement('style');
        style.textContent = `
          fomo-ticker .fomo-ticker__content {
            animation-play-state: running;
          }
          fomo-ticker:hover .fomo-ticker__content {
            animation-play-state: paused;
          }
        `;
        document.head.appendChild(style);
        this.hoverStylesAdded = true;
      }
    }

    // Apply text color to all links
    const links = this.querySelectorAll('.fomo-ticker__link');
    links.forEach(link => {
      link.style.color = textColor;
    });
  }

  applyPositioning() {
    const positionType = this.dataset.position || 'static'; // 'static' or 'fixed'
    const fixedPosition = this.dataset.fixedPosition || 'bottom'; // 'top', 'bottom'
    const horizontalAlign = this.dataset.horizontalAlign || 'center'; // 'left', 'center', 'right', 'full'
    const zIndex = this.dataset.zIndex || '1000';
    const margin = this.dataset.margin || '0';
    const sticky = this.dataset.sticky || 'none'; // 'none', 'top', 'bottom'

    if (positionType === 'fixed') {
      this.style.position = 'fixed';
      this.style.zIndex = zIndex;
      
      // Vertical positioning
      if (fixedPosition === 'top') {
        this.style.top = margin;
        this.style.bottom = 'auto';
      } else {
        this.style.bottom = margin;
        this.style.top = 'auto';
      }
      
      // Horizontal positioning - always full width within constraints
      switch (horizontalAlign) {
        case 'left':
          this.style.left = margin;
          this.style.right = 'auto';
          this.style.transform = 'none';
          this.style.width = `calc(100vw - ${margin} - ${margin})`;
          break;
        case 'right':
          this.style.right = margin;
          this.style.left = 'auto';
          this.style.transform = 'none';
          this.style.width = `calc(100vw - ${margin} - ${margin})`;
          break;
        case 'full':
          this.style.left = margin;
          this.style.right = margin;
          this.style.width = 'auto';
          this.style.transform = 'none';
          break;
        case 'center':
        default:
          this.style.left = margin;
          this.style.right = margin;
          this.style.width = 'auto';
          this.style.transform = 'none';
          break;
      }
      
      // Add shadow for better visibility when floating
      this.style.boxShadow = this.dataset.boxShadow || '0 2px 10px rgba(0,0,0,0.1)';
      
    } else {
      // Static positioning (regular div) - always full width
      if (sticky !== 'none') {
        // Apply sticky positioning
        this.style.position = 'sticky';
        this.style.zIndex = zIndex;
        
        if (sticky === 'top') {
          this.style.top = '0';
          this.style.bottom = 'auto';
        } else if (sticky === 'bottom') {
          this.style.bottom = '0';
          this.style.top = 'auto';
        }
        
        // Add shadow for better visibility when sticky
        this.style.boxShadow = this.dataset.boxShadow || '0 2px 10px rgba(0,0,0,0.1)';
      } else {
        // Regular static positioning
        this.style.position = 'static';
        this.style.zIndex = 'auto';
        this.style.boxShadow = 'none';
      }
      
      this.style.left = 'auto';
      this.style.right = 'auto';
      this.style.transform = 'none';
      this.style.width = '100%';
      
      // Apply margin for static positioning
      if (margin !== '0') {
        this.style.margin = margin;
      } else {
        this.style.margin = '0';
      }
    }
  }

  async fetchNotifications() {
    this.setState('loading');
    
    try {
      const mockNotifications = [
        {
          id: '1',
          message: 'Sarah from New York just purchased the Premium Bundle!',
          url: '/products/premium-bundle',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center',
          timestamp: new Date().toISOString()
        },
        {
          id: '2', 
          message: 'Limited time: 30% off all products - ends in 2 hours!',
          url: '/collections/sale',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&crop=center',
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          message: 'Mike from California just purchased Wireless Headphones!',
          url: '/collections/trending',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center',
          timestamp: new Date().toISOString()
        },
        {
          id: '4',
          message: 'Emma from Texas just bought the Fitness Tracker!',
          url: '/pages/shipping-info',
          image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=80&h=80&fit=crop&crop=center',
          timestamp: new Date().toISOString()
        },
        {
          id: '5',
          message: 'Alex from Florida just purchased Smart Phone Case!',
          url: '/collections/accessories',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&crop=center',
          timestamp: new Date().toISOString()
        },
        {
          id: '6',
          message: 'Lisa from Oregon just bought Premium Smartwatch!',
          url: '/collections/electronics',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=center',
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
      // Create clickable links for each notification with images
      const notificationLinks = this.notifications.map(n => {
        const imageHtml = n.image ? `<img src="${n.image}" alt="Product" class="fomo-ticker__image">` : '';
        return `<a href="${n.url}" class="fomo-ticker__link">${imageHtml}<span class="fomo-ticker__text">${n.message}</span></a>`;
      });
      
      // Use configurable separator
      const showSeparator = this.dataset.showSeparator !== 'false'; // Default to true
      const separator = showSeparator ? ' <span class="fomo-ticker__separator">•</span> ' : ' ';
      const tickerHTML = notificationLinks.join(separator);
      content.innerHTML = `${tickerHTML}${separator}${tickerHTML}`;
      
      // Apply styles to newly created links
      this.applyStyles();
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

  addHoverListeners() {
    this.addEventListener('mouseenter', this.pauseAnimation.bind(this));
    this.addEventListener('mouseleave', this.resumeAnimation.bind(this));
  }

  removeHoverListeners() {
    this.removeEventListener('mouseenter', this.pauseAnimation.bind(this));
    this.removeEventListener('mouseleave', this.resumeAnimation.bind(this));
  }

  pauseAnimation() {
    const content = this.querySelector('.fomo-ticker__content');
    if (content) {
      content.style.animationPlayState = 'paused';
    }
  }

  resumeAnimation() {
    const content = this.querySelector('.fomo-ticker__content');
    if (content) {
      content.style.animationPlayState = 'running';
    }
  }
}

customElements.define('fomo-ticker', FomoTicker);
