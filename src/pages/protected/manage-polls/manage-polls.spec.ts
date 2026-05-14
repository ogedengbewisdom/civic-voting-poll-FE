import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePolls } from './manage-polls';

describe('ManagePolls', () => {
  let component: ManagePolls;
  let fixture: ComponentFixture<ManagePolls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePolls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePolls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
