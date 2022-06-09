import pgPromise from 'pg-promise';

const promise = pgPromise();
const  connectionURL = 'postgres://technopark:technopark@localhost:5432/technopark';
export const db = promise(connectionURL);
