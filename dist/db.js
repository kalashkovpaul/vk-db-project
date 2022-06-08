import pgPromise from 'pg-promise'; // Postgres interface for Node
const promise = pgPromise();
let connectionURL = 'postgres://technopark:technopark@localhost:4001/technopark';
export const db = promise(connectionURL);
//# sourceMappingURL=db.js.map