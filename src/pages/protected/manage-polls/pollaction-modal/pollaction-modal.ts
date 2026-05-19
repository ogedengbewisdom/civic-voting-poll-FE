import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { Modal } from '../../../../shared/components/modal/modal';

@Component({
  selector: 'app-pollaction-modal',
  imports: [CommonModule, Button, Modal],
  templateUrl: './pollaction-modal.html',
  styleUrl: './pollaction-modal.css',
})
export class PollactionModal {
  @Input() title: string = 'Confirm action';
  @Input() message: string = 'Are you sure?';
  @Input() confirmLabel: string = 'Confirm';
  @Input() cancelLabel: string = 'Cancel';
  @Input() disabled!: boolean;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
