import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

const { Filesystem } = Plugins;
const ENCODING = FilesystemEncoding.UTF8;
const DIR_ROOT = FilesystemDirectory.Documents;
const DIR_APP = 'kakebo';

export async function writeFile(fileName: string, content: string): Promise<void> {
  const path = `${DIR_APP}/${fileName}`;
  try {
    await Filesystem.mkdir({ path: DIR_APP, directory: DIR_ROOT, recursive: true });
  } catch (err) {
    void 0;
  }
  await Filesystem.writeFile({ path, data: content, directory: DIR_ROOT, encoding: ENCODING });
}

export async function readFile(fileName: string): Promise<string> {
  const path = `${DIR_APP}/${fileName}`;
  const result = await Filesystem.readFile({ path, directory: DIR_ROOT, encoding: ENCODING });
  return result.data;
}
