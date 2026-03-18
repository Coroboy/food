import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { Food, NewFood } from '../../interfaces/food.interface';

@Injectable({
    providedIn: 'root'
})
export class FoodSupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.publicKey,
            {
                auth: {
                    persistSession: false
                }
            }
        );
    }

    async getFood(): Promise<Food[]> {
        console.log('Servicio: Fetching foods list...');
        const { data, error } = await this.supabase
            .from('foods')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Fetch Error:', error);
            return [];
        }

        // Handle both possible column names for image URL
        return (data || []).map((f: any) => ({
            ...f,
            img_url: f.img_url || f.url_img || null
        })) as Food[];
    }

    async insertFood(newFood: NewFood) {
        console.log('Servicio: Inserting...', newFood);

        // Attempt with img_url first
        const { data, error } = await this.supabase.from('foods').insert([newFood]).select();
        if (!error && data?.length) return data;

        // Fallback to url_img
        console.warn('img_url failed, trying url_img fallback');
        const fallback: any = { ...newFood };
        fallback.url_img = fallback.img_url;
        delete fallback.img_url;

        const { data: data2, error: error2 } = await this.supabase.from('foods').insert([fallback]).select();
        if (error2) console.error('Insert Error:', error2);
        return data2 || null;
    }

    async updateFood(id: number, changes: Partial<Food>) {
        console.log(`Servicio: Updating ID ${id}...`, changes);

        const clean: any = { ...changes };
        delete clean.id;
        delete clean.created_at;

        // Attempt 1: Standard update with select
        const { data, error } = await this.supabase.from('foods').update(clean).eq('id', id).select();
        if (!error && data?.length) return data;

        // Attempt 2: Image column fallback
        if (clean.hasOwnProperty('img_url')) {
            console.warn('Trying url_img fallback for update');
            const fallback = { ...clean };
            fallback.url_img = fallback.img_url;
            delete fallback.img_url;

            const { data: data2, error: error2 } = await this.supabase.from('foods').update(fallback).eq('id', id).select();
            if (!error2 && data2?.length) return data2;
        }

        // Attempt 3: Blind update without select (bypasses RLS reading restrictions)
        console.warn('Updates with select failed, trying blind update');
        const { error: error3 } = await this.supabase.from('foods').update(clean).eq('id', id);
        if (!error3) return { success: true };

        return null;
    }

    async deleteFood(id: number) {
        console.log(`Servicio: Deleting ID ${id}...`);

        // Blind delete to avoid RLS SELECT restrictions
        const { error } = await this.supabase.from('foods').delete().eq('id', id);

        if (error) {
            console.error('Delete Error:', error);
            // If it's a 403, it's a permission issue
            return false;
        }

        console.log('Delete command sent successfully.');
        return true;
    }
}
