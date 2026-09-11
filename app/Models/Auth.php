<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth as AuthClass;

class Auth extends AuthClass
{

    /**
     * Return the User current session 
     * based on the guard name
     */
    public static function user()
    {
        return AuthClass::guard(Auth::guardName())->user();
    }

    /**
     * Return the Guard name of 
     * the User current session 
     */
    public static function guardName()
    {
        return 'superadmin';
    }
}