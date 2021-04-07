export interface Settings {
  name: string;
  kudu: {
    website: string;
    username: string;
    password: string;
  };
}

export function read(
  publishSettingsPath: string,
  callback: (err: unknown, settings: Settings) => void
): void;
export function readAsync(publishSettingsPath: string): Promise<Settings>;
