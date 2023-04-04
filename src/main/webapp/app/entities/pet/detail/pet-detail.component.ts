import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../../account/register/register.service';
import { PhotoService } from '../../photo/service/photo.service';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { crop, fill, scale } from '@cloudinary/url-gen/actions/resize';
import { IPet } from '../pet.model';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { IPhoto } from '../../photo/photo.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['pet-detail.component.css'],
})
export class PetDetailComponent implements OnInit {
  pet: IPet | null = null;

  provinces: any[] = [];
  cantones: any[] = [];
  selectedProvince: any;
  selectedCanton: any;

  ownerImage: any;

  petImages: IPhoto[] = [];

  constructor(protected activatedRoute: ActivatedRoute, private registerService: RegisterService, private photoService: PhotoService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pet }) => {
      this.pet = pet;
      console.log('Pet:', this.pet);

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
    });
    if (this.pet && this.pet.id) {
      this.loadPhotoById(this.pet.id);
    }
  }

  // convertToCloudinaryImage(photo: IPhoto): CloudinaryImage {
  //   const cloudinaryImage = new CloudinaryImage(photo.publicId, this.cloudinaryConfiguration);
  //   return cloudinaryImage;
  // }

  private extractPublicIdFromUrl(url: string): string {
    const baseUrl = 'https://res.cloudinary.com/alocortesu/image/upload/';
    if (url.startsWith(baseUrl)) {
      return url.slice(baseUrl.length);
    }
    return '';
  }

  loadPhotoById(petId: number | undefined | null): void {
    if (petId) {
      this.photoService.find(petId).subscribe((res: HttpResponse<IPhoto>) => {
        console.log('Photo data:', res.body);
      });
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

  previousState(): void {
    window.history.back();
  }
}
