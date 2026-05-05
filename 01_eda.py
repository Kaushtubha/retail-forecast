import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

sns.set_theme(style='whitegrid', palette='muted')

# ── 1. LOAD DATA ──────────────────────────────
df = pd.read_csv('../data/Train.csv')

print('=' * 50)
print('SHAPE:', df.shape)
print('=' * 50)
print(df.head())
print()
print('COLUMNS:', df.columns.tolist())
print()
print('DATA TYPES:')
print(df.dtypes)
