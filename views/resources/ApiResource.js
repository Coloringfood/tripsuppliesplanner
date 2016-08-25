var url = 'http://localhost:3000/v1';

var ApiResource = {
    call: (path, method, header, body) => {
        header = header || {};
        var options = {
            method: method || 'GET',
            headers: header,
            body: JSON.stringify(body)
        };
        options.headers['Content-Type'] = "application/json";
        console.log(options);
        var uri = url + path;
        return fetch(uri, options)
            .then(result => {
                if (result.ok) {
                    return result.json()
                } else { // response wasn't successful so dispatch an error
                    return result.json().then((err) => {
                        dispatch({
                            type: 'ERROR_RECIPE',
                            message: err.reason,
                            status: err.status
                        });
                    });
                }
                return result.json();
            }).catch((er) => {
                // Runs if there is a general JavaScript error.
                dispatch(error('There was a problem with the request.'));
            });
    }
};

/*fetch('/recipes', {
 method: 'POST',
 headers: {
 'Accept': 'application/json',
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 recipeName,
 instructions,
 ingredients
 })
 }).then((res) => {
 // If response was successful parse the json and dispatch an update
 if (res.ok) {
 res.json().then((recipe) => {
 dispatch({
 type: 'UPDATE_RECIPE',
 recipe
 });
 });
 } else { // response wasn't successful so dispatch an error
 res.json().then((err) => {
 dispatch({
 type: 'ERROR_RECIPE',
 message: err.reason,
 status: err.status
 });
 });
 }
 });*/

module.exports = ApiResource;