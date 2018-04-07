import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { setValidationErrors } from '../../helpers/form-helpers';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
    }

    signUp() {
        this.form.disable();
        this.authService.register(this.form.value)
            .pipe(
                first(),
                tap(() => this.form.enable(), () => this.form.enable()),
            )
            .subscribe(
                () => this.router.navigateByUrl('/'),
                (error: HttpErrorResponse) => setValidationErrors(this.form, error)
            );
    }
}
