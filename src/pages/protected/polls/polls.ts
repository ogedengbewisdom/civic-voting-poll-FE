import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-polls',
  imports: [CommonModule, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './polls.html',
  styleUrl: './polls.css',
})
export class Polls {
  totalPages: number = 2;
  onVote(pollId: string): void {
    console.log('Voting on poll:', pollId);
    // Navigate to poll detail / vote page
  }

  onViewResults(pollId: string): void {
    console.log('Viewing results for poll:', pollId);
  }
}
