import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_outliers_with_isolation_forest(df):
    """
    Detect outliers using the Isolation Forest method.
    """
    iso_forest = IsolationForest(contamination=0.01)  # contamination is the expected proportion of outliers 1%
    preds = iso_forest.fit_predict(df)

    # Mark outliers with -1
    df['outlier'] = preds
    return df

def remove_outliers(df):
    """
    Process the DataFrame to detect and remove outliers.
    """
    # Assuming all columns are relevant for outlier detection
    numeric_cols = df.select_dtypes(include='number').columns
    df_outliers_detected = detect_outliers_with_isolation_forest(df[numeric_cols])

    # Remove rows marked as outliers
    df_no_outliers = df_outliers_detected[df_outliers_detected['outlier'] != -1]

    # Drop the 'outlier' column
    df_no_outliers = df_no_outliers.drop(columns=['outlier'])
    
    return df_no_outliers
