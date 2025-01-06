import type {Article} from "~/types/Article";

export const useArticleStore = defineStore('articles', {
    state: () => ({
        loading: true,
        articles: [] as Article[],
    }),
    actions: {
        async fetch() {
            this.articles = await fetchArticles() ?? []
            this.loading = false
        }
    }
})