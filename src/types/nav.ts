import type { MenuItem } from 'primevue/menuitem'

export interface NavItem extends MenuItem {
  label?: string
  route?: string
  icon?: string
  class?: string
  separator?: boolean
}
