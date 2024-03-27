import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'

type GeoJsonResult = FeatureCollection<Geometry | null, GeoJsonProperties>;

export class GeoJsonNormalize {
  private types = {
    Point: 'geometry',
    MultiPoint: 'geometry',
    LineString: 'geometry',
    MultiLineString: 'geometry',
    Polygon: 'geometry',
    MultiPolygon: 'geometry',
    GeometryCollection: 'geometry',
    Feature: 'feature',
    FeatureCollection: 'featurecollection'
  };

  /**
   * Normalize a GeoJSON feature into a FeatureCollection.
   *
   * @param {object} gj geojson data
   * @returns {object} normalized geojson data
   */
  normalize(gj: GeoJsonResult) {
    if (!gj || !gj.type) return null;
    const type = this.types[gj.type]
    if(!type) return null

    if(type === 'geometry'){
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: gj
        }]
      };
    } else if(type === 'feature'){
      return {
        type: 'FeatureCollection',
        features: [gj]
      };
    } else if(type === 'featurecollection'){
      return gj;
    }

    return;
  }

}
