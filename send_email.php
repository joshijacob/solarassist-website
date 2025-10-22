<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $service = htmlspecialchars($_POST['service']);
    $systemType = htmlspecialchars($_POST['systemType']);
    $message = htmlspecialchars($_POST['message']);
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "error";
        exit;
    }
    
    // Email details
    $to = "solarassist25@gmail.com";
    $subject = "New Contact Form Submission - Solar Assist";
    
    // Email body
    $body = "You have received a new message from your website contact form.\n\n";
    $body .= "Email: $email\n";
    $body .= "Service Required: $service\n";
    $body .= "Solar System Type: $systemType\n";
    $body .= "Message:\n$message\n";
    
    // Email headers
    $headers = "From: $email" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    echo "error";
}
?>
