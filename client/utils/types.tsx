export interface USER {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photoURL?: string;
    disabled?: boolean;
}

export interface MESSAGE {
    id: string;
    from: string;
    to: string;
    message: string;
    createdAt: Date;
}

export interface CHAT {
    _id: string;
    userOne: USER,
    userTwo: USER,
    lastMessage: MESSAGE
    messages: MESSAGE[]
}