var selectMenu = $('#platformFilter');
var contestList = $('#fetchedList');

// for sorting variables
var sortTime = true;
var sortDate = true;

// to store all the fetched contests
const allContest = [];

// to track the current selected platform
var current="all";

//initial menu fetch and render
$.get("https://kontests.net/api/v1/sites", function (data) {

    let sites = data;

    for (let site of sites) {
        selectMenu.append('<option value="' + site[0] + '">' + site[0] + '</option>');
    }

});

//initial contests fetch and render
$.get("https://kontests.net/api/v1/all", function (data) {

    let contests = data;

    for(let contest of contests) {
        allContest.push(contest);
    }

    // console.log(allContest);

    // sort the fetched contests data by most recent first
    allContest.sort(function (a, b) {
        return a.start_time.localeCompare(b.start_time);
    });

    // Add to the frontend list div
    allContest.forEach((item) => {
        //prepare the url for the calender
        add_to_calendar = "https://calendar.google.com/event?action=TEMPLATE&dates=" + item.start_time + "/" + item.end_time + "&text=" + item.name + "&location=" + item.url;
        add_to_calendar = formatCalendarUrl(add_to_calendar);

        // append each contest to the list
        contestList.append(`<div class="item animate__animated animate__fadeInUp" data-time="${item.duration}" data-date="${item.start_time}">
        <div style="width:8%;box-sizing: border-box;" id="userlistdp">
        <a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page"><img src="/images/contestIcons/${item.site.replace(' ','_').replace('::','_')}.png"></img></a>
        </div>
        <div style="width:35%;text-align: left;" class="question"><a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page">${item.name}</a></div>
        <div style="width:20%">${localTimeFromUtc(item.start_time)}</div>
        <div style="width:18%">${durationToText(item.duration)}</div>
        ${item.status === 'CODING' ? '<div style="width:13%;background-color:#389810;padding:0.4rem 0rem;border-radius:10px;">Active</div>': item.in_24_hours === 'Yes' ? '<div style="width:13%;background-color:#1570FF;padding:0.4rem 0rem;border-radius:10px;">In Next 24Hrs</div>':'<div style="width:13%;background-color:#F97600;padding:0.4rem 0rem;border-radius:10px;">Coming up</div>'}
        ${item.status === 'BEFORE' ? `<div style="width:6%;"><a style="color:#6BAAED;" data-toggle="tooltip" data-placement="top" title="Add to Calendar" href="${add_to_calendar}" target="_blank"><i class="fa-solid fa-calendar-plus"></i></a></div>`:''}
        </div>`);
    });

});

// Now to change the data displayed according to the platform selected
$('#platformFilter').on('change',function(){

    // console.log(current);

    // check whether the selected is different from the current
    if(current!==this.value){
        // when we change the select menu and move to new page then sort variable reset to default to avoid multiple clicks
        sortTime = true;
        sortDate = true;

         // console.log(this.value);
        current=this.value;
        contestList.empty();

        // if wanted to render again the contests of all platforms
        if(current === "all"){
            allContest.forEach((item) => {
                add_to_calendar = "https://calendar.google.com/event?action=TEMPLATE&dates=" + item.start_time + "/" + item.end_time + "&text=" + item.name + "&location=" + item.url;
                add_to_calendar = formatCalendarUrl(add_to_calendar);
                contestList.append(`<div class="item animate__animated animate__fadeInUp" data-time="${item.duration}" data-date="${item.start_time}">
                <div style="width:8%;box-sizing: border-box;" id="userlistdp">
                <a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page"><img src="/images/contestIcons/${item.site.replace(' ','_').replace('::','_')}.png"></img></a>
                </div>
                <div style="width:35%;text-align: left;" class="question"><a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page">${item.name}</a></div>
                <div style="width:20%">${localTimeFromUtc(item.start_time)}</div>
                <div style="width:18%">${durationToText(item.duration)}</div>
                ${item.status === 'CODING' ? '<div style="width:13%;background-color:#389810;padding:0.4rem 0rem;border-radius:10px;">Active</div>': item.in_24_hours === 'Yes' ? '<div style="width:13%;background-color:#1570FF;padding:0.4rem 0rem;border-radius:10px;">In Next 24Hrs</div>':'<div style="width:13%;background-color:#F97600;padding:0.4rem 0rem;border-radius:10px;">Coming up</div>'}
                ${item.status === 'BEFORE' ? `<div style="width:6%;"><a style="color:#6BAAED;" data-toggle="tooltip" data-placement="top" title="Add to Calendar" href="${add_to_calendar}" target="_blank"><i class="fa-solid fa-calendar-plus"></i></a></div>`:''}
            </div>`);
            });
            return;
        }

        // to render the select platform contest
        allContest.forEach((item) => {
            add_to_calendar = "https://calendar.google.com/event?action=TEMPLATE&dates=" + item.start_time + "/" + item.end_time + "&text=" + item.name + "&location=" + item.url;
            add_to_calendar = formatCalendarUrl(add_to_calendar);
            contestList.append(`${item.site === current?`<div class="item animate__animated animate__fadeInUp" data-time="${item.duration}" data-date="${item.start_time}">
            <div style="width:8%;box-sizing: border-box;" id="userlistdp">
            <a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page"><img src="/images/contestIcons/${item.site.replace(' ','_').replace('::','_')}.png"></img></a>
            </div>
            <div style="width:35%;text-align: left;" class="question"><a href="${item.url}" target="_blank" data-toggle="tooltip" data-placement="top" title="Visit Contest Page">${item.name}</a></div>
            <div style="width:20%">${localTimeFromUtc(item.start_time)}</div>
            <div style="width:18%">${durationToText(item.duration)}</div>
            ${item.status === 'CODING' ? '<div style="width:13%;background-color:#389810;padding:0.4rem 0rem;border-radius:10px;">Active</div>': item.in_24_hours === 'Yes' ? '<div style="width:13%;background-color:#1570FF;padding:0.4rem 0rem;border-radius:10px;">In Next 24Hrs</div>':'<div style="width:13%;background-color:#F97600;padding:0.4rem 0rem;border-radius:10px;">Coming up</div>'}
            ${item.status === 'BEFORE' ? `<div style="width:6%;"><a style="color:#6BAAED;" data-toggle="tooltip" data-placement="top" title="Add to Calendar" href="${add_to_calendar}" target="_blank"><i class="fa-solid fa-calendar-plus"></i></a></div>`:''}
        </div>`:''}`);
        });

        // if contest list is empty after the render
        if(contestList.children().length==0){
            contestList.append(`
                <div class="empty-state">
                    <div class="empty-state__content animate__animated animate__pulse">
                      <div class="empty-state__icon">
                        <img src="/images/search-result-not-found-2130361-1800925.png" alt="no-result-found">
                      </div>
                      <div class="empty-state__message">No contest available on this platform.</div>
                      <div class="empty-state__help">
                        Don't stop here! Look for contests on other platforms using the above menu.
                      </div>
                    </div>
                </div>`);
        }
        return;
    }

});

function sortByTime(){

    contestList.children().sort(function (a, b) {
            if(sortTime){
                return parseInt(a.dataset.time)-(parseInt(b.dataset.time));
            }else{
                return parseInt(b.dataset.time)-(parseInt(a.dataset.time));
            }
    }).appendTo(contestList);

    sortTime=!sortTime;
}

function sortByDate(){
    contestList.children().sort(function (a, b) {
            if(sortDate){
                // because render is already sorted by latest first
                return b.dataset.date.localeCompare(a.dataset.date);
            }else{
                return a.dataset.date.localeCompare(b.dataset.date);
            }
    }).appendTo(contestList);

    sortDate = !sortDate;
}

// NECESSARY FUNCTIONS

// to modify the url to make it workable for the google calender
  function formatCalendarUrl(url) {
    url = url.slice(0, 60) + url.slice(61, 63) + url.slice(64, 69) + url.slice(70, 72) + url.slice(73, 75) + url.slice(79);
    url = url.slice(0, 77) + url.slice(78, 80) + url.slice(81, 86) + url.slice(87, 89) + url.slice(90, 92) + url.slice(96);
    text_index = url.indexOf('&text=') + 6;
    location_index = url.indexOf('&location=');
    name = url.slice(text_index, location_index);
    name = name.replace('#', '%23');
    name = name.replace('&', '%26');
    name = name.replace('+', '%2B');
    name = name.replace('?', '%3F');
    url = url.slice(0, text_index) + name + url.slice(location_index);
    return url;
  }

//  to convert the utc time to local time
  function localTimeFromUtc(utcTime) {
    if(utcTime === '-') return '-';
  
    var givenDate = new Date(utcTime);
    var localDateString = DateFormat.format.date(givenDate, 'dd MMM yyyy HH:mm');
    return localDateString;
  }

//to get duration as string in days hrs and min format from seconds
  function durationToText(duration) {
    if(duration === '-') return '-';
  
    seconds = parseInt(duration);
  
    days = Math.floor(seconds / (24 * 60 * 60));
    days_s = 'days';
    if(days == 1) days_s = 'day';
    seconds %= (24 * 60 * 60);
  
    hours = Math.floor(seconds / (60 * 60));
    hours = ('0' + hours).slice(-2);
    seconds %= (60 * 60);
  
    minutes = Math.floor(seconds / 60);
    minutes = ('0' + minutes).slice(-2);
  
    if(days > 0)
      return `${days} ${days_s} and ${hours}:${minutes}`;
    else
      return `${hours}:${minutes}`;
  }
  

// // To reverse the data accoring to duration
// var sortBytime = true;
// function sortByTime(){
//     $('#fetchedList > div').detach().sort(function (a, b) {
//         var contentA = parseInt($(a).data('time'));
//         var contentB = parseInt($(b).data('time'));
//         if(sortBytime){
//             return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
//         }else{
//             return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0;
//         }
        
//     }).appendTo('#fetchedList');
//     sortBytime= !sortBytime;
// }
$('[data-toggle="tooltip"]').tooltip()