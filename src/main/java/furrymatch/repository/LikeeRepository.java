package furrymatch.repository;

import furrymatch.domain.Likee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Likee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LikeeRepository extends JpaRepository<Likee, Long> {}
