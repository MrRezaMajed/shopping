export interface FlatCategory {
  value: string;
  label: string;
  parentId?: number | string | null;
}

export interface TreeSelectorProps {
  name: string;
  options: FlatCategory[];
  currentId?: number | string | null;
}

export interface TreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: TreeNode[];
}