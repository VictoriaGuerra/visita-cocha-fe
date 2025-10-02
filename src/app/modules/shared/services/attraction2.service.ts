
import {Injectable} from '@angular/core';

import { MongoRepositoryService } from 'src/framework/repository/mongo.repository-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttractionRepositoryService2 extends MongoRepositoryService<any> {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  public getCollectionName(): string {
    return 'attractions';
  }
}
