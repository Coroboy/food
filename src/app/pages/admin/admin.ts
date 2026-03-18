import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { Food } from '../../interfaces/food.interface';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin.html',
})
export class Admin implements OnInit {
    private foodService = inject(FoodSupabaseService);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    foods = signal<Food[]>([]);
    isEditModalOpen = signal(false);
    isDeleteModalOpen = signal(false);
    isProcessing = signal(false);
    isEditMode = signal(true);

    selectedFood = signal<Food | null>(null);
    foodToDelete = signal<Food | null>(null);

    formEdit: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        price: ['', [Validators.required, Validators.min(1)]],
        category: ['', Validators.required],
        is_available: [true],
        description: ['', [Validators.required, Validators.minLength(15)]],
        img_url: ['']
    });

    async ngOnInit() {
        await this.loadFoods();
    }

    async loadFoods() {
        console.log('Admin: Loading foods...');
        const data = await this.foodService.getFood();
        this.foods.set(data);
    }

    openAddModal() {
        this.isEditMode.set(false);
        this.selectedFood.set(null);
        this.formEdit.reset({
            is_available: true,
            price: 0
        });
        this.isEditModalOpen.set(true);
    }

    async toggleAvailability(food: Food) {
        if (this.isProcessing()) return;
        this.isProcessing.set(true);

        try {
            const result = await this.foodService.updateFood(food.id, { is_available: !food.is_available });
            if (result) {
                this.notificationService.show(
                    `"${food.name}" ${!food.is_available ? 'activado' : 'desactivado'}`,
                    'info'
                );
                await this.loadFoods();
            }
        } finally {
            this.isProcessing.set(true);
            setTimeout(() => this.isProcessing.set(false), 500);
        }
    }

    deleteFood(food: Food) {
        this.foodToDelete.set(food);
        this.isDeleteModalOpen.set(true);
    }

    async confirmDelete() {
        const food = this.foodToDelete();
        if (!food || this.isProcessing()) return;

        this.isProcessing.set(true);
        console.log('Admin: Confirming delete for ID:', food.id);

        try {
            const success = await this.foodService.deleteFood(food.id);
            if (success) {
                this.notificationService.show(`"${food.name}" eliminado del catálogo`, 'info');
                this.isDeleteModalOpen.set(false);
                this.foodToDelete.set(null);
                await this.loadFoods();
            } else {
                this.notificationService.show('Error al eliminar registro', 'error');
            }
        } catch (err) {
            console.error('Admin: Unexpected Error:', err);
            this.notificationService.show('Error técnico al eliminar', 'error');
        } finally {
            this.isProcessing.set(false);
        }
    }

    openEditModal(food: Food) {
        this.isEditMode.set(true);
        this.selectedFood.set(food);
        this.formEdit.patchValue({
            name: food.name,
            price: food.price,
            category: food.category,
            is_available: food.is_available,
            description: food.description,
            img_url: food.img_url
        });
        this.isEditModalOpen.set(true);
    }

    async saveEdit() {
        if (this.formEdit.invalid || this.isProcessing()) return;

        this.isProcessing.set(true);

        try {
            if (this.isEditMode()) {
                const id = this.selectedFood()!.id;
                const result = await this.foodService.updateFood(id, this.formEdit.value);
                if (result) {
                    this.notificationService.show(`"${this.formEdit.value.name}" actualizado con éxito`, 'success');
                    this.isEditModalOpen.set(false);
                    await this.loadFoods();
                } else {
                    this.notificationService.show('Error al guardar cambios', 'error');
                }
            } else {
                const result = await this.foodService.insertFood(this.formEdit.value);
                if (result) {
                    this.notificationService.show(`"${this.formEdit.value.name}" añadido al catálogo`, 'success');
                    this.isEditModalOpen.set(false);
                    await this.loadFoods();
                } else {
                    this.notificationService.show('Error al crear platillo', 'error');
                }
            }
        } finally {
            this.isProcessing.set(false);
        }
    }

    private readonly fallbackImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567621132799-79f23b24f5a2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop'
    ];

    getFallbackImage(food: Food): string {
        const index = (food.id || 0) % this.fallbackImages.length;
        return this.fallbackImages[index];
    }

    handleImageError(event: any, food: Food) {
        event.target.src = this.getFallbackImage(food);
    }
}
