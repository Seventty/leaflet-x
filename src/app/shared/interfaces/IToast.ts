import { SweetAlertResult } from "sweetalert2"

export interface IToast extends SweetAlertResult<any> {
  fire: any
  toast: boolean
  position: string
  showConfirmButton: boolean
  timer: number
  didOpen: () => {}
}
