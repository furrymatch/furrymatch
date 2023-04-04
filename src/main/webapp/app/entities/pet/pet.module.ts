import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PetComponent } from './list/pet.component';
import { PetDetailComponent } from './detail/pet-detail.component';
import { PetUpdateComponent } from './update/pet-update.component';
import { PetDeleteDialogComponent } from './delete/pet-delete-dialog.component';
import { PetRoutingModule } from './route/pet-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CloudinaryModule } from '@cloudinary/ng';

@NgModule({
  imports: [SharedModule, PetRoutingModule, NgxDropzoneModule, CloudinaryModule],
  declarations: [PetComponent, PetDetailComponent, PetUpdateComponent, PetDeleteDialogComponent],
})
export class PetModule {}
