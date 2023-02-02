"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = __importDefault(require("./project"));
exports.default = () => {
    return {
        command: 'project [appName]',
        desc: 'Generate a new app from a prefab',
        aliases: ['app', '--app', '--project'],
        builder: (yargs) => {
            return yargs
                .positional('appName', {
                describe: 'The name of the app',
                type: 'string',
                default: ''
            })
                .option('prefab', {
                alias: 'p',
                default: '',
                describe: 'The prefab to use (url, local path, or preset name)',
                type: 'string'
            })
                .option('packageManager', {
                alias: 'm',
                choices: ['yarn', 'npm'],
                default: 'yarn',
                describe: 'The package manager to use',
                type: 'string'
            })
                .option('autoInstall', {
                alias: 'i',
                default: false,
                describe: 'Whether to automatically install dependencies',
                type: 'boolean'
            })
                .option('smokeTest', {
                alias: 's',
                default: false,
                describe: 'Runs the command but deletes the output immediately',
                type: 'boolean'
            });
        },
        handler: async (argv) => {
            const args = {
                appName: argv.appName,
                prefab: argv.prefab,
                packageManager: argv.packageManager,
                autoInstall: argv.autoInstall,
                smokeTest: argv.smokeTest
            };
            await (0, project_1.default)(Object.assign({}, args));
        }
    };
};
