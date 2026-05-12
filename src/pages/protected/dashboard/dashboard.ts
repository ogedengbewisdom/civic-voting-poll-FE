import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  onVote(pollId: string): void {
    console.log('Voting on poll:', pollId);
    // Navigate to poll detail / vote page
  }

  onViewResults(pollId: string): void {
    console.log('Viewing results for poll:', pollId);
  }
}
