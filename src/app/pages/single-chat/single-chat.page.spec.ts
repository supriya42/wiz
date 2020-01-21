import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChatPage } from './single-chat.page';

describe('SingleChatPage', () => {
  let component: SingleChatPage;
  let fixture: ComponentFixture<SingleChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
