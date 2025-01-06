import axios from "axios";
import {useCookies} from "@vueuse/integrations/useCookies";
import {base_api_url} from "../constants.ts";
import {refresh, validate} from "../login/authorization.ts";


const cookies = useCookies(['classics'])

export type idArticleLine = {
    id: string,
    line: string,
    time: string,
    contrib: string,
    unsure: boolean,
    sensitive: boolean,
    hidden: boolean,
}

export async function getArticles(): Promise<idArticleLine[] | undefined> {
    let accessToken = cookies.get('access_token')
    let refreshToken = cookies.get('refresh_token')

    const isRefreshValid = await validate(refreshToken)
    const isAccessValid = await validate(accessToken)

    if(!isRefreshValid) {
        cookies.remove('access_token')
        cookies.remove('refresh_token')
        accessToken = undefined
        refreshToken = undefined
    } else {
        if(!isAccessValid && isRefreshValid) {
            const token = await refresh(refreshToken)

            if(token) {
                accessToken = token.accessToken
            }

            cookies.set('access_token', accessToken, {expires: new Date(Date.now() + 15 * 60 * 1000)})
        }
    }

    let headers;
    if (accessToken) {
        headers = {
            Authorization: `Bearer ${accessToken}`
        }
    } else {
        headers = {}
    }

    return axios.get<idArticleLine[]>(base_api_url + 'read/json', {
        headers: headers
    }).then(r => {
        if (r.status === 403 || r.status === 401) {
            cookies.remove('access_token');
            window.location.reload();
        } else if (r.status === 200) {
            return r.data
        }
        return undefined
    }).catch(e => {
        console.error(String.raw`Sorry, we meet some problem, this maybe our problem or the network problem`, e)
        return undefined;
    })
}