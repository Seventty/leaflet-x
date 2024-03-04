import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
  ],
  declarations: [ModalComponent],
  exports: [
    ModalComponent
  ]
})
export class SharedModule { }
