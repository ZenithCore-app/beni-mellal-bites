import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PushPermissionPromptProps {
  showPrompt?: boolean;
  onPromptComplete?: (granted: boolean) => void;
  className?: string;
}

export const PushPermissionPrompt: React.FC<PushPermissionPromptProps> = ({
  showPrompt = false,
  onPromptComplete,
  className = ''
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenPrompted, setHasBeenPrompted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize push notifications
  useEffect(() => {
    const initialize = async () => {
      try {
        const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
        setIsSupported(supported);
        
        if (supported) {
          setPermission(Notification.permission);
          
          // Check if already subscribed
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
          }
        }
      } catch (error) {
        console.warn('Push notifications initialization failed:', error);
        setIsSupported(false);
      } finally {
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // Check if we should show the prompt
  useEffect(() => {
    if (!initialized) return;
    
    const shouldShow = showPrompt && 
                     isSupported && 
                     permission === 'default' && 
                     !isSubscribed && 
                     !hasBeenPrompted &&
                     !isLoading;

    setIsVisible(shouldShow);
  }, [showPrompt, isSupported, permission, isSubscribed, hasBeenPrompted, isLoading, initialized]);

  const requestPermissionAndSubscribe = async (): Promise<any> => {
    if (!isSupported) {
      console.warn('Push notifications not supported');
      return null;
    }

    setIsLoading(true);

    try {
      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        return null;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key not found');
        return null;
      }

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource
      });

      setIsSubscribed(true);
      return subscription.toJSON();
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper method to convert base64 to Uint8Array for VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleAllow = async () => {
    const subscription = await requestPermissionAndSubscribe();
    const granted = !!subscription;
    setHasBeenPrompted(true);
    setIsVisible(false);
    onPromptComplete?.(granted);
  };

  const handleDismiss = () => {
    setHasBeenPrompted(true);
    setIsVisible(false);
    onPromptComplete?.(false);
  };

  if (!initialized || !isSupported) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 ${className}`}
        >
          <div className="glass-card p-4 border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">
                  Stay Updated with Your Orders
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get real-time notifications about your order status, group order invitations, and delivery updates.
                </p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAllow}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enabling...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Bell className="w-3 h-3" />
                        Enable Notifications
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <span className="flex items-center gap-2">
                      <BellOff className="w-3 h-3" />
                      Not Now
                    </span>
                  </Button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to trigger permission prompt at strategic moments
export const usePushPermissionPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const showPermissionPrompt = () => {
    setShowPrompt(true);
  };

  const hidePermissionPrompt = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    showPermissionPrompt,
    hidePermissionPrompt
  };
};
