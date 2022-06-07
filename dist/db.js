import pgPromise from 'pg-promise'; // Postgres interface for Node
const promise = pgPromise();
let connectionURL = 'postgres://technopark:technopark@localhost:5432/technopark';
export const db = promise(connectionURL);
//# sourceMappingURL=db.js.map