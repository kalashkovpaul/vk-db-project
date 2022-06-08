import pgPromise from 'pg-promise';

const promise = pgPromise();
const  connectionURL = 'postgres://technopark:technopark@localhost:4001/technopark';
export const db = promise(connectionURL);
