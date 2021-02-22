import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user.model';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private url: string;

  constructor(private http: HttpClient) { this.url = 'http://localhost:3000/users' }

  getAllUsers(): Observable<Array<IUser>> {
    return this.http.get<Array<IUser>>(this.url);
  }

  signIn(id: number, email: string, password: string, arr: Array<IUser>): Observable<IUser> {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].email === email && arr[i].password === password) {
        return this.http.get<IUser>(this.url + '/' + arr[i].id);
      }
    }
    const newUser = new User(++id, email, password);
    return this.http.post<IUser>(this.url, newUser);
  }

  updateUser(user: IUser): Observable<Array<IUser>> {
    return this.http.put<Array<IUser>>(`${this.url}/${user.id}`, user)
  }
}
