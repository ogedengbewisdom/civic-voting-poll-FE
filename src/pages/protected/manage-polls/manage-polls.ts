import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../shared/components/button/button';
import { PollService } from '../service/poll-service';
import { Pagination } from '../../../shared/components/pagination/pagination';

interface Poll {
  id: string;
  title: string;
  optionCount: number;
  createdDate: string;
  status: 'active' | 'closed';
  votes: number;
}

@Component({
  selector: 'app-manage-polls',
  imports: [CommonModule, Button, Pagination],
  templateUrl: './manage-polls.html',
  styleUrl: './manage-polls.css',
})
export class ManagePolls implements OnInit {
  private pollService = inject(PollService);
  polls$ = this.pollService.allPolls$;
  currentPage = 1;
  itemsPerPage = 10;
  menuOpened: boolean = false;

  loadAllPolls() {
    this.pollService.loadAllPoll(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        // console.log(data);
      },
      error: (error) => {},
    });
  }

  ngOnInit(): void {
    this.loadAllPolls();
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  onNewPoll(): void {
    // TODO: open create poll modal or navigate to create page
    console.log('Create new poll');
  }

  onPageChange(page: number) {
    // console.log(page);
    this.pollService.loadAllPoll(page, this.itemsPerPage).subscribe({
      next: (data) => {
        // console.log(data);
      },
    });
  }

  managePoll(id: number) {
    console.log(id);
    this.menuOpened = !this.menuOpened;
  }
}
