import {app, port} from "./config/app-config";
import {db} from "./dependencies/composition-root";

const startApp = async (): Promise<void> => {
    await db.runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    });
}
startApp();