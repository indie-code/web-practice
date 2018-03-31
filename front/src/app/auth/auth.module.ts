import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,

        MatCardModule,
        MatInputModule,
        MatButtonModule,

        ReactiveFormsModule,
    ],
    declarations: [
        SignInComponent,
        SignUpComponent,
    ],
})
export class AuthModule {
}
