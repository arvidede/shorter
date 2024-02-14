function isValidUrl(maybeUrl) {
    try {
        return Boolean(new URL(maybeUrl).origin)
    } catch {
        return false
    }
}

window.onload = () => {
    const input = document.querySelector('#input')
    const copy = document.querySelector('.copy')
    let shortUrl

    let timer = null
    const debounce = (fn) => () => {
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
            fn()
            timer = null
        }, 1000)
    }

    const handleChange = () => {
        const url = input.value
        if (!url || !isValidUrl(url)) return
        if (!input.classList.contains('loading')) input.classList.add('loading')
        fetch('/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, stripQueryParams: true }),
        })
            .then((res) => res.text())
            .then((id) => {
                if (id) {
                    input.classList.remove('loading')
                    copy.classList.add('visible')
                    input.value = shortUrl = `${window.location.origin}/${id}`
                }
            })
            .catch(console.error)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl).then(
            () => {}, // TODO: confirmation
            (err) => {}
        )
    }

    input.addEventListener('input', debounce(handleChange))
    copy.addEventListener('click', handleCopy)
}
