@php
    /** @var \App\Models\Client|null $cliente */
    $m = $cliente ?? null;
@endphp

<div class="grid gap-4 sm:grid-cols-2">
    <div class="sm:col-span-2">
        <x-input-label for="nome" :value="__('Nome')" />
        <x-text-input id="nome" class="block mt-1 w-full" type="text" name="nome" :value="old('nome', $m?->nome)" required autofocus />
        <x-input-error :messages="$errors->get('nome')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="email" :value="__('E-mail')" />
        <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email', $m?->email)" required />
        <x-input-error :messages="$errors->get('email')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="telefone" :value="__('Telefone')" />
        <x-text-input id="telefone" class="block mt-1 w-full" type="text" name="telefone" :value="old('telefone', $m?->telefone)" required />
        <x-input-error :messages="$errors->get('telefone')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="cep" :value="__('CEP')" />
        <x-text-input id="cep" class="block mt-1 w-full" type="text" name="cep" :value="old('cep', $m?->cep)" required maxlength="9" placeholder="00000-000" />
        <x-input-error :messages="$errors->get('cep')" class="mt-2" />
    </div>

    <div class="sm:col-span-2">
        <x-input-label for="rua" :value="__('Rua / logradouro')" />
        <x-text-input id="rua" class="block mt-1 w-full" type="text" name="rua" :value="old('rua', $m?->rua)" required />
        <x-input-error :messages="$errors->get('rua')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="bairro" :value="__('Bairro')" />
        <x-text-input id="bairro" class="block mt-1 w-full" type="text" name="bairro" :value="old('bairro', $m?->bairro)" required />
        <x-input-error :messages="$errors->get('bairro')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="cidade" :value="__('Cidade')" />
        <x-text-input id="cidade" class="block mt-1 w-full" type="text" name="cidade" :value="old('cidade', $m?->cidade)" required />
        <x-input-error :messages="$errors->get('cidade')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="estado" :value="__('UF')" />
        <x-text-input id="estado" class="block mt-1 w-full" type="text" name="estado" :value="old('estado', $m?->estado)" required maxlength="2" placeholder="SP" />
        <x-input-error :messages="$errors->get('estado')" class="mt-2" />
    </div>
</div>

@push('scripts')
<script>
document.getElementById('cep')?.addEventListener('blur', async function () {
    const digits = this.value.replace(/\D/g, '');
    if (digits.length !== 8) return;
    try {
        const res = await fetch('https://viacep.com.br/ws/' + digits + '/json/');
        const data = await res.json();
        if (data.erro) return;
        const rua = document.getElementById('rua');
        const bairro = document.getElementById('bairro');
        const cidade = document.getElementById('cidade');
        const estado = document.getElementById('estado');
        if (rua && data.logradouro) rua.value = data.logradouro;
        if (bairro && data.bairro) bairro.value = data.bairro;
        if (cidade && data.localidade) cidade.value = data.localidade;
        if (estado && data.uf) estado.value = data.uf;
    } catch (e) {}
});
</script>
@endpush
