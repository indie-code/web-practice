import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, AuthService, RegisterForm } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SignUpComponent', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    const routerSpy = jasmine.createSpyObj(Router.name, ['navigateByUrl']);
    const successResponse = {user: {id: 1, name: 'Вася', email: 'test@test.ru'}};
    const validationErrorResponse = {
        error: {
            errors: {
                name: ['name error'],
                email: ['email error'],
                password: ['password error'],
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SignUpComponent],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [ NO_ERRORS_SCHEMA ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('После авторизации пользователя перенаправляет на главную страницу', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);
        const navigateByUrlSpy = routerSpy.navigateByUrl as jasmine.Spy;

        component.register();

        authService.authResponse$.next(successResponse);
        expect(navigateByUrlSpy.calls.count()).toBe(1);
        expect(navigateByUrlSpy.calls.first().args[0]).toBe('');
    });

    it('При ошибках валидации в форме появляются ошибки', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);
        component.register();

        authService.authResponse$.error(validationErrorResponse);

        expect(component.form.get('email').errors).toEqual(['email error']);
        expect(component.form.get('name').errors).toEqual(['name error']);
        expect(component.form.get('password').errors).toEqual(['password error']);
    });

    it('При внутренних ошибках сервера ошибки не происходит', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);
        component.register();

        authService.authResponse$.error({error: 'Internal server error'});
    });

    it('Если вернулась ошибка валидации по полю, которого нет в форме, ошибки не происходит', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);
        component.register();

        const error = validationErrorResponse;
        error.error.errors['other'] = 'some error';

        authService.authResponse$.error(error);
    });
});

class AuthServiceMock {
    authResponse$: Subject<AuthResponse> = new Subject<AuthResponse>();

    register(registerForm: RegisterForm): Observable<AuthResponse> {
        return this.authResponse$.asObservable();
    }
}
