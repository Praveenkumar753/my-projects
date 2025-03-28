from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['blackcoffer_db']
collection = db['insights']

# Initialize database with data if it's empty
if collection.count_documents({}) == 0:
    with open('jsondata.json', 'r') as file:
        data = json.load(file)
        collection.insert_many(data)
    print("Database initialized with JSON data")

@app.route('/api/data', methods=['GET'])
def get_data():
    filters = {}
    
    # Apply filters based on query parameters
    if request.args.get('end_year'):
        filters['end_year'] = request.args.get('end_year')
    
    if request.args.get('topic'):
        filters['topic'] = request.args.get('topic')
    
    if request.args.get('sector'):
        filters['sector'] = request.args.get('sector')
    
    if request.args.get('region'):
        filters['region'] = request.args.get('region')
    
    if request.args.get('pestle'):
        filters['pestle'] = request.args.get('pestle')
    
    if request.args.get('source'):
        filters['source'] = request.args.get('source')
    
    if request.args.get('country'):
        filters['country'] = request.args.get('country')
    
    # Retrieve data with applied filters
    cursor = collection.find(filters)
    data = json.loads(dumps(cursor))
    
    return jsonify(data)

@app.route('/api/filters', methods=['GET'])
def get_filters():
    # Get unique values for all filter fields
    end_years = collection.distinct('end_year')
    topics = collection.distinct('topic')
    sectors = collection.distinct('sector')
    regions = collection.distinct('region')
    pestles = collection.distinct('pestle')
    sources = collection.distinct('source')
    countries = collection.distinct('country')
    
    # Remove empty strings
    end_years = [year for year in end_years if year]
    topics = [topic for topic in topics if topic]
    sectors = [sector for sector in sectors if sector]
    regions = [region for region in regions if region]
    pestles = [pestle for pestle in pestles if pestle]
    sources = [source for source in sources if source]
    countries = [country for country in countries if country]
    
    return jsonify({
        'end_years': end_years,
        'topics': topics,
        'sectors': sectors,
        'regions': regions,
        'pestles': pestles,
        'sources': sources,
        'countries': countries
    })

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    # Get aggregated metrics for dashboard
    intensity_avg = collection.aggregate([
        {'$group': {'_id': None, 'avg': {'$avg': '$intensity'}}}
    ])
    
    likelihood_avg = collection.aggregate([
        {'$group': {'_id': None, 'avg': {'$avg': '$likelihood'}}}
    ])
    
    relevance_avg = collection.aggregate([
        {'$group': {'_id': None, 'avg': {'$avg': '$relevance'}}}
    ])
    
    # Count by region
    region_counts = collection.aggregate([
        {'$group': {'_id': '$region', 'count': {'$sum': 1}}},
        {'$match': {'_id': {'$ne': ''}}},
        {'$sort': {'count': -1}},
        {'$limit': 10}
    ])
    
    # Count by topic
    topic_counts = collection.aggregate([
        {'$group': {'_id': '$topic', 'count': {'$sum': 1}}},
        {'$match': {'_id': {'$ne': ''}}},
        {'$sort': {'count': -1}},
        {'$limit': 10}
    ])
    
    # Convert cursors to lists
    intensity = list(intensity_avg)
    likelihood = list(likelihood_avg)
    relevance = list(relevance_avg)
    regions = list(region_counts)
    topics = list(topic_counts)
    
    return jsonify({
        'intensity': intensity[0]['avg'] if intensity else 0,
        'likelihood': likelihood[0]['avg'] if likelihood else 0,
        'relevance': relevance[0]['avg'] if relevance else 0,
        'regions': regions,
        'topics': topics
    })

@app.route('/api/intensity-by-region', methods=['GET'])
def get_intensity_by_region():
    pipeline = [
        {'$match': {'region': {'$ne': ''}}},
        {'$group': {'_id': '$region', 'avg_intensity': {'$avg': '$intensity'}}},
        {'$sort': {'avg_intensity': -1}},
        {'$limit': 10}
    ]
    
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/likelihood-by-topic', methods=['GET'])
def get_likelihood_by_topic():
    pipeline = [
        {'$match': {'topic': {'$ne': ''}}},
        {'$group': {'_id': '$topic', 'avg_likelihood': {'$avg': '$likelihood'}}},
        {'$sort': {'avg_likelihood': -1}},
        {'$limit': 10}
    ]
    
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/relevance-by-year', methods=['GET'])
def get_relevance_by_year():
    pipeline = [
        {'$match': {'start_year': {'$ne': ''}}},
        {'$group': {'_id': '$start_year', 'avg_relevance': {'$avg': '$relevance'}}},
        {'$sort': {'_id': 1}}
    ]
    
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

@app.route('/api/country-insights', methods=['GET'])
def get_country_insights():
    pipeline = [
        {'$match': {'country': {'$ne': ''}}},
        {'$group': {
            '_id': '$country', 
            'count': {'$sum': 1},
            'avg_intensity': {'$avg': '$intensity'},
            'avg_likelihood': {'$avg': '$likelihood'},
            'avg_relevance': {'$avg': '$relevance'}
        }},
        {'$sort': {'count': -1}},
        {'$limit': 20}
    ]
    
    result = list(collection.aggregate(pipeline))
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)