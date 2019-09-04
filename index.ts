import { IPlugin } from 'fbl/dist/src/interfaces';
import { ImageRenderActionHandler } from './src/handlers';

const packageJson = require('../package.json');

module.exports = <IPlugin>{
    name: packageJson.name,
    description: packageJson.description,
    tags: packageJson.keywords,
    version: packageJson.version,

    requires: {
        fbl: packageJson.peerDependencies.fbl,
        plugins: {
            // pluginId: '<0.0.1'
        },
        applications: [],
    },

    reporters: [],

    actionHandlers: [new ImageRenderActionHandler()],

    templateUtils: [],
};
