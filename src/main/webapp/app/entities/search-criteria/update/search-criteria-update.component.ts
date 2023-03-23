import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SearchCriteriaFormService, SearchCriteriaFormGroup } from './search-criteria-form.service';
import { ISearchCriteria } from '../search-criteria.model';
import { SearchCriteriaService } from '../service/search-criteria.service';
import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';
import { Sex } from 'app/entities/enumerations/sex.model';

@Component({
  selector: 'jhi-search-criteria-update',
  templateUrl: './search-criteria-update.component.html',
})
export class SearchCriteriaUpdateComponent implements OnInit {
  isSaving = false;
  searchCriteria: ISearchCriteria | null = null;
  sexValues = Object.keys(Sex);

  petsSharedCollection: IPet[] = [];

  editForm: SearchCriteriaFormGroup = this.searchCriteriaFormService.createSearchCriteriaFormGroup();

  constructor(
    protected searchCriteriaService: SearchCriteriaService,
    protected searchCriteriaFormService: SearchCriteriaFormService,
    protected petService: PetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePet = (o1: IPet | null, o2: IPet | null): boolean => this.petService.comparePet(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ searchCriteria }) => {
      this.searchCriteria = searchCriteria;
      if (searchCriteria) {
        this.updateForm(searchCriteria);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const searchCriteria = this.searchCriteriaFormService.getSearchCriteria(this.editForm);
    if (searchCriteria.id !== null) {
      this.subscribeToSaveResponse(this.searchCriteriaService.update(searchCriteria));
    } else {
      this.subscribeToSaveResponse(this.searchCriteriaService.create(searchCriteria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISearchCriteria>>): void {
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

  protected updateForm(searchCriteria: ISearchCriteria): void {
    this.searchCriteria = searchCriteria;
    this.searchCriteriaFormService.resetForm(this.editForm, searchCriteria);

    this.petsSharedCollection = this.petService.addPetToCollectionIfMissing<IPet>(this.petsSharedCollection, searchCriteria.pet);
  }

  protected loadRelationshipsOptions(): void {
    this.petService
      .query()
      .pipe(map((res: HttpResponse<IPet[]>) => res.body ?? []))
      .pipe(map((pets: IPet[]) => this.petService.addPetToCollectionIfMissing<IPet>(pets, this.searchCriteria?.pet)))
      .subscribe((pets: IPet[]) => (this.petsSharedCollection = pets));
  }
}
