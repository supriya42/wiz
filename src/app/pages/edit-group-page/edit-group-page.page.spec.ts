import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupPagePage } from './edit-group-page.page';

describe('EditGroupPagePage', () => {
  let component: EditGroupPagePage;
  let fixture: ComponentFixture<EditGroupPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
