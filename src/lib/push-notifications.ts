export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationData {
  title: string;
  body: string;
  type: 'order_status' | 'group_order' | 'courier_assignment' | 'general';
  orderId?: string;
  actionUrl?: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class PushNotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Get existing subscription
        this.subscription = await this.registration.pushManager.getSubscription();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Push notifications not supported');
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async subscribe(): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return null;
    }

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return null;
    }

    try {
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key not found');
        return null;
      }

      // Convert VAPID key to Uint8Array
      const applicationServerKey = this.urlBase64ToUint8Array(vapidPublicKey);

      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      return this.subscription.toJSON() as PushSubscriptionData;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  async sendLocalNotification(data: NotificationData): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('No notification permission');
      return;
    }

    // Send notification through service worker
    await this.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        orderId: data.orderId,
        notificationType: data.type,
        actionUrl: data.actionUrl
      },
      actions: data.actions || []
    });
  }

  // Helper method to convert base64 to Uint8Array for VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Create singleton instance
export const pushManager = new PushNotificationManager();

// Notification templates for different types
export const notificationTemplates = {
  orderPlaced: (orderId: string): NotificationData => ({
    title: 'Order Placed!',
    body: 'Your order has been received and is being processed.',
    type: 'order_status',
    orderId,
    actionUrl: `/order-status/${orderId}`
  }),

  orderConfirmed: (orderId: string): NotificationData => ({
    title: 'Order Confirmed',
    body: 'Your order has been confirmed by the restaurant.',
    type: 'order_status',
    orderId,
    actionUrl: `/order-status/${orderId}`
  }),

  orderPreparing: (orderId: string): NotificationData => ({
    title: 'Order Preparing',
    body: 'Your order is now being prepared with fresh ingredients.',
    type: 'order_status',
    orderId,
    actionUrl: `/order-status/${orderId}`
  }),

  orderReady: (orderId: string): NotificationData => ({
    title: 'Order Ready!',
    body: 'Your order is ready for pickup or delivery.',
    type: 'order_status',
    orderId,
    actionUrl: `/order-status/${orderId}`
  }),

  orderDelivered: (orderId: string): NotificationData => ({
    title: 'Order Delivered',
    body: 'Enjoy your meal! Your order has been delivered.',
    type: 'order_status',
    orderId,
    actionUrl: `/order-status/${orderId}`
  }),

  groupOrderInvite: (sessionCode: string, hostName: string): NotificationData => ({
    title: 'Group Order Invitation',
    body: `${hostName} invited you to join a group order!`,
    type: 'group_order',
    actionUrl: `/group-order?session=${sessionCode}`
  }),

  groupOrderUpdate: (sessionCode: string, itemName: string): NotificationData => ({
    title: 'Group Order Updated',
    body: `Someone added ${itemName} to the group order.`,
    type: 'group_order',
    actionUrl: `/group-order?session=${sessionCode}`
  }),

  courierNewOrder: (orderId: string, customerName: string): NotificationData => ({
    title: 'New Order Available',
    body: `${customerName} placed a new order nearby.`,
    type: 'courier_assignment',
    orderId,
    actionUrl: `/courier`
  }),

  courierOrderAssigned: (orderId: string): NotificationData => ({
    title: 'Order Assigned',
    body: 'You have been assigned a new order for delivery.',
    type: 'courier_assignment',
    orderId,
    actionUrl: `/courier`
  })
};
