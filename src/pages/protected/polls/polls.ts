import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { PollService } from '../service/poll-service';
import { Router } from '@angular/router';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { BehaviorSubject, tap } from 'rxjs';
import { ErrorState } from '../../../shared/components/error-state/error-state';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-polls',
  imports: [CommonModule, Pagination, EmptyState, ErrorState, Loader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './polls.html',
  styleUrl: './polls.css',
})
export class Polls implements OnInit {
  private pollService = inject(PollService);
  private router = inject(Router);

  private errorSubject = new BehaviorSubject<{ message: string; statusCode: number } | null>(null);
  private pollLoaderSubject = new BehaviorSubject<boolean>(false);
  pollLoader$ = this.pollLoaderSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  stats$ = this.pollService.stats$;
  activePoll$ = this.pollService.activePolls$;
  currentPage = 1;
  itemsPerPage = 10;

  navigateToDetail(poll_id: number) {
    this.router.navigateByUrl(`app/polls/${poll_id}`);
  }
  onPageChange(page: number) {
    this.pollService
      .loadActivePoll(page, this.itemsPerPage)
      .pipe(
        tap(() => {
          this.pollLoaderSubject.next(true);
        }),
      )
      .subscribe({
        next: (data) => {
          this.pollLoaderSubject.next(true);
        },
        error: (err) => {
          this.pollLoaderSubject.next(true);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
        },
      });
  }

  ngOnInit(): void {
    this.pollService.getDashboardStats().subscribe();
    this.pollService
      .loadActivePoll(this.currentPage, this.itemsPerPage)
      .pipe(
        tap(() => {
          this.pollLoaderSubject.next(true);
        }),
      )
      .subscribe({
        next: (data) => {
          this.pollLoaderSubject.next(false);
        },
        error: (err) => {
          this.pollLoaderSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
        },
      });
  }
}
