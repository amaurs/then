export interface Image {
    url: string
}

export interface Post {
    url: string
}

export interface Code {
    code: string
    redirect: string
}

export interface Cities {
    cities: number[]
    hasFetched: boolean
}

export interface Points {
    points: number[]
    hasFetched: boolean
}
