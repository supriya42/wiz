import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillboardPage } from './billboard.page';

describe('BillboardPage', () => {
  let component: BillboardPage;
  let fixture: ComponentFixture<BillboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
