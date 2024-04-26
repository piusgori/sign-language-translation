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

export interface ITEM {
    _id: string,
    image: string,
    meaning: string,
    approved: boolean
    requestUser?: string;
    views: string[]
    createdAt: Date
}

export interface NOTIFICATION {
    _id: string,
    message: string,
    createdAt: Date
    read: boolean
}

export interface QUESTION {
    _id: string;
    topic: string;
    text: string;
    options: string[];
    correctAnswer: number,
    answers: { user: string, answer: number }[]
}

export interface LESSON {
    _id: string;
    topic: string;
    title: string;
    content: string;
    url: string;
    users: string[];
}

export interface TOPIC {
    _id: string;
    title: string;
    description?: string,
    objectives: string[];
    users: string[];
    lessons: LESSON[];
    questions: QUESTION[];
}