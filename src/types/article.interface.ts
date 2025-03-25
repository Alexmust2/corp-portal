import { IApiResponse, IApiStatus } from "./interfaces";

// ЗАПРОСЫ
export interface IArticleData extends Pick<ArticleProps, 'title' | 'image_url'> {
    content: string;
    metadata: {
        category: string | number;
        tags: (number | string)[];
    };
}

// ОТВЕТЫ
export interface IArticleWithContent extends ArticleProps {
    content: string;
}

export interface IArticleWithSummary extends ArticleProps {
    summary: string | null;
}

export interface IArticleMetadata extends IApiStatus {
    categories: ArticleCategoryProps;
    tags: ArticleTagsProps;
}

export interface IArticleCreateResponse extends IApiResponse {
    articleId: number;
}

interface ArticleProps {
    id: number;
    title: string;
    creator_id: number;
    created_at: string;
    updated_at: string;
    metadata: ArticleMetadataProps;
    image_url: string;
}

interface ArticleMetadataProps {
    category: string;
    tags: string[];
}

interface ArticleCategoryProps {
    id: number;
    name: string;
}

interface ArticleTagsProps {
    id: number;
    name: string;
}
