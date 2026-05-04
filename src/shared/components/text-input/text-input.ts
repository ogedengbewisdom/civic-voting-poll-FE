import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
type TextInputType = 'text' | 'email' | 'number' | 'tel' | 'date';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput {
  @Input() formGroup!: FormGroup;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() errorMessage: string = '';
  @Input() type: TextInputType = 'text';
  @Input() hasError: boolean = false;
}
