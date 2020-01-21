import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBillPage } from './post-bill.page';

describe('PostBillPage', () => {
  let component: PostBillPage;
  let fixture: ComponentFixture<PostBillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostBillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
