#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncWatched = void 0;
const glob_1 = __importDefault(require("glob"));
const _helpers_1 = require("../helpers/index.js");
const globals_1 = __importDefault(require("../data/globals"));
const syncWatched = (prefabName, config) => {
    const { buildaDir } = globals_1.default;
    if (config) {
        const { watched } = config;
        if (watched) {
            watched.forEach((source) => {
                const sourcePath = (0, _helpers_1.getPathFromRoot)(config, source);
                const destinationPath = `${buildaDir}/modules/prefab/${prefabName}`;
                // Check if source is a file, directory or glob pattern
                // If it's a glob pattern, copy the files that match the pattern to the destination
                if (source.includes('*')) {
                    // Get the files that match the glob pattern
                    return (0, glob_1.default)(sourcePath, (err, files) => {
                        if (err) {
                            throw new Error(err.message);
                        }
                        else {
                            files.forEach((file) => {
                                const appRoot = config.app_root.replace(/.?\//, '');
                                const fileName = file.replace(appRoot, '');
                                checkAndCopyFiles(file, destinationPath, fileName);
                            });
                        }
                    });
                }
                // If it's not a glob pattern, check if it's a file or directory and copy it to the destination
                return checkAndCopyFiles(sourcePath, destinationPath, source);
            });
        }
    }
    else {
        throw new Error('No config file found');
    }
};
exports.syncWatched = syncWatched;
exports.default = exports.syncWatched;
