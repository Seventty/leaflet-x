import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload'
import { map, tap } from 'rxjs/operators'
import Swal from 'sweetalert2'
import { ToastService } from '../../services/toast/toast.service'


@Component({
  selector: 'UIFileUpload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {

  @Input() name: string = ''
  @Input() disabled = false

  @Input() fileLimit: number = 5;
  @Input() fileType: Array<string> = environment.allowedMapFileTypes;
  @Input() maxFileSize: number = environment.appMaxFileSize;
  @Input() mimeType: Array<string> = environment.allowedMapMimeTypes;

  //@Output() onFileAdded: EventEmitter<any> = new EventEmitter()
  multiple: boolean = false
  uploadedFiles!: Array<File>
  private onTouched: any = () => { }
  private onChanged: any = () => { }

  loading: boolean = false
  uploader?: FileUploader
  hasBaseDropZoneOver = false

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.multiple = this.fileLimit > 1
    this.uploader = new FileUploader({
      isHTML5: true,
      queueLimit: this.fileLimit,
      maxFileSize: this.maxFileSize * (Math.pow(1024, 2)),
      url: '',
    })

    this.uploader.onWhenAddingFileFailed = (fileItem, filter: any) => {
      if (filter.name == "mimeType")
        console.log(`Uno o varios de los archivos que se están tratando de cargar no son permitidos,
        Estos son los formatos permitidos: ${this.fileType.map(x => x)}`, 'Error')

      if (filter.name == "queueLimit")
      this.toastService.showToast("error", "Limite de archivos", `Solo se permiten ${this.fileLimit} archivo${this.fileLimit > 1 ? 's' : ''}`)

      if (filter.name == "fileSize")
      this.toastService.showToast("error", "Limite de tamaño", `El tamaño máximo por archivo es de ${this.maxFileSize}MB. Si necesita más espacio, escribirle al equipo de TI.`)
    }

    this.uploader.onAfterAddingFile = (item) => {
      const fileName = item._file.name.split(".").pop();
      item.remove();

      if (this.uploader) {
        if (environment.allowedMapFileTypes.includes(fileName || '')) {
          if (this.uploader.queue.filter(f => f._file.name == item._file.name).length == 0) {
            this.uploader.queue.push(item);
          } else {
            this.toastService.showToast("error", "Error", "No se puede importar un archivo repetido");
          }
        } else {
          this.toastService.showToast("error", "Error", `El formato .${fileName} no está soportado por el momento.`);
        }
      }
    };
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e
  }

  handleFile(element: HTMLElement): void {
    element.click()
  }

  addedFileToQueue() {
    if (this.uploader) {
      const files = this.uploader.queue.map(file => file?._file)
      this.uploadedFiles = files
      this.onChanged(files)
      this.onTouched()
      //this.onFileAdded.emit(this.selected);
    }
  }

  async removeFileFromQueue(item: any) {
    if (this.uploader) {
      item.remove()
      const files = this.uploader.queue.map(file => file?._file)
      this.uploadedFiles = files
      this.onChanged(files)
      this.onTouched()
      //this.onFileAdded.emit(this.selected);
    }
  }

  //control value accessor
  writeValue(value: any): void {
    this.uploadedFiles = value ?? null
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  public sendFiles(){
    /* Hacer un servicio para enviar el archivo al mapa */
    console.log("Archivo seleccionado", this.uploadedFiles)
  }

}
