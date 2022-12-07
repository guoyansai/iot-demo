type Istrings = string[] | string;
type IValues = any[][] | string;
type ISets = [string, any][] | string;
type IWheres = ([string, string, any] | string)[] | string;
type IOrders = [string, 'asc' | 'desc'][] | string;

export default interface Idb {
  type: string;
  table: string;
  field?: Istrings; // ['a','b']
  value?: IValues; // [['a1',10,'b1'],['2a',20,'2b']]
  set?: ISets; // [['a1','b1'],['2a','2b']]=>set a=b
  where?: IWheres; // ['or',['a','like','b'],['a','>','b'],'or','and',['a','like','b'],['a','>','b']]=>where a==='b'
  order?: IOrders; // [['a1','asc'],['b1','desc']]=>order by a asc,b1,desc
  limit?: number;
}
