import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepollModal } from './createpoll-modal';

describe('CreatepollModal', () => {
  let component: CreatepollModal;
  let fixture: ComponentFixture<CreatepollModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatepollModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatepollModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
