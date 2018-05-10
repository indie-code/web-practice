import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthResponse, AuthService, SignInForm } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { makeValidationErrors } from '../../helpers/response-helpers.spec';

describe('SignInComponent', () => {
    let fixture: ComponentFixture<SignInComponent>;
    let component: SignInComponent;
    const routerSpy = jasmine.createSpyObj(Router.name, ['navigateByUrl']);
    const successResponse = {user: {id: 1, email: 'test@test.ru', name: 'Иван'}};
    const validationErrors = makeValidationErrors({
        email: ['email error'],
        password: ['password error'],
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SignInComponent],
            providers: [
                {provide: AuthService, useClass: AuthServiceMock},
                {provide: Router, useValue: routerSpy},
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Component behavior', () => {
        it('should redirect authenticated user to main page', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            const navigateSpy = routerSpy.navigateByUrl as jasmine.Spy;

            component.signIn();
            authService.signIn$.next(successResponse);

            expect(navigateSpy.calls.count()).toBe(1, 'user is not have been redirected exactly one time');
            expect(navigateSpy.calls.first().args).toEqual(['/'], 'redirect uri is not main page');
        });

        it('should set validation errors to form controls', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signIn();
            authService.signIn$.error(validationErrors);

            expect(component.form.get('email').errors).toEqual(['email error'], 'email field don`t have errors');
            expect(component.form.get('password').errors).toEqual(['password error'], 'password field don`t have errors');
        });

        it('should disable form before authentication request', () => {
            component.signIn();
            expect(component.form.disabled).toBeTruthy('form still enabled after request have been sent');
        });

        it('should enable form after authenticate', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signIn();
            authService.signIn$.next(successResponse);

            expect(component.form.enabled).toBeTruthy('form still disabled after receive authenticate response');
        });

        it('should enable form after receive validation errors', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signIn();
            authService.signIn$.error(validationErrors);

            expect(component.form.enabled).toBeTruthy('form still disabled after receive validation errors');
        });
    });


    describe('Error handling', () => {
        it('should handle validation errors with unknown fields', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            const error = validationErrors;
            error.error.errors['unknown'] = 'some error';

            component.signIn();
            authService.signIn$.error(error);
        });

        it('should handle internal server errors', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            component.signIn();
            authService.signIn$.error({error: 'Internal server error'});
        });

        it('should handle empty error response', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            component.signIn();
            authService.signIn$.error({});
        });
    });
});

class AuthServiceMock {
    signIn$ = new Subject<AuthResponse>();

    signIn(signInForm: SignInForm): Observable<AuthResponse> {
        return this.signIn$.asObservable();
    }
}
