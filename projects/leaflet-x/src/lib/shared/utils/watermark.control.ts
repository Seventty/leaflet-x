import { Control, DomUtil } from 'leaflet';

export class Watermark extends Control {
  private imagePath: string;

  constructor(imagePath: string, options: any) {
    super(options);
    this.imagePath = imagePath;
  }

   override onAdd(map: L.Map): HTMLElement {
    const img = DomUtil.create('img');

    img.src = this.imagePath;
    img.style.width = '200px';

    return img;
  }

   override onRemove(map: L.Map): void {
    // Nothing to do here
  }
}
