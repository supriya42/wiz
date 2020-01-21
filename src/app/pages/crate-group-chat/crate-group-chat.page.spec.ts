import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrateGroupChatPage } from './crate-group-chat.page';

describe('CrateGroupChatPage', () => {
  let component: CrateGroupChatPage;
  let fixture: ComponentFixture<CrateGroupChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrateGroupChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrateGroupChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
