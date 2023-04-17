import { Component, OnInit } from '@angular/core';
import {
  SearchCriteriaService,
  EntityResponseType as SearchCriteriaEntityResponseType,
} from '../../search-criteria/service/search-criteria.service';
import { AccountService } from 'app/core/auth/account.service';
import { PetService, EntityArrayResponseType as PetEntityArrayResponseType } from '../service/pet.service';
import { IPet } from '../pet.model';
import { ISearchCriteria } from '../../search-criteria/search-criteria.model';
import { Router } from '@angular/router';
import { SearchCriteriaModule } from '../../search-criteria/search-criteria.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-search-match',
  templateUrl: './search-match.component.html',
  styleUrls: ['./search-match.component.scss'],
})
export class SearchMatchComponent implements OnInit {
  pets: IPet[] = [];
  currentPetIndex = 0;
  //filters: ISearchCriteria | undefined
  filters: ISearchCriteria | null = null;
  constructor(
    private searchCriteriaService: SearchCriteriaService,
    private accountService: AccountService,
    private petService: PetService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petService.search().subscribe(
      (res: PetEntityArrayResponseType) => {
        this.pets = res.body || [];
        this.currentPetIndex = 0;
        this.loadSearchCriteriaForCurrentUser();
      },
      error => {
        console.error('Error fetching pets based on search criteria:', error);
      }
    );
  }

  match(): void {
    Swal.fire({
      title: 'Success',
      text: 'Es un match!',
      icon: 'success',
      confirmButtonColor: '#3381f6',
      confirmButtonText: 'Cerrar',
    });
  }

  loadSearchCriteriaForCurrentUser(): void {
    this.accountService.identity().subscribe(user => {
      if (user) {
        // imageUrl is pet in session
        const petId = parseInt(user.imageUrl);
        console.log('PET ID: ' + petId);
        this.searchCriteriaService.find(petId).subscribe(
          (res: SearchCriteriaEntityResponseType) => {
            this.filters = res.body;
            console.log('User Search Criteria From DB: ' + JSON.stringify(this.filters, null, 2));
            console.log('Pet Displayed', JSON.stringify(this.pets[this.currentPetIndex], null, 2));
            // Calls the search function with the searchCriteria object
            //this.loadPets(searchCriteria);
          },
          error => {
            console.error('Error fetching search criteria for user:', error);
          }
        );
      }
    });
  }
  /*
  loadPets(searchCriteria: ISearchCriteria | null): void {


    var petId = searchCriteria && searchCriteria.pet ?  Number(searchCriteria.pet.id) : 1;

    const newSearchCriteria : ISearchCriteria = {
        id : petId,
        breed : searchCriteria?.breed,
        filterType: searchCriteria?.filterType,
        objective: searchCriteria?.objective,
        pedigree: searchCriteria?.pedigree,
        tradeMoney: searchCriteria?.tradeMoney,
        tradePups: searchCriteria?.tradePups,
        provice: searchCriteria?.provice,
        canton: searchCriteria?.canton,
        district: searchCriteria?.district
    }

    this.petService.search(newSearchCriteria).subscribe(
      (res: PetEntityArrayResponseType) => {
        this.pets = res.body || [];
        this.currentPetIndex = 0;
      },
      error => {
        console.error('Error fetching pets based on search criteria:', error);
      }
    );
  } */
  //Update pet when user clicks x button
  skipPet(): void {
    if (this.currentPetIndex < this.pets.length - 1) {
      this.currentPetIndex++;
    } else {
      console.log('There are no more pets to show! ');
    }
  }
  protected selectPet(id: number): void {
    this.petService.selectedPet(id).subscribe({
      next: () => this.router.navigateByUrl('/pet/' + id + '/view'),
      // next: () => this.router.navigateByUrl('/search-criteria/new'),
      error: () => console.log('error'),
    });
  }
}
