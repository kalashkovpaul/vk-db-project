export type CodeType = {
    OK: Number,
    CREATED: Number,
    NOT_FOUND: Number,
    ALREADY_EXISTS: Number,
    INTERNAL_ERROR: Number,
};

export type DBCodes = {
    NOT_NULL: string,
    DONT_EXIST: string,
    ALREADY_EXIST: string,
};

export type PostType = {
    parent: string,
    author: string,
    message: string,
};

export type ThreadType = {
    forum: string,
    thread_id: string
};
