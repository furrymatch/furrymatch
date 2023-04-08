import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';

import { PetFormService, PetFormGroup } from './pet-form.service';
import { IPet } from '../pet.model';
import { PetService } from '../service/pet.service';
import { PhotoService } from '../../photo/service/photo.service';
import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';
import { IBreed } from 'app/entities/breed/breed.model';
import { BreedService } from 'app/entities/breed/service/breed.service';
import { PetType } from 'app/entities/enumerations/pet-type.model';
import { Sex } from 'app/entities/enumerations/sex.model';
import { IPhoto, NewPhoto } from '../../photo/photo.model';
import Swal from 'sweetalert2';
import { FormArray } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-pet-update',
  templateUrl: './pet-update.component.html',
  styleUrls: ['pet-update.component.css'],
})
export class PetUpdateComponent implements OnInit {
  isSaving = false;
  pet: IPet | null = null;
  petTypeValues = Object.keys(PetType);
  sexValues = Object.keys(Sex);

  maxPhotos = 5;
  update = false;

  ownersSharedCollection: IOwner[] = [];
  breedsSharedCollection: IBreed[] = [];

  editForm: PetFormGroup = this.petFormService.createPetFormGroup();

  pets: IPet[] = [];
  petFiles: File[] = [];
  petPhotos: string[][] = Array(5).fill([]);

  filteredBreedsSharedCollection: IBreed[] = [];
  destroy$: Subject<void> = new Subject();

  constructor(
    protected petService: PetService,
    protected petFormService: PetFormService,
    protected ownerService: OwnerService,
    protected breedService: BreedService,
    protected photoService: PhotoService,
    protected activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  compareOwner = (o1: IOwner | null, o2: IOwner | null): boolean => this.ownerService.compareOwner(o1, o2);

  compareBreed = (o1: IBreed | null, o2: IBreed | null): boolean => this.breedService.compareBreed(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pet }) => {
      this.pet = pet;
      if (pet) {
        this.update = true;
        this.updateForm(pet);
      }

      this.loadRelationshipsOptions();
    });

    this.editForm
      .get('petType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(petType => {
        if (petType !== undefined) {
          this.updateFilteredBreeds(petType);
        }
      });

    this.loadPets();
  }

  loadPets(): void {
    this.petService.query().subscribe((res: HttpResponse<IPet[]>) => {
      this.pets = res.body || [];
    });
  }

  onSelect(event?: any): void {
    const maxPhotosReached = this.petFiles.length >= this.maxPhotos;
    if (maxPhotosReached) {
      Swal.fire({
        title: 'Error',
        text: 'Solo se permiten hasta 5 fotos por mascota',
        icon: 'error',
        confirmButtonColor: '#3381f6',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    this.petFiles.push(...event.addedFiles);
  }

  onRemove(event?: any): void {
    this.petFiles.splice(this.petFiles.indexOf(event), 1);
  }

  onUpload(): void {
    if (!this.petFiles.length) {
      Swal.fire({
        title: 'Error',
        text: 'Debés primero arrastrar o seleccionar una imagen.',
        icon: 'error',
        confirmButtonColor: '#3381f6',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    this.petFiles.forEach(file_data => {
      const data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'furry_match');
      data.append('cloud_name', 'alocortesu');

      this.petService.uploadImage(data).subscribe(response => {
        if (response) {
          const secureUrl = response.secure_url;
          this.petPhotos.push(secureUrl);

          Swal.fire({
            title: 'Fotografía agregada',
            text: 'Continuá registrando tus datos.',
            icon: 'success',
            confirmButtonColor: '#3381f6',
            confirmButtonText: 'Cerrar',
          });
        }
      });
      console.log('Fotos en onUpload ' + this.petFiles);
    });
  }

  previousState(): void {
    window.history.back();
  }

  updateFilteredBreeds(petType: PetType | null): void {
    if (petType) {
      console.log('El valor de petType no está vacío:', petType);
      this.filteredBreedsSharedCollection = this.breedsSharedCollection.filter(breed => breed.breedType === petType);
    } else {
      console.log('El valor de petType está vacío');
      this.filteredBreedsSharedCollection = [];
    }
    console.log('Filtered breeds:', this.filteredBreedsSharedCollection);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  photos: FormArray = new FormArray<any>([]);

  save(): void {
    console.log('Save function called');
    this.isSaving = true;
    const pet = this.petFormService.getPet(this.editForm);
    console.log('Pet object:', pet);
    pet.photos = this.createPhotosArray();
    console.log(pet.photos.length);
    if (pet.id !== null) {
      this.subscribeToSaveResponse(this.petService.update(pet));
    } else {
      this.subscribeToSaveResponse(this.petService.create(pet));
    }
  }

  private createPhotosArray(): IPhoto[] {
    const photos: IPhoto[] = [];

    const flattenedPhotos = this.petPhotos.reduce((acc, val) => acc.concat(val), []);
    let counter = 0;
    for (const photoUrl of flattenedPhotos) {
      const photo: IPhoto = {
        id: counter,
        uploadDate: null,
        photoUrl: photoUrl,
        pet: null,
      };
      photos.push(photo);
      counter++;
    }
    return photos;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPet>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
    console.log('exito');
  }

  protected onSaveError(): void {
    // Api for inheritance.
    console.log('error');
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pet: IPet): void {
    this.pet = pet;
    this.petFormService.resetForm(this.editForm, pet);

    this.ownersSharedCollection = this.ownerService.addOwnerToCollectionIfMissing<IOwner>(this.ownersSharedCollection, pet.owner);
    this.filteredBreedsSharedCollection = this.breedService.addBreedToCollectionIfMissing<IBreed>(this.breedsSharedCollection, pet.breed);
  }

  protected loadRelationshipsOptions(): void {
    this.ownerService
      .query()
      .pipe(map((res: HttpResponse<IOwner[]>) => res.body ?? []))
      .pipe(map((owners: IOwner[]) => this.ownerService.addOwnerToCollectionIfMissing<IOwner>(owners, this.pet?.owner)))
      .subscribe((owners: IOwner[]) => (this.ownersSharedCollection = owners));

    this.breedService
      .query()
      .pipe(map((res: HttpResponse<IBreed[]>) => res.body ?? []))
      .pipe(tap((breeds: IBreed[]) => console.log('API response:', breeds)))
      .pipe(map((breeds: IBreed[]) => this.breedService.addBreedToCollectionIfMissing<IBreed>(breeds, this.pet?.breed)))
      .subscribe((breeds: IBreed[]) => (this.breedsSharedCollection = breeds));
    console.log(
      'Dog breeds:',
      this.breedsSharedCollection.filter(breed => breed.breedType === 'Perro')
    );
    console.log(
      'Cat breeds:',
      this.breedsSharedCollection.filter(breed => breed.breedType === 'Gato')
    );
    console.log(this.pet?.breed);
    console.log('Breeds loaded:', this.breedsSharedCollection);
  }

  delete(): void {
    Swal.fire({
      title: '¿Deseás eliminar a tu mascota?',
      text: 'Si hacés click en el botón de Sí perderás toda la información del mismo.',
      showCancelButton: false,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      icon: 'success',
      confirmButtonColor: '#3381f6',
      denyButtonColor: '#3381f6',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.petService.delete(this.pet?.id).subscribe(() => {
          this.router.navigate(['/pet']);
          console.log('borrado');
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo borrar tu mascota. Por favor intentá nuevamente.',
          icon: 'error',
          confirmButtonColor: '#3381f6',
          confirmButtonText: 'Cerrar',
        });
      }
    });
  }
}
