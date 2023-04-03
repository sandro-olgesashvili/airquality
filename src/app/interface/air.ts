export interface Air {
  overall_aqi: number;
  CO: Co;
  PM10: Pm10;
  SO2: So2;
  'PM2.5': Pm25;
  O3: O3;
  NO2: No2;
}

export interface Co {
  concentration: number;
  aqi: number;
}

export interface Pm10 {
  concentration: number;
  aqi: number;
}

export interface So2 {
  concentration: number;
  aqi: number;
}

export interface Pm25 {
  concentration: number;
  aqi: number;
}

export interface O3 {
  concentration: number;
  aqi: number;
}

export interface No2 {
  concentration: number;
  aqi: number;
}
