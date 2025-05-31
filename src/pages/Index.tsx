
import React, { useState } from 'react';
import NotificationTicker from '@/components/NotificationTicker';
import TickerCustomizer from '@/components/TickerCustomizer';

interface TickerSettings {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  textSize: string;
  height: string;
  speed: number;
  position: 'header' | 'footer';
}

const Index = () => {
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>({
    textColor: '#ffffff',
    backgroundColor: '#ff6b35',
    borderColor: '#e55a2b',
    textSize: '14px',
    height: '48px',
    speed: 5,
    position: 'header'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Your Store</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Notification Ticker - Header Position */}
      {tickerSettings.position === 'header' && (
        <NotificationTicker
          textColor={tickerSettings.textColor}
          backgroundColor={tickerSettings.backgroundColor}
          borderColor={tickerSettings.borderColor}
          textSize={tickerSettings.textSize}
          height={tickerSettings.height}
          speed={tickerSettings.speed}
          position={tickerSettings.position}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shopify Notification Ticker Demo
              </h2>
              <p className="text-gray-600 mb-6">
                This is a prototype of a notification ticker component that can be used as a reference 
                for creating a Shopify App Block. The ticker displays notifications from services like 
                Fomo.com and can be positioned below the header or above the footer.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customizable text color, background color, and border color</li>
                  <li>• Adjustable text size and bar height</li>
                  <li>• Variable animation speed</li>
                  <li>• Positioning options (header/footer)</li>
                  <li>• Integration-ready for Fomo.com API</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">For Shopify Implementation:</h4>
                <p className="text-sm text-blue-800">
                  To convert this to a Shopify App Extension, you'll need to use the Shopify CLI, 
                  create a theme app extension, and adapt this React component to work within 
                  Shopify's extension framework with Liquid templating.
                </p>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <TickerCustomizer
              settings={tickerSettings}
              onSettingsChange={setTickerSettings}
            />
          </div>
        </div>
      </main>

      {/* Notification Ticker - Footer Position */}
      {tickerSettings.position === 'footer' && (
        <NotificationTicker
          textColor={tickerSettings.textColor}
          backgroundColor={tickerSettings.backgroundColor}
          borderColor={tickerSettings.borderColor}
          textSize={tickerSettings.textSize}
          height={tickerSettings.height}
          speed={tickerSettings.speed}
          position={tickerSettings.position}
        />
      )}

      {/* Mock Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Your Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
