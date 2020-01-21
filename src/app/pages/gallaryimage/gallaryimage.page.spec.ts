import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryimagePage } from './gallaryimage.page';

describe('GallaryimagePage', () => {
  let component: GallaryimagePage;
  let fixture: ComponentFixture<GallaryimagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallaryimagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryimagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
