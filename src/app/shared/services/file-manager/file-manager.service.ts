import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as topojson from "topojson-client";
import * as toGeoJson from "@tmcw/togeojson";
import { ToastService } from '../toast/toast.service';
import * as osmtogeojsonModule from 'osmtogeojson';
import { GeoJsonResult } from '../../types/geoJsonResult.type';
import { GeoJsonNormalize } from '../../utils/geoJsonNormalize';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private $featureCollection = new BehaviorSubject<GeoJsonResult>({
    type: "FeatureCollection",
    features: []
  });

  constructor(private toastService: ToastService) { }

  public getFileFeatureCollection(): Observable<GeoJsonResult>{
    return this.$featureCollection.asObservable()
  }

  private setFeatureCollection(geojsonResult: GeoJsonResult){
    this.$featureCollection.next(geojsonResult)
  }

  public sendFilesUploaded(files: Array<File>) {
    this.readAsText(files)
  }

  private readAsText(files: Array<File>) {
    files.forEach((file: File) => {
      const fileType = this.detectType(file)
      const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const textResult = e.target?.result as string;
        this.readFile(fileType, textResult)
      };
      reader.readAsText(file);
    });
  }

  private readFile(fileType: string, content: string) {
    switch (fileType) {
      case "kml":
        this.setFeatureCollection(this.normalizeFeatureCollection(this.kmlHandler(content)) as GeoJsonResult)
        break;
      case "gpx":
        this.setFeatureCollection(this.normalizeFeatureCollection(this.gpxHandler(content)) as GeoJsonResult)
        break;
      case "geojson":
        this.setFeatureCollection(this.normalizeFeatureCollection(this.geoJsonHandler(content)) as GeoJsonResult)
        break;
      case "xml":
        //this.xmlHandler(content)
        break;
      case "dsv":
        break;
      case "xml":
        break;
      case "poly":
        break;
    }
  }

  private normalizeFeatureCollection(geoJson: GeoJsonResult){
    const normalizer: GeoJsonNormalize = new GeoJsonNormalize;
    return normalizer.normalize(geoJson);
  }

  private detectType(file: File): string {
    const filename: string = file.name ? file.name.toLowerCase() : '';
    const fileExtension = (extension: string) => filename.indexOf(extension) !== -1;

    if (file.type === 'application/vnd.google-earth.kml+xml' || fileExtension('.kml')) return 'kml';
    if (fileExtension('.gpx')) return 'gpx';
    if (fileExtension('.geojson') || fileExtension('.json') || fileExtension('.topojson')) return 'geojson';
    if (file.type === 'text/csv' || fileExtension('.csv') || fileExtension('.tsv') || fileExtension('.dsv')) return 'dsv'
    if (fileExtension('.xml') || fileExtension('.osm')) return 'xml';
    if (fileExtension('.poly')) return 'poly';

    return '';
  }


  private kmlHandler(content: string): GeoJsonResult {
    const kmlDom: Document = this.toDom(content)
    if (!kmlDom) this.toastService.errorToast('Invalido', 'Archivo KML inválido: XML no válido');
    if (kmlDom.getElementsByTagName('NetworkLink').length) this.toastService.warningToast("¡Advertencia!", "El archivo KML que subiste incluía NetworkLinks: es posible que parte del contenido no se muestre. Exporte y cargue KML sin NetworkLinks para obtener un rendimiento óptimo");
    return toGeoJson.kml(kmlDom)
  }

  private xmlHandler(content: string) {
    const xmlDom: Document = this.toDom(content);
    if (!xmlDom) this.toastService.errorToast('Error', 'Archivo XML invalido');
    console.log(xmlDom)
    //const result = osmtogeojson.toGeojson(xmlDom);
    //console.log("Resultados", result)
  }

  private gpxHandler(content: string): GeoJsonResult {
    return toGeoJson.gpx(this.toDom(content));
  }

  private geoJsonHandler(content: string) {
    try {
      const geoJsonResult = JSON.parse(content);
      if (geoJsonResult && geoJsonResult.type === 'Topology' && geoJsonResult) {
        const collection: GeoJsonResult = {
          type: 'FeatureCollection',
          features: []
        };
        for (const objName in geoJsonResult.objects) {
          const obj = geoJsonResult.objects[objName];
          const ft: GeoJsonResult | any = topojson.feature(geoJsonResult, obj);
          if (ft.features) {
            collection.features = collection.features.concat(ft.features);
          }
        }
        return collection;
      } else {
        return geoJsonResult;
      }
    } catch (error) {
      this.toastService.errorToast("Error", "Archivo JSON inválido");
    }
  }

  private toDom(e: any): Document {
    return new DOMParser().parseFromString(e, 'text/xml')
  }

}
