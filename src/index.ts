import {app, port} from "./config/app-config";
import {db} from "./dependencies/composition-root";
import {settingsEnv} from "./config/settings-env";

const startApp = async (): Promise<void> => {
    await db.runDb(settingsEnv.MONGO_URL);
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    });
}
startApp();