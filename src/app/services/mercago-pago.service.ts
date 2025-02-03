import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PreferenceDto, PreferenceResponse } from '@models/mercado-pago.models';

@Injectable({
  providedIn: 'root'
})
export class MercagoPagoService {

  private readonly http = inject(HttpClient);

  private readonly mpApi = 'https://api.mercadopago.com/checkout/preferences';
  private readonly MERCADO_PAGO_TOKEN = environment.MERCADO_PAGO_TOKEN;

  createPreferenceMP(preference: PreferenceDto) {
    return this.http.post<PreferenceResponse>(this.mpApi, preference, {
      headers: {
        Authorization: `Bearer ${this.MERCADO_PAGO_TOKEN}`
      }
    });
  }
}
