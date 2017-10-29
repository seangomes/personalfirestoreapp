import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddshopitemComponent } from './addshopitem.component';

describe('AddshopitemComponent', () => {
  let component: AddshopitemComponent;
  let fixture: ComponentFixture<AddshopitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddshopitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddshopitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
