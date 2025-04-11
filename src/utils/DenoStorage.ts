export class LocalStorageDeno<T extends Record<string, any>> {
  constructor(private prefix: string = "") {}

  private getKey(key: keyof T & string): string {
    return this.prefix + key;
  }

  public set<K extends keyof T & string>(key: K, value: T[K]): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  public get<K extends keyof T & string>(key: K): T[K] | null {
    const item = localStorage.getItem(this.getKey(key));
    return item ? JSON.parse(item) : null;
  }

  public removeItem(key: keyof T & string): void {
    localStorage.removeItem(this.getKey(key));
  }

  public clear(): void {
    localStorage.clear();
  }
}

export class SessionStorageDeno<T extends Record<string, any>> {
  constructor(private prefix: string = "") {}

  private getKey(key: keyof T & string): string {
    return this.prefix + key;
  }

  public set<K extends keyof T & string>(key: K, value: T[K]): void {
    sessionStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  public get<K extends keyof T & string>(key: K): T[K] | null {
    const item = sessionStorage.getItem(this.getKey(key));
    return item ? JSON.parse(item) : null;
  }

  public removeItem(key: keyof T & string): void {
    sessionStorage.removeItem(this.getKey(key));
  }

  public clear(): void {
    sessionStorage.clear();
  }
}

export class LocalStorageWithDefaultsDeno<
  T extends Record<string, any>
> extends LocalStorageDeno<T> {
  constructor(private defaultData: T, prefix: string = "") {
    super(prefix);
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    for (const [key, value] of Object.entries(this.defaultData)) {
      if (this.get(key as keyof T & string) === null) {
        this.set(key as keyof T & string, value);
      }
    }
  }

  public override get<K extends keyof T & string>(key: K): T[K] {
    const value = super.get(key);
    return value ?? this.defaultData[key];
  }
}

export class SessionStorageWithDefaultsDeno<
  T extends Record<string, any>
> extends SessionStorageDeno<T> {
  constructor(private defaultData: T, prefix: string = "") {
    super(prefix);
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    for (const [key, value] of Object.entries(this.defaultData)) {
      if (this.get(key as keyof T & string) === null) {
        this.set(key as keyof T & string, value);
      }
    }
  }

  public override get<K extends keyof T & string>(key: K): T[K] {
    const value = super.get(key);
    return value ?? this.defaultData[key];
  }
}
