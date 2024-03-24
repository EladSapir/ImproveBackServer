import os
import sys

from Imputer_FillMissingCSV import *
from DataEncoder import *
from RobustScaler import *
from FeatureSelection import *
from RemoveOutliers import *
from datetime import datetime


def UseToolKit(CheckBoxes, CSV_path='Database.csv', missing_values_representation='NA', k=1):
    ChangedCSV = pd.read_csv(CSV_path, na_values=missing_values_representation)
    CSVsize = ChangedCSV.shape[1]
    if CheckBoxes[0]:  # complete missing valuse in the csv file
        ChangedCSV = impute_csv_file(ChangedCSV)
    if CheckBoxes[1]:
        ChangedCSV, Encoders = encode_dataset(ChangedCSV)
    if CheckBoxes[2]:
        ChangedCSV, Scaler = scale_csv(ChangedCSV)
    if CheckBoxes[3]:
        ChangedCSV = UseFeatureSelection(ChangedCSV,k)     # function down lets to remove until there are 4 columns(1each time)
    if CheckBoxes[4]:
        ChangedCSV = UseRemoveOutliers(ChangedCSV, CSVsize)  # function down lets to remove 10% of original CSV
    if not os.path.exists('temp'):
        os.makedirs('temp')

        # Get current date and time
    now = datetime.now()

    # Format the date and time string for the filename
    date_time_str = now.strftime('%Y-%m-%d_%H-%M-%S')

    # Construct the filename with the desired format
    filename = f"{'newData'}_{date_time_str}.csv"

    # Construct the full path
    full_path = os.path.join('temp', filename)

    # Save the DataFrame to the CSV file
    ChangedCSV.to_csv(full_path, index=False)

    # Return the full path of the saved file
    return full_path


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
    if len(sys.argv) != 4:
        print("Usage: python your_script.py <checkBoxes><Db><K>")
        sys.exit(1)
    Db = sys.argv[2]
    k = sys.argv[3]
    checkBoxes = [s.strip().lower() == 'true' for s in sys.argv[1].split(',')]
    UseToolKit(checkBoxes, Db, k)
