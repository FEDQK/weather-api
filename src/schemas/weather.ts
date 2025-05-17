export const WeatherForecastSchema = {
  type: 'object',
  properties: {
    location: {
      type: 'string',
      description: 'City name or location',
      example: 'London'
    },
    temperature: {
      type: 'number',
      description: 'Temperature in Celsius',
      example: 22.5
    },
    conditions: {
      type: 'string',
      description: 'Weather conditions',
      example: 'Partly cloudy'
    },
    humidity: {
      type: 'number',
      description: 'Humidity percentage',
      example: 65
    },
    windSpeed: {
      type: 'number',
      description: 'Wind speed in km/h',
      example: 12
    },
    forecast: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Forecast date',
            example: '2025-05-18'
          },
          temperature: {
            type: 'object',
            properties: {
              min: {
                type: 'number',
                description: 'Minimum temperature in Celsius',
                example: 15
              },
              max: {
                type: 'number',
                description: 'Maximum temperature in Celsius',
                example: 25
              }
            },
            required: ['min', 'max']
          },
          conditions: {
            type: 'string',
            description: 'Weather conditions',
            example: 'Sunny'
          }
        },
        required: ['date', 'temperature', 'conditions']
      }
    }
  },
  required: ['location', 'temperature', 'conditions', 'humidity', 'windSpeed', 'forecast']
};
