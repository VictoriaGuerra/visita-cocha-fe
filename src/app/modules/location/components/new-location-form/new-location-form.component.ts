import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryRepositoryService } from 'src/app/modules/shared/services/main-category.repository-service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfigList } from 'src/framework/repository/api/config-list.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GoogleAuthService } from 'src/app/modules/shared/services/tt-google-auth.service';
import { LocationRequestRepositoryService } from 'src/app/modules/shared/services/location-request.service';

@Component({
  selector: 'new-location-form',
  templateUrl: './new-location-form.html'
})
export class NewLocationFormComponent implements OnInit {

  public categoryList: any;
  public selectedTab: any;
  public locationForm: FormGroup;

  public configList: ConfigList;
  private _unsubscribe: Subject<void>;

  constructor(private _locationRequestRepositoryService: LocationRequestRepositoryService,
              private _categoryRepositoryService: CategoryRepositoryService,
              private _googleAuthService: GoogleAuthService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();

    this.configList = {
      queryList: [
        {
          field: 'available',
          operation: '==',
          value: true
        }
      ],
      orderByConfigList: [
        {
          field: 'order',
          direction: 'asc'
        },
        {
          field: 'name',
          direction: 'asc'
        }
      ]
    };
  }

  ngOnInit() {
    this.categoryList = null;
    this.selectedTab = 'attractions';

    this.locationForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      categories: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      gmaplink: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required])
    });

    this._getCategories();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private async _getCategories() {
    this._categoryRepositoryService.getByQuery(this.configList)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((categoryList: any) => {
        this.categoryList = categoryList;

        this._cdr.markForCheck();
      });
  }

  public changeTab(event: any): void {
    this.selectedTab = event.detail.value;
  }

  submitForm() {
    const formData = this.locationForm.value;

    try {
      this._googleAuthService.login().then((res: any) => {
        if (res?.user) {
          formData.senderEmail = res?.user?.email;

          this._createLocationRequest(formData);
        }
      });
    } catch (error) {
      alert('Error iniciando sesión');
    }
  }

  private _createLocationRequest(formData: any) {
    try {
      this._locationRequestRepositoryService.create(formData);
      this.locationForm.reset();
      alert('Solicitud enviada correctamente. Gracias por tu ayuda.');
    } catch (error) {
      console.log(error);
      alert('Error enviando solicitud');
    }
  }
}
