import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  ]
})
export class LeafletXModule { }
