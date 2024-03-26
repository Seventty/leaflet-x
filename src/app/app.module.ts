import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { LeafletXModule } from 'LeafletX';


@NgModule({
  declarations: [
    MapComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    SharedModule,
    LeafletXModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
