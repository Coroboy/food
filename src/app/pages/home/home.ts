import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCard } from '../../components/food-card/food-card';
import { Food } from '../../interfaces/food.interface';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FoodCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private foodService = inject(FoodSupabaseService);
  foods = signal<Food[]>([]);

  async ngOnInit() {
    await this.loadFoods();
  }

  async loadFoods() {
    console.log('Home: Cargando platillos...');
    const data = await this.foodService.getFood();
    this.foods.set(data);
  }
}
