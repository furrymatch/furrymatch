import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPet, NewPet } from '../pet.model';
import {IPhoto} from "../../photo/photo.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPet for edit and NewPetFormGroupInput for create.
 */
type PetFormGroupInput = IPet | PartialWithRequiredKeyOf<NewPet>;

type PetFormDefaults = Pick<NewPet, 'id' | 'tradeMoney' | 'tradePups' | 'pedigree'>;

type PetFormGroupContent = {
  id: FormControl<IPet['id'] | NewPet['id']>;
  name: FormControl<IPet['name']>;
  petType: FormControl<IPet['petType']>;
  description: FormControl<IPet['description']>;
  sex: FormControl<IPet['sex']>;
  tradeMoney: FormControl<IPet['tradeMoney']>;
  tradePups: FormControl<IPet['tradePups']>;
  pedigree: FormControl<IPet['pedigree']>;
  desireAmmount: FormControl<IPet['desireAmmount']>;
  owner: FormControl<IPet['owner']>;
  breed: FormControl<IPet['breed']>;
  uploadDate: FormControl<IPhoto['uploadDate']>;
  photoUrl: FormControl<IPhoto['photoUrl']>;
};

export type PetFormGroup = FormGroup<PetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PetFormService {
  createPetFormGroup(pet: PetFormGroupInput = { id: null }): PetFormGroup {
    const petRawValue = {
      ...this.getFormDefaults(),
      ...pet,
    };
    return new FormGroup<PetFormGroupContent>({
      id: new FormControl(
        { value: petRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(petRawValue.name, {
        validators: [Validators.required],
      }),
      petType: new FormControl(petRawValue.petType, {
        validators: [Validators.required],
      }),
      description: new FormControl(petRawValue.description, {
        validators: [Validators.required],
      }),
      sex: new FormControl(petRawValue.sex, {
        validators: [Validators.required],
      }),
      tradeMoney: new FormControl(petRawValue.tradeMoney),
      tradePups: new FormControl(petRawValue.tradePups),
      pedigree: new FormControl(petRawValue.pedigree),
      desireAmmount: new FormControl(petRawValue.desireAmmount),
      owner: new FormControl(petRawValue.owner),
      breed: new FormControl(petRawValue.breed),
      uploadDate: new FormControl(null, {
        nonNullable: true,
      }),
      photoUrl: new FormControl('', {
        validators: [Validators.required],
      }),


    });
  }

  getPet(form: PetFormGroup): IPet | NewPet {
    return form.getRawValue() as IPet | NewPet;
  }

  resetForm(form: PetFormGroup, pet: PetFormGroupInput): void {
    const petRawValue = { ...this.getFormDefaults(), ...pet };
    form.reset(
      {
        ...petRawValue,
        id: { value: petRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PetFormDefaults {
    return {
      id: null,
      tradeMoney: false,
      tradePups: false,
      pedigree: false,
    };
  }
}
