import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LeafletXComponent } from './leaflet-x/leaflet-x.component'



@NgModule({
  declarations: [
    LeafletXComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LeafletXComponent
  ]
})
export class LeafletXModule { }
