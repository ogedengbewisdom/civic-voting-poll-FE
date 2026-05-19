import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../shared/components/button/button';
import { PollService } from '../service/poll-service';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { IDetailProps } from '../interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PollactionModal } from './pollaction-modal/pollaction-modal';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { Modal } from '../../../shared/components/modal/modal';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  arrayErrorMessage,
  errorArrayState,
  errorState,
  getErrorMessage,
} from '../../../shared/utils';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { TextArea } from '../../../shared/components/text-area/text-area';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ErrorState } from '../../../shared/components/error-state/error-state';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-manage-polls',
  imports: [
    CommonModule,
    TextInput,
    Button,
    Pagination,
    PollactionModal,
    Modal,
    ReactiveFormsModule,
    TextArea,
    FormsModule,
    EmptyState,
    ErrorState,
    Loader,
  ],
  templateUrl: './manage-polls.html',
  styleUrl: './manage-polls.css',
})
export class ManagePolls implements OnInit {
  private pollService = inject(PollService);
  private detailSubject = new BehaviorSubject<IDetailProps | null>(null);
  private destroyRef$ = inject(DestroyRef);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private pollLoadingSubject = new BehaviorSubject<boolean>(false);
  private detailLoadingSubject = new BehaviorSubject<boolean>(false);
  private formBuilder = inject(FormBuilder);
  private errorSubject = new BehaviorSubject<{ message: string; statusCode: number } | null>(null);
  error$ = this.errorSubject.asObservable();
  private detailErrorSubject = new BehaviorSubject<{ message: string; statusCode: number } | null>(
    null,
  );
  detailLoader$ = this.detailLoadingSubject.asObservable();
  detailError$ = this.detailErrorSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  pollLoader$ = this.pollLoadingSubject.asObservable();
  details$ = this.detailSubject.asObservable();
  polls$ = this.pollService.allPolls$;
  currentPage = 1;
  itemsPerPage = 10;
  menuOpened: boolean = false;
  selectedPollId: number | null = null;
  showCloseModal: boolean = false;
  showDeleteModal: boolean = false;
  showActivateModal: boolean = false;
  showFormModal: boolean = false;
  pollForm!: FormGroup;
  loadDetailForm: IDetailProps | null = null;
  searchControl = new FormControl('');

  buildForm() {
    const createOptionGroup = (id: number | null, option_text: string) =>
      this.formBuilder.group({
        id: [id as number | null],
        option_text: [option_text, [Validators.required, Validators.minLength(2)]],
      });

    const defaultOptions = [createOptionGroup(null, ''), createOptionGroup(null, '')];

    const optionGroups = this.loadDetailForm
      ? this.loadDetailForm.poll_option.map((option) =>
          this.formBuilder.group({
            id: [option.id],
            option_text: [option.option_text, [Validators.required, Validators.minLength(2)]],
          }),
        )
      : defaultOptions;
    this.pollForm = this.formBuilder.group({
      title: [
        this.loadDetailForm ? this.loadDetailForm.title : '',
        [Validators.required, Validators.minLength(3)],
      ],
      description: [
        this.loadDetailForm ? this.loadDetailForm.description : '',
        [Validators.required, Validators.minLength(10)],
      ],
      poll_options: this.formBuilder.array(optionGroups),
    });
  }

  get controls() {
    return this.pollForm.controls;
  }

  get poll_option_array() {
    return this.pollForm.get('poll_options') as FormArray;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  hasArrayError = (fieldName: string, index: number) =>
    errorArrayState(fieldName, index, this.poll_option_array.controls);

  getArrayErrorMessage = (fieldName: string, index: number) =>
    arrayErrorMessage(fieldName, index, this.poll_option_array.controls);

  addOption(): void {
    if (this.poll_option_array.length >= 4) return;
    this.poll_option_array.push(
      this.formBuilder.group({
        id: [null],
        option_text: ['', [Validators.required, Validators.minLength(2)]],
      }),
    );
  }

  removeOption(index: number): void {
    if (this.poll_option_array.length <= 2) return;
    this.poll_option_array.removeAt(index);
  }

  submitForm(): void {
    if (this.pollForm.invalid) return;

    const isEdit = !!this.selectedPollId;

    const payload = {
      ...this.pollForm.value,
      poll_options: this.pollForm.value.poll_options.map((opt: any) =>
        isEdit ? { ...(opt?.id && { id: opt.id }), option_text: opt.option_text } : opt.option_text,
      ),
    };

    this.toastService.pending('Loading...');
    this.loadingSubject.next(true);

    if (isEdit) {
      // call update service
      this.pollService.updatePoll(this.selectedPollId!, payload).subscribe({
        next: (data) => {
          this.loadingSubject.next(false);
          this.toastService.success(data.message, data.statusCode);
          this.showFormModal = false;
          this.menuOpened = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.toastService.error(error_message, status_code);
        },
      });
    } else {
      this.pollService.createPoll(payload).subscribe({
        next: (data) => {
          this.loadingSubject.next(false);
          this.toastService.success(data.message, data.statusCode);
          this.showFormModal = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.toastService.error(error_message, status_code);
        },
      });
    }
  }
  onCancelPollForm() {
    this.showFormModal = false;
    this.selectedPollId = null;
  }

  onOpenForm(id?: number) {
    this.showFormModal = true;

    if (id) {
      this.selectedPollId = id;
      const poll_id = id.toString();
      this.pollService
        .loadSingleActivePoll(poll_id)
        .pipe(
          takeUntilDestroyed(this.destroyRef$),
          map((data) => {
            this.loadDetailForm = data;
            this.buildForm();
            this.cdr.markForCheck();
          }),
        )
        .subscribe();
    } else {
      this.loadDetailForm = null;
      this.buildForm();
    }
  }
  onClose(id: number): void {
    this.selectedPollId = id;
    this.showCloseModal = true;
  }

  onDelete(id: number) {
    this.selectedPollId = id;
    this.showDeleteModal = true;
  }

  onActivate(id: number) {
    this.selectedPollId = id;
    this.showActivateModal = true;
  }

  cancelActivateModal(): void {
    this.showActivateModal = false;
    this.selectedPollId = null;
  }

  cancelDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedPollId = null;
  }

  cancelCloseModal(): void {
    this.showCloseModal = false;
    this.selectedPollId = null;
  }

  activatePoll(): void {
    if (!this.selectedPollId) return;
    this.loadingSubject.next(true);
    this.toastService.pending('Loading ...');
    this.pollService.activatePoll(this.selectedPollId).subscribe({
      next: (data) => {
        this.loadingSubject.next(false);
        this.toastService.success(data.message, data.statusCode);
        this.menuOpened = false;
        this.showActivateModal = false;
        this.selectedPollId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingSubject.next(false);
        const error_message = error.error.message || 'An unknown error occurred';
        const status_code = error.error.statusCode || 500;
        this.toastService.error(error_message, status_code);
      },
    });
  }

  deletePoll(): void {
    if (!this.selectedPollId) return;
    this.loadingSubject.next(true);
    this.toastService.pending('Loading ...');

    this.pollService.deletePoll(this.selectedPollId).subscribe({
      next: (data) => {
        this.loadingSubject.next(false);
        this.toastService.success(data.message, data.statusCode);
        this.menuOpened = false;
        this.showDeleteModal = false;
        this.selectedPollId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingSubject.next(false);
        const error_message = error.error.message || 'An unknown error occurred';
        const status_code = error.error.statusCode || 500;
        this.toastService.error(error_message, status_code);
        // this.loadingSubject.next(false);
      },
    });
  }

  closePoll(): void {
    if (!this.selectedPollId) return;
    this.loadingSubject.next(true);
    this.toastService.pending('Loading ...');
    this.pollService.closePoll(this.selectedPollId).subscribe({
      next: (data) => {
        this.loadingSubject.next(false);
        this.toastService.success(data.message, data.statusCode);
        this.menuOpened = false;
        this.showCloseModal = false;
        this.selectedPollId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingSubject.next(false);
        const error_message = error.error.message || 'An unknown error occurred';
        const status_code = error.error.statusCode || 500;
        this.toastService.error(error_message, status_code);
        // this.loadingSubject.next(false);
      },
    });
  }

  loadAllPolls(page: number, search?: string) {
    this.pollService
      .loadAllPoll(page, this.itemsPerPage, search)
      .pipe(
        tap(() => {
          this.pollLoadingSubject.next(true);
        }),
      )
      .subscribe({
        next: (data) => {
          this.pollLoadingSubject.next(false);
        },
        error: (err) => {
          this.pollLoadingSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.errorSubject.next({ message: error_message, statusCode: status_code });
        },
      });
  }

  ngOnInit(): void {
    this.loadAllPolls(this.currentPage);
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((key) => {
        // console.log('key', key);
        this.loadAllPolls(1, key ?? '');
      });
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  onPageChange(page: number) {
    // console.log(page);
    this.pollService.loadAllPoll(page, this.itemsPerPage).subscribe({
      next: (data) => {
        // console.log(data);
      },
      error: (err) => {
        const error_message = err.error.message || 'An unknown error occurred';
        const status_code = err.error.statusCode || 500;
        this.errorSubject.next({ message: error_message, statusCode: status_code });
      },
    });
  }

  viewResult(id: number): void {
    this.router.navigateByUrl(`/app/result/${id}`);
  }

  managePoll(id: number) {
    const poll_id = id.toString();
    this.menuOpened = !this.menuOpened;
    this.pollService
      .loadSingleActivePoll(poll_id)
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
        next: (data) => {
          this.detailLoadingSubject.next(false);
        },
        error: (err) => {
          this.detailLoadingSubject.next(false);
          const error_message = err.error.message || 'An unknown error occurred';
          const status_code = err.error.statusCode || 500;
          this.detailErrorSubject.next({ message: error_message, statusCode: status_code });
        },
      });
  }
}
