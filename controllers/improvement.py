from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import pandas as pd
import sys

def useSVC(DB):
    def get_svm_param_grid():
        # Define basic ranges
        C_range = [0.1, 1, 10, 100, 1000,1500,2000,5000]  # Powers of 2 ranging from 2^-5 to 2^15
        gamma_range = [0.0001, 0.001,0.005, 0.01, 0.1,0.88, 1, 10, 100] # Powers of 2 ranging from 2^-15 to 2^3
        kernel_options = ['rbf']
        return {
            'C': C_range,
            'kernel': kernel_options,
            'gamma': gamma_range
    #         'degree': [2, 3, 4, 5]  # Degrees for polynomial kernel
        }
    db = pd.read_csv(DB, index_col=0)
    # Load a sample dataset
    y = db.iloc[:, -1]
    X = db.drop(db.columns[-1], axis=1)  # This will have all columns except the last one

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Determine CV folds
    cv_folds = 4 if X_train.shape[0] < 500 else 2
    # print("CV Folds:", cv_folds)

    # Initialize the SVM classifier
    model = SVC(random_state=42)

    # Initialize GridSearchCV
    grid_search = GridSearchCV(estimator=model, param_grid=get_svm_param_grid(), cv=cv_folds, n_jobs=-1, verbose=0)

    # Fit GridSearchCV
    grid_search.fit(X_train, y_train)

    # Best model
    best_model = grid_search.best_estimator_

    # Predictions
    y_pred = best_model.predict(X_test)

    # Evaluation
    best_params = grid_search.best_params_
    print("Best Parameters:", best_params)
    #print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python your_script.py <Db>")
        sys.exit(1)
    
    Db = sys.argv[1]
    useSVC(Db)