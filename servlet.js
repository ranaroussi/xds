(function(_$xds, undefined) {

    // -------------------------
    // don't work outside of iframe or in msie 6/7
    if (
        top === self ||
        window.parent === undefined ||
        navigator.appVersion.indexOf("MSIE 6.")  !== -1 ||
        (navigator.appVersion.indexOf("MSIE 7.") !== -1 && navigator.appVersion.indexOf("NT 6.1") === -1)
    ) {
        return;
    }

    var origin = window.parent || undefined;
    _$xds.postMessage = function(message) {
        if (typeof(message) === typeof({})) {
            message = JSON.stringify(message);
        }
        window.parent.postMessage(message, origin);
    };

    // -------------------------
    // don't work if no referrer (direct access)
    if (document.referrer === "") return;

    // -------------------------
    // listen to parent (receive objects)
    var eventMethod  = window.addEventListener ? "addEventListener" : "attachEvent";
    var messageEvent = window.addEventListener ? "message" : "onmessage";
    var eventObject  = window[eventMethod];
    eventObject(messageEvent, function(event) {

        // -------------------------
        // parse sender's origin
        var parentOrigin = document.referrer.split("://");
            parentOrigin = parentOrigin[0]+"://"+parentOrigin[1].split("/")[0];

        // -------------------------
        // allow from parent iframe
        if (event.origin !== parentOrigin) { return; }

        // -------------------------
        // set global origin
        origin = event.origin;

        // -------------------------
        // verify that sent data is valid
        var validData = (typeof(event.data) !== typeof(undefined) && event.data !== "" && event.data !== null);
        if (!validData) { return; }

        // try parsing the message
        var data = event.data;
        try {
            // parse stringified jsons
            if (typeof(event.data) === typeof("string") && event.data.indexOf("{") !== -1) {
                data = JSON.parse(data);
            }
        } catch (err) {
            // something went wrong...
            servlet.debug(err.name + ": " + err.message);
            return;
        }

        console.debug('servlet received:', data);

        /*
        // do json stuff
        if (typeof(data) === typeof({})) {
            for (var index in data) {
                if (index == "whatever") {
                    // do this...
                }
                // ...
            }
        }
        */

    }, false);
}(window._$xds = window._$xds || {}));