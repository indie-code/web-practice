import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthResponse, AuthService, SignUpForm } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { makeValidationErrors } from '../../helpers/response-helpers.spec';

describe('SignUpComponent', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    const routerSpy = jasmine.createSpyObj(Router.name, ['navigateByUrl']);
    const successResponse = {user: {id: 1, name: 'Вася', email: 'test@test.ru'}};
    const validationErrors = makeValidationErrors({
        name: ['name error'],
        email: ['email error'],
        password: ['password error'],
    });

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

    describe('Component behavior', () => {
        it('should redirect to main page after sign up', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            const navigateByUrlSpy = routerSpy.navigateByUrl as jasmine.Spy;

            component.signUp();
            authService.signUp$.next(successResponse);

            expect(navigateByUrlSpy.calls.count()).toBe(1, 'user is not have been redirected exactly one time');
            expect(navigateByUrlSpy.calls.first().args[0]).toBe('/', 'redirect uri is not main page');
        });

        it('should disable form before authentication request', () => {
            component.signUp();
            expect(component.form.disabled).toBeTruthy('form still enabled after request have been sent');
        });

        it('should enable form after authenticate', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signUp();
            authService.signUp$.next(successResponse);

            expect(component.form.enabled).toBeTruthy('form still disabled after receive authentication response');
        });

        it('should enable form after receive errors', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signUp();
            authService.signUp$.error(validationErrors);

            expect(component.form.enabled).toBeTruthy('form still disabled after receive validation errors');
        });
    });

    describe('Error handling', () => {
        it('should set validation errors to form controls', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);

            component.signUp();
            authService.signUp$.error(validationErrors);

            expect(component.form.get('email').errors).toEqual(['email error']);
            expect(component.form.get('name').errors).toEqual(['name error']);
            expect(component.form.get('password').errors).toEqual(['password error']);
        });

        it('should handle validation errors with unknown fields', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            const error = validationErrors;
            error.error.errors['unknown'] = 'some error';

            component.signUp();
            authService.signUp$.error(error);
        });

        it('should handle internal server errors', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            component.signUp();
            authService.signUp$.error({error: 'Internal server error'});
        });

        it('should handle empty error response', () => {
            const authService: AuthServiceMock = TestBed.get(AuthService);
            component.signUp();
            authService.signUp$.error({});
        });
    });
});

class AuthServiceMock {
    signUp$: Subject<AuthResponse> = new Subject<AuthResponse>();

    register(registerForm: SignUpForm): Observable<AuthResponse> {
        return this.signUp$.asObservable();
    }
}
