import { Injectable } from '@angular/core';
import { FirebaseRepositoryService } from 'src/framework/repository/firebase.repository-service';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private collectionPrefix = 'reviews-';

  constructor(private repo: FirebaseRepositoryService<any>) { }

  public addReview(moduleName: string, id: string, review: any) {
    // repo is a FirebaseRepositoryService tied to a collection name via subclass;
    // to add reviews we expect a ReviewsRepository implementation per collection. As a simple fallback,
    // use createWithID if available or create. Here we call create with the review payload.
    return this.repo.create({ resourceId: id, ...review } as any);
  }

  public listReviews(moduleName: string, id: string) {
    return this.repo.getByQuery({ queryList: [{ field: 'resourceId', operation: '==', value: id }] } as any);
  }
}
