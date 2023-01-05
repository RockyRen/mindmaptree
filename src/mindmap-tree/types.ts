export enum Direction {
  LEFT = -1,
  RIGHT = 1,
}

export interface NodeData {
  id: string;
  children: string[];
  label: string;
  direction: Direction | null;
  isRoot: boolean;
}