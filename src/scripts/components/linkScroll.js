const links = document.querySelectorAll('a[href^="#"]')


export function initLinkScroll() {
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const id = link.getAttribute('href');
            const element = document.querySelector(id);

            if (element) {
                element.scrollIntoView({
                    block: 'center'
                });
            }
        });
    });
}