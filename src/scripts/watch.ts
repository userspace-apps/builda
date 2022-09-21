#! /usr/bin/env node

// Watch for changes in the specified directories and run the 'sync-watched' script when changes are detected

import chokidar from 'chokidar';

import { printMessage, throwError, checkAndCopyPath } from '@helpers';

import globals from '@data/globals';

import type { ConfigFile } from '@typedefs/config-file';

export const watch = (config: ConfigFile) => {
  if (config) {
    const { prefab, app_root } = config;
    const cleanRoot = app_root.replace(/\.\//, '');

    if (!prefab) {
      throwError(
        'No prefab found in config file. Watch cannot be run without a prefab'
      );
    }

    const watcher = chokidar.watch(config.app_root, {
      persistent: true,
      ignored: ['node_modules', '.builda', '.git', '.DS_Store']
    });

    watcher.on('ready', () => {
      printMessage('Watching for changes...', 'primary');
      printMessage('Press Ctrl+C to stop watching', 'secondary');
    });

    watcher.on('change', (pathString) => {
      console.log(`File ${pathString} has been changed`);
      checkAndCopyPath(
        pathString,
        `${globals.buildaDir}/build`,
        pathString.replace(cleanRoot, '')
      );
    });
  } else {
    throwError('No config file found');
  }
};

export default watch;
