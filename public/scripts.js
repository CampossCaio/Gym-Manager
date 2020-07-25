const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .links a");


for (item of menuItems) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}


const toggleSwitch = document.querySelector(".toggle-switch label input");

//Paginação
function paginate(selectedPage, totalPages) {
    // totalPages = 20
// selectedPage = 15
// [1,...,13, 14, 15, 16, 17, ..., 20]

    let pages = [],
    oldPage
    ;

    for(let currentPage = 1; currentPage <= totalPages; currentPage ++) {

    const firtAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if(firtAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage ) {

        if(oldPage & currentPage - oldPage > 2) {
        pages.push("...");
        }else if (oldPage & currentPage - oldPage == 2) {
            pages.push(oldPage + 1);
        }
        pages.push(currentPage);
        oldPage = currentPage;
    }

    }

    return pages;
}


function createPagination(pagination) {

    const page = +pagination.dataset.page; // O + transforma a string recebida em número
    const total = +pagination.dataset.total;
    const pages = paginate(page, total);
    const filter = pagination.dataset.filter;

    let elements = "";

    for(let page of pages ) {
        if(String(page).includes("...")){
            elements += `<span>${page}</span>`
        } else {
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else {
                elements += `<a href="?page=${page}">${page}</a>`
            }   
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if(pagination) {
    createPagination(pagination);
}















