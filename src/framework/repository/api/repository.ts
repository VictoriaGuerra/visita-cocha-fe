import {Observable} from 'rxjs';
import {ConfigList} from './config-list.model';

export interface Repository<BASE_ENTITY> {
  getCollectionName(): string;

  list(): Observable<BASE_ENTITY []>;

  create(entity: BASE_ENTITY): Observable<void>;

  createMany(entityList: BASE_ENTITY []): Promise<void>;

  getById(id: string): Observable<BASE_ENTITY>;

  getByQuery(configList: ConfigList): Observable<any>;

  update(entity: BASE_ENTITY, id: string): Observable<void>;

  delete(id: string): Observable<void>;
}
