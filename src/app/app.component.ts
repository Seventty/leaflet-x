import { Component } from '@angular/core';
import { GeoJsonResult } from './shared/types/geoJsonResult.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'leaflet-base';
  mapPrefix = "<a href='https://github.com/Seventty/leaflet-angular-base'>Leaflet Angular base</a> by <a href='https://github.com/Seventty'>Seventty</a>"
  watermarkImage = 'assets/watermark.png';

  featureCollectionFromMap?: GeoJsonResult;

  watchFeatureCollection(e){
    console.log("Emit from appcomponent", e)
  }

  defaultInitMapCoords:  L.LatLngExpression = [ 19.026319, -70.147792]

  //featureCollection: any = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-70.301514,18.760713]}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-71.466064,19.098458],[-71.295776,19.098458],[-71.28479,19.621892],[-71.466064,19.621892],[-71.466064,19.098458]]]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[-70.845337,19.709829],[-70.916748,18.838714]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-70.043335,19.50802]}}]}

  ngOnInit(): void {
  }
}
