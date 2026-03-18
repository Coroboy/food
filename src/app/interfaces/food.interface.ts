export interface Food {
    id: number;
    name: string;
    description: string;
    price: number;
    img_url: string | null;
    category: string;
    is_available: boolean;
    created_at: string;
}

export interface NewFood {
    name: string;
    description: string;
    price: number;
    img_url: string;
    category: string;
    is_available: boolean;
}
