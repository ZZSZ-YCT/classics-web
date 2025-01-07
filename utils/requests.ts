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

    return $fetch<Article[]>(url, {
        method: 'GET',
        headers: headers,
    }).then((data) => {
        return data ?? undefined
    }).catch(err => {
        console.error(err)
        return undefined
    })
}