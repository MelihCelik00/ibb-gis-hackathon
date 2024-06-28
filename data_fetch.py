import requests
import googlemaps
import pandas as pd

GMAPS_SECRET_KEY = '' # insert your Google Maps API key here
print(GMAPS_SECRET_KEY)

gmaps = googlemaps.Client(key=GMAPS_SECRET_KEY)

ibbCulturalPoisAPI = 'https://data.ibb.gov.tr/tr/api/3/action/datastore_search?resource_id=8be73973-dc72-4e61-aea9-43c8f5ca4605&limit=37000'

desiredAttributes = ['anit_adi', 'ilce_adi', 'mahalle_adi', 'kultur_donemi']

def fetchDataFromAPI(api):
    try:
        data = requests.get(api)
        fetchedPois = data.json()
        return fetchedPois['result']['records']
    except Exception as error:
        print(error)

def decodeGMapsPois():
    try:
        pois = fetchDataFromAPI(ibbCulturalPoisAPI)

        formattedPois = []
        for poi in pois:
            formattedPoi = {attribute: poi[attribute] for attribute in desiredAttributes}
            formattedPois.append(formattedPoi)
            print(formattedPoi)

        poisWithLocation = []
        for poi in formattedPois:
            geocode_result = gmaps.geocode(f'{poi["anit_adi"]}, {poi["mahalle_adi"]}, {poi["ilce_adi"]}, İstanbul')
            if geocode_result:
                location = geocode_result[0]['geometry']['location']
                poiWithLocation = {**poi, 'lat': location["lat"], 'lng': location["lng"]}
                poisWithLocation.append(poiWithLocation)
            else:
                print('Error in geocoding')

        # Convert the list of dictionaries to a DataFrame
        df = pd.DataFrame(poisWithLocation)

        # Export the DataFrame to a CSV file
        df.to_csv('poisWithLocation.csv', index=False)

        print(poisWithLocation)
        return poisWithLocation
    except Exception as error:
        print(error)

decodeGMapsPois()