import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types/service'

const HARDCODED_CATEGORIES: Category[] = [
  { id: 1, name: 'Programmation', slug: 'prog' },
  { id: 2, name: 'Design', slug: 'design' },
  { id: 3, name: 'Soutien scolaire', slug: 'soutien' },
  { id: 4, name: 'Rédaction', slug: 'redaction' },
  { id: 5, name: 'Traduction', slug: 'traduction' },
]

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const categories = ref<Category[]>([])
  const loading = ref<boolean>(false)
  const loaded = ref<boolean>(false)

  async function fetchCategories(): Promise<void> {
    if (loaded.value) return

    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 0))
      categories.value = HARDCODED_CATEGORIES
      loaded.value = true
    } catch (error) {
      console.error('Fetch categories failed:', error)
      categories.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  function getCategoryById(id: number): Category | undefined {
    return categories.value.find((c) => c.id === id)
  }

  return {
    categories,
    loading,
    loaded,
    fetchCategories,
    getCategoryById,
  }
})
