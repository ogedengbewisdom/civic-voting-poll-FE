import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from '../service/poll-service';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IDetailProps } from '../interface';
import { AuthService } from '../../auth/service/auth-service';
import { Button } from '../../../shared/components/button/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { Loader } from '../../../shared/components/loader/loader';
import { ErrorState } from '../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-poll-detail',
  imports: [CommonModule, Button, Loader, ErrorState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './poll-detail.html',
  styleUrl: './poll-detail.css',
})
export class PollDetail implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private pollService = inject(PollService);
  private detailSubject = new BehaviorSubject<IDetailProps | null>(null);
  private authService = inject(AuthService);
  private destroyRef$ = inject(DestroyRef);
  private toastService = inject(ToastService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private detailLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<{ message: string; statusCode: number } | null>(null);
  error$ = this.errorSubject.asObservable();
  detailLoader$ = this.detailLoadingSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  voteObj$ = this.pollService.voteObj$;
  hasVoted$ = this.voteObj$.pipe(map((vote) => !!vote?.id));
  profile$ = this.authService.profile$;
  details$ = this.detailSubject.asObservable();
  selectedOption: number | null = null;
  hasVoted: boolean = false;
  poll_id!: string;

  ngOnInit(): void {
    this.poll_id = this.activatedRoute.snapshot.paramMap.get('poll_id') ?? '';
    this.pollService
      .loadSingleActivePoll(this.poll_id)
      .pipe(
        tap(() => {
          this.detailLoadingSubject.next(true);
        }),
        takeUntilDestroyed(this.destroyRef$),
        map((data) => {
          this.detailSubject.next(data);
        }),
      )
      .subscribe({
        next: () => {
          this.detailLoadingSubject.next(false);
        },
        error: (err) => {
          this.detailLoadingSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
        },
      });

    this.pollService
      .checkVotedPoll(this.poll_id)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe();

    this.voteObj$
      .pipe(
        takeUntilDestroyed(this.destroyRef$),
        map((vote) => !!vote?.id),
      )
      .subscribe((hasVoted) => (this.hasVoted = hasVoted));
  }

  viewResult(): void {
    this.router.navigateByUrl(`/app/result/${this.poll_id}`);
  }

  selectOption(id: number): void {
    if (this.hasVoted) return;
    this.selectedOption = id;
  }

  submitVote(): void {
    if (!this.selectedOption || this.hasVoted) return;

    this.toastService.pending('Logging in...');
    this.loadingSubject.next(true);

    this.pollService.castVote(this.poll_id, this.selectedOption.toString()).subscribe({
      next: (response) => {
        this.hasVoted = true;
        this.toastService.success(response.message, response.statusCode);
        this.loadingSubject.next(false);

        this.router.navigateByUrl(`/app/result/${this.poll_id}`);
      },
      error: (error) => {
        const error_message = error.error.message || 'An unknown error occurred';
        const status_code = error.error.statusCode || 500;
        this.toastService.error(error_message, status_code);
        this.loadingSubject.next(false);
      },
    });
  }
}
