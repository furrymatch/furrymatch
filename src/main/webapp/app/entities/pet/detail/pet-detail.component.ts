import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../account/register/register.service';
import { PhotoService } from '../../photo/service/photo.service';
import { PetService } from '../service/pet.service';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { IPet } from '../pet.model';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { IPhoto } from '../../photo/photo.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'jhi-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['pet-detail.component.css'],
})
export class PetDetailComponent implements OnInit {
  showGallery = false;
  imageUrls: string[] = [];

  pet: IPet | null | undefined;
  isLoading = false;

  provinces: any[] = [];
  cantones: any[] = [];
  selectedProvince: any;
  selectedCanton: any;

  petImages: IPhoto[] = [];

  ownerImage: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private registerService: RegisterService,
    protected photoService: PhotoService,
    protected petService: PetService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openGallery(): void {
    this.showGallery = true;
  }

  onCloseGallery(): void {
    this.showGallery = false;
  }

  load(): void {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.petService.query({ 'id.equals': id }))).subscribe(response => {
      this.onSuccess(response.body);
    });
  }

  protected onSuccess(data: IPet[] | null): void {
    this.pet = data ? data[0] : null;
    if (this.pet) {
      this.loadPhotosByPetId(this.pet.id);
      this.loadOwnerAndLocationData();
    }
  }

  loadPhotosByPetId(petId: number): void {
    this.photoService.findAllPhotosByPetID(petId).subscribe(response => {
      this.petImages = response.body ?? [];
      this.imageUrls = this.petImages.map(image => this.getOriginalImageUrl(image));
    });
  }

  loadOwnerAndLocationData(): void {
    const ownerPhotoUrl = this.pet?.owner?.['photo'] || '';
    const ownerPhotoPublicId = this.extractPublicIdFromUrl(ownerPhotoUrl);

    if (ownerPhotoPublicId) {
      this.ownerImage = new CloudinaryImage(ownerPhotoPublicId, { cloudName: 'alocortesu' }).resize(
        fill().width(100).height(100).gravity(focusOn(face()))
      );
    }

    this.registerService.getProvinces().subscribe((provinces: any) => {
      this.provinces = Object.entries(provinces).map(([id, name]) => ({ id, name }));
      if (this.pet && this.pet.owner) {
        this.selectedProvince = this.provinces.find(province => province.id === (this.pet?.owner?.['province'] || '').toString());
      }
    });

    if (this.pet && this.pet.owner && this.pet.owner['province']) {
      this.onProvinceSelected(Number(this.pet.owner['province']));
    }
  }

  onProvinceSelected(provinceId: number): void {
    this.registerService.getCantones(provinceId).subscribe((cantones: any) => {
      this.cantones = Object.entries(cantones).map(([id, name]) => ({ id, name }));
      if (this.pet && this.pet.owner) {
        this.selectedCanton = this.cantones.find(canton => canton.id === (this.pet?.owner?.['canton'] || '').toString());
      }
    });
  }

  getOriginalImageUrl(petImage: IPhoto): string {
    return petImage?.photoUrl || '';
  }

  private extractPublicIdFromUrl(url: string): string {
    const baseUrl = 'https://res.cloudinary.com/alocortesu/image/upload/';
    if (url.startsWith(baseUrl)) {
      return url.slice(baseUrl.length);
    }
    return '';
  }

  previousState(): void {
    window.history.back();
  }
}
