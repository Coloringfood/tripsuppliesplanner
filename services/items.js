module.exports = items = {};
import * as Promise from 'bluebird';

items.getAllItems = () => {
    return Promise.resolve([
        "test",
        "test2"
    ])
};

items.addItem = (item) => {
    return Promise.resolve(item)
};

items.updateItem = (id, item) => {
    return Promise.resolve(item);
};

items.deleteItem = (id) =>{
    return Promise.resolve("removed id: " + id)
};