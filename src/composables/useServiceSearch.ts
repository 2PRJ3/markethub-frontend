import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/serviceStore'

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

interface ParsedQuery {
  q: string | undefined
  category_id: number | undefined
  page: number
}

function parseQuery(query: Record<string, unknown>): ParsedQuery {
  const rawQ = typeof query.q === 'string' ? query.q.trim() : ''
  const q = rawQ.length >= MIN_QUERY_LENGTH ? rawQ : undefined

  const rawCategory = Number(query.category_id)
  const category_id = Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : undefined

  const rawPage = Number(query.page)
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1

  return { q, category_id, page }
}

export function useServiceSearch() {
  const route = useRoute()
  const router = useRouter()
  const serviceStore = useServiceStore()

  const searchInput = ref<string>(typeof route.query.q === 'string' ? route.query.q : '')
  const selectedCategoryId = ref<number | null>(parseQuery(route.query).category_id ?? null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function triggerFetch() {
    const { q, category_id, page } = parseQuery(route.query)
    serviceStore.fetchServices({
      q,
      category_id,
      page,
      page_size: 12,
    })
  }

  function setQuery(value: string) {
    searchInput.value = value
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      const trimmed = value.trim()
      const newQuery = { ...route.query }

      if (trimmed.length >= MIN_QUERY_LENGTH) {
        newQuery.q = trimmed
      } else {
        delete newQuery.q
      }
      delete newQuery.page

      router.replace({ query: newQuery })
    }, DEBOUNCE_MS)
  }

  function setCategoryId(value: number | null) {
    selectedCategoryId.value = value
    const newQuery = { ...route.query }

    if (value !== null) {
      newQuery.category_id = String(value)
    } else {
      delete newQuery.category_id
    }
    delete newQuery.page

    router.replace({ query: newQuery })
  }

  function setPage(page: number) {
    const newQuery = { ...route.query, page: String(page) }
    router.push({ query: newQuery })
  }

  watch(
    () => route.query,
    (newQ, oldQ) => {
      const parsed = parseQuery(newQ)
      const rawQ = typeof newQ.q === 'string' ? newQ.q : ''
      if (rawQ !== searchInput.value) searchInput.value = rawQ
      if ((parsed.category_id ?? null) !== selectedCategoryId.value) {
        selectedCategoryId.value = parsed.category_id ?? null
      }

      if (JSON.stringify(newQ) === JSON.stringify(oldQ)) return

      triggerFetch()
    },
    { deep: true },
  )

  onMounted(() => {
    triggerFetch()
  })

  return {
    searchInput,
    selectedCategoryId,
    setQuery,
    setCategoryId,
    setPage,
  }
}
