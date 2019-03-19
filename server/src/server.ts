import App from './application/app';
import { Server } from "http";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typedi";

const port = process.env.PORT || 4000;
const host = process.env.HOSTNAME || '0.0.0.0';
let server: Server;

useContainer(Container);

// Launch Node.js server
async function bootstrap() {
    try {
        await createConnection();
    } catch (e) {
        console.error(`${e.stack}, ${e.toString()}`);
    }

    const app = Container.get(App);
    await app.init();
    server = app.express.listen({ port, host }, () => {
        console.log(`🚀 Server ready at http://${host}:${port}/`);
    });
}
bootstrap();

interface IExitOptions {
    cleanup: boolean;
    exit: boolean;
}

// Shutdown Node.js app gracefully
function handleExit(options: IExitOptions, err: any) {
    if (options.cleanup) {
        const actions = [server.close];
        actions.forEach((close, i) => {
            try {
                close(() => {
                    if (i === actions.length - 1) process.exit();
                });
            } catch (err) {
                if (i === actions.length - 1) process.exit();
            }
        });
    }
    if (err) console.error(err);
    if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));