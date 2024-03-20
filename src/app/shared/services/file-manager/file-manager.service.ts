import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  private $filesUploaded = new BehaviorSubject<any[]>([]);

  constructor() { }

  public getFilesUploaded(): Observable<File[]>{
    return this.$filesUploaded.asObservable()
  }

  public sendFilesUploaded(files: Array<File>){
    console.log("Archivos ya en el servicio", files)
  }


}
