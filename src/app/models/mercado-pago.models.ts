export interface ItemPreferenceDto {
    id?: string;
    title: string;
    description: string;
    quantity: number;
    picture_url: string;
    category_id: string;
    currency_id: string;
    unit_price: number;
}
export interface PreferenceDto {
    items: ItemPreferenceDto[];
    binary_mode: boolean;
    shipments: {
        cost: number;
        mode: string;
    }
}
export interface PreferenceResponse {
    id: string | number;
}