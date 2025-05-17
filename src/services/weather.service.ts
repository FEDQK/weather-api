interface WeatherForecast {
  location: string;
  temperature: number;
  humidity: number;
  description: string;
}

export class WeatherService {
  async getWeatherForecast(location: string): Promise<WeatherForecast> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      location,
      temperature: 24,
      humidity: 63,
      description: 'Cloudy',
    };
  }
}
