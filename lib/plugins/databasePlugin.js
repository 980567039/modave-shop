import { v4 as uuidv4 } from 'uuid';

const databasePlugin = ({ saveToDatabase }) => {
  return {
    name: 'database-plugin',
    config: {
      saveToDatabase: saveToDatabase
    },
    initialize: ({ config }) => {
      // Initialization logic if needed
    },
    page: ({ payload, config }) => {
      const eventData = {
        id: uuidv4(),
        type: 'page',
        timestamp: new Date().toISOString(),
        data: payload
      };
      config.saveToDatabase(eventData);
    },
    track: ({ payload, config }) => {
      const eventData = {
        id: uuidv4(),
        type: 'track',
        timestamp: new Date().toISOString(),
        data: payload
      };
      config.saveToDatabase(eventData);
    },
    identify: ({ payload, config }) => {
      const eventData = {
        id: uuidv4(),
        type: 'identify',
        timestamp: new Date().toISOString(),
        data: payload
      };
      config.saveToDatabase(eventData);
    }
  };
};

export default databasePlugin;