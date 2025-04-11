import fs from "node:fs/promises";
import {
  ensureFile,
  copy,
  ensureDir,
  move,
  exists,
  expandGlob,
  walk,
} from "@std/fs";

export class FileManager {
  static async exists(filePath: string) {
    try {
      await fs.access(filePath);
      return true; // The file exists
    } catch (_) {
      return false; // The file does not exist
    }
  }

  static async removeFile(filepath: string) {
    if (await this.exists(filepath)) {
      await fs.rm(filepath);
    }
  }

  static async createFile(
    filepath: string,
    content: string,
    options?: {
      override?: boolean;
    }
  ) {
    if ((await this.exists(filepath)) && options?.override) {
      await fs.rm(filepath);
    }
    await fs.writeFile(filepath, content);
  }

  static async createDirectory(
    directoryPath: string,
    options?: {
      overwrite?: boolean;
    }
  ) {
    if (await this.exists(directoryPath)) {
      if (options?.overwrite) {
        await fs.rm(directoryPath, { recursive: true, force: true });
        await fs.mkdir(directoryPath, { recursive: true });
      }
    } else {
      await fs.mkdir(directoryPath, { recursive: true });
    }
  }

  static async readFile(filepath: string) {
    return await fs.readFile(filepath, "utf-8");
  }
}

export class DenoFileManager {
  static async upsertFile(filePath: string) {
    return await ensureFile(filePath);
  }

  static async writeTextFile(filepath: string, content: string) {
    return await Deno.writeTextFile(filepath, content);
  }

  static async upsertFolder(dirPath: string) {
    return await ensureDir(dirPath);
  }

  static async readTextFile(filepath: string) {
    return await Deno.readTextFile(filepath);
  }

  static async readFileAsBlob(filepath: string) {
    const bytes = await Deno.readFile(filepath);
    return new Blob([bytes]);
  }

  static async exists(path: string) {
    return await exists(path);
  }

  static async listFilesFromGlob(globPath: string) {
    const files = await Array.fromAsync(expandGlob(globPath));
    return files;
  }

  static async moveFileToFolder(filePath: string, folderPath: string) {
    await move(filePath, folderPath);
  }

  static async rename(path: string, newPath: string) {
    await fs.rename(path, newPath);
  }

  static async copyFile(filePath: string, newFilePath: string) {
    await Deno.copyFile(filePath, newFilePath);
  }

  static async copyFolder(source: string, folder: string) {
    await copy(source, folder);
  }

  static async walkDir(
    dirPath: string,
    cb: (entry: Deno.DirEntry) => Promise<void>,
    options?: {
      extensionsToInclude?: string[];
      includeDirs?: boolean;
      includeFiles?: boolean;
      filePatternsToMatch?: RegExp[];
      filePatternsToSkip?: RegExp[];
    }
  ) {
    for await (const entry of walk(dirPath, {
      exts: options?.extensionsToInclude,
      includeDirs: options?.includeDirs,
      includeFiles: options?.includeFiles,
      skip: options?.filePatternsToSkip,
      match: options?.filePatternsToMatch,
    })) {
      await cb(entry);
    }
  }
}
