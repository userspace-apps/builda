"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefabInit = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execa_1 = require("execa");
const globals_1 = __importDefault(require("../data/globals"));
const _helpers_1 = require("../helpers/index.js");
const defaultRequiredFiles = ['package.json', 'README.md'];
const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your application?',
        validate: (input) => {
            if (input.length) {
                return true;
            }
            else {
                return 'Please enter a name for your application';
            }
        }
    },
    {
        type: 'input',
        name: 'outputDirectory',
        message: 'Where would you like to output your application?',
        default: './',
        validate: (input) => {
            if (input.length) {
                return true;
            }
            else {
                return 'Please enter a directory for your application';
            }
        }
    },
    {
        type: 'input',
        name: 'pathName',
        message: 'What is the path to the prefab?',
        validate: (input) => {
            if (input.length) {
                return true;
            }
            else {
                return 'Please enter a path to the prefab';
            }
        }
    },
    {
        type: 'choice',
        name: 'yarnOrNpm',
        message: 'Which package manager would you like to use?',
        choices: ['yarn', 'npm'],
        default: 'npm'
    }
];
const getAnswers = async (omitName, omitOutputDir, omitPathName, omitYarnOrNpm) => {
    return new Promise((resolve) => {
        const questionList = questions.filter((question) => {
            if (omitName && question.name === 'appName') {
                return false;
            }
            if (omitOutputDir && question.name === 'outputDirectory') {
                return false;
            }
            if (omitPathName && question.name === 'pathName') {
                return false;
            }
            if (omitYarnOrNpm && question.name === 'yarnOrNpm') {
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
const prefabInit = async ({ presetAnswers, appName, outputDirectory, pathName, packageManager }) => {
    const { configFileName, buildaDir, websiteUrl } = globals_1.default;
    const answers = presetAnswers ||
        (await getAnswers(!!appName, !!outputDirectory, !!pathName, !!packageManager));
    const name = appName || answers.appName;
    const outputDir = outputDirectory || answers.outputDirectory;
    const prefabPath = pathName || answers.pathName;
    const packageManagerType = packageManager || answers.yarnOrNpm || 'npm';
    // check if the root directory is empty
    const rootDir = path_1.default.resolve(outputDir);
    if (fs_1.default.readdirSync(rootDir).length !== 0) {
        (0, _helpers_1.throwError)('The app directory is not empty. It is not recommended to install a prefab into an existing project.');
    }
    else {
        // The directory is empty, so we can continue
        fs_1.default.mkdirSync(`${buildaDir}/modules/prefabs`, { recursive: true });
        let module = {};
        const moduleType = (0, _helpers_1.detectPathType)(prefabPath);
        if (moduleType === 'local') {
            module = await (0, _helpers_1.addLocalModule)(prefabPath);
        }
        if (moduleType === 'remote') {
            module = await (0, _helpers_1.addRemoteModule)((0, _helpers_1.convertRegistryPathToUrl)(prefabPath));
        }
        if (moduleType === 'custom') {
            module = await (0, _helpers_1.addRemoteModule)((0, _helpers_1.convertRegistryPathToUrl)(prefabPath));
        }
        if (module === null || module === void 0 ? void 0 : module.name) {
            const prefabName = module.name;
            const version = module.version;
            const substitute = module.substitute || [];
            const requiredFiles = [
                ...defaultRequiredFiles,
                ...(module.required_in_root || [])
            ];
            (0, _helpers_1.printMessage)(`Installed ${prefabName}@${version}`, 'success');
            (0, _helpers_1.printMessage)('Copying required files to application...', 'notice');
            // Initialise a promise
            const promises = [];
            const prefabDir = `${buildaDir}/modules/prefabs/${prefabName}`;
            // Generate the correct files in the app directory
            (0, _helpers_1.writeFile)({
                file: path_1.default.resolve(prefabDir, buildaDir, configFileName),
                output_dir: buildaDir,
                substitute,
                name
            });
            for (const file of requiredFiles) {
                promises.push(new Promise((resolve) => {
                    const filePath = path_1.default.resolve(prefabPath, file);
                    if (fs_1.default.existsSync(filePath)) {
                        (0, _helpers_1.writeFile)({
                            file: path_1.default.resolve(prefabDir, filePath),
                            output_dir: rootDir,
                            substitute,
                            name
                        });
                    }
                    resolve(filePath);
                }));
            }
            // Wait for all promises to resolve
            await Promise.all(promises);
            (0, _helpers_1.printMessage)('Initializing your application...', 'notice');
            // Run package manager install
            if (fs_1.default.existsSync('package.json')) {
                if (packageManagerType === 'yarn') {
                    (0, _helpers_1.printMessage)('Running yarn install...', 'notice');
                    await (0, execa_1.execa)('yarn', ['install'], { cwd: rootDir });
                }
                if (packageManagerType === 'npm') {
                    (0, _helpers_1.printMessage)('Running npm install...', 'notice');
                    await (0, execa_1.execa)('npm', ['install'], { cwd: rootDir });
                }
            }
            (0, _helpers_1.printMessage)(`Your application, "${name}" has been initialised!`, 'success');
            (0, _helpers_1.printMessage)(`For more information about how to use your application, visit: ${websiteUrl}/docs/getting-started`, 'primary');
        }
    }
};
exports.prefabInit = prefabInit;
exports.default = exports.prefabInit;
