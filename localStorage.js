import { AsyncStorage } from 'react-native';

export const loadState = () => {
  return Promise.race([
    new Promise((res, rej) => {
      setTimeout(() => {
        rej('AsyncStorage timed out');
      }, 1000);
    }),
    AsyncStorage.getItem('state')
  ]).then(s => {
      if(s !== null){
        console.log('load store', s);
        return Promise.resolve(JSON.parse(s));
      }
      console.log('EMPTY: load store', s);
      return Promise.resolve(undefined);
    })
    .catch(e => {
      console.log('ERROR: load store', e);
      return Promise.resolve(undefined);
    });
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    AsyncStorage.setItem('state', serializedState);
  } catch (err) {
    console.log(err);
  }
};
