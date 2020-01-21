import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbouusPage } from './abouus.page';

describe('AbouusPage', () => {
  let component: AbouusPage;
  let fixture: ComponentFixture<AbouusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbouusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbouusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
