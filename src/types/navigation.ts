export interface NavItem {
  label: string;
  href: string;
  key: string | null;
  hasMegaMenu: boolean;
}

export interface SubCategory {
  slug: string;
  label: string;
  href?: string;
}

export interface CategoryConfig {
  label: string;
  subcategories: readonly SubCategory[];
}
