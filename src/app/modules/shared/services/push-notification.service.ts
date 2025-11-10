import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PushNotificationService {

	constructor(private http: HttpClient,
				@Optional() private afMessaging?: AngularFireMessaging) { }

	/**
	 * Register the firebase messaging service worker if available in the browser.
	 * Returns the ServiceWorkerRegistration or null if not supported.
	 */
	public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
		if (!('serviceWorker' in navigator)) {
			return null;
		}

		try {
			// Try to register the SW at root so Firebase can use it
			const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
			return reg;
		} catch (err) {
			console.warn('Service worker registration failed:', err);
			return null;
		}
	}

	/**
	 * Register device token in backend (GAMC) — backend endpoint is expected in environment.gamcPushUrl
	 * This is a safe stub: backend contract and auth must be implemented by the GAMC team.
	 */
	public registerDevice(token: string, meta: any = {}): Promise<any> {
		const url = environment.gamcPushUrl || '';
		if (!url) {
			console.warn('GAMC push URL not configured (environment.gamcPushUrl)');
			return Promise.resolve({ ok: false, message: 'not-configured' });
		}

		return this.http.post(url + '/devices', { token, meta }).toPromise();
	}

	/** Send an example/test push via GAMC backend */
	public sendTestNotification(payload: any): Promise<any> {
		const url = environment.gamcPushUrl || '';
		if (!url) {
			console.warn('GAMC push URL not configured (environment.gamcPushUrl)');
			return Promise.resolve({ ok: false, message: 'not-configured' });
		}

		return this.http.post(url + '/send', payload).toPromise();
	}

	/**
	 * Request permission from the user and try to obtain an FCM token (if AngularFireMessaging is available).
	 * Returns an object with status and token (if any).
	 */
	public async requestPermission(): Promise<{ status: string, token?: string, info?: any }> {
		if (!('Notification' in window)) {
			return { status: 'unsupported' };
		}

		const permission = await Notification.requestPermission();
		if (permission !== 'granted') {
			return { status: permission };
		}

		// Ensure service worker is registered (helps Firebase/FCM)
		try {
			await this.registerServiceWorker();
		} catch (e) {
			// non-fatal
		}

		// Try to obtain FCM token via AngularFireMessaging if available
		if (this.afMessaging && (this.afMessaging as any).requestToken) {
			try {
				const token = (await firstValueFrom((this.afMessaging as any).requestToken)) as string;
				return { status: 'granted', token };
			} catch (err) {
				return { status: 'granted', token: undefined, info: err };
			}
		}

		// No AF messaging available; permission granted but no token
		return { status: 'granted', token: undefined, info: 'no-angularfire-messaging' };
	}

}

