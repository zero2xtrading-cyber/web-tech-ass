<?php
/**
 * EduPortal - Online Registration Form Backend Processor
 * Handles sanitization, server-side validation, ID generation,
 * and dual output (JSON for AJAX & styled HTML fallback).
 */

// Set Timezone
date_default_timezone_set('Asia/Kolkata');

// Detect AJAX Request
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(405);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request method. Only POST is accepted.'
        ]);
        exit;
    } else {
        header('Location: index.html');
        exit;
    }
}

// Function to clean and sanitize input strings
function cleanInput($data) {
    if ($data === null) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Receive and Sanitize Form Inputs
$firstName     = cleanInput($_POST['firstName'] ?? '');
$lastName      = cleanInput($_POST['lastName'] ?? '');
$email         = cleanInput($_POST['email'] ?? '');
$phone         = cleanInput($_POST['phone'] ?? '');
$dob           = cleanInput($_POST['dob'] ?? '');
$gender        = cleanInput($_POST['gender'] ?? '');
$course        = cleanInput($_POST['course'] ?? '');
$qualification = cleanInput($_POST['qualification'] ?? '');
$address       = cleanInput($_POST['address'] ?? '');
$city          = cleanInput($_POST['city'] ?? '');
$pincode       = cleanInput($_POST['pincode'] ?? '');
$remarks       = cleanInput($_POST['remarks'] ?? '');
$declaration   = isset($_POST['declaration']);

// Server-side Validation
$errors = [];

if (empty($firstName) || strlen($firstName) < 2) {
    $errors['firstName'] = 'Valid first name is required (at least 2 letters).';
}
if (empty($lastName) || strlen($lastName) < 2) {
    $errors['lastName'] = 'Valid last name is required (at least 2 letters).';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid email address is required.';
}
if (empty($phone) || !preg_match('/^[0-9]{10}$/', $phone)) {
    $errors['phone'] = 'A valid 10-digit phone number is required.';
}
if (empty($dob)) {
    $errors['dob'] = 'Date of birth is required.';
}
if (empty($gender)) {
    $errors['gender'] = 'Gender selection is required.';
}
if (empty($course)) {
    $errors['course'] = 'Please select a program.';
}
if (empty($qualification)) {
    $errors['qualification'] = 'Please select your qualification.';
}
if (empty($address)) {
    $errors['address'] = 'Residential address is required.';
}
if (empty($city)) {
    $errors['city'] = 'City is required.';
}
if (empty($pincode) || !preg_match('/^[0-9]{6}$/', $pincode)) {
    $errors['pincode'] = 'A valid 6-digit postal code is required.';
}
if (!$declaration) {
    $errors['declaration'] = 'You must confirm the declaration statement.';
}

// Handle Validation Failures
if (!empty($errors)) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation failed for one or more fields.',
            'errors' => $errors
        ]);
        exit;
    } else {
        // Direct POST failure display
        echo "<!DOCTYPE html><html><head><title>Validation Error</title><link rel='stylesheet' href='style.css'></head><body>";
        echo "<div class='container' style='margin-top: 3rem;'><div class='form-card'>";
        echo "<h2 style='color:#ef4444;'>Validation Error</h2><p>Please go back and correct the following:</p><ul>";
        foreach ($errors as $field => $msg) {
            echo "<li><strong>" . htmlspecialchars($field) . ":</strong> " . htmlspecialchars($msg) . "</li>";
        }
        echo "</ul><br><a href='index.html' class='btn btn-primary'>Return to Form</a></div></div></body></html>";
        exit;
    }
}

// Generate Unique Application Reference ID
$applicationId  = 'APP-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));
$submissionDate = date('d M Y');
$timestamp      = date('d M Y, h:i A');
$formattedDob   = !empty($dob) ? date('d M Y', strtotime($dob)) : $dob;
$fullName       = $firstName . ' ' . $lastName;

// Structured Response Data
$responseData = [
    'applicationId'  => $applicationId,
    'submissionDate' => $submissionDate,
    'timestamp'      => $timestamp,
    'fullName'       => $fullName,
    'firstName'      => $firstName,
    'lastName'       => $lastName,
    'email'          => $email,
    'phone'          => $phone,
    'dob'            => $formattedDob,
    'gender'         => $gender,
    'course'         => $course,
    'qualification'  => $qualification,
    'address'        => $address,
    'city'           => $city,
    'pincode'        => $pincode,
    'remarks'        => $remarks
];

// Return JSON Response for AJAX
if ($isAjax) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'status'  => 'success',
        'message' => 'Candidate application registered successfully.',
        'data'    => $responseData
    ]);
    exit;
}

// Fallback: If submitted directly without AJAX, render formatted HTML output
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Acknowledgement - <?php echo $applicationId; ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="app-header no-print">
    <div class="header-container">
      <div class="logo">
        <i class="fa-solid fa-graduation-cap logo-icon"></i>
        <div class="logo-text">
          <span class="logo-title">EduPortal</span>
          <span class="logo-subtitle">Online Admissions & Registration</span>
        </div>
      </div>
      <div class="header-badges">
        <span class="badge badge-academic"><i class="fa-regular fa-calendar-check"></i> Academic Session 2026-27</span>
      </div>
    </div>
  </header>

  <main class="main-wrapper">
    <div class="container">
      <section class="confirmation-card">
        
        <div class="success-ribbon no-print">
          <div class="ribbon-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="ribbon-content">
            <h3>Application Submitted Successfully!</h3>
            <p>Your registration record has been received and verified by the server. Below is your official acknowledgement receipt.</p>
          </div>
        </div>

        <div class="slip-paper">
          <div class="slip-header">
            <div class="slip-brand">
              <div class="brand-crest"><i class="fa-solid fa-shield-halved"></i></div>
              <div>
                <h2>EDUPORTAL ONLINE ADMISSIONS</h2>
                <p>Office of the Registrar & Academic Admissions Council</p>
                <span class="slip-badge">OFFICIAL REGISTRATION ACKNOWLEDGEMENT</span>
              </div>
            </div>
            <div class="slip-meta">
              <div class="ref-badge">
                <span class="ref-label">APPLICATION NO.</span>
                <span class="ref-val"><?php echo $applicationId; ?></span>
              </div>
              <div class="meta-date">
                <strong>Submission Date:</strong> <?php echo $submissionDate; ?>
              </div>
            </div>
          </div>

          <hr class="slip-divider">

          <div class="slip-grid">
            <div class="slip-item">
              <span class="item-label"><i class="fa-regular fa-user"></i> Full Name</span>
              <span class="item-value highlight"><?php echo $fullName; ?></span>
            </div>
            <div class="slip-item">
              <span class="item-label"><i class="fa-regular fa-envelope"></i> Email Address</span>
              <span class="item-value"><?php echo $email; ?></span>
            </div>
            <div class="slip-item">
              <span class="item-label"><i class="fa-solid fa-phone"></i> Contact Number</span>
              <span class="item-value"><?php echo $phone; ?></span>
            </div>
            <div class="slip-item">
              <span class="item-label"><i class="fa-regular fa-calendar"></i> Date of Birth / Gender</span>
              <span class="item-value"><?php echo $formattedDob . ' (' . $gender . ')'; ?></span>
            </div>
            <div class="slip-item grid-col-2">
              <span class="item-label"><i class="fa-solid fa-graduation-cap"></i> Program Enrolled For</span>
              <span class="item-value highlight-accent"><?php echo $course; ?></span>
            </div>
            <div class="slip-item">
              <span class="item-label"><i class="fa-solid fa-award"></i> Prior Qualification</span>
              <span class="item-value"><?php echo $qualification; ?></span>
            </div>
            <div class="slip-item">
              <span class="item-label"><i class="fa-solid fa-city"></i> City & Pincode</span>
              <span class="item-value"><?php echo $city . ' - ' . $pincode; ?></span>
            </div>
            <div class="slip-item grid-col-2">
              <span class="item-label"><i class="fa-solid fa-location-dot"></i> Complete Residential Address</span>
              <span class="item-value"><?php echo $address; ?></span>
            </div>
            <?php if (!empty($remarks)): ?>
            <div class="slip-item grid-col-2">
              <span class="item-label"><i class="fa-solid fa-comment-dots"></i> Applicant Remarks</span>
              <span class="item-value font-italic">"<?php echo $remarks; ?>"</span>
            </div>
            <?php endif; ?>
          </div>

          <div class="slip-footer">
            <div class="verification-seal">
              <i class="fa-solid fa-stamp"></i>
              <div>
                <strong>SYSTEM VERIFIED</strong>
                <p>Digital Submission Stamp: <?php echo $timestamp; ?></p>
              </div>
            </div>
            <div class="slip-sign">
              <div class="sign-line"></div>
              <p>Authorized Signatory / Registrar</p>
            </div>
          </div>
        </div>

        <div class="slip-actions no-print">
          <button type="button" onclick="window.print()" class="btn btn-primary">
            <i class="fa-solid fa-print"></i> Print / Save as PDF
          </button>
          <a href="index.html" class="btn btn-secondary">
            <i class="fa-solid fa-plus-circle"></i> Submit Another Registration
          </a>
        </div>

      </section>
    </div>
  </main>

  <footer class="app-footer no-print">
    <div class="container footer-content">
      <p>&copy; 2026 EduPortal Online Admissions. Built with HTML, CSS, JavaScript, jQuery & PHP.</p>
    </div>
  </footer>
</body>
</html>
