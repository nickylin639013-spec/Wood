export type Shape = 'rect' | 'log';
export type Unit = 'cm' | 'in' | 'tai';

export interface BatchItem {
  id: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  quantity: number;
  shape: Shape;
  unit: Unit;
  volumeCm3: number;
  taiCai: number;
}

export interface CutPart {
  id: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  color: string;
}

export interface CutResult {
  sheets: {
    width: number;
    height: number;
    placedParts: {
      part: CutPart;
      x: number;
      y: number;
      w: number;
      h: number;
      rotated: boolean;
    }[];
  }[];
  utilization: number;
  wasteArea: number;
}
