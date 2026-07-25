import type { StorageProvider } from './StorageProvider';
export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly storage:Storage=window.localStorage){}
  async read(key:string):Promise<string|null>{return this.storage.getItem(key);}
  async write(key:string,value:string):Promise<void>{this.storage.setItem(key,value);}
  async remove(key:string):Promise<void>{this.storage.removeItem(key);}
}
