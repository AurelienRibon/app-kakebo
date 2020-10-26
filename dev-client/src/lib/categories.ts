import categories from '../meta/categories.json';

interface CategoryDef {
  name: string;
  icon: string;
  extra?: boolean;
}

const categoriesMap = indexCategoryDefsByName();
const unknownCategory: CategoryDef = {
  name: '$unknown',
  icon: 'mdi-help-circle',
};

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function getUnknownCategoryName(): string {
  return '$unknown';
}

export function getCategoryDef(name: string): CategoryDef | undefined {
  return categoriesMap.get(name) || unknownCategory;
}

export function hasCategoryName(name: string): boolean {
  return categoriesMap.has(name);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function indexCategoryDefsByName(): Map<string, CategoryDef> {
  return new Map(categories.map((it) => [it.name, it]));
}
