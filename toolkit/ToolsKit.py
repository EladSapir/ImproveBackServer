import os
import sys
import pandas as pd
from Imputer_FillMissingCSV import *
from DataEncoder import *
from RobustScaler import *
from FeatureSelection import *
from RemoveOutliers import *
from datetime import datetime
from uploadfile import *
import pickle
import json


def UseToolKit(CheckBoxes, target, CSV_path='Database.csv', missing_values_representation='NA', k=1):
    ChangedCSV = pd.read_csv(CSV_path, na_values=missing_values_representation)
    Encoders = {}
    Scaler = None

    if CheckBoxes[0]:  # Complete missing values in the csv file
        ChangedCSV = impute_csv_file(ChangedCSV)
    if CheckBoxes[1]:
        ChangedCSV, Encoders = encode_dataset(ChangedCSV)
    if CheckBoxes[2]:
        ChangedCSV, Scaler = scale_csv(ChangedCSV)
    if CheckBoxes[3]:
        ChangedCSV = feature_selection(ChangedCSV, target, k)
    if CheckBoxes[4]:
        ChangedCSV = remove_outliers(ChangedCSV)

    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    now = datetime.now()
    date_time_str = now.strftime('%Y-%m-%d_%H-%M-%S')
    filename = f"newData_{date_time_str}.csv"
    full_csv_path = os.path.join('uploads', filename)
    ChangedCSV.to_csv(full_csv_path, index=False)
    upload_array = []
    upload_array.append(upload_file_to_gist(full_csv_path))

    if CheckBoxes[1] and Encoders:
        encoders_path = os.path.join('uploads', f'encoders_{date_time_str}.pkl')
        try:
            encoded_data = json.dumps(Encoders, default=str)
        except TypeError as e:
            encoded_data = None
        if encoded_data is not None:
            with open(encoders_path, 'w', encoding='utf-8') as file:
                file.write(encoded_data)
            upload_array.append(upload_file_to_gist(encoders_path))
        os.remove(encoders_path)
    else:
        upload_array.append("https://example.example")

    if CheckBoxes[2] and Scaler:
        scaler_path = os.path.join('uploads', f'scaler_{date_time_str}.pkl')
        try:
            scaler_data = json.dumps(Scaler, default=str)
        except TypeError as e:
            scaler_data = None
        if scaler_data is not None:
            with open(scaler_path, 'w', encoding='utf-8') as file:
                file.write(scaler_data)
            upload_array.append(upload_file_to_gist(scaler_path))
        os.remove(scaler_path)
    else:  
        upload_array.append("https://example.example")

    relative_path = os.path.relpath(full_csv_path, start=os.getcwd())

    # Return the paths as a JSON-like string
    result = {
        'csv_after_toolkit_gist': upload_array[0],
        'encoded_csv': upload_array[1],
        'scaled_csv': upload_array[2],
        'relative_path': relative_path
    }
    return json.dumps(result)

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python your_script.py <checkBoxes> <target> <Db> <K>")
        sys.exit(1)
    checkBoxes = [s.strip().lower() == 'true' for s in sys.argv[1].split(',')]
    target = sys.argv[2]
    Db = sys.argv[3]
    k = sys.argv[4]
    print(UseToolKit(checkBoxes, target, Db, 'NA', k))