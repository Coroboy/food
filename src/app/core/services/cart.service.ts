import { Injectable, computed, signal } from '@angular/core';
import { Food } from '../../interfaces/food.interface';
import { NotificationService } from './notification.service';

export interface CartItem extends Food {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  constructor(private notificationService: NotificationService) {}

  // Computed signals
  items = computed(() => this.cartItems());
  
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  addToCart(food: Food) {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.id === food.id);
      if (existingItem) {
        return items.map(i => 
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...food, quantity: 1 }];
    });
    this.notificationService.show(`${food.name} añadido al carrito`, 'success');
  }

  removeFromCart(foodId: number) {
    const item = this.cartItems().find(i => i.id === foodId);
    this.cartItems.update(items => items.filter(i => i.id !== foodId));
    if (item) {
      this.notificationService.show(`${item.name} eliminado del carrito`, 'info');
    }
  }

  updateQuantity(foodId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(foodId);
      return;
    }
    this.cartItems.update(items => 
      items.map(i => i.id === foodId ? { ...i, quantity } : i)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
