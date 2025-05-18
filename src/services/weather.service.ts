export interface WeatherForecast {
  temperature: number;
  humidity: number;
  description: string;
}
interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
      code: number;
    };
  };
}

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY ?? '';
    this.baseUrl = process.env.WEATHER_API_BASE_URL ?? '';

    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Missing required environment variables');
    }
  }

  async getWeatherForecast(location: string): Promise<WeatherForecast> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}&q=${location}`);

      if (response.status === 400) {
        throw new Error('City not found');
      }

      if (!response.ok) {
        throw new Error('Invalid request');
      }

      const {
        current: {
          temp_c,
          humidity,
          condition: { text },
        },
      } = (await response.json()) as WeatherApiResponse;

      return {
        temperature: temp_c,
        humidity,
        description: text,
      };
    } catch (error) {
      throw error;
    }
  }
}
