package com.stitchit.service;

import com.stitchit.dto.AddressRequest;
import com.stitchit.dto.AddressResponse;
import com.stitchit.entity.Address;
import com.stitchit.entity.User;
import com.stitchit.repository.AddressRepository;
import com.stitchit.repository.UserRepository;
import com.stitchit.util.InputSanitizer;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(String userEmail) {
        User user = findUser(userEmail);
        return addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request, String userEmail) {
        User user = findUser(userEmail);

        // First address becomes the default automatically
        boolean firstAddress = addressRepository.findByUserId(user.getId()).isEmpty();
        boolean makeDefault = request.isDefault() || firstAddress;

        if (makeDefault) {
            addressRepository.clearDefaultForUser(user.getId());
        }

        Address address = new Address();
        address.setUser(user);
        applyRequest(address, request);
        address.setDefault(makeDefault);

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressRequest request, String userEmail) {
        User user = findUser(userEmail);
        Address address = findOwnedAddress(addressId, user.getId());

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.clearDefaultForUser(user.getId());
            address.setDefault(true);
        }
        applyRequest(address, request);

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse setDefaultAddress(Long addressId, String userEmail) {
        User user = findUser(userEmail);
        Address address = findOwnedAddress(addressId, user.getId());

        addressRepository.clearDefaultForUser(user.getId());
        address.setDefault(true);

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long addressId, String userEmail) {
        User user = findUser(userEmail);
        Address address = findOwnedAddress(addressId, user.getId());
        addressRepository.delete(address);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private Address findOwnedAddress(Long addressId, Long userId) {
        // Scoping the lookup by owner returns 404 instead of leaking that the id exists
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found: " + addressId));
    }

    private void applyRequest(Address address, AddressRequest request) {
        address.setStreet(InputSanitizer.sanitize(request.getStreet()));
        address.setCity(InputSanitizer.sanitize(request.getCity()));
        address.setState(InputSanitizer.sanitize(request.getState()));
        address.setPostalCode(InputSanitizer.sanitize(request.getPostalCode()));
        address.setCountry(InputSanitizer.sanitize(request.getCountry()));
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
    }

    private AddressResponse toResponse(Address address) {
        AddressResponse resp = new AddressResponse();
        resp.setId(address.getId());
        resp.setStreet(address.getStreet());
        resp.setCity(address.getCity());
        resp.setState(address.getState());
        resp.setPostalCode(address.getPostalCode());
        resp.setCountry(address.getCountry());
        resp.setLatitude(address.getLatitude());
        resp.setLongitude(address.getLongitude());
        resp.setDefault(address.isDefault());
        return resp;
    }
}
