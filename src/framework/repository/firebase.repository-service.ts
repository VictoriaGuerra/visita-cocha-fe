import { Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { CollectionReference } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore/collection/collection';
import { DocumentReference } from '@angular/fire/compat/firestore/interfaces';
import { OrderByDirection } from '@angular/fire/firestore';

import { from, map, Observable, lastValueFrom, of } from 'rxjs';

import { Repository } from './api/repository';
import { ConfigList, OrderByConfig } from './api/config-list.model';
import { environment } from 'src/environments/environment';

export abstract class FirebaseRepositoryService<ENTITY> implements Repository<ENTITY> {
  // If AngularFirestore is available we keep compatibility with Firestore.
  private _collectionRef: AngularFirestoreCollection<ENTITY> | null = null;

  private _angularFirestore: AngularFirestore | null = null;
  private _http: HttpClient | null = null;
  private _apiBaseUrl: string | null = environment.apiBaseUrl || null;

  /**
   * Use Injector so subclasses don't need to change their constructors.
   * This implementation supports either a REST API (Mongo) via HttpClient + environment.apiBaseUrl
   * or falls back to AngularFirestore when available.
   */
  private _injector: Injector | null = null;

  constructor(protected injectorOrAngularFirestore: Injector | AngularFirestore) {
    // Support both patterns: callers may pass an Injector (new style) or AngularFirestore (old style)
    if ((injectorOrAngularFirestore as any) && typeof (injectorOrAngularFirestore as any).get === 'function') {
      this._injector = injectorOrAngularFirestore as Injector;
    } else {
      this._angularFirestore = injectorOrAngularFirestore as AngularFirestore;
    }

    // If we have an injector, try to obtain HttpClient and AngularFirestore from it
    if (this._injector) {
      try { this._http = this._injector.get(HttpClient); } catch (e) { this._http = null; }
      try { this._angularFirestore = this._injector.get(AngularFirestore); } catch (e) { /* no firestore available */ }
    }

    if (this._angularFirestore) {
      try {
        this._collectionRef = this._angularFirestore.collection<ENTITY>(this.getCollectionName());
      } catch (e) {
        this._collectionRef = null;
      }
    }
  }

  public create(entity: ENTITY): Observable<void> {
    // REST (Mongo) path
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}`;
      return this._http.post<any>(url, entity).pipe(map(() => void 0));
    }

    // Firestore fallback
    if (this._collectionRef) {
      return from(this._collectionRef.add(entity)).pipe(map(() => void 0));
    }

    // no-op
    return of(void 0);
  }

  public async createMany(entityList: ENTITY []): Promise<void> {
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/bulk`;
      // Attempt a single bulk POST; if backend doesn't support it, callers should fall back.
      try {
        await lastValueFrom(this._http.post(url, { items: entityList }));
        return;
      } catch (e) {
        // fallback to individual creates
        await Promise.all(entityList.map((ent) => lastValueFrom(this._http!.post(`${this._apiBaseUrl}/${this.getCollectionName()}`, ent))));
        return;
      }
    }

    if (this._angularFirestore && this._collectionRef) {
      const batch: any = this._angularFirestore.firestore.batch();
      for (const entity of entityList) {
        const docRef: DocumentReference<ENTITY> = this._collectionRef.doc().ref;
        batch.set(docRef, entity);
      }
      return batch.commit();
    }

    return Promise.resolve();
  }

  public createWithID(id: string, entity: ENTITY): any {
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/${id}`;
      return this._http.put(url, entity).toPromise();
    }

    if (this._collectionRef) {
      return this._collectionRef.doc(id).set(entity);
    }

    return Promise.resolve();
  }

  public delete(id: string): Observable<void> {
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/${id}`;
      return this._http.delete<void>(url);
    }

    if (this._collectionRef) {
      return from(this._collectionRef.doc(id).delete());
    }

    return of(void 0);
  }

  public getById(id: string): Observable<ENTITY> {
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/${id}`;
      return this._http.get<ENTITY>(url);
    }

    if (this._collectionRef) {
      return this._collectionRef.doc(id).valueChanges({ idField: 'id' }) as Observable<ENTITY>;
    }

    return of(null as any);
  }

  public list(): Observable<ENTITY []> {
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}`;
      return this._http.get<ENTITY[]>(url);
    }

    if (this._collectionRef) {
      return this._collectionRef.valueChanges({ idField: 'id' });
    }

    return of([] as ENTITY[]);
  }

  public update(entity: Partial<ENTITY>, id: string): Observable<void> {
    const entityToDB: any = entity;
    delete entityToDB.id;

    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/${id}`;
      return this._http.put<void>(url, entityToDB);
    }

    if (this._collectionRef) {
      return from(this._collectionRef.doc(id).update(entityToDB));
    }

    return of(void 0);
  }

  public getByQuery(configList: ConfigList, limit?: number): Observable<any> {
    // Prefer REST query endpoint when available
    if (this._http && this._apiBaseUrl) {
      const url = `${this._apiBaseUrl.replace(/\/$/, '')}/${this.getCollectionName()}/query`;
      const payload: any = { config: configList || {}, limit };
      return this._http.post<any>(url, payload);
    }

    // Firestore path
    if (this._angularFirestore) {
      const queryFn = (ref: CollectionReference<any>) => {
        let query: Query = ref;

        if (configList && configList.queryList) {
          configList.queryList
            .forEach((queryPart: any) => {
              query = query.where(queryPart.field, queryPart.operation, queryPart.value);
            });
        }

        if (configList && configList.orderByConfigList) {
          configList.orderByConfigList
            .forEach((orderByConfig: OrderByConfig) => {
              query = query.orderBy(orderByConfig.field, orderByConfig.direction as OrderByDirection);
            });
        }

        if (limit) {
          query = query.limit(limit);
        }

        return query;
      };

      return this._angularFirestore.collection<ENTITY>(this.getCollectionName(), queryFn)
        .valueChanges({ idField: 'id' });
    }

    return of([]);
  }

  public getByAttribute(attribute: string, value: any, configList?: ConfigList): Observable<any> {
    const defaultConfigList: ConfigList = {
      orderByConfigList: configList?.orderByConfigList,
      queryList: [
        {
          field: attribute,
          operation: '==',
          value: value
        }
      ]
    };

    return this.getByQuery(defaultConfigList);
  }

  public abstract getCollectionName(): string;

}
