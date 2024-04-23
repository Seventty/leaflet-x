import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletXModule } from 'LeafletX';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ComponentsModule
    /* LeafletXModule */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
