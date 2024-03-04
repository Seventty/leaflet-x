import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { IModalConfig } from './IModalConfig'
import { IModalOption } from './IModalOptions'

@Component({
  selector: 'UIModal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalConfig?: IModalConfig
  @Input() modalOption?: IModalOption
  @ViewChild('modal') private modalContent?: TemplateRef<ModalComponent>
  private modalRef?: NgbModalRef | undefined
  @ContentChild('modalBody') contentRef?: TemplateRef<any>

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static'
    config.keyboard = false
  }

  ngOnInit(): void {
  }

  get modalClosed() {
    return this.modalRef?.closed
  }

  get modalDismissed() {
    return this.modalRef?.dismissed
  }

  open(): Promise<boolean> {
    this.modalService.activeInstances
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent,
    { ...this.modalOption }
        )
        this.modalRef.result.then(resolve, resolve)
      })
    }

    async close(): Promise<void> {
      if (this.modalConfig?.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig?.onClose === undefined || (await this.modalConfig.onClose())
      this.modalRef?.close(result)
    }
  }
  async dismiss(): Promise<void> {
    if (this.modalConfig?.shouldDismiss === undefined || (await this.modalConfig.shouldDismiss())) {
      const result = this.modalConfig?.onDismiss === undefined || (await this.modalConfig.onDismiss())
      this.modalRef?.dismiss(result)
    }
  }

}
