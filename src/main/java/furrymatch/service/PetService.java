package furrymatch.service;

import furrymatch.domain.Pet;
import furrymatch.domain.Photo;
import furrymatch.repository.PetRepository;
import furrymatch.repository.PhotoRepository;

import java.time.LocalDate;
import java.util.List;
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

    private final PhotoRepository photoRepository;

    public PetService(
        PetRepository petRepository,
        PhotoRepository photoRepository
    ) {
        this.petRepository = petRepository;
        this.photoRepository = photoRepository;
    }

    /**
     * Save a pet.
     *
     * @param pet the entity to save.
     * @return the persisted entity.
     */
    public Pet save(
        Pet pet,
        List<Photo> photos
    ) {
        log.debug("Request to save Pet : {}", pet);

        Pet savedPet = petRepository.save(pet);

        //Create and save the Photo entity
        // Iterate through the photos and save them
        if (photos != null) {
            LocalDate currentDate = LocalDate.now();
            for (Photo photo : photos) {
                photo.setPet(savedPet);
                if (photo.getUploadDate() == null) {
                    photo.setUploadDate(currentDate);
                }
                photoRepository.save(photo);
            }
        }
        return savedPet;
    }

    /**
     * Update a pet.
     *
     * @param pet the entity to save.
     * @return the persisted entity.
     */
    public Pet update(Pet pet, List<Photo> photos) {
        log.debug("Request to update Pet : {}", pet);
        Pet updatedPed = petRepository.save(pet);

        //Create and update the Photo entity
        // Iterate through the photos and save them
        if (photos != null) {
            LocalDate currentDate = LocalDate.now();
            for (Photo photo : photos) {
                photo.setPet(updatedPed);
                if (photo.getUploadDate() == null){
                    photo.setUploadDate(currentDate);
                }
                photoRepository.save(photo);
            }
        }
        return updatedPed;
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
