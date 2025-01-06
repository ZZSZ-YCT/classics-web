import type {Article} from "~/types/Article";

export async function fetchArticles() : Promise<Article[] | undefined> {
    refreshToken()

    const url = useRuntimeConfig().public.apiUrl + 'read/json'
    const accessToken = useCookie('access_token').value

    let headers = {}
    if(accessToken) {
        headers = {
            'Authorization': `Bearer ${accessToken}`
        }
    }

    return useFetch<Article[]>(url, {
        method: 'GET',
        headers: headers,
    }).then(({data, error}) => {
        if(error.value) {
            console.error(error)
            return undefined
        }

        return data.value ?? undefined
    }).catch(err => {
        console.error(err)
        return undefined
    })
}