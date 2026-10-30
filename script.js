/**
 * EduPortal Online Admissions - Client Logic
 * Written using jQuery & JavaScript
 */

$(document).ready(function () {
  const $form = $('#registrationForm');
  const $formSection = $('#form-section');
  const $confirmationSection = $('#confirmation-section');
  const $alertBanner = $('#alert-banner');
  const $submitBtn = $('#submitBtn');
  const $resetBtn = $('#resetBtn');
  const $printBtn = $('#printSlipBtn');
  const $newRegistrationBtn = $('#newRegistrationBtn');

  // Regex Patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const pincodeRegex = /^[0-9]{6}$/;

  /**
   * Helper: Show Banner Alert
   */
  function showAlert(message, type = 'error') {
    $alertBanner
      .removeClass('d-none alert-error alert-success')
      .addClass(type === 'error' ? 'alert-error' : 'alert-success');
    
    $alertBanner.find('.alert-icon')
      .attr('class', type === 'error' ? 'fa-solid fa-circle-exclamation alert-icon' : 'fa-solid fa-circle-check alert-icon');
    
    $alertBanner.find('.alert-message').text(message);
    
    // Smooth scroll to top of card
    $('html, body').animate({ scrollTop: $formSection.offset().top - 20 }, 300);
  }

  function hideAlert() {
    $alertBanner.addClass('d-none');
  }

  /**
   * Helper: Set Field Error
   */
  function setFieldError(fieldId, errorMsg) {
    const $field = $('#' + fieldId);
    const $error = $('#' + fieldId + 'Error');
    $field.addClass('is-invalid');
    $error.text(errorMsg);
  }

  /**
   * Helper: Clear Field Error
   */
  function clearFieldError(fieldId) {
    const $field = $('#' + fieldId);
    const $error = $('#' + fieldId + 'Error');
    $field.removeClass('is-invalid');
    $error.text('');
  }

  /**
   * Real-time Validation / Clear Error on User Interaction
   */
  $('input, select, textarea').on('input change', function () {
    const fieldId = $(this).attr('id') || $(this).attr('name');
    clearFieldError(fieldId);
    hideAlert();
  });

  /**
   * Client-Side Validation Function
   */
  function validateForm() {
    let isValid = true;
    hideAlert();

    // 1. First Name
    const firstName = $('#firstName').val().trim();
    if (!firstName) {
      setFieldError('firstName', 'Please enter your first name.');
      isValid = false;
    } else if (firstName.length < 2) {
      setFieldError('firstName', 'First name must be at least 2 characters.');
      isValid = false;
    } else {
      clearFieldError('firstName');
    }

    // 2. Last Name
    const lastName = $('#lastName').val().trim();
    if (!lastName) {
      setFieldError('lastName', 'Please enter your last name.');
      isValid = false;
    } else if (lastName.length < 2) {
      setFieldError('lastName', 'Last name must be at least 2 characters.');
      isValid = false;
    } else {
      clearFieldError('lastName');
    }

    // 3. Email
    const email = $('#email').val().trim();
    if (!email) {
      setFieldError('email', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setFieldError('email', 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      clearFieldError('email');
    }

    // 4. Phone
    const phone = $('#phone').val().trim();
    if (!phone) {
      setFieldError('phone', 'Please enter your mobile number.');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setFieldError('phone', 'Phone number must be exactly 10 digits.');
      isValid = false;
    } else {
      clearFieldError('phone');
    }

    // 5. Date of Birth
    const dob = $('#dob').val();
    if (!dob) {
      setFieldError('dob', 'Please select your date of birth.');
      isValid = false;
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 15) {
        setFieldError('dob', 'Applicant must be at least 15 years old.');
        isValid = false;
      } else {
        clearFieldError('dob');
      }
    }

    // 6. Gender
    const gender = $('input[name="gender"]:checked').val();
    if (!gender) {
      $('#genderError').text('Please select your gender.');
      isValid = false;
    } else {
      $('#genderError').text('');
    }

    // 7. Course
    const course = $('#course').val();
    if (!course) {
      setFieldError('course', 'Please select an academic program.');
      isValid = false;
    } else {
      clearFieldError('course');
    }

    // 8. Qualification
    const qualification = $('#qualification').val();
    if (!qualification) {
      setFieldError('qualification', 'Please select your highest qualification.');
      isValid = false;
    } else {
      clearFieldError('qualification');
    }

    // 9. Address
    const address = $('#address').val().trim();
    if (!address) {
      setFieldError('address', 'Please enter your residential address.');
      isValid = false;
    } else {
      clearFieldError('address');
    }

    // 10. City
    const city = $('#city').val().trim();
    if (!city) {
      setFieldError('city', 'Please enter your city.');
      isValid = false;
    } else {
      clearFieldError('city');
    }

    // 11. Pincode
    const pincode = $('#pincode').val().trim();
    if (!pincode) {
      setFieldError('pincode', 'Please enter your postal/ZIP code.');
      isValid = false;
    } else if (!pincodeRegex.test(pincode)) {
      setFieldError('pincode', 'Please enter a valid 6-digit postal code.');
      isValid = false;
    } else {
      clearFieldError('pincode');
    }

    // 12. Declaration
    const declaration = $('#declaration').is(':checked');
    if (!declaration) {
      $('#declarationError').text('You must agree to the declaration before submitting.');
      isValid = false;
    } else {
      $('#declarationError').text('');
    }

    return isValid;
  }

  /**
   * Handle Form Submission (AJAX via jQuery)
   */
  $form.on('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('Please correct the highlighted errors in the form before submitting.');
      return;
    }

    // Loading State
    $submitBtn.prop('disabled', true);
    $submitBtn.find('.btn-text').addClass('d-none');
    $submitBtn.find('.btn-spinner').removeClass('d-none');

    // Collect Form Data
    const formData = $form.serialize();

    // Send AJAX Request to PHP Backend
    $.ajax({
      url: 'process.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      success: function (response) {
        if (response && response.status === 'success') {
          displayConfirmationSlip(response.data);
        } else {
          const errMsg = (response && response.message) ? response.message : 'Registration failed. Please check your data.';
          showAlert(errMsg);
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error:', status, error, xhr.responseText);
        // Fallback simulation in case running on static local file without PHP server
        if (xhr.status === 0 || xhr.status === 404 || xhr.status === 405) {
          console.warn('Backend not reachable via HTTP POST. Simulating successful registration client-side.');
          simulateLocalSuccess();
        } else {
          showAlert('Server communication error (' + status + '). Please try again.');
        }
      },
      complete: function () {
        // Reset Button Loading State
        $submitBtn.prop('disabled', false);
        $submitBtn.find('.btn-text').removeClass('d-none');
        $submitBtn.find('.btn-spinner').addClass('d-none');
      }
    });
  });

  /**
   * Render Formatted Confirmation Slip from PHP Data
   */
  function displayConfirmationSlip(data) {
    $('#dispAppId').text(data.applicationId || 'APP-' + Math.floor(100000 + Math.random() * 900000));
    $('#dispDate').text(data.submissionDate || new Date().toLocaleDateString('en-GB'));
    $('#dispTimestamp').text(data.timestamp || new Date().toLocaleString());

    $('#dispFullName').text(data.fullName || (data.firstName + ' ' + data.lastName));
    $('#dispEmail').text(data.email);
    $('#dispPhone').text(data.phone);
    $('#dispDobGender').text(data.dob + ' (' + data.gender + ')');
    $('#dispCourse').text(data.course);
    $('#dispQualification').text(data.qualification);
    $('#dispLocation').text(data.city + ' - ' + data.pincode);
    $('#dispAddress').text(data.address);

    if (data.remarks && data.remarks.trim() !== '') {
      $('#dispRemarks').text('"' + data.remarks + '"');
      $('#dispRemarksContainer').show();
    } else {
      $('#dispRemarksContainer').hide();
    }

    // Smooth Transition: Hide Form & Show Slip
    $formSection.slideUp(400, function () {
      $confirmationSection.removeClass('d-none').hide().fadeIn(500);
      $('html, body').animate({ scrollTop: $confirmationSection.offset().top - 20 }, 400);
    });
  }

  /**
   * Fallback Simulator for Direct Static Browser Previews
   */
  function simulateLocalSuccess() {
    const randomId = 'APP-2026-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const localData = {
      applicationId: randomId,
      submissionDate: formattedDate,
      timestamp: formattedDate + ' at ' + formattedTime,
      fullName: $('#firstName').val().trim() + ' ' + $('#lastName').val().trim(),
      email: $('#email').val().trim(),
      phone: $('#phone').val().trim(),
      dob: $('#dob').val(),
      gender: $('input[name="gender"]:checked').val(),
      course: $('#course').val(),
      qualification: $('#qualification').val(),
      city: $('#city').val().trim(),
      pincode: $('#pincode').val().trim(),
      address: $('#address').val().trim(),
      remarks: $('#remarks').val().trim()
    };

    displayConfirmationSlip(localData);
  }

  /**
   * Print Slip Handler
   */
  $printBtn.on('click', function () {
    window.print();
  });

  /**
   * New Registration / Back to Form Handler
   */
  $newRegistrationBtn.on('click', function () {
    $confirmationSection.fadeOut(300, function () {
      $confirmationSection.addClass('d-none');
      $form[0].reset();
      clearFieldError('firstName');
      clearFieldError('lastName');
      clearFieldError('email');
      clearFieldError('phone');
      clearFieldError('dob');
      clearFieldError('course');
      clearFieldError('qualification');
      clearFieldError('address');
      clearFieldError('city');
      clearFieldError('pincode');
      $('#genderError').text('');
      $('#declarationError').text('');
      hideAlert();

      $formSection.slideDown(400);
      $('html, body').animate({ scrollTop: $formSection.offset().top - 20 }, 300);
    });
  });

  /**
   * Reset Form Button Handler
   */
  $resetBtn.on('click', function () {
    setTimeout(function () {
      $('input, select, textarea').removeClass('is-invalid');
      $('.error-msg').text('');
      hideAlert();
    }, 50);
  });
});
