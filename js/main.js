var languages = ['en', 'fr'];
var langIdx = 0;

var days = {
    'Today': 'today',
    'Tomorrow': 'tomorrow'
};

var dayMode = 'Today';

var roomToKey = {
    'glass door room': 'glassdoor',
    'glass door': 'glassdoor',
    'glassdoor': 'glassdoor',
    'bigroom': 'bigroom',
    'big room': 'bigroom',
    'osmocafe': 'osmocafe',
    'osmo cafe': 'osmocafe',
    'cafe': 'osmocafe',
    'café	': 'osmocafe',
    '3rd floor': 'floor3'
};

var floorFromRoom = {
    'floor1': { regex: /(1[0-9][0-9])/ },
    'floor2': { regex: /(2[0-9][0-9])/ },
    'fh-floor1': { regex: /1|2|3/ },
    'fh-floor2': { regex: /4|5|6/ }
}

var strings = {
    en: {
        "room-alloffices": 'all offices',
        "room-bigroom": 'big room',
        "room-glassdoor": 'glass door',
        "room-washroom": 'washrooms',
        "room-osmocafe": 'osmo café',
        "room-floor3": '3rd floor',

        "events-heading-today": "Events on Today",
        "events-heading-tomorrow": "Events on Tomorrow",

        "room-alloffices-long": 'all offices',
        "room-bigroom-long": 'big room',
        "room-glassdoorroom-long": 'glass door room',
        "room-washroom-long": 'washrooms',
        "room-osmocafe-long": 'osmo café',
        "room": 'room',
        "office": 'office',

        "directions-bigroom": "3rd floor, go up stairs through door way to the right.",
        "directions-glassdoor": "3rd floor, go up stairs through door way to the right.",
        "directions-osmocafe": "This floor, behind you.",
        "directions-floor1": "1st floor, go up stairs through door way to the right.",
        "directions-floor2": "2nd floor, go up stairs through door way to the right.",
        "directions-floor3": "3rd floor, go up stairs through door way to the right.",
        "directions-fh-floor1": 'Front house, 1st floor, go up stairs through door way to the right.',
        "directions-fh-floor2": 'Front house, 2nd floor, go up stairs through door way to the right.',

        "noevents-today": "No events today",
        "noevents-tomorrow": "No events tomorrow"
    },
    fr: {
        "room-alloffices": 'bureaux',
        "room-bigroom": 'grande salle',
        "room-glassdoor": 'porte vitré',
        "room-washroom": 'toilettes',
        "room-osmocafe": 'café osmo',
        "room-floor3": '3ieme étage',

        "room-alloffices-long": 'bureaux',
        "room-bigroom-long": 'la grande salle',
        "room-glassdoorroom-long": 'la salle à la porte vitré',
        "room-washroom-long": 'toilettes',
        "room-osmocafe-long": 'café osmo',

        "events-heading-today": 'Evénements aujourd\'hui',
        "events-heading-tomorrow": 'Evénements demain',

        "directions-bigroom": "Au 3ieme étage, par la porte à droite.",
        "directions-glassdoor": "Au 3ieme étage, par la porte à droite.",
        "directions-osmocafe": "Derrière vous, à cet étage",
        "directions-floor3": "Au 3ieme étage, par la porte à droite.",

        "directions-floor1": "Au 1iere étage, par la porte à droite.",
        "directions-floor2": "Au 2ieme étage, par la porte à droite.",
        "directions-fh-floor1": '\'Front House\', Au 1iere étage, par la porte à droite.',
        "directions-fh-floor2": '\'Front House\', Au 2ieme étage, par la porte à droite.',
        "room": 'salle',
        "office": 'bureau',
        "noevents-today": "Aucun événements aujourd\'hui",
        "noevents-tomorrow": "Aucun événements aujourd\'hui"
    }
}

function getNormalisedRoomRef(roomRef) {
    if (roomToKey[roomRef]) {
        return roomToKey[roomRef];
    } else if (roomRef) {
        var floor;
        for (floor in floorFromRoom) {
            var rules = floorFromRoom[floor];
            if (rules.regex && roomRef.match(rules.regex)) {
                return roomRef.match(rules.regex)[0];
            }
        }
        return roomRef.replace(/ /, '');
    }
    return undefined;
}

function getDirections(roomRef) {
    var key = 'directions-' + roomRef;
    var text = getText(key);
    var floor;

    if (text === key) {
        text = 'unknown';
        for (floor in floorFromRoom) {
            var rules = floorFromRoom[floor];
            if (rules.regex && roomRef.match(rules.regex)) {
                text = getText('directions-' + floor);
                break;
            }
        }
    }
    return text;
}

function getRoomLabel(roomRef) {
    var label = getText(roomRef);
    if (!label) {
        label = roomRef;
    }

    if (roomRef.match(/.*\-([0-9]+)/)) {
        var room = roomRef.match(/([0-9])+/)[0]
        label = getText('office') + ' ' + room;
    }

    return label;
}

function getText(key) {
    var lang = languages[langIdx];
    if (strings[lang][key]) {
        return strings[lang][key];
    } else {
        return key;
    }
}

function updateDate() {
    $('.date').html(moment().format('DD MMMM YYYY'));
}

function updateTime() {
    $('.time').html(moment().format('HH:mm'));
}

/**
 * Handle which day we display. Most of the time it will be
 * 'Today', though after a certain hour we display 'Tomorrow'.
 */
function updateDayMode() {
    if (new Date().getHours() >= 22) {
        dayMode = 'Tomorrow';
    } else {
        dayMode = 'Today';
    }
}

function switchLocale() {
    langIdx++;
    if (langIdx >= languages.length) {
        langIdx = 0;
    }
    moment.locale(languages[langIdx]);

    var lang = languages[langIdx];

    updateDate();
    updateDayMode();

    var i, key;
    var events = $('.events li');
    for (i = 0; i < events.length; i++) {
        key = events[i].className;
        roomLabel = getRoomLabel('room-' + key)

        $('.roomlabel', events[i]).html(roomLabel);
        $('.roomdirections', events[i]).html(getDirections(key));
    }

    console.log('===', 'events-heading-' + days[dayMode]);
    $('.events h1').html(strings[lang]['events-heading-' + days[dayMode]]);

    $('#allrooms .alloffices').html(getText('room-alloffices-long'));
    $('#allrooms .bigroom').html(getText('room-bigroom-long'));
    $('#allrooms .glassdoorroom').html(getText('room-glassdoorroom-long'));

    $('.noevents').html(getText('noevents-' + days[dayMode]));
}

function toISODate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function normalizeRoomName(room) {

}

function renderEvent(event) {
    var roomClass = '';
    var roomName = event.room;
    var roomdirections = '';

    var roomLabel = '';
    var roomRef = event.room;

    var normalisedRoomRef = getNormalisedRoomRef(roomRef);
    roomLabel = getRoomLabel('room-' + normalisedRoomRef)

    var html = '<li class="' + normalisedRoomRef + '">';
    html += '<div class="roomlabel"> ' + roomLabel + '</div>';
    html += '<div class="details">';
    html += '<span class="eventtime">' + event.start + '</span><span class="eventtitle">' + event.title + '</span>';
    html += '<span class="roomdirections">' + getDirections(normalisedRoomRef) + '</span>';
    html += '</li>';
    return html;
}

function renderEvents(events) {
    //var isoDate = toISODate(new Date());
    $('.events ul').html('');

    var html = '';
    var foundEvents = false;
    if (events) {
        events.forEach(function(day) {
            var i;
            var items;
            if (day.day === dayMode) {
                items = day.items;
                for (i = 0; i < items.length; i++) {
                    html += renderEvent(items[i]);
                    foundEvents = true;
                }
            }
        });
    }

    if (!foundEvents) {
        html = '<p class="noevents">' + getText('noevents-' + dayMode) + '</p>';
    }

    $('.events ul').html(html);
}

function updateEvents() {
    fetch('https://notman.herokuapp.com/api/events?24hour=1').then(function(response) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
                renderEvents(json);
            });
        } else {
            console.log("Oops, we haven't got JSON!");
        }
    });

}

$(document).ready(function() {
    updateEvents();
    updateDayMode();

    setInterval(updateTime, 1000);
    setInterval(updateDate, 1000);
    setInterval(switchLocale, 5000);
    // every 30 minutes
    setInterval(updateEvents, 60000 * 30);
});