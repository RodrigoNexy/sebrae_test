import { useCallback } from "react";

export type AddressPrefill = {
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export function useViaCep(): (cepDigits: string) => Promise<AddressPrefill> {
  return useCallback(async (cepDigits: string) => {
    const digits = cepDigits.replace(/\D/g, "");
    if (digits.length !== 8) {
      return {};
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${digits}/json/`,
      );
      const data = (await response.json()) as ViaCepResponse;
      if (data.erro) {
        return {};
      }

      return {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      };
    } catch {
      return {};
    }
  }, []);
}
