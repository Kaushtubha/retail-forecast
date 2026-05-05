from scipy.stats import ks_2samp
import pandas as pd

def check_drift(ref, curr):
    stat, p = ks_2samp(ref['Item_MRP'], curr['Item_MRP'])
    print("Drift Detected" if p < 0.05 else "No Drift")

print("Drift monitor ready.")
