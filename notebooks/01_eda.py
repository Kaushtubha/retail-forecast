import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

sns.set_theme(style='whitegrid', palette='muted')

df = pd.read_csv('../data/Train.csv')

# ── 1. BASIC INFO ─────────────────────────────
print('=' * 50)
print('SHAPE:', df.shape)
print('=' * 50)

# ── 2. MISSING VALUES ─────────────────────────
print('\n MISSING VALUES:')
print(df.isnull().sum())
print('\n MISSING VALUES (%):')
print(round(df.isnull().sum() / len(df) * 100, 2))

# ── 3. BASIC STATISTICS ───────────────────────
print('\n BASIC STATISTICS:')
print(df.describe())

# ── 4. UNIQUE VALUES IN CATEGORICAL COLUMNS ───
cat_cols = ['Item_Fat_Content', 'Item_Type', 'Outlet_Size',
            'Outlet_Location_Type', 'Outlet_Type']
print('\n UNIQUE VALUES:')
for col in cat_cols:
    print(f'{col}: {df[col].unique()}')

# ── 5. PLOT 1: Target Distribution ────────────
plt.figure(figsize=(8, 4))
sns.histplot(df['Item_Outlet_Sales'], bins=50, kde=True, color='steelblue')
plt.title('Distribution of Item Outlet Sales')
plt.xlabel('Sales')
plt.ylabel('Count')
plt.tight_layout()
plt.savefig('../data/plot1_sales_distribution.png')
plt.close()
print('\n Plot 1 saved: sales distribution')

# ── 6. PLOT 2: Sales by Outlet Type ───────────
plt.figure(figsize=(8, 4))
sns.boxplot(x='Outlet_Type', y='Item_Outlet_Sales', data=df)
plt.title('Sales by Outlet Type')
plt.xticks(rotation=15)
plt.tight_layout()
plt.savefig('../data/plot2_sales_by_outlet.png')
plt.close()
print(' Plot 2 saved: sales by outlet type')

# ── 7. PLOT 3: Item MRP vs Sales ──────────────
plt.figure(figsize=(8, 4))
sns.scatterplot(x='Item_MRP', y='Item_Outlet_Sales', data=df, alpha=0.3)
plt.title('Item MRP vs Sales')
plt.tight_layout()
plt.savefig('../data/plot3_mrp_vs_sales.png')
plt.close()
print(' Plot 3 saved: MRP vs Sales')

# ── 8. PLOT 4: Missing Values Heatmap ─────────
plt.figure(figsize=(10, 4))
sns.heatmap(df.isnull(), cbar=False, cmap='viridis', yticklabels=False)
plt.title('Missing Values Heatmap')
plt.tight_layout()
plt.savefig('../data/plot4_missing_values.png')
plt.close()
print(' Plot 4 saved: missing values heatmap')

print('\n ALL EDA COMPLETE!')
print(' Check your data/ folder for 4 chart images.')