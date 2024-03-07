import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import "@geoman-io/leaflet-geoman-free";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IModalConfig } from 'src/app/shared/modal/IModalConfig';
import { IModalOption } from 'src/app/shared/modal/IModalOptions';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map?: L.Map;
  private defaultMapLocation: L.LatLngExpression = [19.026319, -70.147792]
  private defaultZoomLevel: number = 8;
  private defaultMaxZoom: number = 18
  private defaultMinZoom: number = 3
  @ViewChild("uploadModal") uploadModal?: ModalComponent

  modalConfig: IModalConfig = {
    modalTitle: 'Cargar GeoJSON',
    dashboardHeader: true,
  }

  modalOption: IModalOption = {
    centered: true,
    size: 'lg',
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.defaultMapLocation,
      zoom: this.defaultZoomLevel,
      zoomControl: false,
    });

    this.geomanControllers();

    const tiles: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.defaultMaxZoom,
      minZoom: this.defaultMinZoom,
      /*
      *copyright message below
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
       */
    });

    tiles.addTo(this.map);
  }

  private geomanControllers() {
    if (this.map) {
      L.control.zoom({
        position: "topright",
        zoomInTitle: 'Acercar',
        zoomOutTitle: 'Alejar'
      }).addTo(this.map);

      this.map.pm.addControls({
        position: 'topright',
        drawCircle: false,
        drawCircleMarker: false,
        drawText: false,
        drawMarker: false,
        cutPolygon: false,
        editControls: true
      });

      this.map.pm.setLang('es');

      const newMarker: any = this.map.pm.Toolbar.copyDrawControl('drawMarker', { name: "newMarker" })
      newMarker.drawInstance.setOptions({ markerStyle: { icon: this.iconMarker("#00b8e6") } });

      this.customToolbar();
    }
  }

  private customToolbar() {
    const customToolbarActions: any = [
      {
        text: "Importar GeoJSON",
        onClick: () => {
          this.openUploadFileMapModal()
        },
      },
      {
        text: "Exportar GeoJSON",
        onClick: () => {
          this.exportGeoJson();
        },
      },
      "cancel",
    ];

    if (this.map) {
      this.map.pm.Toolbar.createCustomControl({
        name: "import",
        title: "Cargar GeoJSON",
        className: 'upload-map',
        actions: customToolbarActions
      });
    }
  }

  private iconMarker(color: string): L.DivIcon {
    const markerHtmlStyles = `
    background: ${color};
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    border: 1px solid #fff;
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -15px 0 0 -15px;`;

    const icon = L.divIcon({
      className: "my-custom-pin",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      html: `<span style="${markerHtmlStyles}"/>`
    });

    L.Marker.prototype.options.icon = icon;

    return icon;
  }

  exportGeoJson(){
    this.toastService.showToast("error", "Error", "Capa vacia, se requiere dibujar algo para poder exportar.");
    console.log("Capas a exportar", this.map?.pm.getGeomanDrawLayers())
  }

  constructor(private toastService: ToastService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  openUploadFileMapModal() {
    this.uploadModal?.open()
  }

}
