import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../../../environments/environment';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
    // ensure clean localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should fetch mock asset when no API key is configured', (done) => {
    (environment as any).weatherApiKey = '';

    service.getByCoords(1, 1).subscribe((res) => {
      expect(res).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('assets/mock/weather-empty.json');
    expect(req.request.method).toBe('GET');
    req.flush({ mocked: true });
  });

  it('should call OpenWeather API when apiKey is present', (done) => {
    (environment as any).weatherApiKey = 'TESTKEY';

    service.getByCoords(2, 3, 'metric', true).subscribe((res) => {
      expect(res).toBeTruthy();
      done();
    });

  const req = httpMock.expectOne((r) => r.url.includes('/data/2.5/weather') && r.params.get('appid') === 'TESTKEY');
  expect(req.request.method).toBe('GET');
  req.flush({ temp: 20 });
  });

  it('should cache response and return cached on subsequent calls', (done) => {
    (environment as any).weatherApiKey = 'TESTKEY';
    const lat = 10; const lon = 20;

    service.getByCoords(lat, lon, 'metric', true).subscribe((res) => {
      expect(res).toBeTruthy();
      // second call should return cached value and NOT issue HTTP request
      service.getByCoords(lat, lon, 'metric', false).subscribe((cached) => {
        expect(cached).toBeTruthy();
        done();
      });
    });

  const req = httpMock.expectOne((r) => r.url.includes('/data/2.5/weather') && r.params.get('appid') === 'TESTKEY');
  req.flush({ temp: 25 });
  });

});
