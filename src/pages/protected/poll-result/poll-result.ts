import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../service/poll-service';
import { StateService } from '../../../shared/service/state-service';
import { IOption } from '../../../shared/components/select-input/select-input';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poll-result',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './poll-result.html',
  styleUrl: './poll-result.css',
})
export class PollResult implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private stateService = inject(StateService);
  state$!: Observable<IOption[]>;
  pollResult$ = this.pollService.pollResult$;
  poll_id!: string;
  selectedState: string = 'all';

  ngOnInit(): void {
    this.poll_id = this.activatedRoute.snapshot.paramMap.get('poll_id') ?? '';

    this.pollService.loadPollResultByPollId(this.poll_id).subscribe();
    this.state$ = this.stateService.getStates();
  }
  onStateChange(): void {
    const stateId = this.selectedState === 'all' ? undefined : this.selectedState;

    this.pollService.loadPollResultByPollId(this.poll_id, stateId).subscribe();
  }
}
