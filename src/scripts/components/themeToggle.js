const themeStorageKey = 'theme'
const btnTheme = document.getElementById('themeToggle')
const icons = document.getElementsByClassName('theme-icons')
const iconActive = document.getElementsByClassName('active')

function getInitialTheme() {
    const savedTheme = localStorage.getItem(themeStorageKey)

    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
}

function applyTheme(theme) {
    const isLight = theme === 'light'

    document.documentElement.dataset.theme = theme

    btnTheme.classList.toggle('btn-dark', !isLight)

    if(iconActive[0]) iconActive[0].classList.toggle("active")

    if (isLight) icons[0].classList.toggle("active")
    if (!isLight)  icons[1].classList.toggle("active") 
    

}

export function initThemeToggle() {
    if (!btnTheme) return

    applyTheme(getInitialTheme())

    btnTheme.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light'
            ? 'dark'
            : 'light'

        localStorage.setItem(themeStorageKey, nextTheme)
        applyTheme(nextTheme)
    })
}

