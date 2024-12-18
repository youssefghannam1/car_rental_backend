<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log; // For logging errors

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->cookie('jwt_token_car_rental');

        if (!$token) {
            return response()->json(['error' => 'Token is missing'], 401);
        }

        try {
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            Log::error('JWT Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Token is not valid or expired'], 401);
        } catch (\Exception $e) {
            Log::error('Unexpected Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $request->auth = $user;

        return $next($request);
    }
}