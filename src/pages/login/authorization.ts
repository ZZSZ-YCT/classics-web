import axios from "axios";
import {base_api_url} from "../constants.ts";

export type credentials = {
    username: string,
    password: string
}

export type tokenCredentials = {
    accessToken: string
    refreshToken: string
}


export async function loginToServer(credential: credentials): Promise<tokenCredentials | undefined> {
    return axios.post<tokenCredentials>(base_api_url + 'user/login', credential, {
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.data
            } else {
                return undefined
            }
        })
        .catch(err => {
            console.error(String.raw`Sorry, we failed to login, this maybe out problem or the network problem`, err)
            return undefined
        })
}

export async function refresh(refreshToken: string): Promise<tokenCredentials | undefined> {
    return axios.post<tokenCredentials>(base_api_url + 'user/refresh', {}, {
        headers: {
            "Authorization": `Bearer ${refreshToken}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.data
            } else {
                return undefined
            }
        })
        .catch(_ => {
            return undefined
        })
}