import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../service/poll-service';
import { StateService } from '../../../shared/service/state-service';
import { IOption } from '../../../shared/components/select-input/select-input';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ErrorState } from '../../../shared/components/error-state/error-state';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-poll-result',
  imports: [CommonModule, FormsModule, ErrorState, Loader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './poll-result.html',
  styleUrl: './poll-result.css',
})
export class PollResult implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private stateService = inject(StateService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<{ message: string; statusCode: number } | null>(null);
  error$ = this.errorSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  state$!: Observable<IOption[]>;
  pollResult$ = this.pollService.pollResult$;
  poll_id!: string;
  selectedState: string = 'all';

  ngOnInit(): void {
    this.poll_id = this.activatedRoute.snapshot.paramMap.get('poll_id') ?? '';

    this.pollService
      .loadPollResultByPollId(this.poll_id)
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
        }),
      )
      .subscribe({
        next: () => {
          this.loadingSubject.next(false);
        },
        error: (err) => {
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
          this.loadingSubject.next(false);
        },
      });
    this.state$ = this.stateService.getStates();
  }
  onStateChange(): void {
    const stateId = this.selectedState === 'all' ? undefined : this.selectedState;

    this.pollService
      .loadPollResultByPollId(this.poll_id, stateId)
      .pipe(
        tap(() => {
          this.loadingSubject.next(true);
        }),
      )
      .subscribe({
        next: () => {
          this.loadingSubject.next(false);
        },
        error: (err) => {
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
          this.loadingSubject.next(false);
        },
      });
  }
}
