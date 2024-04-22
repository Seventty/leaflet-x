import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileExportComponent } from './components/file-export/file-export.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FileUploadModule,
  ],
  declarations: [
    ModalComponent,
    FileUploadComponent,
    FileExportComponent
  ],
  exports: [
    ModalComponent,
    FileUploadComponent,
    FileExportComponent
  ]
})
export class SharedModule { }
