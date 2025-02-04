// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })

// export class AuthService {

//   private LOGIN_URL = 'http://192.168.1.45:8080';
//   private userToken = 'Token'

//   constructor(private httpClient: HttpClient, private router: Router) { }

//   login(username: string, password: string) : Observable<any> {
//     return this.httpClient.post<any>(this.LOGIN_URL,{username, password}).pipe(
//       tap(response => {
//         if(response){
//           console.log('Login successful1:', JSON.stringify(response));
//           this.setToken(JSON.stringify(response));
//         }
//       })
//     );
//   }

//   private setToken(token: string): void {
//     sessionStorage.setItem(this.userToken, token);
//   }

//   private getToken(): string | null {
//     return sessionStorage.getItem(this.userToken);
//   }

//   isAuthenticated(): boolean {
//     const usertoken = this.getToken();
//     if(!usertoken){
//       return false;
//     }
//     const token = JSON.parse(usertoken).token;
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const exp = payload.exp * 1000;
//     return Date.now() < exp;
//   }

//   logout(): void{
//     sessionStorage.removeItem(this.userToken);
//     this.router.navigate(['/login']);
//   }

// }