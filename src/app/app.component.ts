import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'leaflet-base';
  mapPrefix = "<a href='https://github.com/Seventty/leaflet-angular-base'>Leaflet Angular base</a> by <a href='https://github.com/Seventty'>Seventty</a>"
  watermarkImage = 'assets/watermark.png'
}
