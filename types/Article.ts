export type Article = {
    id: string,
    line: string,
    time: string,
    contributor: string,
    unsure: boolean,
    sensitive: boolean,
    attributes: Map<string, string>,
}
