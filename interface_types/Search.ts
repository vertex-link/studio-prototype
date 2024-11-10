import { User } from '@schema/user.ts';

export type SearchConfig = {
    searchString: string;
    user?: {
        username?: boolean;
        mail?: boolean;
    };
    household?: {
        name?: boolean;
        user?: boolean;
    };
};

export interface SearchResponse {
    [key: string]: string | User[] | undefined;
    searchString: string;
    user?: User[];
}
