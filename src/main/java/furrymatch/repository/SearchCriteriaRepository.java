package furrymatch.repository;

import furrymatch.domain.Pet;
import furrymatch.domain.SearchCriteria;
import java.util.List;
import java.util.Optional;
import net.bytebuddy.dynamic.DynamicType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SearchCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SearchCriteriaRepository extends JpaRepository<SearchCriteria, Long> {
    @Query(value = "SELECT * FROM search_criteria WHERE pet_id = :id", nativeQuery = true)
    Optional<SearchCriteria> findByOwnerUser(@Param("id") Long id);
}
