type CodeType = {
    OK: Number,
    CREATED: Number,
    NOT_FOUND: Number,
    ALREADY_EXISTS: Number,
    INTERNAL_ERROR: Number,
};

type DBCodes = {
    NOT_NULL: string,
    DONT_EXIST: string,
    ALREADY_EXIST: string,
};

export const codes: CodeType = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    ALREADY_EXISTS: 409,
    INTERNAL_ERROR: 500,
};

export const dbCodes: DBCodes = {
    NOT_NULL: "23502",
    DONT_EXIST: "23503",
    ALREADY_EXIST: "23505",
};