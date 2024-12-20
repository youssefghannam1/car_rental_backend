<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Options
    |--------------------------------------------------------------------------
    |
    | This file allows you to configure your settings for cross-origin resource
    | sharing (CORS). CORS is a mechanism that allows restricted resources
    | on a web page to be requested from another domain outside the domain
    | from which the resource originated.
    |
    */
    
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Allows all methods (GET, POST, etc.)

    'allowed_origins' => ['*'], // Allows all origins (change this for more security)

    'allowed_headers' => ['*'], // Allows all headers
    
    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true,
];
