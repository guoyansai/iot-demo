interface _point {
  x: number;
  y: number;
}
interface _test {
  num: number;
  name: string;
  point: _point;
}

interface IIotModel {
  id: string;
  title: string;
  test: _test;
  user?: string;
  age?: number;
}
export type { IIotModel };
