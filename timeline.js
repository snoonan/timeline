const csvStringToArray = (strData, header=true) =>
{
      const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"((?:\\\\.|\"\"|[^\\\\\"])*)\"|([^\\,\"\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ?
            arrMatches[2].replace(new RegExp( "[\\\\\"](.)", "g" ), '$1') :
            arrMatches[3]);
    }
    if (header) {
        hData = arrData.shift();
        hashData = arrData.map(row => {
            let i = 0;
            return hData.reduce(
                (acc, key) => {
                    acc[key.trim()] = row[i++];
                    return acc;
                },
                {}
            );
        });
        return hashData;
    } else {
        return arrData;
    }
}
var allSeries = []
// read csv (/sheets/...) file into object array.  Includes date parsing to normalize into 'date_start' and 'date_end'
const newseries = (seriesString) =>
{

  var series = csvStringToArray(seriesString);

  allSeries.push(series);
  render(allSeries);
}

const render = (series) =>
{
  var range = allSeries[0][allSeries[0].length - 1]['date'] - allSeries[0][0]['date'] + 1;
  var start = allSeries[0][0]['date'];

  var root = document.getElementById('timeline');
  grid = document.createElement('div');
  grid.style.display='grid';
  //grid.style.gridTemplateColumns='1fr 5fr';
  grid.style.gridTemplateRows='repeat('+range+', 1fr)';

  allSeries.forEach((series) => {
  series.forEach((entry) => {
    var eventDate = entry['date'];
    var eventDoc = entry['what'];

    var elDate = document.createElement('div');
    elDate.innerText = eventDate;
    elDate.style.gridRow = eventDate - start + 1;
    elDate.style.gridColumn = 1;

    var elDoc  = document.createElement('div');
    elDoc.innerText = eventDoc;
    elDoc.style.gridRow = eventDate - start + 1;
    //elDoc.style.gridColumn = 2;

    grid.append(elDate);
    grid.append(elDoc);
  });
  });
  root.append(grid)
}
// calc limits across all (selected) objects
// if > 2000, use log scale
// make div with positions for each entry in each object, position with flex grid (large one)
// force timeline markers in on ocassion (range/10, round to 1 sigfig
// (floating?) selector for objects
// item blob is all object fields (maybe some filters here?)

// deal with overloaded locations
