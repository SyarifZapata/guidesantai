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

  // register new user
  addUser(user){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/api/auth/register', JSON.stringify(user), {headers: headers}).pipe(map(res => res.json()));
  }

  login(user){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.post('http://localhost:3000/api/auth/login', JSON.stringify(user), {headers: headers}).pipe(map((res) => res.json()));
  }

}


