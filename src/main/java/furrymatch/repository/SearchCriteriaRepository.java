package furrymatch.repository;

import furrymatch.domain.SearchCriteria;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SearchCriteria entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SearchCriteriaRepository extends JpaRepository<SearchCriteria, Long> {}
