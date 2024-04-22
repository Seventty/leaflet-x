import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import "@geoman-io/leaflet-geoman-free";
import { IModalConfig } from 'src/app/shared/modal/IModalConfig';
import { IModalOption } from 'src/app/shared/modal/IModalOptions';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { IBaseLayer } from 'src/app/shared/interfaces/IBaseLayer';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FileManagerService } from 'src/app/shared/services/file-manager/file-manager.service';
import { Watermark } from 'src/app/shared/utils/watermark.control';
import { GeoJsonResult } from 'src/app/shared/types/geoJsonResult.type';
import { v4 as uuidv4 } from 'uuid';
import { HexColorType } from 'src/app/shared/types/hexColor.type';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  public mapId: string = 'map';
  private map?: L.Map;
  private featureGroup?: L.FeatureGroup;
  private defaultMapLocation: L.LatLngExpression = [19.026319, -70.147792]
  private defaultZoomLevel: number = 8;
  private defaultMaxZoom: number = 18
  private defaultMinZoom: number = 3

  @ViewChild("fileManagerModal") fileManagerModal?: ModalComponent
  @ViewChild("fileExportModal") fileExportModal?: ModalComponent
  @Input() prefix: string = '';
  @Input() watermarkImagePath: string = '';
  @Input() featureCollectionInput?: GeoJsonResult;
  @Input() readonly: boolean = false;
  @Input() mainColor: HexColorType = '#00b8e6';
  @Output() featureCollectionOutput: EventEmitter<GeoJsonResult> = new EventEmitter<GeoJsonResult>()

  featureCollection: GeoJsonResult = {
    type: 'FeatureCollection',
    features: []
  };

  /**
  * Configuration for the file uploader modal.
  * @type {IModalConfig}
  */
  fileManagerModalConfig: IModalConfig = {
    modalTitle: 'Importar Archivo/s',
    dashboardHeader: true,
  }

  /**
  * Options for file uploader the modal.
  * @type {IModalOption}
  */
  fileManagerModalOption: IModalOption = {
    centered: true,
    size: 'md',
  }

  /**
  * Configuration for the file uploader modal.
  * @type {IModalConfig}
  */
  fileExportModalConfig: IModalConfig = {
    modalTitle: 'Exportar Archivo',
    dashboardHeader: true,
  }

  /**
  * Options for file uploader the modal.
  * @type {IModalOption}
  */
  fileExportModalOption: IModalOption = {
    centered: true,
    size: 'md',
  }

  /**
  * Initializes the map.
  * @private
  * @returns {void}
  */
  private initMap(): void {
    this.map = L.map(this.mapId, {
      center: this.defaultMapLocation,
      zoom: this.defaultZoomLevel,
      zoomControl: false,
    });
  }

  /**
  * Sets up the feature group.
  * @private
  * @returns {void}
  */
  private setFeatureGroup() {
    this.featureGroup = new L.FeatureGroup();
    this.map?.addLayer(this.featureGroup)
  }

  /**
  * Switches the base layer of the map.
  * @private
  * @returns {void}
  */
  private switchBaseLayer(): void {
    /* All free BaseLayer available > https://leaflet-extras.github.io/leaflet-providers/preview/ */

    const baseLayers: IBaseLayer = {
      "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      "Outdoor": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
      "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
      "light": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
      "Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
    }

    if (this.map) {
      const baseLayerSwitcherController: L.Control = L.control.layers(baseLayers).addTo(this.map);
      const defaultBaseLayerProvider: string = localStorage.getItem('layerMapProvider') || "Default";
      const defaultBaseLayer = baseLayers[defaultBaseLayerProvider]
      if (defaultBaseLayer) {
        defaultBaseLayer.addTo(this.map);
      }
      this.map.on('baselayerchange', (event: any) => {
        localStorage.setItem('layerMapProvider', event.name)
      });
    }
  }

  /**
  * Sets up Geoman controllers for the map.
  * @private
  * @returns {void}
  */
  private geomanControllers() {
    if (this.map) {
      this.map.attributionControl.setPrefix(this.prefix);

      L.control.zoom({
        position: "topright",
        zoomInTitle: 'Acercar',
        zoomOutTitle: 'Alejar'
      }).addTo(this.map);

      if (!this.readonly) {
        this.map.pm.addControls({
          position: 'topright',
          drawCircle: false,
          drawCircleMarker: false,
          drawText: false,
          drawMarker: false,
          cutPolygon: true,
          editControls: true,
        });

        //this.map.pm.setLang('es');

        this.map.on('pm:create', (e: any) => {
          this.featureGroup?.addLayer(e.layer);
        });

        const newMarker: any = this.map.pm.Toolbar.copyDrawControl('drawMarker', { name: "newMarker" })
        newMarker.drawInstance.setOptions({ markerStyle: { icon: this.iconMarker(this.mainColor) } });
        this.map.pm.setPathOptions({
          color: this.mainColor,
          fillColor: this.mainColor,
          fillOpacity: 0.4,
        });
      }
    }
  }

  /**
  * Configures a custom toolbar for the map.
  * @private
  * @returns {void}
  */
  private customToolbar() {
    const customToolbarActions: any = [
      {
        text: "Importar archivo/s",
        onClick: () => {
          this.fileManagerModal?.open();
        },
      },
      {
        text: "Exportar archivo/s",
        onClick: () => {
          this.updateFeatureCollection()
          if (this.featureCollection.features.length === 0) {
            this.toastService.errorToast("Mapa vacio", "No hay dibujos para exportar.");
            return;
          }
          this.fileExportModal?.open();
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

  /**
  * Creates a custom icon for marker.
  * @private
  * @param {string} color - Color of the marker.
  * @returns {L.DivIcon} - Leaflet DivIcon object.
  */
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

  /**
  * Configures watermark on the map.
  * @private
  * @returns {void}
  */
  private watermarkConfigurator() {
    const watermark = new Watermark(this.watermarkImagePath, { position: 'bottomleft' });
    if (this.map) watermark.addTo(this.map);
  }

  /**
  * Fetches feature collection from file.
  * @private
  * @returns {void}
  */
  private getFeatureCollectionFromFile() {
    this.fileManagerService.getFileFeatureCollection().subscribe((res: any) => {
      this.renderFeatureCollectionToMap(res)
    })
  }

  /**
  * Renders feature collection on the map.
  * @private
  * @param {GeoJsonResult} featureCollection - Feature collection to render.
  * @returns {void}
  */
  private renderFeatureCollectionToMap(featureCollection: GeoJsonResult) {
    if (this.map) {
      L.geoJSON(featureCollection).addTo(this.map);
      this.updateFeatureCollection();
    }
  }

  /**
  * Exports GeoJSON from the map.
  * @private
  * @returns {void}
  */
  public updateFeatureCollection(): void {
    const geojson: GeoJsonResult = {
      type: 'FeatureCollection',
      features: []
    };

    if (this.map) {
      const geomanLayers = this.map.pm.getGeomanLayers();
      geomanLayers.forEach((layer: any) => {
        const layerGeoJSON = layer.toGeoJSON();
        geojson.features.push(layerGeoJSON);
      });
      this.featureCollection = geojson;
      this.featureCollectionOutput.emit(this.featureCollection);
      console.log("Feature collection updated", this.featureCollection)
    }
  }

  /**
  * Draw the incomming Feature Collection from Input into map
  * @private
  * @returns {void}
  */
  private drawInputFeatureCollectionIntoMap() {
    if (!this.featureCollectionInput) return;
    this.renderFeatureCollectionToMap(this.featureCollectionInput)
  }

  public mapIdGenerator() {
    this.mapId = uuidv4();
  }

  /* public getMapGeoJson() {
    this.exportGeoJson();
  } */

  private mapEventsHandler() {
    // Handle events to update the FeatureCollection
    if (this.map) {
      this.map.on('pm:create pm:edit pm:remove pm:cut pm:rotateend pm:vertexadded pm:vertexremoved pm:update pm:change pm:globaldragmodetoggled pm:globaleditmodetoggled', (e) => {
        console.log('GeoJSON action triggered 🔫:', e);
      });
    }
  }

  constructor(private fileManagerService: FileManagerService, private toastService: ToastService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.setFeatureGroup();
    this.geomanControllers();
    this.customToolbar();
    this.switchBaseLayer();
    this.watermarkConfigurator()
    this.getFeatureCollectionFromFile();
    this.drawInputFeatureCollectionIntoMap();
    this.mapEventsHandler();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.mapIdGenerator();
  }
}
