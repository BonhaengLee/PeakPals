export {};

declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver {
    namespace maps {
      interface MapOptions {
        center: LatLng;
        zoom: number;
        zoomControl?: boolean;
        mapTypeId?: string;
        [key: string]: any; // 추가 옵션 허용
      }

      class Map {
        constructor(element: HTMLElement, options: MapOptions);
        setCenter(location: LatLng): void;
        setZoom(level: number): void;
        getCenter(): LatLng;
        getZoom(): number;
      }

      interface MarkerOptions {
        position: LatLng;
        map: Map;
        title?: string;
        icon?: {
          url: string;
          size: Size;
          scaledSize: Size;
          anchor: Point;
        };
        [key: string]: any; // 추가 옵션 허용
      }

      class Marker {
        constructor(options: MarkerOptions);
        setPosition(position: LatLng): void;
        getPosition(): LatLng;
        setMap(map: Map | null): void;
      }

      class LatLng {
        constructor(latitude: number, longitude: number);
        lat(): number;
        lng(): number;
      }

      class Size {
        constructor(width: number, height: number);
      }

      class Point {
        constructor(x: number, y: number);
      }

      class Event {
        static addListener(
          instance: any,
          eventName: string,
          handler: (...args: any[]) => void
        ): void;
        static removeListener(
          instance: any,
          eventName: string,
          handler: (...args: any[]) => void
        ): void;
      }
    }
  }
}
