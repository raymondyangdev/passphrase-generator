window.addEventListener('load', function () {
    async function fetchRandomWord() {
        const res = await fetch(
            'https://random-word-api.vercel.app/api?words=1&type=capitalized'
        );
        const randomWord = await res.json();

        return randomWord[0];
    }
});
