import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService} from '../services/auth.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user';

@Component({
    selector: 'app-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.css'],
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
    private destroyed$ = new Subject<void>();
    user: User;
    loaded = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.user().pipe(
            takeUntil(this.destroyed$),
            tap(() => this.loaded = true),
        ).subscribe(user => this.user = user);
    }

    signOut() {
        this.authService.signOut();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
