package furrymatch.repository;

import furrymatch.domain.Breed;
import furrymatch.domain.Owner;
import furrymatch.domain.Pet;
import furrymatch.domain.SearchCriteria;
import furrymatch.domain.enumeration.PetType;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import org.springframework.stereotype.Repository;

@Repository
public class SearchPetRepository {

    private final EntityManager em;

    public SearchPetRepository(EntityManager em) {
        this.em = em;
    }

    public List<Pet> searchAll(
        String petType,
        String breed,
        String tradePups,
        String pedigree,
        String tradeMoney,
        String province,
        String canton,
        String district
    ) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery<Pet> criteriaQuery = criteriaBuilder.createQuery(Pet.class);

        // select * from employee
        Root<Pet> root = criteriaQuery.from(Pet.class);

        Predicate petTypePredicate = criteriaBuilder.like(root.get("pet_type"), "%" + petType + "%");
        Predicate breedPredicate = criteriaBuilder.like(root.get("breed_id"), "%" + breed + "%");
        Predicate tradePupsPredicate = criteriaBuilder.like(root.get("trade_pups"), "%" + tradePups + "%");
        Predicate pedigreePredicate = criteriaBuilder.like(root.get("pedigree"), "%" + pedigree + "%");
        Predicate tradeMoneyPredicate = criteriaBuilder.like(root.get("trade_money"), "%" + tradeMoney + "%");
        Predicate orPredicate = criteriaBuilder.or(
            petTypePredicate,
            breedPredicate,
            tradePupsPredicate,
            pedigreePredicate,
            tradeMoneyPredicate
        );

        var andPetTypePredicate = criteriaBuilder.and(orPredicate, petTypePredicate);
        criteriaQuery.where(andPetTypePredicate);
        TypedQuery<Pet> query = em.createQuery(criteriaQuery);
        return query.getResultList();
    }

    public List<Pet> searchPets(SearchCriteria filters, Long ownerId) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery<Pet> criteriaQueryPet = criteriaBuilder.createQuery(Pet.class);
        Root<Pet> petRoot = criteriaQueryPet.from(Pet.class);

        List<Predicate> predicates = new ArrayList<>();
        System.out.print("Filters" + filters);
        if (filters.getFilterType() != null) {
            PetType petType = PetType.valueOf(filters.getFilterType());
            Predicate petTypePredicate = criteriaBuilder.equal(petRoot.get("petType"), petType);
            predicates.add(petTypePredicate);
        }

        if (filters.getSex() != null) {
            Predicate sexPredicate = criteriaBuilder.equal(petRoot.get("sex"), filters.getSex());
            predicates.add(sexPredicate);
        }

        if (filters.getBreed() != null) {
            Long breedId = Long.valueOf(filters.getBreed());
            Breed breed = new Breed();
            breed.setId(breedId);
            Predicate breedPredicate = criteriaBuilder.equal(petRoot.get("breed"), breed);
            predicates.add(breedPredicate);
        }

        if (filters.getTradePups() != null) {
            Predicate tradePupsPredicate = criteriaBuilder.equal(petRoot.get("tradePups"), filters.getTradePups());
            predicates.add(tradePupsPredicate);
        }

        if (filters.getPedigree() != null) {
            Predicate pedigreePredicate = criteriaBuilder.equal(petRoot.get("pedigree"), filters.getPedigree());
            predicates.add(pedigreePredicate);
        }

        //join condition between Pet and Owner
        Join<Pet, Owner> ownerJoin = petRoot.join("owner");
        if (filters.getProvice() != null) {
            Predicate provincePredicate = criteriaBuilder.equal(ownerJoin.get("provice"), filters.getProvice());
            predicates.add(provincePredicate);
        }
        if (filters.getCanton() != null) {
            Predicate cantonPredicate = criteriaBuilder.equal(ownerJoin.get("canton"), filters.getCanton());
            predicates.add(cantonPredicate);
        }
        if (filters.getDistrict() != null) {
            Predicate districtPredicate = criteriaBuilder.equal(ownerJoin.get("district"), filters.getDistrict());
            predicates.add(districtPredicate);
        }

        // Exclude pets belonging to the current owner
        Predicate excludeCurrentOwnerPredicate = criteriaBuilder.notEqual(ownerJoin.get("id"), ownerId);
        predicates.add(excludeCurrentOwnerPredicate);

        criteriaQueryPet.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        TypedQuery<Pet> petQuery = em.createQuery(criteriaQueryPet);

        return petQuery.getResultList();
    }
    /*
    public List<Pet> searchPets(SearchCriteria filters) {
        CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
        CriteriaQuery<Pet> criteriaQueryPet = criteriaBuilder.createQuery(Pet.class);
        CriteriaQuery<Owner> criteriaQueryOwner = criteriaBuilder.createQuery(Owner.class);

        List<Predicate> petPredicate = new ArrayList<>();
        List<Predicate> ownerPredicate = new ArrayList<>();

        Root<Pet> petRoot = criteriaQueryPet.from(Pet.class);
        Root<Owner> ownerRoot = criteriaQueryOwner.from(Owner.class);

        Predicate petTypePredicate = criteriaBuilder.like(petRoot.get("petType"), "%" + filters.getFilterType() + "%");
        petPredicate.add(petTypePredicate);

        if (filters.getBreed() != null) {
            Predicate breedPredicate = criteriaBuilder.like(petRoot.get("breed"), "%" + filters.getBreed() + "%");
            petPredicate.add(breedPredicate);
        }
        if (filters.getTradePups() != null) {
            Predicate tradePupsPredicate = criteriaBuilder.like(petRoot.get("tradePups"), "%" + filters.getTradePups() + "%");
            petPredicate.add(tradePupsPredicate);
        }
        if (filters.getPedigree() != null) {
            Predicate pedigreePredicate = criteriaBuilder.like(petRoot.get("pedigree"), "%" + filters.getPedigree() + "%");
            petPredicate.add(pedigreePredicate);
        }
        if (filters.getTradeMoney() != null) {
            Predicate tradeMoneyPredicate = criteriaBuilder.like(petRoot.get("tradeMoney"), "%" + filters.getTradeMoney() + "%");
            petPredicate.add(tradeMoneyPredicate);
        }
        if (filters.getProvice() != null) {
            Predicate provincePredicate = criteriaBuilder.like(ownerRoot.get("provice"), "%" + filters.getProvice() + "%");
            ownerPredicate.add(provincePredicate);
        }
        if (filters.getCanton() != null) {
            Predicate cantonPredicate = criteriaBuilder.like(ownerRoot.get("canton"), "%" + filters.getCanton() + "%");
            ownerPredicate.add(cantonPredicate);
        }
        if (filters.getDistrict() != null) {
            Predicate districtPredicate = criteriaBuilder.like(ownerRoot.get("district"), "%" + filters.getDistrict() + "%");
            ownerPredicate.add(districtPredicate);
        }

        criteriaQueryPet.where(criteriaBuilder.or(petPredicate.toArray(new Predicate[0])));
        //criteriaQueryPet.where(criteriaBuilder.or(ownerPredicate.toArray(new Predicate[0])));

        TypedQuery<Pet> petQuery = em.createQuery(criteriaQueryPet);

        return petQuery.getResultList();
    } */
}
