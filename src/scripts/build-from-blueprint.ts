import fs from 'node:fs';

// import helpers
import { printMessage, getModule, writeFile, getSubstitutions } from '@helpers';
import { changeCase } from '@helpers/string-functions';

// Import types
import { BlueprintScriptContent } from '@typedefs/blueprint-script-config';
import { Argv } from '@typedefs/argv';
import { ConfigFile } from '@typedefs/config-file';
import path from 'path';

type Props = {
  config: ConfigFile;
  name: string;
  command: BlueprintScriptContent;
  args?: Argv;
};

export const buildFromBlueprint = ({ config, name, command, args }: Props) => {
  if (config !== undefined && !!command.use) {
    printMessage(`Building ${Object.keys(command)[0]} '${name}'...`, 'notice');
    const outputDirectory = `${command.output_dir}/${changeCase(
      name,
      'kebabCase'
    )}`;

    // Create the directory tree if it doesn't exist
    fs.mkdirSync(outputDirectory, { recursive: true });

    const { path: pathstring, registry } = getModule(
      'blueprint',
      config,
      command
    );

    const substitute = command
      ? getSubstitutions({
          registry,
          name,
          command,
          args
        })
      : [];

    const fullPath = path.resolve(pathstring, 'files');
    fs.readdirSync(fullPath).forEach((file: string) => {
      const srcPath = `${fullPath}/${file}`;
      const outputPath = `${outputDirectory}`;

      writeFile({
        file: srcPath,
        output_dir: outputPath,
        substitute,
        name
      });
    });

    const componentRegistry = {
      name,
      version: '1.0.0',
      author: '',
      blueprint: {
        name: registry.name,
        version: registry.version
      }
    };

    // Add a component registry file to the output directory
    return fs.writeFileSync(
      `${outputDirectory}/registry.json`,
      JSON.stringify(componentRegistry, null, 2)
    );
  }
  throw new Error('No config file found');
};

export default buildFromBlueprint;
