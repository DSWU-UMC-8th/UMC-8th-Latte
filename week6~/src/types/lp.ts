import { CommonResponse, CursorBasedResponse } from "./common";


export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}

export type Author = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type Lp ={
    id: number;
    title: string,
    content: string,
    thumbnail:  string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
}

export type RequestLpDto = {
    lpId: number;
}

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;


export type LpDetail = {
    data: {
        id: number;
        title: string,
        content: string,
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[];
        likes: Likes[];
        author: Author;
    };
};

export type ResponseLikeLpDto = CommonResponse<{
    id: number;
    userId: number;
    lpId: number;
}>;


export type Comment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author: Author;
};

export type ResponseCommentListDto = {
    data: {
        data: Comment[];
        nextCursor: number | null;
        hasNext: boolean;
    };
    status: boolean;
    statusCode: number;
    message: string;
};