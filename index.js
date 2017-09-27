const cheerio = require('cheerio')
const request = require('request');
var wait = require('wait.for');
var fs = require('fs');
var stream = fs.createWriteStream("my_file.txt");

function trim(elm)
{
    return elm.text().replace(/(\r\n|\n|\r)/gm, '').trim();
}

function getData(start, callback) {

    request.get('https://www.computerworld.dk/modules/brancheguide/person_list.php?op=list&start='+start+'&limit=100&q_person=&company=&type=&categoryid=', function (err, req, body) {
        var $ = cheerio.load(body);
       
            console.log('h')

            $('.row').each((i, e) => {
                var row = $(e);
                var desc = $('.text > a',row);
                var date = $('.date',row);
                var title = $('.title > a', row)
                var t = '"'+ trim(title.eq(0))+'","' + trim(title.eq(1)) + '","'+ trim(date) + '","' + trim(desc)+'"\r\n';
                console.log(t);
                stream.write(t);
            })
            
            callback(null, true);
        

    });
}



function start() {
    for (var i = 0; i < 600; i++) {
        wait.for(getData, i * 100 + 1);
    }
    stream.end();
}
wait.launchFiber(start);

//=> <h2 class="title welcome">Hello there!</h2>