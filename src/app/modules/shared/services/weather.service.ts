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

	/**
	 * Map Open-Meteo numeric weathercode to a human readable Spanish description.
	 */
	private _mapOpenMeteoCodeToText(code: number | string | undefined): string {
		const c = Number(code);
		switch (c) {
			case 0: return 'Despejado';
			case 1: return 'Principalmente despejado';
			case 2: return 'Parcialmente nublado';
			case 3: return 'Nublado';
			case 45: return 'Niebla';
			case 48: return 'Niebla con escarcha';
			case 51: return 'Llovizna ligera';
			case 53: return 'Llovizna moderada';
			case 55: return 'Llovizna densa';
			case 56: return 'Llovizna helada';
			case 57: return 'Llovizna helada densa';
			case 61: return 'Lluvia ligera';
			case 63: return 'Lluvia moderada';
			case 65: return 'Lluvia fuerte';
			case 66: return 'Lluvia helada';
			case 67: return 'Lluvia helada intensa';
			case 71: return 'Nieve ligera';
			case 73: return 'Nieve moderada';
			case 75: return 'Nieve fuerte';
			case 77: return 'Granizo de nieve';
			case 80: return 'Chubascos ligeros';
			case 81: return 'Chubascos moderados';
			case 82: return 'Fuertes chubascos';
			case 85: return 'Chubascos de nieve ligeros';
			case 86: return 'Chubascos de nieve fuertes';
			case 95: return 'Tormenta';
			case 96: return 'Tormenta con granizo leve';
			case 99: return 'Tormenta con granizo intenso';
			default: return 'Condiciones varias';
		}
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

		// Determine provider: if weatherApiKey looks like a URL, treat it as a provider base (e.g., Open-Meteo).
		const apiCfg = (environment as any).weatherApiKey || '';

		// If no provider configured, fallback to mock asset
		if (!apiCfg) {
			const cached = this._getCached(key);
			if (cached && !force) { return of(cached); }
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

		// If apiCfg looks like a URL, call it as Open-Meteo style provider
		if (typeof apiCfg === 'string' && (apiCfg.startsWith('http://') || apiCfg.startsWith('https://'))) {
			// Open-Meteo expects latitude, longitude, current_weather=true and temperature_unit
			const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
			const windUnit = units === 'metric' ? 'ms' : 'mph';
			// request hourly relative humidity so we can extract humidity for the current time
			const url = `${apiCfg.replace(/\/$/, '')}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${tempUnit}&hourly=relativehumidity_2m&windspeed_unit=${windUnit}&timezone=auto`;
			return this.http.get<any>(url).pipe(
				map((resp) => {
					// map Open-Meteo current_weather -> standard shape
					const cw = resp?.current_weather || resp;
					// try to obtain humidity from hourly arrays if present (Open-Meteo provides relativehumidity_2m in hourly)
					let humidity: number | null = null;
					try {
						if (resp && resp.hourly && Array.isArray(resp.hourly.time) && Array.isArray(resp.hourly.relativehumidity_2m)) {
							const times: string[] = resp.hourly.time;
							const rh: number[] = resp.hourly.relativehumidity_2m;
							const idx = times.indexOf(cw.time);
							if (idx >= 0 && rh[idx] != null) {
								humidity = Math.round(rh[idx]);
							} else if (rh.length > 0) {
								// fallback to nearest/last available
								humidity = Math.round(rh[rh.length - 1]);
							}
						}
					} catch (e) {
						humidity = null;
					}
					const mapped: any = {
						main: { temp: cw.temperature, humidity: humidity },
						wind: { speed: cw.windspeed, unit: (units === 'metric' ? 'm/s' : 'mph') },
						weather: [{ description: this._mapOpenMeteoCodeToText(cw.weathercode || cw.weather_code) }],
						_dt: cw.time || null
					};
					try { mapped._isMock = false; } catch (e) {}
					return mapped;
				}),
				tap((d) => this._setCached(key, d))
			);
		}

		// Otherwise assume apiCfg is an API key for OpenWeather
		const apiKey = apiCfg as string;
		const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&lang=es&appid=${apiKey}`;
		return this.http.get<any>(url).pipe(
			map((d) => {
				try { (d as any)._isMock = false; } catch (e) {}
				// annotate unit and wind unit according to requested units
				try { (d as any)._unit = units; } catch (e) {}
				try {
					if ((d as any).wind && typeof (d as any).wind.speed === 'number') {
						(d as any).wind.unit = (units === 'metric') ? 'm/s' : 'mph';
					}
				} catch (e) {}
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
