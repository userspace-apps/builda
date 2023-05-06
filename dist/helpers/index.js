"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlWithProtocol = exports.randomNameGenerator = exports.pluralise = exports.normaliseCase = exports.getSiteLink = exports.getPathFromRoot = exports.detectPathType = exports.convertSymbolsToWords = exports.convertNumbersToWords = exports.changeCase = exports.prefabQuestions = exports.newProjectQuestions = exports.existingProjectQuestions = exports.blueprintQuestions = exports.validateModulePath = exports.getSubstitutions = exports.getRegistry = exports.getModule = exports.getDetailsFromPath = exports.convertRegistryPathToUrl = exports.addRemoteModule = exports.addLocalModule = exports.copyPathsToRoot = exports.writeLogFile = exports.writeFile = exports.replaceRootDir = exports.loopAndRewriteFiles = exports.getConfigFile = exports.createDir = exports.createConfigFile = exports.copyDir = exports.checkAndCopyPath = exports.throwError = exports.showHelp = exports.printSiteLink = exports.printMessage = exports.printLogo = void 0;
// Console helpers
var print_logo_1 = require("./console/print-logo");
Object.defineProperty(exports, "printLogo", { enumerable: true, get: function () { return __importDefault(print_logo_1).default; } });
var print_message_1 = require("./console/print-message");
Object.defineProperty(exports, "printMessage", { enumerable: true, get: function () { return __importDefault(print_message_1).default; } });
var print_site_link_1 = require("./console/print-site-link");
Object.defineProperty(exports, "printSiteLink", { enumerable: true, get: function () { return __importDefault(print_site_link_1).default; } });
var show_help_1 = require("./console/show-help");
Object.defineProperty(exports, "showHelp", { enumerable: true, get: function () { return __importDefault(show_help_1).default; } });
var throw_error_1 = require("./console/throw-error");
Object.defineProperty(exports, "throwError", { enumerable: true, get: function () { return __importDefault(throw_error_1).default; } });
// File helpers
var check_and_copy_path_1 = require("./file/check-and-copy-path");
Object.defineProperty(exports, "checkAndCopyPath", { enumerable: true, get: function () { return __importDefault(check_and_copy_path_1).default; } });
var copy_dir_1 = require("./file/copy-dir");
Object.defineProperty(exports, "copyDir", { enumerable: true, get: function () { return __importDefault(copy_dir_1).default; } });
var create_config_file_1 = require("./file/create-config-file");
Object.defineProperty(exports, "createConfigFile", { enumerable: true, get: function () { return __importDefault(create_config_file_1).default; } });
var create_dir_1 = require("./file/create-dir");
Object.defineProperty(exports, "createDir", { enumerable: true, get: function () { return __importDefault(create_dir_1).default; } });
var get_config_file_1 = require("./file/get-config-file");
Object.defineProperty(exports, "getConfigFile", { enumerable: true, get: function () { return __importDefault(get_config_file_1).default; } });
var loop_and_rewrite_files_1 = require("./file/loop-and-rewrite-files");
Object.defineProperty(exports, "loopAndRewriteFiles", { enumerable: true, get: function () { return __importDefault(loop_and_rewrite_files_1).default; } });
var replace_root_dir_1 = require("./file/replace-root-dir");
Object.defineProperty(exports, "replaceRootDir", { enumerable: true, get: function () { return __importDefault(replace_root_dir_1).default; } });
var write_file_1 = require("./file/write-file");
Object.defineProperty(exports, "writeFile", { enumerable: true, get: function () { return __importDefault(write_file_1).default; } });
var write_log_file_1 = require("./file/write-log-file");
Object.defineProperty(exports, "writeLogFile", { enumerable: true, get: function () { return __importDefault(write_log_file_1).default; } });
var copy_paths_to_root_1 = require("./file/copy-paths-to-root");
Object.defineProperty(exports, "copyPathsToRoot", { enumerable: true, get: function () { return __importDefault(copy_paths_to_root_1).default; } });
// Module helpers
var add_local_module_1 = require("./module/add-local-module");
Object.defineProperty(exports, "addLocalModule", { enumerable: true, get: function () { return __importDefault(add_local_module_1).default; } });
var add_remote_module_1 = require("./module/add-remote-module");
Object.defineProperty(exports, "addRemoteModule", { enumerable: true, get: function () { return __importDefault(add_remote_module_1).default; } });
var convert_registry_path_to_url_1 = require("./module/convert-registry-path-to-url");
Object.defineProperty(exports, "convertRegistryPathToUrl", { enumerable: true, get: function () { return __importDefault(convert_registry_path_to_url_1).default; } });
var get_details_from_path_1 = require("./module/get-details-from-path");
Object.defineProperty(exports, "getDetailsFromPath", { enumerable: true, get: function () { return __importDefault(get_details_from_path_1).default; } });
var get_module_1 = require("./module/get-module");
Object.defineProperty(exports, "getModule", { enumerable: true, get: function () { return __importDefault(get_module_1).default; } });
var get_registry_1 = require("./module/get-registry");
Object.defineProperty(exports, "getRegistry", { enumerable: true, get: function () { return __importDefault(get_registry_1).default; } });
var get_substitutions_1 = require("./module/get-substitutions");
Object.defineProperty(exports, "getSubstitutions", { enumerable: true, get: function () { return __importDefault(get_substitutions_1).default; } });
var validate_module_path_1 = require("./module/validate-module-path");
Object.defineProperty(exports, "validateModulePath", { enumerable: true, get: function () { return __importDefault(validate_module_path_1).default; } });
// Question helpers
var blueprint_questions_1 = require("./questions/blueprint-questions");
Object.defineProperty(exports, "blueprintQuestions", { enumerable: true, get: function () { return __importDefault(blueprint_questions_1).default; } });
var existing_project_questions_1 = require("./questions/existing-project-questions");
Object.defineProperty(exports, "existingProjectQuestions", { enumerable: true, get: function () { return __importDefault(existing_project_questions_1).default; } });
var new_project_questions_1 = require("./questions/new-project-questions");
Object.defineProperty(exports, "newProjectQuestions", { enumerable: true, get: function () { return __importDefault(new_project_questions_1).default; } });
var prefab_questions_1 = require("./questions/prefab-questions");
Object.defineProperty(exports, "prefabQuestions", { enumerable: true, get: function () { return __importDefault(prefab_questions_1).default; } });
// String helpers
var change_case_1 = require("./string/change-case");
Object.defineProperty(exports, "changeCase", { enumerable: true, get: function () { return __importDefault(change_case_1).default; } });
var convert_numbers_to_words_1 = require("./string/convert-numbers-to-words");
Object.defineProperty(exports, "convertNumbersToWords", { enumerable: true, get: function () { return __importDefault(convert_numbers_to_words_1).default; } });
var convert_symbols_to_words_1 = require("./string/convert-symbols-to-words");
Object.defineProperty(exports, "convertSymbolsToWords", { enumerable: true, get: function () { return __importDefault(convert_symbols_to_words_1).default; } });
var detect_path_type_1 = require("./string/detect-path-type");
Object.defineProperty(exports, "detectPathType", { enumerable: true, get: function () { return __importDefault(detect_path_type_1).default; } });
var get_path_from_root_1 = require("./string/get-path-from-root");
Object.defineProperty(exports, "getPathFromRoot", { enumerable: true, get: function () { return __importDefault(get_path_from_root_1).default; } });
var get_site_link_1 = require("./string/get-site-link");
Object.defineProperty(exports, "getSiteLink", { enumerable: true, get: function () { return __importDefault(get_site_link_1).default; } });
var normalise_case_1 = require("./string/normalise-case");
Object.defineProperty(exports, "normaliseCase", { enumerable: true, get: function () { return __importDefault(normalise_case_1).default; } });
var pluralise_1 = require("./string/pluralise");
Object.defineProperty(exports, "pluralise", { enumerable: true, get: function () { return __importDefault(pluralise_1).default; } });
var random_word_generator_1 = require("./string/random-word-generator");
Object.defineProperty(exports, "randomNameGenerator", { enumerable: true, get: function () { return __importDefault(random_word_generator_1).default; } });
var url_with_protocol_1 = require("./string/url-with-protocol");
Object.defineProperty(exports, "urlWithProtocol", { enumerable: true, get: function () { return __importDefault(url_with_protocol_1).default; } });
