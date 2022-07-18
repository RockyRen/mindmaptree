enum Direction {
  LEFT = 0,
  RIGHT,
}

export interface CommonTopicData {
  id: string;
  children: string[];
  label: string; // topic文本
  // todo
  attr: any; // topic的样式
}

interface RootTopicData extends CommonTopicData {

}

interface NormalTopicData extends CommonTopicData {
  father: string;
  direction: Direction;
}

class Model {
  public readonly rootTopic: RootTopicData = {
    id: '',
    children: [],
    label: '中心主题',
    attr: {},
  }
  public readonly topics: NormalTopicData[] = [];

  public constructor() {

  }
}

export default Model;
