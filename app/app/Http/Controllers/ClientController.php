<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ClientController extends Controller
{
    public function index(): View
    {
        $clientes = Client::query()
            ->latest()
            ->paginate(15);

        return view('clients.index', compact('clientes'));
    }

    public function create(): View
    {
        return view('clients.create');
    }

    public function store(ClientRequest $request): RedirectResponse
    {
        Client::query()->create($request->validated());

        return redirect()
            ->route('clientes.index')
            ->with('success', __('Cliente cadastrado com sucesso.'));
    }

    public function show(Client $cliente): View
    {
        return view('clients.show', compact('cliente'));
    }

    public function edit(Client $cliente): View
    {
        return view('clients.edit', compact('cliente'));
    }

    public function update(ClientRequest $request, Client $cliente): RedirectResponse
    {
        $cliente->update($request->validated());

        return redirect()
            ->route('clientes.index')
            ->with('success', __('Cliente atualizado com sucesso.'));
    }

    public function destroy(Client $cliente): RedirectResponse
    {
        $cliente->delete();

        return redirect()
            ->route('clientes.index')
            ->with('success', __('Cliente removido com sucesso.'));
    }
}
