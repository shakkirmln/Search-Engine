var pageData = [
  {
    "Page 1 title": [
      {
        "Section 1 tile": "Section 1 content",
      },
      {
        "Section 2 tile": "Section 2 content",
      },
    ],
  },
  {
    "Page 2 title": [
      {
        "Section 1 tile": "Section 1 content",
      },
      {
        "Section 2 tile": "Section 2 content",
      },
    ],
  },
];

var pages = [];
var cont = [];
var subcont = [];
var matches = {};

for (var i in pageData) {
  var pageKey = Object.keys(pageData[i])[0];
  console.log(pageKey);
  for (var j in pageData[i][pageKey]) {
    var sectionKey = Object.keys(pageData[i][pageKey][j])[0];
    console.log(sectionKey);
    console.log(pageData[i][pageKey][j][sectionKey]);
  }
}

$(document).ready(function () {
  for (var i in pageData) {
    var pageKey = Object.keys(pageData[i])[0];
    var htmlData = `<h1>${pageKey}</h1>`;
    for (var j in pageData[i][pageKey]) {
      var sectionKey = Object.keys(pageData[i][pageKey][j])[0];
      htmlData += `<h2>${sectionKey}</h2>`;
      htmlData += `<p>${pageData[i][pageKey][j][sectionKey]}</p>`;
      cont.push(pageData[i][pageKey][j][sectionKey]);
      subcont.push({ [pageKey]: sectionKey });
    }
    pages.push({ [pageKey]: htmlData });
  }

  function element(id) {
    return document.getElementById(id);
  }
  let allSearchData = ""; //decleared to collect all search names

  //gets each inputs data starting from second input
  function getResults() {
    //gets value of input
    let search = element("search-input").value;
    allSearchData = ""; //clears data for each word typed
    matches = {}; //clears matches for each word typed

    hideSearchResults();
    clearSearchResults();
    clearSearchData(); //
    //starts searching from the second input
    if (search.length > 1) {
      let counter = 0; // counts to 10
      for (var i = 0; i < cont.length; i++) {
        // if (counter < 10) {
        //   var x = cont[i];
        //   //checks for similarities
        //   if (x.toLowerCase().includes(search.toLowerCase())) {
        //     //populates the suggestion div
        //     element("search-results").innerHTML +=
        //       "<div class='search-item' onclick='displayData(\"" +
        //       x +
        //       "\")'><p>" +
        //       x +
        //       "</p></div>";

        //     counter++;
        //   }
        // }
        if (cont[i].toLowerCase().includes(search.toLowerCase())) {
          //saves all the realated names
          var pageTitle = Object.keys(subcont[i])[0];
          if (typeof matches[pageTitle] !== "undefined") {
            matches[pageTitle].push({ [subcont[i][pageTitle]]: cont[i] });
            // allSearchData +=
            //   "<div id='pageid' onclick='getSectionList(\"" +
            //   pageTitle +
            //   "\")'><p>" +
            //   pageTitle +
            //   "</p></div>";

            allSearchData +=
              "<div class='pageid' id='" +
              pageTitle +
              "'><p><u>" +
              pageTitle +
              "</u></p></div>";
          } else matches[pageTitle] = [{ [subcont[i][pageTitle]]: cont[i] }];
        }
      }
      // element("search-data").innerHTML = allSearchData;

      // var ary = Array.prototype.slice.call(
      //   document.querySelectorAll(".pageid")
      // );
      // ary.forEach(function (el) {
      //   // Callbacks are passed a reference to the event object that triggered the handler
      //   el.addEventListener("click", function (evt) {
      //     // The this keyword will refer to the element that was clicked
      //     console.log(this.id, el);
      //   });
      // });
      console.log(matches);
      displaySearchResults();
    }
  }

  //displays the suggestion div
  function displaySearchResults() {
    element("search-results").style.display = "block";
  }
  //clears the suggestion div
  function clearSearchResults() {
    element("search-results").innerHTML = "";
  }

  //hides the suggestion div
  function hideSearchResults() {
    element("search-results").style.display = "none";
  }
  //displays names when you click a suggestions
  function displayData(name) {
    element("search-data").innerHTML = "<p>" + name + "</p>";
    hideSearchResults();
  }

  function getSectionList(zEvent) {
    allSearchData = ""; //clears data for each word typed
    console.log("here");
    var pageTitle = this.id;
    console.log(pageTitle);
    for (var i = 0; i < matches[pageTitle].length; i++) {
      var sectionTitle = Object.keys(matches[pageTitle][i])[0];
      allSearchData +=
        "<div class='sectionid' id='" +
        sectionTitle +
        "' pgid='" +
        pageTitle +
        "' idx='" +
        i +
        "'><p><u>" +
        sectionTitle +
        "</u></p></div>";
    }
    displayAllData(allSearchData);
  }

  function getContentList(zEvent) {
    allSearchData = ""; //clears data for each word typed
    console.log("here2");
    var sectionTitle = this.id;
    var pageTitle = this.getAttribute("pgid");
    console.log(sectionTitle + " " + pageTitle);
    var i = this.getAttribute("idx");
    var content = matches[pageTitle][i][sectionTitle];
    allSearchData += "<div class='contentid'><p>" + content + "</p></div>";
    displayAllData(allSearchData);
  }

  //displays all related names to your search when you hit enter
  function displayAllData(names) {
    element("search-data").innerHTML = names;
    hideSearchResults();
    $(".pageid").click(getSectionList);
    $(".sectionid").click(getContentList);
  }
  //clears names displayed from search result
  function clearSearchData() {
    element("search-data").innerHTML = "";
  }
  //gets results after each input
  element("search-input").oninput = function () {
    getResults();
  };

  // element("pageid").addEventListener("click", function () {
  //   console.log("here");
  //   getSectionList(pageTitle);
  // });

  element("search-input").addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      displayAllData(allSearchData);
    }
  });
});
