# Fomo Notification Ticker - Shopify Theme App Extension

A customizable notification ticker for Shopify stores that displays real-time social proof notifications from Fomo.com. This project converts a React prototype into a fully functional Shopify Theme App Extension.

## What This App Does

This Shopify extension creates a scrolling notification ticker that displays social proof messages (like "Sarah from New York just purchased...") to increase customer confidence and drive conversions. The ticker can be positioned below the header or above the footer and is fully customizable through Shopify's theme editor.

## Development Approach

### Conversion Strategy
This project started as a React prototype and was converted to a Shopify Theme App Extension using the following approach:

1. **React to Vanilla JavaScript**: Converted React components to custom web elements using the `customElements` API
2. **Theme Integration**: Replaced React state management with Shopify's Liquid templating and schema system
3. **CSS Animations**: Maintained the same visual effects using pure CSS keyframe animations
4. **API Integration**: Adapted React's fetch logic to work within Shopify's extension architecture

### Architecture
- **App Embed Extension**: Uses `"target": "body"` for fixed positioning across all theme pages
- **Custom Web Component**: `<fomo-ticker>` element with lifecycle management
- **Liquid Schema**: Provides theme editor customization options
- **Modular Assets**: Separate CSS and JavaScript files for maintainability

## Features

- **Customizable Design**: Adjust colors, text size, and height through Shopify's theme editor
- **Flexible Positioning**: Place the ticker below the header or above the footer
- **Real-time Updates**: Displays notifications with automatic 30-second refresh
- **Smooth Animations**: Marquee-style scrolling with adjustable speed
- **Mobile Responsive**: Works seamlessly across all device sizes
- **Error Handling**: Graceful fallbacks for API failures

## Shopify Theme Editor Settings

The extension exposes 8 customizable settings in the Shopify theme editor:

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| **Enable Ticker** | Checkbox | Show/hide the ticker | `true` |
| **Text Color** | Color Picker | Color of notification text | `#ffffff` |
| **Background Color** | Color Picker | Ticker background color | `#ff6b35` |
| **Border Color** | Color Picker | Top/bottom border color | `#e55a2b` |
| **Text Size** | Text Input | Font size (e.g., "14px") | `14px` |
| **Height** | Text Input | Ticker height (e.g., "48px") | `48px` |
| **Animation Speed** | Number Slider | Speed from 1-100 | `50` |
| **Position** | Select Dropdown | "Below Header" or "Above Footer" | `header` |

## Fomo.com Integration

### Current Implementation (Mock Data)
The extension currently uses mock notifications for demonstration:

```javascript
// In assets/fomo-ticker.js
const mockNotifications = [
  {
    id: '1',
    message: '🎉 Sarah from New York just purchased the Premium Bundle!',
    timestamp: new Date().toISOString()
  },
  // ... more mock data
];
```

### Production API Integration
To connect with Fomo.com's API, replace the mock data section in `assets/fomo-ticker.js`:

```javascript
// Replace this section in fetchNotifications():
try {
  // TODO: Replace with actual Fomo.com API endpoint
  const response = await fetch('/apps/fomo/notifications', {
    headers: {
      'Authorization': 'Bearer YOUR_FOMO_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  this.notifications = data.notifications;
  // ...
}
```

### Required Configuration
1. **Fomo.com Account**: Set up your Fomo account and obtain API credentials
2. **API Endpoint**: Configure the correct Fomo API endpoint URL
3. **Authentication**: Add your Fomo API key to the request headers
4. **Data Mapping**: Ensure the API response matches the expected notification format

## Developer Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Shopify CLI 3.0+
- Shopify Partner account
- Access to a Shopify development store

### Step 1: Clone and Install
```bash
git clone https://github.com/hindsricardo/fomoticker-shopify-extension-test.git
cd fomoticker-shopify-extension-test
npm install
```

### Step 2: Shopify App Setup
```bash
# Install Shopify CLI if not already installed
npm install -g @shopify/cli @shopify/theme

# Create a new Shopify app (if needed)
shopify app create

# Or connect to existing app
shopify app connect
```

### Step 3: Configure Extension
1. Copy the extension files to your Shopify app's `extensions/` directory:
   ```bash
   mkdir -p extensions/fomo-ticker
   cp -r blocks/ assets/ .shopify-cli.yml extensions/fomo-ticker/
   ```

2. Update `extensions/fomo-ticker/.shopify-cli.yml`:
   ```yaml
   project_type: theme_app_extension
   organization_id: YOUR_ORG_ID
   ```

### Step 4: Deploy Extension
```bash
# Deploy to development store
shopify app deploy

# Or push to specific store
shopify app push --store=your-dev-store.myshopify.com
```

### Step 5: Install in Theme
1. Go to your Shopify admin → Online Store → Themes
2. Click "Customize" on your active theme
3. In the theme editor, look for "App embeds" in the left sidebar
4. Enable "Fomo Notification Ticker"
5. Configure the settings as desired
6. Save your changes

### Step 6: Configure Fomo Integration (Production)
1. Sign up for Fomo.com and get your API credentials
2. Update `assets/fomo-ticker.js` with your actual API endpoint
3. Add authentication headers with your Fomo API key
4. Test the integration and deploy updates

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview built app

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI interface

# Code Quality
npm run lint         # Check code quality
```

## Testing

Comprehensive test suite with **38 automated tests** covering:

- **Custom Element Tests** (17 tests): Element creation, styling, positioning, notification loading, state management, lifecycle, and error handling
- **CSS Animation Tests** (9 tests): Positioning styles, marquee animations, loading states, and responsive design  
- **Liquid Schema Tests** (12 tests): Template structure, schema validation, setting types, and Shopify compliance

Run the full test suite:
```bash
npm run test:run
```

## File Structure

```
├── blocks/
│   └── fomo-ticker-embed.liquid    # Main Liquid template with schema
├── assets/
│   ├── fomo-ticker.css             # Styling and animations
│   └── fomo-ticker.js              # Custom web component logic
├── tests/
│   ├── fomo-ticker.test.ts         # Custom element tests
│   ├── css-animations.test.ts      # CSS and animation tests
│   ├── liquid-schema.test.ts       # Liquid template tests
│   └── setup.ts                    # Test configuration
├── src/                            # Original React prototype (reference)
├── vitest.config.ts                # Test framework configuration
└── .shopify-cli.yml                # Shopify CLI configuration
```

## Troubleshooting

### Extension Not Appearing
- Ensure the extension is deployed: `shopify app deploy`
- Check that it's enabled in Theme Editor → App embeds
- Verify the `.shopify-cli.yml` configuration

### Styling Issues
- Check browser console for CSS errors
- Verify the `fomo-ticker.css` file is loading
- Test with different themes for compatibility

### API Integration Issues
- Check browser network tab for failed requests
- Verify Fomo.com API credentials and endpoints
- Review console logs for JavaScript errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm run test`
4. Submit a pull request

## License

MIT License - see LICENSE file for details
