import browser from "webextension-polyfill";
import {v4 as uuid} from "uuid";
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import { EventEmitter } from 'eventemitter3';
import { createSessionMessenger } from './sessionManager';
import { browserExtensionAdapter } from './extensionAdapter';


class NotificationManager {
    constructor() {
        this.currentNotification = undefined;
        this.notificationInfoQueue= [];
        this.eventEmitter = new EventEmitter();
    }
    async createNotificationWindow(_notification, options,) {
    // assign sessionId to the notification
    const notification = { ..._notification, sessionId: uuid() };
    // prevent duplicate notification
    if (
        options?.preventDuplicate &&
        (this.isCurrentNotification(notification) || this.hasTheSameInQueue(notification))
    ) {
        throw new Error("DuplicateRequest");
    }

    if (!this.isCurrentNotificationActive()) {
        return this._createNotificationWindow(notification);
    } else {
        this.addNotificationToQueue(notification);
        return new Promise((resolve) => {
            this.eventEmitter.on('finish', ({ nextSessionId }) => {
                // only process when the notification is at the top of the queue
                if (
                    !this.isAtTopOfQueue(notification) ||
                    this.isCurrentNotificationActive() ||
                    nextSessionId !== notification.sessionId
                ) {
                    return;
                }

                const nextNotification = this.notificationInfoQueue.shift();
                resolve(this._createNotificationWindow(nextNotification));
            });
        });
    }
}

 async _createNotificationWindow(payload){
    this.openCurrentNotification(payload);
    const messenger = createSessionMessenger({
        adapter: browserExtensionAdapter,
        sessionId: payload.sessionId,
    });
     const lastFocused = await browser.windows.getLastFocused();
     const window = await browser.windows.create({
         focused: true,
         top: lastFocused.top,
         left: lastFocused.left+ (lastFocused.width - 380),
         width: 380,
         height: 628,
         type: 'popup',
         url: `notification.html#/${payload.path}?sessionId=${payload.sessionId}`

     })

    browser.windows.onRemoved.addListener((windowId) => {
        if (windowId === window.id) {
            this.closeCurrentNotification();
            this.eventEmitter.emit('finish', { nextSessionId: this.notificationInfoQueue[0]?.sessionId });
        }
    });
    return { window, messenger };
    }

     getNotificationCount() {
        return this.currentNotification ? 1 + this.notificationInfoQueue.length : this.notificationInfoQueue.length;
    }
    async updateBadge() {
    let label = '';
    const count = this.getNotificationCount();
    if (count) {
        label = String(count);
    }
    await browser.action.setBadgeText({ text: label });
    await browser.action.setBadgeBackgroundColor({ color: '#00FF9D' });
}

     isAtTopOfQueue(notification) {
        return this.notificationInfoQueue[0]?.sessionId === notification.sessionId;
    }

     openCurrentNotification(notification) {
        this.currentNotification = notification;
        void this.updateBadge();
    }

     closeCurrentNotification() {
        this.currentNotification = undefined;
        void this.updateBadge();
    }

     isCurrentNotificationActive() {
        return !!this.currentNotification;
    }

    addNotificationToQueue(notification) {
        this.notificationInfoQueue.push(notification);
        void this.updateBadge();
    }

     isCurrentNotification(notification) {
        return (
            !!this.currentNotification &&
            isEqual(omit(notification, 'sessionId'), omit(this.currentNotification, 'sessionId'))
        );
    }

     hasTheSameInQueue(notification) {
        return !!this.notificationInfoQueue.find((info) => {
            return isEqual(omit(notification, 'sessionId'), omit(info, 'sessionId'));
        });
    }
}

export { NotificationManager };
