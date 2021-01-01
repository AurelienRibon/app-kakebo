import categories from '../meta/categories.json';

const categoriesMap = indexCategoryDefsByName();
const unknownCategory: CategoryDef = {
  name: '$unknown',
  icon: 'mdi-help-circle',
};

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export interface CategoryDef {
  name: string;
  icon: string;
  extra?: boolean;
  infrequent?: boolean;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export function getCategoryDef(name: string): CategoryDef {
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
