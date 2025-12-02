declare module 'togeojson' {
  export function kml(doc: Document): any;
  export function gpx(doc: Document): any;
  export function gpxParse(doc: Document): any;
  const _default: {
    kml: typeof kml;
    gpx: typeof gpx;
  };
  export default _default;
}
