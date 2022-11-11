// const query = "hello";

const searchBoxElem = document.getElementById("query");
const resultsContainerElem = document.getElementById("results");

// when someone presses enter in the search box,
searchBoxElem.addEventListener("keydown", whenSomeKeyPressed);

function whenSomeKeyPressed(event) {
  
  if (event.key === "Enter") {
    event.preventDefault();
    searchForRhymes(searchBoxElem.value).then((rhymes) => {
      const rhymeElements = createRhymeElements(rhymes).then((rhymeElements) => {
        clearResultsElem();
        populateResultsElem(rhymeElements);
      });
    });
  }
}

function searchForRhymes(query) {
  return fetch(
    `https://rhymebrain.com/talk?function=getRhymes&word=${query}`
  ).then(function (response) {
    return response.json().then( (jsonVal) => {
      const truncatedTo10 = jsonVal.slice(0, 10);
      console.log(truncatedTo10);
      return truncatedTo10;
    });
  });
}

function createRhymeElements(rhymeResultsJson) {
  return getWordsInfos(rhymeResultsJson).then((info) => {
    return rhymeResultsJson.map((rhymeWord, i) => {
      let resultElem = document.createElement("div");
      resultElem.classList.add("result");
      resultElem.dataset.score = rhymeWord.score;
      resultElem.append(rhymeWord.word);
      resultElem.append(createWordInfoElements(info[i]));
      resultElem = styleRhymeResult(resultElem);
      return resultElem;
    });
  });

}

function getWordsInfos(rhymes) {
  return Promise.all(
    rhymes.map( (rhyme) => {
      return fetch(
        `https://rhymebrain.com/talk?function=getWordInfo&word=${rhyme.word}`
      ).then((wordInfo) => {
        return wordInfo.json().then((wordInfoJson) => {
          return wordInfoJson;
        });
      });
    })
  ).then((wordsInfos) => {
    return wordsInfos;
  });
}

function createWordInfoElements(wordInfo) {
  const wordInfoElem = document.createElement("dl");
  for (const [key, value] of Object.entries(wordInfo)) {
    const dt = document.createElement("dt");
    dt.append(key);
    const dd = document.createElement("dd");
    dd.append(value);
    wordInfoElem.append(dt);
    wordInfoElem.append(dd);
  }
  return wordInfoElem;
}

function styleRhymeResult(resultElem) {
  const styledResult = resultElem;
  const resultScore = parseInt(resultElem.dataset.score, 10);
  styledResult.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
  return styledResult;
}

function clearResultsElem() {
  Array.from(resultsContainerElem.childNodes).forEach((child) => {
    child.remove();
  });
}

function populateResultsElem(rhymeResultsElems) {
  resultsContainerElem.append(...rhymeResultsElems);
}
