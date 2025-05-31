
import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

interface NotificationTickerProps {
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textSize?: string;
  height?: string;
  speed?: number;
  position?: 'header' | 'footer';
}

const NotificationTicker: React.FC<NotificationTickerProps> = ({
  textColor = '#ffffff',
  backgroundColor = '#ff6b35',
  borderColor = '#e55a2b',
  textSize = '14px',
  height = '48px',
  speed = 5,
  position = 'header'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching notifications from Fomo.com API
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // This would be your actual Fomo.com API call
        // For demo purposes, using mock data
        const mockNotifications: Notification[] = [
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
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading || notifications.length === 0) {
    return null;
  }

  const tickerContent = notifications.map(notification => notification.message).join(' • ');

  return (
    <div 
      className="relative overflow-hidden border-t border-b"
      style={{
        backgroundColor,
        borderColor,
        height,
        borderTopWidth: '1px',
        borderBottomWidth: '1px'
      }}
    >
      <div className="flex items-center h-full">
        <div 
          className="whitespace-nowrap animate-marquee"
          style={{
            color: textColor,
            fontSize: textSize,
            fontWeight: '500',
            animationDuration: `${tickerContent.length / speed}s`
          }}
        >
          {tickerContent} • {tickerContent}
        </div>
      </div>
    </div>
  );
};

export default NotificationTicker;
