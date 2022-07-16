// Node
const node: any = {
  father: {},
  children: [],
  attr: {}, // shape的对象
  direction: -1, // 左还是右，图形相关
  id: 11,
  label: 'label',
  data: {}, // ???
  dep: 1, // 深度
};

const node1 = {};
const node3 = {};
const edge1 = {};
const edge3 = {};

const node2 = {
  id: 123,
  label: 'label',
  father: node1,
  children: [node3],
  dep: 1,

  attr: {
    direction: -1,
    color: '123',
  }
};

// const node2Shape = {
//   shape: 
// }