import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { setValidationErrors } from '../../helpers/form-helpers';

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
                tap(() => this.form.enable(), () => this.form.enable()),
            )
            .subscribe(
                () => this.router.navigateByUrl('/'),
                (error: HttpErrorResponse) => setValidationErrors(this.form, error),
            );
    }
}
