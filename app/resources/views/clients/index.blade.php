<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Clientes') }}
            </h2>
            <a href="{{ route('clientes.create') }}"
               class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700">
                {{ __('Novo cliente') }}
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('success'))
                <div class="mb-4 p-4 bg-green-100 text-green-800 rounded-md" role="alert">
                    {{ session('success') }}
                </div>
            @endif

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    @if ($clientes->isEmpty())
                        <p class="text-gray-500">{{ __('Nenhum cliente cadastrado.') }}</p>
                    @else
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-left text-sm">
                                <thead class="border-b font-medium text-gray-700">
                                    <tr>
                                        <th class="px-3 py-2">{{ __('Nome') }}</th>
                                        <th class="px-3 py-2">{{ __('E-mail') }}</th>
                                        <th class="px-3 py-2">{{ __('Telefone') }}</th>
                                        <th class="px-3 py-2">{{ __('Cidade') }}</th>
                                        <th class="px-3 py-2 text-right">{{ __('Ações') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($clientes as $cliente)
                                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                                            <td class="px-3 py-2 font-medium">{{ $cliente->nome }}</td>
                                            <td class="px-3 py-2">{{ $cliente->email }}</td>
                                            <td class="px-3 py-2">{{ $cliente->telefone }}</td>
                                            <td class="px-3 py-2">{{ $cliente->cidade }} / {{ $cliente->estado }}</td>
                                            <td class="px-3 py-2 text-right space-x-1">
                                                <a href="{{ route('clientes.show', $cliente) }}" class="text-indigo-600 hover:underline">{{ __('Ver') }}</a>
                                                <a href="{{ route('clientes.edit', $cliente) }}" class="text-indigo-600 hover:underline">{{ __('Editar') }}</a>
                                                <form class="inline" method="POST" action="{{ route('clientes.destroy', $cliente) }}" data-confirm="{{ __('Excluir este cliente?') }}">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:underline">{{ __('Excluir') }}</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-4">
                            {{ $clientes->links() }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
