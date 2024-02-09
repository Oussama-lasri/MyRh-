import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  // We load  Stripe
  stripePromise = loadStripe(environment.stripe);
  constructor(private http: HttpClient) { }

  async pay(): Promise<void> {
    // here we create a payment object
    const payment = {
      name: 'Iphone',
      currency: 'usd',
      // amount on cents *10 => to be on dollar
      amount: 99900,
      quantity: '1',
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success',
    };
    // this is a normal http calls for a backend api
    const stripe = await this.stripePromise;

    if (stripe !== null && stripe !== undefined) {
      this.http
        .post(`${environment.serverUrl}/payment`, payment)
        .subscribe((data: any) => {
          // I use stripe to redirect To Checkout page of Stripe platform
          stripe.redirectToCheckout({
            sessionId: data.id,
          });
        });
    } else {

      console.error("Stripe is null or undefined");
    }
  }
}