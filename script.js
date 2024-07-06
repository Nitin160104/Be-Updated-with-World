const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

let isHindi = false;
let notes = [];

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query, language = "en") {
    const res = await fetch(`${url}${query}&language=${language}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");
    const addToNotesButton = cardClone.querySelector(".add-to-notes-button");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });

    addToNotesButton.addEventListener("click", () => {
        addToNotes(article);
    });
}

function addToNotes(article) {
    notes.push(article);
    alert("Article added to notes!");
}

function viewNotes() {
    bindData(notes);
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id, isHindi ? "hi" : "en");
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query, isHindi ? "hi" : "en");
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

const hindiButton = document.getElementById("hindi-button");

hindiButton.addEventListener("click", () => {
    toggleLanguage();
});

function toggleLanguage() {
    isHindi = !isHindi;
    hindiButton.textContent = isHindi ? "View in English" : "हिंदी में देखें";
    fetchNews("India", isHindi ? "hi" : "en");
}

const viewNotesButton = document.getElementById("view-notes-button");

viewNotesButton.addEventListener("click", () => {
    viewNotes();
});

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme", themeToggle.checked);
});
