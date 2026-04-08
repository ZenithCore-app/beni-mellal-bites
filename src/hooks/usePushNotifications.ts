import { useState, useEffect, useCallback } from 'react';
import { pushManager, PushSubscriptionData, NotificationData } from '@/lib/push-notifications';
import { useAuth } from '@/context/AuthContext';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<PushSubscriptionData | null>;
  unsubscribe: () => Promise<boolean>;
  sendNotification: (data: NotificationData) => Promise<void>;
  requestPermissionAndSubscribe: () => Promise<PushSubscriptionData | null>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Check browser support and initialize
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
      } catch (err) {
        console.warn('Push notifications initialization failed:', err);
        setIsSupported(false);
        setError('Push notifications not available');
      } finally {
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // Update subscription status
  useEffect(() => {
    if (!initialized) return;
    
    try {
      const subscribed = pushManager.isSubscribed();
      setIsSubscribed(subscribed);
    } catch (err) {
      console.warn('Failed to check subscription status:', err);
    }
  }, [initialized]);

  // Listen for permission changes
  useEffect(() => {
    if (!isSupported) return;
    
    // Note: permissionchange event is not widely supported
    // We'll check permission status periodically instead
    const interval = setInterval(() => {
      setPermission(Notification.permission);
    }, 5000);

    return () => clearInterval(interval);
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const granted = await pushManager.requestPermission();
      setPermission(Notification.permission);
      return granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<PushSubscriptionData | null> => {
    if (!isSupported) {
      setError('Push notifications not supported in this browser');
      return null;
    }

    if (!user) {
      setError('User must be authenticated to subscribe');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subscription = await pushManager.subscribe();
      setIsSubscribed(true);
      
      // Store subscription data if needed (could be sent to backend)
      if (subscription) {
        console.log('User subscribed to push notifications:', subscription);
      }
      
      return subscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await pushManager.unsubscribe();
      setIsSubscribed(false);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendNotification = useCallback(async (data: NotificationData): Promise<void> => {
    if (!isSupported) {
      // Silently fail for unsupported browsers
      console.warn('Push notifications not supported, skipping notification');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await pushManager.sendLocalNotification(data);
    } catch (err) {
      // Don't set error for notification failures, just log
      console.warn('Failed to send notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const requestPermissionAndSubscribe = useCallback(async (): Promise<PushSubscriptionData | null> => {
    const granted = await requestPermission();
    if (granted) {
      return await subscribe();
    }
    return null;
  }, [requestPermission, subscribe]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification,
    requestPermissionAndSubscribe
  };
};
