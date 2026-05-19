import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  ICreatePoll,
  IDashboard,
  IDetailProps,
  IPaginatedResponse,
  IPoll,
  IPolls,
  IResponse,
  IUpdatePoll,
  IVote,
  IVoteResult,
} from '../interface';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private version_1 = 'v1';
  private dashboardSubject = new BehaviorSubject<IDashboard | null>(null);
  private activePollSubject = new BehaviorSubject<IPaginatedResponse<IPoll> | null>(null);
  private allPollSubject = new BehaviorSubject<IPaginatedResponse<IPolls> | null>(null);
  private dashboardCache: IDashboard | null = null;
  private activePollCache: Record<number, IPaginatedResponse<IPoll>> = {};
  private hasVotedSubject = new BehaviorSubject<IVote | null>(null);
  private resultSubject = new BehaviorSubject<IVoteResult | null>(null);
  pollResult$ = this.resultSubject.asObservable();
  voteObj$ = this.hasVotedSubject.asObservable();
  stats$ = this.dashboardSubject.asObservable();
  activePolls$ = this.activePollSubject.asObservable();
  allPolls$ = this.allPollSubject.asObservable();

  getDashboardStats(): Observable<IDashboard> {
    if (this.dashboardCache) {
      this.dashboardSubject.next(this.dashboardCache);
      return of(this.dashboardCache);
    }
    return this.http
      .get<IResponse<IDashboard>>(`${this.apiUrl}/api/${this.version_1}/votes/dashboard`)
      .pipe(
        map((response) => {
          this.dashboardCache = response.data;
          this.dashboardSubject.next(response.data);
          return response.data;
        }),
      );
  }

  loadActivePoll(page: number = 1, limit: number = 10): Observable<IPaginatedResponse<IPoll>> {
    if (this.activePollCache[page]) {
      this.activePollSubject.next(this.activePollCache[page]);
      return of(this.activePollCache[page]);
    }

    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http
      .get<
        IResponse<IPaginatedResponse<IPoll>>
      >(`${this.apiUrl}/api/${this.version_1}/poll/active`, { params })
      .pipe(
        map((response) => {
          this.activePollCache[page] = response.data;
          this.activePollSubject.next(response.data);
          return response.data;
        }),
      );
  }

  loadAllPoll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Observable<IPaginatedResponse<IPolls>> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (search) {
      params = params.set('search', search);
    }
    return this.http
      .get<
        IResponse<IPaginatedResponse<IPolls>>
      >(`${this.apiUrl}/api/${this.version_1}/poll`, { params })
      .pipe(
        map((response) => {
          this.allPollSubject.next(response.data);
          return response.data;
        }),
      );
  }

  deletePoll(poll_id: number): Observable<IResponse<boolean>> {
    const current_poll = this.allPollSubject.getValue();
    if (current_poll) {
      const updated = {
        ...current_poll,
        data: current_poll.data.filter((poll) => poll.id !== poll_id),
      };

      this.allPollSubject.next(updated);
    }

    return this.http
      .delete<IResponse<boolean>>(`${this.apiUrl}/api/${this.version_1}/poll/${poll_id}`)
      .pipe(
        catchError((error) => {
          this.allPollSubject.next(current_poll);
          return throwError(() => error);
        }),
      );
  }

  closePoll(poll_id: number): Observable<IResponse<boolean>> {
    const current_value = this.allPollSubject.getValue();

    if (current_value) {
      const updated = {
        ...current_value,
        data: current_value.data.map((poll) =>
          poll.id === poll_id ? { ...poll, status: 'closed' } : poll,
        ),
      };

      this.allPollSubject.next(updated);
    }

    return this.http
      .patch<IResponse<boolean>>(`${this.apiUrl}/api/${this.version_1}/poll/${poll_id}/close`, null)
      .pipe(
        catchError((err) => {
          this.allPollSubject.next(current_value);
          return throwError(() => err);
        }),
      );
  }

  createPoll(poll: ICreatePoll): Observable<IResponse<boolean>> {
    return this.http
      .post<IResponse<boolean>>(`${this.apiUrl}/api/${this.version_1}/poll`, poll)
      .pipe(
        tap((data) => {
          this.loadAllPoll(1, 10).subscribe();
        }),
      );
  }

  updatePoll(poll_id: number, payload: IUpdatePoll): Observable<IResponse<IPolls>> {
    const current = this.allPollSubject.getValue();

    if (current) {
      const updated = {
        ...current,
        data: current.data.map((poll) =>
          poll.id === poll_id
            ? {
                ...poll,
                ...(payload.title && { title: payload.title }),
                ...(payload.description && { description: payload.description }),
              }
            : poll,
        ),
      };
      this.allPollSubject.next(updated);
    }
    return this.http
      .patch<IResponse<IPolls>>(`${this.apiUrl}/api/${this.version_1}/poll/${poll_id}`, payload)
      .pipe(
        tap((response) => {
          const latest = this.allPollSubject.getValue();
          if (latest) {
            const confirmed = {
              ...latest,
              data: latest.data.map((poll) =>
                poll.id === poll_id ? { ...poll, ...response.data, user: poll.user } : poll,
              ),
            };
            this.allPollSubject.next(confirmed);
          }
        }),
        catchError((err) => {
          this.allPollSubject.next(current);
          return throwError(() => err);
        }),
      );
  }

  activatePoll(poll_id: number): Observable<IResponse<boolean>> {
    const current_value = this.allPollSubject.getValue();

    if (current_value) {
      const updated = {
        ...current_value,
        data: current_value.data.map((poll) =>
          poll.id === poll_id ? { ...poll, status: 'active' } : poll,
        ),
      };

      this.allPollSubject.next(updated);
    }

    return this.http
      .patch<
        IResponse<boolean>
      >(`${this.apiUrl}/api/${this.version_1}/poll/${poll_id}/activate`, null)
      .pipe(
        catchError((err) => {
          this.allPollSubject.next(current_value);
          return throwError(() => err);
        }),
      );
  }

  loadSingleActivePoll(poll_id: string): Observable<IDetailProps> {
    return this.http
      .get<IResponse<IDetailProps>>(`${this.apiUrl}/api/${this.version_1}/poll/${poll_id}/active`)
      .pipe(map((response) => response.data));
  }

  checkVotedPoll(poll_id: string): Observable<IVote | null> {
    return this.http
      .get<
        IResponse<IVote | null>
      >(`${this.apiUrl}/api/${this.version_1}/votes/poll/${poll_id}/check`)
      .pipe(
        map((response) => {
          this.hasVotedSubject.next(response.data);
          return response.data?.id ? response.data : null;
        }),
      );
  }

  castVote(poll_id: string, option_id: string): Observable<IResponse<IVote>> {
    return this.http
      .post<
        IResponse<IVote>
      >(`${this.apiUrl}/api/${this.version_1}/votes/poll/${poll_id}/option/${option_id}`, null)
      .pipe(
        map((response) => {
          this.hasVotedSubject.next(response.data);
          return response;
        }),
      );
  }

  loadPollResultByPollId(poll_id: string, state_id?: string): Observable<IVoteResult> {
    let params = new HttpParams();

    if (state_id) {
      params = params.set('state_id', state_id);
    }
    return this.http
      .get<
        IResponse<IVoteResult>
      >(`${this.apiUrl}/api/${this.version_1}/votes/${poll_id}/results`, { params })
      .pipe(
        map((response) => {
          this.resultSubject.next(response.data);
          return response.data;
        }),
      );
  }
}
