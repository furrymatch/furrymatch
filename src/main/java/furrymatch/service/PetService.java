package furrymatch.service;

import furrymatch.domain.Pet;
import furrymatch.repository.PetRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pet}.
 */
@Service
@Transactional
public class PetService {

    private final Logger log = LoggerFactory.getLogger(PetService.class);

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    /**
     * Save a pet.
     *
     * @param pet the entity to save.
     * @return the persisted entity.
     */
    public Pet save(Pet pet) {
        log.debug("Request to save Pet : {}", pet);
        return petRepository.save(pet);
    }

    /**
     * Update a pet.
     *
     * @param pet the entity to save.
     * @return the persisted entity.
     */
    public Pet update(Pet pet) {
        log.debug("Request to update Pet : {}", pet);
        return petRepository.save(pet);
    }

    /**
     * Partially update a pet.
     *
     * @param pet the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Pet> partialUpdate(Pet pet) {
        log.debug("Request to partially update Pet : {}", pet);

        return petRepository
            .findById(pet.getId())
            .map(existingPet -> {
                if (pet.getName() != null) {
                    existingPet.setName(pet.getName());
                }
                if (pet.getPetType() != null) {
                    existingPet.setPetType(pet.getPetType());
                }
                if (pet.getDescription() != null) {
                    existingPet.setDescription(pet.getDescription());
                }
                if (pet.getSex() != null) {
                    existingPet.setSex(pet.getSex());
                }
                if (pet.getTradeMoney() != null) {
                    existingPet.setTradeMoney(pet.getTradeMoney());
                }
                if (pet.getTradePups() != null) {
                    existingPet.setTradePups(pet.getTradePups());
                }
                if (pet.getPedigree() != null) {
                    existingPet.setPedigree(pet.getPedigree());
                }
                if (pet.getDesireAmmount() != null) {
                    existingPet.setDesireAmmount(pet.getDesireAmmount());
                }

                return existingPet;
            })
            .map(petRepository::save);
    }

    /**
     * Get all the pets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pet> findAll(Pageable pageable) {
        log.debug("Request to get all Pets");
        return petRepository.findAll(pageable);
    }

    /**
     * Get one pet by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pet> findOne(Long id) {
        log.debug("Request to get Pet : {}", id);
        return petRepository.findById(id);
    }

    /**
     * Delete the pet by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pet : {}", id);
        petRepository.deleteById(id);
    }
}
