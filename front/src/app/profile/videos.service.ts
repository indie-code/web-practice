import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VideosService {

    constructor(private api: ApiService) {
    }

    upload(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.api.request('POST', 'video-files', formData, {reportProgress: true});
    }

}

