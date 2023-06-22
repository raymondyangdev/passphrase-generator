window.addEventListener('load', function () {
    async function fetchRandomWord(): Promise<string> {
        const res = await fetch(
            'https://random-word-api.vercel.app/api?words=1&type=capitalized'
        );
        const randomWord: string[] = await res.json();

        return randomWord[0];
    }

    function generateRandomNumber(): number {
        return Math.floor(Math.random() * 10);
    }

    function generateSpecialCharacter(): string {
        const specialCharacters: string = '!@#$%^&*-_=+?';
        return specialCharacters.charAt(
            Math.floor(Math.random() * specialCharacters.length)
        );
    }
});
