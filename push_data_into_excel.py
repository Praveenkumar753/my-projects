import os
import openpyxl

def get_student_details():
    roll_number = input("Enter Roll Number (or 'stop' to finish): ")
    if roll_number.lower() == "stop":
        return None, None

    name = input("Enter Name: ")
    return roll_number, name

def display_output():
    print("Successfully")

def save_to_excel(roll_number, name):
    # Get the directory of the current Python file
    script_directory = os.path.dirname(os.path.abspath(__file__))

    # Create the full file path for the Excel file
    file_path = os.path.join(script_directory, "student_data.xlsx")

    # Check if the file exists
    if not os.path.exists(file_path):
        # If the file doesn't exist, create a new workbook and sheet
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.append(["Roll Number", "Name"])
    else:
        # If the file exists, load the workbook
        workbook = openpyxl.load_workbook(file_path)
        sheet = workbook.active

    # Append new data to the sheet
    sheet.append([roll_number, name])

    # Save the workbook
    workbook.save(file_path)

def main():
    while True:
        roll_number, name = get_student_details()
        if roll_number is None and name is None:
            break

        display_output()
        save_to_excel(roll_number, name)

if __name__ == "__main__":
    main()