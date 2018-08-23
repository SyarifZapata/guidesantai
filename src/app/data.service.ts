import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getCategories(user) {
    const url = '/api/users/'.concat(user);
    console.log(url);
    return this._http.get(url).pipe(map(result => this.result = result.json().data));
  }

}


