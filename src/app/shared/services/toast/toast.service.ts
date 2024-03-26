import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastText: string = '';
  /* Icons availables: 'success' | 'error' | 'warning' | 'info' | 'question' */
  private toastIcon: SweetAlertIcon = 'success';
  private toastTitle: string = '';

  private toastObject: SweetAlertOptions = {
    text: this.toastText,
    icon: this.toastIcon,
    title: this.toastTitle,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    showCloseButton: true,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  }

  constructor() { }

  public errorToast(title: string, text: string = ''){
    this.toastObject.title = title
    this.toastObject.icon = "error";
    this.toastObject.text = text;
    Swal.fire(this.toastObject)
  }

  public successToast(title: string, text: string = ''){
    this.toastObject.title = title
    this.toastObject.icon = "success";
    this.toastObject.text = text;
    Swal.fire(this.toastObject)
  }

  public infoToast(title: string, text: string = ''){
    this.toastObject.title = title
    this.toastObject.icon = "info";
    this.toastObject.text = text;
    Swal.fire(this.toastObject)
  }

  public warningToast(title: string, text: string = ''){
    this.toastObject.title = title
    this.toastObject.icon = "warning";
    this.toastObject.text = text;
    Swal.fire(this.toastObject)
  }

}
