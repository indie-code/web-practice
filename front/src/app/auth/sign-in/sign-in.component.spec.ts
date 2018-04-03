import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent} from './sign-in.component';
import { AuthResponse, AuthService, SignInForm } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignInComponent', () => {
    let fixture: ComponentFixture<SignInComponent>;
    let component: SignInComponent;
    const routerSpy = jasmine.createSpyObj(Router.name, ['navigateByUrl']);
    const successResponse = {user: {id: 1, email: 'test@test.ru', name: 'Иван'}};
    const validationErrors = {error: {errors: {email: ['email error'], password: ['password error']}}};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SignInComponent],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Должен перенаправить пользователя при успешной аутентификации', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);
        const navigateSpy = routerSpy.navigateByUrl as jasmine.Spy;

        component.signIn();
        authService.signIn$.next(successResponse);

        expect(navigateSpy.calls.count()).toBe(1);
        expect(navigateSpy.calls.first().args).toEqual(['/']);
    });

    it('Должен отображать ошибки при неуспешной аутентификации', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);

        component.signIn();
        authService.signIn$.error(validationErrors);

        expect(component.form.get('email').errors).toEqual(['email error']);
        expect(component.form.get('password').errors).toEqual(['password error']);
    });

    it('Должен деактивировать форму на время выполнения аутентификации', () => {
        const authService: AuthServiceMock = TestBed.get(AuthService);

        component.signIn();

        expect(component.form.disabled).toBeTruthy('Форма не деактивировалась перед запросом');
        authService.signIn$.error(validationErrors);

        expect(component.form.enabled).toBeTruthy('Форма не активировалась после ответа');
    });
});

class AuthServiceMock {
    signIn$ = new Subject<AuthResponse>();

    signIn(signInForm: SignInForm): Observable<AuthResponse> {
        return this.signIn$.asObservable();
    }
}
