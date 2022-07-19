import { RaphaelElement } from 'raphael';

// todo 重构
export function setNodeAccessoryPosition(options: {
  label: RaphaelElement;
  rect: RaphaelElement;
  nodeX: number;
  nodeY: number;
  paddingWidth: number;
  paddingHeight: number;
}) {
  const textBox = options.label.getBBox();
  const rectWidth = textBox.width + options.paddingWidth;
  const rectHeight = textBox.height + options.paddingHeight;

  options.label.attr({
    x: options.nodeX + rectWidth * 0.5,
    y: options.nodeY + rectHeight * 0.5
  });
  options.rect.attr({
    width: rectWidth,
    height: rectHeight
  });
}
