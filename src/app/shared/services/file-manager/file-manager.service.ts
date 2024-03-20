import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as topojson from "topojson-client";

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  private filesUploaded: Array<File> = []
  //private $filesUploaded = new BehaviorSubject<any[]>([]);

  constructor() { }

  /* public getFilesUploaded(): Observable<File[]>{
    return this.$filesUploaded.asObservable()
  } */

  public sendFilesUploaded(files: Array<File>) {
    this.filesUploaded = files;
    this.readFiles(files)
  }

  public readFiles(files: Array<File>) {
    files.forEach((file: File) => {
      const fileType = this.detectType(file)

    });
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


  private topologyParse(text: string) {
    const topoJsonParse = JSON.parse(text);

    const collection = {
      type: 'FeatureCollection',
      features: []
    };

    for (const element in topoJsonParse?.objects) {
      const ft: any = topojson.feature(topoJsonParse, topoJsonParse.objects[element]);
      if (ft.features) {
        collection.features = collection.features.concat(ft.features);
        console.log("Todos los features", ft.features)
      }
    }


  }

  /* const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const textResult = e.target?.result as string;
        this.topologyParse(textResult);
      };
      reader.readAsText(file); */

}
