import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { IHttpResponse } from '../../pages/auth/interface';
import { IOption } from '../components/select-input/select-input';

interface IState {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  version = 'v1';
  stateCache: IOption[] | null = null;

  getStates(): Observable<IOption[]> {
    if (this.stateCache) {
      return of(this.stateCache);
    }
    return this.http.get<IHttpResponse<IState[]>>(`${this.apiUrl}/api/${this.version}/state`).pipe(
      map((response) => {
        // console.log(response);
        return response.data.map((state) => ({
          value: state.id.toString(),
          label: state.name,
        }));
      }),
      tap((states) => (this.stateCache = states)),
    );
  }
}
