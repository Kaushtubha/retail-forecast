import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# ── 1. LOAD DATA ──────────────────────────────
df = pd.read_csv('../data/Train.csv')
print('Original shape:', df.shape)

# ── 2. FIX Item_Fat_Content ───────────────────
# Standardize: 'LF', 'low fat' → 'Low Fat' | 'reg' → 'Regular'
df['Item_Fat_Content'] = df['Item_Fat_Content'].replace({
    'LF': 'Low Fat',
    'low fat': 'Low Fat',
    'reg': 'Regular'
})
print('\nItem_Fat_Content unique values after fix:')
print(df['Item_Fat_Content'].unique())

# ── 3. FILL Missing Item_Weight ───────────────
# Fill with mean weight grouped by Item_Type
df['Item_Weight'] = df.groupby('Item_Type')['Item_Weight'].transform(
    lambda x: x.fillna(x.mean())
)
print('\nItem_Weight missing after fix:', df['Item_Weight'].isnull().sum())

# ── 4. FILL Missing Outlet_Size ───────────────
# Fill with mode grouped by Outlet_Type
outlet_size_mode = df.groupby('Outlet_Type')['Outlet_Size'].agg(
    lambda x: x.mode()[0] if not x.mode().empty else 'Small'
)
def fill_outlet_size(row):
    if pd.isnull(row['Outlet_Size']):
        return outlet_size_mode[row['Outlet_Type']]
    return row['Outlet_Size']

df['Outlet_Size'] = df.apply(fill_outlet_size, axis=1)
print('Outlet_Size missing after fix:', df['Outlet_Size'].isnull().sum())

# ── 5. FIX Item_Visibility zeros ──────────────
# Zero visibility is likely a data entry error — replace with mean
df['Item_Visibility'] = df['Item_Visibility'].replace(0, np.nan)
df['Item_Visibility'] = df.groupby('Item_Type')['Item_Visibility'].transform(
    lambda x: x.fillna(x.mean())
)
print('Item_Visibility zeros fixed.')

# ── 6. CREATE New Features ────────────────────
# Outlet Age: how old is the store?
df['Outlet_Age'] = 2013 - df['Outlet_Establishment_Year']

# Item_Visibility flag: was it originally zero?
df['Visibility_Was_Zero'] = (df['Item_Visibility'] == 0).astype(int)

# MRP Bins: price category
df['MRP_Category'] = pd.cut(
    df['Item_MRP'],
    bins=[0, 70, 130, 200, 300],
    labels=['Low', 'Medium', 'High', 'Very High']
)

print('\nNew features created: Outlet_Age, Visibility_Was_Zero, MRP_Category')
print(df[['Outlet_Age', 'MRP_Category']].head())

# ── 7. LABEL ENCODING ─────────────────────────
from sklearn.preprocessing import LabelEncoder

cat_cols = [
    'Item_Fat_Content', 'Item_Type', 'Outlet_Identifier',
    'Outlet_Size', 'Outlet_Location_Type', 'Outlet_Type', 'MRP_Category'
]

le = LabelEncoder()
for col in cat_cols:
    df[col] = le.fit_transform(df[col].astype(str))

print('\nLabel encoding done for:', cat_cols)

# ── 8. DROP Unnecessary Columns ───────────────
df.drop(columns=['Item_Identifier', 'Outlet_Establishment_Year'], inplace=True)
print('\nDropped: Item_Identifier, Outlet_Establishment_Year')

# ── 9. FINAL CHECK ────────────────────────────
print('\nFinal shape:', df.shape)
print('\nMissing values after cleaning:')
print(df.isnull().sum())
print('\nFirst 3 rows of cleaned data:')
print(df.head(3))

# ── 10. SAVE CLEANED DATA ─────────────────────
df.to_csv('../data/cleaned_train.csv', index=False)
print('\nCleaned data saved to: data/cleaned_train.csv')
print('Step 3 COMPLETE!')