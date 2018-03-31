import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: '',
            password: '',
        });
    }

    signIn() {
        this.form.disable();
        this.authService.signIn(this.form.value)
            .pipe(
                first(),
                finalize(() => this.form.enable()),
            )
            .subscribe(
                () => this.router.navigateByUrl('/'),
                (error: HttpErrorResponse) => setTimeout(() => this.setErrors(error.error)),
            );
    }

    private setErrors(error: any) {
        if (!error || !(error instanceof Object)) {
            return;
        }

        if (!error.hasOwnProperty('errors')) {
            return;
        }

        const errors = error['errors'];
        if (!error || !(error instanceof Object)) {
            return;
        }

        Object.entries(errors).forEach(([key, messages]) => {
            const control = this.form.get(key);

            if (! control) {
                return;
            }

            control.setErrors(messages);
        });
    }
}
