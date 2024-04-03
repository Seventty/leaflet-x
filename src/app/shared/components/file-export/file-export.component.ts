import { Component, Input, OnInit } from '@angular/core';
import { GeoJsonResult } from '../../types/geoJsonResult.type';
import { saveAs } from 'file-saver';
import { topology } from "topojson-server"

@Component({
  selector: 'UIFileExport',
  templateUrl: './file-export.component.html',
  styleUrls: ['./file-export.component.scss']
})
export class FileExportComponent implements OnInit {
  @Input() FeatureCollectionToExport?: any;
  exportFormats: any[] = [];

  shpSupport: boolean = typeof ArrayBuffer !== 'undefined';

  private downloadGeoJSON = () => {
    const blob = new Blob([JSON.stringify(this.FeatureCollectionToExport)], { type: 'application/json' });
    saveAs(blob, 'mapa.geojson')
  }

  private downloadTopo() {
    const topoContent = JSON.stringify(topology({ featureCollection: this.FeatureCollectionToExport }))

    saveAs(new Blob([topoContent], { type: 'text/plain;charset=utf-8' }), 'mapa.topojson');
  }

  private downloadDSV() {
    console.log('Descargando CSV...');
  }

  private downloadKML() {
    console.log('Descargando KML...');
  }

  private downloadWKT() {
    console.log('Descargando WKT...');
  }

  private downloadShp() {
    console.log('Descargando SHP...');
  }

  private allProperties(properties: any, key: any, value: any) {
    properties[key] = value;
    return true;
  }

  constructor() { }

  ngOnInit() {
    this.exportFormats = [
      {
        title: 'GeoJSON',
        action: this.downloadGeoJSON,
        colorClass: 'btn-geojson'
      },
      {
        title: 'TopoJSON',
        action: this.downloadTopo,
        colorClass: 'btn-topojson'
      },
      {
        title: 'CSV',
        action: this.downloadDSV,
        colorClass: 'btn-csv'
      },
      {
        title: 'KML',
        action: this.downloadKML,
        colorClass: 'btn-kml'
      },
      {
        title: 'WKT',
        action: this.downloadWKT,
        colorClass: 'btn-wkt'
      },
    ];

    if (this.shpSupport) {
      this.exportFormats.push({
        title: 'Shapefile',
        action: this.downloadShp,
        colorClass: 'btn-shapefile'
      });
    }
  }

}
