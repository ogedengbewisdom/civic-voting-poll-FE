import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  IHttpResponse,
  ILoginRequest,
  IRegister,
  IRegResponse,
  IResetPasswordData,
  IUpdateUser,
  IUser,
} from '../interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;
  private version_1 = 'v1';
  private profileSubject = new BehaviorSubject<IUser | null>(this.getUserData());
  private isLoggedInSubject = new BehaviorSubject<boolean>(!this.isTokenExpired());
  private showLogoutModalSubject = new BehaviorSubject<boolean>(false);
  showLogoutModal$ = this.showLogoutModalSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  getToken(): string | null {
    return sessionStorage.getItem('civic_poll_jwt');
  }

  toggleLogoutModal(): void {
    this.showLogoutModalSubject.next(!this.showLogoutModalSubject.value);
  }

  resetToggleState(): void {
    this.showLogoutModalSubject.next(false);
  }

  refreshProfile(newToken: string): void {
    sessionStorage.setItem('civic_poll_jwt', newToken);
    this.profileSubject.next(this.getUserData());
  }

  decodedToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decode_payload = atob(payload);
      return JSON.parse(decode_payload);
    } catch (error) {
      return null;
    }
  }

  getUserData(): IUser | null {
    const decoded = this.decodedToken();
    if (!decoded) return null;

    return {
      id: decoded.sub,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      state_id: decoded.state_id,
      state: decoded.state,
      role: decoded.role,
    };
  }

  isTokenExpired(): boolean {
    const decoded = this.decodedToken();
    if (!decoded?.exp) return true;

    const expiredInMs = decoded.exp * 1000;

    return Date.now() > expiredInMs;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  login(credentials: ILoginRequest): Observable<IHttpResponse<string>> {
    return this.http.post<IHttpResponse<string>>(
      `${this.apiUrl}/api/${this.version_1}/auth/login`,
      credentials,
    );
  }

  register(registerData: IRegister): Observable<IRegResponse> {
    return this.http.post<IRegResponse>(
      `${this.apiUrl}/api/${this.version_1}/auth/register`,
      registerData,
    );
  }

  updateUser(updateUserData: IUpdateUser): Observable<IHttpResponse<string>> {
    return this.http.put<IHttpResponse<string>>(
      `${this.apiUrl}/api/${this.version_1}/users/profile`,
      updateUserData,
    );
  }

  logout(): void {
    sessionStorage.removeItem('civic_poll_jwt');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<IRegResponse> {
    return this.http.post<IRegResponse>(
      `${this.apiUrl}/api/${this.version_1}/auth/forgot-password`,
      { email },
    );
  }

  resetPassword(data: IResetPasswordData, token: string): Observable<IHttpResponse<boolean>> {
    return this.http.post<IHttpResponse<boolean>>(
      `${this.apiUrl}/api/${this.version_1}/auth/reset-password/${token}`,
      data,
    );
  }

  handleExpiredToken(): boolean {
    const token = this.getToken();

    if (!token) return false;
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }

    return true;
  }

  timerLogout(): void {
    const decoded = this.decodedToken();
    if (!decoded?.exp) return;
    const expiredInMs = decoded.exp * 1000;
    const duration = expiredInMs - Date.now();

    if (duration > 0) {
      setTimeout(() => this.logout(), duration);
    }
  }
}
