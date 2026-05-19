import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollactionModal } from './pollaction-modal';

describe('PollactionModal', () => {
  let component: PollactionModal;
  let fixture: ComponentFixture<PollactionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollactionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollactionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
