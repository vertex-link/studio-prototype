export type AuthState =
    | {
          authorized: true;
          mail: string;
          id?: string;
      }
    | { authorized: false };
