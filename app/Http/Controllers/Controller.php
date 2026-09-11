<?php
namespace App\Http\Controllers;

abstract class Controller
{
    function __construct() {}

    

    /**
     * Return JSON response if has Error
     */
    function hasError($errors, $title = 'Error occurred') 
    {
        return response()->json([
            'success' => false,
            'title' => $title,
            'errors' => $errors,
            'error' => is_object($errors) ? json_encode($errors) : $errors
        ], 422);
    }

    /**
     * Return JSON response if success response
     */
    function jsonResponse($msg, $title = 'Done', $reload = null , $redirect = false, $no_reset = true) 
    {
        return response()->json([
            'success' => true,
            'no_reset' => $no_reset,
            'redirect' => $redirect,
            'reload' => $reload,
            'title' => $title,
            'result' => $msg,
        ], 200);
    }

    /**
     * Check if user has access to action
     */
    public function hasAccess($action = null, $id = 0 )
    {
        $user = auth()->id();
        if (!$user) {
            $this->noAccessResponse("You do not have permission to perform this action");
        }
    }

    /**
     * Return No Access Response
     */
    public function noAccessResponse($message = 'Not allowed')
    {
        abort(403, $message);
    }

}