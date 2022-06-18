import axios from "axios";
export const getLocations =  async () => {
  const response = await axios.get('https://api.triip.me/api/v1/places');
  const data = await response.data.data;
  return data.map(item => item.name);
}