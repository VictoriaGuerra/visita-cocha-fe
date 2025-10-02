import {Injectable} from '@angular/core';

import { MongoRepositoryService } from 'src/framework/repository/mongo.repository-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesRepositoryService extends MongoRepositoryService<any> {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  public getCollectionName(): string {
    return 'main-category';
  }
}
