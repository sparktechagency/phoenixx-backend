export interface IPackage {
      name: string;
      price: number;
      interval: 'month' | 'year';
      description: string;
      features: string[];
      stripePriceId: string;
      stripeProductId: string;
      status: 'active' | 'deleted';
}
