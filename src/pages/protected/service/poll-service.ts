import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import {
  IDashboard,
  IDetailProps,
  IPaginatedResponse,
  IPoll,
  IPolls,
  IResponse,
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
    const params = new HttpParams().set('page', page).set('limit', limit);

    if (search) {
      params.set('search', search);
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
