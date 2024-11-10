export enum COLOR_SCHEME {
    DARK = "dark",
    LIGHT = "light",
}

export type GeneralStoreState = {
    colorScheme: COLOR_SCHEME;
};

export type UserStoreState = {
    authorized: boolean;
    mail: string;
    userId: string;
};
