<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        $clientes = Client::query()
            ->latest()
            ->paginate($perPage);

        return response()->json($clientes);
    }

    public function store(ClientRequest $request): JsonResponse
    {
        $cliente = Client::query()->create($request->validated());

        return response()->json($cliente, 201);
    }

    public function show(Client $cliente): JsonResponse
    {
        return response()->json($cliente);
    }

    public function update(ClientRequest $request, Client $cliente): JsonResponse
    {
        $cliente->update($request->validated());

        return response()->json($cliente);
    }

    public function destroy(Client $cliente): JsonResponse
    {
        $cliente->delete();

        return response()->json(null, 204);
    }
}
