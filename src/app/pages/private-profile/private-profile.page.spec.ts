import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateProfilePage } from './private-profile.page';

describe('PrivateProfilePage', () => {
  let component: PrivateProfilePage;
  let fixture: ComponentFixture<PrivateProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
