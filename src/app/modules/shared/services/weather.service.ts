import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class WeatherService {
	private baseUrl = 'https://api.openweathermap.org/data/2.5';
	// cache TTL in milliseconds (default 10 minutes)
		private cacheTtl = environment.weatherCacheTtl || 10 * 60 * 1000;

	constructor(private http: HttpClient) { }

	private _cacheKey(lat: number, lon: number, units: string) {
		return `weather_${lat.toFixed(4)}_${lon.toFixed(4)}_${units}`;
	}

	private _getCached(key: string): any | null {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) { return null; }
			const obj = JSON.parse(raw);
			if (!obj || !obj.ts) { return null; }
			if ((Date.now() - obj.ts) > this.cacheTtl) {
				localStorage.removeItem(key);
				return null;
			}
			return obj.data;
		} catch (e) {
			return null;
		}
	}

	private _setCached(key: string, data: any) {
		try {
			const obj = { ts: Date.now(), data };
			localStorage.setItem(key, JSON.stringify(obj));
		} catch (e) {
			// ignore storage errors
		}
	}

	/**
	 * Get current weather by coordinates. Supports units 'metric' (C) or 'imperial' (F).
	 * Will return cached value when available unless force=true.
	 */
	public getByCoords(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric', force: boolean = false): Observable<any> {
		const key = this._cacheKey(lat, lon, units);

		// If there's no API key configured, fallback to the mock asset
		const apiKey = environment.weatherApiKey || '';
			if (!apiKey) {
				const cached = this._getCached(key);
				if (cached && !force) {
					return of(cached);
				}
						return this.http.get<any>('assets/mock/weather-empty.json').pipe(
							map((d) => {
								const conv = this._convertMockIfNeeded(d, units);
								conv._isMock = true;
								return conv;
							}),
							tap((d) => this._setCached(key, d))
						);
			}

		if (!force) {
			const cached = this._getCached(key);
			if (cached) { return of(cached); }
		}

			const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&lang=es&appid=${apiKey}`;
			return this.http.get<any>(url).pipe(
				map((d) => {
					try { (d as any)._isMock = false; } catch (e) {}
					return d;
				}),
				tap((d) => this._setCached(key, d))
			);
	}

		/** If we're using the mock asset (which is in °C), convert to requested units when needed. */
		private _convertMockIfNeeded(data: any, units: string) {
			if (!data || !data.main || typeof data.main.temp !== 'number') { return data; }
			const result = JSON.parse(JSON.stringify(data));
			// assume mock is in metric (°C)
			if (units === 'imperial') {
				result.main.temp = Math.round((result.main.temp * 9/5) + 32);
			} else {
				// ensure integer-ish for display
				result.main.temp = Math.round(result.main.temp);
			}
			return result;
		}

	/**
	 * Clear cached weather for coordinates and units (optional).
	 */
	public clearCache(lat?: number, lon?: number, units?: string) {
		try {
			if (lat != null && lon != null && units) {
				const key = this._cacheKey(lat, lon, units as any);
				localStorage.removeItem(key);
			} else {
				// clear all weather_* keys
				Object.keys(localStorage).forEach((k) => {
					if (k.startsWith('weather_')) { localStorage.removeItem(k); }
				});
			}
		} catch (e) {
			// ignore
		}
	}
}
