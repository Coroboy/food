import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food } from '../../interfaces/food.interface';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.html',
  styles: ``,
})
export class FoodCard {
  private cartService = inject(CartService);
  @Input({ required: true }) food!: Food;

  private readonly fallbackImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567621132799-79f23b24f5a2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop'
  ];

  getFallbackImage(): string {
    const index = (this.food.id || 0) % this.fallbackImages.length;
    return this.fallbackImages[index];
  }

  handleImageError(event: any) {
    event.target.src = this.getFallbackImage();
  }

  addToCart() {
    this.cartService.addToCart(this.food);
  }
}
