import os
import sys

from Imputer_FillMissingCSV import *
from DataEncoder import *
from RobustScaler import *
from FeatureSelection import *
from RemoveOutliers import *
from datetime import datetime
import pickle
import zipfile

def UseToolKit(CheckBoxes, target, CSV_path='Database.csv', missing_values_representation='NA', k=1):
    ChangedCSV = pd.read_csv(CSV_path, na_values=missing_values_representation)
    print("ChangedCSV -------------- ", ChangedCSV)
    Encoders = {}
    Scaler = None

    if CheckBoxes[0]:  # Complete missing values in the csv file
        ChangedCSV = impute_csv_file(ChangedCSV)
    if CheckBoxes[1]:
        ChangedCSV, Encoders = encode_dataset(ChangedCSV)
    if CheckBoxes[2]:
        ChangedCSV, Scaler = scale_csv(ChangedCSV)
    if CheckBoxes[3]:
        ChangedCSV = UseFeatureSelection(ChangedCSV, k)
    if CheckBoxes[4]:
        CSVsize = ChangedCSV.shape[1]
        ChangedCSV = UseRemoveOutliers(ChangedCSV, CSVsize)
    print(ChangedCSV)
    # Ensure the temp directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # Get current date and time
    now = datetime.now()
    date_time_str = now.strftime('%Y-%m-%d_%H-%M-%S')
    filename = f"newData_{date_time_str}.csv"
    full_csv_path = os.path.join('uploads', filename)
    ChangedCSV.to_csv(full_csv_path, index=False)

    # Initialize a list to keep track of files to be zipped
    files_to_zip = []

    # Save the encoders and scaler if they were created
    if CheckBoxes[1] and Encoders:
        encoders_path = os.path.join('uploads', f'encoders_{date_time_str}.pkl')
        with open(encoders_path, 'wb') as file:
            pickle.dump(Encoders, file)
        files_to_zip.append(encoders_path)

    if CheckBoxes[2] and Scaler:
        scaler_path = os.path.join('uploads', f'scaler_{date_time_str}.pkl')
        with open(scaler_path, 'wb') as file:
            pickle.dump(Scaler, file)
        files_to_zip.append(scaler_path)

    # Zip files if there are any to zip
    if files_to_zip:
        zip_path = os.path.join('uploads', f'transformers_{date_time_str}.zip')
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for file in files_to_zip:
                zipf.write(file, os.path.basename(file))
                os.remove(file)  # Remove the file after zipping
    else:
        zip_path = None

    # Return the paths ADD ZIP PATH TO RETURN
    return full_csv_path


def UseFeatureSelection(ChangedCSV):
    numberOfColumns = ChangedCSV.shape[0]
    if numberOfColumns <= 4:
        return [False]
    else:
        ChangedCSV = [True, feature_selection(ChangedCSV, 1)]


def UseRemoveOutliers(ChangedCSV, CSVsize):
    numberOfRows = ChangedCSV.shape[1]
    if numberOfRows / CSVsize <= 0.9:
        return [False]
    else:
        return [True, remove_outliers(ChangedCSV)]


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python your_script.py <checkBoxes><Db><K>")
        sys.exit(1)
    target = sys.argv[2]
    Db = sys.argv[3]
    print(Db)
    k = sys.argv[4]
    checkBoxes = [s.strip().lower() == 'true' for s in sys.argv[1].split(',')]
    print(UseToolKit(checkBoxes,target, Db,'NA',k))
