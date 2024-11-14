export type MessageType =
    | 'CREATE_OBJECT'
    | 'PATCH_OBJECT'
    | 'DELETE_OBJECT'
    | 'LOCK_OBJECT'
    | 'UNLOCK_OBJECT';

export interface UpdateMessage {
    userId: string;
    date: Date;
    timestamp: number;
    type: MessageType;
    content: string;
}
