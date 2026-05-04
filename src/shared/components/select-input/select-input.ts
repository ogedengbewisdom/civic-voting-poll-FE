import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

interface IOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-input',
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInput),
      multi: true,
    },
  ],
  templateUrl: './select-input.html',
  styleUrl: './select-input.css',
})
export class SelectInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() options: IOption[] = [];
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';

  isOpen: boolean = false;
  selectedLabel: string = '';
  value: string = '';
  isDisabled: boolean = false;

  // called when value changes
  private onChange: (value: string) => void = () => {
    // console.log('onChange', value);
  };

  // called when field is touched
  private onTouched: () => void = () => {};

  // ControlValueAccessor methods
  // writeValue
  // registerOnChange
  // registerOnTouched
  // setDisabledState optional

  // writes value into component
  writeValue(value: string): void {
    this.value = value;
    const match = this.options.find((option) => option.value === value);
    this.selectedLabel = match ? match.label : '';
  }

  // registers your onChange handler
  registerOnChange(changeFn: (value: string) => void): void {
    this.onChange = changeFn;
  }

  // registers your onTouched handler
  registerOnTouched(touchFn: () => void): void {
    this.onTouched = touchFn;
  }

  // calls this when form is disabled
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      this.onTouched();
    }
  }

  selectOption(option: IOption): void {
    this.value = option.value;
    this.selectedLabel = option.label;
    this.isOpen = false;
    this.onChange(option.value);
    this.onTouched();
  }

  closeDropdown(): void {
    this.isOpen = false;
  }
}
