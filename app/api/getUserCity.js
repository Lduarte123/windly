import * as Location from 'expo-location';

export async function getUserCity() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada');
  }
  let location = await Location.getCurrentPositionAsync({});
  let places = await Location.reverseGeocodeAsync(location.coords);
  
  let city = places[0]?.city || places[0]?.subregion || places[0]?.region;
  if (!city) {
    throw new Error('Cidade não encontrada');
  }
  return city;
}