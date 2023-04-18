import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, forkJoin, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatch } from '../match.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MatchService } from '../service/match.service';
import { MatchDeleteDialogComponent } from '../delete/match-delete-dialog.component';
import { AccountService } from 'app/core/auth/account.service';
import { IPet } from '../../pet/pet.model';
import { ISearchCriteria } from '../../search-criteria/search-criteria.model';
import { IPhoto } from '../../photo/photo.model';
import { PetService } from '../../pet/service/pet.service';
import { PhotoService } from '../../photo/service/photo.service';
import { SearchCriteriaService } from '../../search-criteria/service/search-criteria.service';

@Component({
  selector: 'jhi-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
})
export class MatchComponent implements OnInit {
  matches?: IMatch[];

  currentPetId?: number;
  // pets?: IPet[];
  // searchCriterias?: ISearchCriteria[];
  // photos?: IPhoto;

  additionalInfo: Map<number, { pet: IPet; photo: IPhoto; searchCriteria: ISearchCriteria }> = new Map();

  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected matchService: MatchService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal,
    protected petService: PetService,
    protected photoService: PhotoService,
    protected searchCriteriaService: SearchCriteriaService,
    private accountService: AccountService
  ) {}

  trackId = (_index: number, item: IMatch): number => this.matchService.getMatchIdentifier(item);

  ngOnInit(): void {
    this.loadSearchCriteriaForCurrentUser();
    this.load();
  }

  loadSearchCriteriaForCurrentUser(): void {
    this.accountService.identity().subscribe(user => {
      if (user) {
        // imageUrl is pet in session
        const petId = parseInt(user.imageUrl);
        console.log('PET ID: ' + petId);
      }
    });
  }

  delete(match: IMatch): void {
    const modalRef = this.modalService.open(MatchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.match = match;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.matches = dataFromBody;

    // Obtén los ids únicos de los pets involucrados en los matches
    const petIds = new Set<number>();
    this.matches.forEach(match => {
      if (match.firstLiked?.id) {
        petIds.add(match.firstLiked.id);
      }
      if (match.secondLiked?.id) {
        petIds.add(match.secondLiked.id);
      }
    });

    const petRequests: Observable<HttpResponse<IPet>>[] = Array.from(petIds).map(petId => this.petService.find(petId));
    forkJoin(petRequests).subscribe(pets => {
      const petMap = new Map<number, IPet>();
      pets.forEach(petResponse => {
        if (petResponse.body) {
          petMap.set(petResponse.body.id, petResponse.body);
        }
      });

      if (this.matches) {
        this.matches.forEach(match => {
          const firstPet = match.firstLiked?.id ? petMap.get(match.firstLiked.id) : undefined;
          const secondPet = match.secondLiked?.id ? petMap.get(match.secondLiked.id) : undefined;

          const otherPet = firstPet?.id === this.currentPetId ? secondPet : firstPet;

          if (otherPet && otherPet.id) {
            // Realiza las consultas a los servicios de SearchCriteria y Photo
            forkJoin([this.searchCriteriaService.findByPetId(otherPet.id), this.photoService.findAllPhotosByPetID(otherPet.id)]).subscribe(
              ([searchCriteriaResponse, photoResponse]) => {
                const searchCriteria = searchCriteriaResponse.body;
                const photo = photoResponse.body?.[0]; // Asume que solo se necesita una foto

                if (searchCriteria && photo) {
                  this.additionalInfo.set(otherPet.id, {
                    pet: otherPet,
                    photo: photo,
                    searchCriteria: searchCriteria,
                  });
                }
              }
            );
          }
        });
      }
    });
  }

  protected fillComponentAttributesFromResponseBody(data: IMatch[] | null): IMatch[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.matchService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
