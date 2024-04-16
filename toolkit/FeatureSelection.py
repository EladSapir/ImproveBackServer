import pandas as pd
from sklearn.feature_selection import SelectKBest, f_classif

def feature_selection(data, target_col_name, k=10):
    # Assuming `target_col_name` is the name of the target variable column

    # Separate the features (X) and the target (y) based on `target_col_name`
    X = data.drop(columns=[target_col_name])
    y = data[target_col_name]

    # Apply feature selection
    selector = SelectKBest(score_func=f_classif, k=int(k))
    X_new = selector.fit_transform(X, y)

    # Get the columns that were selected
    mask = selector.get_support()
    selected_columns = X.columns[mask]

    # Create a new DataFrame with selected features
    selected_data = pd.DataFrame(X_new, columns=selected_columns)
    
    # Add the target column with its original name
    selected_data[target_col_name] = y

    # # Optionally, save the new DataFrame to a CSV file
    # selected_data.to_csv('selected_features.csv', index=False)

    return selected_data

# Example usage
# csv_path = pd.read_csv('db.csv')
# result_csv = feature_selection(csv_path, k=3)
# print(f"Feature selected data saved to: {result_csv}")
