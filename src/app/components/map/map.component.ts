import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import "@geoman-io/leaflet-geoman-free";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IModalConfig } from 'src/app/shared/modal/IModalConfig';
import { IModalOption } from 'src/app/shared/modal/IModalOptions';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

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
    const actions: any = [
      "cancel",
      {
        text: "Cargar GeoJSON",
        onClick: () => {
          this.openUploadFileMapModal()
        },
      },
      {
        text: "Descargar GeoJSON",
        onClick: () => {
         console.log("Descargar GeoJSON")
        },
      },
    ];

    if (this.map) {
      this.map.pm.Toolbar.createCustomControl({
        name: "import",
        title: "Cargar GeoJSON",
        className: 'upload-map',
        actions: actions,
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

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  openUploadFileMapModal() {
    this.uploadModal?.open()
  }

}
