from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix, accuracy_score
import pandas as pd
import sys
import json

def useSVC(DB):
    def get_svm_param_grid():
        # Define basic ranges
        C_range = [0.1, 1, 10, 100, 1000, 1500, 2000, 5000]
        gamma_range = [0.0001, 0.001, 0.005, 0.01, 0.1, 0.88, 1, 10, 100]
        kernel_options = ['rbf']
        return {
            'C': C_range,
            'kernel': kernel_options,
            'gamma': gamma_range
        }
    
    db = pd.read_csv(DB, index_col=0)
    y = db.iloc[:, -1]
    X = db.drop(db.columns[-1], axis=1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    cv_folds = 4 if X_train.shape[0] < 500 else 2

    model = SVC(random_state=42)
    grid_search = GridSearchCV(estimator=model, param_grid=get_svm_param_grid(), cv=cv_folds, n_jobs=-1, verbose=0)
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)

    best_params = grid_search.best_params_
    cm = confusion_matrix(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)

    result = {
        "best_params": best_params,
        "confusion_matrix": cm.tolist(),
        "accuracy": accuracy
    }

    return json.dumps(result)

if __name__ == "__main__":
    file_path = sys.argv[1]
    result = useSVC(file_path)
    print(result)
