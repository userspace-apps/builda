"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
const _helpers_1 = require("../helpers/index.js");
const string_functions_1 = require("../helpers/string-functions");
const globals_1 = __importDefault(require("../data/globals"));
const questions_1 = __importDefault(require("../data/questions"));
const { configFileName, buildaDir, websiteUrl } = globals_1.default;
const add_module_1 = __importDefault(require("./add-module"));
const OVERWRITE_CONFIG_QUESTION = {
    message: `Do you really want to replace your ${configFileName} file? You will lose all your current settings.`,
    name: 'replaceConfig',
    type: 'confirm'
};
const getAnswers = async (omitName, omitOutputDir) => {
    return new Promise((resolve) => {
        const questionList = questions_1.default.filter((question) => {
            if (omitName && question.name === 'appName') {
                return false;
            }
            if (omitOutputDir && question.name === 'outputDirectory') {
                return false;
            }
            return true;
        });
        (0, _helpers_1.askQuestion)({
            questionList
        }).then((answers) => {
            return resolve(answers);
        });
    });
};
const checkExistingConfig = async (fileName, debug) => {
    return new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(path_1.default.join(fileName))) {
            if (debug) {
                // Preset answers were passed so we are in debug/test mode
                reject(false);
                return (0, _helpers_1.throwError)(`You already have a ${fileName} file. Process Aborted.`);
            }
            return (0, _helpers_1.askQuestion)(OVERWRITE_CONFIG_QUESTION).then(({ replaceConfig }) => {
                if (replaceConfig) {
                    return resolve(true);
                }
                reject(false);
                return (0, _helpers_1.throwError)('Process terminated due to user selection');
            });
        }
        (0, _helpers_1.printMessage)('Starting initialisation...\r', 'success');
        (0, _helpers_1.printMessage)(`All answers can be changed later by editing the ${configFileName} file`, 'notice');
        return resolve(true);
    });
};
const writeConfig = async (filename, contents) => {
    return new Promise((resolve) => {
        fs_1.default.writeFile(filename, contents, (err) => {
            if (err)
                throw err;
            return resolve((0, _helpers_1.printMessage)('Created config in project root', 'success'));
        });
    });
};
const installModules = async (config, answers) => {
    (0, _helpers_1.printMessage)('Installing initial scaffold...\r', 'notice');
    let options = {
        config,
        path: answers.installDefaultModule,
        official: true
    };
    if (answers.installDefaultModule === 'custom') {
        options = {
            config,
            path: answers.scaffoldUrl,
            official: false
        };
    }
    return (0, add_module_1.default)(options);
};
const init = async ({ presetAnswers, appName: applicationName, outputDirectory: outputDir }) => {
    // Check if a config file already exists unless presetAnswers is passed
    let continueProcess = false;
    const scaffoldList = [];
    let answers = {};
    if (!presetAnswers) {
        try {
            continueProcess = await checkExistingConfig(configFileName, false);
        }
        catch (err) {
            Promise.reject(err);
            return (0, _helpers_1.throwError)(err);
        }
        try {
            answers = (await getAnswers(!!applicationName, !!outputDir));
        }
        catch (err) {
            Promise.reject(err);
            (0, _helpers_1.throwError)(err);
        }
    }
    else {
        continueProcess = true;
        answers = presetAnswers;
    }
    const appName = applicationName || answers.appName;
    const outputDirectory = outputDir || answers.outputDirectory;
    if (!appName) {
        Promise.reject('No app name provided');
        return (0, _helpers_1.throwError)('App name is required');
    }
    return new Promise((resolve, reject) => {
        var _a;
        if (continueProcess === true) {
            fs_1.default.mkdirSync(buildaDir, { recursive: true });
            if ((_a = answers.scaffoldSelection) === null || _a === void 0 ? void 0 : _a.length) {
                scaffoldList.push(...answers.scaffoldSelection);
            }
            if (answers.customScaffoldList) {
                answers.customScaffoldList
                    .split(',')
                    .forEach((scaffoldType) => {
                    scaffoldList.push(scaffoldType.trim());
                });
            }
            const config = {
                name: appName,
                app_root: outputDirectory
            };
            installModules(config, answers)
                .then((response) => {
                let scaffoldScripts = ``;
                scaffoldList.forEach((scaffoldItem) => {
                    scaffoldScripts += `${scaffoldItem}: {\n`;
                    scaffoldScripts += `  use: '${response.module.name}',\n`;
                    scaffoldScripts += `output_dir: \`\${appRoot}/${(0, string_functions_1.pluralise)(scaffoldItem)}\`,\n`;
                    scaffoldScripts += `},\n`;
                });
                let configString = `\nconst appRoot = '${outputDirectory}';\n\n`;
                configString += `module.exports = {\n`;
                configString += `  name: '${appName}',\n`;
                configString += `  app_root: appRoot,\n`;
                configString += `  scaffold_scripts: {\n${scaffoldScripts}},\n`;
                configString += `}`;
                writeConfig(configFileName, prettier_1.default.format(configString, {
                    singleQuote: true,
                    trailingComma: 'none',
                    parser: 'typescript'
                }))
                    .then(() => {
                    (0, _helpers_1.printMessage)('\rInitialisation complete', 'success');
                    (0, _helpers_1.printMessage)(`Check your ${configFileName} file to ensure all settings are correct. Output paths may need some tweaking.`, 'notice');
                    (0, _helpers_1.printMessage)(`Visit ${websiteUrl}/setup for instructions on what to do next`, 'notice');
                    resolve();
                })
                    .catch((err) => {
                    reject(err);
                    (0, _helpers_1.throwError)(err);
                });
            })
                .catch((err) => {
                reject(err);
                (0, _helpers_1.throwError)(err);
            });
        }
    });
};
exports.default = init;
