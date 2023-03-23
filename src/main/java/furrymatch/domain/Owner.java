package furrymatch.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Owner.
 */
@Entity
@Table(name = "owner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Owner implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "second_name")
    private String secondName;

    @NotNull
    @Column(name = "first_last_name", nullable = false)
    private String firstLastName;

    @NotNull
    @Column(name = "second_last_name", nullable = false)
    private String secondLastName;

    @NotNull
    @Column(name = "phone_number", nullable = false)
    private Long phoneNumber;

    @Column(name = "photo")
    private String photo;

    @NotNull
    @Column(name = "identity_number", nullable = false)
    private String identityNumber;

    @NotNull
    @Column(name = "adress", nullable = false)
    private String adress;

    @NotNull
    @Column(name = "province", nullable = false)
    private String province;

    @NotNull
    @Column(name = "canton", nullable = false)
    private String canton;

    @NotNull
    @Column(name = "district", nullable = false)
    private String district;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name = "otp")
    private String otp;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "owner")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "photos", "firstLikees", "secondLikees", "owner", "breed", "searchCriteria" }, allowSetters = true)
    private Set<Pet> pets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Owner id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Owner firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSecondName() {
        return this.secondName;
    }

    public Owner secondName(String secondName) {
        this.setSecondName(secondName);
        return this;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public String getFirstLastName() {
        return this.firstLastName;
    }

    public Owner firstLastName(String firstLastName) {
        this.setFirstLastName(firstLastName);
        return this;
    }

    public void setFirstLastName(String firstLastName) {
        this.firstLastName = firstLastName;
    }

    public String getSecondLastName() {
        return this.secondLastName;
    }

    public Owner secondLastName(String secondLastName) {
        this.setSecondLastName(secondLastName);
        return this;
    }

    public void setSecondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
    }

    public Long getPhoneNumber() {
        return this.phoneNumber;
    }

    public Owner phoneNumber(Long phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoto() {
        return this.photo;
    }

    public Owner photo(String photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getIdentityNumber() {
        return this.identityNumber;
    }

    public Owner identityNumber(String identityNumber) {
        this.setIdentityNumber(identityNumber);
        return this;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public String getAdress() {
        return this.adress;
    }

    public Owner adress(String adress) {
        this.setAdress(adress);
        return this;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getProvince() {
        return this.province;
    }

    public Owner province(String province) {
        this.setProvince(province);
        return this;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCanton() {
        return this.canton;
    }

    public Owner canton(String canton) {
        this.setCanton(canton);
        return this;
    }

    public void setCanton(String canton) {
        this.canton = canton;
    }

    public String getDistrict() {
        return this.district;
    }

    public Owner district(String district) {
        this.setDistrict(district);
        return this;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getEmail() {
        return this.email;
    }

    public Owner email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserPassword() {
        return this.userPassword;
    }

    public Owner userPassword(String userPassword) {
        this.setUserPassword(userPassword);
        return this;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getOtp() {
        return this.otp;
    }

    public Owner otp(String otp) {
        this.setOtp(otp);
        return this;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDate getCreatedAt() {
        return this.createdAt;
    }

    public Owner createdAt(LocalDate createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return this.updatedAt;
    }

    public Owner updatedAt(LocalDate updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Pet> getPets() {
        return this.pets;
    }

    public void setPets(Set<Pet> pets) {
        if (this.pets != null) {
            this.pets.forEach(i -> i.setOwner(null));
        }
        if (pets != null) {
            pets.forEach(i -> i.setOwner(this));
        }
        this.pets = pets;
    }

    public Owner pets(Set<Pet> pets) {
        this.setPets(pets);
        return this;
    }

    public Owner addPet(Pet pet) {
        this.pets.add(pet);
        pet.setOwner(this);
        return this;
    }

    public Owner removePet(Pet pet) {
        this.pets.remove(pet);
        pet.setOwner(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Owner)) {
            return false;
        }
        return id != null && id.equals(((Owner) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Owner{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", secondName='" + getSecondName() + "'" +
            ", firstLastName='" + getFirstLastName() + "'" +
            ", secondLastName='" + getSecondLastName() + "'" +
            ", phoneNumber=" + getPhoneNumber() +
            ", photo='" + getPhoto() + "'" +
            ", identityNumber='" + getIdentityNumber() + "'" +
            ", adress='" + getAdress() + "'" +
            ", province='" + getProvince() + "'" +
            ", canton='" + getCanton() + "'" +
            ", district='" + getDistrict() + "'" +
            ", email='" + getEmail() + "'" +
            ", userPassword='" + getUserPassword() + "'" +
            ", otp='" + getOtp() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            "}";
    }
}
