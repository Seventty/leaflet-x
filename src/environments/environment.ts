export const environment = {
  allowedMapFileTypes: [
    'json',
    'geojson',
    'topojson',
    'shp',
    'kml',
    'csv',
    'tsv',
    'dsv',
    'xml',
    'osm',
    'poly'
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
    'text/csv'
  ],
  appMaxFileSize: 100,
}
