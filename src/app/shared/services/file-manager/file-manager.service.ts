import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as topojson from "topojson-client";
import * as toGeoJson from "@tmcw/togeojson";
import { ToastService } from '../toast/toast.service';
import * as osmtogeojsonModule from 'osmtogeojson';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  private filesUploaded: Array<File> = []
  //private $filesUploaded = new BehaviorSubject<any[]>([]);

  constructor(private toastService: ToastService) { }

  /* public getFilesUploaded(): Observable<File[]>{
    return this.$filesUploaded.asObservable()
  } */

  public sendFilesUploaded(files: Array<File>) {
    this.filesUploaded = files;
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
        this.kmlHandler(content)
        break;

      case "xml":
        this.xmlHandler(content)
        break;

      case "gpx":
        this.gpxHandler(content)
        break;

      case "geojson":
        this.geoJsonHandler(content);
        break;

      case "dsv":
        //this.dsvHandler(content);
        break;
      case "xml":

        break;
      case "poly":

        break;
    }
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


  private kmlHandler(content: string) {
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

  private gpxHandler(content: string) {
    const gpxParse = toGeoJson.gpx(this.toDom(content));
    console.log("Parseado a gpx, continuar cuando haya un archivo", gpxParse)
  }

  private geoJsonHandler(content: string) {
    try {
      const geoJsonResult = JSON.parse(content);
      if (geoJsonResult && geoJsonResult.type === 'Topology' && geoJsonResult.objects) {
        const collection = {
          type: 'FeatureCollection',
          features: []
        };
        for (const obj in geoJsonResult.objects) {
          const ft: any = topojson.feature(geoJsonResult, geoJsonResult.objects[obj]);
          if (ft.features) {
            collection.features = collection.features.concat(ft.features);
            console.log(collection.features)
          }
        }
      }
      else {
        console.log(geoJsonResult)
      }
    } catch (error) {
      this.toastService.errorToast("Error", "Archivo JSON inválido")
    }
  }

  private toDom(e: any): Document {
    return new DOMParser().parseFromString(e, 'text/xml')
  }

  /* const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const textResult = e.target?.result as string;
        this.topologyParse(textResult);
      };
      reader.readAsText(file); */

}
