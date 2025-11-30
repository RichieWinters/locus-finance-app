import { persist } from 'zustand/middleware';
import { Asset } from '../types/asset';
import { create } from 'zustand';

interface PortfolioStore {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  removeAsset: (assetId: string) => void;
  updateAssetPrice: (assetId: string, newPrice: number) => void;
  get totalValue(): number;
  get totalProfitLoss(): number;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      assets: [],

      addAsset: (asset) =>
        set((state) => ({
          assets: [
            ...state.assets,
            {
              ...asset,
              id: crypto.randomUUID(),
              amount: Number(asset.amount),
              price: Number(asset.price),
              purchasePrice: asset.purchasePrice
                ? Number(asset.purchasePrice)
                : undefined,
            },
          ],
        })),

      removeAsset: (assetId) =>
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== assetId),
        })),

      updateAssetPrice: (assetId, newPrice) =>
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === assetId ? { ...asset, price: Number(newPrice) } : asset
          ),
        })),

      get totalValue() {
        const { assets } = get();
        return assets.reduce(
          (total, asset) => total + asset.amount * asset.price,
          0
        );
      },

      get totalProfitLoss() {
        const { assets } = get();
        return assets.reduce((total, asset) => {
          if (!asset.purchasePrice) return total;
          const currentValue = asset.amount * asset.price;
          const purchaseValue = asset.amount * asset.purchasePrice;
          return total + (currentValue - purchaseValue);
        }, 0);
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
