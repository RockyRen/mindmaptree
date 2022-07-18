import Model from '../model/model';
import { RaphaelPaper, RaphaelSet, RaphaelElement } from 'raphael';

interface RootTopicOptions {
  paper: RaphaelPaper;
  model: Model;
  containerWidth: number;
  containerHeight: number;
}

// todo 不应该叫position
function setNodePosition(options: {
  label: RaphaelElement;
  rect: RaphaelElement;
  nodeX: number;
  nodeY: number;
  paddingWidth: number;
  paddingHeight: number;
}): void {
  let textBox = options.label.getBBox();
  let rectWidth = textBox.width + options.paddingWidth;
  let rectHeight = textBox.height + options.paddingHeight;

  options.label.attr({
    x: options.nodeX + rectWidth * 0.5,
    y: options.nodeY + rectHeight * 0.5
  });
  options.rect.attr({
    width: rectWidth,
    height: rectHeight
  });
}

// todo id
class RootTopic {
  private shape: RaphaelSet;
  private readonly paper: RaphaelPaper;
  private readonly model: Model;
  private readonly containerWidth: number;
  private readonly containerHeight: number;

  public constructor(options: RootTopicOptions) {
    this.paper = options.paper;
    this.model = options.model;
    // todo 这里在被resize的时候，需要改变
    this.containerWidth = options.containerWidth;
    this.containerHeight = options.containerHeight;
    this.shape = this.paper.set();
  }

  public render(): void {
    this.drawNodeShape();
  }

  private drawNodeShape(): void {
    const { rootTopic } = this.model;
    const { label } = rootTopic;

    const x = this.containerWidth / 2 - 50;
    const y = 200;

    const labelShape = this.paper.text(x, y, label);
    // todo id
    const rectShape = this.paper.rect(x, y, 100, 100, 4);

    labelShape.toFront();

    labelShape.attr({
      'font-size': 25,
      'fill': 'white',
      'text': label,
    });

    rectShape.attr({
      'fill': '#428bca',
      'stroke': '#808080',
      'stroke-width': 1,
    });

    setNodePosition({
      label: labelShape,
      rect: rectShape,
      nodeX: x,
      nodeY: y,
      paddingWidth: 42,
      paddingHeight: 24,
    });

    this.shape.push(labelShape).push(rectShape);

  }
}

export default RootTopic;