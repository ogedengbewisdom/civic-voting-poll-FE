import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { PollService } from '../service/poll-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-polls',
  imports: [CommonModule, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './polls.html',
  styleUrl: './polls.css',
})
export class Polls implements OnInit {
  private pollService = inject(PollService);
  private router = inject(Router);
  stats$ = this.pollService.stats$;
  activePoll$ = this.pollService.activePolls$;
  currentPage = 1;
  itemsPerPage = 10;

  navigateToDetail(poll_id: number) {
    this.router.navigateByUrl(`app/polls/${poll_id}`);
  }
  onPageChange(page: number) {
    this.pollService.loadActivePoll(page, this.itemsPerPage).subscribe();
  }

  ngOnInit(): void {
    this.pollService.getDashboardStats().subscribe();
    this.pollService.loadActivePoll(this.currentPage, this.itemsPerPage).subscribe();
  }
}
