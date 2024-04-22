import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'

export type GeoJsonResult = FeatureCollection<Geometry | null, GeoJsonProperties>;
