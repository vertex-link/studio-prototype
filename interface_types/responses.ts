export type ResponseError = {
    code: string;
    message: string;
    type: string;
};

// type CustomPromise<T, F = any> = {
//     catch<TResult = never>(
//         onrejected?: ((reason: F) => TResult | PromiseLike<TResult>) | undefined | null
//     ): Promise<T | TResult>;
// } & Promise<T>;

export interface Response<T> {
    payload: T | ResponseError;
}

// const fetchuser = async (): Response<User> => {
//     const user: User = await getUser();
//     return user;
// };

// const fetchuser2: Response<User> = await fetchUser().catch();
