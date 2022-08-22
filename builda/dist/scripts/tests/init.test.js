"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const preset_answers_1 = __importDefault(require("../../mocks/preset-answers"));
const init_1 = __importDefault(require("../init"));
const get_config_file_1 = __importDefault(require("../../helpers/get-config-file"));
describe('init', () => {
    const CONFIG_FILE = '.builda.json';
    let config = {};
    beforeAll(async () => {
        await (0, init_1.default)({ presetAnswers: preset_answers_1.default });
        config = (0, get_config_file_1.default)();
    });
    test('A config file is produced', () => {
        expect(fs_1.default.existsSync(CONFIG_FILE)).toBe(true);
    });
    test('The config file contains an appName value which reads "test"', () => {
        expect(config.app.name).toBe('test');
    });
    test('The config file contains an "atom" section with the correct values', () => {
        expect(config.commands.atom).toEqual({
            type: 'scaffold',
            outputPath: './experiments/atoms',
            use: 'default-ts'
        });
    });
    test('The config file contains an "component" section with the correct values', () => {
        expect(config.commands.component).toEqual({
            type: 'scaffold',
            outputPath: './experiments/components',
            use: 'default-ts'
        });
    });
    test('The config file contains a "test" section with the correct values', (done) => {
        expect(config.commands.test).toEqual({
            type: 'scaffold',
            outputPath: './experiments/tests',
            use: 'default-ts'
        });
        setTimeout(() => done(), 2000);
    });
});
