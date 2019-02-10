// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('serviceWorker.js', { scope: '/' }).then(function(reg) {
//         console.log('Registration succeeded. Scope is ' + reg.scope);
//     }).catch(function(error) {
//
//         console.log('Registration failed with ' + error);
//     });
// }


let intervalNotify;
let conferenceList = fillConferenceList();


Date.prototype.withoutTime = function () {
    let d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

let now = new Date().withoutTime();

$('select').on('change', function () {
    let day = $(this).val();
    let id = $(this).closest('.conference').attr('id');


    conferenceList.filter(function (item) {
        if (item.id === id) {
            item.dayInterval = day;
            return item;

        }
    });
    workConferenceItems(conferenceList)


});


function addConference(conferenceList, conferenceItem) {

    conferenceList.push(conferenceItem);
    return conferenceList;
}

function differenceInDays(date1, date2) {
    let dayConference = date1.match(/\d{1,2}/g, '')[0];
    let monthConference = date1.replace(/[^a-zA-Z]/gi, '');

    let dateConf = new Date(`${monthConference} ${dayConference} ${now.getFullYear()}`);

    function getDateAgo(date, days) {
        let dateCopy = new Date(date);
        dateCopy.setDate(dateCopy.getDate() - days);
        return dateCopy;
    }

    return getDateAgo(dateConf, date2).withoutTime();

}

function fillConferenceItem(element) {
    let idConference = $(element).attr('id');
    let dateConference = $(element).find('.conference-date').text();
    let placeConference = $(element).find('.conference-place').text();
    let nameConference = $(element).find('.conference-name').text();


    return {
        id: idConference,
        name: nameConference,
        place: placeConference,
        date: dateConference,
        dayInterval: ''
    };

}


function fillConferenceList() {

    let conferenceList = [];

    $('.conference').each(function () {

        let conferenceItem = fillConferenceItem(this);
        addConference(conferenceList, conferenceItem);
    });

    return conferenceList;
}


function filterItems(id, date) {
    let dayConference = date.match(/\d{1,2}/g, '')[0];
    let monthConference = date.replace(/[^a-zA-Z]/gi, '');

    let dateConf = new Date(`${monthConference} ${dayConference} ${now.getFullYear()}`);


    if ((dateConf.getMonth() <= now.getMonth()) && (dateConf.getDate() <= now.getDate())) {
        let parentSelect = $('#' + id).find('.conference-notify');
        parentSelect.children('select').remove();


        if ((dateConf.getMonth() === now.getMonth()) && (dateConf.getDate() === now.getDate())) {
            parentSelect.append("<span>Мероприятие cегодня...</span>");
        } else {
            parentSelect.append("<span>Мероприятие уже прошло...</span>");
        }


    }
    return dateConf;

}

workConferenceList(conferenceList)
//недоработано
function workConferenceItems(conferenceList) {


    conferenceList.forEach(function (item) {
        if (item.dayInterval) {
            let dateNotify = differenceInDays(item.date, item.dayInterval);
            if (+dateNotify === +now) {
                let serialObj = JSON.stringify(item);  //тест хранения

                localStorage.setItem("Conference", serialObj);
                notifyMe(item);
                let conferenceData = JSON.parse(localStorage.getItem("Conference"));
                if (localStorage.getItem('Conference')) {
                    $('#' + conferenceData.id).find('.conference-name').text('Hello from local storage');
                }
            }

        }

    });

}




function workConferenceList(conferenceList) {


    conferenceList.forEach(function (item) {
        let dateConf = filterItems(item.id, item.date);
    });

}


function notifyMe(data) {


    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === "granted") {
        // Если разрешено, то создаем уведомление
        let notification = new Notification(`${data.name} conference\n${data.place}\n${data.date}\nЧерез ${data.dayInterval} дня(ей)`);
    }

    // В противном случае, запрашиваем разрешение
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Если пользователь разрешил, то создаем уведомление
            if (permission === "granted") {
                let notification = new Notification("Hi there!");
            }
        });
    }

    // В конечном счете, если пользователь отказался от получения
    // уведомлений, то стоит уважать его выбор и не беспокоить его
    // по этому поводу.
}

