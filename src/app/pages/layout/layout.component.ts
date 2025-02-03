import { Component, DestroyRef, inject } from '@angular/core';
import { MercagoPagoService } from '@services/mercago-pago.service';
import { ItemPreferenceDto, PreferenceDto, PreferenceResponse } from '@models/mercado-pago.models';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';

declare var MercadoPago: any; // Declaración global de MercadoPago

declare global {
  interface Window {
    checkoutButton: any;
  }
}

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  private readonly mercadoPagoService = inject(MercagoPagoService);
  private readonly destroyRef = inject(DestroyRef);
  private mp: any;

  requestStatus: 'init' | 'loading' | 'success' | 'failed' = 'init';

  ngOnInit(): void {
    if (typeof MercadoPago === 'undefined') {
      console.error('La librería MercadoPago no se ha cargado.');
      return;
    }

    this.mp = new MercadoPago(environment.MERCADO_PAGO_PUBLIC_KEY, {
      locale: 'es-AR'
    });
  }

  createPreferenceId() {
    const item: ItemPreferenceDto = {
      title: 'Producto',
      description:'Producto de prueba',
      quantity: 1,
      unit_price:  1,
      currency_id: 'ARS',
      picture_url: 'imagen.png',
      category_id: 'car_electronics'
    }
    const shipmentCost = 10000;

    const preference: PreferenceDto = {
      items: [
        item
      ],
      shipments: {
        cost: shipmentCost,
        mode: 'not_specified'
      },
      binary_mode: true
    };
    
    this.requestStatus = 'loading';
    this.mercadoPagoService.createPreferenceMP(preference)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (preference: PreferenceResponse) => {
        this.createCheckoutButton(preference.id);
        this.requestStatus = 'success';
      },
      error: (err: HttpErrorResponse) => {
        this.requestStatus = 'failed';
      }
    })
  }
  

  private createCheckoutButton(preferenceId: number | string) {
    const wallet_container = document.getElementById('wallet_container');

    if(wallet_container && wallet_container.hasChildNodes()) {
      while (wallet_container.firstChild) {
        wallet_container.removeChild(wallet_container.firstChild);
      }
    }

    const bricksBuilder = this.mp.bricks();

    bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
          preferenceId: preferenceId,
          redirectMode: 'modal' // self | blank | modal
      },
      customization: {
        texts: {
          valueProp: 'smart_option',
        },
      },
    });
  }

}
