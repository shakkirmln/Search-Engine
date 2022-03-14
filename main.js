// NOTE: Page title should be unique. And inside a page section title should be unique.
var pageData = [
  {
    "Page 1 title": [
      {
        "Section 1 tile": "abb Section 1 content sec2  abb",
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
        "Section 2 tile": "Section 2 content sec 2",
      },
    ],
  },
  {
    "Page 3 title": [
      {
        "Section 1 tile": "Section 1 content",
      },
      {
        "Section 2 tile": "Section 2 content sec 2",
      },
    ],
  },
  {
    "Page 4 title": [
      {
        "Section 4 tile": "Section 1 content",
      },
      {
        "Section 2 tile": "Section 2 content sec 2",
      },
    ],
  },
];

var sectionContentArray = []; // array to hold section content (Cannot make it as key value pair as there may be multiple sections with same content)
var sectionContentMap = []; // [{pageTitle: sectionTitle}] index corresponding to sectionContentArray
var matches = {}; // searchquery matched sectionContent stored in the form - {pageTitle: [{sectionTitle: sectionContent}]}

$(document).ready(function () {
  for (var i in pageData) {
    var pageTitle = Object.keys(pageData[i])[0];
    for (var j in pageData[i][pageTitle]) {
      var sectionTitle = Object.keys(pageData[i][pageTitle][j])[0];
      var sectionContent = pageData[i][pageTitle][j][sectionTitle];
      sectionContentArray.push(sectionContent);
      sectionContentMap.push({ [pageTitle]: sectionTitle });
    }
  }

  function element(id) {
    return document.getElementById(id);
  }

  let allSearchData = ""; //decleared to collect all search names

  function getHighlightedData(searchStr, str) {
    var searchStrLen = searchStr.length;
    var updatedStr = "";
    if (searchStrLen == 0) {
      return [];
    }
    var startIndex, index, lowerStr, lowerSearchStr;
    startIndex = 0;
    lowerStr = str.toLowerCase();
    lowerSearchStr = searchStr.toLowerCase();
    while ((index = lowerStr.indexOf(lowerSearchStr, startIndex)) > -1) {
      updatedStr +=
        str.slice(startIndex, index) +
        "<mark>" +
        str.slice(index, index + searchStrLen) +
        "</mark>";
      startIndex = index + searchStrLen;
    }
    updatedStr += str.slice(startIndex);
    return updatedStr;
  }

  function getContentList() {
    let search = element("search-input").value;
    allSearchData = ""; //clears data for each word typed
    var i = this.getAttribute("idx");
    var pageTitle = this.getAttribute("pgid");
    var sectionTitle = this.id;
    var sectionContent = matches[pageTitle][i][sectionTitle];
    var content = getHighlightedData(search, sectionContent);
    allSearchData += "<div class='contentid'><p>" + content + "</p></div>";
    displayAllData(allSearchData);
  }

  function getSectionList() {
    allSearchData = ""; //clears data for each word typed
    var pageTitle = this.id;
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

  function getPageList() {
    let search = element("search-input").value; //gets value of input
    allSearchData = ""; //clears data for each word typed
    matches = {}; //clears matches for each word typed

    clearSearchData(); //clears previous search results

    //starts searching for matches
    if (search.length >= 1) {
      for (var i = 0; i < sectionContentArray.length; i++) {
        if (
          sectionContentArray[i].toLowerCase().includes(search.toLowerCase())
        ) {
          //saves all matching contents
          var pageTitle = Object.keys(sectionContentMap[i])[0];
          var sectionTitle = sectionContentMap[i][pageTitle];
          var sectionContent = sectionContentArray[i];

          //if page title is in matches
          if (typeof matches[pageTitle] !== "undefined")
            matches[pageTitle].push({ [sectionTitle]: sectionContent });
          else {
            matches[pageTitle] = [{ [sectionTitle]: sectionContent }];
            //inserting page title in the list
            allSearchData +=
              "<div class='pageid' id='" +
              pageTitle +
              "'><p><u>" +
              pageTitle +
              "</u></p></div>";
          }
        }
      }
    }
  }

  //displays all related names to your search when you hit enter
  function displayAllData(names) {
    element("search-data").innerHTML = names;
    $(".pageid").click(getSectionList); //binds click event to page titles
    $(".sectionid").click(getContentList); //binds click event to section titles
  }

  //clears names displayed from search result
  function clearSearchData() {
    element("search-data").innerHTML = "";
  }

  //gets results after each input
  element("search-input").oninput = function () {
    getPageList();
  };

  element("search-input").addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault(); // Cancel the default action, if needed
      displayAllData(allSearchData); // Trigger the button element with a click
    }
  });
});
