import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollResult } from './poll-result';

describe('PollResult', () => {
  let component: PollResult;
  let fixture: ComponentFixture<PollResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
