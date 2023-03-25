import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OwnerFormService, OwnerFormGroup } from './owner-form.service';
import { IOwner } from '../owner.model';
import { OwnerService } from '../service/owner.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'jhi-owner-update',
  templateUrl: './owner-update.component.html',
  styleUrls: ['./owner-update.component.css'],
  providers: [OwnerService],
})
export class OwnerUpdateComponent implements OnInit {
  isSaving = false;
  owner: IOwner | null = null;

  editForm: OwnerFormGroup = this.ownerFormService.createOwnerFormGroup();

  constructor(
    protected ownerService: OwnerService,
    protected ownerFormService: OwnerFormService,
    protected activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  files: File[] = [];

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ owner }) => {
      this.owner = owner;
      if (owner) {
        this.updateForm(owner);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  onSelect(event?: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event?: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  photo: FormControl<IOwner['photo']> = new FormControl<IOwner['photo']>(null);

  onUpload() {
    //Escape empty array
    if (!this.files[0]) alert('Debés primero arrastrar o seleccionar una imagen');

    //Upload to Cloudinary
    const file_data = this.files[0];
    const data = new FormData();
    data.append('file', file_data);
    data.append('upload_preset', 'furry_match');
    data.append('cloud_name', 'alocortesu');

    this.ownerService.uploadImage(data).subscribe(response => {
      if (response) {
        const secureUrl = response.secure_url;
        this.photo.setValue(secureUrl);
      }
    });
  }

  save(): void {
    this.isSaving = true;
    const owner = this.ownerFormService.getOwner(this.editForm);
    if (owner.id !== null) {
      owner.photo = this.photo.value;
      this.subscribeToSaveResponse(this.ownerService.update(owner));
    } else {
      owner.photo = this.photo.value;
      this.subscribeToSaveResponse(this.ownerService.create(owner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOwner>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(owner: IOwner): void {
    this.owner = owner;
    this.ownerFormService.resetForm(this.editForm, owner);
  }
}
