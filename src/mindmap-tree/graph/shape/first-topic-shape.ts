import { RaphaelPaper, RaphaelSet, RaphaelElement } from 'raphael';

// 第一代节点shape
class FirstTopicShape {
  private shape: RaphaelSet;

  public constructor(private readonly paper: RaphaelPaper) {
    this.shape = this.paper.set();
  }

  public draw({ x, y, label }: {
    x: number;
    y: number;
    label: string;
  }): void {
    const labelShape = this.paper.text(x, y, label);
    const rectShape = this.paper.rect(x, y, 0, 0, 4);

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

    // setNodePosition({
    //   label: labelShape,
    //   rect: rectShape,
    //   nodeX: x,
    //   nodeY: y,
    //   paddingWidth: 42,
    //   paddingHeight: 24,
    // });

    this.shape.push(labelShape).push(rectShape);
  }

  public getPosition(): {
    x: number;
    y: number;
  } {
    return {
      x: 0,
      y: 0,
    }
  }

}

export default FirstTopicShape;
