<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ $cliente->nome }}
            </h2>
            <div class="flex gap-2">
                <a href="{{ route('clientes.edit', $cliente) }}"
                   class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    {{ __('Editar') }}
                </a>
                <form method="POST" action="{{ route('clientes.destroy', $cliente) }}" data-confirm="{{ __('Excluir este cliente?') }}">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm text-white hover:bg-red-500">
                        {{ __('Excluir') }}
                    </button>
                </form>
            </div>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 space-y-2 text-sm">
                    <p><span class="font-medium text-gray-500">{{ __('E-mail') }}:</span> {{ $cliente->email }}</p>
                    <p><span class="font-medium text-gray-500">{{ __('Telefone') }}:</span> {{ $cliente->telefone }}</p>
                    <p><span class="font-medium text-gray-500">{{ __('CEP') }}:</span> {{ $cliente->cep }}</p>
                    <p><span class="font-medium text-gray-500">{{ __('Endereço') }}:</span> {{ $cliente->rua }}, {{ $cliente->bairro }} — {{ $cliente->cidade }}/{{ $cliente->estado }}</p>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
