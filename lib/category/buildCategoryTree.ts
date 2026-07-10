import { Category } from "@prisma/client";

interface CategoryTree extends Category {
  children: CategoryTree[];
}

export function buildCategoryTree(
  categories: Category[]
): CategoryTree[] {
  const map = new Map<number, CategoryTree>();

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  const roots: CategoryTree[] = [];

  map.forEach(cat => {
    if (cat.parentId) {
      map.get(cat.parentId)?.children.push(cat);
    } else {
      roots.push(cat);
    }
  });

  return roots;
}
