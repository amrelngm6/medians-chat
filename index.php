<?php
/**
 * MediansCRM Laravel Application Entry Point
 * 
 * This file loads the Laravel application from the medians-crm subdirectory
 * allowing the app to run directly from the root domain.
 * 
 * INSTALLATION INSTRUCTIONS:
 * Copy this file to the root directory of your domain (one level up from the medians-crm folder)
 * Your directory structure should look like:
 * 
 * /public_html/ (or your domain root)
 * ├── index.php (this file)
 * ├── medians-crm/
 * │   ├── app/
 * │   ├── public/
 * │   │   └── index.php (Laravel's public index)
 * │   └── ... (your Laravel application)
 * └── ... (other files)
 */

// Define the path to the Laravel application
$laravelAppPath = __DIR__ ;
$laravelPublicPath = $laravelAppPath . '/public';

// Check if the Laravel application exists
if (!file_exists($laravelPublicPath . '/index.php')) {
    die('MediansCRM application not found. Please ensure the medians-crm directory exists and contains the Laravel application.');
}

// Change the working directory to the Laravel public directory
chdir($laravelPublicPath);

// Set the SCRIPT_NAME and SCRIPT_FILENAME for Laravel
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $laravelPublicPath . '/index.php';

// Update the document root
$_SERVER['DOCUMENT_ROOT'] = $laravelPublicPath;

// Include and execute Laravel's public index.php
require_once $laravelPublicPath . '/index.php';
