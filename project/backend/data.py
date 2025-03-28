import json
from pymongo import MongoClient
import sys

def import_json_to_mongodb(json_file_path, db_name='blackcoffer_db', collection_name='insights'):
    """
    Import JSON data into MongoDB.
    
    Parameters:
    - json_file_path: Path to the JSON file
    - db_name: Name of the database to use
    - collection_name: Name of the collection to store data in
    """
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # Create or access the database
        db = client[db_name]
        
        # Create or access the collection
        collection = db[collection_name]
        
        # Read the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Check if data is a list
        if not isinstance(data, list):
            print("Warning: JSON data is not a list. Converting to a list with a single element.")
            data = [data]
        
        # Insert data into the collection
        if len(data) > 0:
            result = collection.insert_many(data)
            print(f"Successfully imported {len(result.inserted_ids)} records into MongoDB.")
        else:
            print("No data to import.")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close the MongoDB connection
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    # Get the file path from command line arguments or use a default path
    file_path = sys.argv[1] if len(sys.argv) > 1 else "backend\jsondata.json"
    
    # Import the data
    import_json_to_mongodb(file_path)
    print(f"Finished processing file: {file_path}")