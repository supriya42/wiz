import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryPage } from './gallary.page';

describe('GallaryPage', () => {
  let component: GallaryPage;
  let fixture: ComponentFixture<GallaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
