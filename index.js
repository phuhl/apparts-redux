import { applyMiddleware, createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";

const configureStore = (
  substores = {},
  middlewares = [],
  persistConfig = {
    key: "root",
    storage,
    blacklist: [],
  }
) => {
  middlewares.push(thunk);

  const middlewareEnhancer = applyMiddleware(...middlewares);

  persistConfig = { blacklist: [], ...persistConfig };
  const stores = {};
  const actionNames = [];

  const types = {};

  for (const substoreKey in substores) {
    const substore = substores[substoreKey];
    if (substore.blacklisted) {
      persistConfig.blacklist.push(substoreKey);
    }
    stores[substoreKey] = substore.reducer(types);
    actionNames.push(substore.actionNames);
  }

  // check, that action names are unique
  actionNames.forEach((ans) =>
    ans.forEach((actionName) => {
      if (typeof actionName !== "string") {
        throw new Error(
          "ERROR, some action-names are not strings! " + JSON.stringify(ans)
        );
      }
      types[actionName] = { name: actionName };
    })
  );

  if (
    Object.keys(types).length !==
    actionNames.reduce((a, b) => a + Object.keys(b).length, 0)
  ) {
    throw new Error(
      "ERROR, not all action-names are unique! " +
        JSON.stringify(actionNames) +
        JSON.stringify(types)
    );
  }

  const store = createStore(
    persistReducer(persistConfig, combineReducers(stores)),
    middlewareEnhancer
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
