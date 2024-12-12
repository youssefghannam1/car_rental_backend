<?php

function apiResponse($data, $message = '', $status = 200) {
    return response()->json([
        'success' => $status >= 200 && $status < 300,
        'data' => $data,
        'message' => $message,
    ], $status);
}
