export class Category {
  constructor(public id: number,
    public description: string,
    public is_featured: boolean,
    public parent_id: number) { }
}

export class Product {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public comparison_price: number,
    public price: number,
    public discount: number,
    public ratings_count: number,
    public ratings_value: number,
    public description: string,
    public availability: number,
    public cart_count: number,
    public color: Array<string>,
    public size: Array<string>,
    public weight: number,
    public category_id: number) { }
}
