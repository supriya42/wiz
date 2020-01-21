import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProfilePage } from './own-profile.page';

describe('OwnProfilePage', () => {
  let component: OwnProfilePage;
  let fixture: ComponentFixture<OwnProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
