import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let tokenService: TokenStorageMock;
    const routerSpy = jasmine.createSpyObj(Router.name, ['navigateByUrl']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: TokenStorageService, useClass: TokenStorageMock},
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
            ],
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        tokenService = TestBed.get(TokenStorageService);
    });

    afterEach(() => httpTestingController.verify());

    it('Сохраняет токен при его получении с api', () => {

        httpClient.get('sign-in').subscribe(
            () => expect(tokenService.testToken).toBe('auth token'),
        );

        const request = httpTestingController.expectOne('sign-in');

        request.flush({}, {headers: {'Api-Token': 'auth token'}});
    });

    it('Добавляет токен в каждый http запрос при его наличии', () => {
        tokenService.setToken('auth token');

        httpClient.post('url', {}).subscribe();

        const req = httpTestingController.expectOne('url');

        const authHeader = req.request.headers.get('Authorization');
        expect(authHeader).toBe('Bearer auth token');

        req.flush({});
    });

    it('Не добавляет токен в каждый http запрос при его отсутствии', () => {
        expect(tokenService.testToken).toBeFalsy();

        httpClient.post('url', {}).subscribe();

        const req = httpTestingController.expectOne('url');

        const authHeader = req.request.headers.get('Authorization');
        expect(authHeader).toBeFalsy();

        req.flush({});
    });

    it('Не удаляет токен, если он не пришёл с бэкенда', () => {
        tokenService.testToken = 'auth token';

        httpClient.post('url', {}).subscribe(
            () => expect(tokenService.testToken).toBe('auth token'),
        );

        const req = httpTestingController.expectOne('url');

        req.flush({});
    });

    it('При ответе 401 кодом токен удаляется и пользователя перенаправляет на страницу авторизации', () => {
        tokenService.testToken = 'auth token';

        httpClient.post('url', {}).subscribe(
            null,
            () => {
                const navigateSpy = routerSpy.navigateByUrl as jasmine.Spy;

                expect(tokenService.testToken).toBeFalsy();
                expect(navigateSpy.calls.count()).toBe(1);
                expect(navigateSpy.calls.first().args[0]).toContain('sign-in');
            },
        );

        const req = httpTestingController.expectOne('url');

        req.error(new ErrorEvent('Unauthorized'), {status: 401});
    });
});

class TokenStorageMock {
    testToken: string;

    setToken(token: string) {
        this.testToken = token;
    }

    token() {
        return this.testToken;
    }

    deleteToken() {
        this.testToken = undefined;
    }
}

