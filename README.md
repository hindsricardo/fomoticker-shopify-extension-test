# Fomo Notification Ticker - Shopify Theme App Extension

A Shopify Theme App Extension that displays customizable notification tickers from Fomo.com on your storefront.

## Features

- **Customizable Notification Ticker**: Scrolling notifications with smooth animations
- **Flexible Positioning**: Place below header or above footer
- **Full Styling Control**: Customize colors, text size, height, and animation speed
- **Fomo.com Integration**: Ready for live notification feeds
- **Theme Editor Integration**: All settings accessible through Shopify's theme customizer

## Installation

### Prerequisites
- Shopify CLI installed
- Access to a Shopify development store
- Partner account for app development

### Setup Steps

1. **Clone the repository**:
```bash
git clone <repository-url>
cd fomoticker-shopify-extension-test
```

2. **Install Shopify CLI** (if not already installed):
```bash
npm install -g @shopify/cli @shopify/theme
```

3. **Connect to your Shopify app**:
```bash
shopify app generate extension --type=theme_app_extension
```

4. **Deploy the extension**:
```bash
shopify app deploy
```

## File Structure

```
├── blocks/
│   └── fomo-ticker-embed.liquid    # Main extension template
├── assets/
│   ├── fomo-ticker.css             # Styling and animations
│   └── fomo-ticker.js              # Custom element logic
└── .shopify-cli.yml                # Shopify CLI configuration
```

## Extension Components

### Liquid Template (`blocks/fomo-ticker-embed.liquid`)
- Uses `"target": "body"` for fixed positioning
- Conditional rendering based on enabled setting
- Passes all customization data to the custom element

### CSS (`assets/fomo-ticker.css`)
- Fixed positioning for header/footer placement
- Smooth marquee animations
- Loading and error states
- Responsive design

### JavaScript (`assets/fomo-ticker.js`)
- Custom element implementation (`<fomo-ticker>`)
- Fomo.com API integration (currently mock data)
- Automatic refresh every 30 seconds
- Dynamic styling based on theme settings

## Customization Options

All settings are available in the Shopify theme editor:

- **Enable/Disable**: Toggle ticker visibility
- **Text Color**: Notification text color
- **Background Color**: Ticker background color
- **Border Color**: Top and bottom border color
- **Text Size**: Font size (e.g., "14px", "16px")
- **Bar Height**: Ticker height (e.g., "48px", "60px")
- **Animation Speed**: Scroll speed (1-100, higher = faster)
- **Position**: "Below Header" or "Above Footer"

## Fomo.com Integration

### Current Implementation
The extension currently uses mock notification data for demonstration purposes.

### Production Setup
To connect with actual Fomo.com API:

1. **Update the API endpoint** in `assets/fomo-ticker.js`:
```javascript
// Replace the mock data section with:
const response = await fetch('/apps/fomo/notifications');
const data = await response.json();
this.notifications = data.notifications;
```

2. **Configure API credentials** in your Shopify app backend
3. **Set up webhook endpoints** for real-time notification updates

### Expected Data Format
```javascript
{
  "notifications": [
    {
      "id": "unique-id",
      "message": "🎉 Customer just purchased Product Name!",
      "timestamp": "2025-05-31T20:46:06Z"
    }
  ]
}
```

## Development

### Testing Locally
1. Use Shopify CLI development tools:
```bash
shopify app dev
```

2. Preview in your development store
3. Test all customization options in the theme editor

### Customizing Animations
Modify the CSS in `assets/fomo-ticker.css`:
- Adjust `@keyframes marquee` for different scroll effects
- Change `animation-duration` calculation in JavaScript
- Add new animation types as needed

### Adding New Settings
1. Add setting to the schema in `fomo-ticker-embed.liquid`
2. Update the custom element to read the new data attribute
3. Apply the setting in the `applyStyles()` method

## Browser Support
- Modern browsers with Custom Elements support
- Graceful degradation for older browsers
- Mobile responsive design

## Troubleshooting

### Ticker Not Appearing
- Check that the extension is enabled in theme settings
- Verify the position setting matches your theme layout
- Ensure no CSS conflicts with z-index

### API Integration Issues
- Check browser console for JavaScript errors
- Verify API endpoint accessibility
- Test with mock data first

### Styling Problems
- Use browser dev tools to inspect CSS
- Check for theme CSS conflicts
- Verify custom property values are valid

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in a development store
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
