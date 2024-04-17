import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as topojson from "topojson-server"
import * as geojsondsv from "geojson2dsv"
import * as wellknown from "wellknown";

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
    saveAs(blob, 'map.geojson')
  }

  private downloadTopo = () => {
    const topoContent = topojson.topology(
      {
        collection: this.FeatureCollectionToExport
      },
      { 'property-transform': this.allProperties }
    )
    saveAs(new Blob([topoContent], { type: 'text/plain;charset=utf-8' }), 'mapa.topojson');
  }

  private downloadDSV = () => {
    const geoJsonDsv = geojsondsv(this.FeatureCollectionToExport);
    saveAs(new Blob([geoJsonDsv], { type: 'text/plain;charset=utf-8' }), 'points.csv');
  }

  private downloadKML = () => {
    //console.log("Not available for now...")
  }

  private downloadWKT = () => {
    const wktGeoJson = this.FeatureCollectionToExport.features.map(wellknown.stringify).join('\n');
    saveAs(new Blob([wktGeoJson], {type: 'text/plain;charset=utf-8'}),'map.wkt');
  }

  private downloadShp() {
    //console.log('Descargando SHP...');
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
        title: 'WKT',
        action: this.downloadWKT,
        colorClass: 'btn-wkt'
      },
      {
        title: 'KML',
        action: this.downloadKML,
        colorClass: 'btn-outline-secondary disabled'
      },
    ];

    if (this.shpSupport) {
      this.exportFormats.push({
        title: 'Shapefile',
        action: this.downloadShp,
        colorClass: 'btn-outline-secondary disabled'
      });
    }
  }
}
