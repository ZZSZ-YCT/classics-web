import type {Article} from "~/types/Article";

export const useArticleStore = defineStore('articles', {
    state: () => ({
        loading: true,
        articles: new Array(10).fill({} as Article) as Article[],
    }),
    actions: {
        async fetch() {
            this.loading = true
            this.articles = await fetchArticles() ?? []
            this.loading = false
        }
    }
})