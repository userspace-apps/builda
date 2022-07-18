import fs from 'fs';
import axios from 'axios';

import debug from '@scripts/debug';
import buildFromScaffold from '@scripts/build-from-scaffold';
import getFileListFromRegistry from '@helpers/get-file-list-from-registry';
import path from 'path';

const MOCK_SCAFFOLD_PATH = './src/mocks/scaffolds/test-scaffold';
const MOCK_OUTPUT_DIRECTORY = './experiments/atom';
const MOCK_REMOTE_SCAFFOLD_PATH =
  'https://rococo-seahorse-bfbde7.netlify.app/component-with-storybook';

jest.mock('@helpers/get-file-list-from-registry');

describe('Build from local scaffold function', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    debug({ runInit: true, force: true });
    return buildFromScaffold('atom', 'LocalComponent', MOCK_SCAFFOLD_PATH);
  });

  afterAll(() => {
    jest.restoreAllMocks();
    fs.rmSync('./experiments', { recursive: true });
  });

  test('An index.tsx file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/local-component/index.tsx`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain(
      'export const LocalComponent: React.FC<Props> = ({ text, ...props }: Props) => {'
    );
    expect(file).toContain(
      "<div className={styles['local-component']} {...props}>"
    );
    expect(file).toContain('export default LocalComponent;');
  });

  test('An index.stories.tsx file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/local-component/index.stories.mdx`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain('title="atom/LocalComponent"');
    expect(file).toContain('component={LocalComponent}');
    expect(file).toContain('# Local component');
    expect(file).toContain('The Local component component.');
    expect(file).toContain('{(args) => <LocalComponent {...args} />}');
    expect(file).toContain('<ArgsTable of={LocalComponent} />');
  });

  test('A styles.module.scss file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/local-component/styles.module.scss`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain('.local-component {');
  });
});

describe('Build from remote scaffold function', () => {
  beforeAll(async () => {
    // @ts-ignore - This is a mock
    getFileListFromRegistry.mockImplementationOnce(() =>
      Promise.resolve(['index.tsx', 'index.stories.mdx', 'styles.module.scss'])
    );
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({
        data: true
      })
      .mockResolvedValueOnce({
        data: fs.readFileSync(
          path.resolve('./src/mocks/scaffolds/test-scaffold/index.tsx'),
          'utf8'
        )
      })
      .mockResolvedValueOnce({
        data: fs.readFileSync(
          path.resolve('./src/mocks/scaffolds/test-scaffold/index.stories.mdx'),
          'utf8'
        )
      })
      .mockResolvedValueOnce({
        data: fs.readFileSync(
          path.resolve(
            './src/mocks/scaffolds/test-scaffold/styles.module.scss'
          ),
          'utf8'
        )
      });

    debug({ runInit: true, force: true });
    await new Promise(process.nextTick);
    await buildFromScaffold(
      'atom',
      'RemoteComponent',
      MOCK_REMOTE_SCAFFOLD_PATH
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
    fs.rmSync('./experiments', { recursive: true });
  });

  test('getFileListFromRegistry is called', () => {
    expect(getFileListFromRegistry).toHaveBeenCalledWith(
      MOCK_REMOTE_SCAFFOLD_PATH
    );
  });

  test('An index.tsx file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/remote-component/index.tsx`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain(
      'export const RemoteComponent: React.FC<Props> = ({ text, ...props }: Props) => {'
    );
    expect(file).toContain(
      "<div className={styles['remote-component']} {...props}>"
    );
    expect(file).toContain('export default RemoteComponent;');
  });

  test('An index.stories.mdx file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/remote-component/index.stories.mdx`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain('title="atom/RemoteComponent"');
    expect(file).toContain('component={RemoteComponent}');
    expect(file).toContain('# Remote component');
    expect(file).toContain('The Remote component component.');
    expect(file).toContain('{(args) => <RemoteComponent {...args} />}');
    expect(file).toContain('<ArgsTable of={RemoteComponent} />');
  });

  test('A styles.module.scss file is generated with the correct data', () => {
    const filePath = `${MOCK_OUTPUT_DIRECTORY}/remote-component/styles.module.scss`;
    expect(fs.existsSync(filePath)).toBe(true);
    const file = fs.readFileSync(filePath, 'utf8');
    expect(file).toContain('.remote-component {');
  });
});
