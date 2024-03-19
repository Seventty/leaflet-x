export const environment = {
  allowedMapFileTypes: [
    'geojson',
    'shp',
    'kml',
    /* '.gpkg',
    '.prj',
    '.dbf',
    '.cpg',
    '.shx', */
  ],
  allowedMapMimeTypes: [
    'application/gpkg',
    'application/vnd.google-earth.kml+xml',
    'application/geo+json',
    'application/x-esri-shapefile',
    'application/dbase',
    'application/x-qgis',
  ],
  appMaxFileSize: 100,
}
