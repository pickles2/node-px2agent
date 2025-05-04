declare module 'node-php-bin' {
  interface PhpBinOptions {
    bin?: string;
    ini?: string | null;
  }

  interface PhpBin {
    getPath(): string;
    getIniPath(): string | null;
    getExtensionDir(): string;
  }

  const nodePhpBin: {
    get(options: PhpBinOptions): PhpBin;
  };

  export = nodePhpBin;
}