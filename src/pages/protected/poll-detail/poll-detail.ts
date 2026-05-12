import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
interface PollOption {
  label: string;
  id: string;
}

interface PollResult {
  label: string;
  pct: number;
  votes: number;
  leading: boolean;
}
@Component({
  selector: 'app-poll-detail',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './poll-detail.html',
  styleUrl: './poll-detail.css',
})
export class PollDetail {
  selectedOption: string | null = null;
  hasVoted: boolean = false;

  options: PollOption[] = [
    { id: 'roads', label: 'Road networks & highways' },
    { id: 'electricity', label: 'Electricity & power supply' },
    { id: 'water', label: 'Clean water & sanitation' },
    { id: 'internet', label: 'Internet & digital infrastructure' },
  ];

  results: PollResult[] = [
    { label: 'Electricity & power', pct: 38, votes: 474, leading: true },
    { label: 'Road networks', pct: 29, votes: 362, leading: false },
    { label: 'Clean water', pct: 21, votes: 262, leading: false },
    { label: 'Internet & digital', pct: 12, votes: 150, leading: false },
  ];

  selectOption(id: string): void {
    if (this.hasVoted) return;
    this.selectedOption = id;
  }

  submitVote(): void {
    if (!this.selectedOption || this.hasVoted) return;
    this.hasVoted = true;
    // TODO: send selectedOption to your API/service
    console.log('Vote submitted:', this.selectedOption);
  }
}
