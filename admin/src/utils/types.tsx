export interface ITEM {
    _id: string,
    image: string,
    meaning: string,
    approved: boolean
    requestUser?: string;
    views: string[]
    createdAt: Date
}