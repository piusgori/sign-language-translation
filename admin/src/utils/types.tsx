export interface ITEM {
    _id: string,
    image: string,
    meaning: string,
    approved: boolean
    requestUser?: string;
    views: string[]
    createdAt: Date
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